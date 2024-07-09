// api/paymentService.js
import axios from "axios";

export const confirmPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      "http://13.209.244.239:9999/api/payment/confirm",
      paymentData
    );
    return response.data;
  } catch (error) {
    console.error("결제 확인 요청에 실패했습니다.", error);
    throw error;
  }
};

export default confirmPayment;
