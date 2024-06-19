import React, { useState, useEffect } from 'react';
import CommunityAxios from "../../api/CommunityAxios";
import { useRouter } from 'next/router';
import RadiusButton from '../../components/designTool/RadiusButton';
import styles from '../../styles/board/boardDetail.module.css';

const BoardDetail = () => {
    const router = useRouter();
    const { communityNo } = router.query;
    const [board, setBoard] = useState({
        communityNo : communityNo,
        title: '',
        writer: '',
        date: '',
        content: '',
        fileName: '',
        readCount : '',
    });
    const [comments, setComments] = useState({
        commentNo: '',
        parentNo: '',
        writer: '',
        content: '',
        date: '',
    });
    const commentList = [];

    useEffect(() => {
        // 게시글 데이터 조회
        console.log("커뮤니티no 확인", communityNo)
        CommunityAxios.getCommunityDetail(communityNo)
            .then(res => {
                const data = res.data;
                setBoard({
                    communityNo : communityNo,
                    title: data.title,
                    writer: data.writer,
                    date: data.communityDate,
                    content: data.content,
                    fileName: data.fileModified,
                    readCount: data.readCount,
                });
            })
            .catch(error => {
                console.error('Error fetching board detail:', error);
            });
    }, [communityNo]);

    useEffect(() => {
        CommunityAxios.getCommentList(communityNo)
            .then(res => {
                setComments(res.data.list);
            })
            .catch(error => {
                console.error('Error fetching comment:', error);
            });
    }, [communityNo]);

    function buildCommentTree(comments){
        const commentMap = {};
        comments.forEach(comment => {
          comment.replies = [];
          commentMap[comment.comment_no] = comment;
        });
      
        const rootComments = [];
        comments.forEach(comment => {
          if (comment.comment_parent === null) {
            rootComments.push(comment);
          } else {
            const parent = commentMap[comment.comment_parent];
            parent.replies.push(comment);
          }
        });
      
        return rootComments;
      };

      const CommentItem = ({ comment }) => {
        return (
          <div>
            <div className="comment-content">
              <p><strong>{comment.member_name}</strong> <span>{new Date(comment.comment_date).toLocaleString()}</span></p>
              <p>{comment.comment_content}</p>
            </div>
            <div className="replies">
              {comment.replies.map(reply => (
                <CommentItem key={reply.comment_no} comment={reply} />
              ))}
            </div>
          </div>
        );
      };

      const CommentList = ({ comments }) => {
        return (
          <div className="comment-list">
            {comments.map(comment => (
              <CommentItem key={comment.comment_no} comment={comment} />
            ))}
          </div>
        );
      };

    const insertComment = () =>{

    };
      
    const reload =() => {
        router.push("/community");
      };

    const handleReportClick = () => {
        alert('게시글을 신고했습니다.');
    };
    const deleteBoard = () => {
        alert('게시글을 신고했습니다.');
    };
    const modifyBoard = () => {
        alert('게시글을 신고했습니다.');
    };

    return (
        <div className={styles.base}>
            <h2>커뮤니티 게시판</h2>
            <div className={styles.buttons}>
            <RadiusButton color="#77AAAD" text="전체 목록" onClick={reload}/>
            <img src="/image/report.png" onClick={handleReportClick} />
            </div>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3>{board.title}</h3>
                    <p>작성자 : {board.writer}</p>
                    <div className={styles.info}>
                        <span>조회수 : {board.readCount}</span>
                        <p>작성날짜 : {board.date.substring(0, 10)}</p>
                    </div>
                    {board.fileName && (
                    <div className={styles.fileName}>첨부 파일 : <a className={styles.file}>{board.fileName}</a></div>
                    )}
                </div>
                <div className={styles.content} dangerouslySetInnerHTML={{ __html: board.content }} />

            </div>
            <div className={styles.buttons}>
                    <RadiusButton color="#77AAAD" text="삭제" onClick={deleteBoard}/>
                    <RadiusButton color="#77AAAD" text="수정" onClick={modifyBoard}/>
            </div>
            <h4>댓글</h4>
            <div className={styles.commentEnroll}>
                <textarea className={styles.commentBox} placeholder="댓글 입력"></textarea>
                <RadiusButton color="#77AAAD" text="댓글 등록" onClick={insertComment}></RadiusButton>
            </div>
            <div className="comment-list">
                {CommentList}
            </div>
        </div>
    );
};

export default BoardDetail;