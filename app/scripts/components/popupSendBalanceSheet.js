(($, LIFEPLAN, Clipboard) => {

    'use strict';

    class PopupSendBalanceSheet {

        constructor() {
            this.template = `
                <div class="axa-popup axa-popup_send_balance_sheet">
                    <div class="axa-popup-content">
                        <div data-include="templates/popups/send-balance-sheet.html"></div>
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
            const form = this.$element.find('.axa-popup-form');

            this.validator = form.validate(
                {
                    messages: {
                        'send_balance_sheet_mail': {
                            required: LIFEPLAN.component('dataLoader').get('global.validator.msg_required'),
                            email: LIFEPLAN.component('dataLoader').get('global.validator.msg_email')
                        }
                    }
                }
            );

            if (this.validator.form()) {


                this.$element.find('.axa-popup-body').hide();
                this.$element.find('.axa-popup-loader').show();

                const settings = LIFEPLAN.constant('webServices.sendBalanceSheet');
                const data = settings.requestMapper(LIFEPLAN.component('quotationService'));

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
                            this.$element.find('.axa-popup-link-available').show();
                            this.$element.find('.axa-popup-error').hide();
                        }, 1500);
                    })
                    .fail(() => {
                        setTimeout(() => {
                            this.$element.find('.axa-popup-loader').hide();
                            this.$element.find('.axa-popup-body').hide();
                            this.$element.find('.axa-popup-success').hide();
                            this.$element.find('.axa-popup-error').show();
                            this.$element.find('.axa-popup-link-available').show();
                        }, 1500);
                    });


            }

        }

        /**
         *
         * @returns {Promise.<TResult>}
         */
        close() {

            if(this.validator){
                this.validator.resetForm();
            }

            return new Promise((resolve) => {
                this.$element.fadeOut(500, resolve).removeClass('active');
            })
                .then();

        }

        /**
         *
         * @returns {*}
         */
        open() {

            if (this.$element === undefined){
                this.$element = $(this.template);
                $('body').append(this.$element);
            }

            this.$element.fadeIn(500).addClass('active');
            this.$element.find('.axa-popup-loader').show();
            this.$element.find('[data-include]').hide();

            new Clipboard('.axa-popup .btn-copy-clipboard');

            const link = LIFEPLAN.storage.toUrl();


            return LIFEPLAN
                .component('dataInclude')
                .asyncRender(this.$element)
                .then(() => {

                    this.$element.find('.axa-popup-success').hide();
                    this.$element.find('.axa-popup-error').hide();
                    this.$element.find('.axa-popup-link-available').hide();

                    this.$element.find('.quotation-link').val(link);

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

                    //this.$element.find('.axa-popup-form input, .axa-popup-form textarea').val('');
                    this.$element.find('[data-include]').show();

                    this.$element.find('.axa-popup-loader').hide();

                    let content = this.$element.find('.axa-popup-content');

                    content.css('margin-top', '-' + (content.outerHeight() / 2) + 'px');

                });

        }
    }

    LIFEPLAN.PopupSendBalanceSheet = PopupSendBalanceSheet;

})(jQuery, LIFEPLAN, Clipboard);
