//I grabbed most of this from another site, thus it is minified

var SubscribeForm = function () {
    return {
        init: function () {
            var form = $("#subscribeForm"),
                failPanel = $(".alert-danger", form),
                passPanel = $(".alert-success", form);

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
                    // "business": "required",
                    // "name": "required",
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

                    form.submit();
                    // var formData = $(form).serializeObject();
                    // // var url = "https://api.elsa.edu.au/web/subscribe";                  
                    // // var apiKey = "huwyil4DTkGbPxduj8062871TorMtjM3CaSRS5Kh";
                    // var url = "//elsa.us15.list-manage.com/subscribe/post-json?u=e53a67afd496b56ee24b3cf99&amp;id=45f25b63ab&amp;c=?"; //mailchimp

                    // $("#subscribe .text").addClass('hide');
                    // $("#subscribe .spinner").removeClass('hide');

                    // $.ajax({
                    //     url: url,
                    //     method: "GET",
                    //     contentType: "application/json",
                    //     // headers: {
                    //     //     "x-api-key": apiKey
                    //     // },
                    //     data: JSON.stringify(formData)
                    // })
                    //     .done(function (result) {
                    //         failPanel.hide();
                    //         passPanel.show();
                    //     })
                    //     .fail(function (jqXHR, textStatus) {
                    //         failPanel.show();
                    //         passPanel.hide();
                    //     })
                    //     .always(function () {
                    //         $("#subscribe .text").removeClass('hide');
                    //         $("#subscribe .spinner").addClass('hide');
                    //     });
                }
            });

            // $("#subscribe").click(function () {
            //     if (form.valid()) {
            //         //form.submit();
            //     }
            // });

            $("#signup-form-subscribe").click(function(e) {
                e.preventDefault();

                var url = "https://api.elsa.edu.au/web/subscribe"; //mailchimp
                var apiKey = "huwyil4DTkGbPxduj8062871TorMtjM3CaSRS5Kh";
                var formData = $("#signup-form").serializeObject();
                //formData.listId = '45f25b63ab';
                formData.email = formData.EMAIL;

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
                    console.log(result);
                })
                .fail(function (jqXHR, textStatus) {
                    console.log(textStatus);
                })
                .always(function () {
                });
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

