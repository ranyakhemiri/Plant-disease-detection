import React from "react";
import "./App.css";
import { FileUploader, withAuthenticator} from '@aws-amplify/ui-react';
import "@aws-amplify/ui-react/styles.css";

function App() {
  const goToPredictionPage = () => {
    
  };

  return (
    <div>
      <FileUploader
        accessLevel='public'
        acceptedFileTypes={['image/*']}
        variation='drop'
      />
      <button onClick={goToPredictionPage}>Go to Prediction Page</button>
    </div>
  );
}

export default withAuthenticator(App);
