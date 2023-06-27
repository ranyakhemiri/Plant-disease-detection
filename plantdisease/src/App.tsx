import React, { useState } from "react";
import "./App.css";
import { FileUploader, withAuthenticator } from "@aws-amplify/ui-react";
import { Button } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Predict from "./Predict";
import { Storage, API } from "aws-amplify";

function App() {
  const [showPrediction, setShowPrediction] = useState(false);
  const [uploadSuccessful, setUploadSuccessful] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isLeaf, setIsLeaf] = useState(false);
  const [error, setError] = useState(false); // state for tracking error

  const handlePredictClick = async () => {
    try {
      console.log('starting api call')
      // const imageBytes = await Storage.get(uploadedFileName);
      // console.log(imageBytes);
      // Make the API call and pass the image data
      const apiResponse = await API.post("invokeEndpoint", "/", {
        body: {
          image: 'hello'
        }
      });
      
      console.log(apiResponse); // Log the API response for debugging or further processing
  
    } catch (error) {
      console.log("Error calling API:", error);
    }
    setShowPrediction(true); // Set showPrediction state to true after successful API call
  };

  const handleUploadSuccess = async (event: { key: string }) => {
    setUploadedFileName(event.key);
    setUploadSuccessful(true);

    try {
      const fileKey = `${event.key}-prediction.json`;
      const response = await Storage.get(fileKey);
      const signedURL = response;

      const fileResponse = await fetch(signedURL);
      const fileContents = await fileResponse.json();
      const { isLeaf } = fileContents;
      console.log(isLeaf);
      
      setIsLeaf(isLeaf === true);
      // Handle the case where the file is not a leaf
      // There will be no inference 
      if (!isLeaf) {
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
      console.log("Error fetching file content:", error);
    }
  };

  return (
    <div className="container">
      {!showPrediction ? (
        <div>
          <FileUploader
            maxFileCount={1}
            accessLevel="public"
            acceptedFileTypes={["image/*"]}
            variation="drop"
            onSuccess={handleUploadSuccess}
          />
          {uploadSuccessful && isLeaf && (
            <div className="button-container">
              <Button loadingText="" onClick={handlePredictClick} ariaLabel="">
                Predict
              </Button>
            </div>
          )}
          {error && <p className="error-message">Error: The uploaded file is not a leaf.</p>}
        </div>
      ) : (
        <Predict uploadedFileName={uploadedFileName} />
      )}
    </div>
  );
}

export default withAuthenticator(App);
