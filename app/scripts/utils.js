;(function (__W, __D, $){
    'use strict';
    var UTILS = window.LIFEPLAN || {};

    UTILS.utils = {};

    UTILS.utils.realTypeOf = function(global) {
        var cache = {};
        return function(obj) {
            var key;
            return obj === null ? "null" : obj === global ? "global" : (key = typeof obj) !== "object" ? key : obj.nodeType ? "object" : cache[key = {}.toString.call(obj)] || (cache[key] = key.slice(8, -1).toLowerCase());
        };
    }(this);


})(window, window.document, jQuery);