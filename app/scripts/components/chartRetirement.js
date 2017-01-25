(($, LIFEPLAN) => {

    'use strict';

    const EXPENSE_CATEGORIES = LIFEPLAN.settings.EXPENSE_CATEGORIES;

    class ChartRetirement {

        constructor() {

            this.targetCSS = '.graph-chart.retirement .graph-body';

            $.subscribe('quotation:quote/done', () => this.render(LIFEPLAN.storage.getState()));
        }

        /**
         *
         */
        render($context) {

            //console.log('Rendering with context =>', $context);

            this.ctx = document.createElement('canvas');

            const chartWrapper = $(this.targetCSS);

            chartWrapper.html('').append($(this.ctx));

            const data = {
                labels: [],
                idLabels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    borderWidth: [],
                    hoverBackgroundColor: []
                }]
            };

            _.each(EXPENSE_CATEGORIES, (category, key) => {

                data.labels.push(category.label);
                data.idLabels.push(key);

                const datasets = data.datasets[0];

                if (key === 'other') {
                    datasets.data.push(LIFEPLAN.component('quotationService').expense.getOtherExpenses());
                } else {
                    datasets.data.push(this.applyRule(category, $context.expense[key]));
                }

                // datasets.data.push(this.applyRule(category, $context.expense[key]));
                datasets.backgroundColor.push(category.color);
                datasets.borderWidth.push(0);
                datasets.hoverBackgroundColor.push(category.color);

            });

            const chart = new Chart(this.ctx.getContext('2d'), {
                type: 'pie',
                data: data,
                options: _.assign({
                    tooltips: {
                        enabled: false,
                        custom: (tooltip) => this.openTooltip(data, tooltip, chart)

                    }
                }, LIFEPLAN.constant('chartOptions'))
            });

        }

        /**
         *
         * @param data
         * @param tooltip
         * @param chart
         */
        openTooltip (data, tooltip) {
            // tooltip will be false if tooltip is not visible or should be hidden
            if (!tooltip) {
                return;
            }

            const Popin = LIFEPLAN.component('Popin');

            if (tooltip.dataPoints) {

                if (tooltip.caretY !== this._caretY || tooltip.caretX !== this._caretX) {

                    const dataPoint = tooltip.dataPoints[0];
                    const id = data.idLabels[dataPoint.index];
                    const pathTitle = 'pages.results.chart.popup.' + id + '.title';
                    const pathTheme = 'pages.results.chart.popup.' + id + '.theme';
                    const pathText = 'pages.results.chart.popup.' + id + '.text';
                    const pathIcon = 'pages.results.chart.popup.' + id + '.icon';

                    const popin = new Popin({
                        appendTo: $(this.ctx).parents('.graph-body'),
                        arrowPosition: 'bottomArrow',
                        otherClass: [
                            LIFEPLAN.component('dictionnary').get(pathTheme)
                        ],
                        title: LIFEPLAN.component('dictionnary').get(pathTitle),
                        imgUrl: LIFEPLAN.component('dictionnary').get(pathIcon),
                        imgAlt: '',
                        imgTitle: '',
                        htmlText: LIFEPLAN.component('dictionnary').get(pathText),
                        offsetLeft: 0,
                        offsetTop: 0,
                        bottom: true
                    });

                    let p = popin.open(0, 0);

                    this._caretY = tooltip.caretY;
                    this._caretX = tooltip.caretX;

                    p.css('opacity', 0);

                    setTimeout(() => {
                        p.css('opacity', 1);
                        p.css({
                            top: (tooltip.caretY - p.height() - 22) + 'px',
                            left: (tooltip.caretX - (p.width() / 2)) + 'px'
                        });
                    }, 100);

                }


            }

        }

        applyRule(category, value) {
            return +value + +category.retirementRate * +value;
        }

    }

    LIFEPLAN.ChartRetirement = ChartRetirement;

})(jQuery, LIFEPLAN);
