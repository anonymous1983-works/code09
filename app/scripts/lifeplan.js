((global) => {

    'use strict';

    class LifePlan {

        constructor() {
            this.settings = {};
        }

        /**
         * Add a constant.
         * @param key
         * @param value
         */
        constant(key, value) {

            if (value !== undefined){
                _.deepSet(this.settings, key, value);
                return this;
            }

            return _.deepGet(this.settings, key);
        }

        /**
         *
         * @param key
         * @param value
         * @returns {LifePlan}
         */
        component(key, value) {

            if (value){
                if (key === 'component' || key === 'constant' || key === 'settings') {
                    console.warn(key, 'not to be added to components registry');
                    return this;
                }

                this[key] = value;
                return this;
            }

            return this[key];
        }


        onReady(){

        }
    }

    global.LIFEPLAN = new LifePlan();

    /**
     * Utils
     * @param char
     * @returns {string}
     */
    Number.prototype.toCurrency = function(char = ''){
        return this.toFixed(0).replace('.', ',').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1 ') + char;
    };
    /**
     * Utils
     */
    global.LIFEPLAN.component('renderPopinChart', function () {
        //console.log(this, this.getDatasetMeta(0), args);

        const meta = this.getDatasetMeta(0);
        const ctx = this.chart.ctx;
        const radius = this.outerRadius;

        meta.data.forEach((data) => {

            ctx.fillStyle = 'white';
            ctx.font = '18px ITC Franklin Gothic Hvy';

            // Get needed variables
            let value = this.data.datasets[0].data[data._index];

            if (value) {
                value = (+value).toCurrency(' €');

                const startAngle = data._model.startAngle;
                const endAngle = data._model.endAngle;
                const middleAngle = startAngle + ((endAngle - startAngle) / 2);

                // Compute text location
                const posX = (radius * 1.3) * Math.cos(middleAngle) + (this.chart.width / 2);
                const posY = (radius * 1.3) * Math.sin(middleAngle) + (this.chart.height / 2);

                // Text offside by middle
                const wOffset = ctx.measureText(value).width / 2;
                const hOffset = 18 / 4;

                ctx.fillText(value, posX - wOffset, posY + hOffset);
            }

        });

    });

})(window);
