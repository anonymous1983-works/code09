(($) => {
    'use strict';

    let LIFEPLAN = window.LIFEPLAN = window.LIFEPLAN || {};

    $(document).ready(() => {
        //console.log('ready in main');

        var i18n;

        let context;
        const {
            LocalStorage,
            TemplateCache,
            Loader,
            QuotationService,
            DataBinder,
            DataTemplate,
            DataInclude,
            DataPrint,
            FormRecapAdd,
            EstimeBar,
            HobbiesIcons,
            Hobbies,
            ChartToday,
            ChartRetirement,
            DataLoader,
            PopupContact,
            PopupSendBalanceSheet
        } = LIFEPLAN;


        const storage = new LocalStorage('data2send');
        const dictionary = new LocalStorage('dictionary');
        const templateCache = new TemplateCache();


        // Disable Tab
        $(document).on('keydown', function (e) {
            var TABKEY = 9;
            if (e.keyCode === TABKEY) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                return false;
            }
        });

        // Emulate Tab functionality
        $('#idProfileCouple input, #idProfileNumberOfChildren input, .js-input-for-tab').on('keydown', function (e) {
            var TABKEY = 9;
            if (e.keyCode === TABKEY) {
                if (e.preventDefault) {
                    var currentTabindex = $(this).prop('tabindex'),
                        $nextInput = $('input[tabindex="' + ++currentTabindex + '"]');
                    if ($nextInput) {
                        $nextInput.focus();
                    }
                }
                return false;
            }
        });

        LIFEPLAN
            .component('storage', storage)
            .component('i18n', {dictionary})
            .component('dictionnary', dictionary)
            .component('templateCache', templateCache);

        if (LIFEPLAN.constant('storage.persiste')) {
            context = storage.getState();
        } else {
            context = {};
            storage.clear();
            LIFEPLAN.path('#');
        }

        if (LIFEPLAN.constant('MOCK.useMock')) {
            context = LIFEPLAN.constant('MOCK.data');
        }

        // Init i18n
        i18n = LIFEPLAN.constant('i18n');
        // If change lang

        if (storage.getLang()) {
            i18n = {
                'url': 'i18n/',
                'label': 'data_',
                'lang': storage.getLang(),
                'ext': '.json'
            };
        }


        // if data in param
        if (storage.isUrlData() > 0) {
            //context = JSON.parse( window.atob(storage.getDataFromUrl()) );
            context = storage.urlDataToObj();
        }

        // INIT LoaderChart
        const loaderChart = new Loader('.axa-loader.chart');
        const loader = new Loader('.axa-loader.start');

        LIFEPLAN
            .component('quotationService', new QuotationService())
            .component('dataPrint', new DataPrint())
            .component('dataBinder', new DataBinder())
            .component('dataInclude', new DataInclude())
            .component('dataTemplate', new DataTemplate())
            .component('recapFormAdd', new FormRecapAdd())
            .component('estimeBar', new EstimeBar())
            .component('hobbiesIcons', new HobbiesIcons())
            .component('hobbies', new Hobbies())
            .component('chartToday', new ChartToday())
            .component('chartRetirement', new ChartRetirement())
            .component('dataLoader', new DataLoader(i18n))
            .component('loaderChart', loaderChart)
            .component('loader', loader);

        //console.log("LIFEPLAN", LIFEPLAN);

        loader.show();

        if (LIFEPLAN.path() === '#results') {
            LIFEPLAN.path('#loader');
        }

        LIFEPLAN
            .component('dataLoader')
            .getJSON()
            .then(() => {
                const quotationService = LIFEPLAN.component('quotationService');

                quotationService.set(context);
                quotationService.income.initLabels();
                quotationService.expense.initLabels();

                // INIT DES LABELS
                storage.setState(quotationService);
            })
            .then(() => {
                return LIFEPLAN.component('dataInclude').asyncRender($('body'));
            })
            .then(() => {

                setTimeout(() => {
                    loader.hide();
                }, 800);

                // INIT BUTTON START WORKFLOW
                $('.page-home .btn-start').click(() => {
                    const newQuotationService = new QuotationService({});

                    newQuotationService.set({});
                    storage.setState(newQuotationService);

                    LIFEPLAN.component('quotationService', newQuotationService);
                });

                // Popup Contact
                const popupContact = new PopupContact();

                $('.axa-header_navbar .btn-call, .btn-contact').click((event) => {
                    event.preventDefault();
                    popupContact.open();
                    return false;
                });


                // Popup Send Bilan
                const popupSendBalanceSheet = new PopupSendBalanceSheet();

                $('.send-balance_sheet').click((event) => {
                    event.preventDefault();
                    popupSendBalanceSheet.open();
                    return false;
                });

                $.publish('app:ready');
            });

    });

})(jQuery);
