import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/resume/AcceptedKeyword.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Chart.js에 필요한 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const AcceptedKeyword = () => {
  const [selectedJob, setSelectedJob] = useState('웹 개발자');
  const [jobKeywords, setJobKeywords] = useState([]);
  const [expKeywords, setExpKeywords] = useState([]);
  const [referenceDate, setReferenceDate] = useState('');
  const jobOptions = ['웹 개발자', '프론트엔드 개발자', '서버 개발자', '서비스 기획자', 'PM'];

  useEffect(() => {
    if (selectedJob) {
      fetchJobKeywords(selectedJob);
      fetchReferenceDate(selectedJob);
    }
  }, [selectedJob]);

  const fetchJobKeywords = async (jobCategory) => {
    try {
      const jobResponse = await axios.get(`http://localhost:9999/acceptedkeyword/api/jobkeywords?jobCategory=${jobCategory}`);
      const expResponse = await axios.get(`http://localhost:9999/acceptedkeyword/api/expkeywords?jobCategory=${jobCategory}`);
      setJobKeywords(jobResponse.data);
      setExpKeywords(expResponse.data);
    } catch (error) {
      console.error('Failed to fetch job keywords: ', error);
    }
  };

  const fetchReferenceDate = async (jobCategory) => {
    try {
      const response = await axios.get(`http://localhost:9999/acceptedkeyword/api/referenceDate?jobCategory=${jobCategory}`);
      setReferenceDate(formatDate(response.data));
    } catch (error) {
      console.error('Failed to fetch reference date: ', error);
    }
  };

  const jobData = {
    labels: jobKeywords.map(keyword => keyword.acceptKeyword),
    datasets: [
      {
        label: '백분율',
        data: jobKeywords.map(keyword => keyword.frequency),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // 상위 5개의 값과 기타를 계산하는 함수
  const prepareExpData = (keywords) => {
    const sortedKeywords = [...keywords].sort((a, b) => b.frequency - a.frequency);
    const top5 = sortedKeywords.slice(0, 5);
    const others = sortedKeywords.slice(5);

    const top5Labels = top5.map(keyword => keyword.acceptKeyword);
    const top5Data = top5.map(keyword => keyword.frequency);

    const othersSum = others.reduce((sum, keyword) => sum + keyword.frequency, 0);
    top5Labels.push('기타');
    top5Data.push(othersSum);

    return {
      labels: top5Labels,
      datasets: [
        {
          label: '백분율',
          data: top5Data,
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 205, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(201, 203, 207, 0.6)'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const expData = prepareExpData(expKeywords);

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value) => value,
        color: 'gray',
      },
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        suggestedMax: 100,
      },
    },
  };

  const doughnutOptions = {
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        formatter: (value, context) => context.chart.data.labels[context.dataIndex], // 각 섹션에 해당 값 표시
        color: 'black',
      },
      legend: {
        labels: {
          padding: 20, // 범례와 그래프 사이 간격 조정
          boxWidth: 20,
          font: {
            size: 12,
          },
          usePointStyle: true, // 점 스타일 사용
        },
        position: 'bottom',
        // align: 'start',
        maxWidth: 500, // 범례의 최대 너비 설정
      },
    },
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Seoul' };
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', options);
  };

  return (
    <div className={styles.acceptedKeywordContainer}>
      <div className={styles.keywordtitle}>
        직무 분석
      </div>
      <div className={styles.acceptedKeywordJobSelection}>
        {jobOptions.map((job) => (
          <button
            key={job}
            className={
              selectedJob === job
                ? styles.acceptedKeywordSelected
                : ''
            }
            onClick={() => setSelectedJob(job)}
          >
            {job}
          </button>
        ))}
      </div>
      <div className={styles.acceptedKeywordContent}>
        <div className={styles.acceptedKeywordKeywords}>
            <h5>{selectedJob}</h5>
        </div>
        <div className={styles.chartsContainer}>
          <div className={styles.acceptedKeywordChart}>
            <div className={styles.acceptedKeywordChartTitle}>
              <h5>■ 직무 키워드</h5>
            </div>
            <Bar data={jobData} options={chartOptions} height={400} width={700} />
          </div>
          <div className={styles.acceptedKeywordChart}>
            <h5>■ 요구 경력</h5>
            <Doughnut data={expData} options={doughnutOptions} height={400} width={700} />
          </div>
        </div>
        &nbsp;

        <div className={styles.acceptKeywordInformation}>
          <img src="/image/informationIcon.png" alt="데이터 정보" className={styles.informationIcon} />
          {selectedJob} 공고 1,000개 분석 / {referenceDate} 기준
        </div>
      </div>
    </div>
  );
};

export default AcceptedKeyword;
