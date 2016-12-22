;(function (__W, __D, $){
    'use strict';

    var HEADER = window.LIFEPLAN || {};
    var handlerCall = '.btn-call';
    var handlersList;

    function getHandler () {
        return $(handlerCall);
    }

    function eventsListener () {

    }

    function init() {
        handlersList = getHandler();
        $(handlersList).each(function (){
            var current = $(this);

            console.log('current', current)


            new POPIN.popin.Popin({
                "element" : current,

                 "otherClass" : ["textHome", "OtherClass2"],
                 "title" : "tesazeazaaezzet",
                 "imgUrl" : "assets/icon-arrow.png",
                 "imgAlt" : "test",
                 "imgTitle" : "bim",

                "htmlText" : $('<div/>', {
                    "class" : "popinContent",
                    "html" : "bim"
                })
            });



        });
    }

    $(__D).ready(function () {
        init();
        eventsListener();
        HEADER.header = {};
    });

})(window, window.document, jQuery);