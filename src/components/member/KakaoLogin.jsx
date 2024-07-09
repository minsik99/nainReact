import React from 'react';
import styles from '../../styles/member/memberLogin.module.css';

const KakaoLogin = () => {
    const handleLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_API_KAKAO_CLIENT_ID; // 환경 변수에서 클라이언트 ID를 가져옵니다.
        const redirectUri = 'http://13.209.244.239:9999/api/auth/kakao/callback'; // 리다이렉트 URI
        const encodedRedirectUri = encodeURIComponent(redirectUri); // 리다이렉트 URI를 인코딩합니다.

        window.location.href = 
        `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodedRedirectUri}&through_account=true`;
    };

    const handleLogout = () => {
        if(typeof Kakao !== 'undefined' && Kakao.Auth){
            Kakao.Auth.logout(function() {
                console.log('Logged out from Kakao')
            });
        }
    }

    return (
            
                <img className={styles.kakaoLogin} src='/image/kakaoLogin.png' onClick={handleLogin} />
 
    );
};

export default KakaoLogin;