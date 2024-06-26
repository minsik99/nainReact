import React, { useRef, useEffect, useState } from 'react';
import RadiusButton from '../../components/designTool/RadiusButton';
import styles from '../../styles/interview/interviewComponent.module.css';
import { observer } from "mobx-react";
import { saveOneVideo } from '../../api/interview/video';
import {addInterview} from '../../api/interview/interview';
import Loading from '../../components/designTool/Loading';
import PathText from '../../components/interview/PathText';

//파이썬으로 영상보내기
const InterviewComponent = observer(() => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [memberNo, setMemberNo] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [stream, setStream] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [itvNo, setItvNo] = useState(null);
    const [fileIndex, setFileIndex] = useState(1);
    const [isRecording, setIsRecording] = useState(false);
    
    
    useEffect(() => {
        if (itvNo !== null && isRecording) {
            startRecording(stream);
        }
    }, [itvNo, isRecording]);


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

    
    const handleStartRecording = async () => {
        console.log("handleStartRecording 시작");
        console.log("현재 isRecording:", isRecording);
        console.log("현재 인터뷰 번호", itvNo);
        
        if (isRecording) {
            await saveVideo();
            setRecordedChunks([]);
            startRecording(stream); // 저장 후 다시 녹화 시작
        } else {
            if (itvNo !== null) {
                startRecording(stream);
            }
        }
    };
    
    // 녹화 시작
    const startRecording = (stream) => {
        try {
            console.log("레코드 시작전 stream", stream)
            let options = null;
            let recorder = null;
    
            if (stream && stream.active && memberNo) {
                if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                    mediaRecorder.stop();
                }
    
                options = { mimeType: 'video/webm; codecs=vp8,opus' };
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    console.warn(`${options.mimeType} is not supported, using default MIME type`);
                    delete options.mimeType;
                }
    
                recorder = new MediaRecorder(stream, options);
                console.log("MediaRecorder 생성됨", recorder);

                recorder.start();
                setMediaRecorder(recorder);
                console.log("레코더 사용 여부", recorder.ondataavailable);
                recorder.ondataavailable = event => {
                    if (event.data.size > 0) {
                        setRecordedChunks(prev => [...prev, event.data]);
                        console.log("Data available:", event.data);
                    } else {
                        console.log("No data available");
                    }
                };
                setIsRecording(true);
                videoRef.current.srcObject = stream; // 녹화 중인 영상을 화면에 표시
            } else {
                if (!stream) {
                    console.error("No stream available for recording.");
                } else if (!stream.active) {
                    console.error("Stream is not active.");
                } else if (!memberNo) {
                    console.error("Member number is not defined.");
                }
            }
        } catch (error) {
            console.error("Failed to start recording:", error);
        }
    };
    
    
    // 녹화 중지
    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.onstop = async () => {
                console.log("Recorder stopped");
            };
            mediaRecorder.stop();
            return;
        }
    };
    
    // 녹화된 비디오 저장 및 서버로 전송
    const saveVideo = async () => {
        try {
            console.log("저장할 itvNo", itvNo);
            if (recordedChunks.length > 0 || itvNo !== null) {
                console.log(recordedChunks);
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const formData = new FormData();
                formData.append('video', blob, `${fileIndex}.webm`);
                formData.append('itvNo', itvNo);
                console.log("FormData prepared:", formData);

                const response = await saveOneVideo(formData);
                console.log('Server response:', response.data);
                setIsRecording(false);
                stopRecording();
                
                setFileIndex(prevIndex => {
                    if (prevIndex < 10) {
                        return prevIndex + 1;
                    } else {
                        stopCamera();
                        return 1;
                    }
                });
            } else {
                console.log("No recorded chunks to save.");
            }
        } catch (err) {
            console.error("Error sending video to server: ", err);
        }
    };
    
    // 카메라 시작
    const startCamera = async () => {
        if (isCameraOn) {
            return;
        }
        let stream = null;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true });
            console.log("카메라 stream:::", stream);
            
            // itvNo 상태를 다시 확인하여 두 번 호출되지 않도록 함
            if (itvNo === null && memberNo) {
                try {
                    const res = await addInterview(memberNo);
                    setItvNo(res);
                    setIsCameraOn(true);

                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                    setStream(stream);
                    startRecording(stream);
                } catch (err) {
                    console.error("인터뷰 추가 실패" , err);
                }
            } else {
                // itvNo가 이미 설정되어 있는 경우, 카메라와 스트림 유지
                setIsCameraOn(true);
                setStream(stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                startRecording(stream);
            }
        } catch (err) {
            console.error("카메라 시작 실패", err);
            if(stream) {
                stream.getTracks.forEach(track => track.stop());
            }
        }
    };
    
    useEffect(() => {
        console.log("Current fileIndex:", fileIndex);
    }, [fileIndex]);

    
    // 카메라 중지
    const stopCamera = async() => {
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        
        await saveVideo();
        setRecordedChunks([]);  
        setFileIndex(1);
        setStream(null);      
        setItvNo(null);
        setIsCameraOn(false);
    };

    useEffect(() => {
        if (!isCameraOn && videoRef.current) {
            startCamera();
        }
    }, [isCameraOn, videoRef]);
    
    
    // useEffect(() => {
    //     if (isCameraOn) {
    //         startCamera();
    //     }
    //     return () => {
    //         if (videoRef.current && videoRef.current.srcObject) {
    //             videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    //         }
    //     };
    // }, [isCameraOn]);

    // 컴포넌트 언마운트 시 스트림 정리
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

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
                        <img className={styles.arrowBox} onClick={handleStartRecording} src="/image/arrowbox.png"/>
                    </div>
                        {isCameraOn ? (
                            <video className={styles.video} ref={videoRef} autoPlay muted />
                        ) : (
                            <div className={styles.emptyScreen}><Loading text="Loading.." /></div>
                        )}                
                     <div className={styles.emptyBottom}>
                        <div className={styles.buttonBox}>
                            <RadiusButton
                                color="#77AAAD"
                                fontSize="14px"
                                padding="0.5rem 1rem"
                                onClick={isCameraOn ? stopCamera : startCamera }
                                text={isCameraOn ? '중단' : '실시간 면접 테스트'}
                            />
                            <RadiusButton
                                color="#77AAAD"
                                fontSize="14px"
                                padding="0.5rem 1rem"
                                onClick={stopCamera}
                                disabled={!isCameraOn}
                                text="테스트 중지"
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
          