import axios from "axios";

const BASE_URL = "http://localhost:9999/staticstical";

export const getMonthlyPayAmount = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/payamount/monthly`);
    return response.data;
  } catch (error) {
    console.error("월매출 통계를 가져오지 못했습니다.", error);
    throw error;
  }
};

export const getYearlyPayAmount = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/payamount/yearly`);
    return response.data;
  } catch (error) {
    console.error("연매출 통계를 가져오지 못했습니다.", error);
    throw error;
  }
};

export const getSubscription = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/count/subscriptionratio`);
    return response.data;
  } catch (error) {
    console.error("구독자 통계를 가져오지 못했습니다.:", error);
    throw error;
  }
};

export const getDailyNewSubscriber = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/count/newsubscribe`);
    return response.data;
  } catch (error) {
    console.error("신규구독 통계를 가져오지 못했습니다.:", error);
    throw error;
  }
};

export const getDailyNewMember = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/count/newmember`);
    return response.data;
  } catch (error) {
    console.error("신규가입 통계를 가져오지 못했습니다.:", error);
    throw error;
  }
};

export const getWithdrawalAccumulation = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/count/withdrawal`);
    return response.data;
  } catch (error) {
    console.error("탈퇴 통계를 가져오지 못했습니다.:", error);
    throw error;
  }
};
