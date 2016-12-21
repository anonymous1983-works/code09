;(function (__W, __D, $){
    'use strict';

    var DB = window.LIFEPLAN || {};
    var handlers = "[data-binding]";
    var handlersName = "data-binding";
    var datas = {
        "datas2send" : {},
        "datas2send_backup" : {}
    };

    function getDataBinder () {
        var list = $(handlers);
        DB.handlersList = list;
        return list;
    }

    function cleanDatas () {
        DB.storage.remove("datas2send");

    }
    function updateDatas () {
        DB.storage.set("datas2send" , datas.datas2send);
    }

    function eltEvent() {
        $(DB.handlersList).each(function (){
            var currentElt = $(this);
            var binding = currentElt.attr(handlersName);

            currentElt.off('change');
            currentElt.on('change', function (e, dta){
                var currentElt = $(this);
                var currentVal = currentElt.val();

                _.deepSet(datas.datas2send, binding, currentVal);
                _.deepSet(datas.datas2send_backup, binding, currentVal);
                //datas.datas2send[binding] = currentVal;
                $.publish('dataBinding:update');
            });
        });
    }

    function eventsListener () {
        $.subscribe('dataBinding:ready', function (e, data){
            eltEvent();
        });
        $.subscribe('dataBinding:update', function (e, data){
            updateDatas ();
        });
    }
    function init () {
        var list = getDataBinder ();
        cleanDatas ();
        $.publish('dataBinding:ready');
    }
    $(__D).ready(function () {
        eventsListener ();
        init ();
    });

})(window, window.document, jQuery);