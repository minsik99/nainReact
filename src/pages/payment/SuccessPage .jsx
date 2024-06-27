import { useEffect } from "react";
import { useRouter } from "next/router";

export function SuccessPage() {
  const router = useRouter();
  const { orderId, amount, paymentKey } = router.query;

  useEffect(() => {
    const requestData = {
      orderId,
      amount,
      paymentKey,
    };

    async function confirm() {
      const response = await fetch("/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        router.push(`/fail?message=${json.message}&code=${json.code}`);
        return;
      }
    }

    if (orderId && amount && paymentKey) {
      confirm();
    }
  }, [orderId, amount, paymentKey, router]);

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2>결제 성공</h2>
        <p>{`주문번호: ${orderId}`}</p>
        <p>{`결제 금액: ${Number(amount).toLocaleString()}원`}</p>
        <p>{`paymentKey: ${paymentKey}`}</p>
      </div>
    </div>
  );
}
export default SuccessPage;
