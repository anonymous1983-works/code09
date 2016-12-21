;(function (__W, __D, $){
    'use strict';

    var POPIN = window.LIFEPLAN || {};
    var element;
    var containerTpl = $('<div/>', {
            "class" : "popin"
        });
    var btnCloseTpl = $('<div/>', {
        "class" : "closeBtn",
        "html" : "<a href=\"javascript:void(0);\">X</a>"
    });
    var titleTpl = $('<div/>', {
        "class" : "title"
    });

    function Popin (data) {
        var _this = this;
        var optsDefault = {
          'otherClass' : [],
          'arrowPosition' : 'leftArrow', // leftArrow, rightArrow, topArrow, bottomArrow
          'element' : $('body'),
          'title' : null,
          'imgUrl' : null,
          'imgAlt' : "",
          'imgTitle' : "",
          'closeBtnLabel' : 'close',
          'offsetLeft' : 90,
          'offsetTop' : -40
        };

        _this.opts = $.extend (optsDefault, data);
        _this.opts.element = $(_this.opts.element);

        $(_this.opts.element).on('click', function (){
            _this.open();
        });
    }

    Popin.prototype.open = function () {
        var _this = this;
        var currentPopin = containerTpl.clone();
        var currentClose = btnCloseTpl.clone();
        var currentTitle = titleTpl.clone();
        var currentImg = "";
        var text;
        var handlerPosition = $(_this.opts.element).offset();

        $('.popin').remove();
        currentPopin.addClass(_this.opts.arrowPosition);
        if(LIFEPLAN.utils.realTypeOf(_this.opts.otherClass) === 'array' && _this.opts.otherClass.length > 0) {
            for( var i= 0; i < _this.opts.otherClass.length; i++) {
                currentPopin.addClass(_this.opts.otherClass[i])
            }
        }
        currentPopin.append(currentClose)
        if(_this.opts.title !== null) {

            currentTitle.append($('<h3/>', {
                "html" : _this.opts.title // currentImg
            }));

            if(_this.opts.title !== null) {
                currentImg = $('<img/>', {
                    "src" : _this.opts.imgUrl,
                    "alt" : _this.opts.imgAlt,
                    "title" : _this.opts.imgTitle
                });
                currentTitle.find('h3').prepend(currentImg);
            }

            currentPopin.append(currentTitle)

        }
        text = currentPopin.append( _this.opts.htmlText);

        text.css({
           "top" : Math.floor(handlerPosition.top + _this.opts.offsetTop) + 'px',
           "left" : Math.floor(handlerPosition.left + _this.opts.offsetLeft) + 'px'
        });
        $('body').append(text);
        $(currentClose).on('click', function (){
            _this.close(currentPopin);
        });
    };

    Popin.prototype.close = function (container) {
        var _this = this;
        if(container !== undefined) {
            container.remove();
        }
    };
    function eventsListener () {

    }
    function init() {
        eventsListener();
    }

    $(__D).ready(function () {
        init();

        POPIN.popin = {
            'Popin' : Popin,
        };

        $.subscribe('i18n/datas:loaded', function (){
            var textDatas = LIFEPLAN.i18n.dictionary.popin.profile;
            var textTpl = "";
            $.each(textDatas, function(index,jsonObject){
                textTpl += jsonObject;
            });
            if(document.querySelectorAll('.profile img').length > 0) {
                var test = new POPIN.popin.Popin({
                    "element" : document.querySelectorAll('.profile img')[0],
                    /*
                    "otherClass" : ["textHome", "OtherClass2"],
                    "title" : "tesazeazaaezzet",
                    "imgUrl" : "assets/icon-arrow.png",
                    "imgAlt" : "test",
                    "imgTitle" : "bim",
                    */
                    "htmlText" : $('<div/>', {
                        "class" : "popinContent",
                        "html" : textTpl
                    })
                });
            }
        });
    });
})(window, window.document, jQuery);