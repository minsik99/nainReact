import React from 'react';
import { Bar } from 'react-chartjs-2';
import styles from '../../styles/interview/interviewResult.module.css';

const BarChart = ({ data, title }) => {

    const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
    }
    return(<div className={styles.chartBox}>
        <div className={styles.title}>{title}</div>
        <div className={styles.chartContainer}>
            <Bar data={data} options={options}/>
        </div>
    </div>
)};

export default BarChart;
