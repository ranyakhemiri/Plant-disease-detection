import React, { useEffect, useState } from 'react';
import DrawBoundingBoxes from './drawBoundingBoxes';
import { Storage } from 'aws-amplify';
import { Grid, Button } from '@aws-amplify/ui-react';
import './App.css';
import RectifySuccessful from './rectifyPredictionSuccess';
import RectifyFail from './rectifyPredictionFail';

interface ChooseCorrectClassProps {
  uploadedFileName: string;
  onButtonClick: (buttonId: string) => void;
}

interface Classes {
  [key: string]: string[];
}

const ChooseCorrectClass: React.FC<ChooseCorrectClassProps> = ({ uploadedFileName, onButtonClick }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [classes, setClasses] = useState<Classes>({});
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showBoundingBoxButton, setShowBoundingBoxButton] = useState(false);
  const [showRectifySuccessful, setShowRectifySuccessful] = useState(false);
  const [showRectifyFail, setShowRectifyFail] = useState(false);
  const [redirectToDraw, setRedirectToDraw] = useState(false);

  useEffect(() => {
    fetchImage();
    fetchClasses();
  }, [uploadedFileName]);

  const fetchImage = async () => {
    try {
      const url = await Storage.get(uploadedFileName);
      setImageUrl(url);
    } catch (error) {
      console.log('Error fetching image:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const fileKey = 'classes.json';
      const response = await Storage.get(fileKey);
      const fileResponse = await fetch(response);
      const data = await fileResponse.json();
      setClasses(data.classes);
    } catch (error) {
      console.log('Error fetching classes:', error);
    }
  };

  const correctDiseaseClass = async (imageName: string, categoryValue: string) => {
    try {
      const fileKey = `${imageName}-prediction.json`;
      const response = await Storage.get(fileKey);
      const fileResponse = await fetch(response);
      const data = await fileResponse.json();
      data.category_id = categoryValue; // Update the category_id with the button class value

      // Upload the updated JSON file to Amplify Storage
      await Storage.put(fileKey, JSON.stringify(data));

      setShowBoundingBoxButton(true); // Show the "Draw Bounding Boxes" button
    } catch (error) {
      console.log('Error saving modifications: ', error);
      setShowRectifyFail(true);
    }
  };

  const handleClassButtonClick = (className: string) => {
    setSelectedClass(className === selectedClass ? null : className);
    setShowBoundingBoxButton(false); // Hide the "Draw Bounding Boxes" button
  };

  const handleButtonClick = async (value: string) => {
    console.log('Button value:', value);
    await correctDiseaseClass(uploadedFileName, value);
    onButtonClick(value);
  };

  const handleDrawBoundingBoxesClick = () => {
    setRedirectToDraw(true); // Set the state to redirect
  };

  const handleSkipClick = () => {
    console.log('Skip button clicked');
    setShowRectifySuccessful(true);
  };

  if (showRectifySuccessful) {
    return <RectifySuccessful uploadedFileName={uploadedFileName} />;
  }

  if (showRectifyFail) {
    return <RectifyFail uploadedFileName={uploadedFileName} />;
  }

  if (redirectToDraw) {
    return <DrawBoundingBoxes uploadedFileName={uploadedFileName} />;
  }

  return (
    <div className="rectify-container">
      <div className="button-container">
        <Grid gap={2}>
          {Object.keys(classes).map((className) => (
            <div key={className} className={`class-button-wrapper ${selectedClass === className ? 'selected' : ''}`}>
              <Button onClick={() => handleClassButtonClick(className)} className="class-button">
                {className}
              </Button>
              {selectedClass === className && (
                <Grid gap={1}>
                  {classes[className].map((value) => (
                    <Button key={value} onClick={() => handleButtonClick(value)} className="button">
                      {value}
                    </Button>
                  ))}
                </Grid>
              )}
            </div>
          ))}
        </Grid>
      </div>
      {showBoundingBoxButton && (
        <div className="button-group">
          <Button variation="primary" onClick={handleDrawBoundingBoxesClick} className="bounding-box-button">
            Draw Bounding Boxes
          </Button>
          <Button variation="destructive" onClick={handleSkipClick} className="skip-button">
            Skip
          </Button>
        </div>
      )}
      {imageUrl && (
        <div className="image-container">
          <img src={imageUrl} alt="Image" className="image" />
        </div>
      )}
    </div>
  );
};

export default ChooseCorrectClass;
