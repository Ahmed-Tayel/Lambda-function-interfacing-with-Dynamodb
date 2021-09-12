var AWS = require("aws-sdk");
var axios = require('axios');

exports.handler = async (event) => {
    

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "Tweets";

var ID = 1;

//This part should be for retreiving data from Frontend
var reqObj = {
    "content" : event.content
}

var mlcomment;
var mllabel;
var results = [];

// Simulating getting data from machine learning module
async function getMLdata(){
    try{
        let resObj = []
        let res = await axios.post(process.env.MLURL, reqObj)
        let mllabel = res.data;
        resObj.push({id: ID.toString(), content : reqObj.content, label : mllabel});
        ID = ID + 1;
          return resObj;
    }

    catch (err) {console.error(err);}
}


results = await getMLdata();
mlcomment = results[0].content;
mllabel = results[0].label;


//Scan all the entries
params = {
    TableName: table,
    ProjectionExpression: "usrcomment, label",
};

let data = await docClient.scan(params).promise();

// print all the comments
data.Items.forEach(function(item) {
    var getcomment = item.usrcomment;
    var getlabel = item.label;
    if (getcomment === mlcomment){
        //do nothing
    }
    else{
        results.push({id: ID.toString(), content : getcomment, label : getlabel});
        ID = ID + 1;
    }
}
);

// continue scanning if we have more comments, because
// scan can retrieve a maximum of 1MB of data
if (typeof data.LastEvaluatedKey != "undefined") {
    console.log("Scanning for more...");
    params.ExclusiveStartKey = data.LastEvaluatedKey;
    data = await docClient.scan(params).promise();
}

var payload = {
    "results" : results
}

//Insert the new value to the database
var params = {
    TableName:table,
    Item:{
        "usrcomment": mlcomment,
        "label": mllabel
    }
};

let putRes = await docClient.put(params).promise();

return results;

};
