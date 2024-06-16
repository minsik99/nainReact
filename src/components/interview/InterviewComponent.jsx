import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../api/authContext';
import { useContext } from 'react';
import instance from '../../api/axiosApi';

const InterviewComponent = () => {
    const videoRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [stream, setStream] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]); 
    const [mediaRecorder, setMediaRecorder] = useState(null);
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
        startRecording
    };

    const startRecording = () => {
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


    // const sendFrameToServer = async (frame) => {
    //     try {
    //         const response = await axios.post('http://127.0.0.1:8080/start', { frame });
    //         setProcessedImage(`data:image/jpeg;base64,${response.data.processedImage}`);
    //     } catch (err) {
    //         console.error("Error sending frame to server: ", err);
    //     }
    // };

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
            //페이지내 member null로 들어감>> 로그인문제인거같음
            // const ivtNo = await instance.post('/interviewlist', {member});
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const formData = new FormData();
            formData.append('video', blob,  'videotest.webm');
            // formData.append('video', blob,  ivtNo + '.webm');
            // formData.append('ivtNo', ivtNo);

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
                    {isCameraOn ? '중단' : '실시간 면접 테스트'}
                </button>
                <button onClick={saveVideo} disabled={!isCameraOn}>
                    영상다운로드
                </button>
            </div>
            <div style={{ display: "flex" }}>
                <video ref={videoRef} autoPlay playsInline />
            </div>
        </>
    );
};

export default InterviewComponent;
