import boto3
import json 

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

def lambda_handler():

    image_path = '00.jpg'
    image_bytes = open(image_path, 'rb').read()

    # Invoke the endpoint
    sagemaker_client = boto3.client('sagemaker-runtime')
    response = sagemaker_client.invoke_endpoint(
        EndpointName='endpoint-with-no-hpo-apple',  
        ContentType="application/x-image",  
        Body=image_bytes,
        Accept= "application/json;verbose;n_predictions=1",
    )

    result = response['Body'].read()
    normalized_boxes, classes, scores = parse_response(result)
    

if __name__ == "__main__":
    lambda_handler()