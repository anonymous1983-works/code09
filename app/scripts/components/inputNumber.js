(($) => {

    'use strict';

    function render($element){
        $element
            .find('[type=number]')
            .on('keydown', (event) => {

                if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    // Allow: Ctrl+A
                    (event.keyCode === 65 && event.ctrlKey === true) ||
                    // Allow: home, end, left, right
                    (event.keyCode >= 35 && event.keyCode <= 39)) {
                    // let it happen, don't do anything
                    return;
                }

                let charValue = String.fromCharCode(event.keyCode);
                let valid = /^[0-9]+$/.test(charValue);

                if (!valid) {
                    event.preventDefault();
                }
            });
    }

    $(document).ready(() => {

        render($('body'));
        $.subscribe('template:append', (event, $element) => {
            render($($element));
        });

    });

})(jQuery, LIFEPLAN);
