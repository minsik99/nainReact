import React, { useEffect, useRef } from 'react';
import styles from '../../styles/common/modal.module.css';

const NotButtonModal = ({data, closeModal}) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (wrapperRef.current && wrapperRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [closeModal]);

    //처리할 기본키값 보내는 용도
    return (
      <div className={styles.modalBody} ref={wrapperRef}>
        <div className={styles.modalTitle}></div>
        <div className={styles.modalContent}>{data.content}</div>
      </div>
    );
  };
export default NotButtonModal;