// utils/paymentService.js
import axios from "axios";

const BASE_URL = "http://localhost:9999/payment";

export const confirmPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${BASE_URL}/confirm`, paymentData);
    return response.data;
  } catch (error) {
    console.error("결제 확인 요청에 실패했습니다.", error);
    throw error;
  }
};
