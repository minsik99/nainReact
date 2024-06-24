import React from "react";
import { useState } from "react";
import axios from "axios";

const Recording= () => {
const [recordedChunks, setRecordedChunks] = useState([]); 
const [mediaRecorder, setMediaRecorder] = useState(null);

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

const stopRecording = () => {
if (mediaRecorder) {
    mediaRecorder.stop();
}
};


//저정후 파이썬 서버로 전송
const saveVideo = async ({memberNo}) => {
    try {
        stopRecording()
        const itvNo = await addInterview(memberNo);
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const formData = new FormData();
        formData.append('video', blob,  'videotest.webm');
        formData.append('video', blob,  itvNo + '.webm');

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
export default Recording;