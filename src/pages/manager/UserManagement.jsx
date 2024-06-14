import React from "react";
import Sidebar from "../../components/manager/Sidebar";
import MemberGrid from "../../components/manager/MemberGrid";

const UserManagement = () => {
  return (
    <>
      <div className="sidebar">
        <Sidebar />
      </div>

      <div className="userManagement">
        <div className="selectbutton">
          <a
            style={{
              borderBottom: "4px solid #9dc3c1",
            }}
            className="selectUserManager"
            href="/manager/UserManagement"
          >
            회원
          </a>
          <a className="selectAdminManager" href="/manager/AdminManagement">
            관리자
          </a>
        </div>
        <div style={{ width: "93%", marginLeft: "50px" }}>
          <MemberGrid />
        </div>
      </div>
    </>
  );
};

export default UserManagement;
