import React, {useEffect, useState} from "react";
import { useMutation } from 'react-query';
import { useRouter } from "next/router";
import axios from "axios";

const SignupAgree = () => {
    const router = useRouter();
    const [isCheck, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isCheck);
    };

    const handleAgree = () => {
        if(isChecked) {
            router.push("/member") //약관 동의 후 회원가입 페이지로 이동
        }else {
            alert("약관에 동의해야 합니다."); 
        }
    };

    return (
        <div className="center-div">
            <h1>회원가입 약관동의 페이지</h1>
            <div className="terms-container">
                <h2>이용 약관</h2>
                <div className="terms-content">
                    <p>약관내용을 넣어줍쇼</p>
                    <p>약관 내용이 길어질 경우 스크롤을 통해 볼 수 있습니다.</p>
                    {/* 약관 내용 추가 */}
                </div>
                <div className="checkbox-container">
                    
                </div>
            </div>
        </div>
    );
};

export default SignupAgree;