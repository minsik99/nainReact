import instance from "../axiosApi";

const BASE_URL = "/interview/voice";

export const getRecord = async (itvNo) => {
  try {
    const response = await instance.get(`${BASE_URL}/questions/${itvNo}`);
    return response.data;
  } catch (error) {
    console.error("질문 목록 출력 실패", error);
  }
};


