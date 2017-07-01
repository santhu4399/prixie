var request = require("request");
module.exports.adaptSchedule = function(suburl,callback){
  request({
    url:"https://prixie-api.herokuapp.com/interview_schedules/"+suburl,
    method:"Get"
  },function(error,res){
    if(error) throw err;
    var responseData = JSON.parse(res.body);
    var dataFormat = "";
    for (var i = 0; i < responseData.length; i++) {
      dataFormat = dataFormat+(responseData[i].company+":\n http://todaywalkins.com/"+responseData[i].website+"\n\n");
    }
    return callback(dataFormat);
  });
}
module.exports.adaptFilterSchedule = function(suburl,callback){
  request({
    url:"https://prixie-api.herokuapp.com/"+suburl,
    method:"Get"
  },function(error,res){
    if(error) throw err;
    var responseData = JSON.parse(res.body);
    var dataFormat = "";
    for (var i = 0; i < responseData.length; i++) {
      function getSal(){
            if (responseData[i].Salary) {
              console.log("Salary given");
              return responseData[i].Salary;
            }else {
              console.log("Salary not given");
              return "---";
            }
      }
      dataFormat = ("Company: "+responseData[i].company+".\nWebsite: "+responseData[i].Website+"\nJob Role: "+responseData[i].Job_Role+"\nEligibility: "+responseData[i].Eligibility+"\nExperience: "+responseData[i].Experience+"\nSalary: "+getSal());
    }
    return callback(dataFormat);
    //console.log(dataFormat);
  });
}
