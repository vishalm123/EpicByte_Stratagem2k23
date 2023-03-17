import React, { useState, useRef } from 'react';

function Camera() {
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        setCameraOn(true);
        videoRef.current.srcObject = stream;
      })
      .catch((error) => console.log(error));
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    if (!stream) return;

    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    setCameraOn(false);
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL();
    console.log(dataURL);
  };

  return (
    <div>
      <div>
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={stopCamera}>Stop Camera</button>
      </div>

      {cameraOn && (
        <div>
          <video ref={videoRef} autoPlay />
          <button onClick={takePhoto}>Take Photo</button>
          <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />
        </div>
      )}
    </div>
  );
}

export default Camera;
