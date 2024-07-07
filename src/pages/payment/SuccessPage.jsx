import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import RadiusButton from "../../components/designTool/RadiusButton";
import { confirmPayment } from "../../api/paymentService";
import refreshToken from "../../api/axiosApi";
import { authStore } from "../../stores/authStore";

export function SuccessPage() {
  const router = useRouter();
  const { orderId, amount, paymentKey } = router.query;
  const [memberNo, setMemberNo] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMemberNo = window.localStorage.getItem("memberNo");
      
      if (storedMemberNo) {
        setMemberNo(parseInt(storedMemberNo, 10));
      }

      // 현재 날짜와 한 달 뒤 날짜 계산
      const today = new Date();
      const oneMonthLater = new Date(today);
      oneMonthLater.setMonth(today.getMonth() + 1);

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      setStartDate(formatDate(today));
      setEndDate(formatDate(oneMonthLater));
    }
  }, []);

  useEffect(() => {
    if (!orderId || !amount || !paymentKey || !memberNo) return;

    const requestData = {
      orderId,
      amount,
      paymentKey,
      memberNo,
    };

    async function confirm() {
      try {
        const response = await confirmPayment(requestData);
        if (!response.success) {
          router.push(
            `/fail?message=${response.message}&code=${response.code}`
          );
        } else {
          authStore.setIsSubscribe('Y');
          window.localStorage.setItem("isSubscribe", 'Y');
        }
      } catch (error) {
        console.error("결제 확인 요청에 실패했습니다.", error);
        router.push(`/fail?message=결제 확인 요청에 실패했습니다.&code=500`);
      }
    }

    confirm();
  }, [orderId, amount, paymentKey, memberNo, router]);
  
  const handleNavigateToPayment = () => {
    router.push("/main");
  };

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2 style={{ marginTop: "23px" }}>
          축하합니다! 구독이 성공적으로 완료되었습니다.
          <br />
          <span
            style={{ display: "block", marginTop: "30px", fontSize: "20px" }}
          >
            이제 면접 준비가 더 쉬워집니다! 최고의 AI 솔루션으로 면접을
            정복하세요!
          </span>
        </h2>
        <p>{`결제 금액: ${Number(amount).toLocaleString()}원`}</p>
        <p>
          {`시작일: ${startDate}`} | {` 만료일: ${endDate}`}
        </p>
        <RadiusButton
          padding="5px 20px"
          color="#9dc3c1"
          text="돌아가기"
          onClick={handleNavigateToPayment}
        ></RadiusButton>
      </div>
    </div>
  );
}

export default SuccessPage;
