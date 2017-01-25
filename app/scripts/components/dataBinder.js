(($, LIFEPLAN) => {
    'use strict';

    class DataBinder {

        constructor() {
            this.handlers = '[data-binding]:not(.binded)';
            this.handlersName = 'data-binding';
            this.handlersType = 'data-binding-type';

            this.render($('body'));

            $.publish('dataBinding:ready');
            $.subscribe('template:append', (event, $element) => this.render($($element)));
        }


        /**
         *
         * @returns {*|void}
         */
        scope() {
            return _.assign({}, LIFEPLAN.storage.getState());
        }

        /**
         * Eval all
         * @param $element
         */
        render($element) {

            const elements = $element.find(this.handlers);

            elements.each((index) => this.bind($(elements[index])));

           // $.subscribe('dataBinding:update', () => this.onDataBindingUpdate());
        }

        /**
         * Bind the current element
         * @param $element
         */
        bind($element) {

            const binding = $element.attr(this.handlersName);
            const bindingType = $element.attr(this.handlersType);

            let sameBindingTypeElts;
            let isMultiple = false;

            if (bindingType !== undefined && bindingType === 'array') {
                isMultiple = true;
            }

            $element.off('change');

            $element.on('change', () => {
                sameBindingTypeElts = $('[' + this.handlersName + '=\"' + binding + '\"]');

                let newValue = $element.val();

                // if ($element.is('input')) {
                //     newValue = newValue.replace(' ', '');
                // }

                let valTemp = [];

                if (isMultiple) {
                    sameBindingTypeElts.each(function () {
                        if ($(this).val().length > 0) {
                            valTemp.push($(this).val());
                        }
                    });

                    newValue = valTemp;
                } else {
                    sameBindingTypeElts.val(newValue);
                }

                this.setViewValue(binding, newValue);

                $element.blur();
            });

            $element.addClass('binded');

        }

        /**
         *
         * @param binding
         * @param newValue
         */
        setViewValue(binding, newValue) {
            const scope = this.scope();
            const oldValue = _.deepGet(scope, binding);
            const newScope = _.deepSet(scope, binding, newValue);

            if (oldValue !== newValue){
                LIFEPLAN.storage.setState(newScope);

                //console.log('dataBinding:update', {binding, newValue, oldValue});

                $.publish('dataBinding:update', {binding, newValue, oldValue});
            }

        }
    }

    LIFEPLAN.DataBinder = DataBinder;

})(jQuery, LIFEPLAN);
