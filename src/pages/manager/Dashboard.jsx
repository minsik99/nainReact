import React from "react";
import Sidebar from "../../components/manager/Sidebar";
import YearPayment from "../../components/manager/statistical/YearPayAmount";
import MonthPayment from "../../components/manager/statistical/MonthPayAmount";
import SubscriptionRatio from "../../components/manager/statistical/SubscriptionRatio";
import NewMember from "../../components/manager/statistical/NewMember";
import NewSubscribe from "../../components/manager/statistical/NewSubscribe";
import WithdrawalAccumulation from "../../components/manager/statistical/WithdrawalAccumulation";

const Dashboard = () => {
  return (
    <>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="dashboard">
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
          <div className="SubscriptionRatio"></div>
          <div style={{ width: "45%", margin: "10px" }}>
            <SubscriptionRatio />
          </div>
          <div className="NewSubscribe"></div>
          <div style={{ width: "45%", margin: "10px" }}>
            <NewSubscribe />
          </div>
          <div className="NewMember"></div>
          <div style={{ width: "45%", margin: "10px" }}>
            <NewMember />
          </div>
          <div className="WithdrawalAccumulation"></div>
          <div style={{ width: "45%", margin: "10px" }}>
            <WithdrawalAccumulation />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
