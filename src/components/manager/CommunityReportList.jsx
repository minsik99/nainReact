import React, { useState, useEffect } from "react";
import styles from "./ReportList.module.css";
import {
  getCommunityReport,
  getCommunityReportCount,
  processDeletePost,
  processBlockAccountCommnity,
} from "../../api/ReportAxios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "../designTool/modal";

const CommunityReportList = () => {
  const [reports, setReports] = useState([]);
  const [reportCounts, setReportCounts] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "communityReportId",
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [memberNo, setMemberNo] = useState(0);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchReports();
    fetchReportCounts();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const memberNo = window.localStorage.getItem("memberNo");
      setMemberNo(memberNo);
    }
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getCommunityReport();
      setReports(data || []);
    } catch (error) {
      console.error("데이터를 가져오는 중 오류가 발생했습니다.", error);
    }
  };

  const fetchReportCounts = async () => {
    try {
      const data = await getCommunityReportCount();
      setReportCounts(data || []);
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
      const adminId = memberNo; // 실제 admin ID 사용
      console.log(`Processing report with adminId: ${adminId}`); // 확인용 콘솔 로그
      const block = blockAccount[report.communityReportId] || false;
      const del = deletePost[report.communityReportId] || false;
      if (block) {
        try {
          await processBlockAccountCommnity(
            report.communityReportId,
            adminId,
            report.communityReportType
          );
          openModal("성공적으로 처리되었습니다.");
        } catch (error) {
          console.error("계정 차단 중 오류가 발생했습니다.", error);
          openModal("계정 차단 처리 중 오류가 발생했습니다.");
        }
      }

      if (del) {
        try {
          await processDeletePost(
            report.communityReportId,
            adminId,
            report.communityNo
          );
          openModal("성공적으로 처리되었습니다.");
        } catch (error) {
          console.error("글 삭제 중 오류가 발생했습니다.", error);
          openModal("글 삭제 처리 중 오류가 발생했습니다.");
        }
      }

      // 글 삭제나 계정 차단을 하지 않더라도 처리 상태 업데이트
      if (!block && !del) {
        await processBlockAccountCommnity(
          report.communityReportId,
          adminId,
          "처리 사유를 여기에 입력하세요"
        );
      }

      // 데이터 갱신
      await fetchReports();
      await fetchReportCounts();
    } catch (error) {
      console.error("처리 중 오류가 발생했습니다.", error);
      openModal("처리 중 오류가 발생했습니다.");
    }
  };

  const itemsPerPage = 20;
  let filteredReports = [...reports];

  if (showUnprocessedOnly) {
    filteredReports = filteredReports.filter(
      (report) => report.communityReportHandledYN !== "Y"
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
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
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
                        <div className={styles.reportCounts}>
                          <strong>신고 사유:</strong>
                          <ul>
                            {reportCounts
                              .filter(
                                (count) =>
                                  count.communityNo === report.communityNo
                              )
                              .map((count, index) => (
                                <li key={index}>
                                  {count.reportType} : {count.reportCount}건
                                </li>
                              ))}
                          </ul>
                        </div>
                        <div className={styles.detailColumn}>
                          <span>
                            <strong>처리날짜:</strong>
                            {report.communityReportHandledDate
                              ? new Date(
                                  report.communityReportHandledDate
                                ).toLocaleDateString()
                              : "미처리"}
                          </span>
                          <span>
                            <strong>처리자:</strong>{" "}
                            {report.communityReportAdminName
                              ? report.communityReportAdminName
                              : (console.log("처리자 값 없음", report),
                                "미처리")}
                          </span>
                        </div>
                      </div>

                      {report.communityReportHandledYN !== "Y" && (
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
                      )}
                      {report.communityReportHandledYN === "Y" ? (
                        <p className={styles.processedText}>
                          이미 처리되었습니다.
                        </p>
                      ) : (
                        <button
                          className={styles.processButton}
                          onClick={() => handleProcess(report)}
                        >
                          처리
                        </button>
                      )}
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
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        content={<p>{modalContent}</p>}
        buttonLabel="닫기"
        buttonColor="#77aaad"
        buttonSize="16px"
        modalSize={{ width: "350px", height: "150px" }}
      />
    </div>
  );
};

export default CommunityReportList;
