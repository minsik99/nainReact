import React from 'react';
import styles from '../../styles/interview/interviewComponent.module.css';
import { useState } from 'react';

const VideoStream = () => {
const videoRef = useRef(null);
const [isCameraOn, setIsCameraOn] = useState(false);
const [stream, setStream] = useState(null);

                                                                                            
const startCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setStream(stream);
        }
        setIsCameraOn(true);
    } catch (err) {
        console.error("Error accessing webcam: ", err);
    }
    sendFramesToServer
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

useEffect(() => {
    return () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };
}, [stream]);

const sendFramesToServer = () => {
    const context = canvasRef.current.getContext('2d');

    const captureFrame = () => {
        if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const frame = canvasRef.current.toDataURL('image/jpeg', 0.7); // 70% 품질로 압축
            axios.post('http://127.0.0.1:8080/realtimeAnalysis', { frame })
                .catch(err => console.error("Error sending frame to server: ", err));
        }
    };
    setInterval(captureFrame, 1000 / frameRate); // frameRate에 따라 프레임 전송
};


return (
    <>
    <div>
        <h2>실시간 모의면접</h2>
        <video ref={videoRef} style={{ display: 'none' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div className={styles.interviewContainer}>
            {console.log(member)}
            <div className={styles.buttonBox}>
                <RadiusButton color="#77AAAD" fontSize="14px" padding="0.5rem 1rem" 
                onClick={isCameraOn ? stopCamera : startCamera} 
                text ={isCameraOn ? '중단' : '실시간 면접 테스트'}/>  
                
                <RadiusButton color="#77AAAD" fontSize="14px" padding="0.5rem 1rem"
                onClick={() => saveVideo({memberNo})} disabled={!isCameraOn} text="영상다운로드" />
            </div>
        </div>
        </div>
    </>
);
};


export default VideoStream;
