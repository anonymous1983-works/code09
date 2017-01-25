(($, LIFEPLAN) => {
    'use strict';

    class DataLoader {

        constructor(obj = {}) {
            const {
                url,
                label,
                lang,
                ext
            } = obj;

            this.url = url || 'i18n/';
            this.label = label || 'data_';
            this.lang = lang || 'EN';
            this.ext = ext || '.json';

        }

        /**
         *
         * @returns {*}
         */
        getFilename() {
            return this.label + this.lang + this.ext;
        }

        getUrl() {
            return this.url + this.getFilename();
        }

        /**
         *
         */
        getJSON() {

            let promise = new Promise((resolve, reject) => {

                $.getJSON(this.getUrl())
                    .done(json => resolve(json))
                    .fail((...args) => reject(args));


            });

            return promise
                .then((json) => {

                    LIFEPLAN.component('dictionnary').setState(json);

                    $.publish('i18n/datas:loaded');

                    return json;
                })
                .catch((err) => {
                    console.error('Fail to load json =>', err);
                });


        }

        get(key) {
            return LIFEPLAN.component('dictionnary').get(key);
        }
    }

    LIFEPLAN.DataLoader = DataLoader;

})(jQuery, LIFEPLAN);
