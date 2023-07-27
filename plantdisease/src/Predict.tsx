import React, { useEffect, useState, useRef, RefObject } from 'react'
import { Storage } from 'aws-amplify'
import { Button } from '@aws-amplify/ui-react'
import ChooseCorrectClass from './rectifyPrediction'
import { Heading } from '@aws-amplify/ui-react'
import RectifySuccessful from './rectifyPredictionSuccess'
import DrawBoundingBoxes from './drawBoundingBoxes'
import MapComponent from './MapComponent';

interface PredictProps {
  uploadedFileName: string
}

function Predict({ uploadedFileName }: PredictProps) {
  const [prediction, setPrediction] = useState('')
  const [imageURL, setImageURL] = useState('')
  const [showRectifyPrediction, setShowRectifyPrediction] = useState(false)
  const [showDrawSkipButtons, setShowDrawSkipButtons] = useState(false)
  const [showDrawBounding, setShowDrawBounding] = useState(false)
  const [showRectifySuccessful, setShowRectifySuccessful] = useState(false)
  const [boundingBoxes, setBoundingBoxes] = useState<number[]>([])
  const [score, setScore] = useState('')
  const canvasRef: RefObject<HTMLCanvasElement> = useRef(null)

  useEffect(() => {
    const imageKey = uploadedFileName
    Storage.get(imageKey)
      .then((imageResponse) => {
        const imageSignedURL = imageResponse
        setImageURL(imageSignedURL)

        fetchPrediction()
        fetchBoundingBoxes(uploadedFileName)
          .then((boundingBoxes) => {
            setBoundingBoxes(boundingBoxes)
            drawBoundingBoxes(boundingBoxes)
          })
          .catch((error) => {
            console.log('Error fetching bounding boxes:', error)
          })
      })
      .catch((error) => {
        console.log('Error fetching image URL:', error)
      })
  }, [])

  async function fetchBoundingBoxes(uploadedFileName: string) {
    try {
      const fileKey = `${uploadedFileName}-prediction.json`
      const response = await Storage.get(fileKey)
      const signedURL = response

      const fileResponse = await fetch(signedURL)
      const fileContents = await fileResponse.json()
      const { bbox } = fileContents

      return bbox || []  
    } catch (error) {
      console.log('Error fetching bounding boxes:', error)
      return []
    }
  }

  const fetchPrediction = async () => {
    try {
      const fileKey = `${uploadedFileName}-prediction.json`
      const response = await Storage.get(fileKey)
      const signedURL = response

      const fileResponse = await fetch(signedURL)
      const fileContents = await fileResponse.json()
      const { category_id, score } = fileContents
      console.log(category_id)
      console.log(score)
      setPrediction(category_id || '')
      setScore(score || [])
    } catch (error) {
      console.log('Error fetching file content:', error)
    }
  }

  const drawBoundingBoxes = (normalizedBoxes: number[]) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const img = new Image()

    img.onload = () => {
      const { naturalWidth, naturalHeight } = img

      canvas.width = naturalWidth
      canvas.height = naturalHeight

      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0)
      console.log('Drawing prediction bounding boxes on image')
      console.log('Bounding boxes:', normalizedBoxes)
      for (let i = 0; i < normalizedBoxes.length; i += 4) {
        const [normalizedXMin, normalizedYMin, normalizedXMax, normalizedYMax] =
          normalizedBoxes.slice(i, i + 4)

        const scaledXMin = normalizedXMin * canvas.width
        const scaledYMin = normalizedYMin * canvas.height
        const scaledXMax = normalizedXMax * canvas.width
        const scaledYMax = normalizedYMax * canvas.height

        context.beginPath()
        context.rect(
          scaledXMin,
          scaledYMin,
          scaledXMax - scaledXMin,
          scaledYMax - scaledYMin
        )
        context.strokeStyle = 'red'
        context.lineWidth = 2
        context.stroke()
      }
    }

    img.src = imageURL 
  }

  const handleYesClick = () => {
    console.log('Yes button clicked')
    setShowDrawSkipButtons(true)
  }

  const handleNoClick = () => {
    console.log('No button clicked')
    setShowRectifyPrediction(true)
  }

  const handleDrawBoundingBoxesClick = () => {
    console.log('Draw Bounding Boxes button clicked')
    setShowDrawBounding(true)
  }

  const handleSkipClick = () => {
    console.log('Skip button clicked')
    setShowRectifySuccessful(true)
  }

  const handleButtonClick = (buttonId: string) => {
    console.log('Button clicked:', buttonId)
  }

  if (showRectifyPrediction) {
    return (
      <ChooseCorrectClass
        uploadedFileName={uploadedFileName}
        onButtonClick={handleButtonClick}
      />
    )
  }

  if (showDrawBounding) {
    return (
      <div>
        <DrawBoundingBoxes uploadedFileName={uploadedFileName} />
      </div>
    )
  }

  if (showRectifySuccessful) {
    return <RectifySuccessful uploadedFileName={uploadedFileName} />
  }

  return (
    <div className="prediction-container">
      <Heading level={3} color="green">
        Prediction
      </Heading>
      {prediction !== '' && (
        <Heading level={4}>Disease category is: {prediction}</Heading>
      )}

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
      {score.length > 0 && (
        <p className="score">
          Score: {`${(parseFloat(score) * 100).toFixed(3)}%`}
        </p>
      )}
      
      <Heading level={3} color="green">
        Crop Location 
      </Heading>
      <MapComponent/>

      <Heading level={4}>Are the predictions correct?</Heading>
      <div className="button-container">
        <Button
          style={{
            backgroundColor: 'green',
            color: 'white',
            marginRight: '10px',
          }}
          onClick={handleYesClick}
        >
          Yes
        </Button>
        <Button
          style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}
          onClick={handleNoClick}
        >
          No
        </Button>
      </div>
      {showDrawSkipButtons && (
        <div>
          <Heading level={4}>
            {' '}
            You can still choose to correct the bounding boxes :{' '}
          </Heading>
          <div className="button-group">
            <Button
              variation="primary"
              onClick={handleDrawBoundingBoxesClick}
              className="bounding-box-button"
            >
              Draw Bounding Boxes
            </Button>
            <Button
              variation="destructive"
              onClick={handleSkipClick}
              className="skip-button"
            >
              Skip
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Predict
