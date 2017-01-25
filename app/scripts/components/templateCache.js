
(($, LIFEPLAN) => {
    'use strict';

    class TemplateCache {

        constructor() {
            this.cache = {};
        }

        get(url) {

            return new Promise((resolve, reject) => {

                if (this.cache[url] === undefined) {

                    $.get(url)
                        .done((data) => {
                            this.cache[url] = data;
                            resolve(data);
                        })
                        .fail((err) => {
                            console.error('Unable to load template =>', url);
                            reject(err);
                        });

                } else {
                    resolve(this.cache[url]);
                }
            });

        }

    }

    LIFEPLAN.TemplateCache = TemplateCache;

})(jQuery, LIFEPLAN);
