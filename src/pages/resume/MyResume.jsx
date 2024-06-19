import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import instance from '../../api/axiosApi';

const MyResume = () => {
  const router = useRouter();
  const [resumes, setResumes] = useState([]);
  const [openResume, setOpenResume] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const memberNo = 1;

    instance.get(`/resume/member/${memberNo}`).then(response => {
      setResumes(response.data);
    })
    .catch(error => {
      console.error('Error fetching resumes:', error);
    });
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
  const handleConfirmDelete = () => {
    axios.all([
      axios.delete(`http://localhost:9999/experience/resume/${openResume}`),
      axios.delete(`http://localhost:9999/education/resume/${openResume}`),
      axios.delete(`http://localhost:9999/activity/resume/${openResume}`)
    ])
    .then(() => {
      return axios.delete(`http://localhost:9999/resume/${openResume}`);
    })
    .then(() => {
      setResumes(resumes.filter((resume) => resume.resumeNo !== openResume));
      setShowModal(false);
      setOpenResume(null);
    })
    .catch(error => {
      console.error('Error deleting resume or related data:', error);
      setShowModal(false);
    });
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
      <div className="app">
        <h1>내 이력서 관리</h1>
        <div className="resume-management">
          <div className="resume-actions" onClick={handleAcceptedKeywordClick}>
            <button>합격 키워드 분석 →</button>
          </div>
          <div className="resume-list">
            <div className="resume-card" onClick={handleNewResumeClick} style={{ cursor: 'pointer' }}>
              <div className="resume-card-header">
                <div className="new-resume-icon">
                  <button>+</button>
                </div>
                <p style={{ color: 'black' }}>새 이력서 작성</p>
              </div>
            </div>
            {resumes.map((resume) => (
              <div className="resume-card" key={resume.resumeNo} onClick={() => handleResumeClick(resume.resumeNo)} style={{ cursor: 'pointer' }}> {/* 이력서 상세보기 / 수정페이지 이동 */}
                <div className="resume-card-header">{resume.title}</div>
                {resume.jobCategory && <div className="resume-card-status">직무 : {resume.jobCategory}</div>}
                <div className="resume-card-date">
                  {resume.modificationDate != null ? formatDate(resume.modificationDate) : formatDate(resume.createDate)}
                </div>
                <div className="resume-card-menu" onClick={(e) => {e.stopPropagation(); handleMenuClick(resume.resumeNo)}}>⋮</div> {/* 메뉴 클릭 이벤트 전파 방지 */}
                {openResume === resume.resumeNo && (
                  <div className="resume-card-options">
                    <button onClick={(e) => {e.stopPropagation(); handleEditClick(resume.resumeNo)}}>수정하기</button> {/* 수정 버튼 클릭 이벤트 전파 방지 */}
                    <button onClick={(e) => {e.stopPropagation(); handleDeleteClick()}}>삭제하기</button> {/* 삭제 버튼 클릭 이벤트 전파 방지 */}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <p>정말 삭제하시겠습니까?<br />삭제하시면 복구가 불가능합니다.</p>
              <div className="modal-buttons">
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
