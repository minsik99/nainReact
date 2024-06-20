import React from "react";
import Sidebar from "../../components/manager/Sidebar";
import CommentReportList from "../../components/manager/CommentReportList";

const CommentReportListPage = () => {
  return (
    <>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="reportList">
        <div className="selectbutton">
          <a
            className="selectCommunityReport"
            href="/manager/CommunityReportListPage"
          >
            게시글신고
          </a>
          <a
            style={{
              borderBottom: "4px solid #9dc3c1",
            }}
            className="selectCommentReports"
            href="/manager/CommunityReportListPage"
          >
            댓글신고
          </a>
        </div>
        <CommentReportList />
      </div>
    </>
  );
};

export default CommentReportListPage;
