import React, { useEffect } from 'react';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import './App.css';
import { Heading } from '@aws-amplify/ui-react';

interface RectifySuccessfulProps {
  uploadedFileName: string;
}

const RectifySuccessful: React.FC<RectifySuccessfulProps> = ({ uploadedFileName }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      window.location.reload(); // Reload the page
    }, 600);

    return () => {
      clearTimeout(timeoutId); // Clear the timeout when the component unmounts
    };
  }, []);

  return (
    <div className="modifications-container">
      <Heading level={4} color="green" fontWeight="bold">
        Congratulations! Your modifications for "{uploadedFileName}" are saved.
      </Heading>
      <div className="icon">
        <IoCheckmarkCircleOutline className="checkmark-icon-green" />
      </div>
    </div>
  );
};

export default RectifySuccessful;