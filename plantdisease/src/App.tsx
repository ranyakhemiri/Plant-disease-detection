import { useState } from "react";
import "./App.css";
import { FileUploader, withAuthenticator } from "@aws-amplify/ui-react";
// import { StorageManager } from "@aws-amplify/ui-react-storage";
import { Button, Image, Card,Text,Heading, 
  Badge, Alert, Flex, Tabs, TabItem, ToggleButton,SwitchField, useTheme, Loader  } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Predict from "./Predict";
import { Storage, API } from "aws-amplify";
import { CgArrowDownO } from "react-icons/cg";

function App() {
  const [showPrediction, setShowPrediction] = useState(false);
  const [uploadSuccessful, setUploadSuccessful] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isLeaf, setIsLeaf] = useState(false);
  const [error, setError] = useState(false); // state for tracking error
  const [loading, setLoading] = useState(false); // state for tracking loading
  const [predictionInProgress, setPredictionInProgress] = useState(false); //state for waiting for inference response

  const handlePredictClick = async () => {
    try {
      setPredictionInProgress(true);
      console.log('starting api call');
      setLoading(true); // Start the loading state
      const apiResponse = await API.post("invokeSGMEndpoint", "/", {
        body: {
          message: uploadedFileName
        }
      });
      console.log(apiResponse); // Log the API response for debugging or further processing
      console.log('api call completed');

      console.log("Storing result in S3 now ... ")
      // Store the API response in an S3 file
      const fileKey = `${uploadedFileName}-prediction.json`;
      const signedURL= await Storage.get(fileKey);
      const fileResponse = await fetch(signedURL);
      const fileContents = await fileResponse.json();
      // extracting the elements needed from the API response 
      const sagemakerPredictionString = JSON.stringify(apiResponse);
      const sagemakerPrediction = JSON.parse(sagemakerPredictionString);
      // updating the file contents with the prediction
      const scores = sagemakerPrediction.scores;
      const predictedBbox = sagemakerPrediction.normalized_boxes[0];
      fileContents.bbox = predictedBbox;
      fileContents.category_id = sagemakerPrediction.class_names[0];
      fileContents.score = scores;
      console.log("New file updated with prediction : ",fileContents);
      await Storage.put(fileKey, fileContents);
      
      setLoading(true)
      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    // Wait for 10 seconds before showing the prediction
      await delay(500);  
      setLoading(false)
      setPredictionInProgress(false); // Set prediction process complete
      setShowPrediction(true); // Set showPrediction state to true after successful API call
      setLoading(false); // Stop the loading state
    } catch (error) {
      console.log("Error calling API:", error);
    }

  }

  // const handleUploadSuccess = async (event: { key: string }) => {
    const handleUploadSuccess = async (event: { key: string }) => {
    setUploadedFileName(event.key);
    setUploadSuccessful(true);
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    // Wait for 10 seconds before executing the "try catch" block
    await delay(1000);      
    try {
        const fileKey = `${event.key}-prediction.json`;
        console.log("Storage file created with name : ",fileKey);
        const response = await Storage.get(fileKey);
        const signedURL = response;
  
        const fileResponse = await fetch(signedURL);
        const fileContents = await fileResponse.json();
        const { isLeaf } = fileContents;
        console.log("The uploaded image is a leaf? : ",isLeaf);
         
        setIsLeaf(isLeaf === true);
        // Handle the case where the file is not a leaf
        // There will be no inference 
        if (!isLeaf || isLeaf =="") {
          const fileKeyToDelete = `${event.key}-prediction.json`;
          await Storage.remove(fileKeyToDelete)
            .then(() => {
              console.log(`Successfully deleted file: ${fileKeyToDelete}`);
            })
            .catch((error) => {
              console.log("Error deleting file:", error);
            });
            await Storage.remove(event.key)
            .then(() => {
              console.log(`Successfully deleted image: ${event.key}`);
            })
            .catch((error) => {
              console.log("Error deleting image:", error);
            });
          setError(true);
          setShowPrediction(false);
          setUploadSuccessful(false);
          setUploadedFileName("");
          // Reload the page to its initial state after 3 seconds
          setTimeout(() => {
            window.location.reload();
          }, 3000);      }
      } catch (error) {
        setError(true);
        console.log("Error fetching file content:", error);
        setTimeout(() => {
          window.location.reload();
        }, 3000); 
      }
    
    
  };

  const handleImageClick = () => {
    console.log('Reloading to home page ...');
    setTimeout(() => {
      window.location.reload();
    }, 300); 
  };


  const { tokens } = useTheme();

  return (
    <Flex direction="column" gap="2rem">
      <Tabs justifyContent="center">
        <div className="logo">
          <img src="icon192.png" alt="" onClick={handleImageClick} />
        </div>
        <TabItem title="Image upload">
            <div className="container">
            
            {!showPrediction ? (
            <div>
                {!uploadSuccessful && !isLeaf && (
                  <div className="container">
                  <Heading level={3} color="green" fontWeight="bold">
                    Welcome to the disease detection website
                  </Heading>
                  <Heading level={4}>
                     Try it out ! Upload a picture of your crop below
                  </Heading>
                  <div className="icon-down">
                  <CgArrowDownO></CgArrowDownO>
                  </div>
                  </div>
                )}
  
                <FileUploader
                  maxFileCount={1}
                  accessLevel="public"
                  acceptedFileTypes={["image/*"]}
                  variation="drop"
                  onSuccess={handleUploadSuccess}
                />

                {uploadSuccessful && !isLeaf && (
                   
                   <div>
                    <Loader variation="linear" />
                   <Heading level={6} color="green">
                   We are processing your image, please wait while we check if it's a leaf ...
                  </Heading> 
                  </div>
                )}
                {uploadSuccessful && loading && (
                  <Loader variation="linear" />
                )}
                {uploadSuccessful && isLeaf && !predictionInProgress && (
                  
                  <div className="button-container">
                    <Heading level={6} color="green">
                      Congrats! The image you uploaded is a leaf.
                    </Heading>
                    <Heading level={5} >
                      Click on the button below to start the prediction process.
                    </Heading>
                    <div className="predict-button">
                    <Button loadingText="" onClick={handlePredictClick} ariaLabel="">
                      Predict
                    </Button>
                    </div>
                  </div>
                )}
                {uploadSuccessful && isLeaf && predictionInProgress &&(
                  
                  <div className="button-container">
                    <Heading level={6} color="green">
                      We are processing your image, please wait while we generate predictions...
                    </Heading>
                  </div>
                )}
                {error && <p className="error-message">Error: The uploaded file is not a leaf.</p>}
              </div>
            ) : (
              <Predict uploadedFileName={uploadedFileName} />
            )}
          </div>
        </TabItem>
        <TabItem title="Upload instructions">
          <div className="instructions">
          <div className="upload-instructions">
                <Alert variation="info">Make sure image is of type JPG/JPEG</Alert>
                <Alert variation="info">Make sure image is a leaf </Alert>
                <Alert variation="info">Make sure image is not blurry</Alert>
                <Alert variation="info">Make sure image size is less than 200 MB</Alert>
            </div>
            <div className="upload-instructions-text">
                <SwitchField
                label="I am aware of these instructions and aware that app malfunctions 
                can be the result of the disregard of the instructions."
                trackCheckedColor={tokens.colors.green[60]}
                defaultChecked={false}
                /> 
            </div>
          </div>
        </TabItem>
        <TabItem title="Example pictures">
          <div className="example-pictures">
          <Card>
            <Flex direction="row" alignItems="flex-start">
              <Image
                alt="Good example"
                src="/good-image.jpg"
                width="33%"
              />
              <Flex
                direction="column"
                alignItems="flex-start"
                gap={tokens.space.xs}
              >
                <Flex>
                  <Badge size="small" variation="success">
                    Clear
                  </Badge>
                  <Badge size="small" variation="success">
                    Close enough
                  </Badge>
                  <Badge size="small" variation="success">
                    Leaf entirely visible
                  </Badge>
                </Flex>

                <Heading level={5}>
                  Good Example
                </Heading>

                <Text as="span">
                  Here is an example of a good picture! Picture should include a couple of leaves but be close enough. It should also be on the field.
                </Text>
              </Flex>
            </Flex>
          </Card>
          <Card>
            <Flex direction="row" alignItems="flex-start">
              <Image
                alt="Bad example"
                src="/bad-example-1.png"
                width="32.5%"
              />
              <Image
                alt="Bad example"
                src="/bad-example-2.jpg"
                width="33%"
              />
              <Flex
                direction="column"
                alignItems="flex-start"
                gap={tokens.space.xs}
              >
                <Flex>
                  <Badge size="small" variation="error">
                    Too close
                  </Badge>
                  <Badge size="small" variation="error">
                    Leaf cropped
                  </Badge>
                  <Badge size="small" variation="error">
                    Too far
                  </Badge>
                </Flex>

                <Heading level={5}>
                  Bad Example
                </Heading>

                <Text as="span">
                  Here is an example of a bad picture! Leaves shouldn't be cropped out. However, leaves should be visible, that means close enough but not too close. 
                </Text>
              </Flex>
            </Flex>
          </Card>
          </div>
        </TabItem>
      </Tabs>
    </Flex>
    
  );
}

export default withAuthenticator(App);