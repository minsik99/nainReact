import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import RadiusButton from "../../components/designTool/RadiusButton";

const FailPage = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (router.query.message) {
      setMessage(router.query.message);
    }
    if (router.query.code) {
      setCode(router.query.code);
    }
  }, [router.query]);

  const handleNavigateToPayment = () => {
    router.push("/payment");
  };

  return (
    <div className="result wrapper">
      <div className="box_section">
        <img
          src="/image/caution.png"
          style={{ width: "150px", marginBottom: "60px" }}
        ></img>
        <h2>결제를 실패했어요</h2>
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

export default FailPage;
