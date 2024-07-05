import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import RadiusButton from "../../components/designTool/RadiusButton";
import styles from "../../styles/board/boardDetail.module.css";

const NoticeDetail = () => {
  const router = useRouter();
  const { communityNo } = router.query;
  const [board, setBoard] = useState({
    noticeNo: noticeNo,
    noticeTitle: "",
    noticeWriter: "",
    noticeDate: "",
    notieceContent: "",
    noticeFileName: "",
    noticeReadCount: "",
  });

  useEffect(() => {
    // 게시글 데이터 조회
    console.log("커뮤니티no 확인", communityNo);
    CommunityAxios.getCommunityDetail(communityNo)
      .then((res) => {
        const data = res.data;
        setBoard({
          noticeNo: noticeNo,
          noticeTitle: data.noticeTitle,
          noticeWriter: data.noticeWriter,
          noticeDate: data.noticeDate,
          noticeContent: data.noticeContent,
          noticeFileName: data.noticeFileName,
          noticeReadCount: data.noticeReadCount,
        });
      })
      .catch((error) => {
        console.error("Error fetching board detail:", error);
      });
  }, [noticeNo]);

  return (
    <div className={styles.base}>
      <h2>공지사항</h2>
      <div className={styles.buttons}>
        <RadiusButton color="#77AAAD" text="전체 목록" onClick={reload} />
        <img src="/image/report.png" onClick={handleReportClick} />
      </div>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>{board.title}</h3>
          <p>작성자 : {board.noticeWriter}</p>
          <div className={styles.info}>
            <span>조회수 : {board.noticeReadCount}</span>
            <p>작성날짜 : {board.noticeDate.substring(0, 10)}</p>
          </div>
          {board.fileName && (
            <div className={styles.noticeFileName}>
              첨부 파일 : <a className={styles.file}>{board.noticeFileName}</a>
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

export default NoticeDetail;
