import React, { useState, useEffect } from 'react';
import RadiusButton from '../designTool/RadiusButton';
import CommunityAxios from "../../api/CommunityAxios";

const CommentDetail = ({ comment, styles }) => {
    const [showInput, setShowInput] = useState(false);
    const [isParent, setIsParent] = useState(true);
    const [content, setContent] = useState('');
    const [isMine, setIsMine] = useState(false);

    useEffect(() => {
        if (comment.parentNo !== null) {
            setIsParent(false);
        }
        // if(comment.memberNo = )
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

    const delComment = () => {

    };

    return (
        <div>
            {isParent ? (
                <div>
                    <div className={styles.commentParent}>
                        <hr />
                        <span className={styles.commentInfo}>
                            <p>작성자 : {comment.writer}</p><p>작성날짜 : {comment.commentDate}</p>
                        </span>
                        <div className={styles.commentContent}
                            dangerouslySetInnerHTML={{ __html: comment.content }} />
                    </div>
                    {!showInput && (
                        <div className={styles.childCommentButton}>
                            <div>
                                {isMine && (
                                <RadiusButton color="#77AAAD" text="삭제" onClick={delComment} />
                                )}
                            </div>
                            <RadiusButton color="#77AAAD" text="댓글 쓰기" onClick={() => setShowInput(true)} />
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
                    <img src="/image/comment.png" alt="comment" />
                    <div className={styles.underComment}>
                        <span className={styles.commentInfo}>
                            <p>작성자 : {comment.writer}</p><p>작성날짜 : {comment.commentDate}</p>
                        </span>
                        <div className={styles.commentContent}
                            dangerouslySetInnerHTML={{ __html: comment.content }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentDetail;
