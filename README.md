# Lambda function interfacing with Dynamodb
The two functions were part of a sentiment analysis project as follows:

1) Client writes one sentence for evaluation in a web interface, then front end sends the sentences to lambda function through a REST API triggers "post_function" function through an API gateway, this function invokes a machine learning service for sentence evaluation: {positive, negative}, and finally store the result in a dynamoDB instance.

2) Front end send another request to lambda function through a REST API triggers "post_function" function through an API gateway to get all the previous evaluated sentences with the recent one on top of the list to return it back to the client, the lambda function gets data {sentences, evaluation} from the DynamoDB and returns it back to the front end.
