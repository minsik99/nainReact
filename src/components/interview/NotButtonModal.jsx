import React, { useEffect, useRef } from 'react';
import styles from '../../styles/common/NotButtonModal.module.css';
import useClickOutside from '../hook/useClickOutside';
const NotButtonModal = ({isOpened, closeModal, data,  position, event}) => {
  const wrapperRef = useClickOutside(closeModal);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
        closeModal();
        if(event) {
          event();}
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [closeModal]);

  const modalStyle = {
    top: position?.top || 'auto',
    left: position?.left || 'auto',
    transform: 'translate(-50%, -50%)',
    position: 'fixed',
    zIndex: 1000
  };

  if (position?.top && position?.left) {
    modalStyle.transform = 'none'; // 사용자가 위치를 지정한 경우 중앙 정렬을 제거
  }

  if (!isOpened) return null;

  const handleInnerClick = (e) => {
    e.stopPropagation();
    if(event) {
      console.log("event started");
    event();
    } else {
      console.log("not event")
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div
        className={styles.modal}
        style={modalStyle}
        onClick={handleInnerClick}
        ref={wrapperRef}>
        <div className={styles.modalContent} >{data.content}</div>
      </div>
    </div>
  );
};

export default NotButtonModal;