import axios from "./axiosApi"
import { authStore } from "../stores/authStore"

const baseUrl = "/api/auth";

export const signUp = (signUpData) => {
    return axios.post(baseUrl + "/member",signUpData).then(res =>{
        console.log(signUpData)
        return res;
    })
};


export const login = (loginData) => {
    return axios.post("/login", loginData)
        .then(response => {
            // 성공적인 응답 처리
            const token = response.headers['authorization'] || response.headers['Authorization'];
            if (token) {
                const pureToken = token.split(' ')[1];
                window.localStorage.setItem("token", pureToken);
                window.localStorage.setItem("isAdmin", response.data.isAdmin);
                window.localStorage.setItem("refresh", response.data.refresh)
                authStore.setIsAdmin(response.data.isAdmin)
                authStore.checkLoggedIn()
                
            }
            return response;
        })
};

export const logout = () =>{
    return axios.post("/logout").then(res =>{
        // 로컬 스토리지 데이터 삭제
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("isAdmin");
        window.localStorage.removeItem("refresh");
        // authStore 상태 초기화
        authStore.setIsAdmin(false);
        authStore.checkLoggedIn();
        return res;
    })
    .catch(error => {
        console.error("로그아웃 오류:", error.response ? error.response.data : error.message);
        // 에러 메시지나 상세 정보를 반환하거나 추가 처리
        throw error;
    });
};
