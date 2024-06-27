import React from "react";
import Sidebar from "../../components/manager/Sidebar";
import CommunityReportList from "../../components/manager/CommunityReportList";

const CommunityReportListPage = () => {
  return (
    <>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="reportList">
        <div className="reportSelectbutton">
          <a
            style={{
              borderBottom: "4px solid #9dc3c1",
            }}
            className="selectCommunityReport"
            href="/manager/CommunityReportListPage"
          >
            게시글신고
          </a>
          <a
            className="selectCommentReports"
            href="/manager/CommentReportListPage"
          >
            댓글신고
          </a>
        </div>
        <CommunityReportList />
      </div>
    </>
  );
};

export default CommunityReportListPage;
