( (window, document, $, LIFEPLAN) => {
    'use strict';

    let opts;
    let defaultSettings = {
        selector: {
            fullpage: '#fullpage',
            resizeFullPage: '.full-page',
            navbar: '.axa-header_navbar',
            page: {
                home: {
                    index: '#page-home',
                    zoneB: '#home-zone-b'
                }
            }
        }
    };

    const path = (target) => {
        if (target) {
            $.fn.fullpage.moveTo((target.charAt(0) === '#') ? target.substring(1) : target);
        }

        return window.location.hash;
    };

    const fullpage = function () {


        const _letFP = {
            /**
             *
             */
            resize: function () {
                $(opts.selector.resizeFullPage).height($(window).height());
                $(window).resize(function () {
                    let _letHeight = $(this).height();
                    $(opts.selector.resizeFullPage).height(_letHeight);
                });
            },
            /**
             *
             */
            toggleBtnStart: function () {
                let _letPageHome = $(opts.selector.page.home.index),
                    _letTargetZoneB = $(opts.selector.page.home.zoneB),
                    toggle = function (scrollTop, offset) {
                        if (scrollTop > offset) {
                            $(opts.selector.navbar).addClass('active-start');
                        } else {
                            $(opts.selector.navbar).removeClass('active-start');
                        }
                    };

                // init if you back to home
                toggle(_letPageHome.scrollTop(), $(_letTargetZoneB).offset().top);

                // test if you scrolling
                _letPageHome.scroll(function () {
                    toggle(_letPageHome.scrollTop(), $(_letTargetZoneB).offset().top);
                });

            },

            /**
             *
             * @returns {{section: (*|HTMLElement), target}}
             */
            getCurrentSection: function () {
                return {
                    section: $('.section.active'),
                    target: $('.section.active').attr('data-anchor')
                };
            },

            /**
             *
             */
            setPageIndex(){
            },

            /**
             *
             */
            init: function () {

                console.log('init fullpage');
                let _anchors = [];

                _letFP.resize();

                // Get all page anchors
                $('.axa-page.section').each(function () {
                    if ($(this).attr('axa-fullpage-anchor')) {
                        _anchors.push($(this).attr('axa-fullpage-anchor'));
                    }
                });

                /**
                 *
                 * @param anchorLink
                 * @param index
                 */
                function afterLoad(anchorLink, index) {
                    let _letObg = {
                        anchorLink: anchorLink,
                        index: index
                    };

                    let mql = window.matchMedia('screen and (max-device-width: 1024px)').matches;

                    if(mql) {

                        if(_letObg.anchorLink === 'home') {
                            // enable scroll for ipad and less
                            $('.axa-page').not('#page-home').hide();
                            $.fn.fullpage.setResponsive(true);

                        }else {
                            $('.axa-page').not('#page-home').show();
                            $.fn.fullpage.setResponsive(false);
                        }
                    }

                    $.publish('fullpage:section:afterLoad', _letObg);
                    if (index === 1) {
                        $(opts.selector.navbar).removeClass('active');
                    } else {
                        $(opts.selector.navbar).removeClass('active-start');
                        $(opts.selector.navbar).addClass('active');
                    }

                }

                /**
                 *
                 * @param index
                 * @param nextIndex
                 * @param direction
                 */
                function onLeave(index, nextIndex, direction) {

                    const list = $('[axa-fullpage-anchor]')
                        .toArray()
                        .map($element => $($element).attr('axa-fullpage-anchor'));

                    $.publish('fullpage:viewChangeSuccess', {
                        next: {
                            index: nextIndex,
                            path: '#' + list[nextIndex - 1]
                        },
                        current: {
                            index,
                            path: '#' + list[index - 1]
                        },
                        direction: direction
                    });

                }

                // init fullpage plugin
                $(opts.selector.fullpage).fullpage({
                    anchors: _anchors,
                    keyboardScrolling: false,
                    controlArrows: false,
                    afterLoad,
                    onLeave
                });

                // disabled scrolling wheel
                $.fn.fullpage.setAllowScrolling(false);

                _letFP.toggleBtnStart();


                // Add event click to switch section page
                $('[data-toggle="axa-fullpage-btn_section"]').on('click', function (event) {
                    event.preventDefault();
                    const $this = $(this),
                        _target = $this.attr('axa-fullpage-target'),
                        _currentSection = LIFEPLAN.component('fullpage').getCurrentSection();

                    if (_target !== _currentSection.target) {
                        path(_target);
                    } else {
                        _currentSection.section.animate({
                            scrollTop: 0
                        }, 500);
                    }
                    return false;
                });

                // Add event click to go next content in home page
                $('.btn-next-zone').on('click', function (event) {
                    event.preventDefault();
                    let $this = $(this),
                        $parent = $this.parents('.axa-page'),
                        _target = $this.attr('axa-fullpage-target');

                    $parent.animate({
                        scrollTop: $(_target).offset().top
                    }, 500, function () {
                        //console.log("xxx")
                    });
                    //$.fn.fullpage.moveTo((_target.charAt(0) === '#') ? _target.substring(1) : _target);
                    return false;
                });

            }
        };

        return {

            ready: function () {
                $.publish('fullpage:ready');
            },

            eventsListener: function () {
                $.subscribe('fullpage:ready', () => {
                    _letFP.init();
                });

            },

            getCurrentSection: function () {
                return _letFP.getCurrentSection();
            }
        };
    };


    $(document).ready(function () {

        opts = defaultSettings;

        LIFEPLAN.component('path', path);
        LIFEPLAN.component('fullpage', fullpage());

        LIFEPLAN.component('fullpage').eventsListener();
        LIFEPLAN.component('fullpage').ready();

    });

})(window, window.document, jQuery, LIFEPLAN);
