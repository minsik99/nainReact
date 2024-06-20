import React from 'react';

const InterviewCard = ({ title, description, time}) => {
    return (
        <div className={styles.interviewItem}>
            <h2 className={styles.interviewTitle}>{title}</h2>
            <p className={styles.interviewDescription}>{description}</p>
            <h2 className={styles.interviewTime}>{time}</h2>
        </div>
    );
};
export default InterviewCard;
