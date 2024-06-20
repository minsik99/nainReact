import React from "react";
import Sidebar from "../../components/manager/Sidebar";
import MemberGrid from "../../components/manager/MemberGrid";

const UserManagement = () => {
  return (
    <>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div style={{ width: "80%", margin: "20px" }}>
        <h1>회원관리</h1>
        <MemberGrid />
      </div>
    </>
  );
};

export default UserManagement;
