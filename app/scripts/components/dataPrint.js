(($, LIFEPLAN) => {

    'use strict';

    class DataPrint {

        constructor() {
            this.handlers = '[data-print]';
            this.handlersName = 'data-print';
            this.handlersType = 'data-print-type';
            this.eventsListener();
        }

        eventsListener() {
            $.subscribe('app:ready', () => this.render($('body')));
            $.subscribe('template:append', (event, $element) => this.render($($element)));
            $.subscribe('dataBinding:ready', () => this.render($('body')));
            $.subscribe('dataBinding:update', () => this.render($('body')));
            $.subscribe('quotation:calculation', () => this.render($('body')));
            $.subscribe('quotation:quote/done', () => this.render($('body')));
        }

        scope() {
            return _.assign({}, LIFEPLAN.storage.getState());
        }

        /**
         * Render element.
         */
        render($element) {

            let elements = $element.find(this.handlers);

            elements.each((index) => {

                let el = $(elements.get(index));
                const expression = el.attr(this.handlersName);
                const value = this.parse(expression);
                const elementType = el.prop('nodeName').toLocaleLowerCase();

                if (el.is('input')) {

                    if (value){
                        if (el.attr('type') === 'number'){

                            const formatted = +('' + value || '').replace(/ /gi, '');

                            if (isNaN(formatted)){
                                console.log(expression, value);

                            }
                            el.val(formatted);
                        } else {
                            el.val(value);
                        }
                    } else {
                        el.val('');
                    }

                } else {

                    if(elementType === 'select') {
                        el.val(value);
                    } else {
                        el.html(value);
                    }

                }
            });
        }

        /**
         * Parse expression
         * @param expression
         * @returns {*}
         */
        parse(expression) {
            //console.log('expression', expression, _.deepGet(this.scope(), expression));
            return _.deepGet(this.scope(), expression);
        }

    }

    LIFEPLAN.DataPrint = DataPrint;

})(jQuery, LIFEPLAN);
