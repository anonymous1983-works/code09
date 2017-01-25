((__W, document, $, LIFEPLAN) => {
    'use strict';

    let containerTpl = $('<div/>', {
        'class': 'popin'
    });
    let btnCloseTpl = $('<div/>', {
        'class': 'btn-close',
        'html': '<a href="javascript:void(0);" class="link-close"><span class="hide">close</span></a>'
    });
    let titleTpl = $('<h3/>', {
        'class': 'title'
    });

    function Popin(data) {
        let _this = this;
        let optsDefault = {
            'otherClass': [],
            'arrowPosition': 'leftArrow', // leftArrow, rightArrow, topArrow, bottomArrow
            'element': undefined,
            'title': null,
            'imgUrl': null,
            'imgAlt': '',
            'imgTitle': '',
            'closeBtnLabel': 'close',
            'offsetLeft': 50,
            'offsetTop': -40
        };

        _this.opts = $.extend(optsDefault, data);

        if (_this.opts.element) {
            _this.opts.element = $(_this.opts.element);

            $(_this.opts.element).on('click', function () {
                _this.open();
            });
        }

    }

    Popin.prototype.open = function (x, y) {
        let _this = this;
        let currentPopin = containerTpl.clone();
        let currentClose = btnCloseTpl.clone();
        let currentTitle = titleTpl.clone();
        let currentImg = '';
        let text;

        if (_this.opts.element) {
            let handlerPosition = $(_this.opts.element).offset();
            x = handlerPosition.left;
            y = handlerPosition.top;
        }

        $('.popin').remove();
        currentPopin.addClass(_this.opts.arrowPosition);
        if (typeof this.opts.otherClass === 'object' && _this.opts.otherClass.length > 0) {
            for (let i = 0; i < _this.opts.otherClass.length; i++) {
                currentPopin.addClass(_this.opts.otherClass[i]);
            }
        }

        currentPopin.append(currentClose);

        if (_this.opts.title !== null) {

            currentTitle.append($('<span/>', {
                'class': 'text title-text',
                'html': _this.opts.title // currentImg
            }));
            //currentTitle.html(_this.opts.title);

            if (_this.opts.title !== null) {
                currentImg = $('<img/>', {
                    'src': _this.opts.imgUrl,
                    'alt': _this.opts.imgAlt,
                    'title': _this.opts.imgTitle,
                    'class': 'title-icon'
                });
                currentTitle.prepend(currentImg);
            }

            currentPopin.append(currentTitle);

        }

        text = currentPopin.append($('<span/>', {
            'class': 'popin-content',
            'html': _this.opts.htmlText
        }));

        text.css({
            'top': Math.floor(y + this.opts.offsetTop) + 'px',
            'left': Math.floor(x + this.opts.offsetLeft) + 'px'
        });

        if (_this.opts.appendTo) {
            _this.opts.appendTo.append(text);
        } else {
            $('body').append(text);
        }

        $(currentClose).on('click', function () {
            _this.close(currentPopin);
        });

        return text;
    };

    Popin.prototype.close = function (container) {
        if (container !== undefined) {
            container.remove();
        }
    };

    $(document).ready(function () {

        LIFEPLAN.component('Popin', Popin);
        LIFEPLAN.component('popin', {
            'Popin': Popin
        });

        $.subscribe('i18n/datas:loaded', function () {

            const dictionnary = LIFEPLAN.component('dictionnary');
            const $element = $('[data-toggle="axa-popin"]');


            let textDatas = dictionnary.get('popin.profile');
            let textTpl = '';

            $.each(textDatas, function (index, jsonObject) {
                textTpl += jsonObject;
            });

            if ($element.length > 0) {

                $element.each(function () {

                    let $this = $(this),
                        data = (typeof $this.attr('axa-popin') !== typeof undefined)
                            ? $.parseJSON('[' + $this.attr('axa-popin') + ']')
                            : [];

                    if (data.length) {

                        let _letData = data[0];

                        new Popin({
                            'element': $this,
                            'appendTo': $this.parents('.axa-page'),
                            'otherClass': [
                                _letData.data.theme
                            ],
                            'title': dictionnary.get(_letData.data.idTitle),
                            'imgUrl': '',
                            'imgAlt': '',
                            'imgTitle': '',
                            'htmlText': $('<div/>', {
                                'class': 'popinContent',
                                'html': dictionnary.get(_letData.data.idText)
                            })
                        });
                    }

                });
            }
        });
    });
})(window, window.document, jQuery, LIFEPLAN);
