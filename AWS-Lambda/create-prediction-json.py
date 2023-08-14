import json
import boto3
import os


def detectlabels(photo, bucket):
    s3_client = boto3.client('s3')
    rekognition_client = boto3.client('rekognition')
    isLeaf = False

    response = rekognition_client.detect_labels(Image={'S3Object': {'Bucket': bucket, 'Name': photo}})
    print(response)
    for label in response['Labels']:
        if label['Name'] == 'Leaf' and label['Confidence'] > 99:
            isLeaf = True
    print(isLeaf)
    return isLeaf


def lambda_handler(event, context):
    # Extract the key from the event
    key = event['Records'][0]['s3']['object']['key']
    image_name = key[7:]

    s3_client = boto3.client('s3')
    bucket_name = os.environ['BUCKET_NAME']
    subfolder = 'public/'
    json_filename = f'{subfolder}{image_name}-prediction.json'

    # Perform label detection
    print(image_name)
    print("Bucket", bucket_name)
    
    is_leaf = detectlabels("public/" + image_name, bucket_name)

    # Create the JSON content
    json_content = {
        'file_name': image_name,
        'category_id': 'test',
        'bbox': [],
        'score':''
        # [y_min, x_min, y_max, x_max]
    }
    
    # temp file that will contain isLeaf
    temp_content = {
        'isLeaf': is_leaf
    }

    # Convert the JSON content to a string
    json_string = json.dumps(json_content)
    temp_string = json.dumps(temp_content)
    
    # Upload the JSON files to the S3 bucket
    s3_client.put_object(Body=json_string, Bucket=bucket_name, Key=json_filename)
    s3_client.put_object(Body=temp_string, Bucket=bucket_name, Key='public/temp.json')

    return {
        'statusCode': 200,
        'body': 'JSON file created and uploaded to S3'
    }