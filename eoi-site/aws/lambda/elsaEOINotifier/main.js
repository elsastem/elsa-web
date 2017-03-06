'use strict';

const https = require('https');
const url = require('url');
const slack_url = 'https://hooks.slack.com/services/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';
const slack_req_opts = url.parse(slack_url);
slack_req_opts.method = 'POST';
slack_req_opts.headers = {'Content-Type': 'application/json'};

const aws = require('aws-sdk');
var ses = new aws.SES({
    region: "us-west-2"
});
const EMAIL_FROM_NAME = "ELSA Team";
const EMAIL_FROM = "team@elsa.edu.au";
const EMAIL_SUBJECT = "Application received";

var kms = new aws.KMS({region: 'ap-southeast-2'});
//var keyId = "arn:aws:kms:ap-southeast-2:531028396584:key/417c6f80-7652-4670-8105-829ba6ad8262"; //ELSA

console.log('Loading function');

exports.handler = (event, context, callback) => {
    var errors = [];
    var asyncWaiting = 0;

    event.Records.forEach((record) => {
        if(record.eventName === 'INSERT') {
            asyncWaiting++;
            console.log(`Async Count: ${asyncWaiting}`);
            processRecord(record, function(err, result) {
                if(err) {
                    errors.push(err);                
                }
                asyncWaiting--;
                console.log(`Async Count: ${asyncWaiting}`);
                if(!asyncWaiting) {
                    //all done
                    if(errors.length > 0) {
                        //errors
                        console.log("Errors");
                        console.log(JSON.stringify(errors));
                        callback(errors);
                    } else {
                        //All successfull
                        console.log("All Succeeded");
                        callback(null, `Successfully processed ${event.Records.length} records.`);
                    }
                }
            })
        }
    });
    
    if(!asyncWaiting) {
        console.log("No inserts to process. All ok.");
        callback(null, `Successfully processed ${event.Records.length} records.`);
    }
};

function processRecord(record, cb) {
    console.log(`Processing Record EventId: ${record.eventID}`)
    sendEmail(record, function(err, data) {
        if(err) {
            console.log(err);
            cb(err);
        } else {
            console.log("SUCCESS: Sent email")
            sendSlackNotification(record, function(err, result) {
                if(err) {
                    console.log(err);
                    cb(err);
                } else {
                    console.log("SUCCESS: Sent slack")
                    cb(null, "Record Processed");
                }
            });
        }
    });
}

function sendSlackNotification(record, cb) {
    var req = https.request(slack_req_opts, function (res) {
        if (res.statusCode === 200) {
            cb(null, 'Posted to Slack');
        } else {
            cb(new Error(`Slack Failed: Status code ${res.statusCode}`));
        }
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
        cb(new Error(e.message));
    });

    var message = "Someone expressed interest from postcode: " + record.dynamodb.NewImage.preschool_address_postcode.S;

    req.write(JSON.stringify({text: message}));

    req.end();    
}

function decryptField(base64String, cb) {
    var buf = new Buffer(base64String, 'base64');
    var params = {
        CiphertextBlob: buf
    };
    
    //console.log(JSON.stringify(params, null, 4 ));

    kms.decrypt(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            cb(err);
        }
        else {
            var decryptedSecret = data.Plaintext.toString();
            //console.log(decryptedSecret);
            cb(null,{secret: decryptedSecret});
        }
    });
}

function sendEmail(rec, cb) {
    var emailText = "Thank you for your interest in the 2018 ELSA Pilot. Your application has been received. After applications close, we will select one hundred preschools for the Pilot to reflect preschool diversity across Australia. Selections will be announced in August 2017. \n\nIf you have any queries, please contact us at team@elsa.edu.au.\n\nThanks again from the team at Early Learning STEM Australia.";
    var emailHtml = "<p>Thank you for your interest in the 2018 ELSA Pilot. Your application has been received. After applications close, we will select one hundred preschools for the Pilot to reflect preschool diversity across Australia. Selections will be announced in August 2017.</p><p>If you have any queries, please contact us at <a href='mailto:team@elsa.edu.au'>team@elsa.edu.au</a>.</p><p>Thanks again from the team at <a href='https://elsa.edu.au/'>Early Learning STEM Australia</a>.</p>";
    
    var encryptedEmail = null;
    //console.log(JSON.stringify(rec, null, 4));
    if(rec.dynamodb.NewImage.primary_email) {
        encryptedEmail = rec.dynamodb.NewImage.primary_email.B;
    } else if(rec.dynamodb.NewImage.director_email) {
        encryptedEmail = rec.dynamodb.NewImage.director_email.B;
    }

    if(!encryptedEmail) {
        console.log("No email present.");
        cb(new Error("No Email found"));
    } else {
        decryptField(encryptedEmail, function(err, val) {
            if(err) {
                cb(err);
            } else {
                var email = val.secret;
                var params = {
                    Destination: {
                        ToAddresses: [email]
                    },
                    Message: {
                        Subject: {
                            Data: EMAIL_SUBJECT,
                            Charset: 'UTF-8'
                        },
                        Body: {
                            Text: {
                                Data: emailText,
                                Charset: 'UTF-8'
                            },
                            Html: {
                                Data: emailHtml
                                //Charset: 'UTF-8'
                            }
                        }
                    },
                    Source: `${EMAIL_FROM_NAME}<${EMAIL_FROM}>`,
                    ReplyToAddresses: [
                        EMAIL_FROM
                    ]
                };
                
                ses.sendEmail(params, function (err, data) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, data);
                    }
                });                
            }
        })
    }
}