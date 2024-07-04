// components/DoughnutChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import styles from '../../styles/interview/interviewResult.module.css';

const PieChart = ({ data, options, title }) => {
    const defaultOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
            
        },
    };

    const combinedOptions = { ...defaultOptions, ...options };

    return (
        <div className={styles.chartBox}>
            <div className={styles.title}>{title}</div>
            <div className={styles.donutContainer}>
                <Pie data={data} options={combinedOptions} />
            </div>
        </div>
    );
};


export default PieChart;
