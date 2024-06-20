import React, { useState } from 'react';
import {signUp} from "../../api/user";
import {useRouter} from "next/dist/client/router"
import {handleAxiosError} from "../../api/errorAxiosHandle";
import KakaoSignup from "./KakaoSignup";

const SignUpForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        memberEmail: '',
        memberPwd: '',
        confirmPassword: '',
        memberName: '',
        termsAgreed: false, // 약관 동의 추가
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        const { memberEmail, memberPwd, confirmPassword, memberName } = formData;
        if (memberPwd !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        const signUpData = {
            memberEmail: memberEmail,
            memberPwd: memberPwd,
            memberName: memberName,
        }
        console.log(signUpData)
        signUp(signUpData).then(res =>{
            console.log(formData.memberEmail)
            router.push("/member/login")
        }).catch(handleAxiosError)
    };

    return (
        <div className="center-div">
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">이메일:</label>
                    <input type="email" id="email" name="memberEmail" value={formData.memberEmail} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">비밀번호:</label>
                    <input type="password" id="password" name="memberPwd" value={formData.memberPwd} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">확인:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="name">이름:</label>
                    <input type="text" id="name" name="memberName" value={formData.memberName} onChange={handleInputChange} required />
                </div>
                <div className="button-container">
                    <button type="submit">회원가입</button>
                </div>
                <KakaoSignup/>
            </form>
        </div>
    );
};

export default SignUpForm;
