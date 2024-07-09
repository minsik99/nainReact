import axios from "axios";

const BASE_URL = "http://13.209.244.239:9999/api/usermanager";

export const getUserList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/userlist`);
    return response.data;
  } catch (error) {
    console.error("유저 리스트를 가져오지 못했습니다.", error);
    throw error;
  }
};

export const updateSubscribeStatus = async (email) => {
  try {
    const response = await axios.put(`${BASE_URL}/updatesubscribe`, { email });
    return response.data;
  } catch (error) {
    console.error("구독처리에 실패하였습니다.", error);
    throw error;
  }
};

export const removeSubscribeStatus = async (email) => {
  try {
    const response = await axios.put(`${BASE_URL}/removesubscribe`, { email });
    return response.data;
  } catch (error) {
    console.error("구독처리에 실패하였습니다.", error);
    throw error;
  }
};
