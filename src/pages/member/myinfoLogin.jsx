import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import styles from "../../styles/member/myinfoLogin.module.css";
import { myinfoLogin } from "../../api/user";
import { myinfoLoginPwd } from "../../api/user";

const MyinfoLogin = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        memberEmail: '',
        memberPwd: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [memberNo, setMemberNo] = useState('');

    useEffect(() => {
        if (typeof window !== "undefined") {
            const memberNo = window.localStorage.getItem("memberNo");
            setMemberNo(memberNo);
        }
    }, []);

    useEffect(() => {
        const fetchEmail = async () => {
            if (memberNo) {
                try {
                    setLoading(true);
                    const res = await myinfoLogin(memberNo);
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        memberEmail: res
                    }));
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchEmail();
    }, [memberNo]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            const response = await myinfoLoginPwd(memberNo, formData.memberPwd);
            console.log(formData.memberPwd);
            if (response === "Success") {
                router.push("/member/myinfo");
            } else {
                setError(response.message || "내 정보 확인 실패");
            }
        } catch (error) {
            setError('비밀번호가 일치하지 않습니다.');
        }
    };

    const handleGoBack = () => {
        router.push("/main");
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h1>내 정보 확인</h1><hr></hr>
            <br></br>
            <div className={styles.formGroup}>
                <label htmlFor="email">이메일:</label>
                <input
                    type="email"
                    id="email"
                    name="memberEmail"
                    value={formData.memberEmail}
                    readOnly
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
                <button type="submit">확인</button>
                <button type="button" onClick={handleGoBack}>메인으로 돌아가기</button>
            </div>
        </form>
    );
};

export default MyinfoLogin;
