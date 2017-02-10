//I grabbed most of this from another site, thus it is minified

var FormWizard = function () {
    return {
        init: function () {
            if (jQuery().bootstrapWizard) {
                var form = $("#eoi_form"),
                    failPanel = $(".alert-danger", form),
                    passPanel = $(".alert-success", form);
                form.validate({
                    doNotHideMessage: true,
                    errorElement: "span",
                    errorClass: "help-block help-block-error",
                    focusInvalid: false,
                    rules: {
                        "preschool_name": "required",
                        "preschool_address_line1": "required",
                        //"preschool_address_line2": "required",
                        "preschool_address_suburb": "required",
                        "preschool_address_state": "required",
                        "preschool_address_postcode": {
                            required: true,
                            digits: true,
                            minlength: 4,
                            maxlength: 4
                        },
                        "preschool_category": "required",
                        "preschool_service_number": {
                            required: true,
                            digits: true
                        },
                        "preschool_provider_name": "required",
                        "preschool_provider_number": "required",
                        "preschool_rating": "required",
                        "preschool_type": "required",
                        "wifi": "required",
                        "prekindy": "required",
                        "teacher": "required",
                        "device": "required",
                        "director_name": "required",
                        "director_position": "required",
                        "director_email": "required",
                        "director_phone": "required",
                        "primary_name": {
                            required: "input[name=provide_primary]:checked"
                        },
                        "primary_position": {
                            required: "input[name=provide_primary]:checked"
                        },
                        "primary_email": {
                            required: "input[name=provide_primary]:checked",
                            email: true
                        },
                        "primary_phone": {
                            required: "input[name=provide_primary]:checked"
                        },
                        "secondary_name": {
                            required: "input[name=provide_secondary]:checked"
                        },
                        "secondary_position": {
                            required: "input[name=provide_secondary]:checked"
                        },
                        "secondary_email": {
                            required: "input[name=provide_secondary]:checked",
                            email: true
                        },
                        "secondary_phone": {
                            required: "input[name=provide_secondary]:checked"
                        },
                        "other_discover": "required",
                        "other_count": "required",
                        // "other_atsi_owned",
                        // "other_atsi_director",
                        // "other_atsi_enrolled",
                        // "other_atsi_engage",
                        // "other_atsi_activities",
                        "other_ella": "required",
                        // "other_ella_2017": {
                        //     required: "input[name=other_ella][value=yes]:checked"
                        // },
                        // "other_ella_2016": {
                        //     required: "input[name=other_ella][value=yes]:checked"
                        // },
                        // "other_ella_2015": {
                        //     required: "input[name=other_ella][value=yes]:checked"
                        // },
                        "declaration": "required"
                    },
                    errorPlacement: function (error, element) {
                        var controlList = element.closest(".control-list");
                        if(controlList.length > 0) {
                            error.insertAfter(controlList[0]);
                        } else 
                            error.insertAfter(element);
                    },
                    invalidHandler: function (event, validator) {
                        passPanel.hide();
                        failPanel.show();
                        //App.scrollTo(t, -200)
                    },
                    highlight: function (element, errorClass) {
                        $(element).closest(".form-group").removeClass("has-success").addClass("has-error");
                    },
                    unhighlight: function (element, errorClass) {
                        $(element).closest(".form-group").removeClass("has-error");
                    },
                    success: function (label) {
                        label.addClass("valid").closest(".form-group").removeClass("has-error").addClass("has-success");
                    },
                    submitHandler: function (form) {
                        passPanel.show();
                        failPanel.hide();
                        //form[0].submit();
                        //console.log("Farts");
                        var formData = $(form).serializeObject();
                        var url = "https://ed5h9uai93.execute-api.ap-southeast-2.amazonaws.com/prod/eoi";// "https://api.elsa.edu.au/web/eoi";                    
                        var apiKey = "huwyil4DTkGbPxduj8062871TorMtjM3CaSRS5Kh";
                        
                        $.ajax({
                            url: url,
                            method: "POST",
                            contentType: "application/json",
                            headers: {
                                "x-api-key": apiKey
                            },
                            data: JSON.stringify(formData)
                        }).done(function(result) {
                            alert( "success" );
                        })
                        .fail(function( jqXHR, textStatus ) {
                            alert( "error" );
                        })
                        .always(function() {
                            alert( "complete" );
                        });
                    }
                });
                
                var updateStep = function (tab, navigation, index) {
                    var tabCount = navigation.find("li").length,
                        current = index + 1;
                    $(".step-title", $("#eoi-form-wizard")).text("Step " + (current) + " of " + tabCount);
                    $("li", $("#eoi-form-wizard")).removeClass("done");

                    for (var nav = navigation.find("li"), i = 0; index > i; i++) {
                        $(nav[i]).addClass("done");
                    }

                    if(1 == current)
                        $("#eoi-form-wizard").find(".button-previous").hide();
                    else
                        $("#eoi-form-wizard").find(".button-previous").show();

                    if( current >= tabCount) {
                        $("#eoi-form-wizard").find(".button-next").hide();
                        $("#eoi-form-wizard").find(".button-submit").show();
                    } else {
                        $("#eoi-form-wizard").find(".button-next").show();
                        $("#eoi-form-wizard").find(".button-submit").hide();
                    }

                    // App.scrollTo($(".page-title"))
                };

                $("#eoi-form-wizard").bootstrapWizard({
                    nextSelector: ".button-next",
                    previousSelector: ".button-previous",
                    onTabClick: function (tab, navigation, index) {
                        return false;
                    },
                    onNext: function (tab, navigation, index) {
                        passPanel.hide();
                        failPanel.hide();

                        if(!form.valid())
                            return false;
                        
                        updateStep(tab, navigation, index);
                    },
                    onPrevious: function (tab, navigation, index) {
                        passPanel.hide();
                        failPanel.hide();
                        updateStep(tab, navigation, index);
                    },
                    onTabShow: function (tab, navigation, index) {
                        var tabCount = navigation.find("li").length,
                            current = index + 1,
                            perc = current / tabCount * 100;
                        $("#eoi-form-wizard").find(".progress-bar").css({
                            width: perc + "%"
                        })
                    }
                });

                $("#eoi-form-wizard").find(".button-previous").hide();

                $("#eoi-form-wizard .button-submit").click(function () {
                    if(form.valid()) {
                        form.submit();
                    }
                }).hide();

                $("input[name=provide_primary]").change(function () {
                    if (this.checked) {
                        $('#primary_contact').removeClass('hide');
                    } else {
                        $('#primary_contact').addClass('hide');
                    }
                });

                $("input[name=provide_secondary]").change(function () {
                    if (this.checked) {
                        $('#secondary_contact').removeClass('hide');
                    } else {
                        $('#secondary_contact').addClass('hide');
                    }
                });

                $('input[name=other_ella]').change(function () {
                    var val = $('input[name=other_ella]:checked', '#eoi-form-wizard').val();
                    if (val == 'yes') {
                        $('#ella-details').removeClass('hide');
                    } else {
                        $('#ella-details').addClass('hide');
                    }
                });

                // $("#country_list", r).change(function () {
                //      r.validate().element($(this))
                // })

                // $('#eoi-form-wizard').bootstrapWizard('show', 3);
                
            }
        }
    }
} ();

//http://stackoverflow.com/questions/1184624/convert-form-data-to-javascript-object-with-jquery
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

jQuery(document).ready(function () {
    FormWizard.init()
});

