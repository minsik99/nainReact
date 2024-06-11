import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

const InterviewComponent = () => {
    const videoRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [stream, setStream] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]); 
    const [mediaRecorder, setMediaRecorder] = useState(null);
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

    const startRecording = () => {
        if (stream) {
            const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            recorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    setRecordedChunks(prev => [...prev, event.data]);
                }
            };
            recorder.start();
            setMediaRecorder(recorder);
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


    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
    };

    const sendFrameToServer = async (frame) => {
        try {
            const response = await axios.post('http://127.0.0.1:8080/start', { frame });
            setProcessedImage(`data:image/jpeg;base64,${response.data.processedImage}`);
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
            stopRecording()
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            
            const formData = new FormData();
            formData.append('video', blob, 'recorded_video.webm');

            const response = await axios.post('http://127.0.0.1:8080/save', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Server response:', response.data);
        } catch (err) {
            console.error("Error sending video to server: ", err);
        }
    };

    return (
        <>
            <div>
                <button onClick={isCameraOn ? stopCamera : startCamera}>
                    {isCameraOn ? '카메라 끄기' : '카메라 켜기'}
                </button>
                <button onClick={startRecording} disabled={!isCameraOn}>
                    영상 녹화
                </button>
                <button onClick={saveVideo} disabled={!isCameraOn}>
                    영상저장
                </button>
            </div>
            <div style={{ display: "flex" }}>
                <video ref={videoRef} autoPlay playsInline />
            </div>
        </>
    );
};

export default InterviewComponent;
