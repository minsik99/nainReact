import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import {authStore} from "../../stores/authStore";
import { AuthContext } from '../../api/authContext';
import styles from "../../styles/member/member.module.css";


const LoginSuccess = () => {
    const router = useRouter();
   
    useEffect(() => {
        const { access, refresh, isAdmin, memberNo } = router.query;
 

        if (access && refresh && memberNo) {
            // JWT 토큰과 사용자 정보를 로컬 스토리지에 저장합니다.
            window.localStorage.setItem("token", access);
            window.localStorage.setItem("isAdmin", isAdmin === 'true');
            window.localStorage.setItem("refresh", refresh);
            authStore.setIsAdmin(isAdmin === 'true');
            authStore.checkLoggedIn();
            authStore.setMemberNo(memberNo);
            console.log("MemberNo:", memberNo);

            // 원하는 페이지로 리다이렉트합니다.
            router.push('/');
        } else {
            console.log("쿼리 파라미터가 없습니다.");
        }
    }, [router.isReady, router.query]);

    return (
        <div>
            <p>로그인 성공! 리다이렉트 중...</p>
            
        </div>
    );
};

export default LoginSuccess;
