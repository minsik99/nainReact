import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { login } from '../../api/user';
import { handleAxiosError } from '../../api/errorAxiosHandle';
import { useRouter } from 'next/router';
import KakaoLogin from '../member/KakaoLogin';
import { authStore } from '../../stores/authStore';
import { observer } from "mobx-react";

const LoginForm = observer (({styles}) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        memberEmail: '',
        memberPwd: '',
    });
   
    const [error, setError] = useState('');

    const loginMutation = useMutation(loginData => login(loginData), {
        onSuccess: (data) => {
            // 로그인 성공 후의 동작을 정의합니다.
            console.log('로그인 성공', data);
            // router.push('/'); // 예를 들어, 사용자를 홈 페이지로 리다이렉션합니다.
            window.location.href = '/';
        },
        onError: (error) => {
            // 에러 핸들러를 호출하여 사용자에게 에러를 알립니다.
            handleAxiosError(error);
        },
    });
    
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setError(''); //입력값 변경 시 에러 메시지 초기화
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("로그인 버튼 클릭됨");
        if(!formData.memberEmail){
            setError('아이디를 입력하세요.');
            return;
        }

        if(!formData.memberPwd){
            setError('비밀번호를 입력하세요.');
            return;
        }

        console.log("로그인 요청 중");
        loginMutation.mutate(formData); // mutate 함수로 로그인 요청을 보냅니다.
    };

    const handleSignupClick = () => {
        router.push('/member/terms');
    }

    return (
    

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="email">이메일:</label>
                    <input
                        type="email"
                        id="email"
                        name="memberEmail"
                        value={formData.memberEmail}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">비밀번호:</label>
                    <input
                        type="password"
                        id="password"
                        name="memberPwd"
                        value={formData.memberPwd}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <div className={styles.buttonContainer}>
                    {loginMutation.isLoading ? (
                        // 로그인 중일 때는 로딩 텍스트를 표시합니다.
                        <p>로그인 중...</p>
                    ) : (
                        // 로그인 중이 아닐 때는 로그인 버튼을 표시합니다.
                        <button type="submit">로그인</button>
                    )}
                   
                </div>
                <KakaoLogin />
                <div className={styles.signupContainer}>
                    <button type='button' onClick={handleSignupClick}>회원가입</button>
                </div>
            </form>
       
    );
});

export default LoginForm;
