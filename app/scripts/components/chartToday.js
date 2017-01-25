(($, LIFEPLAN) => {
    'use strict';

    const EXPENSE_CATEGORIES = LIFEPLAN.settings.EXPENSE_CATEGORIES;

    class ChartToday {

        constructor(){

            this.targetCSS = '.graph-chart.today .graph-body';

            $.subscribe('quotation:quote/done', () => this.render(LIFEPLAN.storage.getState()));
        }

        /**
         *
         */
        render($context) {

            //console.log('Rendering with context =>', $context);

            const ctx = document.createElement('canvas');
            const chartWrapper = $(this.targetCSS);

            chartWrapper.html('').append($(ctx));

            const data = {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    borderWidth: [],
                    hoverBackgroundColor: []
                }]
            };

            _.each(EXPENSE_CATEGORIES, (category, key) => {

                data.labels.push(category.label);
                const datasets = data.datasets[0];

                if (key === 'other') {
                    datasets.data.push(LIFEPLAN.component('quotationService').expense.getOtherExpenses());
                } else {
                    datasets.data.push($context.expense[key]);
                }

                datasets.backgroundColor.push(category.color);
                datasets.borderWidth.push(0);
                datasets.hoverBackgroundColor.push(category.color);

            });

            new Chart(ctx.getContext('2d'), {
                type: 'pie',
                data: data,
                options: LIFEPLAN.settings.chartOptions
            });

            // MANAGE LEGEND
            const legends = $('[data-chart-type]');

            legends.each((index) => {
                const $element = $(legends.get(index));
                const type = $element.data('chart-type');

                if (type === 'other') {
                    if (LIFEPLAN.component('quotationService').expense.getOtherExpenses()){
                        $element.show();
                    } else {
                        $element.hide();
                    }
                } else {

                    if (LIFEPLAN.component('quotationService').expense[type]){
                        $element.show();
                    } else {
                        $element.hide();
                    }
                }
            });
        }
    }

    LIFEPLAN.ChartToday = ChartToday;

})(jQuery, LIFEPLAN);
