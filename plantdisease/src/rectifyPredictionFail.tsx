import React from 'react';
import { IoAlertCircle } from 'react-icons/io5';
import './App.css';
import { Heading } from '@aws-amplify/ui-react';

interface RectifyFailProps {
  uploadedFileName: string;
}

const RectifyFail: React.FC<RectifyFailProps> = ({ uploadedFileName }) => {
  return (
    <div className="modifications-container">
    <Heading level={4} color="red" fontWeight="bold">
      Apologies! Saving your modifications for "{uploadedFileName}" failed. Please try again!
    </Heading>
      <div className="icon">
      <IoAlertCircle className="checkmark-icon-red" />
      </div>
    </div>
  );
};

export default RectifyFail;
