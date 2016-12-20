;(function (__W, __D, $){
    'use strict';

    var DL = window.LIFEPLAN || {};
    var defaultSettings =  {
        url : 'i18n/',
        label : 'data_',
        lang : 'EN',
        ext : '.json'
    };
    var opts;
    var filename;
    var datas = {};

    function getDatas () {
        if(DL.storage.get('dictionary') === null || true) {
            $.getJSON(DL.i18n.fullUrl)
                .done(function(obj,r,t) {
                    datas = obj;
                    DL.i18n.dictionary = obj;
                    DL.storage.set('dictionary', datas);
                    $.publish('i18n/datas:loaded');
                }).fail(function(e,r,t) {
                    console.trace( "error", e,r,t );
                    $.publish('i18n/datas:error');
                });
        }else {
            DL.i18n.dictionary = DL.storage.get('dictionary');
            $.publish('i18n/datas:loaded');
        }
    }

    $(__D).ready(function () {
        opts = $.extend(defaultSettings, DL.settings.i18n);
        filename = opts.label + opts.lang + opts.ext;
        DL.i18n = {
            'file' : filename,
            'fullUrl' : opts.url + filename,
            'dictionary' : datas
        };
        getDatas();
    });

})(window, window.document, jQuery);