var CORS_PROXY = "https://cors-anywhere.herokuapp.com/",
    RSS_URL = CORS_PROXY + 'https://getpocket.com/users/paulakfleck/feed/unread';

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

                    articlesList += '<li>' + title + ' | <a class="article-mode" href="https://pushtokindle.fivefilters.org/send.php?context=iframe&url=' + link + '">Link<a></li>';
                });
                articlesList += '</ul>';

                document.querySelector('main').insertAdjacentHTML('beforeend', articlesList);

            } catch (error) {
                alert(error);
            }
        },
        error: function (err) {
            // alert(err);
        }
    });

    $(document).on('click', '.article-mode', function (e) {
        e.preventDefault();
        try {
    
            $.ajax({
                url: 'https://cors-anywhere.herokuapp.com/' + $(this).attr('href'),
                type: 'GET',
                success: function(res) {
                    // then you can manipulate your text as you wish

                    res = res.replace('<link rel="stylesheet" href="css/ebook.css" type="text/css" />', '');

                    document.querySelector('body').classList.add('modal-opened');
                    document.getElementById('modal').insertAdjacentHTML('beforeend', res);
                }
            });
        } catch (error) {
            alert(error);
        }
    });

    $(document).on('click', '.btn-back', function(e) {
        e.preventDefault();
        document.querySelector('body').classList.remove('modal-opened');
        document.getElementById('modal').innerHTML = '';
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });

    $(document).on('click', '.btn-top', function(e) {
        e.preventDefault();
        try {
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
              });
            alert('top worked!');
        } catch (error) {
            alert(error);
        }
    });


});