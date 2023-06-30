import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@aws-amplify/ui-react';
import RectifySuccessful from './rectifyPredictionSuccess';
import RectifyFailed from './rectifyPredictionFail';
import { Heading } from '@aws-amplify/ui-react';
import { Storage, API } from 'aws-amplify';


interface DrawBoundingBoxesProps {
  uploadedFileName: string;
}

interface Coordinates {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
}

const DrawBoundingBoxes: React.FC<DrawBoundingBoxesProps> = ({ uploadedFileName }) => {
  const [redirectToSuccess, setRedirectToSuccess] = useState(false);
  const [redirectToFail, setRedirectToFail] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Coordinates>({ xmin: 0, xmax: 0, ymin: 0, ymax: 0 });
  const [endPoint, setEndPoint] = useState<Coordinates>({ xmin: 0, xmax: 0, ymin: 0, ymax: 0 });
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);
  const [rectangleCoordinates, setRectangleCoordinates] = useState<Coordinates>({
    xmin: 0,
    xmax: 0,
    ymin: 0,
    ymax: 0
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    fetchImage();
  }, []);

  const fetchImage = async () => {
    try {
      const url = await Storage.get(uploadedFileName);

      const img = new Image();
      img.src = url;
      img.onload = () => {
        setImageWidth(img.width);
        setImageHeight(img.height);
        setImageUrl(url);
      };
    } catch (error) {
      console.log('Error fetching image:', error);
    }
  };

  const handleDoneClick = async () => {
    try {
      // calculate normalized box coordinates 
      const normalized_xmin = rectangleCoordinates.xmin / imageWidth;
      const normalized_ymin = rectangleCoordinates.ymin / imageHeight;
      const normalized_xmax = rectangleCoordinates.xmax / imageWidth;
      const normalized_ymax = rectangleCoordinates.ymax / imageHeight;
      const normalized_box = [normalized_ymin,normalized_xmin,normalized_ymax,normalized_xmax];
      console.log('Normalized box: ', normalized_box)
      const response = await API.post('uploadbboxtos3', '/items', {
        body: {
          ymin: normalized_xmin,
          xmin: normalized_ymin,
          ymax: normalized_xmax,
          xmax: normalized_ymax,
          filename: uploadedFileName
        }
      });
      console.log('Response:', response);
      if (response === uploadedFileName) {
        console.log('Success');
        setRedirectToSuccess(true);
      }
      else {
        setRedirectToFail(true);
      }
    } catch (error) {
      console.log('Error calling API:', error);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setStartPoint({ xmin: x, xmax: x, ymin: y, ymax: y });
      setDrawing(true);
    }
  };

  const handleMouseUp = () => {
    if (drawing) {
      setDrawing(false);
      const { xmin: startX, ymin: startY } = startPoint;
      const { xmin: endX, ymin: endY } = endPoint;
      const xmin = Math.min(startX, endX);
      const xmax = Math.max(startX, endX);
      const ymin = Math.min(startY, endY);
      const ymax = Math.max(startY, endY);
      setRectangleCoordinates({ xmin, xmax, ymin, ymax });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawing) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setEndPoint({ xmin: x, xmax: x, ymin: y, ymax: y });
        drawRectangle();
      }
    }
  };

  const drawRectangle = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const { xmin, xmax, ymin, ymax } = startPoint;
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(xmin, ymin, xmax - xmin, ymax - ymin);
        ctx.stroke();
        const { xmin: currentX, ymin: currentY } = endPoint;
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(xmin, ymin, currentX - xmin, currentY - ymin);
      }
    }
  };

  if (redirectToSuccess) {
    return <RectifySuccessful uploadedFileName={uploadedFileName} />;
  }

  if (redirectToFail) {
    return <RectifyFailed uploadedFileName={uploadedFileName} />
  }

  return (
    <div className='bbox-container'>
      <Heading level={4}>Draw bounding boxes around the {uploadedFileName} image:</Heading>
      <div className='bbox-crop-container'>
        {imageUrl && <img className='bbox-image' src={imageUrl} alt='Uploaded Image' />}
        <canvas
          ref={canvasRef}
          className='bbox-canvas'
          width={imageWidth}
          height={imageHeight}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
      </div>
      <div className='bbox-button-container'>
        <Button variation='primary' onClick={handleDoneClick}>
          Done
        </Button>
      </div>
      {rectangleCoordinates && (
        <div className='coordinates-container'>
          <p>Xmin: {rectangleCoordinates.xmin}</p>
          <p>Xmax: {rectangleCoordinates.xmax}</p>
          <p>Ymin: {rectangleCoordinates.ymin}</p>
          <p>Ymax: {rectangleCoordinates.ymax}</p>
        </div>
      )}
    </div>
  );
};

export default DrawBoundingBoxes;