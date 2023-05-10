import React from 'react';
import './App.css';
import { FileUploader, withAuthenticator} from '@aws-amplify/ui-react';
import "@aws-amplify/ui-react/styles.css";

function App() {
  return (
    <FileUploader
      accessLevel='private'
      acceptedFileTypes={
        ['image/*']
      }
      variation='drop'
    />

  );
}

export default withAuthenticator(App);
