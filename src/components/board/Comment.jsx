import React, { useState, useEffect } from 'react';
import CommunityAxios from "../../api/CommunityAxios";
import RadiusButton from '../designTool/RadiusButton';

const Comment = ({communityNo, styles}) => {
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [content, setContent] = useState('');



    useEffect(() => {
        CommunityAxios.getCommentList(communityNo)
            .then(res => {
                setComments(res.data);
                console.log(comments);
            })
            .catch(error => {
                console.error('Error fetching comment:', error);
            });
    }, [communityNo]);

    const CommentList = comments.map(comment => {
      if(comment.parentNo === null){
        return(
          <div className={styles.commentParent}>
            <span className={styles.commentInfo}>
            <p>작성자 : {comment.writer}</p><p>작성날짜 : {comment.commentDate}</p>
            </span>
            <div className={styles.commentContent} 
            dangerouslySetInnerHTML={{ __html: comment.content }} />
          </div>
        )
      }else{
        return(
        <div className={styles.commentChild}>
          <img src="/image/comment.png"></img>
          <div className={styles.underComment}>
            <span className={styles.commentInfo}>
              <p>작성자 : {comment.writer}</p><p>작성날짜 : {comment.commentDate}</p>
            </span>
              <div className={styles.commentContent} 
              dangerouslySetInnerHTML={{ __html: comment.content }} />
          </div>
        </div>
        )
      };
    });

      const insertComment = () =>{
        const newComment = {
          communityNo: communityNo,
          writer: '',
          content: content,
        }
        try {
        if(content){
          CommunityAxios.createComment(newComment).then(res => {
              window.location.reload();
          }).catch(
            alert('댓글 등록에 실패했습니다.')
        )}else{
            alert('내용을 입력해주세요.');
        }
        }catch(error){
          console.error("댓글 등록 실패")
        };
      };

    return (
    <div>
        <div className={styles.commentEnroll}>
          <textarea className={styles.commentBox} placeholder="댓글 입력" onChange={setContent}></textarea>
          <RadiusButton color="#77AAAD" text="댓글 등록" onClick={insertComment}></RadiusButton>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h5>댓글을 등록하였습니다.</h5>
                    </div>
                </div>
            )}
        </div>
        <div>
            {CommentList}
        </div>      
    </div>
    );
};
export default Comment;