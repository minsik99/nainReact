import React, { useRef, useEffect, useState } from 'react';

const InterviewComponent = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [stream, setStream] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setStream(stream);
            }
            setIsCameraOn(true);
        } catch (err) {
            console.error("Error accessing webcam: ", err);
        }
    };

    const stopCamera = () => {
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setIsCameraOn(false);
    };

    const sendFrameToServer = async (frame) => {
        try {
            const response = await fetch('http://127.0.0.1:8080/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ frame }), ivtNo: 1
            });
            const data = await response.json();
            setProcessedImage(`data:video/mp4;base64,${data.processedImage}`);
        } catch (err) {
            console.error("Error sending frame to server: ", err);
        }
    };

    useEffect(() => {
        if (isCameraOn && videoRef.current) {
            const interval = setInterval(() => {
                const canvas = document.createElement('canvas');
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const frame = canvas.toDataURL('image/jpeg');
                sendFrameToServer(frame);
            }, 1000); // 1초마다 프레임 전송

            return () => clearInterval(interval);
        }
    }, [isCameraOn]);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const saveVideo = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8080/stop', {
                method: 'GET'
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Server response:', data);
        } catch (err) {
            console.error("Error sending frame to server: ", err);
        }
    };
    return (
        <>
            <h1>Webcam 화면</h1>
            <div>
                <button onClick={isCameraOn ? stopCamera : startCamera}>
                    {isCameraOn ? '카메라 끄기' : '카메라 켜기'}
                </button>
                <button onClick={saveVideo} disabled={processedImage}>
                    영상저장
                </button>
            </div>
            <div style={{ display: "flex" }}>
                <video ref={videoRef} autoPlay playsInline />
                <div>
                    {processedImage && <img src={processedImage} alt="Processed" />}
                </div>
            </div>
        </>
    );
};

export default InterviewComponent;
