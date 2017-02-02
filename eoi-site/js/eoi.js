//I grabbed most of this from another site, thus it is minified

var FormWizard = function () {
    return {
        init: function () {
            if (jQuery().bootstrapWizard) {
                var r = $("#eoi_form"),
                    t = $(".alert-danger", r),
                    i = $(".alert-success", r);
                r.validate({
                    doNotHideMessage: true,
                    errorElement: "span",
                    errorClass: "help-block help-block-error",
                    focusInvalid: false,
                    rules: {
                        username: {
                            minlength: 5,
                            required: true
                        },
                        password: {
                            minlength: 5,
                            required: true
                        },
                        rpassword: {
                            minlength: 5,
                            required: true,
                            equalTo: "#submit_form_password"
                        },
                        fullname: {
                            required: true
                        },
                        email: {
                            required: true,
                            email: true
                        },
                        phone: {
                            required: true
                        },
                        gender: {
                            required: true
                        },
                        address: {
                            required: true
                        },
                        city: {
                            required: true
                        },
                        country: {
                            required: true
                        },
                        card_name: {
                            required: true
                        },
                        card_number: {
                            minlength: 16,
                            maxlength: 16,
                            required: true
                        },
                        card_cvc: {
                            digits: true,
                            required: true,
                            minlength: 3,
                            maxlength: 4
                        },
                        card_expiry_date: {
                            required: true
                        },
                        "payment[]": {
                            required: true,
                            minlength: 1
                        }
                    },
                    messages: {
                        "payment[]": {
                            required: "Please select at least one option",
                            minlength: jQuery.validator.format("Please select at least one option")
                        }
                    },
                    errorPlacement: function (e, r) {
                        "gender" == r.attr("name") ? e.insertAfter("#form_gender_error") : "payment[]" == r.attr("name") ? e.insertAfter("#form_payment_error") : e.insertAfter(r)
                    },
                    invalidHandler: function (e, r) {
                        i.hide(), t.show()//, App.scrollTo(t, -200)
                    },
                    highlight: function (e) {
                        $(e).closest(".form-group").removeClass("has-success").addClass("has-error")
                    },
                    unhighlight: function (e) {
                        $(e).closest(".form-group").removeClass("has-error")
                    },
                    success: function (e) {
                        "gender" == e.attr("for") || "payment[]" == e.attr("for") ? (e.closest(".form-group").removeClass("has-error").addClass("has-success"), e.remove()) : e.addClass("valid").closest(".form-group").removeClass("has-error").addClass("has-success")
                    },
                    submitHandler: function (e) {
                        i.show(), t.hide(), e[0].submit()
                    }
                });
                var a = function () {
                    $("#tab4 .form-control-static", r).each(function () {
                        var e = $('[name="' + $(this).attr("data-display") + '"]', r);
                        if (e.is(":radio") && (e = $('[name="' + $(this).attr("data-display") + '"]:checked', r)), e.is(":text") || e.is("textarea")) $(this).html(e.val());
                        else if (e.is("select")) $(this).html(e.find("option:selected").text());
                        else if (e.is(":radio") && e.is(":checked")) $(this).html(e.attr("data-title"));
                        else if ("payment[]" == $(this).attr("data-display")) {
                            var t = [];
                            $('[name="payment[]"]:checked', r).each(function () {
                                t.push($(this).attr("data-title"))
                            }), $(this).html(t.join("<br>"))
                        }
                    })
                };
                var o = function (e, r, t) {
                    var i = r.find("li").length,
                        o = t + 1;
                    $(".step-title", $("#eoi-form-wizard")).text("Step " + (t + 1) + " of " + i);
                    jQuery("li", $("#eoi-form-wizard")).removeClass("done");
                    for (var n = r.find("li"), s = 0; t > s; s++) 
                        jQuery(n[s]).addClass("done");

                    1 == o ? $("#eoi-form-wizard").find(".button-previous").hide() : $("#eoi-form-wizard").find(".button-previous").show(), o >= i ? ($("#eoi-form-wizard").find(".button-next").hide(), $("#eoi-form-wizard").find(".button-submit").show(), a()) : ($("#eoi-form-wizard").find(".button-next").show(), $("#eoi-form-wizard").find(".button-submit").hide());
                    
                    // App.scrollTo($(".page-title"))
                };

                $("#eoi-form-wizard").bootstrapWizard({
                    nextSelector: ".button-next",
                    previousSelector: ".button-previous",
                    onTabClick: function (e, r, t, i) {
                        return false
                    },
                    onNext: function (e, a, n) {
                        return i.hide(), t.hide(), 0 == r.valid() ? false : void o(e, a, n)
                    },
                    onPrevious: function (e, r, a) {
                        i.hide(), t.hide(), o(e, r, a)
                    },
                    onTabShow: function (e, r, t) {
                        var i = r.find("li").length,
                            a = t + 1,
                            o = a / i * 100;
                        $("#eoi-form-wizard").find(".progress-bar").css({
                            width: o + "%"
                        })
                    }
                });
                
                $("#eoi-form-wizard").find(".button-previous").hide();
                
                $("#eoi-form-wizard .button-submit").click(function () {
                    alert("Finished! Hope you like it :)");
                }).hide();

                $("#country_list", r).change(function () {
                    r.validate().element($(this))
                })
            }
        }
    }
} ();
jQuery(document).ready(function () {
    FormWizard.init()
});

