import React, { useRef, useState, useEffect } from 'react';

const VideoComponent = () => {
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        console.log("Media devices acquired:", stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log("Stream assigned to video element");
        }
        setIsCameraOn(true);
        console.log("Camera is on");
        // startRecording(stream);
        if (videoRef.current) {
          sendFramesToServer(); // 프레임을 서버로 전송 시작
          console.log("Sending frames to server");
        }
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto' }} />
      {isCameraOn && <p>Camera is on</p>}
    </div>
  );
};

export default VideoComponent;
