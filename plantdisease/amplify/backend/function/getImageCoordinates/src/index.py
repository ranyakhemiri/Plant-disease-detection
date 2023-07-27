import boto3
from PIL import Image as Pillow
from io import BytesIO
import exifread
import folium

def create_map_with_marker(latitude, longitude):
    # Create a map centered at the given latitude and longitude
    map_center = [latitude, longitude]
    my_map = folium.Map(location=map_center, zoom_start=15)
    
    # Add a marker at the specified coordinates
    folium.Marker(location=map_center, popup='Image Location').add_to(my_map)
    
    # Save the map as an HTML file
    return my_map

def lambda_handler(event, context):
    print("Hello")

    # Extract the bucket and key from the image path
    s3_bucket, s3_key = 'plantdiseasedetection-upload-380e72c3122439-dev', 'public/apple.jpg'
    
    # Create a Boto3 S3 client
    s3_client = boto3.client('s3')
    
    try:
        # Download the image from S3 to memory
        print("S3 Bucket:", s3_bucket)
        print("S3 Key:", s3_key)

        response = s3_client.get_object(Bucket=s3_bucket, Key=s3_key)
        image_data = response['Body'].read()
        
        # Open the image with Pillow from memory
        with Pillow.open(BytesIO(image_data)) as img:
            # Extract EXIF data
            tags = exifread.process_file(BytesIO(image_data))
            
            # Print the image metadata
            print("Image Metadata:")
            for tag, value in tags.items():
                print(f"{tag}: {value}")
            
            # Check if geolocation data exists in the EXIF
            if 'GPS GPSLatitude' in tags and 'GPS GPSLongitude' in tags:
                latitude = tags['GPS GPSLatitude']
                longitude = tags['GPS GPSLongitude']
                print("\nGeolocation Coordinates:")
                print(f"Latitude: {latitude}")
                print(f"Longitude: {longitude}")

                # Convert GPS coordinates to decimal degrees format
                latitude_decimal = float(latitude.values[0]) + float(latitude.values[1]) / 60 + float(latitude.values[2].num) / (float(latitude.values[2].den) * 3600)
                longitude_decimal = float(longitude.values[0]) + float(longitude.values[1]) / 60 + float(longitude.values[2].num) / (float(longitude.values[2].den) * 3600)

                # Call the create_map_with_marker function with the decimal degree coordinates
                my_map = create_map_with_marker(latitude_decimal, longitude_decimal)

                # Get the HTML content of the map
                map_html = my_map._repr_html_()

                # Upload the map HTML to the S3 bucket
                # s3_client.put_object(Bucket=s3_bucket, Key='public/image_location_map.html', Body=map_html)
                with open('public/image_location_map.html', 'w') as file:
                    file.write(map_html)

            else:
                print("\nGeolocation Coordinates not found.")
    except Exception as e:
        print(f"Error: {str(e)}")

    return {
        'statusCode': 200,
        'body': 'Image metadata printed successfully.'
    }


# Prepare event and context
event = {
    "image_path": ""
}

context = {
    "function_name": "getImageCoordinates"}

# Call the Lambda handler function with event and context
result = lambda_handler(event, context)

print(result['statusCode'])