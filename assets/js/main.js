(function($) {
    'use strict';
    let device_width = window.innerWidth;
    $.exists = function(selector) {
        return $(selector).length > 0;
    };


    var rtsJs = {
        m: function(e) {
            rtsJs.d();
            rtsJs.methods();
        },
        d: function(e) {
            this._window = $(window),
                this._document = $(document),
                this._body = $('body'),
                this._html = $('html')
        },
        methods: function(e) {
            rtsJs.backToTopInit();
            rtsJs.stickyHeader();
            rtsJs.gsapAnimationImageScale();
            rtsJs.sideMenu();
            rtsJs.mesonaryTab();
            rtsJs.feedbackCollupsShow();
        },

        backToTopInit: function() {
            $(document).ready(function() {
                "use strict";
                var progressPath = document.querySelector('.progress-wrap path');
                var pathLength = progressPath.getTotalLength();
                progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
                progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
                progressPath.style.strokeDashoffset = pathLength;
                progressPath.getBoundingClientRect();
                progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
                var updateProgress = function() {
                    var scroll = $(window).scrollTop();
                    var height = $(document).height() - $(window).height();
                    var progress = pathLength - (scroll * pathLength / height);
                    progressPath.style.strokeDashoffset = progress;
                }
                updateProgress();
                $(window).scroll(updateProgress);
                var offset = 50;
                var duration = 550;
                jQuery(window).on('scroll', function() {
                    if (jQuery(this).scrollTop() > offset) {
                        jQuery('.progress-wrap').addClass('active-progress');
                    } else {
                        jQuery('.progress-wrap').removeClass('active-progress');
                    }
                });
                jQuery('.progress-wrap').on('click', function(event) {
                    event.preventDefault();
                    jQuery('html, body').animate({
                        scrollTop: 0
                    }, duration);
                    return false;
                })

            });

        },
        // sticky header activation
        stickyHeader: function(e) {
            $(window).scroll(function() {
                if ($(this).scrollTop() > 150) {
                    $('.header--sticky').addClass('sticky')
                } else {
                    $('.header--sticky').removeClass('sticky')
                }
            })
        },

        gsapAnimationImageScale: function(e) {
            $(document).ready(function() {

                let growActive = document.getElementsByClassName('grow');
                if (growActive.length) {
                    const growTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: ".grow",
                            scrub: 1,
                            start: "top center",
                            end: "+=1000",
                            ease: "power1.out"
                        }
                    });
                    growTl.to(".grow", {
                        duration: 1,
                        scale: 1
                    });
                }

            });

        },
        // side menu desktop
        sideMenu: function() {
            $(document).on('click', '#menu-btn', function() {
                $("#side-bar").addClass("show");
                $("#anywhere-home").addClass("bgshow");
            });
            $(document).on('click', '.close-icon-menu', function() {
                $("#side-bar").removeClass("show");
                $("#anywhere-home").removeClass("bgshow");
            });
            $(document).on('click', '#anywhere-home', function() {
                $("#side-bar").removeClass("show");
                $("#anywhere-home").removeClass("bgshow");
            });
            $(document).on('click', '.onepage .mainmenu li a', function() {
                $("#side-bar").removeClass("show");
                $("#anywhere-home").removeClass("bgshow");
            });
        },

        // masonaryTab
        mesonaryTab: function() {
            $(window).on("load", function() {

                var isotope = $(".main-isotop");

                if (isotope.length) {
                    var iso = new Isotope('.filter', {
                        itemSelector: '.element-item',
                        layoutMode: 'fitRows',
                        fitRows: {
                            equalheight: true
                        }
                    });

                    // filter functions
                    var filterFns = {
                        // show if name ends with -ium
                        ium: function(itemElem) {
                            var name = itemElem.querySelector('.name').textContent;
                            return name.match(/ium$/);
                        }
                    };

                    // bind filter button click
                    var filtersElem = document.querySelector('.filters-button-group');
                    filtersElem.addEventListener('click', function(event) {
                        // only work with buttons
                        if (!matchesSelector(event.target, 'button')) {
                            return;
                        }
                        var filterValue = event.target.getAttribute('data-filter');
                        // use matching filter function
                        filterValue = filterFns[filterValue] || filterValue;
                        iso.arrange({
                            filter: filterValue
                        });
                    });

                    // change is-checked class on buttons
                    var buttonGroups = document.querySelectorAll('.button-group');
                    for (var i = 0, len = buttonGroups.length; i < len; i++) {
                        var buttonGroup = buttonGroups[i];
                        radioButtonGroup(buttonGroup);
                    }

                    function radioButtonGroup(buttonGroup) {
                        buttonGroup.addEventListener('click', function(event) {
                            // only work with buttons
                            if (!matchesSelector(event.target, 'button')) {
                                return;
                            }
                            buttonGroup.querySelector('.is-checked').classList.remove('is-checked');
                            event.target.classList.add('is-checked');
                        });
                    }
                }

                if ($('.grid-masonary').length) {

                    // image loaded portfolio init
                    $('.grid-masonary').imagesLoaded(function() {
                        $('.portfolio-filter').on('click', 'button', function() {
                            var filterValue = $(this).attr('data-filter');
                            $grid.isotope({
                                filter: filterValue
                            });
                        });
                        var $grid = $('.grid-masonary').isotope({
                            itemSelector: '.grid-item-p',
                            percentPosition: true,
                            masonry: {
                                columnWidth: '.grid-item-p',
                            }
                        });
                    });
                }

                // portfolio Filter
                $('.portfolio-filter button').on('click', function(event) {
                    $(this).siblings('.is-checked').removeClass('is-checked');
                    $(this).addClass('is-checked');
                    event.preventDefault();
                });

            });

        },

        feedbackCollupsShow: function() {

            // feedback button click show start
            document.addEventListener('DOMContentLoaded', function() {
                var rtsBtn = document.querySelector('.button-area-box-shadow .rts-btn');
                var overlaySection = document.querySelector('.overlay-bottom-section');
                var isToggled = false;

                if (rtsBtn && overlaySection) {
                    rtsBtn.addEventListener('click', function() {
                        if (!isToggled) {
                            // Change margin of .rts-btn
                            rtsBtn.style.margin = '0px auto 0 auto';
                            rtsBtn.innerHTML = 'View Less Reviews';
                            // Remove the overlay-bottom-section class
                            overlaySection.classList.remove('overlay-bottom-section');
                        } else {
                            // Revert margin of .rts-btn
                            rtsBtn.style.margin = '';
                            rtsBtn.innerHTML = 'View All Reviews';

                            // Add the overlay-bottom-section class back
                            overlaySection.classList.add('overlay-bottom-section');
                        }

                        // Toggle the state
                        isToggled = !isToggled;
                    });
                }
            });
        },

    }
    rtsJs.m();
    $(document).ready(function() {
        $('.accordion-item .accordion-header').click(function() {
            var accordionItem = $(this).parent();

            if (accordionItem.hasClass('active')) {
                accordionItem.removeClass('active');
                accordionItem.find('.accordion-content').slideUp(280);
            } else {
                $('.accordion-item').removeClass('active');
                $('.accordion-item .accordion-content').slideUp(280);
                accordionItem.addClass('active');
                accordionItem.find('.accordion-content').slideDown(280);
            }
        });
    });
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');

            if (targetId === '#') {
                // If the link is the document header, scroll to the top of the page
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                // For other links, scroll to the specified element
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    $(document).ready(function() {
        // Listen for the collapse show event
        $('.working-process-accordion-one .accordion-collapse').on('show.bs.collapse', function() {
            // Find the parent .accordion-item and add the 'show' class
            $(this).closest('.accordion-item').addClass('show');
        });

        // Listen for the collapse hide event
        $('.working-process-accordion-one .accordion-collapse').on('hide.bs.collapse', function() {
            // Find the parent .accordion-item and remove the 'show' class
            $(this).closest('.accordion-item').removeClass('show');
        });
    });
    $('.shape-move').mousemove(function(e) {

        var wx = $(window).width();
        var wy = $(window).height();

        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;

        var newx = x - wx / 2;
        var newy = y - wy / 2;

        $('.shape-image .shape').each(function() {
            var speed = $(this).attr('data-speed');
            if ($(this).attr('data-revert')) speed *= -1;
            TweenMax.to($(this), 1, {
                x: (1 - newx * speed),
                y: (1 - newy * speed)
            });

        });
    });
})(jQuery, window)