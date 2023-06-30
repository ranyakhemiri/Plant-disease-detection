import json
import boto3
import base64

def parse_response(query_response):
    model_predictions = json.loads(query_response)
    normalized_boxes, classes, scores, labels = (
        model_predictions["normalized_boxes"],
        model_predictions["classes"],
        model_predictions["scores"],
        model_predictions["labels"],
    )
    # Substitute the classes index with the classes name
    class_names = [labels[int(idx)] for idx in classes]
    return normalized_boxes, class_names, scores
    
# Read the image data from S3
s3_client = boto3.client('s3')
sagemaker_client = boto3.client('sagemaker-runtime')

def handler(event, context):
    image_from_api = event['body']
    parse_data = json.loads(image_from_api)
    image_name = parse_data['message']
    image_s3_key ='public/' + image_name

    bucket_name= 'plantdiseasedetection-upload-380e72c3122439-dev'

    image_object = s3_client.get_object(Bucket=bucket_name, Key=image_s3_key)
    image_data = image_object['Body'].read()
    
    #  Invoke the endpoint
    response = sagemaker_client.invoke_endpoint(
        EndpointName='endpoint-with-no-hpo-apple',
        Body=image_data,
        ContentType='application/x-image', 
        Accept= 'application/json;verbose;n_predictions=1',
    )
    
    result = response['Body'].read()
    normalized_boxes, class_names, scores = parse_response(result)
    print('normalized boxes : ', normalized_boxes)
    print('class names : ', class_names)
    print('scores : ', scores)
    response_body = {
        'normalized_boxes': normalized_boxes,
        'class_names': class_names,
        'scores': scores
    }


    return {
        'statusCode': 200,
        'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(response_body)
    }
    
    