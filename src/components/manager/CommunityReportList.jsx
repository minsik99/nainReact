import React, { useState, useEffect } from "react";
import styles from "./ReportList.module.css";
import { getCommunityReport } from "../../api/ReportAxios";

const CommunityReportList = () => {
  const [reports, setReports] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "communityReportId",
    direction: "ascending",
  });
  const [blockAccount, setBlockAccount] = useState({});
  const [deletePost, setDeletePost] = useState({});

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getCommunityReport();
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

  return (
    <div className={styles.reportListTableContainer}>
      <table className={styles.reportListTable}>
        <thead>
          <tr>
            <th onClick={() => handleSort("communityReportId")}>순번</th>
            <th onClick={() => handleSort("communityReportDate")}>신고날짜</th>
            <th onClick={() => handleSort("communityReportMemberEmail")}>
              신고대상이메일
            </th>
            <th onClick={() => handleSort("communityReportMemberName")}>
              신고대상이름
            </th>
            <th onClick={() => handleSort("communityReportHandledYN")}>
              처리여부
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedReports.map((report, index) => (
            <React.Fragment key={report.communityReportId}>
              <tr
                onClick={() => toggleRow(report.communityReportId)}
                className={styles.reportRow}
              >
                <td>{report.communityReportId}</td>
                <td>
                  {new Date(report.communityReportDate).toLocaleDateString()}
                </td>
                <td>{report.communityReportMemberEmail}</td>
                <td>{report.communityReportMemberName}</td>
                <td>{report.communityReportHandledYN}</td>
              </tr>
              {expandedRow === report.communityReportId && (
                <tr className={styles.expandedRow}>
                  <td colSpan="5">
                    <div className={styles.detailsContainer}>
                      <div className={styles.detailBox}>
                        <strong>제목:</strong> {report.communityTitle}
                        <br />
                        <strong>내용:</strong> {report.communityContents}
                      </div>
                      <div className={styles.detailRow}>
                        <div className={styles.detailColumn}>
                          <span>
                            <strong>신고사유:</strong>{" "}
                            {report.communityReportType}
                          </span>
                        </div>
                        <div className={styles.detailColumn}>
                          <span>
                            <strong>처리날짜:</strong>
                            {report.communityReportHandledDate
                              ? new Date(
                                  report.communityReportHandledDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                          <span>
                            <strong>처리자:</strong>{" "}
                            {report.communityReportAdminName}
                          </span>
                        </div>
                      </div>
                      <div className={styles.checkboxContainer}>
                        <label className={styles.customCheckbox}>
                          계정차단
                          <input
                            type="checkbox"
                            checked={
                              blockAccount[report.communityReportId] || false
                            }
                            onChange={() =>
                              handleCheckboxChange(
                                report.communityReportId,
                                "block"
                              )
                            }
                          />
                        </label>
                        <label className={styles.customCheckbox}>
                          글삭제
                          <input
                            type="checkbox"
                            checked={
                              deletePost[report.communityReportId] || false
                            }
                            onChange={() =>
                              handleCheckboxChange(
                                report.communityReportId,
                                "delete"
                              )
                            }
                          />
                        </label>
                      </div>
                      <button
                        className={styles.processButton}
                        onClick={() => handleProcess(report.communityReportId)}
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

export default CommunityReportList;
