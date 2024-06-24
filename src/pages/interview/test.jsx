import React, { useRef, useEffect, useState } from 'react';
import RadiusButton from '../../components/designTool/RadiusButton';
import Recording from '../../components/interview/Recording';
import styles from '../../styles/interview/interviewComponent.module.css';
import { observer } from "mobx-react";
//실시간 처리용

const InterviewComponent = observer(()=> { 
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const frameRate = 2;
    const memberNo = 1
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

    // const sendFrameToServer = async (frame) => {
    //     try {
    //         const response = await axios.post('http://127.0.0.1:8080/start', { frame });
    //         setProcessedImage(`data:image/jpeg;base64,${response.data.processedImage}`);
    //     } catch (err) {
    //         console.error("Error sending frame to server: ", err);
    //     }
    // };

    return (
        <>
            <div className={styles.interviewContainer}>
                <div className={styles.buttonBox}>
                    <RadiusButton color="#77AAAD" fontSize="14px" padding="0.5rem 1rem" 
                    onClick={isCameraOn ? stopCamera : startCamera} 
                    text ={isCameraOn ? '중단' : '실시간 면접 테스트'}/>  
                    <RadiusButton color="#77AAAD" fontSize="14px" padding="0.5rem 1rem"
                    onClick={() => saveVideo({memberNo})} disabled={!isCameraOn} text="영상다운로드" />
                </div>
            </div>
            <h2>테스트중</h2>
            <div style={{ display: "flex" }}>
                <video ref={videoRef} autoPlay playsInline />
            </div>
        </>
    );
});

 export default InterviewComponent;
    