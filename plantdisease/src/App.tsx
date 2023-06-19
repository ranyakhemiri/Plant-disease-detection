import React, { useState } from "react";
import "./App.css";
import { FileUploader, withAuthenticator } from "@aws-amplify/ui-react";
import { Button } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Predict from "./Predict";
import { Storage } from "aws-amplify";

function App() {
  const [showPrediction, setShowPrediction] = useState(false);
  const [uploadSuccessful, setUploadSuccessful] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isLeaf, setIsLeaf] = useState(false);
  const [error, setError] = useState(false); // state for tracking error

  const handlePredictClick = () => {
    setShowPrediction(true);
  };

  // Handle successful file upload

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
