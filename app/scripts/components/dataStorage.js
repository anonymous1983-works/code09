;(function (__W, __D, $){
    'use strict';

    var DS = window.LIFEPLAN || {};
    var storageType = 'cookie';
    var localStorageAvailable = 'cookie';
    var forceCookie = false;
    var forceClean = false;
    var cleanElts = [];

    /* COOKIE SETTER/ GETTER */
    function set_cookie(key, value, days) {
        var expires;
        var date = new Date();

        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toGMTString();
        document.cookie = key+"="+value+expires+"; path=/";
    }

    function get_cookie(key) {

        var nameEQ = key + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1,c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length,c.length);
            }
        }
        return null;
    }

    function remove_cookie(key) {
        set_cookie(key,"",-1);
    }

    /* LOCALSTORAGE SETTER/ GETTER */
    function set_localstorage(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
        return true;
    }

    function get_localstorage(key) {
        return JSON.parse(sessionStorage.getItem(key));
    }

    function remove_localstorage(key) {
        sessionStorage.removeItem(key);
    }

    function isLocalStorage (force) {
        if(force) {
            return false;
        }
        var isLocal = $('html').hasClass('localstorage') && $('html').hasClass('sessionstorage');
        if( isLocal ) {
            storageType = 'localstorage';
        }
        return isLocal;
    }

    $(__D).ready(function () {
        forceCookie = DS.settings.storage.forceCookie;
        forceClean = DS.settings.storage.forceClean;
        cleanElts = DS.settings.storage.keyToClean;

        if(forceClean) {
            if(cleanElts.length > 0) {
                for(var i = 0; i < cleanElts.length ; i++) {
                    remove_cookie(cleanElts[i]);
                }
            }
        }
        DS.storage = {
            'isLocalStorage' : localStorageAvailable = isLocalStorage (forceCookie),
            'set' : localStorageAvailable? set_localstorage : set_cookie,
            'get' : localStorageAvailable? get_localstorage : get_cookie,
            'remove' : localStorageAvailable? remove_localstorage : remove_cookie,
            'type' : storageType,
            'forceClean' : forceClean
        };
    });

})(window, window.document, jQuery);