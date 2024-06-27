import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/resume/AcceptedKeyword.module.css';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Chart.js에 필요한 컴포넌트 등록
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const AcceptedKeyword = () => {
  const [selectedJob, setSelectedJob] = useState('웹 개발자');
  const [jobKeywords, setJobKeywords] = useState([]);
  const jobOptions = ['웹 개발자', '프론트엔드 개발자', '서버 개발자', '서비스 기획자', 'PM'];

  useEffect(() => {
    if (selectedJob) {
      fetchJobKeywords(selectedJob);
    }
  }, [selectedJob]);

  const fetchJobKeywords = async (jobCategory) => {
    try {
      const response = await axios.get(`http://localhost:9999/acceptedkeyword/api/keywords?jobCategory=${jobCategory}`);
      setJobKeywords(response.data);
    } catch (error) {
      console.error('Failed to fetch job keywords: ', error);
    }
  };

  // 상위 10개 사용 빈도 키워드만 추출
  const topKeywords = jobKeywords
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);

  const data = {
    labels: topKeywords.map(keyword => keyword.acceptKeyword), // 동적 라벨 설정
    datasets: [
      {
        label: '사용빈도',
        data: topKeywords.map(keyword => keyword.frequency),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // chart 최대값, 증감 단위 고정
  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      r: {
        suggestedMax: 100,
        suggestedMin: 50,
        ticks: {
          stepSize: 10,
        },
        pointLabels: {
          font: {
            size: 20,
          },
          // padding: 20
        },
      },
    },
  };

  return (
      <div className={styles.acceptedKeywordContainer}>
      <div className={styles.keywordtitle}>
        직무 키워드
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
            <label>
              <h4>{selectedJob}</h4>
              <ul>
                {topKeywords.map((keyword) => (
                  <li key={keyword.keywordNo}>
                    * {keyword.acceptKeyword} : 사용빈도 {keyword.frequency}%
                  </li>
                ))}
              </ul>
            </label>
            <div className={styles.acceptKeywordInformation}>
              <img src="/image/InformationIcon.png" alt="데이터 정보" className={styles.informationIcon} />
              {selectedJob} 공고 1,000개 분석 / 2024-06-27 기준
            </div>
          </div>
          <div className={styles.acceptedKeywordChart}>
            <Radar data={data} options={chartOptions} height={1000} width={1000} />
          </div>
        </div>
      </div>
  );
};

export default AcceptedKeyword;
