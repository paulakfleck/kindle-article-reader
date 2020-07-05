var CORS = "https://cors-anywhere.herokuapp.com/",
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

        $.ajax(RSS_URL, {
            accepts: {
                xml: "application/rss+xml"
            },
            dataType: "xml",
            success: function (data) {
                try {
                    document.getElementById('rss-input').style.display = 'none';

                    $(data).find("item").each(function () {
                        var el = $(this);
    
                        var title = el.find("title").text();
                        var link = el.find("link").text();
    
                        articlesList += '<li>' + title + ' | <a class="article-mode" href="' + link + '">Link<a></li>';
                    });
                    articlesList += '</ul>';
    
                    document.querySelector('main').insertAdjacentHTML('beforeend', articlesList);
    
                } catch (error) {
                    // Detect errors on Kindle, since there's no console there
                    alert(error);
                }
            },
            error: function (err) {
                // Detect errors on Kindle, since there's no console there
                alert('failed');
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
        var url = CORS + $(this).attr('href'),
            content = '';

        Mercury.parse(url).then(function (result) {
            if (result.error) {
                alert(result.message);

            } else {
                console.log(result);

                var imgSrc = result.lead_image_url,
                    title = result.title,
                    url = result.url,
                    content = result.content;

                if (imgSrc) {
                    imgSrc = imgSrc.split('.');
                    imgSrc = imgSrc[imgSrc.length - 1];

                    // If any image found in the article, do not place image at the top of the article.
                    if (result.content.indexOf(imgSrc) === -1) {
                        document.getElementById('article-img').src = result.lead_image_url;
                    }
                }

                if (title) {
                    document.getElementById('article-title').innerHTML = title;
                }

                if (url) {
                    document.getElementById('article-url').href = url.replace(CORS, '');
                }

                if (content) {
                    document.getElementById('article-content').innerHTML = content;
                }

                document.querySelector('body').classList.add('modal-opened');
            }
        });
    });
});