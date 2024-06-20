import axios from "axios";

const BASE_URL = "http://localhost:9999/adminmanager";

export const getAdminList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/adminlist`);
    return response.data;
  } catch (error) {
    console.error("관리자 리스트를 가져오지 못했습니다.", error);
    throw error;
  }
};

export const updateAdminStatus = async (email) => {
  try {
    const response = await axios.put(`${BASE_URL}/updateadmin`, { email });
    return response.data;
  } catch (error) {
    console.error("관리자를 추가하지 못했습니다.", error);
    throw error;
  }
};

export const removeAdminStatus = async (admin) => {
  try {
    const response = await axios.put(`${BASE_URL}/removeadmin`, admin);
    return response.data;
  } catch (error) {
    console.error("관리자 삭제하지 못했습니다.", error);
    throw error;
  }
};
