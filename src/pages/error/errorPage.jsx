import React from "react";
import { useRouter } from "next/router"; // Next.js의 useRouter 훅을 불러옵니다.
import RadiusButton from "../../components/designTool/RadiusButton";

const FailPage = () => {
  const router = useRouter(); // useRouter 훅을 사용하여 router 객체를 가져옵니다.

  const handleNavigateToPayment = () => {
    router.push("/main");
  };

  return (
    <div className="result wrapper">
      <div className="box_section">
        <img
          src="/image/caution.png"
          style={{ width: "150px", marginBottom: "60px" }}
        ></img>
        <h2>접근권한이 없습니다</h2>
        <RadiusButton
          padding="5px 20px"
          color="#9dc3c1"
          text="돌아가기"
          onClick={handleNavigateToPayment}
        ></RadiusButton>
      </div>
    </div>
  );
};

FailPage.getInitialProps = ({ query }) => {
  return { message: query.message, code: query.code };
};

export default FailPage;
