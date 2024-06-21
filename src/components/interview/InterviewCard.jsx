import React from 'react';
import styles from '../../styles/interview/interviewListComponent.module.css';

const InterviewCard = ({ key, title, description, onSelect}) => {
    return (
        <div key={key} className={styles.interviewItem}>
            <p className={styles.interviewTitle}>{key}</p>
            <p className={styles.title}>{title}</p>
            <p className={styles.interviewTime}>{description}</p>
            <img className={styles.trash}  src={title != null && !onSelect ? "/image/colorTrash.png" : "/image/trash.png"} />
        </div>
    );
};
export default InterviewCard;
