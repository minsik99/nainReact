import React, { useState, useEffect } from "react";
import styles from "./ReportList.module.css";
import {
  getCommentReport,
  processDeleteComment,
  processBlockAccount,
} from "../../api/ReportAxios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const [showUnprocessedOnly, setShowUnprocessedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [reportStartDate, setReportStartDate] = useState(null);
  const [reportEndDate, setReportEndDate] = useState(null);
  const [handledStartDate, setHandledStartDate] = useState(null);
  const [handledEndDate, setHandledEndDate] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getCommentReport();
      setReports(data || []);
    } catch (error) {
      console.error("데이터를 가져오는 중 오류가 발생했습니다.", error);
    }
  };

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

  const handleProcess = async (report) => {
    try {
      const adminId = 1; // 실제 admin ID 사용
      const block = blockAccount[report.commentReportId] || false;
      const del = deletePost[report.commentReportId] || false;
      let blockSuccess = false;
      let deleteSuccess = false;

      if (block) {
        try {
          await processBlockAccount(
            report.commentReportId,
            adminId,
            "차단 사유를 여기에 입력하세요"
          );
          blockSuccess = true;
          alert("계정 차단이 성공적으로 처리되었습니다.");
        } catch (error) {
          console.error("계정 차단 중 오류가 발생했습니다.", error);
          alert("계정 차단 처리 중 오류가 발생했습니다.");
        }
      }

      if (del) {
        try {
          await processDeleteComment(
            report.commentReportId,
            adminId,
            report.commentNo // commentNo를 전달
          );
          deleteSuccess = true;
          alert("댓글 삭제가 성공적으로 처리되었습니다.");
        } catch (error) {
          console.error("댓글 삭제 중 오류가 발생했습니다.", error);
          alert("댓글 삭제 처리 중 오류가 발생했습니다.");
        }
      }

      if (!block && !del) {
        alert("처리할 작업을 선택하세요.");
      }

      console.log(
        "처리 완료:",
        report.commentReportId,
        block,
        del,
        blockSuccess,
        deleteSuccess
      );
    } catch (error) {
      console.error("처리 중 오류가 발생했습니다.", error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  const itemsPerPage = 20;
  let filteredReports = [...reports];

  if (showUnprocessedOnly) {
    filteredReports = filteredReports.filter(
      (report) => report.commentReportHandledYN !== "Y"
    );
  }

  if (searchQuery) {
    filteredReports = filteredReports.filter((report) => {
      const searchRegex = new RegExp(searchQuery, "i");
      return (
        searchRegex.test(report.communityReportMemberEmail) ||
        searchRegex.test(report.communityReportMemberName) ||
        searchRegex.test(report.communityReportAdminName)
      );
    });
  }

  if (reportStartDate || reportEndDate) {
    filteredReports = filteredReports.filter((report) => {
      const reportDate = new Date(report.communityReportDate);
      if (reportStartDate && reportEndDate) {
        return reportDate >= reportStartDate && reportDate <= reportEndDate;
      } else if (reportStartDate) {
        return reportDate >= reportStartDate;
      } else if (reportEndDate) {
        return reportDate <= reportEndDate;
      }
      return true;
    });
  }

  if (handledStartDate || handledEndDate) {
    filteredReports = filteredReports.filter((report) => {
      if (!report.communityReportHandledDate) return false;
      const handledDate = new Date(report.communityReportHandledDate);
      if (handledStartDate && handledEndDate) {
        return handledDate >= handledStartDate && handledDate <= handledEndDate;
      } else if (handledStartDate) {
        return handledDate >= handledStartDate;
      } else if (handledEndDate) {
        return handledDate <= handledEndDate;
      }
      return true;
    });
  }

  let sortedReports = [...filteredReports];

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
      <div className={styles.tableHeader}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className={styles.dateRange}>
          <DatePicker
            selected={reportStartDate}
            onChange={(date) => setReportStartDate(date)}
            placeholderText="신고 시작 날짜"
            className={styles.datePicker}
          />
          <p> ~ </p>
          <DatePicker
            selected={reportEndDate}
            onChange={(date) => setReportEndDate(date)}
            placeholderText="신고 종료 날짜"
            className={styles.datePicker}
          />
        </div>
        <div className={styles.dateRange}>
          <DatePicker
            selected={handledStartDate}
            onChange={(date) => setHandledStartDate(date)}
            placeholderText="처리 시작 날짜"
            className={styles.datePicker}
          />
          <p> ~ </p>
          <DatePicker
            selected={handledEndDate}
            onChange={(date) => setHandledEndDate(date)}
            placeholderText="처리 종료 날짜"
            className={styles.datePicker}
          />
        </div>
        <label className={styles.showUnprocessedOnly}>
          미처리 건만 보기
          <input
            type="checkbox"
            checked={showUnprocessedOnly}
            onChange={() => setShowUnprocessedOnly(!showUnprocessedOnly)}
          />
        </label>
      </div>
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
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
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
                        onClick={() => handleProcess(report)}
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
          { length: Math.ceil(filteredReports.length / itemsPerPage) },
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
