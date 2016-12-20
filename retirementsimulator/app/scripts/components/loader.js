;(function (__W, __D, $){
    'use strict';

    var LOADER = window.LIFEPLAN || {};
    var element;

    function getStatus () {
        return LOADER.loader.displayed = !element.hasClass('is_hide');
    }
    function hideLoader() {
        element.addClass('is_hide');
        getStatus();
    }

    function showLoader() {
        element.removeClass('is_hide');
        getStatus();
    }

    function eventsListener () {
        $.subscribe('loader:to/show', function (){
            showLoader();
        });
        $.subscribe('loader:to/hide', function (){
            hideLoader();
        });
    }

    $(__D).ready(function () {
        element = $('.loader');

        eventsListener();

        LOADER.loader = {
            'hide' : hideLoader,
            'show' : showLoader,
            'getStatus' : getStatus,
            'displayed' : true
        };
    });
})(window, window.document, jQuery);