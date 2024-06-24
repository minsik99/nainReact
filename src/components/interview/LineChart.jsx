import React from 'react';
import { Line } from 'react-chartjs-2';
import styles from '../../styles/interview/interviewResult.module.css';

const LineChart = ({ data, title }) => (
    <div className={styles.chartBox}>
        <div className={styles.title}>{title}</div>
        <div className={styles.chartContainer}>
            <Line data={data} />
        </div>
    </div>
);

export default LineChart;
