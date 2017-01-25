(($, LIFEPLAN) => {

    'use strict';

    class HobbiesIcons {

        constructor() {

            this.className = '[hobbies-icons]';

            $.subscribe('dataBinding:update', ($event, changeValue) => {

                if (changeValue.binding === 'activities.hobby') {

                    this.update(changeValue.newValue);

                }

            });

            $.subscribe('app:ready', () => this.render());

        }

        /**
         *
         */
        update(newHobbyValue) {

            const $element = $(this.className);

            $element.find('.item').removeClass('active');
            $element.find(`.item-${newHobbyValue}`).addClass('active');

        }

        render() {

            const hobbies = LIFEPLAN.component('dictionnary').get('select.hobbies');
            const $elements = $(this.className);

            $elements.each((index) => {

                const $element = $($elements.get(index));

                hobbies.forEach((item) => {
                    if (item.value) {
                        const src = item.src.replace('${type}', $element.attr('hobbies-icons'));
                        $element.append($(`<li class="item item-${item.value}"><img src="${src}"></li>`));
                    }
                });
            });


            this.update(LIFEPLAN.component('quotationService').activities.hobby);
        }

    }

    class Hobbies {

        constructor() {

            $.subscribe('dataBinding:update', ($event, changeValue) => {

                if (changeValue.binding === 'activities.hobby') {

                    this.update(changeValue.newValue);

                }

            });

            $.subscribe('app:ready', () => this.update(LIFEPLAN.component('quotationService').activities.hobby));

        }

        /**
         *
         */
        update(newHobbyValue) {

            this.updateHobbyTag(newHobbyValue);
            this.updateHobbyShowTag(newHobbyValue);
            this.updateHobbyHideTag(newHobbyValue);


        }

        /**
         *
         * @param newHobbyValue
         */
        updateHobbyTag(newHobbyValue) {
            let elements = $('[hobby]');

            const hobbies = LIFEPLAN.component('dictionnary').get('select.hobbies');
            let hobby = '';

            if (newHobbyValue) {
                hobby = _.find(hobbies, {value: newHobbyValue});
            } else {
                hobby = hobbies[0];
            }

            if (hobby && hobby.src){
                elements.each((index) => {
                    const $element = $(elements.get(index));
                    const attr = $element.attr('hobby');

                    if (attr === 'icon') {
                        $element.attr('src', hobby.src.replace('${type}', 'icon'));
                    } else {
                        $element.html(hobby[attr]);
                    }


                });
            }
        }

        /**
         *
         * @param newHobbyValue
         */
        updateHobbyShowTag(newHobbyValue) {
            let elements = $('[hobby-show]');

            elements.each((index) => {
                const $element = $(elements[index]);

                if ($element.attr('hobby-show') === newHobbyValue) {
                    $element.show();
                } else {
                    $element.hide();
                }
            });

        }

        /**
         *
         * @param newHobbyValue
         */
        updateHobbyHideTag(newHobbyValue) {
            let elements = $('[hobby-hide]');

            elements.each((index) => {
                const $element = $(elements[index]);

                if ($element.attr('hobby-hide') === newHobbyValue) {
                    $element.hide();
                } else {
                    $element.show();
                }
            });

        }
    }

    LIFEPLAN.HobbiesIcons = HobbiesIcons;
    LIFEPLAN.Hobbies = Hobbies;

})(jQuery, LIFEPLAN);
