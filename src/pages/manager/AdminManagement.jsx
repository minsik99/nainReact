import React from "react";
import Sidebar from "../../components/manager/Sidebar";
import AdminGrid from "../../components/manager/AdminGrid";

const AdminManagement = () => {
  return (
    <>
      <div className="sidebar">
        <Sidebar />
      </div>

      <div className="userManagement">
        <div className="ManagerSelectbutton">
          <a className="selectUserManager" href="/manager/UserManagement">
            회원
          </a>
          <a
            style={{
              borderBottom: "4px solid #9dc3c1",
            }}
            className="selectAdminManager"
            href="/manager/AdminManagement"
          >
            관리자
          </a>
        </div>
        <div style={{ width: "93%", marginLeft: "50px" }}>
          <AdminGrid />
        </div>
      </div>
    </>
  );
};

export default AdminManagement;
