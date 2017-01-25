(($, LIFEPLAN) => {

    'use strict';

    class EstimeBar {

        constructor() {

            $.subscribe('quotation:calculation', () => {

                this.estimBarAnimation(LIFEPLAN.storage.getState());

            });

            $.subscribe('app:ready', () => {

                this.estimBarAnimation(LIFEPLAN.storage.getState());

            });
        }

        /**
         *
         */
        estimBarAnimation($context) {

            const {
                expense,
                income
            } = $context;

            const estimBar = $('.estimation-expense');
            const estimBarWidth = estimBar.outerWidth();

            if (expense && income.total !== 0) {

                _.each(expense, (expenseValue, key) => {

                    switch (key) {

                        case 'otherExpenses':

                            let otherTotal = 0;
                            expense[key].forEach(v => otherTotal = otherTotal + +v);

                            estimBar.find('.other').css({
                                width: this.getPercent(otherTotal, income.total) + '%'
                            });
                            break;

                        case 'otherExpense':
                        case 'total':

                            break;

                        default:
                            estimBar.find(`.${key}`).css({
                                width: this.getPercent(expenseValue, income.total) + '%'
                            });
                            break;
                    }

                });

                let position = this.getPositionIndicator(estimBarWidth, expense.total, income.total).px;

                if (position < 0) {
                    estimBar.find('.estimation-indicator').addClass('error');
                    estimBar.find('.estimation-indicator .ko').show();
                    estimBar.find('.estimation-indicator .ok').hide();
                    estimBar.find('.estims').hide();
                    $('#btn-go_to_simulation').hide();

                    position = 0;
                } else {
                    estimBar.find('.estimation-indicator').removeClass('error');
                    estimBar.find('.estimation-indicator .ko').hide();
                    estimBar.find('.estimation-indicator .ok').show();
                    estimBar.find('.estims').show();
                    $('#btn-go_to_simulation').show();
                }

                estimBar.find('.estimation-indicator').css({
                    right: (position / 2) + 'px'
                });

            }


        }

        getPercent(amount, incomeTotal) {
            if (incomeTotal === 0 || isNaN(amount)) {
                return 0;
            }

            return (amount * 100) / incomeTotal;
        }

        getPositionIndicator(estimBarWidth, amount, incomeTotal) {

            return {
                percent: (100 - this.getPercent(amount, incomeTotal)),
                px: ((estimBarWidth * (100 - this.getPercent(amount, incomeTotal))) / 100)
            };

        }
    }


    LIFEPLAN.EstimeBar = EstimeBar;

})(jQuery, LIFEPLAN);
