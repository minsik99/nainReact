import React from "react";
import styles from "../../styles/interview/interviewResult.module.css";
import ButtonContainer from "./ButtonContainer";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import LineChart from "./LineChart";
import DoughnutChart from "./DoughnutChart";
import { useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Title, Tooltip, Legend, ArcElement} from 'chart.js';
import { useMutation } from "react-query";
import { getInterview } from "../../api/interview/interview";


const InterviewResultComponent = ({memberNo, itvNo, buttons, selectedButton, handleSelected}) => {
    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, 
        Title, Tooltip, Legend, ArcElement, ChartDataLabels);  
        const [dataSet, setDataSet] = useState([]);
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


    const lineData2 = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [
            {
                label: 'Video',
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(26, 7, 248, 1)',
                data: dataSet,
            },
        ],
    };

    const lineData3 = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [
            {
                label: 'total',
                backgroundColor: 'rgba(128, 128, 128, 0.5)',
                borderColor: 'rgba(26, 7, 248, 1)',
                data: dataSet,
            },
        ],
    };

    const doughnutOptions = {
        cutout: '0%',
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'end',
                offset: 10,
                formatter: (value, context) => {
                    return context.chart.data.labels[context.dataIndex];
                },
                color: '#000',
                font: {
                    weight: 'bold',
                },
            },
        },
    };
    
    const legendOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'right', // 범례를 차트의 오른쪽으로 이동
                labels: {
                    boxWidth: 20,
                    padding: 20,
                },
            },
        },
    };
    const doughnutData = {
        labels: ['중립', '놀람', '기쁨'],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
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
            {selectedButton == 'video' &&
            <div className={styles.resultContainer}>
                {mutation.isLoading && <Loading loading={mutation.isLoading} text="Loading..." />}
                {mutation.isError && <p>Error occurred: {mutation.error.message}</p>}
                <div className={styles.chartRow}>
                    <LineChart data={lineData} title="답변수치" />
                    <LineChart data={lineData} title="자세분석" />
                </div>
                <div className={styles.chartRow}>
                    <DoughnutChart data={doughnutData} options={{ ...doughnutOptions, ...legendOptions }} title="감정 분석" />
                    <LineChart data={lineData} title="시선 감지" />
                </div>
            </div>
            }
            {selectedButton == 'total' &&
            <div className={styles.resultContainer}>
                <div className={styles.textRow}>
                    <div className={styles.resultText}>
                    {mutation.isLoading && <Loading loading={mutation.isLoading} text="Loading..." />}
                    {mutation.isError && <p>Error occurred: {mutation.error.message}</p>}
                        <div className={styles.leftText}>{memberNo} 님의 면접 결과</div>
                        <div className={styles.rightText}>예시용 문장입니다 예시용 문장입니다 예시용 문장입니다 예시용 문장입니다</div>
                    </div>
                </div>
                <div className={styles.totalContainer}>
                {mutation.isLoading && <Loading loading={mutation.isLoading} text="Loading..." />}
                {mutation.isError && <p>Error occurred: {mutation.error.message}</p>}
                    <div className={styles.totalV}>
                    <LineChart data={lineData} title="음성분석결과" />
                    <LineChart data={lineData2} title="영상분석결과" />
                    </div>
                    <div className={styles.totalBox}>
                        <LineChart data={lineData3} title="총분석결과" />
                    </div>
                </div>
            </div>
            }

            </div> 
    );
};

export default InterviewResultComponent;