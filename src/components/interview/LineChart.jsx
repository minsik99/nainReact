import React from 'react';
import { Line } from 'react-chartjs-2';
import styles from '../../styles/interview/interviewResult.module.css';

const LineChart = ({ data, title }) => {
    const options = {
        scales: {
            y: {
                beginAtZero: true, // Y축이 0에서 시작
                min: 0, // Y축 최소값 설정
                max: 100, // Y축 최대값 설정
                ticks: {
                  stepSize: 10,
                }
              },
        }
    }

    return(<div className={styles.chartBox}>
        <div className={styles.title}>{title}</div>
        <div className={styles.chartContainer}>
            <Line data={data} options={options} />
        </div>
    </div>
)};

export default LineChart;
