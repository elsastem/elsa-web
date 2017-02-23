//I grabbed most of this from another site, thus it is minified

var FormWizard = function () {
    return {
        init: function () {
            if (jQuery().bootstrapWizard) {
                var form = $("#eoi_form"),
                    failPanel = $(".alert-danger", form),
                    passPanel = $(".alert-success", form);

                $.validator.addMethod("notno", function (value, element, params) {
                    return this.optional(element) || value != "no";
                }, $.validator.format("{0}"));

                form.validate({
                    doNotHideMessage: true,
                    errorElement: "span",
                    errorClass: "help-block help-block-error",
                    focusInvalid: false,
                    messages: {
                        other_atsi_other_text: "You need to supply a reason if you check the other box."
                    },
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
                        "preschool_service_number": {
                            required: true,
                        },
                        "preschool_provider_name": "required",
                        "preschool_provider_number": "required",
                        "preschool_rating": "required",
                        "preschool_type": "required",
                        "wifi": {
                            required: true,
                            notno: "An active internet connection is required to participate in ELSA. Please check our Participation Guidelines for more information."
                        },
                        "prekindy": {
                            required: true,
                            notno: "A preschool/kindergarten program primarily for children is required to participate in ELSA. Please check our Participation Guidelines for more information."
                        },
                        "teacher": "required",
                        "waiver": {
                            required: "input[name=teacher][value=no]:checked",
                            notno: "Without a degree-qualified teacher, you will need a waiver is required to participate in ELSA. Please check our Participation Guidelines for more information."
                        },
                        "device": "required",
                        "tablet_count": {
                            required: "input[name=device][value=yes]:checked",
                            number: true,
                            min: 1
                        },
                        // "tablet_info": {
                        //     required: "input[name=device][value=yes]:checked",
                        // },
                        "tablet_commitment": {
                            required: "input[name=device][value=no]:checked",
                            notno: "A tablet device, or commitment to purchase one is required to participate in ELSA. Please check our Participation Guidelines for more information."
                        },
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
                        "other_discover_text": {
                            required: "input.need-more-info:checked"
                        },
                        "other_count": "required",
                        // "other_atsi_owned",
                        // "other_atsi_director",
                        // "other_atsi_enrolled",
                        // "other_atsi_engage",
                        // "other_atsi_activities",
                        "other_atsi_other_text": {
                            required: "input[name=other_atsi_other]:checked"
                        },
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
                        if (controlList.length > 0) {
                            error.insertAfter(controlList[0]);
                        } else
                            error.insertAfter(element);
                    },
                    invalidHandler: function (event, validator) {
                        passPanel.hide();
                        failPanel.show();
                        //App.scrollTo(t, -200)
                        if (!validator.numberOfInvalids())
                            return;

                        $('html, body').animate({
                            scrollTop: $(failPanel).offset().top - $("nav").height()
                        }, 1000);
                    },
                    highlight: function (element, errorClass) {
                        $(element).closest(".form-group").removeClass("has-success").addClass("has-error");
                    },
                    unhighlight: function (element, errorClass) {
                        $(element).closest(".form-group").removeClass("has-error");
                    },
                    success: function (label) {
                        label.addClass("valid").closest(".form-group").removeClass("has-error")//.addClass("has-success");
                    },
                    submitHandler: function (form) {
                        passPanel.hide();
                        failPanel.hide();
                        $("#eoi-form-wizard .form-actions").addClass('hide');
                        $("#eoi-form-wizard .tab-content").addClass('hide');
                        $("#eoi-form-wizard .failed").addClass('hide');
                        $("#eoi-form-wizard .loading").removeClass('hide');
                        //form[0].submit();
                        //console.log("Farts");
                        var formData = $(form).serializeObject();
                        var url = "https://api.elsa.edu.au/web/eoi";
                        var apiKey = "huwyil4DTkGbPxduj8062871TorMtjM3CaSRS5Kh";

                        $.ajax({
                            url: url,
                            method: "POST",
                            contentType: "application/json",
                            headers: {
                                "x-api-key": apiKey
                            },
                            data: JSON.stringify(formData)
                        }).done(function (result) {
                            $("#eoi-form-wizard .submitted").removeClass('hide');
                        })
                            .fail(function (jqXHR, textStatus) {
                                $("#eoi-form-wizard .failed").removeClass('hide');
                            })
                            .always(function () {
                                $("#eoi-form-wizard .loading").addClass('hide');
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

                    if (1 == current)
                        $("#eoi-form-wizard").find(".button-previous").hide();
                    else
                        $("#eoi-form-wizard").find(".button-previous").show();

                    if (current >= tabCount) {
                        $("#eoi-form-wizard").find(".button-next").hide();
                        $("#eoi-form-wizard").find(".button-submit").show();
                    } else {
                        $("#eoi-form-wizard").find(".button-next").show();
                        $("#eoi-form-wizard").find(".button-submit").hide();
                    }

                    // App.scrollTo($(".page-title"))
                    $('html, body').animate({
                        scrollTop: $('#eoi-form-wizard').offset().top - $("nav").height()
                    }, 1000);

                };

                $("#eoi-form-wizard").bootstrapWizard({
                    nextSelector: ".button-next",
                    previousSelector: ".button-previous",
                    onTabClick: function (tab, navigation, index) {
                        return false;
                    },
                    onNext: function (tab, navigation, index) {
                        $(".button-next").blur();
                        passPanel.hide();
                        failPanel.hide();

                        if (!form.valid())
                            return false;

                        updateStep(tab, navigation, index);
                    },
                    onPrevious: function (tab, navigation, index) {
                        $(".button-previous").blur();
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
                    if (form.valid()) {
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

                $('#other_discover input').change(function () {
                    var val = $('.need-more-info:checked', '#eoi-form-wizard').val();
                    if (val) {
                        $('#other_discover_text').removeClass('hide');
                    } else {
                        $('#other_discover_text').addClass('hide');
                    }
                });

                $('input[name=device]').change(function () {
                    var val = $('input[name=device]:checked', '#eoi-form-wizard').val();
                    if (val == 'yes') {
                        $('#tablet_yes').removeClass('hide');
                        $('#tablet_no').addClass('hide');
                    } else {
                        $('#tablet_no').removeClass('hide');
                        $('#tablet_yes').addClass('hide');
                    }
                });

                $('input[name=teacher]').change(function () {
                    var val = $('input[name=teacher]:checked', '#eoi-form-wizard').val();
                    if (val == 'no') {
                        $('#teacher_no').removeClass('hide');
                    } else {
                        $('#teacher_no').addClass('hide');
                    }
                });

                $("input[name=other_atsi_other]").change(function() {
                    if ($('input[name=other_atsi_other]').prop("checked")) {
                        $('#atsiOther').removeClass('hide');
                    } else {
                        $('#atsiOther').addClass('hide');
                    }
                })

                $('#submit_failed').click(function () {
                    $("#eoi-form-wizard .failed").addClass('hide');
                    $("#eoi-form-wizard .form-actions").removeClass('hide');
                    $("#eoi-form-wizard .tab-content").removeClass('hide');
                });
            }
        }
    }
}();

//http://stackoverflow.com/questions/1184624/convert-form-data-to-javascript-object-with-jquery
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
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

