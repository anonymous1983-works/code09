(($, LIFEPLAN) => {

    'use strict';

    class PopupContact {

        constructor() {
            this.template = `
                <div class="axa-popup axa-popup_contact">
                    <div class="axa-popup-content">
                        <div data-include="templates/popups/contact.html"></div>
                        <div class="axa-popup-loader">
                            <div>
                                <loader-svg>
                                    <svg class="spinner" width="80px" height="80px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                                        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33"
                                                r="30"></circle>
                                    </svg>
                                </loader-svg>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        /**
         *
         */
        submit() {
            // const form = this.$element.find('.axa-popup-form');

            const settings = LIFEPLAN.constant('webServices.contact');
            const data = settings.requestMapper(LIFEPLAN.component('quotationService'));

            this.$element.find('.axa-popup-body').hide();
            this.$element.find('.axa-popup-loader').show();

            $.ajax({
                type: settings.type || 'POST',
                url: settings.url,
                dataType: settings.dataType || 'json',
                contentType: settings.contentType || 'application/json; charset=utf-8',
                data: JSON.stringify(data)
            })
                .done(() => {
                    setTimeout(() => {
                        this.$element.find('.axa-popup-loader').hide();
                        this.$element.find('.axa-popup-body').hide();
                        this.$element.find('.axa-popup-success').show();
                        this.$element.find('.axa-popup-error').hide();
                    }, 1500);
                })
                .fail(() => {
                    setTimeout(() => {
                        this.$element.find('.axa-popup-loader').hide();
                        this.$element.find('.axa-popup-body').hide();
                        this.$element.find('.axa-popup-success').hide();
                        this.$element.find('.axa-popup-error').show();
                    }, 1500);
                });

        }

        close(){
            return new Promise((resolve) => {
                this.$element.fadeOut(500, resolve).removeClass('active');
            })
                .then();

        }

        /**
         *
         * @returns {*}
         */
        open(){

            // console.log('open popup');

            if (this.$element === undefined){
                this.$element = $(this.template);
                $('body').append(this.$element);
            }

            this.$element.fadeIn(500).addClass('active');
            this.$element.find('.axa-popup-loader').show();
            this.$element.find('[data-include]').hide();

            return LIFEPLAN
                .component('dataInclude')
                .asyncRender(this.$element)
                .then(() => {

                    this.$element.find('.axa-popup-success').hide();
                    this.$element.find('.axa-popup-error').hide();



                    this.$element
                        .find('.btn-close')
                        .click((event) => {
                            event.preventDefault();
                            this.close();
                            return false;
                        });

                    this.$element
                        .find('.axa-popup-form .btn-submit')
                        .click((event) => {
                            event.preventDefault();
                            this.submit();
                            return false;
                        });

                    this.$element.find('.axa-popup-form input, .axa-popup-form textarea').val('');
                    this.$element.find('[data-include]').show();

                    this.$element.find('.axa-popup-loader').hide();

                    let content = this.$element.find('.axa-popup-content');

                    content.css('margin-top', '-' + (content.outerHeight() / 2) + 'px');

                });

        }
    }

    LIFEPLAN.PopupContact = PopupContact;

})(jQuery, LIFEPLAN);
