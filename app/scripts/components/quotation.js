(($, LIFEPLAN) => {

    'use strict';
    /**
     *
     */
    class PersonalDetails {
        constructor(obj) {

            const {
                dayofbirth,
                gender,
                region,
                owner,
                maritalStatus,
                dayofretirement,
                numberOfChildren,
                childrens,
                email,
                name,
                contactDate,
                contactDateHour
            } = obj;

            this.dayofbirth = +dayofbirth || 0;
            this.dayofretirement = +dayofretirement || 0;
            this.gender = gender || '';
            this.name = name || '';
            this.email = email || '';
            this.contactDate = contactDate || '';
            this.contactDateHour = contactDateHour || '';
            this.region = region || '';
            this.owner = owner || '';
            this.maritalStatus = maritalStatus || '';
            this.numberOfChildren = numberOfChildren ? +numberOfChildren : 0;
            this.childrens = childrens || [];
        }
    }
    /**
     *
     */
    class IncomeDetails {

        constructor(obj) {

            const {
                salary,
                otherIncoming,
                otherIncomingLabels
            } = obj;

            //this.total = total ? +total : 0;
            this.salary = salary ? +salary : 0;
            this.otherIncoming = [];
            this.otherIncomingLabels = otherIncomingLabels || [];

            if (otherIncoming) {

                // Filter all value stored in collection

                this.otherIncoming = this.otherIncoming.concat(
                    otherIncoming
                        .map(v => v ? +v : 0)
                        .filter(v => !!v)
                );
            }

            this.getActualIncoming();
        }

        getActualIncoming() {
            return this.total = this.salary + this.getOtherIncoming();
        }

        getOtherIncoming() {
            let total = 0;
            this.otherIncoming.forEach(v => total = total + +v);
            return total;
        }

        initLabels() {

            if (this.otherIncomingLabels.length === 0) {
                this.otherIncomingLabels = [false, false, false];
            }

            this.otherIncomingLabels = this.otherIncomingLabels.map(label => {
                label = label ? label : LIFEPLAN.dataLoader.get('pages.recap.incoming.other.secondary');
                return label;
            });

        }
    }
    /**
     *
     */
    class ExpenseDetails {

        constructor(obj) {

            const {
                hobby,
                home,
                family,
                health,
                otherExpenses,
                otherExpensesLabels
            } = obj;

            /* Model */
            this.hobby = hobby ? +hobby : 0;
            this.home = home ? +home : 0;
            this.family = family ? +family : 0;
            this.health = health ? +health : 0;

            this.otherExpenses = [];
            this.otherExpensesLabels = otherExpensesLabels || [];

            if (otherExpenses) {

                // Filter all value stored in collection
                this.otherExpenses = this.otherExpenses.concat(
                    otherExpenses
                        .map(v => v ? +v : 0)
                        .filter(v => !!v)
                );


            }

            this.getActualExpenses();
        }

        /**
         *
         * @returns {*}
         */
        getActualExpenses() {
            return this.total = this.hobby + this.home + this.family + this.health + this.getOtherExpenses();
        }

        getOtherExpenses() {
            let total = 0;
            this.otherExpenses.forEach(v => total = total + +v);
            return total;
        }

        initLabels() {

            if (this.otherExpensesLabels.length === 0) {
                this.otherExpensesLabels = [false, false, false];
            }

            this.otherExpensesLabels = this.otherExpensesLabels.map(label => {
                label = label ? label : LIFEPLAN.dataLoader.get('pages.recap.expense.other.secondary');
                return label;
            });

        }
    }
    /**
     *
     */
    class ProfessionalDetails {

        constructor(obj) {
            const {
                experience,
                employee,
                evolution
            } = obj;


            this.experience = experience ? +experience : 0;
            this.employee = employee || '';
            this.evolution = +evolution || 2;
        }
    }
    /**
     *
     */
    class ActivitiesDetails {

        constructor(obj) {
            const {
                hobby,
                expenses
            } = obj;

            this.hobby = hobby || '';
            this.expenses = +expenses || 0;
        }
    }
    /**
     *
     */
    class QuotationService {

        constructor(obj) {
            this._dayofretirement = 0;
            this._dayofbirth = 0;
            this._incomeSalary = 0;

            this.fixedSalaryBeforeRetirement = 0;
            this.economy = 0;

            this.personal = new PersonalDetails({});
            this.income = new IncomeDetails({});
            this.expense = new ExpenseDetails({});
            this.professional = new ProfessionalDetails({});
            this.activities = new ActivitiesDetails({});

            if (obj) {
                this.set(obj);
            }

            $.subscribe('dataBinding:update', (...args) => this.onDataBindingChange(...args));
            $.subscribe('fullpage:viewChangeSuccess', (...args) => this.onViewChange(...args));
        }

        /**
         *
         */
        onDataBindingChange($event, changeValue) {

            let data = LIFEPLAN.storage.getState();

            this.set(data);

            if (data && data.personal && !data.personal.dayofretirement) {
                data.personal.dayofretirement = this.personal.dayofretirement;
            }

            let oldTotalIncome = _.deepGet('income.total', data);
            let oldTotalExpense = _.deepGet('expense.total', data);

            if (data && data.income) {
                data.income.total = this.income.getActualIncoming();
            }

            if (data && data.expense) {
                data.expense.total = this.expense.getActualExpenses();
            }

            data.economy = this.getEconomy();

            LIFEPLAN.storage.setState(data);

            //console.log('Quotation onDataBindingChanger =>', changeValue);

            switch (changeValue.binding) {
                default:

                    if (data.income && data.income.total !== oldTotalIncome || data.expense && data.expense.total !== oldTotalExpense) {
                        console.log('quotation:calculation');
                        this.fixedSalaryBeforeRetirement = 0;
                        $.publish('quotation:calculation');
                    }

                    break;

                case 'professional.evolution':
                case 'personal.dayofbirth':
                    this.fixedSalaryBeforeRetirement = 0;
                    break;

                case 'personal.dayofretirement':
                    this.fixedSalaryBeforeRetirement = 0;

                    LIFEPLAN.component('loader').show();

                    this.getQuote().then(() => LIFEPLAN.component('loader').hide());
                    break;

                case 'fixedSalaryBeforeRetirement':
                    LIFEPLAN.component('loader').show();

                    this.getQuote().then(() => LIFEPLAN.component('loader').hide());
                    break;
            }
        }

        /**
         *
         */
        onViewChange($event, changeView) {

            //console.log('onViewChange =>', changeView);

            if (changeView.next.path === '#loader') {

                this.getQuote()
                    .then(() => {
                        console.log('Quotation Loaded');
                        LIFEPLAN.path('#results');
                    });

            }

        }

        /**
         * Update data from object and call getQuote when `personal.dayofretirement change`.
         * @param obj
         * @returns {QuoteDetails}
         */
        set(obj = {}) {
            const {
                fixedSalaryBeforeRetirement,
                personal = {},
                income = {},
                expense = {},
                professional = {},
                activities = {}
            } = obj;

            this.fixedSalaryBeforeRetirement = fixedSalaryBeforeRetirement ? +fixedSalaryBeforeRetirement : 0;

            this.personal = new PersonalDetails(personal);
            this.income = new IncomeDetails(income);
            this.expense = new ExpenseDetails(expense);
            this.professional = new ProfessionalDetails(professional);
            this.activities = new ActivitiesDetails(activities);

            if (this.personal.dayofbirth && this.personal.dayofbirth !== this._dayofbirth) {

                let yearOfBirth = this.getYearOfBirth();

                if (this.personal.dayofretirement === 0) {
                    this.personal.dayofretirement = LIFEPLAN.constant('quotationCalculationRules.getMinimumAgeRetirement')(yearOfBirth);
                }

            }

            return this;
        }

        /**
         *
         * @param base
         * @param rate
         * @returns {number}
         */
        getEstimatedSalary(base, rate) {
            if (this.fixedSalaryBeforeRetirement !== 0) {
                return this.fixedSalaryBeforeRetirement;
            }

            return (this.personal.dayofretirement - this.personal.dayofbirth) * (base * rate / 100) + base;
        }

        /**
         *
         * @param estimatedExpensesRetirement
         * @returns {number}
         */
        getProposedSavings(estimatedExpensesRetirement) {
            return ((estimatedExpensesRetirement * 30) / (this.personal.dayofretirement - this.personal.dayofbirth) / 12);
        }

        /**
         *
         * @returns {number}
         */
        getYearOfBirth() {
            let yearOfBirth = new Date();
            yearOfBirth.setFullYear(yearOfBirth.getFullYear() - this.personal.dayofbirth);
            return yearOfBirth.getFullYear();
        }

        /**
         *
         * @returns {number}
         */
        getYearOfRetirement() {
            let years = new Date();
            years.setFullYear(this.getYearOfBirth() + this.personal.dayofretirement);
            return years.getFullYear();
        }

        /**
         *
         * @returns {number|*}
         */
        getEconomy() {
            this.economy = this.income.total - this.expense.total;
            return this.economy;
        }


        /**
         * Apply all rules to provide the quoteResult.
         * @returns {{}}
         */
        _applyRules() {
            console.log('Apply quotation rules');

            const rules = LIFEPLAN.constant('quotationCalculationRules');

            let actualSalary = this.income.salary;
            let estimatedSalaryBeforeRetirement = this.getEstimatedSalary(actualSalary, this.professional.evolution);
            let estimatedRetirementPension = estimatedSalaryBeforeRetirement * rules.rates.estimatedRetirementPension;

            let actualExpenses = this.expense.getActualExpenses();
            let estimatedExpensesBeforeRetirement = ((estimatedSalaryBeforeRetirement - actualExpenses) / rules.rates.estimatedExpensesBeforeRetirement) + actualExpenses;

            let estimatedExpensesRetirement = estimatedRetirementPension * rules.rates.estimatedExpensesRetirement;
            let missToWin = estimatedRetirementPension - estimatedExpensesBeforeRetirement;
            let proposedSaving = this.getProposedSavings(estimatedExpensesRetirement);

            let yearOfBirth = this.getYearOfBirth();
            let yearOfRetirement = this.getYearOfRetirement();
            let quarterlyDues = rules.getQuaterlyDues(yearOfBirth);

            let taxSaved = (proposedSaving * 12) / 10;

            // the quote result
            return {
                missToWin,
                proposedSaving,
                taxSaved,
                yearOfBirth,
                yearOfRetirement,

                actualSalary,
                estimatedSalaryBeforeRetirement,
                estimatedRetirementPension,
                actualExpenses,
                estimatedExpensesBeforeRetirement,
                estimatedExpensesRetirement,

                remainingDuration: {
                    quarters: quarterlyDues,
                    years: Math.round((quarterlyDues * 4) / 12)
                }
            };
        }

        /**
         * Get the quote from
         */
        getQuote() {

            const promise = new Promise((resolve) => {

                const settings = LIFEPLAN.constant('webServices.quotation');
                const data = settings.requestMapper(LIFEPLAN.component('quotationService'));

                if(settings.enabled) {
                    $.ajax({
                        type: settings.type || 'POST',
                        url: settings.url,
                        dataType: settings.dataType || 'json',
                        contentType: settings.contentType || 'application/json; charset=utf-8',
                        data: JSON.stringify(data)
                    })
                        .done((response) => {
                            resolve({
                                data: settings.responseMapper(response)
                            });
                        })
                        .fail((...args) => {
                            console.err(...args);
                        });

                } else {
                    setTimeout(() => {
                        // Fake server response
                        resolve({
                            data: this._applyRules()
                        });

                    }, 1500);
                }

            });

            return promise
                .then(response => response.data)
                .then(quoteResult => this.render(quoteResult));
        }

        /**
         *
         * @param o
         * @returns {string}
         */
        toCurrency(o) {
            return o.toFixed(0).replace('.', ',').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1 ');
        }

        /**
         *
         * @param quoteResult
         */
        render(quoteResult) {

            // FORMAT data to rendering text

            let {
                missToWin,
                proposedSaving,
                taxSaved,
                yearOfBirth,
                yearOfRetirement,
                actualSalary,
                estimatedSalaryBeforeRetirement,
                estimatedRetirementPension,
                actualExpenses,
                estimatedExpensesBeforeRetirement,
                estimatedExpensesRetirement,
                remainingDuration
            } = quoteResult;

            const data2send = LIFEPLAN.storage.getState();

            const newData2send = _.assign(data2send, {
                quoteResult: {
                    missToWin: this.toCurrency(-1 * missToWin),
                    proposedSaving: this.toCurrency(proposedSaving),
                    taxSaved: this.toCurrency(taxSaved),
                    yearOfBirth,
                    yearOfRetirement,
                    actualSalary: this.toCurrency(actualSalary),
                    estimatedSalaryBeforeRetirement: this.toCurrency(estimatedSalaryBeforeRetirement),
                    estimatedRetirementPension: this.toCurrency(estimatedRetirementPension),
                    actualExpenses: this.toCurrency(actualExpenses),
                    estimatedExpensesBeforeRetirement: this.toCurrency(estimatedExpensesBeforeRetirement),
                    estimatedExpensesRetirement: this.toCurrency(estimatedExpensesRetirement),
                    remainingDuration
                },
                quoteResultRaw: quoteResult
            });

            LIFEPLAN.storage.setState(newData2send);

            console.log('quotation:quote/done');
            $.publish('quotation:quote/done');

        }

        destroy() {

        }
    }


    //

    LIFEPLAN.QuotationService = QuotationService;

})(jQuery, LIFEPLAN);
