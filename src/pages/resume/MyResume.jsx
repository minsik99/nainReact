import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import instance from '../../api/axiosApi';
import styles from '../../styles/resume/MyResume.module.css';

const MyResume = () => {
  const router = useRouter();
  const [resumes, setResumes] = useState([]); // 이력서 목록 상태
  const [openResume, setOpenResume] = useState(null); // 현재 열려 있는 이력서 상태
  const [showModal, setShowModal] = useState(false); // 삭제 확인 모달 상태

  // 이력서 목록 조회
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await instance.get('/resume/member'); // 이력서 목록 API 호출

        setResumes(response.data); // 이력서 목록 상태 업데이트
      } catch (error) {
        console.error('Error fetching resumes:', error);
      }
    };

    fetchResumes(); // 컴포넌트 마운트 시 이력서 목록 불러오기
  }, []);

  // 이력서 메뉴 클릭 시 열기/닫기
  const handleMenuClick = (resumeNo) => {
    setOpenResume(prevOpenResume => prevOpenResume === resumeNo ? null : resumeNo); 
  };

  // 이력서 수정 페이지로 이동
  const handleEditClick = (resumeNo) => {
    router.push(`/resume/MyResumeUpdate?resumeNo=${resumeNo}`); 
  };

  // 삭제 확인 모달 열기
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

      setResumes(resumes.filter((resume) => resume.resumeNo !== openResume)); // 삭제된 이력서 목록에서 제거
      setShowModal(false); // 삭제 확인 모달 닫기
      setOpenResume(null); // 현재 열려 있는 이력서 초기화
    } catch (error) {
      console.error('Error deleting resume or related data:', error);
      setShowModal(false); // 오류 발생 시 삭제 확인 모달 닫기
    }
  };

  // 삭제 취소 시 모달 닫기
  const handleCancelDelete = () => {
    setShowModal(false); 
  };

  // 직무 분석 페이지로 이동
  const handleAcceptedKeywordClick = () => {
    router.push('/resume/AcceptedKeyword'); 
  };

  // 새 이력서 작성 페이지로 이동
  const handleNewResumeClick = () => {
    router.push('/resume/MyResumeInsert'); 
  };

  // 이력서 수정 페이지로 이동
  const handleResumeClick = (resumeNo) => {
    router.push(`/resume/MyResumeUpdate?resumeNo=${resumeNo}`); 
  };

  // 날짜 형식 변환
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
            <button>직무 분석 →</button>
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
