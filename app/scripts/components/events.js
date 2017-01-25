((window, document, $) => {
    'use strict';

    const EVENTS = EVENTS || {
            o: $({}),
            init: function() {
                $.each({
                    trigger: 'publish',
                    on: 'subscribe',
                    off: 'unsubscribe'
                }, function(key, val) {
                    jQuery[val] = function() {
                        EVENTS.o[key].apply(EVENTS.o, arguments);
                    };
                });
            }
        };

    window.EVENTS = EVENTS.init();

})(window, window.document, jQuery);
