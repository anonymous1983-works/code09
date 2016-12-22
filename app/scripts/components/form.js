;(function (__W, __D, $) {
    'use strict';

    var FORM = window.LIFEPLAN || {};

    var defaultSettings = {
            selector: {
                form: '.axa-form',
                formGroup: '.form-group'
            },
            styleClass: {
                completed: 'completed',
                active: 'fadeInUp'
            }
        },
        opts,
        form = function () {


            var _letFORM = {
                checkFormGroup: function ($thisFormGroup) {

                    var _letCheck = true;
                    $thisFormGroup.find('input, select').each(function () {
                        var $this = $(this);
                        if (!$this.val()) {
                            _letCheck = false;
                        }

                    });

                    return _letCheck;
                },
                init: function () {
                    console.log('init form');


                    $(opts.selector.form).each(function () {

                        var $thisForm = $(this);


                        $thisForm.find(opts.selector.formGroup).each(function () {

                            var $thisFormGroup = $(this);

                            $thisFormGroup.find('input, select').on('blur change', function () {
                                var _letCheck = _letFORM.checkFormGroup($thisFormGroup);
                                if (_letCheck) {
                                    $thisFormGroup.addClass(opts.styleClass.completed);
                                    $thisFormGroup.next(opts.selector.formGroup).addClass(opts.styleClass.active);
                                }
                            });

                        });
                    });
                }
            };

            return {
                ready: function () {
                    $.publish('form:ready');
                },
                eventsListener: function () {
                    $.subscribe('form:ready', function (e, data) {
                        _letFORM.init();
                    });
                }
            };
        }


    $(__D).ready(function () {
        opts = $.extend(defaultSettings, FORM.form);

        FORM.form = {
            'form': form()
        };

        FORM.form.form.eventsListener();
        FORM.form.form.ready();
    });

})
(window, window.document, jQuery);