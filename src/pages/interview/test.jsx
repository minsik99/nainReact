import React, { useRef, useEffect, useState } from 'react';
import RadiusButton from '../../components/designTool/RadiusButton';
import styles from '../../styles/interview/interviewComponent.module.css';
import { observer } from "mobx-react";
import { saveOneVideo } from '../../api/interview/video';
import Loading from '../../components/designTool/Loading';
import PathText from '../../components/interview/PathText';
import {useModal} from '../../components/hook/useModal';
import NotButtonModal from '../../components/interview/NotButtonModal';
import { useRouter } from 'next/router';
import { authStore } from '../../stores/authStore';

//파이썬으로 영상보내기
const InterviewComponent = observer(() => {
    const router = useRouter();
    const { itvNo, question, memberNo } = router.query;
    const { isOpened, modalData, openModal, closeModal } = useModal();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [stream, setStream] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [downChunks, setDownChunks] = useState([]);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [fileIndex, setFileIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [count, setcount] = useState(0);
    const [saved, setSaved] = useState(true);
    let que = '';
    useEffect(() => {
        if(!router.isReady) return;
        console.log(itvNo, memberNo, decodeURIComponent(question));

        if (!authStore.isSubscribe) {
            console.log("구독여부", authStore.isSubscribe);
            alert("구독이 필요한 서비스입니다.");
            router.push('/payment');
        }

     }, [router.isReady]);

     try {
        que = JSON.parse(decodeURIComponent(question));
        console.log(que);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
      
    const paths = [
        { name: '메인', link: '/' },
        { name: 'AI history', link: '/interview' },
        { name: 'AI 면접', link: '/interview/test' }
    ];

    const handleStartRecording = async () => {
        console.log("handleStartRecording 시작");
        console.log("count", count);
        if(count == 0) {
            startRecording();
            // setcount((preCount)=> preCount + 1);
        } else if (!isRecording) {
            setIsRecording(prevState => !prevState);
        }
        setcount((preCount)=> preCount + 1);
    };

    useEffect(() => {
        console.log("isRecording 상태가 변경됨:", isRecording);
        if(isRecording) {
            saveVideo();
        } else { 
            startRecording();
        } 
    }, [isRecording]);
    

    // 녹화 시작
    const startRecording = () => {
        try {
            console.log("레코드 시작전 stream", stream);
            // if (!stream || !stream.active) {
            //     const newStream = await navigator.mediaDevices.getUserMedia({
            //         video: { width: 1280, height: 720 },
            //         audio: true
            //     });
            //     setStream(newStream);
            //     videoRef.current.srcObject = newStream;
            // }

            let options = { mimeType: 'video/webm; codecs=vp8,opus' };
            let recorder = null;
           
            if (stream && stream.active && !isRecording && saved) {
                console.log("스트림 존재함 레코딩 시작");
                videoRef.current.srcObject = stream;
                if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                    mediaRecorder.stop();
                }
    
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    console.warn(`${options.mimeType} is not supported, using default MIME type`);
                    delete options.mimeType;
                }
    
                recorder = new MediaRecorder(stream, options);
                console.log("MediaRecorder 생성됨", recorder);

                console.log("레코더 사용 여부", recorder.ondataavailable);
                recorder.ondataavailable = event => {
                    if (event.data.size > 0) {
                        setRecordedChunks(prev => {
                            const newRecordedChunks = [...prev, event.data];
                            console.log("RecordedChunks:", newRecordedChunks);
                            return newRecordedChunks;
                        }); 
                        
                    } else {
                        console.log("No data available");
                    }
                };

                
                recorder.start(1000);
                setMediaRecorder(recorder);
            } else {
                if (!stream) {
                    console.error("No stream available for recording.");
                } else if (!stream.active) {
                    console.error("Stream is not active.");
                }
            }
        } catch (error) {
            console.error("Failed to start recording:", error);
        }
    };
    
    
    // 녹화 중지
    const stopRecording = async () => {
        if (mediaRecorder) {
            mediaRecorder.onstop = () => {
                console.log("Recorder stopped");
            };
            mediaRecorder.stop();
                }
    };

    const saveVideo2 = async () => {
        return await new Promise((resolve, reject) => {
            if (downChunks.length || recordedChunks.length) {
                setDownChunks(prevD => {
                    const newDownChunks = [...prevD, ...downChunks];
                    console.log("downChunks:", newDownChunks);      
                const blob = new Blob(newDownChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = itvNo + '.webm';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    resolve();
                }, 100);
            });
            } else {
                reject(new Error('No recorded chunks to save.'));
            }
        });
    };

    
    // 녹화된 비디오 저장 및 서버로 전송
    const saveVideo = async () => {
        try {
            setSaved(false);
            if (recordedChunks.length > 0) {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const formData = new FormData();
                formData.append('video', blob, `${fileIndex}.webm`);
                formData.append('itvNo', itvNo);
                formData.append('qNo', que[fileIndex].qno);
                console.log("FormData prepared:", formData);
                await stopRecording();
                await saveOneVideo(formData).then(res => {
                    console.log("파이썬 res", res.success);
                    if(res.success == "Analysis Succeed"){
                        setSaved(true);
                    }
                });

                setFileIndex(prevIndex => {
                    const newIndex = prevIndex < 10 ? prevIndex + 1 : 0;
                    console.log("Updated fileIndex:", newIndex);
                    if (newIndex === 0) {
                        stopCamera();
                    }
                    return newIndex;
                });
    

                // setFileIndex(prevIndex => {
                //     if (prevIndex < 10) {
                //         return prevIndex + 1;
                //     } else {
                //         stopCamera();
                //         return 0;
                //     }
                // });

                setDownChunks(prev => {
                    const newDownChunks = [...prev, ...recordedChunks];
                    console.log("downChunks:", newDownChunks);
                    return newDownChunks
                });
                console.log("ChunkLenght", downChunks.length);
                console.log("저장후 청크 비우기");
                setRecordedChunks([]);
                setIsRecording(false);
            } else {
                console.log("저장할 chunk가 없음");
            }
        } catch (err) {
            console.error("Error sending video to server: ", err);
        }
    };

    const startCamera = async () => {
        if (isCameraOn) {
            return;
        }
        let stream = null;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true });
            console.log("카메라 stream:::", stream);

            if (memberNo) {
                try {
                    setIsCameraOn(true);

                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                    setStream(stream);
                    handleOpenModal();
                    startRecording(stream);
                } catch (err) {
                    console.error("인터뷰 추가 실패", err);
                }
            } else {
                setIsCameraOn(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                startRecording();
            }
        } catch (err) {
            console.error("카메라 시작 실패", err);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }
    };

    const handleInterviewEnd = () => {
        stopCamera();
        alert("면접이 종료되었습니다.");
        router.push('/interview');
    };

    

    const stopCamera = async () => {
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        try {
            if (downChunks.length > 0) {
                await saveVideo2();
                setDownChunks([]);
            }
        } catch (err) {
            console.error("영상 저장 실패", err);
        }

        try {
            if (recordedChunks.length > 0) {
                await saveVideo();
                
                setRecordedChunks([]);
            }
        } catch (err) {
            console.error("영상 저장 실패", err);
        }

        setFileIndex(0);
        setStream(null);
        setIsCameraOn(false);
        router.push("/interview");
    };

    const handleOpenModal = () => {
        openModal({
          content: '오른쪽에 위치한 버튼을 누르면 '
                   + '다음 질문으로 넘어갑니다.'
        }); 
      };

      useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    

    return (
        <div className={styles.base}>
            <div className={styles.path}> <PathText paths={paths} /></div>
            <div className={styles.testContainer}>
                        <div className={styles.videoContainer}>
                            <div className={styles.header}>
                                <div></div>
                                { !isCameraOn || count == 0 && fileIndex == 0? 
                                (<span>Q : 질문이 나오는 칸입니다.</span>
                                ) : (
                                    count == 11 ?
                                    (
                                        handleInterviewEnd()
                                ) :
                                    <span>Q{count} : {que[count - 1].qcontent}</span> 
                                )}
                                <div>
                                {count < 11 && isCameraOn &&
                                <img className={styles.arrowBox} onClick={handleStartRecording} src="/image/arrowbox.png"/>
                                }
                                </div>
                            </div>
                                <NotButtonModal event={handleStartRecording} position={{ top: '20%', left: '82%' }} isOpened={isOpened} data={modalData} closeModal={closeModal} />
                                {isCameraOn && saved? (
                                    <video className={styles.video} ref={videoRef} autoPlay muted />
                                ) : (
                                    <div className={styles.emptyScreen}>
                                        {count > 0 ? <Loading text="저장 중.. 답변을 준비해주세요." />
                                        : <Loading text="준비되면 '면접 시작하기'를 눌러주세요" />}
                                    </div>
                                )}
                            <div className={styles.emptyBottom}>
                                <div className={styles.buttonBox}>
                                    <RadiusButton
                                        color="#77AAAD"
                                        fontSize="14px"
                                        padding="0.5rem 1rem"
                                        onClick={isCameraOn ? handleInterviewEnd : startCamera }
                                        text={isCameraOn ? '면접 중단' : '면접 시작하기'}
                                    />
                                </div>
                            </div>
                        </div>
                    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            </div>
        </div>
    );
});

export default InterviewComponent;
          

