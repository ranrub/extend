/**
* @param context {WebtaskContext}
* 
* WebHook Example:  
* Send a SMS message via twilio to someone based on incident type
* https://v2.developer.pagerduty.com/docs/webhooks-overview
* 
* 
* 
* 
*/



/**
* @param context {WebtaskContext}
*/
function parsePagerDuty(context){
  return new Promise(function (resolve, reject) {
    var messages = context.data.messages;
    var type = messages[0].type;
    var incidentURL = messages[0].data.incident.html_url;
    var message = `${type} was logged, please review at this url.`;
    if(!message){
        reject({message:"Error Paersing", incidentURL:"internal.error", type: "internal"});
    }
        resolve({message:message, incidentURL:incidentURL, type: type});
      });
}


function sendSMS(context,cb){
// Twilio Credentials
// Todo setup new acount and another number to Twilio account
const accountSid = context.secrets.twilio_accountSid; 
const authToken = context.secrets.twilio_authToken;

const TWILIO_PHONENUMBER =  '+4158538459' //'+14152026703'
var callerID = (context.data.From) ? context.data.From: "+14153504579";

  
var alertMessage;

parsePagerDuty(context).then(function(results){
  alertMessage = results;
  // new
var Twilio = require('twilio');
var twilio = new Twilio(accountSid, authToken);

const MessagingResponse = require('twilio').twiml.MessagingResponse;

const response = new MessagingResponse();
const message = response.message();
message.body(alertMessage.message + '\n' + alertMessage.incidentURL);
/* message.media('https://demo.twilio.com/owl.png'); */
console.log(response.toString());
var smsResults  = response.toString();

  // error, results
  cb(null, smsResults);
  })
  .catch(function(error){
   cb(error);
  });
}


const samplePagerDutyData = {
	"messages": [{
		"type": "incident.trigger",
		"data": {
			"incident": {
				"id": "PRORDTY",
				"incident_number": 2126,
				"created_on": "2016-02-22T21:02:55Z",
				"status": "triggered",
				"pending_actions": [{
					"type": "escalate",
					"at": "2016-02-22T13:07:55-08:00"
				}, {
					"type": "resolve",
					"at": "2016-02-22T17:02:55-08:00"
				}],
				"html_url": "https://webdemo.pagerduty.com/incidents/PRORDTY",
				"incident_key": "17a02d0d370d4add8e53132199614121",
				"service": {
					"id": "PDS1SN6",
					"name": "Production XDB Cluster",
					"html_url": "https://webdemo.pagerduty.com/services/PDS1SN6",
					"deleted_at": null,
					"description": "Primary production datastore."
				},
				"escalation_policy": {
					"id": "P5ARF12",
					"name": "Database Team",
					"deleted_at": null
				},
				"assigned_to_user": {
					"id": "P553OPV",
					"name": "Laura Haley",
					"email": "laura.haley@example.com",
					"html_url": "https://webdemo.pagerduty.com/users/P553OPV"
				},
				"trigger_summary_data": {
					"subject": "CPU Load High on xdb_production_echo"
				},
				"trigger_details_html_url": "https://webdemo.pagerduty.com/incidents/PRORDTY/log_entries/Q2AIXW2ZIMCI4P",
				"trigger_type": "web_trigger",
				"last_status_change_on": "2016-02-22T21:02:55Z",
				"last_status_change_by": null,
				"number_of_escalations": 0,
				"assigned_to": [{
					"at": "2016-02-22T21:02:55Z",
					"object": {
						"id": "P553OPV",
						"name": "Laura Haley",
						"email": "laura.haley@example.com",
						"html_url": "https://webdemo.pagerduty.com/users/P553OPV",
						"type": "user"
					}
				}],
				"urgency": "high"
			}
		},
		"id": "a52d3f80-d9a7-11e5-8db3-22000ad5aec9",
		"created_on": "2016-02-22T21:02:55Z"
	}]
};

module.exports = function(context, cb) {
  var messages = samplePagerDutyData;
  context.data = messages;
  console.log(messages);
  
  sendSMS(context,cb);

};