import React, { useState } from 'react';
import { useRouter } from 'next/router';

const MyResume = () => {
  const router = useRouter();
  const [resumes, setResumes] = useState([
    { id: 1, title: '이력서 7: 풀스택 개발자', date: '2024.05.05', status: '작성 중' },
    { id: 2, title: '이력서 6: AI 프롬프트', date: '2024.05.05', status: '작성 중' },
    { id: 3, title: '이력서 5: 클라우드', date: '2024.05.05', status: '작성 중' },
    { id: 4, title: '이력서 4: AI 엔지니어', date: '2024.05.05', status: '작성 중' },
    { id: 5, title: '이력서 3: 데이터 엔지니어', date: '2024.05.05', status: '작성 중' },
    { id: 6, title: '이력서 1: 백엔드', date: '2024.05.05', status: '작성 중' },
    { id: 7, title: '이력서 2: 프론트엔드', date: '2024.05.05', status: '작성 중' },
  ]);
  const [openResume, setOpenResume] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleMenuClick = (resumeId) => {
    setOpenResume(prevOpenResume => prevOpenResume === resumeId ? null : resumeId);
  };

  const handleEditClick = () => {
    // 여기에서 수정 페이지로 이동하는 로직을 구현합니다.
    console.log('수정하기 페이지로 이동');
  };

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    setResumes(resumes.filter((resume) => resume.id !== openResume));
    setShowModal(false);
    setOpenResume(null);
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

  return (
    <>
      <div className="app">
        <h1>내 이력서 관리</h1>
        <div className="resume-management">
          <div className="resume-actions" onClick={handleAcceptedKeywordClick}>
            <button>합격 키워드 분석 →</button>
          </div>
          <div className="resume-list">
            <div className="resume-card" onClick={handleNewResumeClick}>
              <div className="resume-card-header">
                <div className="new-resume-icon">
                  <button>+</button>
                </div>
                <p style={{ color: 'black' }}>새 이력서 작성</p>
              </div>
            </div>
            {resumes.map((resume) => (
              <div className="resume-card" key={resume.id}>
                <div className="resume-card-header">{resume.title}</div>
                {resume.date && <div className="resume-card-date">{resume.date}</div>}
                {resume.status && <div className="resume-card-status">{resume.status}</div>}
                <div className="resume-card-menu" onClick={() => handleMenuClick(resume.id)}>⋮</div>
                {openResume === resume.id && (
                  <div className="resume-card-options">
                    <button onClick={handleEditClick}>수정하기</button>
                    <button onClick={handleDeleteClick}>삭제하기</button>
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



// const MyResume = () => {
//     const [myResumeOne, setMyResumeone] = useState(['이력서1', '이력서2', '이력서7', '이력서3']);
//     const [writeStatus, setWriteStatus] = useState(['']);
//     const [modalResumeDetail, setModalResumeDetail] = useState(false);
//     const [selectTarget, setSelectTarget] = useState("")

//     //메모리 관리
//     const handleMyresumeone = useCallback((value)=>{
//         setMyResumeone(value)
//     },[myResumeOne])

//     const handleSelectTarget = useCallback((value)=>{
//         setSelectTarget(value)
//     },[])

//     return (
//         <>
//             <div className="myresumehead">
//                 <h1>내 이력서 관리</h1>
//                 <h3> 작성 내역 </h3>

//                 <button onClick={() => {
//                     let copy = [...myResumeOne];
//                     copy.sort();
//                     handleMyresumeone(copy)
//                 }}> 정렬버튼 </button>
//             </div>

//             {
//                 myResumeOne.map(function (a, i) {
//                     return (
//                         <div className="myresumebody" key={i}>
//                             <h4>{a}</h4>

//                             <button onClick={() => {
//                                 let copy = [...writeStatus];
//                                 copy[i] = copy[i] === '작성중' ? '작성완료' : '작성중';
//                                 setWriteStatus(copy);
//                             }}>작성상태변경</button>
//                             {writeStatus[i]}
//                             <p />

//                             <button id={i} onClick={(e) => {
//                                 handleSelectTarget(i)
//                                 if(e.target.id == i)
//                                 setModalResumeDetail(!modalResumeDetail);
//                             }}>
//                                 이력서상세보기버튼
//                             </button>
//                             {
//                                 selectTarget === i &&
//                                 modalResumeDetail === true ? <Myresumedetail myResumeOne={myResumeOne} selectTarget={selectTarget}/> : null
//                             }
//                         </div>
//                     )
//                 })
//             }
//         </>
//     );
// };

// //Component, 모달창
// function Myresumedetail(props) {
//     return (
//         <div className="modalmyresumedetail">
//             <h4>{props.myResumeOne[props.selectTarget]}_제목</h4>
//             <p>경력내용</p>
//             <p>학력내용</p>
//             <p>활동내용</p>
//             <p>스킬내용</p>
//         </div>
//     )
// }