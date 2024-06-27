import React from 'react';
import styles from '../../styles/interview/interviewListComponent.module.css';

const InterviewCard = ({ id, title, description, onSelect, isSelected, deleteInterviewOne}) => {
    return (
        <div 
            className={`${styles.interviewItem} ${isSelected ? styles.selected : ''}`} 
            onClick={() => {
                onSelect(id)}}
        >
            <p className={`${styles.title} ${isSelected ? styles.selectedText : ''}`}>{title}</p>
            <p className={`${styles.interviewTime} ${isSelected ? styles.selectedText : ''}`}>{description}</p>
            <img 
                className={styles.trash} onClick={(e) => {e.stopPropagation();
                    deleteInterviewOne();
                }}
                src={isSelected ? "/image/colorTrash.png" : "/image/trash.png"} 
            />
        </div>
    );
};
export default InterviewCard;
