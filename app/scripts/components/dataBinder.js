;(function (__W, __D, $){
    'use strict';

    var DB = window.LIFEPLAN || {};
    var handlers = "[data-binding]";
    var handlersName = "data-binding";
    var handlersType = "data-binding-type";
    var datas = {
        "datas2send" : {}
    };

    function getDataBinder () {
        var list = $(handlers);
        DB.handlersList = list;
        return list;
    }

    function getDatas () {
        var currentDatas = {};
        var savedDatas = DB.storage.get("datas2send");
        var allDatas;

        allDatas = $.extend(datas.datas2send, savedDatas);
        datas.datas2send = allDatas;
        return datas.datas2send;
    }

    function setDatas() {
        DB.storage.set("datas2send" , datas.datas2send);
    }

    function cleanDatas () {
        DB.storage.remove("datas2send");
    }
    function updateDatas (fct) {
        if(LIFEPLAN.utils.realTypeOf(fct) === 'function') {
            fct();
        }
        setDatas();
    }

    function eltEvent() {
        $(DB.handlersList).each(function (){
            var currentElt = $(this);
            var binding = currentElt.attr(handlersName);
            var bindingType = currentElt.attr(handlersType);
            var sameBindingTypeElts;
            var isMultiple = false;

            if(bindingType !== undefined && bindingType === 'array') {
                isMultiple = true;
            }
            currentElt.off('change');
            currentElt.on('change', function (e, dta){
                sameBindingTypeElts = $('[' + handlersName+ '=\"' + binding + '\"]');

                var currentElt = $(this);
                var currentVal = currentElt.val();
                var valTemp = [];
                if(isMultiple) {
                    sameBindingTypeElts.each(function (){
                        if($(this).val().length > 0) {
                            valTemp.push($(this).val());
                        }
                    });
                    currentVal = valTemp;
                }else {
                    sameBindingTypeElts.val(currentVal);
                }
                _.deepSet(datas.datas2send, binding, currentVal);
                $.publish('dataBinding:update');
            });
        });
    }
    function calculation () {
        var currentDatas = datas.datas2send;
        var incomeObj = currentDatas.income;
        var expensesObj = currentDatas.expense;
        var incomeTotal = 0;
        var expenseTotal = 0;

        for( var i in incomeObj) {
            var elt = incomeObj[i];
            var eltLn = 0;
            var subElt;
            if(i !== 'total') {
                if(i === "salary") {
                    incomeTotal += parseInt(elt, 10);
                }else if(DB.utils.realTypeOf(elt) === 'array'){
                    subElt = elt;
                    eltLn = subElt.length;
                    for(var s = 0; s < eltLn ; s++) {
                        incomeTotal += parseInt(subElt[s], 10);
                    }
                }
            }
        }


        for( var e in expensesObj) {
            var elt = expensesObj[e];
            var eltLn = 0;
            var subElt;

            if(e !== 'total') {
                if(DB.utils.realTypeOf(elt) === 'array'){
                    subElt = elt;
                    eltLn = subElt.length;
                    for(var r = 0; r < eltLn ; r++) {
                        expenseTotal += parseInt(subElt[r], 10);
                    }
                }else {
                    expenseTotal += parseInt(elt, 10);
                }
            }
        }

       _.deepSet(datas.datas2send, "income.total", incomeTotal);
       _.deepSet(datas.datas2send, "expense.total", expenseTotal);
    }

    function eventsListener () {
        $.subscribe('dataBinding:ready', function (e, data){
            eltEvent();
        });
        $.subscribe('dataBinding:update', function (e, data){
            updateDatas(calculation);
        });
    }
    function init () {
        var list = getDataBinder ();
        //cleanDatas (); PUT WITH FULLPAGE.JS
        getDatas ();
        $.publish('dataBinding:ready');
    }
    $(__D).ready(function () {
        eventsListener ();
        init ();
    });

})(window, window.document, jQuery);