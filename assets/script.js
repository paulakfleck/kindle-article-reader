// kindle does not support const
var MERCURY = 'https://mercury.postlight.com/amp?url=',
    CORS = 'https://cors-anywhere.herokuapp.com/',
    currUrl = location.href,
    articlesList = '<ul>',
    rssLink,
    RSS_URL;

function getAndParseRss() {
    if (currUrl.indexOf('?rssLink=') > -1) {

        // Get link from URL
        rssLink = currUrl.split('?rssLink=');
        rssLink = decodeURIComponent(rssLink[1]);
        
        RSS_URL = CORS + rssLink;

        document.getElementById('rss-input').insertAdjacentHTML('beforeend', 'Loading...');

        $.ajax(RSS_URL, {
            accepts: {
                xml: 'application/rss+xml'
            },
            dataType: 'xml',
            success: function (data) {
                try {
                    document.getElementById('rss-input').style.display = 'none';

                    $(data).find('item').each(function () {
                        var el = $(this);
    
                        var title = el.find('title').text();
                        var link = el.find('link').text();
    
                        articlesList += '<li>' + title + ' | <a class="article-mode" href="' + link + '">Link<a></li>';
                    });
                    articlesList += '</ul>';
    
                    document.querySelector('main').insertAdjacentHTML('beforeend', articlesList);
    
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

function isDev() {
    if (currUrl.indexOf('isDev') > -1) {
        document.write(navigator.userAgent);
        return true;
    }
}

$(document).ready(function () {

    if (!isDev()) {
        getAndParseRss();
    }

    $(document).on('click', '.article-mode', function (e) {
        e.preventDefault();
        // try {
        var url = CORS + MERCURY + $(this).attr('href');

        document.querySelector('body').classList.add('modal-opened');
        document.getElementById('modal').insertAdjacentHTML('beforeend', 'Loading article...');

        e.preventDefault();
        try {
    
            $.ajax({
                url: url,
                type: 'GET',
                success: function(res) {

                    res = res.split('<main class="hg-article-container" role="main">');
                    res = res[1];

                    
                    if (res.indexOf('amp-img') > -1) {
                        res = res.replace(/amp-img/g, 'img');
                    }
                    
                    document.getElementById('modal').insertAdjacentHTML('beforeend', res);
                }
            });
        } catch (error) {
            // alert(error);
            console.error(error);
        }
    });
});