const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'ca-central-1'});


exports.handler = (event, context, callback) => {
    
  console.log("Event:", event)
    
  var cust_id = parseInt(event.pathParameters.customer_id)
  var params = {
    TableName : 'orders',
    FilterExpression : 'customer_id = :id',
    ExpressionAttributeValues : {':id' : cust_id}
  };
    
  docClient.scan(params, function(err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      callback(err, null)
    } else {
      console.log("Query succeeded.");
      const response = {
        "statusCode": 200,
        "headers": {
          "Access-Control-Allow-Origin": "*"
        }, 
        "body": JSON.stringify(data.Items),
        "isBase64Encoded": false
      };
      callback(null, response)
    }
  });
  
};
