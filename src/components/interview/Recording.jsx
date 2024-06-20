import React from "react";
import { useState } from "react";
import axios from "axios";

const Recording = () => {
    const [recordedChunks, setRecordedChunks] = useState([]); 
    const [mediaRecorder, setMediaRecorder] = useState(null);
    
    const startRecording = ({stream}) => {
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

    const stopRecording = () => {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }
    };

    const saveVideo = async ({ivtNo}) => {
        try {
            stopRecording()
            //페이지내 member null로 들어감>> 로그인문제인거같음
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const formData = new FormData();
            formData.append('video', blob,  'videotest.webm');
            formData.append('video', blob,  ivtNo + '.webm');
            formData.append('ivtNo', ivtNo);

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

}