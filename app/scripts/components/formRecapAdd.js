(($, LIFEPLAN) => {

    'use strict';

    class FormRecapAdd {

        constructor(){
            this.selector = {
                form: '.js-form-binding.form',
                row: '.recap-form_row',
                btnAdd: '.btn-add',
                headerTotal: '.recap-header-total',
                account: '.account'
            };

            this.styleClass = {
                active: 'active'
            };

            this.elements = $(this.selector.form);

            this.elements.each(index => {

                let $form = $(this.elements.get(index));

                const onClick = (...args) => this.onClick(...args );

                $form
                    .find(this.selector.btnAdd)
                    .on('click', function(){
                        onClick($form, $(this));
                    });

            });

           $.subscribe('app:ready', () => {

                LIFEPLAN.component('quotationService').income.otherIncoming.forEach((v, index) => {

                    if (v && index) {
                        const $form = $(this.elements.get(0));
                        this.onClick($form, $form.find(this.selector.btnAdd));
                    }
                });

                LIFEPLAN.component('quotationService').expense.otherExpenses.forEach((v) => {

                    if (v) {
                        const $form = $(this.elements.get(1));
                        this.onClick($form, $form.find(this.selector.btnAdd));
                    }
                });

            });

            $.subscribe('app:ready', () => {
                this.showAll();
            });

            $.subscribe('dataBinding:update', () => {
                this.showAll();
            });
        }

        /**
         *
         */
        showAll(){
            const list = LIFEPLAN.component('quotationService').expense.otherExpenses;

            if (list.length) {
                list.forEach((v, index) => {
                    if (v) {
                        const $form = $(this.elements.get(1));
                        //console.trace('test', $form);
                        $($form.find('.recap-form_row.other').get(index)).show();
                    }
                });
            }
        }
        /**
         *
         */
        onClick($form, $element) {

            // Find last .recap-form_row visible
            const $lastRow = $form.find(this.selector.row + ':visible:last');
                // Select next recap-form_row
            const $nextRow = $lastRow.next(this.selector.row);

            if ($nextRow.length) {
                $nextRow.addClass(this.styleClass.active);

                if (!$nextRow.next(this.selector.row).length) {
                    $element.hide();
                }

            }
        }

    }

    LIFEPLAN.FormRecapAdd = FormRecapAdd;

})(jQuery, LIFEPLAN);
