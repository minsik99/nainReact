// components/Sidebar.jsx
import React from "react";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <h2>관리자페이지</h2>
      <ul>
        <li>
          <a href="/manager/Dashboard">대시보드</a>
        </li>
        <li>
          <a href="/manager/UserManagement">회원관리</a>
        </li>
        <li>
          <a href="/manager/ReporList">신고리스트</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
