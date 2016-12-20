;(function (__W, __D, $){
    'use strict';

    var DF = window.LIFEPLAN || {};
    var handler = $("[data-template]");
    var braceRegex = new RegExp(/[{{}}]+/g);
    var attrRegex = new RegExp(/template/g);

    function fillEltAttr(element) {
        var _dataArray = element.data(),
            _tmpArray = [],
            _tmpAttr = '',
            _tmpAttrValCleaned = '',
            _val2Fill;

        for (var i in _dataArray) {
            _val2Fill = '';
            if (i.trim().toLowerCase() !== 'template') {
                _tmpArray = i.split('-');
                _tmpAttr = _tmpArray[_tmpArray.length - 1].replace(attrRegex, '');
                _tmpAttrValCleaned = _dataArray[i].replace(braceRegex, '');

                if(_tmpAttrValCleaned !== ''){
                    _val2Fill = _.deepGet(DF.i18n.dictionary, _tmpAttrValCleaned);
                    element.attr(_tmpAttr, _val2Fill);
                }


            }
        }
    }

    function fillElt (element) {
        var elementType = element.prop('nodeName').toLocaleLowerCase();
        var template = element.attr('data-template');
        var templateCleaned =  template.replace(braceRegex,'');
        var text2Fill = _.deepGet(DF.i18n.dictionary, templateCleaned);
        var isList = element.attr('data-template-list') || false;
        var eltFamily = {
          "form" : ['input','select','option','button', 'textarea','optgroup', 'img', 'a']
        };
        if(isList !== false) {

        }

        fillEltAttr(element);

        if(text2Fill !== undefined) {
            if(eltFamily.form.indexOf(elementType) === -1) {
                element.empty().append(text2Fill);
            }else {
                switch(elementType) {

                    case 'input' :
                        element.val(text2Fill);
                        break;
                    case 'select' :

                        break;
                    case 'option' :
                        element.empty().append(text2Fill);
                        break;
                    case 'button' :
                        element.empty().append(text2Fill);
                        break;
                    case 'textarea' :
                        element.empty().append(text2Fill);
                        break;
                    case 'optgroup' :
                        element.empty().append(text2Fill);
                        break;
                    case 'img' :
                        element.attr('src',text2Fill);

                        break;
                    case 'a' :
                        element.attr('href',text2Fill);
                        break;
                }
            }
           element.addClass('templated'); //.removeAttr('data-template');
        }
    }

    function getElement () {
        return  $("[data-template]:not(.templated)");
    }

    function eventsListener (){
        $.subscribe('i18n/datas:loaded', function(){
            var eltsList = getElement();
            eltsList.each(function (){
               var currentElt = $(this);
                fillElt(currentElt);
            });
            DF.loader.hide();
        });
    }
    $(__D).ready(function () {

        eventsListener();
    });

})(window, window.document, jQuery);