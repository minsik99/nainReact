import React from 'react';
import styles from '../../styles/common/modal.module.css';
import RadiusButton from '../designTool/RadiusButton';
import useClickOutside from '../hook/useClickOutside';
import { useState, useEffect } from 'react';
import CustomDropdown from '../designTool/CustomDropdown';
import NotButtonModal from '../interview/NotButtonModal';


const DefaultModal = ({ data, closeModal, onConfirm }) => {
  //처리할 기본키값 보내는 용도
    const handleConfirmClick  = () => {
      if (data && data.columns) {
        onConfirm(data.columns);
        console.log(data.columns);
      } else {
        console.error('Data or columns are missing');
      }
  
  };
  return (
    <div>
      <div className={styles.modalTitle}>{data.title}</div>
      <div className={styles.modalContent}>{data.content}</div>
      <div className={styles.buttonBox}>
        <RadiusButton className={styles.modalButton} color="#77AAAD" padding="0.5rem 1rem" fontSize="14px" text="취소" onClick={closeModal}/>
        <RadiusButton className={styles.modalButton} color="#77AAAD" padding="0.5rem 1rem" fontSize="14px" text="확인" onClick={handleConfirmClick}/>
      </div>
    </div>
  );
};

// 커스텀 모달 컴포넌트
const CustomModal = ({ data, closeModal, onConfirm}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  //처리할 옵션 보내는 용도
  const handleSelect = (item) => {
    setSelectedItem(item);
  };
  const handleConfirmClick  = () => {
    if (selectedItem) {
      onConfirm(selectedItem);
    }
};

  return (
    <div className={styles.modalBody}>
      <div className={styles.modalTitle}></div>
      <div className={styles.modalContent}>
        <CustomDropdown
          dropdownWidth="200px"
          columns={data.columns}
          onSelect={handleSelect}
        />
      </div>
      <div className={styles.buttonBox}>
        <RadiusButton text="취소" color="#77AAAD" padding="0.5rem 1rem" fontSize="14px" onClick={closeModal} />
        <RadiusButton text="확인" color="#77AAAD" padding="0.5rem 1rem" fontSize="14px" onClick={handleConfirmClick} />
      </div>
    </div>
  );
};

// 모달 컨테이너 컴포넌트
const Modal = ({ isOpened, type, closeModal, data }) => {
  if (!isOpened) return null;

  const wrapperRef = useClickOutside(closeModal);
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalBody} ref={wrapperRef}>
          {type === 'custom' ? (
          <CustomModal onConfirm={data.onConfirm} closeModal={closeModal} data={data} />
        ) : type === 'default' ? (
          <DefaultModal onConfirm={data.onConfirm} data={data} closeModal={closeModal} />
        ) : (
          <div className={styles.notStyle}>
          <NotButtonModal data={data} closeModal={closeModal}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
