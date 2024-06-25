import React, { useRef, useEffect, useState } from 'react';
import RadiusButton from '../../components/designTool/RadiusButton';
import styles from '../../styles/interview/interviewComponent.module.css';
import { observer } from "mobx-react";
import { saveOneVideo, realTimeAnaly } from '../../api/interview/video';
import {addInterview} from '../../api/interview/interview';
import Loading from '../../components/designTool/Loading';
import PathText from '../../components/interview/PathText';
import VideoComponent from '../../components/interview/Recording';

const InterviewComponent = observer(() => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [memberNo, setMemberNo] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [stream, setStream] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const memberNo = window.localStorage.getItem("memberNo");
            setMemberNo(memberNo);
        }
    }, []);


    const paths = [
        { name: '메인', link: '/' },
        { name: 'AI history', link: '/interview' },
        { name: 'AI 면접', link: '/interview/test' }
    ];

    // 녹화 시작
    const startRecording = (stream) => {
        if (stream) {
            const recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp8,opus' });
            recorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    setRecordedChunks(prev => [...prev, event.data]);
                }
            };
            recorder.start();
            setMediaRecorder(recorder);
        }
    };

    // 녹화 중지
    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
    };

    // 녹화된 비디오 저장 및 서버로 전송
    const saveVideo = async () => {
        try {
            stopRecording();
            const itvNo = await addInterview(memberNo);
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const formData = new FormData();
            formData.append('video', blob, `${itvNo}.webm`);
            //문제는 여기임 cors
            const response = await saveOneVideo(formData);
            console.log('Server response:', response.data);
        } catch (err) {
            console.error("Error sending video to server: ", err);
        }
    };

    // 카메라 시작
    const startCamera = async () => {
        try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
        startRecording(stream);
        // if (videoRef.current) {
        //     sendFramesToServer(); // 프레임을 서버로 전송 시작
        //     console.log("Sending frames to server");
        // }
        } catch (error) {
        console.error("Error accessing media devices.", error);
        }
    };

    useEffect(() => {
        if (isCameraOn) {
            startCamera();
        }
        return () => {
          if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
          }
        };
      }, [isCameraOn]);


    // 카메라 중지
    const stopCamera = () => {
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        stopRecording();
        setIsCameraOn(false);
    };

    // 컴포넌트 언마운트 시 스트림 정리
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    // 프레임을 서버로 전송
    // const sendFramesToServer = () => {
    //     const captureFrame = () => {
    //         const context = canvasRef.current.getContext('2d');
    //         if(videoRef.current && context) {
    //             if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
    //                 canvasRef.current.width = videoRef.current.videoWidth;
    //                 canvasRef.current.height = videoRef.current.videoHeight;
    //                 context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    //                 const frame = canvasRef.current.toDataURL('image/jpeg', 0.7); // 70% 품질로 압축

    //                 try {
    //                     const response = realTimeAnaly(frame);
    //                 } catch (err) {
    //                     console.error("Error sending frame to server: ", err);
    //                 }
    //             }
    //     } else {
    //         <Loading text="Loading..." />
    //     }
    //     };
    //     const frameRate = 10;
    //     const id = setInterval(captureFrame, 1000 / frameRate); // frameRate에 따라 프레임 전송
    //     setIntervalId(id);
    // };

    return (
        <>
        <div className={styles.path}> <PathText paths={paths} /></div>
            <div className={styles.interviewContainer}>
                <div className={styles.videoContainer}>
                    <div className={styles.header}>
                        <div></div>
                        <span>Q : 질문이 나오는 칸입니다.</span>
                        <img className={styles.arrowBox} src="/image/arrowbox.png"/>
                    </div>
                    {isCameraOn ? (
                        // <VideoComponent />
                        <video className={styles.video} ref={videoRef} autoPlay playsInline />
                    ) : (
                        <div className={styles.emptyScreen}><Loading text="Loading.."/></div>
                    )}                  
                     <div className={styles.emptyBottom}>
                        <div className={styles.buttonBox}>
                            <RadiusButton
                                color="#77AAAD"
                                fontSize="14px"
                                padding="0.5rem 1rem"
                                onClick={isCameraOn ? stopCamera : startCamera}
                                text={isCameraOn ? '중단' : '실시간 면접 테스트'}
                            />
                            <RadiusButton
                                color="#77AAAD"
                                fontSize="14px"
                                padding="0.5rem 1rem"
                                onClick={saveVideo}
                                disabled={!isCameraOn}
                                text="영상다운로드"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </>
    );
});

export default InterviewComponent;
          