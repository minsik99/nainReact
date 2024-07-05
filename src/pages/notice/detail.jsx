
import React, { useState, useEffect } from 'react';
import noticeAxios from "../../api/noticeAxios";
import { useRouter } from 'next/router';
import RadiusButton from '../../components/designTool/RadiusButton';
import styles from '../../styles/board/boardDetail.module.css';
import Modal from '../../components/common/Modal';
import {useModal} from '../../components/hook/useModal';

const noticeDetail = () => {
    const router = useRouter();
    const { noticeNo } = router.query;
    const [showModal, setShowModal] = useState(false);
    const [board, setBoard] = useState({
        noticeNo : noticeNo,
        noticeTitle: '',
        memberNo: '',
        noticeWriter: '',
        noticeDate: '',
        noticeModify: '',
        noticeContent: '',
        fileName: '',
        noticeMFile:'',
        noticeReadCount : '',
        noticeImportent : '',
    });
    const [noticeDate, setNoticeDate] = useState('');
    const [noticeModify, setNoticeModify] = useState('');
    const [isMine, setIsMine] = useState(false);
    const [LoginState, setLoginState] = useState(false);
    const delModal = useModal();
    

    useEffect(() => {
        if (typeof window !== "undefined") {
            const memberNo = window.localStorage.getItem("memberNo");
            if(memberNo){
                setLoginState(true);
            }
            if(board.memberNo == memberNo){
                setIsMine(true);
            }
            console.log('정보', memberNo, board.memberNo);
        }

    }, [board]);


    console.log("가져온 정보", board);

    useEffect(() => {
        // 게시글 조회
        if (noticeNo) {
        console.log("공지사항 확인", noticeNo)
        noticeAxios.getNoticeDetail(noticeNo)
            .then(res => {
                const data = res.data;
                const enroll = new Date(data.noticeDate);
                const modi = new Date(data.noticeModify);
                setNoticeDate(enroll.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }));
                setNoticeModify(modi.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }));

                setBoard({
                  noticeNo : noticeNo,
                  noticeTitle: data.noticeTitle,
                  noticeWriter: data.noticeWriter,
                  memberNo: data.memberNo,
                  noticeDate: data.noticeDate,
                  noticeModify: data.noticeModify,
                  noticeContent: data.noticeContent,
                  fileName: data.noticeFile,
                  noticeMFile: data.noticeMFile,
                    noticeReadCount: data.noticeReadCount,
                    noticeImportent: data.noticeImportent,
                });
            });
        }
    }, [noticeNo]);

    const downloadFile = () => {
        console.log("현재 글 정보 : ", board);
        noticeAxios.getFile(board.noticeMFile).then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', board.fileName); // 다운로드되는 파일의 이름 설정
            document.body.appendChild(link);
            link.click();
        });
    };

    const handleReload = () => {    
        // 공지사항 목록 페이지로 이동
        router.push('/notice');
    };

    const handleDeleteBoard = () => {
        // 글 삭제
        delModal.openModal({
            title: '게시글 삭제',
            content: '정말로 삭제하시겠습니까?', 
            columns: board.noticeNo,
            onConfirm: (noticeNo) => {
              noticeAxios.hiddenNotice(noticeNo, board).then(res => {
                  setShowModal(true); // 성공 모달 열기
                  setTimeout(() => {
                    setShowModal(false); // 모달 닫기
                    router.push('/notice'); // 페이지 이동
                  }, 500); // 2초 후에 페이지 이동
              })
              .catch(error => {
                  alert('게시글 삭제 오류');
              })
              delModal.closeModal();
            },
      //드롭다운 선택시 안에 들어있는 값가지고 옴
          });
        };
  

    const handleModifyBoard = () => {
        //글 수정
        router.push({
            pathname: '/notice/new',
            query: { primalBoard: JSON.stringify(board) }
        });
    };

    return (
        <div className={styles.base}>
            <h2>공지사항</h2>
            <div className={styles.buttons}>
            <RadiusButton color="#77AAAD" text="전체 목록" onClick={handleReload}/>
            </div>

            <div className={styles.container}>
                <div className={styles.header}>
                    <h3>{board.noticeTitle}</h3>

                    <div className={styles.info}>
                        <span>
                            <p>작성자 : {board.noticeWriter}</p>
                            <p>조회수 : {board.noticeReadCount}</p>
                            </span>
                            <span>
                        <p>작성날짜 : {noticeDate}</p>
                        {board.noticeModify && (
                            <p>수정날짜 : {noticeModify}</p>
                        )}
                        </span>
                    </div>
                        <div className={styles.content} dangerouslySetInnerHTML={{ __html: board.noticeContent }} />
                          {board.fileName && (
                        <div>첨부 파일 : <a className={styles.file} onClick={downloadFile}>{board.fileName}</a></div>
                            )}
                            {/* <label className={styles.importanceLabel}>{board.noticeImportent} </label> */}
                    </div>
                    {isMine && (
                    <div className={styles.buttons}>
                            <RadiusButton color="#77AAAD" text="삭제" onClick={handleDeleteBoard}/>
                            <Modal type='default' isOpened={delModal.isOpened} data={delModal.modalData} closeModal={delModal.closeModal}/>
                            {showModal && (
                            <div className="modal">
                            <div className="modal-content">
                                    <h5>게시글을 삭제하였습니다.</h5>
                                </div>
                            </div>
                            )}
                            <RadiusButton color="#77AAAD" text="수정" onClick={handleModifyBoard}/>
                    </div>
                        )}
            </div>
          )}
        </div>
        <div
          className={styles.noticeContent}
          dangerouslySetInnerHTML={{ __html: board.noticeContent }}
        />
      </div>
      <div className={styles.buttons}>
        <RadiusButton color="#77AAAD" text="삭제" onClick={deleteBoard} />
        <RadiusButton color="#77AAAD" text="수정" onClick={modifyBoard} />
      </div>
    </div>
  );
};
export default noticeDetail;
