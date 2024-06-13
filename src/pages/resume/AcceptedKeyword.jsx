import React, { useState } from 'react';
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

const jobKeywords = {
  '웹 개발자': {
    keywords: [
      { name: '웹 개발', usage: 97 },
      { name: 'HTML', usage: 86 },
      { name: 'CSS', usage: 84 },
      { name: 'JavaScript', usage: 75 },
      { name: 'jQuery', usage: 62 },
    ],
    chartData: [97, 86, 84, 75, 62],
  },
  '프론트엔드 개발자': {
    keywords: [
      { name: 'React', usage: 95 },
      { name: 'JavaScript', usage: 90 },
      { name: 'CSS', usage: 85 },
      { name: 'HTML', usage: 80 },
      { name: 'Redux', usage: 70 },
    ],
    chartData: [95, 90, 85, 80, 70],
  },
  '서버 개발자': {
    keywords: [
      { name: 'Node.js', usage: 90 },
      { name: 'Express', usage: 85 },
      { name: 'MongoDB', usage: 80 },
      { name: 'SQL', usage: 75 },
      { name: 'API', usage: 70 },
    ],
    chartData: [90, 85, 80, 75, 70],
  },
  '자바 개발자': {
    keywords: [
      { name: 'Java', usage: 98 },
      { name: 'Spring', usage: 90 },
      { name: 'Hibernate', usage: 85 },
      { name: 'SQL', usage: 80 },
      { name: 'Maven', usage: 75 },
    ],
    chartData: [98, 90, 85, 80, 75],
  },
  '파이썬 개발자': {
    keywords: [
      { name: 'Python', usage: 99 },
      { name: 'Django', usage: 88 },
      { name: 'Flask', usage: 85 },
      { name: 'Pandas', usage: 80 },
      { name: 'NumPy', usage: 75 },
    ],
    chartData: [99, 88, 85, 80, 75],
  },
};

const AcceptedKeyword = () => {
  const [selectedJob, setSelectedJob] = useState('웹 개발자');
  const jobOptions = Object.keys(jobKeywords);

  const data = {
    labels: ['웹 개발', 'HTML', 'CSS', 'JavaScript', 'jQuery'],
    datasets: [
      {
        label: '사용 빈도',
        data: jobKeywords[selectedJob].chartData,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={styles.acceptedKeywordContainer}>
      <h1>합격 키워드</h1>
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
      <div className={styles.acceptedKeywordKeywords}>
        <h3>{selectedJob}</h3>
        <ul>
          {jobKeywords[selectedJob].keywords.map((keyword) => (
            <li key={keyword.name}>
              {keyword.name} - 사용 빈도: {keyword.usage}%
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.acceptedKeywordChart}>
        <Radar data={data} />
      </div>
    </div>
  );
};

export default AcceptedKeyword;
