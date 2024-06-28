import React, { useState, useEffect } from 'react';
import RadiusButton from '../designTool/RadiusButton';
import CommunityAxios from "../../api/CommunityAxios";
import Modal from '../../components/common/Modal';
import {useModal} from '../../components/hook/useModal';
import { reportComment } from '../../api/ReportAxios';

const CommentDetail = ({ comment, styles }) => {
    const [showInput, setShowInput] = useState(false);
    const [isParent, setIsParent] = useState(true);
    const [content, setContent] = useState('');
    const [isMine, setIsMine] = useState(false);
    const [loginState, setLoginStat] = useState(false);
    const [date, setDate] = useState('');
    const reportModal = useModal();
    const delModal = useModal();
    const [commentDetail, setCommentDetail] = useState({
        commentNo: comment.commentNo,
        memberNo: comment.memberDto.memberNo,
        communityNo: comment.communityNo,
        parentNo: comment.parentNo? comment.parentNo : null,
        writer: comment.writer,
        commentDate: comment.commentDate,
        content: comment.content,
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const memberNo = window.localStorage.getItem("memberNo");
            console.log("멤버의 memberNo", memberNo);
            if(memberNo){
                setLoginStat(true);
            }
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
                setContent(''); 
                setShowInput(false);
                window.location.reload();
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


    const handleOpenReport = () => {
        if(loginState){
            reportModal.openModal({
                title: '댓글 신고',
                content: '신고 사유',
                columns: [{'Header':'욕설 및 비방'}, {'Header':'광고'}, {'Header':'도배'}],
                onConfirm: (selectedItem) => {
                    const rComment = {
                        commentNo: comment.commentNo,
                        reportType: selectedItem['Header'],
                        handledYN: 'N',
                    };
                    console.log('Selected item:', rComment);
                    reportComment(rComment).then(res => {
                        console.log("신고 결과", res);
                        alert(res);
                    }).catch(error => {
                        console.log(error);
                    });
                    reportModal.closeModal();
                },
                });
        }else{
            alert("로그인이 필요합니다.");
        }
      };

      const handleOpenDelete = () => {
        delModal.openModal({
          title: '댓글 삭제', //제목 추가 가능
          content: '정말로 삭제하시겠습니까?', 
          columns: comment.commentNo,
          onConfirm: (commentNo) => {
            console.log(commentDetail);
            CommunityAxios.deleteComment(commentNo, commentDetail).then(res => {
                alert("댓글이 삭제되었습니다.");
                window.location.reload();
            })
            .catch(error => {
                alert('댓글 삭제 오류');
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
