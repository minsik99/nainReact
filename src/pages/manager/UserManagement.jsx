import React from "react";
import Sidebar from "../../components/manager/Sidebar";
import UserGrid from "../../components/manager/UserGrid";

const UserManagement = () => {
  return (
    <>
      <div className="sidebar">
        <Sidebar />
      </div>

      <div className="userManagement">
        <div className="ManagerSelectbutton">
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
          <UserGrid />
        </div>
      </div>
    </>
  );
};

export default UserManagement;
