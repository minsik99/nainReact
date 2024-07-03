import React from "react";
import styles from "../../styles/interview/interviewResult.module.css";
import ButtonContainer from "./ButtonContainer";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import { useState,useEffect } from "react";
import { emotionAnaly, PosEyeAnaly, videoTotal, totalVideo  } from "../../api/interview/video";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    BarElement, LineElement, Title, Tooltip, Legend, ArcElement} from 'chart.js';
import { useMutation } from "react-query";
import { getInterview, analsisText, totalVoice, getInterviewScore } from "../../api/interview/interview";
import Voice from "../../components/interview/Voice";
import BarChart from "./BarChart";


const InterviewResultComponent = ({memberNo, itvNo, buttons, selectedButton, handleSelected}) => {
    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement,
        Title, Tooltip, Legend, ArcElement, ChartDataLabels);  
        const [dataSet, setDataSet] = useState([]);
        const [posData, setPosData] = useState(null);
        const [eyeData, setEyeData] = useState(null);
        const [videoScore, setVideoScore] = useState({labels: [], datasets: []});
        const [videoTotalData, setVideoTotalData] = useState(null);
        const [totalData, setTotalData] = useState({labels: [], datasets: []});
        const [emotionData, setEmotionData] = useState({ labels: [], datasets: [] });
        const [analyText, setAnalyText] = useState(null);
        const totalScore = 80
        
        const fetchEmoData = async () => {
            try {
                const response = await emotionAnaly(itvNo);
                if (response) {
                    const labels = Object.keys(response).map(label => {
                        switch (label) {
                            case 'happy':
                                return '행복';
                            case 'neutral':
                                return '중립';
                            case 'sad':
                                return '슬픔';
                            case 'surprise':
                                return '놀람';
                            default:
                                return label;
                            }
                        })
                    const values = Object.values(response);
                
                    const backgroundColors = labels.map(label => {
                        switch (label) {
                            case '행복':
                                return 'rgba(255, 206, 86, 0.2)'; // 노란색
                            case '중립':
                                return 'rgba(201, 203, 207, 0.2)'; // 회색
                            case '슬픔':
                                return 'rgba(54, 162, 235, 0.2)'; // 파란색
                            case '놀람':
                                return 'rgba(255, 99, 132, 0.2)'; // 빨간색
                            default:
                                return 'rgba(75, 192, 192, 0.2)'; // 기본 색상
                        }
                    });
    
                    const borderColors = labels.map(label => {
                        switch (label) {
                            case '행복':
                                return 'rgba(255, 206, 86, 1)'; // 노란색
                            case '중립':
                                return 'rgba(201, 203, 207, 1)'; // 회색
                            case '슬픔':
                                return 'rgba(54, 162, 235, 1)'; // 파란색
                            case '놀람':
                                return 'rgba(255, 99, 132, 1)'; // 빨간색
                            default:
                                return 'rgba(75, 192, 192, 1)'; // 기본 색상
                        }
                    });
    
                    setEmotionData({
                        labels: labels,
                        datasets: [
                            {
                                label: 'Emotion Averages',
                                data: values,
                                backgroundColor: backgroundColors,
                                borderColor: borderColors,
                                borderWidth: 1,
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error('Error fetching emotion data:', error);
            }
        };

        const fetchAnalyText = async () => {
            const textData = await analsisText(totalScore, itvNo);
            if(textData) {
                console.log("text", textData);
                setAnalyText(textData.data);
            }
        }

        const fetchTotalData = async () => {
            try {
                const [videoResponse, voiceResponse] = await Promise.all([totalVideo(itvNo), totalVoice(itvNo)]);
                const totalData = await getInterviewScore();
                const data = [(videoResponse + voiceResponse) / 2, totalData.data]
                if (totalData) {
                    const labels = ['나의 점수', '평균'];
                    setTotalData({
                        labels: labels,
                        datasets: [
                            {
                                label: '총분석 결과',
                                data: data,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                                fill: false,
                            },
                        ],
                })
            }
            } catch (error) {
                console.error('Error fetching total data:', error);
            }
        };
            

        const fetchTotalVideo = async () => {
            try {
                const [videoResponse, voiceResponse] = await Promise.all([totalVideo(itvNo), totalVoice(itvNo)]);

                if (videoResponse && voiceResponse) {
                    const labels = ['영상', '음성'];
                    const data = [videoResponse, voiceResponse]; 
                    setVideoScore({
                        labels: labels,
                        datasets: [
                            {
                                label: '영상/음성 결과',
                                data: data,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                                fill: false,
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error('Error fetching video total data:', error);
            }
        };




        const fetchVideoTotalData = async () => {
            try {
                const response = await videoTotal(itvNo);

                console.log('Response:', response); 
                const labels = Object.keys(response);
                const values = Object.values(response);
                
                console.log('Labels:', labels); // labels의 값을 로그로 출력하여 확인
                console.log('Values:', values)
                
                if (response) {
                    const labels = Object.keys(response)
                    const values = Object.values(response)
                    setVideoTotalData({
                        labels: labels.map((_, index) => `${index + 1}`),
                        datasets: [
                            {
                                label: '영상',
                                data: values,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                                fill: false,
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error('Error fetching video total data:', error);
            }
        };


        const fetchPosEyeData = async () => {
            try {
                const response = await PosEyeAnaly(itvNo);
                if (response) {
                    const posData = response.POS || [];
                    const eyeData = response.EYE || [];

                    setPosData({
                        labels: posData.map((_, index) => `${index + 1}`),
                        datasets: [
                            {
                                label: '자세',
                                data: posData,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                                fill: false,
                            },
                        ],
                    });

                    setEyeData({
                        labels: eyeData.map((_, index) => `${index + 1}`),
                        datasets: [
                            {
                                label: '시선',
                                data: eyeData,
                                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                borderColor: 'rgba(153, 102, 255, 1)',
                                borderWidth: 1,
                                fill: false,
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error('Error fetching emotion data:', error);
            }
        };
        
        useEffect(() => {
            const setting = async () =>{
                try {
                    if(itvNo) {
                    await fetchEmoData();
                    await fetchPosEyeData();
                    await fetchVideoTotalData();
                    await fetchTotalVideo();
                    await fetchAnalyText();
                    await fetchTotalData();
                }   
                } catch (error) {
                    console.error("데이터 불러오기 중 오류 발생:", error);
                }
            }
            
            setting()
        }, [itvNo]);

       
        
        const mutation = useMutation((itvNo) => getInterview(itvNo),
           {
                onSuccess: (response) => {
                    setDataSet(response.data);
                },
                onError: (error) => {
                    console.error('Error fetching data:', error);
                }
            }
            
        );
    
        const lineData = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [
            {
                label: 'Voice',
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                data: dataSet,
            },
        ],
    };

    return (
        <div className={styles.graphContainer}>
            <ButtonContainer
                buttons={buttons}
                selectedButton={selectedButton}
                handleSelected={handleSelected}
            />

            {selectedButton == 'voice' && itvNo ?
            <div className={styles.resultContainer}>
                {mutation.isLoading && <Loading loading={mutation.isLoading} text="Loading..." />}
                {mutation.isError && <p>Error occurred: {mutation.error.message}</p>}
                <Voice itvNo={itvNo}></Voice>
            </div>
            : <div className={styles.emptyBox}>
                지금 바로 AI 면접을 보고 결과를 확인하세요!
            </div>
            }
            {selectedButton == 'video' && itvNo &&
            <div className={styles.resultContainer}>
                {mutation.isLoading && <Loading loading={mutation.isLoading} text="Loading..." />}
                {mutation.isError && <p>Error occurred: {mutation.error.message}</p>}
                <div className={styles.chartRow}>
                    <LineChart data={videoTotalData} title="영상분석결과" />
                    <LineChart data={posData} title="자세분석" />
                </div>
                <div className={styles.chartRow}> 
                    <PieChart data={emotionData} title="감정 분석" />
                    <LineChart data={eyeData} title="시선 감지" />
                </div>
            </div>
            }
            {selectedButton == 'total' && itvNo &&
            <div className={styles.resultContainer}>
                <div className={styles.textRow}>
                    <div className={styles.resultText}>
                    {mutation.isLoading && <Loading loading={mutation.isLoading} text="Loading..." />}
                    {mutation.isError && <p>Error occurred: {mutation.error.message}</p>}
                        <div className={styles.leftText}>{memberNo} 님의 <br/> 면접 결과</div>
                        <div className={styles.rightText}>{analyText}                         
                        </div>
                    </div>
                </div>
                <div className={styles.totalContainer}>
                {mutation.isLoading && <Loading loading={mutation.isLoading} text="Loading..." />}
                {mutation.isError && <p>Error occurred: {mutation.error.message}</p>}
                <div className={styles.totalBox}>
                    <BarChart data={videoScore}  title="음성/영상분석결과"/>
                    <BarChart data={totalData} title="총분석결과" />
                    </div>
                </div>
            </div>}

            </div> 
    );
};

export default InterviewResultComponent;