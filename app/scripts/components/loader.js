(($, LIFEPLAN) => {

    'use strict';

    class Loader {

        constructor(className = '.loader') {
            this.$element = $(className);
        }

        hide(){
            return new Promise((resolve) => {
                this.$element.fadeOut(500, resolve);
            });

        }

        show(){
            return new Promise((resolve) => {
                this.$element.fadeIn(500, resolve);
            });
        }
    }

    LIFEPLAN.Loader = Loader;

})(jQuery, LIFEPLAN);
