import React, { useEffect, useState, useRef, RefObject } from "react";
import { Storage } from "aws-amplify";
import { Button } from "@aws-amplify/ui-react";
import ChooseCorrectClass from "./rectifyPrediction";
import { Heading } from '@aws-amplify/ui-react';
import RectifySuccessful from './rectifyPredictionSuccess';
import DrawBoundingBoxes from './drawBoundingBoxes';

interface PredictProps {
  uploadedFileName: string;
}

function Predict({ uploadedFileName }: PredictProps) {
  const [prediction, setPrediction] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [showRectifyPrediction, setShowRectifyPrediction] = useState(false);
  const [showDrawSkipButtons, setShowDrawSkipButtons] = useState(false);
  const [showDrawBounding, setShowDrawBounding] = useState(false);
  const [showRectifySuccessful, setShowRectifySuccessful] = useState(false);
  const [boundingBoxes, setBoundingBoxes] = useState<number[]>([]);
  const canvasRef: RefObject<HTMLCanvasElement> = useRef(null);

  useEffect(() => {
    fetchPrediction();
  }, []);

  async function fetchBoundingBoxes(uploadedFileName: string) {
    try {
      const fileKey = `${uploadedFileName}-prediction.json`;
      const response = await Storage.get(fileKey);
      const signedURL = response;

      const fileResponse = await fetch(signedURL);
      const fileContents = await fileResponse.json();
      const { bbox } = fileContents;
      console.log(bbox);

      return bbox || [];
    } catch (error) {
      console.log("Error fetching bounding boxes:", error);
      return [];
    }
  }

  const fetchPrediction = async () => {
    try {
      const fileKey = `${uploadedFileName}-prediction.json`;
      const response = await Storage.get(fileKey);
      const signedURL = response;

      const fileResponse = await fetch(signedURL);
      const fileContents = await fileResponse.json();
      const { category_id } = fileContents;
      console.log(category_id);

      setPrediction(category_id || "");

      // Fetch image URL from storage
      const imageKey = uploadedFileName;
      const imageResponse = await Storage.get(imageKey);
      const imageSignedURL = imageResponse;
      setImageURL(imageSignedURL);

      // Fetch bounding boxes
      const boundingBoxes = await fetchBoundingBoxes(uploadedFileName);
      setBoundingBoxes(boundingBoxes);

      // Draw bounding boxes on the image
      drawBoundingBoxes(boundingBoxes);
    } catch (error) {
      console.log("Error fetching file content:", error);
    }
  };

  const drawBoundingBoxes = (bbox: number[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const img = new Image();

    img.onload = () => {
      const { naturalWidth, naturalHeight } = img;
      console.log(naturalWidth, naturalHeight);

      // Resize canvas to match image size
      canvas.width = naturalWidth;
      canvas.height = naturalHeight;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);

      const canvasRatio = canvas.width / canvas.getBoundingClientRect().width;

      // Draw each bounding box
      for (let i = 0; i < bbox.length; i += 4) {
        const [yMin, xMin, yMax, xMax] = bbox.slice(i, i + 4);
        const scaledXMin = xMin * canvasRatio;
        const scaledYMin = yMin * canvasRatio;
        const scaledXMax = xMax * canvasRatio;
        const scaledYMax = yMax * canvasRatio;

        context.beginPath();
        context.rect(scaledXMin, scaledYMin, scaledXMax - scaledXMin, scaledYMax - scaledYMin);
        context.strokeStyle = "red";
        context.lineWidth = 2;
        context.stroke();
      }
    };

    img.src = imageURL; // Set the image source

    // // Fetch the image URL and trigger the onload event
    // const fetchImage = async () => {
    //   try {
    //     const response = await fetch(imageURL);
    //     const blob = await response.blob();
    //     img.src = URL.createObjectURL(blob);
    //   } catch (error) {
    //     console.log("Error fetching image:", error);
    //   }
    // };

    // fetchImage();
  };

  const handleYesClick = () => {
    console.log("Yes button clicked");
    setShowDrawSkipButtons(true);
  };

  const handleNoClick = () => {
    console.log("No button clicked");
    setShowRectifyPrediction(true);
  };

  const handleDrawBoundingBoxesClick = () => {
    console.log("Draw Bounding Boxes button clicked");
    setShowDrawBounding(true);
  };

  const handleSkipClick = () => {
    console.log("Skip button clicked");
    setShowRectifySuccessful(true);
  };

  const handleButtonClick = (buttonId: string) => {
    console.log("Button clicked:", buttonId);
  };

  if (showRectifyPrediction) {
    return (
      <ChooseCorrectClass
        uploadedFileName={uploadedFileName}
        onButtonClick={handleButtonClick}
      />
    );
  }


  if (showDrawBounding) {
    return (
      <div>
        <DrawBoundingBoxes uploadedFileName={uploadedFileName} />
      </div>
    );
  }

  if (showRectifySuccessful) {
    return <RectifySuccessful uploadedFileName={uploadedFileName} />;
  }

  return (
    <div className="prediction-container">
      <Heading level={2}>Prediction</Heading>
      <h4>Disease category is: {prediction}</h4>
      {imageURL && (
        <div className="image-container">
          <canvas ref={canvasRef} className="canvas" />
          <img
            src={imageURL}
            alt="Uploaded Image"
            className="image"
            onLoad={() => drawBoundingBoxes(boundingBoxes)}
          />
        </div>
      )}
      <div className="button-container">
        <Button
          style={{ backgroundColor: "green", color: "white", marginRight: "10px" }}
          onClick={handleYesClick}
        >
          Yes
        </Button>
        <Button
          style={{ backgroundColor: "red", color: "white", marginLeft: "10px" }}
          onClick={handleNoClick}
        >
          No
        </Button>
      </div>
      {showDrawSkipButtons && (
        <div className="button-group">
          <Button variation="primary" onClick={handleDrawBoundingBoxesClick} className="bounding-box-button">
            Draw Bounding Boxes
          </Button>
          <Button variation="destructive" onClick={handleSkipClick} className="skip-button">
            Skip
          </Button>
        </div>
        )}
    </div>
  );
}

export default Predict;
