
import axios from "./axiosApi";
import { authStore } from "../stores/authStore";

const baseUrl = "/api/auth";

export const signUp = (signUpData) => { axios.post(baseUrl + "/member/signup",signUpData).then(res =>{
        console.log(signUpData)
        return res;
    })
};


export const login =  (loginData) => {
console.log(process.env.NEXT_PUBLIC_API_URL);
    return axios.post( "/login", loginData)
        .then(response => {
            // 성공적인 응답 처리
            const token = response.headers['authorization'] || response.headers['Authorization'];
            if (token) {
                const pureToken = token.split(' ')[1];
                window.localStorage.setItem("token", pureToken);
                window.localStorage.setItem("isAdmin", response.data.isAdmin);
                window.localStorage.setItem("refresh", response.data.refresh);
                window.localStorage.setItem("isSubscribe", response.data.isSubscribe);
                window.localStorage.setItem("memberNo", response.data.memberNo);
                authStore.setIsAdmin(response.data.isAdmin);
                authStore.setMemberNo(response.data.memberNo);  
                authStore.setIsSubscribe(response.data.isSubscribe);            
                authStore.checkLoggedIn();
                
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
        window.localStorage.removeItem("isSubscribe");
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
export const checkEmail = (memberEmail) => {
    return axios.post(baseUrl + "/member/checkemail", memberEmail ).then(res => {
        console.log(memberEmail);
        return res.data;
    }).catch(error => {
        console.error("이메일 유효성 검사 오류:", error.response ? error.response.data : error.message);
        throw error;
    });
};

// 내 정보 입장 전 로그인 페이지 (이메일 가져오기)
export const myinfoLogin = (memberNo) => {
    console.log("memberNo:", memberNo);

    return axios.post(baseUrl + "/member/myinfoLogin", null, {
        params: {memberNo},
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    }).then(res => {
        console.log("memberNo", memberNo);
        return res.data;
    }).catch(error => {
        console.error("이메일 가져오기 오류", error.res ? error.res.data : error.message);
        throw error;  
    })
};

// 내 정보 입장 전 로그인 페이지(패스워드)
 export const myinfoLoginPwd = async (memberNo, memberPwd) => {
    console.log("memberNo:", memberNo);
    console.log("memberPwd:", memberPwd);
    try {
        const res = await axios.post(`${baseUrl}/member/myinfo/${memberNo}`, {memberPwd},

            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
            }
        });
        
        return res.data;
    }catch(error){
        console.error('Error myinfoLogin:', error);
        throw error;
    }
};


// 내정보 불러오기 
export const myinfo = (memberNo) => {
    console.log("memberNo:", memberNo);

    return axios.post(baseUrl + "/myinfo/user", null, {
        params: {memberNo},
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
  
       }).then(res => {
        return res.data;
    }).catch(error => {
        console.error("회원정보 불러오기 오류", error.res ? error.res.data : error.message);
        throw error;
    });
};

// 내정보 수정하기
export const updateMyinfo = async (memberNo, updateMyinfoData) => {
    try {
        const response = await axios.put(`${baseUrl}/updateMyinfo/${memberNo}`, updateMyinfoData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error('Error updating member info:', error);
        throw error;
    }
};

//회원 탈퇴
export const deleteMember = async (memberNo) => {
    console.log("memberNo:", memberNo);

    try{
        const response = await axios.put(`${baseUrl}/deletemember/${memberNo}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    }catch(error){
        console.error("Error deleteMember:", error);
        throw error;
    }
};
