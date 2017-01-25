'use strict';

window
    .LIFEPLAN

    .constant('storage', {
        'persiste': true
    })

    .constant('i18n', {
        'url': 'i18n/',
        'label': 'data_',
        'lang': 'FR',
        'ext': '.json'
    })

    .constant('global', {
        'lang': 'FR',
        'device': {
            'htmlMode': '&euro;',
            'labelMode': 'euro',
            'symbolMode': '€'
        }
    })

    .constant('EXPENSE_CATEGORIES', {
        'home': {label: 'Maison', color: '#e53c3f', retirementRate: -0.5},
        'family': {label: 'Famille', color: '#16509b', retirementRate: +0.1},
        'health': {label: 'Santé', color: '#f6ab22', retirementRate: +0.4},
        'hobby': {label: 'Loisirs', color: '#78c8d5', retirementRate: 0},
        'other': {label: 'Autres', color: '#7cc056', retirementRate: 0}
    })

    .constant('chartOptions', {
        layout: {
            padding: 70
        },
        legend: {
            display: false
        },
        animation: {
            onProgress: window.LIFEPLAN.component('renderPopinChart'),
            onComplete: window.LIFEPLAN.component('renderPopinChart')
        }
    })

    .constant('webServices', {

        sendBalanceSheet: {
            url: 'http://localhost:9000/rest/send-balance-sheet',
            requestMapper: (quotationDetails) => {

                return quotationDetails;
            }
        },

        contact: {
            url: 'http://localhost:9000/rest/contact',
            requestMapper: (quotationDetails) => {

                return quotationDetails;
            }
        },

        quotation: {
            enabled: false,
            url: 'http://localhost:9000/rest/quotation',
            requestMapper: (quotationDetails) => {

                return quotationDetails;
            },

            responseMapper: (quoteResult) => {

                return quoteResult;
            }
        }

    })

    .constant('quotationCalculationRules', {
        rates: {
            estimatedRetirementPension: 0.60,
            estimatedExpensesRetirement: 0.35,
            estimatedExpensesBeforeRetirement: 1.80,
            taxSaved: 0.10
        },

        getQuaterlyDues: (yearOfBirth) => {

            /*1948 ou avant 	160 trimestres (40 ans)
             1949 	161 trimestres (40 ans et un trimestre)
             1950 	162 trimestres (40 ans et deux trimestres)
             1951 	163 trimestres (40 ans et trois trimestres)
             1952 	164 trimestres (41 ans)
             1953 - 1954 	165 trimestres (41 ans et un trimestre)
             1955 -1957 	166 trimestres ( 41 ans et deux trimestres)
             1958 - 1960 	167 trimestres (41 ans et trois trimestres)
             1961 - 1963 	168 trimestres (42 ans)
             1964 - 1966 	169 trimestres (42 ans et un trimestre)
             1967 - 1969 	170 trimestres (42 ans et deux trimestres)
             1970 - 1972 	171 trimestres (42 ans et trois trimestres)
             A partir de 1973 	172 trimestres (43 ans)*/

            if (yearOfBirth <= 1948) {
                return 160;
            }
            if (yearOfBirth <= 1949) {
                return 161;
            }
            if (yearOfBirth <= 1950) {
                return 162;
            }
            if (yearOfBirth <= 1951) {
                return 163;
            }
            if (yearOfBirth <= 1952) {
                return 164;
            }
            if (yearOfBirth <= 1954) {
                return 165;
            }
            if (yearOfBirth <= 1957) {
                return 166;
            }
            if (yearOfBirth <= 1960) {
                return 167;
            }
            if (yearOfBirth <= 1963) {
                return 168;
            }
            if (yearOfBirth <= 1966) {
                return 169;
            }
            if (yearOfBirth <= 1969) {
                return 170;
            }
            if (yearOfBirth <= 1972) {
                return 171;
            }

            return 172;
        },

        getMinimumAgeRetirement: (yearOfBirth) => {

            // Avant le 1er juillet 1951 	60 ans
            // Du 1er juillet au 31 décembre 1951 	60 ans et 4 mois
            // Année 1952 	60 ans et 9 mois
            // Année 1953 	61 ans et 2 mois
            // Année 1954 	61 ans et 7 mois
            // Année 1955 	62 ans

            if (yearOfBirth < 1953) {
                return 60;
            }

            if (yearOfBirth < 1955) {
                return 61;
            }

            return 62;

        }
    });



