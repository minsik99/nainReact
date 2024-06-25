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

export const getCommunityReportCount = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/communitycount`);
    return response.data;
  } catch (error) {
    console.error("게시글 신고사유를 가져오지 못했습니다.", error);
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

export const processDeletePost = async (reportId, adminId, communityNo) => {
  try {
    const response = await axios.post(`${BASE_URL}/deletePost`, {
      reportId,
      adminId,
      communityNo,
    });
    return response.data;
  } catch (error) {
    console.error("글 삭제 처리 중 오류가 발생했습니다.", error);
    throw error;
  }
};

export const processBlockAccountCommnity = async (
  reportId,
  adminId,
  blockReason
) => {
  try {
    const response = await axios.post(`${BASE_URL}/blockAccount`, {
      reportId,
      adminId,
      blockReason,
    });
    return response.data;
  } catch (error) {
    console.error("계정 차단 처리 중 오류가 발생했습니다.", error);
    throw error;
  }
};

export const processDeleteComment = async (reportId, adminId, commentNo) => {
  const response = await axios.post(`${BASE_URL}/deleteComment`, {
    reportId,
    adminId,
    commentNo,
  });
  return response.data;
};

export const processBlockAccountComment = async (
  reportId,
  adminId,
  blockReason
) => {
  const response = await axios.post(`${BASE_URL}/blockAccount`, {
    reportId,
    adminId,
    blockReason,
  });
  return response.data;
};
