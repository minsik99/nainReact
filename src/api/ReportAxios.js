import axios from "axios";

const BASE_URL = "http://localhost:9999/report";

export const getCommunityReport = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/community`);
    return response.data;
  } catch (error) {
    console.error("게시글 신고목록을 가져오지 못했습니다.", error);
    throw error;
  }
};

export const getCommentReport = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/comment`);
    return response.data;
  } catch (error) {
    console.error("댓글 신고목록을 가져오지 못했습니다.", error);
    throw error;
  }
};
