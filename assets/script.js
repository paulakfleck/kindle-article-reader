// Warn - kindle browser does not support const or any other modern ECMAScript
var MERCURY = 'https://mercury.postlight.com/amp?url=',
    CORS = 'https://cors-anywhere.herokuapp.com/',
    articlesList = '<ul>',
    rssLink,
    RSS_URL;

var $modal = document.getElementById('modal');

var defaultDuration = 500,
    edgeOffset = 30
myScroller = zenscroll.createScroller($modal, defaultDuration, edgeOffset),
    x = 0;

function scrollDown() {
    x = x + window.innerHeight - 150;

    myScroller.toY(x);
}

function scrollUp() {
    x = x - window.innerHeight + 150;

    if (x <= 0) {
        x = 0;
    }

    myScroller.toY(x);
}

function goTop() {
    x = 0;

    myScroller.toY(x);
}

function getAndParseRss() {
    var $rssInput = document.getElementById('rss-input'),
        $main = document.querySelector('main'),
        currUrl = location.href;

    if (currUrl.indexOf('?rssLink=') > -1) {

        // Get link from URL
        rssLink = currUrl.split('?rssLink=');
        rssLink = rssLink[1];
        rssLink = rssLink.split('#');
        rssLink = decodeURIComponent(rssLink[0]);

        RSS_URL = CORS + rssLink;

        $rssInput.insertAdjacentHTML('beforeend', 'Loading...');

        $.ajax(RSS_URL, {
            accepts: { xml: 'application/rss+xml' },
            dataType: 'xml',
            success: function (data) {
                try {
                    $rssInput.style.display = 'none';

                    $(data).find('item').each(function (index) {
                        var $item = $(this),
                            title = $item.find('title').text(),
                            link = $item.find('link').text();

                        articlesList += '<li>' + title + ' | <a id="id-article-id-' + index + '" href="#article-id-' + index + '" class="article-mode" mercury-url="' + link + '">Link<a></li>';
                    });

                    articlesList += '</ul>';

                    $main.insertAdjacentHTML('beforeend', articlesList);

                    loadArticle();

                } catch (error) {
                    console.error(error);
                    // Detect errors on Kindle, since there's no console there
                    // alert(error);
                }
            },
            error: function (error) {
                console.error(error);
                // Detect errors on Kindle, since there's no console there
                // alert('failed');
            }
        });
    }

}

// Show userAgent from browser
function isDev() {
    var currUrl = location.href;

    if (currUrl.indexOf('isDev') > -1) {
        document.write(navigator.userAgent);
        return true;
    }
}

function isParameter(param) {
    var currUrl = location.href;

    console.log('is param?', currUrl.indexOf(param) > -1 ? true : false);
    return currUrl.indexOf(param) > -1 ? true : false;
}

function getArticleId() {
    var currUrl = location.href;

    // Get link from URL
    articleId = currUrl.split('#');
    return articleId[1];
}

function loadArticle() {
    console.log('loadArticle');
    var $body = document.querySelector('body');
    var $html = document.querySelector('html');
    var $content = document.querySelector('#content');
    
    $body.classList.add('loading');
    $body.classList.add('overflow');
    $html.classList.add('overflow');

    var contentScroll = zenscroll.createScroller($content, defaultDuration, edgeOffset);
    contentScroll.toY(0);

    setTimeout(function () {

        createModal($modal);

        if (isParameter('article-id-')) {
            console.warn('loading article...');

            var $article = document.getElementById('id-' + getArticleId()),
                url = CORS + MERCURY + $article.getAttribute('mercury-url');

            // Clean modal before loading new article
            $modal.innerHTML = "";
            $body.classList.add('modal-opened');
            $body.classList.remove('loading');
            $body.classList.remove('overflow');
            $html.classList.remove('overflow');
            $modal.insertAdjacentHTML('beforeend', 'Loading article...');

            try {
                // Call new article URL
                $.ajax({
                    url: url,
                    type: 'GET',
                    success: function (res) {

                        $modal.innerHTML = "";

                        res = res.split('<main class="hg-article-container" role="main">');
                        res = res[1];

                        // Fix <amp-img> to <img>
                        if (res.indexOf('amp-img') > -1) {
                            res = res.replace(/amp-img/g, 'img');
                        }

                        $modal.insertAdjacentHTML('beforeend', res);
                    }
                });
            } catch (error) {
                alert(error);
            }

        } else {
            // hide modal box
            console.warn('no article to be shown, hiding modal...');

            $modal.innerHTML = "";
            $body.classList.remove('modal-opened');
            $body.classList.remove('overflow');
            $html.classList.remove('overflow');
            $body.classList.remove('loading');
        }

        console.log('settimeout ended');
    }, 5000);
}

function createModal($modal) {
    $modal.style.height = window.innerHeight - 45;
}

$(document).ready(function () {
    if (!isDev()) {
        getAndParseRss();
    }

    $('#scroll-up').on('click', function () {
        scrollUp();
    });

    $('#scroll-down').on('click', function () {
        scrollDown();
    });

    $('#go-top').on('click', function () {
        goTop();
    });
});

window.onhashchange = function () {
    console.info('onhashchange event');

    loadArticle();
}