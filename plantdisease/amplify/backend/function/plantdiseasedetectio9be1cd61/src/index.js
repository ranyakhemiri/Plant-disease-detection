const AWS = require('aws-sdk');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const { xmin, ymin, xmax, ymax, filename } = JSON.parse(event.body);

  // Update the bbox values in the JSON file
  const s3 = new AWS.S3();
  const bucketName = 'plantdiseasedetection-upload-380e72c3122439-dev';
  const jsonFileName = `public/${filename}-prediction.json`;

  try {
    const response = await s3.getObject({ Bucket: bucketName, Key: jsonFileName }).promise();
    const jsonData = JSON.parse(response.Body.toString());
    jsonData.bbox = [ymin, xmin, ymax, xmax];

    await s3.putObject({
      Bucket: bucketName,
      Key: jsonFileName,
      Body: JSON.stringify(jsonData),
    }).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: filename,
    };
  } catch (error) {
    console.log('Error updating JSON file:', error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({ error: 'Failed to update JSON file' }),
    };
  }
};