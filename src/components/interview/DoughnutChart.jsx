// components/DoughnutChart.js
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import styles from '../../styles/interview/interviewResult.module.css';

const DoughnutChart = ({ data, options, title }) => (
    <div className={styles.chartBox}>
        <div className={styles.title}>{title}</div>
        <div className={styles.donutContainer}>
            <Doughnut data={data} options={options} />
        </div>
    </div>
);

export default DoughnutChart;
