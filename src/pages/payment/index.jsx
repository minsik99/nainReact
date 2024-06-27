import React from "react";
import PaymentComponent from "../../components/Payment/PaymentComponent";

const Home = () => {
  return (
    <>
      <div className="full">
        <div className="subscribePage">
          <div className="logoAndText">
            <img src="/image/Logo_white.png" className="logo" alt="Logo" />
            <h2 data-text="의 모든 서비스를">의 모든 서비스를</h2>
          </div>
          <h2 data-text="제한 없이 즐기세요.">제한 없이 즐기세요</h2>
          <div className="paymentPage">
            <PaymentComponent />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
