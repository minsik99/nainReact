import React, { useEffect, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import RadiusButton from "../designTool/RadiusButton";
import { useRouter } from "next/router"; // Next.js의 useRouter 훅을 불러옵니다.

const widgetClientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "dgBrpPTua28tNK0x-pjjH";

export function PaymentComponent() {
  const [paymentWidget, setPaymentWidget] = useState(null);
  const paymentMethodsWidgetRef = useRef(null);
  const [price, setPrice] = useState(10_000);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const router = useRouter(); // useRouter 훅을 사용합니다.

  useEffect(() => {
    const fetchPaymentWidget = async () => {
      try {
        const loadedWidget = await loadPaymentWidget(
          widgetClientKey,
          customerKey
        );
        setPaymentWidget(loadedWidget);
      } catch (error) {
        console.error("Error fetching payment widget:", error);
      }
    };

    fetchPaymentWidget();
  }, []);

  useEffect(() => {
    if (paymentWidget == null) {
      return;
    }

    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      "#payment-widget",
      { value: price },
      { variantKey: "DEFAULT" }
    );

    paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

    paymentMethodsWidgetRef.current = paymentMethodsWidget;
  }, [paymentWidget, price]);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    paymentMethodsWidget.updateAmount(price);
  }, [price]);

  const handleCouponChange = (event) => {
    const selectedValue = event.target.value;
    let newPrice = price;

    // 쿠폰 적용 전 가격 복원
    switch (selectedCoupon) {
      case "5000":
        newPrice += 5000;
        break;
      case "10":
        newPrice /= 0.9;
        break;
      case "30":
        newPrice /= 0.3;
        break;
      default:
        break;
    }

    // 새로운 쿠폰 적용
    switch (selectedValue) {
      case "5000":
        newPrice -= 5000;
        break;
      case "10":
        newPrice *= 0.9;
        break;
      case "30":
        newPrice *= 0.3;
        break;
      default:
        break;
    }

    setPrice(newPrice);
    setSelectedCoupon(selectedValue);
  };

  const handlePaymentRequest = async () => {
    try {
      await paymentWidget?.requestPayment({
        orderId: nanoid(),
        orderName: "NAIN 구독 서비스",
        customerName: "김민식",
        customerEmail: "customer123@gmail.com",
        customerMobilePhone: "01012341234",
        successUrl: `${window.location.origin}/payment/SuccessPage`,
        failUrl: `${window.location.origin}/payment/FailPage`,
      });
    } catch (error) {
      console.error("Error requesting payment:", error);
      router.push("payment/FailPage"); // 실패 시 실패 페이지로 이동합니다.
    }
  };

  return (
    <div>
      <div className="coupon-container">
        <label htmlFor="coupon-select"></label>
        <select
          id="coupon-select"
          className="coupon-select"
          onChange={handleCouponChange}
          value={selectedCoupon}
        >
          <option value="">쿠폰 선택</option>
          <option value="5000">5,000원 쿠폰 적용</option>
          <option value="10">10% 할인 쿠폰 적용</option>
          <option value="30">30% 할인 쿠폰 적용</option>
        </select>
      </div>
      <div id="payment-widget" />
      <div id="agreement" />
      <RadiusButton
        borderRadius={"5px"}
        padding="5px 46%"
        color="#2E9AFE"
        text="구독하기"
        fontSize="22px"
        onClick={handlePaymentRequest}
      ></RadiusButton>
    </div>
  );
}

export default PaymentComponent;
