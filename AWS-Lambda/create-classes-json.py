import json
import urllib.parse
import boto3
import os

# Get S3 client
s3 = boto3.client('s3')

# Create classes JSON
def get_unique_category_ids(input_file):
    with open(input_file, 'r') as file:
        data = json.load(file)

    unique_category_ids = set()
    for annotation in data['annotations']:
        unique_category_ids.add(annotation['category_id'])

    grouped_categories = {}
    for category_id in unique_category_ids:
        prefix = category_id.split(' ')[0]  # Extract the common prefix
        if prefix in grouped_categories:
            grouped_categories[prefix].append(category_id)
        else:
            grouped_categories[prefix] = [category_id]

    output_data = {'classes': grouped_categories}

    with open('/tmp/classes.json', 'w') as file:
        json.dump(output_data, file, indent=2)

    # Upload the classes.json file to the target S3 bucket
    target_bucket = os.environ['TARGET_BUCKET']
    target_key = 'public/classes.json'
    s3.upload_file('/tmp/classes.json', target_bucket, target_key)

def lambda_handler(event, context):
    # Get the object from the event 
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    try:
        response = s3.get_object(Bucket=bucket, Key=key)

        # Extract the file name from the key
        file_name = os.path.basename(key)
        print("File Name: " + file_name)
        
        #only do this if a new annotation file is uploaded
        if file_name == 'annotations.json':
            # Download the file to /tmp directory
            s3.download_file(bucket, key, '/tmp/' + file_name)

            # Process the file
            get_unique_category_ids('/tmp/' + file_name)
            
    except Exception as e:
        print(e)
        print(f'Error getting object {key} from bucket {bucket}. Make sure they exist and your bucket is in the same region as this function.')
        raise e
