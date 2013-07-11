var Theme = function () {

    var showValidationTicks;
    var validationRules = getValidationRules();


    

    return { init: init, validationRules: validationRules };

    function init() {
        
    }

    

    function getValidationRules() {
        var custom = {
            focusCleanup: false,

            wrapper: 'div',
            errorElement: 'span',

            highlight: function (element) {
                $(element).parents('.control-group').removeClass('success').addClass('error');
            },
            success: function (element) {
                $(element).parents('.control-group').removeClass('error').addClass('success');
                if (Theme.showValidationTicks){
                    $(element).parents('.controls:not(:has(.clean))').find('div:last').before('<div class="clean"></div>');
                    //console.log(Theme.showValidationTicks);
                }   
            },
            errorPlacement: function (error, element) {
                error.appendTo(element.parents('.controls'));
            }

        };

        return custom;
    }

} ();