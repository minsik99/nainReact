// components/Sidebar.jsx
import React from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <Link href="/manager" legacyBehavior>
        <a className="managertitle">관리자페이지</a>
      </Link>
      <ul>
        <li>
          <Link href="/manager/Dashboard" legacyBehavior>
            대시보드
          </Link>
        </li>
        <li>
          <Link href="/manager/UserManagement" legacyBehavior>
            회원관리
          </Link>
        </li>
        <li>
          <Link href="/manager/ReportList" legacyBehavior>
            신고리스트
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
