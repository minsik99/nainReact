import React, { useEffect, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import RadiusButton from "../designTool/RadiusButton";
import { useRouter } from "next/router";

const widgetClientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY;
const customerKey = "your_customer_key_here"; // 고객 키

export function PaymentComponent() {
  const [paymentWidget, setPaymentWidget] = useState(null);
  const paymentMethodsWidgetRef = useRef(null);
  const [price, setPrice] = useState(10_000);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const router = useRouter();

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

    switch (selectedCoupon) {
      case "5000":
        newPrice += 5000;
        break;
      case "10":
        newPrice /= 0.9;
        break;
      case "30":
        newPrice /= 0.7;
        break;
      default:
        break;
    }

    switch (selectedValue) {
      case "5000":
        newPrice -= 5000;
        break;
      case "10":
        newPrice *= 0.9;
        break;
      case "30":
        newPrice *= 0.7;
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
        successUrl: process.env.NEXT_PUBLIC_TOSS_SUCCESS,
        failUrl: process.env.NEXT_PUBLIC_TOSS_FAIL,
      });
    } catch (error) {
      console.error("Error requesting payment:", error);
      router.push("/payment/FailPage");
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
