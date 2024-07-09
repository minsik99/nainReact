import axios from 'axios';
import { authStore } from '../stores/authStore';

// Axios 인스턴스 생성
const instance = axios.create({
	baseURL: "http://13.209.244.239:9999/api/"
});

// 요청 인터셉터 추가
instance.interceptors.request.use(
  config => {
    if (config.url !== '/reissue') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// 응답 인터셉터 추가
instance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    // 응답이 없거나 상태 코드가 null인 경우 로그아웃 처리
    if (!error.response || error.response.status === null) {
      logout();
    }
    // 401 오류가 발생하고, 재시도를 한 적이 없다면
    if (authStore.isSubscribe === 'Y' || error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 토큰을 갱신하고 재시도
      const newAccessToken = await refreshToken();
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

      // 원래 요청을 다시 수행
      return instance(originalRequest);
    }  else {
      logout();
    }

    // 추가적인 에러처리
    if (error.response.status === 500) {
      console.error('Internal Server Error:', error.response.data);
      alert('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    return Promise.reject(error);
  }
);

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh');
    const response = await instance.post('/reissue', null, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    });
    const token = response.headers['authorization'] || response.headers['Authorization'];
    const pureToken = token.split(' ')[1];
    localStorage.setItem('token', pureToken);
    return pureToken;
  } catch (error) {
    if (error.response && error.response.data === 'refresh token expired') {
      logout();
    } else {
      console.error('An error occurred:', error);
    }
  }
};

const logout = async () => {
  try {
    await instance.post('/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.clear();
    window.location.href = '/member/login';
  }
};

export default instance;
