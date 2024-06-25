import React, { useState, useEffect } from 'react';
import RadiusButton from '../designTool/RadiusButton';
import CommunityAxios from "../../api/CommunityAxios";
import Modal from '../../components/common/Modal';
import {useModal} from '../../components/hook/useModal';

const CommentDetail = ({ comment, styles }) => {
    const [showInput, setShowInput] = useState(false);
    const [isParent, setIsParent] = useState(true);
    const [content, setContent] = useState('');
    const [isMine, setIsMine] = useState(false);
    const [date, setDate] = useState('');
    const reportModal = useModal();
    const delModal = useModal();
    

    useEffect(() => {
        if (typeof window !== "undefined") {
            const memberNo = window.localStorage.getItem("memberNo");
            console.log("멤버의 memberNo", memberNo);
            if(comment.memberDto.memberNo = memberNo){
                setIsMine(true);
            }
        }
    }, []);

    useEffect(() => {
        if (comment.parentNo !== null) {
            setIsParent(false);
        }

        const enroll = new Date(comment.commentDate);
        setDate(enroll.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }));
    }, [comment]);

    const insertChild = () => {
        const childComment = {
            communityNo: comment.communityNo,
            parentNo: comment.commentNo,
            writer: '',
            content: content,
        };
        if (content) {
            CommunityAxios.createComment(childComment).then(res => {
                setContent(''); // 입력창 비우기
                setShowInput(false); // 입력 상자 닫기
                window.location.reload(); // 페이지 새로고침 대신 상태 업데이트 필요
            }).catch(error => {
                console.error('Error creating child comment:', error);
            });
        } else {
            alert('내용을 입력해주세요.');
        }
    };

    const handleComment = (event) => {
        setContent(event.target.value);
    };


    const handleOpenReport = (comment) => {
       reportModal.openModal({
          title: '댓글 신고', //제목 추가 가능
          content: '신고 사유', //모달안 내용(현재는 드롭다운만 구현상태)
          columns: [{'Header':'욕설 및 비방'}, {'Header':'광고'}, {'Header':'도배'}],
    //신고하기 대신 원하는 문구 삽입, 처음 들어가는 문장이 기본값
          onConfirm: (selectedItem) => {
            console.log('Selected item:', selectedItem);
            reportModal.closeModal();
          },
    //드롭다운 선택시 안에 들어있는 값가지고 옴
        });
      };

      const handleOpenDelete = () => {
        delModal.openModal({
          title: '댓글 삭제', //제목 추가 가능
          content: '정말로 삭제하시겠습니까?', 
          columns: comment.commentNo,
          onConfirm: (commentNo) => {
            console.log(comment, comment.commentNo)
            CommunityAxios.deleteComment(commentNo, comment).then(res => {
                setShowModal(true); // 성공 모달 열기
                setTimeout(() => {
                  setShowModal(false); // 모달 닫기
                  router.push('/community'); // 페이지 이동
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

    return (
        <div>
            {isParent ? (
                <div>
                    <div className={styles.commentParent}>
                        <hr />
                        <span className={styles.commentInfo}>
                            <div className={styles.commentInfo2}>
                                <p>작성자 : {comment.writer}</p>
                                <img src="/image/report.png" onClick={handleOpenReport}/>
                                <Modal type='custom'  isOpened={reportModal.isOpened} data={reportModal.modalData} closeModal={reportModal.closeModal}/>
                            </div>
                            <p>작성날짜 : {date}</p>
                        </span>
                        <span className={styles.commentInner}>
                            <div className={styles.commentContent}
                                dangerouslySetInnerHTML={{ __html: comment.content }} />
                                {isMine && (
                                <div className={styles.innerBtns} >
                                    <img src="/image/pngegg11.png" onClick={handleOpenDelete}/>
                                    <Modal type='default' isOpened={delModal.isOpened} data={delModal.modalData} closeModal={delModal.closeModal}/>
                                </div>
                                )}
                        </span>
                    </div>
                    {!showInput && (
                        <div className={styles.childCommentButton}>
                            <div></div>
                            <RadiusButton color="#77AAAD" padding="5px" text="답글" onClick={() => setShowInput(true)} />
                        </div>
                    )}
                    {showInput && (
                        <div className={styles.commentEnroll}>
                            <img className={styles.childArrow} src="/image/comment.png" alt="comment" />
                            <div className={styles.commentBoxChild}>
                            <textarea  placeholder="댓글 입력"
                                value={content} onChange={handleComment} />
                            <img className={styles.close} src="/image/pngegg11.png" onClick={() => setShowInput(false)}/>
                            </div>
                            <RadiusButton color="#77AAAD" padding="5px 20px" text="등록" onClick={insertChild} />
                        </div>
                    )}
                </div>
            ) : (
                <div className={styles.commentChild}>
                    <img className={styles.underArrow} src="/image/comment.png" alt="comment" />
                    <div className={styles.underComment}>
                        <span className={styles.commentInfo}>
                            <div className={styles.commentInfo2}>
                                <p>작성자 : {comment.writer}</p>
                                <img src="/image/report.png" onClick={handleOpenReport}/>
                                <Modal type='custom' isOpened={reportModal.isOpened} data={reportModal.modalData} closeModal={reportModal.closeModal}/>
                            </div>
                            <p>작성날짜 : {date}</p>
                        </span>
                        <span className={styles.commentInner}>
                            <div className={styles.commentContent}
                                dangerouslySetInnerHTML={{ __html: comment.content }} />
                                {isMine && (
                                <div className={styles.innerBtns} >
                                    <img src="/image/pngegg11.png" onClick={handleOpenDelete}/>
                                    <Modal type='default' isOpened={delModal.isOpened} data={delModal.modalData} closeModal={delModal.closeModal}/>
                                </div>
                                )}
                                
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentDetail;
