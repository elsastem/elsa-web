'use strict';
const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();
var AWS = require('aws-sdk');
const ELSA_TABLE = "ELSA_EOI";

const https = require('https');
const url = require('url');
const slack_url = 'https://hooks.slack.com/services/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';
const slack_req_opts = url.parse(slack_url);
slack_req_opts.method = 'POST';
slack_req_opts.headers = {'Content-Type': 'application/json'};

exports.handler = (event, context, done) => {
    var params = {
        TableName: ELSA_TABLE,
        AttributesToGet: ['uid', 'date', 'preschool_address_state', 'preschool_address_postcode', 'other_discover', 'other_ella', 'preschool_type']
    };
    
    var docClient = new AWS.DynamoDB.DocumentClient();
    docClient.scan(params, onScan);
    var records = [];
    
    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            done(err);
        } else {
            records = records.concat(data.Items);

            if (typeof data.LastEvaluatedKey != "undefined") {
                //console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            } else {
                //console.log("Got them all...");
                var discoveryGroups = groupBy(records, "other_discover");
                var preschoolGroups = groupBy(records, "preschool_type");
                var stateGroups = groupBy(records, "preschool_address_state");

                var govRecords = records.filter(rec => rec.preschool_type == "school_gov");
                var govByStateGroups = groupBy(govRecords, "preschool_address_state");
                console.log(govByStateGroups);

                //console.log(JSON.stringify(records));
                var ellaCount = records.filter(rec => rec.other_ella == "yes").length;
                var discoveryCounts = Object.keys(discoveryGroups).map(key => `${key}: ${discoveryGroups[key].length}`);
                var typeCounts = Object.keys(preschoolGroups).map(key => `${key}: ${preschoolGroups[key].length}`);
                var stateCounts = Object.keys(stateGroups).map(key => `${key}: ${stateGroups[key].length}`);
                var govByStateCounts = Object.keys(govByStateGroups).map(key => `${key}: ${govByStateGroups[key].length}`);
                var now = new Date();
                var yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                var todayEois = records.filter(rec => (new Date(rec.date) > yesterday));
                var message = `*Report for ${now.toLocaleDateString()}:*\n`;
                message += "_Totals_\n";
                message += "```\n";
                message += `<24hrs EOI's: ${todayEois.length}\n`;
                message += `Total EOI's: ${records.length}\n`;
                message += `ELLA: ${ellaCount}\n`;
                message += "```\n";
                
                message += "_How did you hear about ELSA?_\n";
                message += "```\n";
                message += discoveryCounts.join('\n');
                message += "```\n";
                
                message += "_Preschool Types_\n";
                message += "```\n";
                message += typeCounts.join('\n');
                message += "```\n";

                message += "_State_\n";
                message += "```\n";
                message += stateCounts.join('\n');
                message += "```\n";
                
                message += "_Gov Schools by State_\n";
                message += "```\n";
                message += govByStateCounts.join('\n');
                message += "```\n";
                
    
                //console.log(message);
                sendSlackNotification(message, done);
            }
        }
    }
};

function groupBy(list, field) {
    return list.reduce(function(memo, rec) {
        if(!(rec[field] in memo)) 
            memo[rec[field]] = [];
        memo[rec[field]].push(rec);
        return memo;
    }, {});
}

function sendSlackNotification(message, cb) {
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
    req.write(JSON.stringify({text: message}));
    req.end();    
}
