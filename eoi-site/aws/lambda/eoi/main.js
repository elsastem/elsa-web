'use strict';

console.log('Loading function');

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

var AWS = require('aws-sdk');
var kms = new AWS.KMS({region: 'ap-southeast-2'});
var keyId = "arn:aws:kms:ap-southeast-2:531028396584:key/417c6f80-7652-4670-8105-829ba6ad8262"; //ELSA

const ELSA_TABLE = "ELSA_EOI";

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
            // 'Access-Control-Allow-Headers': 'Content-Type,X-Api-Key'
        },
    });

    switch (event.httpMethod) {
        // case 'DELETE':
        //     dynamo.deleteItem(JSON.parse(event.body), done);
        //     break;
        // case 'GET':
            // dynamo.scan({ TableName: ELSA_TABLE }, function(err, res) {
            //     if(err)
            //         done(err, res);
            //     else {
            //         //done(null, res.Items[0]);
            //         res.Items.slice(-1).forEach(function(item) {
            //             console.log(JSON.stringify(item, null, 4 ));
            //             var params = {
            //                 CiphertextBlob: item.director_email
            //             };
    
            //             kms.decrypt(params, function(err, data) {
            //                   if (err) {
            //                       console.log(err, err.stack);
            //                       done(err);
            //                   }
            //                   else {
            //                     var decryptedScret = data.Plaintext.toString();
            //                     console.log(decryptedScret);
            //                     done(null,{decrypted: decryptedScret});
            //                   }
            //             });
            //         });
            //     }
            // });
            // break;
         case 'POST':
            let data = JSON.parse(event.body);
            var error = validationError(data);
            if(error) {
                done(error);
            } else {
                dealWithBlanks(data);

                encryptData(data, function(err, result) {
                    if(err) 
                        done(err);
                    else {
                        result.uid = guid();
                        result.date = (new Date()).toISOString();
                        let payload = {
                            TableName: ELSA_TABLE,
                            Item: result
                        }
                        dynamo.putItem(payload, done);
                        // dynamo.scan({ TableName: ELSA_TABLE }, done);
                    }
                })
            }
            break;
        // case 'PUT':
        //     dynamo.updateItem(JSON.parse(event.body), done);
        //     break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};

var validationError = function(data) {
    var valid = true;

    var validFields = ["waiver", "tablet_count", "tablet_info", "tablet_commitment","other_discover_text","preschool_name","preschool_address_line1","preschool_address_line2","preschool_address_suburb","preschool_address_postcode","preschool_service_number","preschool_provider_name","preschool_provider_number","wifi","prekindy","teacher","device","director_name","director_position","director_email","director_phone","provide_primary","primary_name","primary_position","primary_email","primary_phone","provide_secondary","secondary_name","secondary_position","secondary_email","secondary_phone","other_discover","other_count","other_atsi_owned","other_atsi_director","other_atsi_enrolled","other_atsi_engage","other_atsi_activities","other_atsi_other_text","other_atsi_other","other_ella","other_ella_2017","other_ella_2016","other_ella_2015","declaration"];
    var dataKeys = Object.keys(data);
    
    dataKeys.forEach(function(dataKey) {
        var index = validFields.indexOf(dataKey);
        if(index == -1) {
            return new Error(`Invalid field: "${dataKey}"`)
        }
    })
    
    return null; //no error
}

var dealWithBlanks = function(data) {
    var keys = Object.keys(data);
    keys.forEach(function(key) {
        if(!data[key]){
            delete data[key];   
        }
    });    
}

var guid = function (){
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

var encryptData = function(data, cb) {

    var fieldsToEncrypt = ["other_atsi_owned","other_atsi_other_text","other_atsi_other","other_atsi_director","other_atsi_enrolled","other_atsi_engage","other_atsi_activities","director_name","director_position","director_email","director_phone","provide_primary","primary_name","primary_position","primary_email","primary_phone","provide_secondary","secondary_name","secondary_position","secondary_email","secondary_phone"];
    var count = fieldsToEncrypt.length;
    
    var encryptInternal = function (data, cb_internal) {
        count = count - 1;
        var key = fieldsToEncrypt[count];

        if (data[key] !== undefined) {
            var params = {
                KeyId: keyId,
                Plaintext: data[key]
            };

            kms.encrypt(params, function(err, encryptResult) {
                if (err) {
                    cb_internal(new Error(`Encryption Failed: "${err}"`)); // an error occurred
                }
                else {
                    data[key] = encryptResult.CiphertextBlob;
                    if(count > 0)
                        encryptInternal(data, cb_internal);
                    else
                        cb_internal(null, data);
                }     
            });
        } else {
            if(count > 0)
                encryptInternal(data, cb_internal);
            else
                cb_internal(null, data);
        }
    }
    
    encryptInternal(data, cb);
}