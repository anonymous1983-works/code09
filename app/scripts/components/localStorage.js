(($, LIFEPLAN) => {

    'use strict';

    class LocalStorage {

        constructor(key = 'default') {

            this.uuid = key;

            if (!amplify.store(this.uuid)) {
                this.setState({});
            }
        }

        /**
         *
         * @returns {{}}
         */
        getState() {
            return amplify.store(this.uuid) || {};
        }

        /**
         *
         * @param state
         */
        setState(state) {
            //console.log('LocalStorage.setState('+this.uuid+') =>', state);
            return amplify.store(this.uuid, state);
        }

        /**
         *
         * @param key
         * @returns {*}
         */
        get(key) {
            return _.deepGet(this.getState(), key);
        }

        /**
         *
         * @param key
         * @param value
         * @returns {LocalStorage}
         */
        set(key, value) {

            this.setState(_.deepSet(this.getState(), key, value));

            return this;
        }

        /**
         * Clear state
         */
        clear() {
            amplify.store(this.uuid, {});
        }


        getDataFromUrl() {
            const i = this.getUrl().indexOf('#loader/');
            const letData = this.getUrl().substring(i);

            return letData.replace('#loader/', '');
        }

        /**
         *
         * @returns {string}
         */
        getUrl() {
            return window.location.href;
        }

        getParameterByName(name, url) {
            if (!url) {
                url = this.getUrl();
            }
            name = name.toLowerCase();
            url = url.toLowerCase();

            name = name.replace(/[\[\]]/g, '\\$&');
            let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results){
                return null;
            }
            if (!results[2]){
                return '';
            }
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }

        isUrlData() {
            const i = this.getUrl().indexOf('#loader/');
            return i;
        }

        getLang() {
            let lang = this.getParameterByName('lang');
            return (lang) ? lang.toUpperCase() : false;
        }

        urlDataToObj() {
            const ch = this.getDataFromUrl();
            return JSON.parse(window.base64.decode(ch));
        }

        toUrl() {
            const args = window.base64.encode(JSON.stringify(this.getState()));
            return window.location.origin + '/#loader/' + args;
        }
    }

    LIFEPLAN.LocalStorage = LocalStorage;

})(jQuery, LIFEPLAN);
