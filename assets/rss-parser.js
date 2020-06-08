var CORS = "https://cors-anywhere.herokuapp.com/",
    RSS_URL = CORS + 'https://getpocket.com/users/paulakfleck/feed/unread';

var articlesList = '<ul>';

$(document).ready(function () {
    //feed to parse
    var feed = RSS_URL;
    $.ajax(feed, {
        accepts: {
            xml: "application/rss+xml"
        },
        dataType: "xml",
        success: function (data) {
            try {
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
            alert(err);
        }
    });

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
        // } catch (error) {
        //     // Detect errors on Kindle, since there's no console there
        //     alert(error);
        // }
    });

    // $(document).on('click', '.btn-back', function(e) {
    //     e.preventDefault();
    //     document.querySelector('body').classList.remove('modal-opened');
    //     document.getElementById('modal').innerHTML = '';
    //     document.body.scrollTop = 0; // For Safari
    //     document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    // });

    // $(document).on('click', '.btn-top', function(e) {
    //     e.preventDefault();
    //     try {
    //         window.scroll({
    //             top: 0,
    //             left: 0,
    //             behavior: 'smooth'
    //           });
    //         alert('top worked!');
    //     } catch (error) {
    //         alert(error);
    //     }
    // });


});