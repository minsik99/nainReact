import React from 'react';
import styles from "../../styles/member/memberSignup.module.css"

const KakaoSignup = () => {
    const handleSignup = () => {
        const clientId = process.env.NEXT_PUBLIC_API_KAKAO_CLIENT_ID; // 환경 변수에서 클라이언트 ID를 가져옵니다.
        const redirectUri = 'http://13.209.244.239:9999/api/auth/kakao/signup/callback'; // 리다이렉트 URI
        const encodedRedirectUri = encodeURIComponent(redirectUri); // 리다이렉트 URI를 인코딩합니다.

        window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodedRedirectUri}&through_account=true`;
    };

    return (
        <img className={styles.kakaoSignup} src='/image/kakaoSignup.png' onClick={handleSignup} />
    );
};

export default KakaoSignup;
