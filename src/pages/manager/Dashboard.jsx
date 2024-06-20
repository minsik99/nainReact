import React from "react";
import Sidebar from "../../components/manager/Sidebar";
import YearPayment from "../../components/manager/statistical/YearPayAmount";
import MonthPayment from "../../components/manager/statistical/MonthPayAmount";
import NewSubscribeCount from "../../components/manager/statistical/NewSubscribeCount";
import SignupCount from "../../components/manager/statistical/SignupCount";
import VisitorCount from "../../components/manager/statistical/VisitorCount";
import WithdrawalCount from "../../components/manager/statistical/WithdrawalCount";

const Dashboard = () => {
  return (
    <>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="dashboard">
        <div className="payment">
          <div className="title">
            <h3>매출통계</h3>
          </div>
        </div>
        <div className="payment">
          <div className="yearPayment"></div>
          <div style={{ width: "45%", margin: "10px" }}>
            <YearPayment />
          </div>
          <div className="monthPayment"></div>
          <div style={{ width: "45%", margin: "10px" }}>
            <MonthPayment />
          </div>
        </div>
        <div className="user">
          <div className="title">
            <h3>이용자 통계</h3>
          </div>
        </div>
        <div className="user">
          <div className="NewSubscribeCount"></div>
          <div style={{ width: "45%", margin: "10px" }}>
            <NewSubscribeCount />
          </div>
          <div className="mothlyPayment"></div>
          <div style={{ width: "45%", margin: "10px" }}>
            <VisitorCount />
          </div>
          <div className="mothlyPayment"></div>
          <div style={{ width: "45%", margin: "10px" }}>
            <SignupCount />
          </div>
          <div className="mothlyPayment"></div>
          <div style={{ width: "45%", margin: "10px" }}>
            <WithdrawalCount />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
