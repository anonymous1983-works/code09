(function (__W, __D, $, LIFEPLAN) {
    'use strict';

    let defaultSettings = {
            selector: {
                page: '.axa-page',
                form: '.axa-form',
                formGroup: '.form-group',
                section: '.section',
                slide: '.slide',
                btnBack: '.btn-slide-back',
                btnNext: '.btn-form-next'
            },
            styleClass: {
                completed: 'completed',
                fadeInUp: 'fadeInUp',
                formChecked: 'form-checked',
                showBtnNext: 'show-next',
                showBtnBack: 'show-back',
                active: 'active'
            }
        },
        opts,
        form = function () {

            let _letFORM = {
                checkForm: function ($thisForm) {
                    let _letCheck = true;

                    $thisForm.find(opts.selector.formGroup).each(function () {
                        let $thisFormGroup = $(this);
                        if (!_letFORM.checkFormGroup($thisFormGroup)) {
                            _letCheck = false;
                        }
                    });

                    if(_letCheck) {
                        $thisForm.addClass(opts.styleClass.formChecked);
                    } else {
                        $thisForm.removeClass(opts.styleClass.formChecked);
                    }

                    return _letCheck;

                },
                checkFormGroup: function ($thisFormGroup) {

                    let _letCheck = true;
                    $thisFormGroup.find('input:visible, select:visible').each(function () {
                        let $this = $(this);
                        if (!$this.val()) {
                            _letCheck = false;
                        }

                    });

                    return _letCheck;
                },
                goToNextSlide: function ($this) {
                    let $parentPage = $this.parents(opts.selector.page),
                        $parentSlide = $this.parents(opts.selector.slide),
                        _letIndexCurrentSlide = $parentSlide.index();

                    // Go to next slide
                    $.fn.fullpage.moveSlideRight();
                    // Update global slideCurrentIndex
                    LIFEPLAN.component('form').slideCurrentIndex = parseInt(_letIndexCurrentSlide) + 1;
                    // Toggle Btn back
                    _letFORM.toggleBtnBack($parentPage);
                    // Publish event move to next slide
                    $.publish('form:next', {'slideIndex': LIFEPLAN.component('form').slideIndex});
                },
                goToPrevSlide: function ($parentPage) {
                    // Go to prev slide
                    $.fn.fullpage.moveSlideLeft();
                    // Update global slideCurrentIndex
                    LIFEPLAN.component('form').slideCurrentIndex--;
                    // Toggle Btn back
                    _letFORM.toggleBtnBack($parentPage);
                    // Publish event move to next slide
                    $.publish('form:prev', {'slideIndex': LIFEPLAN.component('form').slideIndex});
                },
                toggleBtnBack: function ($parentPage) {
                    if (LIFEPLAN.component('form').slideCurrentIndex) {
                        $parentPage.addClass(opts.styleClass.showBtnBack);
                    } else {
                        $parentPage.removeClass(opts.styleClass.showBtnBack);
                    }

                },
                /**
                 *
                 * @param event
                 * @param changeValue
                 */
                /*updateProfilePicture: function (event, changeValue) {
                    console.log(changeValue);

                    if(changeValue.binding === 'activities.hobby') {


                        $('#idProfileTitlePicture').find('.item').removeClass(opts.styleClass.active);
                        $('#idProfileTitlePicture')
                            .find('.item-' + changeValue.newValue)
                            .addClass(opts.styleClass.active);

                        $('#idRecapExpenseHobbyPicture').find('.item').removeClass(opts.styleClass.active);
                        $('#idRecapExpenseHobbyPicture')
                            .find('.item-' + changeValue.newValue)
                            .addClass(opts.styleClass.active);

                        //console.log($('#idRecapExpenseHobbyPicture').find('.item-' + data.data.id));

                    }
                },*/

                updateNumberOfChidren: function (data) {
                    let _letNumberOfChildren = parseInt($(data.data.id).val(), 10);
                    if (_letNumberOfChildren !== 0 && $.trim(_letNumberOfChildren) !== '') {
                        $(data.zone).addClass(opts.styleClass.active);
                        $(data.zone).find('.old').removeClass(opts.styleClass.active);
                        for (let i = 0; i < _letNumberOfChildren; i++) {
                            $(data.zone).find('.old:eq(' + i + ')').addClass(opts.styleClass.active);
                        }
                    } else {
                        $(data.zone).removeClass(opts.styleClass.active);
                    }
                },
                updateProfileMaritalStatus: function (data) {
                    if (parseInt(data.data.value, 10)) {
                        $(data.zone).addClass(opts.styleClass.active);
                    } else {
                        $(data.zone).removeClass(opts.styleClass.active);
                    }
                },
                init: function () {

                    let $parentPage = $(opts.selector.page);

                    $(opts.selector.form).each(function () {

                        let $thisForm = $(this);

                        // Add check form
                        $thisForm.find(opts.selector.formGroup).each(function () {

                            let $thisFormGroup = $(this);

                            function formHandler() {
                                let _letCheckFormGroup = _letFORM.checkFormGroup($thisFormGroup);

                                if (_letCheckFormGroup) {
                                    $thisFormGroup.addClass(opts.styleClass.completed);
                                    $thisFormGroup.next(opts.selector.formGroup).addClass(opts.styleClass.fadeInUp);
                                }

                                _letFORM.checkForm($thisForm);
                            }

                            $thisFormGroup.find('input, select').on('blur change', function () {
                                formHandler();
                            });

                            $thisFormGroup.find('input, select').on('keyup', function (e) {
                                var KEYCODE = 9;
                                if(e.keyCode === KEYCODE){
                                    formHandler();
                                }
                            });

                        });

                        // add btn action to move next slide
                        $thisForm.find(opts.selector.btnNext).click(function (event) {
                            event.preventDefault();
                            _letFORM.goToNextSlide($(this));
                        });
                    });

                    $parentPage.find(opts.selector.btnBack).on('click', function (event) {
                        event.preventDefault();
                        _letFORM.goToPrevSlide($parentPage);
                    });

                    $('[data-toggle="axa-dynamic_zone"]').each(function () {
                        let $this = $(this),
                            $thisForm = $this.parents(opts.selector.form);

                        $this.on('change blur keyup', function (event) {
                            event.preventDefault();

                            let data;

                            if ($this.is('select')) {
                                data = jQuery.parseJSON('[' + $this.find('option:selected').attr('axa-dynamic_zone') + ']');
                            } else {
                                data = jQuery.parseJSON('[' + $this.attr('axa-dynamic_zone') + ']');
                            }

                            $.publish(data[0].callback, data[0]);

                            _letFORM.checkForm($thisForm);

                        });
                    });


                    // Validator

                    jQuery.validator.setDefaults({
                        debug: true,
                        success: 'valid'
                    });

                }
            };

            return {
                slideCurrentIndex: 0,
                ready: () => {
                    $.publish('form:ready');
                },

                eventsListener: () => {

                    $.subscribe('form:ready', () => {
                        _letFORM.init();
                    });

                    // $.subscribe('dataBinding:update', (...args) => _letFORM.updateProfilePicture(...args));

                    $.subscribe('updateNumberOfChidren', (e, data) => {
                        _letFORM.updateNumberOfChidren(data);
                    });

                    $.subscribe('updateProfileMaritalStatus', (e, data) => {
                        _letFORM.updateProfileMaritalStatus(data);
                    });

                }

            };
        };


    $(__D).ready(function () {

        LIFEPLAN.component('form', form());

        opts = defaultSettings;
        //opts = $.extend(defaultSettings, LIFEPLAN.component('form'));

        LIFEPLAN.component('form').eventsListener();
        LIFEPLAN.component('form').ready();
    });

})(window, window.document, jQuery, LIFEPLAN);
