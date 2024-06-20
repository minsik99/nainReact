import React from "react";
import Sidebar from "../../components/manager/Sidebar";

const managermain = () => {
  return (
    <>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="dashboard">
        <div className="payment">
          <div className="title">
            <h3>관리자페이지 메인</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default managermain;
