import React, { useState, useEffect } from "react";
import styles from "./ReportList.module.css";
import { getCommentReport } from "../../api/ReportAxios";

const CommentReportList = () => {
  const [reports, setReports] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "commentReportId",
    direction: "ascending",
  });
  const [blockAccount, setBlockAccount] = useState({});
  const [deletePost, setDeletePost] = useState({});

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getCommentReport();
        setReports(data || []);
      } catch (error) {
        console.error("데이터를 가져오는 중 오류가 발생했습니다.", error);
      }
    };

    fetchReports();
  }, []);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleCheckboxChange = (id, type) => {
    if (type === "block") {
      setBlockAccount((prev) => ({ ...prev, [id]: !prev[id] }));
    } else if (type === "delete") {
      setDeletePost((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const handleProcess = (id) => {
    console.log("처리:", id, blockAccount[id], deletePost[id]);
  };

  const itemsPerPage = 20;
  let sortedReports = [...reports];

  if (sortConfig.key) {
    sortedReports.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedReports = sortedReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 콘솔에 paginatedReports 출력
  console.log("paginatedReports:", paginatedReports);

  return (
    <div className={styles.reportListTableContainer}>
      <table className={styles.reportListTable}>
        <thead>
          <tr>
            <th onClick={() => handleSort("commentReportId")}>순번</th>
            <th onClick={() => handleSort("commentReportDate")}>신고날짜</th>
            <th onClick={() => handleSort("commentReportMemberEmail")}>
              신고대상이메일
            </th>
            <th onClick={() => handleSort("commentReportMemberName")}>
              신고대상이름
            </th>
            <th onClick={() => handleSort("commentReportHandledYN")}>
              처리여부
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedReports.map((report, index) => (
            <React.Fragment key={report.commentReportId}>
              <tr
                onClick={() => toggleRow(report.commentReportId)}
                className={styles.reportRow}
              >
                <td>{report.commentReportId}</td>
                <td>
                  {new Date(report.commentReportDate).toLocaleDateString()}
                </td>
                <td>{report.commentReportMemberEmail || "N/A"}</td>
                <td>{report.commentReportMemberName || "N/A"}</td>
                <td>{report.commentReportHandledYN}</td>
              </tr>
              {expandedRow === report.commentReportId && (
                <tr className={styles.expandedRow}>
                  <td colSpan="5">
                    <div className={styles.detailsContainer}>
                      <div className={styles.detailBox}>
                        <strong>내용:</strong> {report.commentContents}
                      </div>
                      <div className={styles.detailRow}>
                        <div className={styles.detailColumn}>
                          <span>
                            <strong>신고사유:</strong>{" "}
                            {report.commentReportType}
                          </span>
                        </div>
                        <div className={styles.detailColumn}>
                          <span>
                            <strong>처리날짜:</strong>
                            {report.commentReportHandledDate
                              ? new Date(
                                  report.commentReportHandledDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                          <span>
                            <strong>처리자:</strong>{" "}
                            {report.commentReportAdminName || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className={styles.checkboxContainer}>
                        <label className={styles.customCheckbox}>
                          계정차단
                          <input
                            type="checkbox"
                            checked={
                              blockAccount[report.commentReportId] || false
                            }
                            onChange={() =>
                              handleCheckboxChange(
                                report.commentReportId,
                                "block"
                              )
                            }
                          />
                        </label>
                        <label className={styles.customCheckbox}>
                          댓글삭제
                          <input
                            type="checkbox"
                            checked={
                              deletePost[report.commentReportId] || false
                            }
                            onChange={() =>
                              handleCheckboxChange(
                                report.commentReportId,
                                "delete"
                              )
                            }
                          />
                        </label>
                      </div>
                      <button
                        className={styles.processButton}
                        onClick={() => handleProcess(report.commentReportId)}
                      >
                        처리
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        {Array.from(
          { length: Math.ceil(reports.length / itemsPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={
                currentPage === i + 1 ? styles.activePage : styles.pageButton
              }
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default CommentReportList;
