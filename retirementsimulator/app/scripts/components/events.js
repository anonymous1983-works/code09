;(function (__W, __D, $){
    'use strict';
    var EVENTS = EVENTS || {
            o: $({}),
            init: function() {
                $.each({
                    trigger: "publish",
                    on: "subscribe",
                    off: "unsubscribe"
                }, function(key, val) {
                    jQuery[val] = function() {
                        EVENTS.o[key].apply(EVENTS.o, arguments);
                    };
                });
            }
        };
    __W.EVENTS = EVENTS.init();
})(window, window.document, jQuery);