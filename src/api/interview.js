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

export const getInterview = async (itvNo) => {
  try {
    const response = await instance.get(BASE_URL + "/" + itvNo);
    return response.data;
  } catch (error) {
    console.error("면접 가져오기 실패", error);
    throw error;
  }
};

export const deleteInterview = async (itvNo) => {
  try {
    return instance.delete(BASE_URL + "/list/" + itvNo);
  } catch (error) {
    console.error("면접삭제 실패", error);
    console.debug("에러 위치>>");
  }
};

export const addInterview = async (memberNo) => {
  try {
    const response = await instance.post(BASE_URL + "/" + memberNo);
    return response.data;
  } catch (error) {
    console.error("인터뷰 추가 실패", error);
    console.debug("에러 위치>>");
  }
};
