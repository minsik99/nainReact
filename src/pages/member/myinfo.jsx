import React, {useEffect, useState} from "react";
import { useMutation } from 'react-query';
import { useRouter } from "next/router";
import axios from "axios";
import styles from "../../styles/member/member.module.css";
import { authStore } from "../../stores/authStore";

const myinfo = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        memberEmail:'',
        memberPwd: '',
        confirmPwd: '',
        memberName: '',
        memberNickName: '',
        subscribe: 'true'
    });

    const memberNo = authStore.memberNo;
    
    useEffect(() => {
        //서버에서 사용자 정보 가져오기
        const fetchMemberInfo = async () => {
        try {
            const res = await axios.get('/api/auth/member', {
                headers:{ 
                     Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFormData({
                memberEmail: res.data.email,
                memberName: res.data.name,
                memberNickName: res.data.nickName,
                subscribe: res.data.subscribe.toString()
            });
        } catch(error) {
            console.error('Error fetching member info:', error);
        }
    };
    fetchMemberInfo();
}, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formData.memberPwd !== formData.confirmPwd){
            alert("비밀번호가 일치하지않습니다.");
            return;
        }
        updateMyinfoMutation.mutate(formData);
    };

    const updateMyinfoMutation = useMutation(
        async(myinfoData) => {
            const res = await axios.put('/api/auth/updatemember', myinfoData,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return res.data;
        },


        {
            onSuccess: () => {
                alert("정보가 성공적으로 업데이트되었습니다.");
                router.push("/") // 정보수정 후 이동할 페이지를 설정
            },
            onError: (error) => {
                console.error(error);
                alert("정보 업데이트 중 오류가 발생했습니다.");
            }
        }
    );

    const goToMain = () => {
        router.push("/");
    };

    console.log(memberNo);
    return (
        <div className={styles.centerDiv}>
           
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="email">이메일:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="memberEmail" 
                        value={formData.memberEmail} 
                        onChange={handleInputChange} 
                        disabled 
                        />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">비밀번호:</label>
                    <input 
                        type="password"
                        id="password"
                        name="memberPwd"
                        value={formData.confirmPwd}
                        onChange={handleInputChange}
                        required
                        />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="confirmPwd">비밀번호 확인:</label>
                    <input
                        type="password"
                        id="confirmPwd"
                        name="confirmPwd"
                        value={formData.confirmPwd}
                        onChange={handleInputChange}
                        required
                        />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="name">이름:</label>
                    <input
                        type="text"
                        id="name"
                        name="memberName"
                        value={formData.memberName}
                        onChange={handleInputChange}
                        disabled
                        />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="nickName">닉네임:</label>
                    <input
                        type="text"
                        id="nickname"
                        name="memberNickName"
                        value={formData.memberNickName}
                        onChange={handleInputChange}
                        required
                        />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="subscribe">구독 여부:</label>
                    <select
                        id="subscribe"
                        name="subscribe"
                        value={formData.subscribe}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="true">구독</option>
                        <option value="false">구독 취소</option>
                    </select>
                </div>
                <div className={styles.buttonContainer}>
                    {updateMyinfoMutation.isLoading ? (
                        //수정 중일 때는 로딩 텍스트를 표시합니다.
                        <p>수정 중...</p>
                    ) : (
                        //수정 중일 때는 로딩 텍스트를 표시합니다.
                        <button type="submit">수정</button>
                    )}
                        <button id="mainButton" onClick={goToMain}>메인으로 돌아가기</button>
                </div>
            </form>
        </div>
    );
};


export default myinfo;