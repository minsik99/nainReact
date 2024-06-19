import React, { useRef, useEffect, useState } from 'react';
import { AuthContext } from '../../api/authContext';
import { useContext } from 'react';
import {axios, instance} from '../../api/axiosApi';
import RadiusButton from '../../components/designTool/RadiusButton';
import { startRecording, saveVideo} from './Recording';
import styles from './interviewComponent.module.css';

const InterviewComponent = ({ivtNo}) => {
    const videoRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [stream, setStream] = useState(null);
    const { member, loading } = useContext(AuthContext);
                                                                                               
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
        startRecording(stream);
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
             {console.log(member)}
                <div className={styles.buttonBox}>
                    <RadiusButton color="#77AAAD" fontSize="14px" padding="0.5rem 1rem" 
                    onClick={isCameraOn ? stopCamera : startCamera} 
                    text ={isCameraOn ? '중단' : '실시간 면접 테스트'}/>  
                    <RadiusButton color="#77AAAD" fontSize="14px" padding="0.5rem 1rem"
                    onClick={() => saveVideo({ivtNo})} disabled={!isCameraOn} text="영상다운로드" />
                </div>
            </div>
            <div style={{ display: "flex" }}>
                <video ref={videoRef} autoPlay playsInline />
            </div>
        </>
    );
};

export default InterviewComponent;
