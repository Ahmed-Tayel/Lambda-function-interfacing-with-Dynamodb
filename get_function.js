var AWS = require("aws-sdk");

exports.handler = async (event) => {
    

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "Tweets";

var ID = 1;

var mlcomment;
var mllabel;
var results = [];


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

//Insert the new value to the database
var params = {
    TableName:table,
    Item:{
        "usrcomment": mlcomment,
        "label": mllabel
    }
};

return results;

};
