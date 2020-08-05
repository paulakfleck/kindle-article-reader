// kindle does not support const
var MERCURY = 'https://mercury.postlight.com/amp?url=',
    CORS = 'https://cors-anywhere.herokuapp.com/',
    articlesList = '<ul>',
    rssLink,
    RSS_URL;

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
            accepts: {xml: 'application/rss+xml'},
            dataType: 'xml',
            success: function (data) {
                try {
                    $rssInput.style.display = 'none';

                    $(data).find('item').each(function (index) {
                        var $item = $(this),
                        title = $item.find('title').text(),
                        link = $item.find('link').text();

                        articlesList += '<li>' + title + ' | <a id="article-id-'+ index +'" href="#article-id-'+ index +'" class="article-mode" mercury-url="' + link + '">Link<a></li>';
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

    var $body = document.querySelector('body'),
        $modal = document.getElementById('modal');

        createModal($modal);

    if (isParameter('article-id-')) {
        console.warn('loading article...');

        var $article = document.getElementById(getArticleId()),
            url = CORS + MERCURY + $article.getAttribute('mercury-url');

        // Clean modal before loading new article
        // window.scrollTo(0,0);
        // window.scrollTo({ top: 0});
        // ! https://zengabor.github.io/zenscroll/
        $(window).scrollTop(0);

        $modal.innerHTML = "";
        $body.classList.add('modal-opened');
        $modal.insertAdjacentHTML('beforeend', 'Loading article...');

        // try {
        //     // Call new article URL
        //     $.ajax({
        //         url: url,
        //         type: 'GET',
        //         success: function(res) {

        //             $modal.innerHTML = "";

        //             res = res.split('<main class="hg-article-container" role="main">');
        //             res = res[1];

        //             // Fix <amp-img> to <img>
        //             if (res.indexOf('amp-img') > -1) {
        //                 res = res.replace(/amp-img/g, 'img');
        //             }
                    
        //             $modal.insertAdjacentHTML('beforeend', res);
        //         }
        //     });
        // } catch (error) {
        //     console.error(error);
        // }

    } else {
        // hide modal box
        console.warn('no article to be shown, hiding modal...');

        $modal.innerHTML = "";
        $body.classList.remove('modal-opened');
    }
}

function createModal($modal) {
    var $controls = document.getElementById('article-controls');

    $modal.style.height = window.innerHeight - 30;
}

$(document).ready(function () {
    if (!isDev()) {
        getAndParseRss();
    }
});

window.onhashchange = function() { 
    console.info('onhashchange event');
    
    loadArticle();
}