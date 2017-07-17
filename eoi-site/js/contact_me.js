var SubscribeForm = function () {
    return {
        init: function () {
            var form = $("#signup-form");

            form.validate({
                doNotHideMessage: true,
                errorElement: "span",
                errorClass: "help-block help-block-error",
                focusInvalid: true,
                rules: {
                    "EMAIL": {
                        required: true,
                        email: true
                    },
                },
                errorPlacement: function (error, element) {
                    var controlList = element.closest(".control-list");
                    if (controlList.length > 0) {
                        error.insertAfter(controlList[0]);
                    } else
                        error.insertAfter(element);
                },
                invalidHandler: function (event, validator) {
                    if (!validator.numberOfInvalids())
                        return;
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
                    var url = "https://api.elsa.edu.au/web/subscribe"; //mailchimp
                    var apiKey = "huwyil4DTkGbPxduj8062871TorMtjM3CaSRS5Kh";
                    var formData = $("#signup-form").serializeObject();
                    //formData.listId = '45f25b63ab';
                    formData.email = formData.EMAIL;
                    $('#loadingBtn').removeClass('hide');
                    $('#goBtn').addClass('hide');

                    $.ajax({
                        url: url,
                        method: "POST",
                        contentType: "application/json",
                        headers: {
                            "x-api-key": apiKey
                        },
                        data: JSON.stringify(formData)
                    })
                        .done(function (result) {
                            $("#signup_main").addClass('hide');
                            $("#signup_thankyou").removeClass('hide');
                        })
                        .fail(function (jqXHR, textStatus) {
                            if (jqXHR.responseJSON && jqXHR.responseJSON.title == "Member Exists") {
                                $("#mce-exists-error").css('display', 'block');
                                $("#mce-exists-error").text("Already subscribed");
                            }
                        })
                        .always(function () {
                            $('#loadingBtn').addClass('hide');
                            $('#goBtn').removeClass('hide');
                        });
                }
            });

            $("#mce-EMAIL").on('keydown', function(e) {
                $("#mce-exists-error").css('display', 'none');
            })

            // $('a[href="#signup"]').on('click', function(e) {
            $('#signup, a[href="#signup"]').on('click', function(e) {
                e.preventDefault();
                $('#signup-dp').parent().addClass('open');
                return false;
            })
           
            $('#signup-dp .close-btn').on('click', function(e) {
                e.preventDefault();
                $('#signup-dp').parent().removeClass('open');
                return false;
            });
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
    SubscribeForm.init();
});

