import React, { useEffect, useState } from 'react';
import {signUp} from "../../api/user";
import { useRouter } from 'next/router';
import {handleAxiosError} from "../../api/errorAxiosHandle";
import KakaoSignup from "../../components/member/KakaoSignup";
import styles from "../../styles/member/memberSignup.module.css"


const SignUpForm = () => {
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        memberEmail: '',
        memberPwd: '',
        confirmPassword: '',
        memberName: '',
    });

    const [emailError, setEmailError] = useState('');
    const [emailValid, setEmailValid] = useState(null);

    const handleInputChange = (e) => {
        const { name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailCheck = async () => {
        if (!validateEmail(formData.memberEmail)) {
            setEmailError('유효한 이메일 주소를 입력해주세요.')
            setEmailValid(false);
            return;
        }

        try {
            const res = await checkEmail({ email: formData.memberEmail });
            if (res.data.isAvailable){
                setEmailError('');
                setEmailValid(true);
            }else {
                setEmailError('이미 사용 중인 이메일입니다.');
                setEmailValid(false);
            }
        }catch(error){
            handleAxiosError(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData)
        const { memberEmail, memberPwd, confirmPassword, memberName } = formData;

        if (!validateEmail(memberEmail)){
            alert('정확한 이메일 주소를 입력해주세요.');
            return;
        }

        if (memberPwd !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        const signUpData = {
            memberEmail: memberEmail,
            memberPwd: memberPwd,
            memberName: memberName,
        };

        try {
            await signUp(signUpData);
            router.push('/member/login');
        } catch (error) {
            handleAxiosError(error);
        }
    };

    return (
        <div className={styles.centerDiv}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="email">이메일:</label>
                    <input type="email" 
                            id="email" 
                            name="memberEmail" 
                            value={formData.memberEmail} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <button type="button" onClick={handleEmailCheck}>이메일 확인</button>
                        {emailError && <p className={styles.error}>{emailError}</p>}
                        {emailError && <p className={styles.success}>사용 가능한 이메일입니다.</p>}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">비밀번호:</label>
                    <input type="password" 
                            id="password" 
                            name="memberPwd" 
                            value={formData.memberPwd} 
                            onChange={handleInputChange} 
                            required 
                        />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">확인:</label>
                    <input type="password" 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            value={formData.confirmPassword} 
                            onChange={handleInputChange} 
                            required 
                        />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="name">이름:</label>
                    <input type="text" 
                            id="name" 
                            name="memberName" 
                            value={formData.memberName} 
                            onChange={handleInputChange} 
                            required 
                        />
                </div>
                <div className={styles.buttonContainer}>
                    <button type="submit">회원가입</button>
                </div>
                <KakaoSignup/>
            </form>
        </div>
    );
};

export default SignUpForm;
