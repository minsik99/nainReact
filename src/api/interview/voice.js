import instance from "../axiosApi";

const BASE_URL = "/interview/voice";

export const getQrecord = async (itvNo) => {
  try {
    const response = await instance.get(`${BASE_URL}/questions/${itvNo}`);
    return response.data;
  } catch (error) {
    console.error("질문 목록 출력 실패", error);
  }
};

export const getArecord = async (voiceNo) => {
  try {
    const response = await instance.get(`${BASE_URL}/answers/${voiceNo}`);
    return response.data;
  } catch (error) {
    console.error("답변 출력 실패", error);
  }
};


