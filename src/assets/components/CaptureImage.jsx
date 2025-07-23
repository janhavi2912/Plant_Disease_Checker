import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const CaptureImage = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const handleCapture = () => {
    const imageDataUrl = webcamRef.current.getScreenshot();
    setImageSrc(imageDataUrl);
    setIsCameraOpen(false);

    if (onCapture) {
      onCapture(imageDataUrl); // <--- This is where you call it
    }
  };

  return (
    <div>
      <button onClick={() => setIsCameraOpen(true)}>
         Capture <i className="fa-solid fa-camera"></i>
      </button>

      {isCameraOpen && (
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={400}
            videoConstraints={{ facingMode: 'user' }}
          />
          <button onClick={handleCapture}>Capture</button>
        </div>
      )}

      {imageSrc && (
        <img
          src={imageSrc}
          alt="Captured"
          className="image-preview-container"
        />
      )}
    </div>
  );
};

export default CaptureImage;
