(function ($, LIFEPLAN) {
    'use strict';

    class DataInclude {

        constructor() {
            this.handlers = '[data-include]';
            this.handlersName = 'data-include';
            this.handlersType = 'data-include-type';
        }

        /**
         *
         * @param $element
         * @returns {Promise.<*>}
         */
        asyncRender($element) {
            const elements = $element.find(this.handlers);

            const promises = elements
                .toArray()
                .map((e) => {
                    const $e = $(e);
                    const url = $(e).attr(this.handlersName);

                    return LIFEPLAN
                        .component('templateCache')
                        .get(url)
                        .then(html => this.bind($e.html(html)));
                });

            return Promise.all(promises);
        }

        bind($element) {
            $.publish('template:append', $element);
        }

    }

    LIFEPLAN.DataInclude = DataInclude;

})(jQuery, LIFEPLAN);
