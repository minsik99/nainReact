import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import instance from '../../api/axiosApi';
import styles from '../../styles/resume/MyResume.module.css';

const MyResume = () => {
  const router = useRouter();
  const [resumes, setResumes] = useState([]);
  const [openResume, setOpenResume] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await instance.get('/resume/member');
        setResumes(response.data);
      } catch (error) {
        console.error('Error fetching resumes:', error);
      }
    };

    fetchResumes();
  }, []);

  const handleMenuClick = (resumeNo) => {
    setOpenResume(prevOpenResume => prevOpenResume === resumeNo ? null : resumeNo);
  };

  const handleEditClick = (resumeNo) => {
    router.push(`/resume/MyResumeUpdate?resumeNo=${resumeNo}`);
  };

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  // resume 삭제 : experience, education, activity 삭제 후 resume 삭제
  const handleConfirmDelete = async () => {
    try {
        const token = localStorage.getItem('token'); // 실제 유효한 토큰으로 교체
        await Promise.all([
            axios.delete(`http://localhost:9999/experience/resume/${openResume}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }),
            axios.delete(`http://localhost:9999/education/resume/${openResume}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }),
            axios.delete(`http://localhost:9999/activity/resume/${openResume}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        ]);
        await axios.delete(`http://localhost:9999/resume/${openResume}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setResumes(resumes.filter((resume) => resume.resumeNo !== openResume));
        setShowModal(false);
        setOpenResume(null);
    } catch (error) {
        console.error('Error deleting resume or related data:', error);
        setShowModal(false);
    }
};

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  const handleAcceptedKeywordClick = () => {
    router.push('/resume/AcceptedKeyword');
  };

  const handleNewResumeClick = () => {
    router.push('/resume/MyResumeInsert');
  };

  const handleResumeClick = (resumeNo) => {
    router.push(`/resume/MyResumeUpdate?resumeNo=${resumeNo}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  return (
    <>
      <div className={styles.myresumetitle}>
        내 이력서 관리
      </div>
      <div className={styles.app}>
        <div className={styles.resumeManagement}>
          <div className={styles.resumeActions} onClick={handleAcceptedKeywordClick}>
            <button>합격 키워드 분석 →</button>
          </div>
          <div className={styles.resumeList}>
            <div className={styles.resumeCard} onClick={handleNewResumeClick} style={{ cursor: 'pointer' }}>
              <div className={styles.resumeCardHeader}>
                <div className={styles.newResumeIcon}>
                  <img src="image/MyResumeInsertIcon.png" alt="MyResumeInsertIcon" />
                </div>
                <p style={{ color: 'black' }}>새 이력서 작성</p>
              </div>
            </div>
            {resumes.map((resume) => (
              <div className={styles.resumeCard} key={resume.resumeNo} onClick={() => handleResumeClick(resume.resumeNo)} style={{ cursor: 'pointer' }}>
                <div className={styles.resumeCardHeader}>{resume.title}</div>
                {resume.jobCategory && <div className={styles.resumeCardStatus}>직무 : {resume.jobCategory}</div>}
                <div className={styles.resumeCardDate}>
                  {resume.modificationDate != null ? formatDate(resume.modificationDate) : formatDate(resume.createDate)}
                </div>
                <div className={styles.resumeCardMenu} onClick={(e) => { e.stopPropagation(); handleMenuClick(resume.resumeNo) }}>⋮</div>
                {openResume === resume.resumeNo && (
                  <div className={styles.resumeCardOptions}>
                    <button onClick={(e) => { e.stopPropagation(); handleEditClick(resume.resumeNo) }}>수정하기</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteClick() }}>삭제하기</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {showModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <p>정말 삭제하시겠습니까?<br />삭제하시면 복구가 불가능합니다.</p>
              <div className={styles.modalButtons}>
                <button onClick={handleCancelDelete}>취소</button>
                <button onClick={handleConfirmDelete}>삭제</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyResume;
