;(function (__W, __D, $) {
    'use strict';

    var FP = window.LIFEPLAN || {};

    var defaultSettings = {
            selector: '#fullpage'
        },
        opts,
        fullpage = function () {


            var _letFP = {
                init: function () {

                    var _anchors = [];

                    $('.axa-page.section').each(function () {
                        if ($(this).attr('axa-fullpage-anchor')) {
                            _anchors.push($(this).attr('axa-fullpage-anchor'));
                        }
                    });

                    $(opts.selector).fullpage({
                        anchors: _anchors
                    });

                    $('[data-toggle="axa-fullpage-btn_section"]').on('click', function (event) {
                        event.preventDefault();
                        var $this = $(this),
                            _target = $this.attr('axa-fullpage-target');
                        $.fn.fullpage.moveTo((_target.charAt(0) === '#') ? _target.substring(1) : _target);
                        return false;
                    });

                }
            };

            return {
                ready: function () {
                    $.publish('fullpage:ready');
                },
                eventsListener: function () {
                    $.subscribe('fullpage:ready', function (e, data) {
                        _letFP.init();
                    });
                }
            };
        }


    $(__D).ready(function () {
        opts = $.extend(defaultSettings, FP.fullpage);

        FP.fp = {
            'fullpage': fullpage()
        };

        FP.fp.fullpage.eventsListener();
        FP.fp.fullpage.ready();
    });

})
(window, window.document, jQuery);