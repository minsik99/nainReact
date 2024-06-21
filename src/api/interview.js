import instance from "./axiosApi";

const BASE_URL = "/interview";

export const getInterviewList = async (page, size, memberNo) => {
  try {
    const response = await instance.get(`${BASE_URL}/list?page=${page}&size=${size}&memberNo=${memberNo}`);
    return response.data;
  } catch (error) {
    console.error("면접 리스트 가져오기 실패", error);
    throw error;
  }
};

export const getInterview = async (ivtNo) => {
  try {
    const response = await instance.get(BASE_URL + "/" + ivtNo);
    return response.data;
  } catch (error) {
    console.error("면접 가져오기 실패", error);
    throw error;
  }
};

export const deleteInterview = async (ivtNo) => {
  try {
    return instance.delete(BASE_URL + "/list/" + ivtNo);
  } catch (error) {
    console.error("면접삭제 실패", error);
    console.debug("에러 위치>>");
  }
};

export const addInterview = async (memberNo) => {
  try {
    const response = await instance.put(BASE_URL + "/" + memberNo);
    return response.data;
  } catch (error) {
    console.error("인터뷰 추가 실패", error);
    console.debug("에러 위치>>");
  }
};
