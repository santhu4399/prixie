var request =  require("request");
var apiai = require("apiai");


//var api = apiai("7433fe3c52d24fe18ab37483aadb517a");
//var api = apiai("34959a387b7540929f81521d84577970");
var api = apiai("0234db581fca4495b6b48d02cae74333");
var callSendAPI = require("./callSendApi");
var msgControllermodule = require("./msgController")
var adaptTutorials = require("../adapters/adaptTutorials");

module.exports = function(recipientId, messageText) {
  var msg = api.textRequest(messageText, {
      sessionId: 'recipientId'
  });

  msg.on('response', function(response) {
            console.log(response);
            if (response.result.action) {
              if (response.result.action == "Tutorials") {
                console.log("action catched in Tutorials");
                if (response.result.parameters.Subject) {
                  console.log("action catched in Tutorials as subject");
                  var url = response.result.parameters.Subject;
                  adaptTutorials.adaptTutorial(url,function(callback){
                    var messageData ={
                      "recipient":{
                        "id":recipientId
                      },
                      "message":{
                        "attachment":{
                          "type":"template",
                          "payload":{
                            "template_type":"open_graph",
                            "elements":[
                              {
                                "url":callback,

                              }
                            ]
                          }
                        }
                      }
                    }
                    callSendAPI(messageData);
                  });
                }else {
                  msgControllermodule.getTutorialList(recipientId);
                }
              }
              else if (response.result.action == "InterviewSchedule") {
                console.log("action catched in InterviewSchedule");
                var params = response.result.parameters;
                 //var company = params.company;
                 var date = params.date;
                 var Job_Role = params.Job_Role;
                 //var subject = params.Subject;
                 var experience = params.Experience;

                 var myurl = "Mainframe Developer";
                 if (!date&&!Job_Role&&!experience) {
                   console.log("no params");
                   msgControllermodule.getFilterInterviewSchedules(myurl,recipientId);
                 }else{
                    console.log("its params");
                    if (date&&!Job_Role&&!experience) {
                      console.log("only date param");
                      msgControllermodule.getFilterInterviewSchedules(date,recipientId);
                    }
                    if (!date&&Job_Role&&!experience) {
                      console.log("only jobrole param");
                      msgControllermodule.getFilterInterviewSchedules(Job_Role,recipientId);
                    }
                    if (!date&&!Job_Role&&experience) {
                      console.log("only experience param");
                      if (experience == "fresher||freshers") {
                        console.log("exp as fresher");
                        msgControllermodule.getFilterInterviewSchedules(experience,recipientId);
                      }else if (experience == !isNaN) {
                        console.log("exp as number");
                        msgControllermodule.getFilterInterviewSchedules(experience,recipientId);
                      }
                      else {
                        var expmin = params.Experience.min;
                        var expmax = params.Experience.max;
                        if (expmax) {
                          console.log("min and max");
                          msgControllermodule.getFilterInterviewSchedules(expmin,expmax,recipientId);
                        }else {
                          console.log("min only");
                          msgControllermodule.getFilterInterviewSchedules(expmin,recipientId);
                        }
                      }

                    }
                 }


              //  msgControllermodule.getInterviewSchedules(recipientId);

              }

          var textmsg = response.result.fulfillment.speech;
          var messageData = {
            recipient: {
              id: recipientId
            },
            message: {
                text: textmsg
              }
          };
          callSendAPI(messageData);

  }
  else {
    var textmsg = response.result.fulfillment.speech;
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
          text: textmsg
        }
    };
    callSendAPI(messageData);
  }

});//closing of apiai msg.on(response) function
  msg.on('error', function(error) {
    console.log(error);
  });
  msg.end();
}
