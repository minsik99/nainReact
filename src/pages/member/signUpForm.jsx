import React, { useEffect, useState } from 'react';
import {signUp} from "../../api/user";
import { useRouter } from 'next/router';
import {handleAxiosError} from "../../api/errorAxiosHandle";
import KakaoSignup from "../../components/member/KakaoSignup";
import styles from "../../styles/member/memberSignup.module.css"
import { checkEmail } from '../../api/user';


const SignUpForm = () => {
    const router = useRouter();

    const [isReadOnly, setIsReadOnly] = useState(false);
    
    const [formData, setFormData] = useState({
        memberEmail: '',
        memberPwd: '',
        confirmPassword: '',
        memberName: '',
    });

    const [emailError, setEmailError] = useState('');
    const [emailValid, setEmailValid] = useState(null);
    const [pwdChanged, setPwdChanged] = useState(null);
    const [pwdError, setPwdError] = useState('');

    const handleInputChange = (e) => {
        const { name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if(name === 'memberEmail'){
            setEmailError('');
            setEmailValid(null);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        // 비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상의 조합이어야 합니다.
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleEmailCheck = async () => {
        if(!formData.memberEmail.trim() && formData.memberEmail.trim() == ''){
            console.log("memberEmail", formData.memberEmail);
            setEmailError('이메일을 입력해주세요.');
            setEmailValid(false);
            return;
        }

        if (!validateEmail(formData.memberEmail)) {
            setEmailError('유효한 이메일 주소를 입력해주세요.')
            setEmailValid(false);
            return;
        }

        try {
            const emailChecking = await checkEmail(formData.memberEmail).then(res => {
                console.log(res);
                if (res == "Valid email"){
                    setEmailError('');
                    setEmailValid(true);
                    setIsReadOnly(true);
                }else {
                    setEmailError('이미 사용 중인 이메일입니다.');
                    setEmailValid(false);
                }
            });

        }catch(error){
            handleAxiosError(error);
        }
    }

    useEffect(() => {
        if (formData.memberPwd && formData.confirmPwd) {
            setPwdChanged(formData.memberPwd !== formData.confirmPwd);
        } else {
            setPwdChanged(null);
        }

        if (formData.memberPwd && !validatePassword(formData.memberPwd)) {
            setPwdError('비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.');
        } else {
            setPwdError('');
        }
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData)
        const { memberEmail, memberPwd, confirmPwd, memberName } = formData;

        if (!validateEmail(memberEmail)){
            alert('정확한 이메일 주소를 입력해주세요.');
            return;
        }

        if (emailValid !== true){
            alert('이메일 확인을 완료해주세요.');
            return;
        }
        
        if (!validatePassword(memberPwd)) {
            alert('비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.');
            return;
        }

        if (formData.memberPwd !== formData.confirmPwd) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        const signUpData = {
            memberEmail: memberEmail.trim(),
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
                <h1> 회원가입 </h1><hr></hr><br></br>
                
                <div className={styles.formGroup}>
                    <label htmlFor="email">이메일:</label>
                    <input type="email" 
                            id="email" 
                            name="memberEmail" 
                            value={formData.memberEmail} 
                            onChange={handleInputChange} 
                            required
                            readOnly={isReadOnly}
                        />
                        <div className={styles.checkButton}>
                        <button type="button" onClick={handleEmailCheck}>이메일 확인</button>
                        </div>
                        {emailError && <p className={styles.error}>{emailError}</p>}
                        {emailValid && <p className={styles.success}>사용 가능한 이메일입니다.</p>}
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
                    <label htmlFor="confirmPwd">비밀번호 확인:</label>
                    <input type="password" 
                            id="confirmPwd" 
                            name="confirmPwd" 
                            value={formData.confirmPwd} 
                            onChange={handleInputChange} 
                            required 
                        />
                </div>
                {pwdChanged && <p className={styles.confirmPwd}>비밀번호가 일치하지 않습니다.</p>}
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
