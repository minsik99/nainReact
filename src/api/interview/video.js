import axios from "axios";
import instance from "../axiosApi";

const python_url ='http://127.0.0.1:8080';

const boot_url ='/video';

export const saveOneVideo = async (formData) => {
    try {
        const response = await axios.post(python_url + "/save", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
        }
        });
        console.log(formData);
        return response.data;
      } catch (error) {
        console.error("영상 저장 실패", error);
        throw error;
      }
}

export const realTimeAnaly = async (frame) => {
  try {
    const response = await axios.post(python_url + "/realtimeAnalysis");
    return response.data;
  } catch (error) {
    console.error("프레임 전송 실패", error);
    throw error;
  }

}
