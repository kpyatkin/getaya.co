$(document).ready(function() {

    $.fn.disableScroll = function() {
        window.oldScrollPos = $(window).scrollTop();
    
        $(window).on('scroll.scrolldisabler',function ( event ) {
           $(window).scrollTop( window.oldScrollPos );
           event.preventDefault();
        });
    };

    $.fn.enableScroll = function() {
        $(window).off('scroll.scrolldisabler');
    };

    function getMonth(month) {
        var month = month.replace(/^0+/, '')-1; // вырезаем нули в начале числа и учитываем zero based numeration
        var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        if (1 >= month <= 12) {
            return monthNames[month];
        } else {
            return false;
        }
    }

    function getCurrencyIco(currency) {
        switch (currency) {
           case 'USD':
             return '$';
             break;
           case 'CAD':
             return '$'
             break;
           case 'RUB':
             return '₽';
             break;
           case 'EUR':
             return '€';
             break;
           default:
             return false;
        }
    }


    var animateNum = function() {
        var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
        $('.js-num').prop('number', 8000000).animateNumber({
            number: 8424799,
            numberStep: comma_separator_number_step
        }, 1500);
    };

    $('.header-container.modal .header-inner-container .row-1 .col').append($('.remodal-close'));

    // генерация списка релизов

    try {
        (function() {
            var domOutputElement = '.js-output-release';
            var githubUrl = 'https://github.com/7room/Aya/issues/'
            var template = '';

            $.ajax({
                url: '../changelog.json',
                dataType: 'json',
                success: function(data) {
                    generateTemplate(data);
                }
            });

            function generateTemplate(json) {

                json.forEach(function(val) {
                    
                    template += `<div class="item">

                                    <div class="col-1">
                                       <div class="version-info">${val.version}</div>
                                    </div>

                                    <div class="col-2">
                                        <p class="version-title">
                                            ${getMonth(val.date.substring(5, 7))} ${val.date.substring(8,10)} ${val.date.substring(0,4)}
                                        </p>`;

                                         val.changes.forEach(function(val) {
                                             template += `<div class="row">
                                                          <div class="version-col">`;
                     
                                             val.tags.forEach(function(val) {
                                                 template += `<div class="version-btn ${val}">${val}</div>`;
                                             });
                     
                                             template += `</div>
                                                          <p class="version-desc">
                                                            ${val.title}`;
                     
                                                            val.issues.forEach(function(val) {
                                                                template += `<a href="${githubUrl + val}"> #${val} </a>`;
                                                            });
                     
                                             template += `</p>
                                                          </div>`;
                                         });

                    template += `</div>
                                 </div>`;

                    try {
                        document.querySelector(domOutputElement).innerHTML = template;
                    } catch (e) {

                    }

                });
            }

        })();
    } catch (e) {}


    // генерация списка переводов


     try {
        (function() {
            var domOutputElement = '.js-donation-history-items';
            var template = '';


            $.ajax({
                url: '../donations.json',
                dataType: 'json',
                success: function(data) {
                    generateTemplate(data);
                    $(domOutputElement).fadeIn(1000);

                    setTimeout(function() {
                    	try {
                            new SimpleBar($(domOutputElement)[0], {
                                autoHide: false
                            })
                        } catch (e) {}
                    },1000);
                }
            });

            function generateTemplate(json) {

                json.forEach(function(val) {

                    template += `<div class="item">
                        <div class="row date">
                            <p>${getMonth(val.date.substring(5, 7))} ${val.date.substring(8,10)} ${val.date.substring(0,4)}</p>
                        </div>

                        <div class="col user">
                            <div class="row justify">
                                <p class="name">${val.name}</p>
                                <p class="price">${getCurrencyIco(val.currency)}${val.amount}</p>
                            </div>
                            <div class="row">
                                <p class="comment">
                                    ${val.comment}
                                </p>
                            </div>
                        </div>

                    </div>`;

                    try {
                        document.querySelector(domOutputElement).innerHTML = template;
                    } catch (e) {

                    }

                });
            }

        })();
    } catch (e) {}


    (function() {

        // подсвечиваем пункт меню, если перешли с хэшем в ссылке

        function hashParse() {
          $('a[href^="' + window.location.hash + '"]').addClass('active')
        }

        // если пользователь пришел с хэшем в ссылке, то подсветим нужный пункт меню

        setTimeout(hashParse,50);

        // удаляем класс .active на всех элементах, чтобы не получить несколько подсвеченных

        function removeActiveClass() {
          $('.js-typography-output a').removeClass('active');
        }

        // вешаем айдишники составленные из названий элементов.

        $('.js-typography-input h2').each(function(i, elem) {
            $(elem).attr('id', $(elem).text().replace(/\s+/g, '').replace(/[^A-Za-zА]/g, "").toLowerCase());
        });

        /*клоним элементы в меню справа и удаляем их id, т.к два одинаковых id
          на странице по стандарту быть не может.*/


        $('.js-typography-input h2').each(function(i, elem) {
            var elem = $(elem);
            elem.clone().appendTo('.js-typography-output').wrap('<a href="#' + elem.attr('id') + '"></a>').removeAttr('id');
        });


        $('.js-typography-output a').on('click', function() {
          removeActiveClass();
          $(this).addClass('active');
        });


        $(window).on('hashchange',function() {
          removeActiveClass();
          hashParse();
        });


        // подсветка элементов при прокрутке


        var lastId;
        var menuItems =$(".js-typography-output a");

        scrollItems = menuItems.map(function(){
          var item = $($(this).attr("href"));
          if (item.length) { return item; }
        });


        $(window).scroll(function(){
           var fromTop = $(this).scrollTop() + 100;
           
           var cur = scrollItems.map(function(){
             if ($(this).offset().top < fromTop)
               return this;
           });
        
           cur = cur[cur.length-1];
           var id = cur && cur.length ? cur[0].id : "";
           
           if (lastId !== id) {
               lastId = id;
        
               menuItems.removeClass('active');
               menuItems.filter("[href='#"+id+"']").addClass("active");
           }                   
        });


    })();


    // плавная прокрутка к якорям


    (function() {
        var linkNav = document.querySelectorAll('[href^="#"]'),
            V = 0.2;
        for (var i = 0; i < linkNav.length; i++) {
            linkNav[i].addEventListener('click', function(e) {
                e.preventDefault(); 
                var w = window.pageYOffset, 
                    hash = this.href.replace(/[^#]*(.*)/, '$1'); 
                t = document.querySelector(hash).getBoundingClientRect().top, 
                    start = null;
                requestAnimationFrame(step); 
                function step(time) {
                    if (start === null) start = time;
                    var progress = time - start,
                        r = (t < 0 ? Math.max(w - progress / V, w + t) : Math.min(w + progress / V, w + t));
                    window.scrollTo(0, r);
                    if (r != w + t) {
                        requestAnimationFrame(step)
                    } else {
                        location.hash = hash;
                    }
                }
            }, false);
        }
    })();

    var tips = {
        bug: {
            title: `I’ve found a bug. How can I report it?`,
            desc: `<ol>
                    <li>Please provide as much information as possible, every detail counts.</li>
                    <li>If possible, upload your document to a service like Dropbox and provide the link in your summary. This will help us track down your bug and provide a fix.</li>
                    <li>Any additional information you can give us like <a href="/support/troubleshooting/providing-feedback" target="_blank">screencasts, crash logs, etc…</a> is greatly appreciated.</li>
                    <li>It may be worth checking to see if your bug is related to third-party plugins. Please ensure all your plugins are up to date, and let us know if the issue persists.</li>
                   </ol>
                   In the interest of discretion, all information shared with us is 100% confidential, and any shared files will be destroyed after use.`
        },
        education: {
            title: ``,
            desc: ``
        },
        licensing: {
            title: `Trouble with your license?`,
            desc: `You should have received an email with your license key. If you can’t find this email, please access our License Manager.
                   There you can You can check your invoice and active devices, unlink devices or extend your license key with multiple seats.
                   If you are having any other issues regarding licenses, please provide as much information as possible, every detail counts.`
        },
        feature: {
            title: `Want to request a feature?`,
            desc: `We love hearing your requests, and you can help shape the future of Sketch!
                   <ol>
                     <li>Please provide as much information as possible, every detail counts.</li>
                     <li>Feel free to attach links to any drawings, wireframes, or Sketch files that will help illustrate your request.</li>
                   </ol>`
        },
        other: {
            title: `Need to get in touch?`,
            desc: `If you wish to get in touch with us regarding anything else, then please feel free to do so. We’re looking forward to hearing from you!`
        }
    };

    function getTip() {

        try {
            var dataObj = tips[$( ".js-select-topic" ).val()];
    
            $('.js-tips-title').html(dataObj.title);
            $('.js-tips-desc').html(dataObj.desc);
        } catch(e) {
            
        }
    }

    getTip();

    $( ".js-select-topic" ).change(function(e) {
        getTip();
    });

    /*rellax.js init*/

    (function () {
        var rellax;

        if (document.body.clientWidth > 1280) {
            rellax = new Rellax('.js-rellax');
        } else {
            rellax.destroy();
        }

        $( window ).resize(function() {
            if (document.body.clientWidth > 1280) {
                rellax = new Rellax('.js-rellax');
            } else {
                rellax.destroy();
            }
        });
    })();




    


});