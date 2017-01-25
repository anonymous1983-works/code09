(($, LIFEPLAN) => {

    'use strict';

    class DataTemplate {

        constructor() {
            this.handlers = '[data-template]:not(.templated)';
            this.handlersName = 'data-template';
            this.handlersType = 'data-template-type';

            this.braceRegex = new RegExp(/[{{}}]+/g);
            this.attrRegex = new RegExp(/template/g);

            this.eventsListener();
        }

        /**
         *
         */
        eventsListener() {
            $.subscribe('i18n/datas:loaded', () => this.render($('body')));
            $.subscribe('template:append', (event, $element) => this.render($($element)));
        }

        /**
         *
         * @param $element
         */
        render($element) {

            const elements = $element.find(this.handlers);

            elements.each((index) => {

                const element = $(elements.get(index));

                const elementType = element.prop('nodeName').toLocaleLowerCase();
                const expression = element.attr('data-template').replace(this.braceRegex, '');
                const content = LIFEPLAN.component('dataLoader').get(expression);

                // const isList = element.attr('data-template-list') || false;

                const eltFamily = {
                    'form': ['form', 'input', 'select', 'option', 'button', 'textarea', 'optgroup', 'img', 'a']
                };

                // if (isList !== false) {

                // }

                this.fillEltAttr(element);

                if (content !== undefined) {

                    if (eltFamily.form.indexOf(elementType) === -1) {
                        element.empty().append(content);
                    } else {
                        switch (elementType) {

                            case 'form' :
                                element.attr('action', content);
                                break;

                            case 'input' :
                                element.val(content);
                                break;

                            case 'select':
                                element.empty();

                                content.forEach(item => {
                                    const label = typeof item === 'object' ? item.label : item;
                                    const value = typeof item === 'object' ? item.value : item;

                                    element.append($(`<option value="${value}">${label}</option>`));
                                });

                                break;

                            case 'button':
                                element.empty().append(content);
                                break;

                            case 'textarea':
                                element.empty().append(content);
                                break;

                            case 'optgroup':
                                element.empty().append(content);
                                break;

                            case 'img':
                                element.attr('src', content);
                                break;

                            case 'a':
                                element.attr('href', content);
                                break;

                            case 'option':
                                element.empty().append(content);
                                break;

                            case 'div':
                                element.append(content);
                                break;
                        }
                    }
                    element.addClass('templated'); //.removeAttr('data-template');
                }
            });

        }

        /**
         *
         * @param element
         */
        fillEltAttr(element) {

            let _dataArray = element.data(),
                _tmpArray = [],
                _tmpAttr = '',
                _tmpAttrValCleaned = '',
                _val2Fill;

            _.each(_dataArray, (current, key) => {
                _val2Fill = '';

                if (key.trim().toLowerCase() !== 'template') {
                    _tmpArray = key.split('-');
                    _tmpAttr = _tmpArray[_tmpArray.length - 1].replace(this.attrRegex, '');
                    _tmpAttrValCleaned = current.replace(this.braceRegex, '');

                    if (_tmpAttrValCleaned !== '') {
                        _val2Fill = LIFEPLAN.component('dataLoader').get(_tmpAttrValCleaned);
                        element.attr(_tmpAttr, _val2Fill);
                    }

                }
            });

        }

    }

    LIFEPLAN.DataTemplate = DataTemplate;

})(jQuery, LIFEPLAN);
