import axios from "./axiosApi"
import { authStore } from "../stores/authStore"

const baseUrl = "/api/auth";

export const signUp = (signUpData) => {
    return axios.post(baseUrl + "/member/signup",signUpData).then(res =>{
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
                window.localStorage.setItem("refresh", response.data.refresh);
                window.localStorage.setItem("memberNo", response.data.memberNo);
                authStore.setIsAdmin(response.data.isAdmin);
                authStore.setMemberNo(response.data.memberNo);
               
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
        window.localStorage.removeItem("memberNo");
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

// 이메일 유효성 검사 API 호출 함수 추가
export const checkEmail = (emailData) => {
    return axios.post(baseUrl + "/check-email", emailData), then(res => {
        return res.data;
    }).catch(error => {
        console.error("이메일 유효성 검사 오류:", error.response ? error.response.data : error.message);
        throw error;
    });
};

// 내정보 불러오기 
export const myinfo = (memberNo) => {
    console.log("memberNo: ", memberNo);

    return axios.get(baseUrl + "/myinfo", {
        params: {memberNo}
    }).then(res => {
        return res.data;
    }).catch(error => {
        console.error("회원정보 불러오기 오류", error.res ? error.res.data : error.message);
        throw error;
    });
};