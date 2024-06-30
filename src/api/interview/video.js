import axios from "axios";
import instance from "../axiosApi";

const python_url ='http://127.0.0.1:8080';

const boot_url ='/video';
//문제는 여기임 cors
export const saveOneVideo = async (formData) => {
    try {
        const response = await axios.post(python_url + "/save", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
        }
        });
        return response.data;
      } catch (error) {
        console.error("영상 저장 실패", error);
        throw error;
      }
}

export const emotionAnaly = async (itvNo) => {
  try {
    const response = await instance.get(boot_url+ "/emotions", {params: { itvNo: itvNo }});
    return response.data;
  } catch (error) {
    console.error("감정 불러오기 실패", error);
    throw error;
  }

}


export const PosEyeAnaly = async (itvNo) => {
  try {
    const response = await instance.get(boot_url+ "/posEye", {params: { itvNo: itvNo }});
    return response.data;
  } catch (error) {
    console.error("포즈/시선 분석결과 불러오기 실패", error);
    throw error;
  }

}

export const videoTotal = async (itvNo) => {
  try {
    const response = await instance.get(boot_url+ "/averageScores", {params: { itvNo: itvNo }});
    return response.data;
  } catch (error) {
    console.error("영상 분석결과 평균 불러오기 실패", error);
    throw error;
  }
}
export const totalVideo = async (itvNo) => {
  try {
    console.log(itvNo)
    const response = await instance.get(boot_url + "/totalVideo", {params: { itvNo: itvNo }});
    return response.data;
  } catch (error) {
    console.error("영상 분석결과점수 불러오기 실패", error);
    throw error;
  }
  
  

}

