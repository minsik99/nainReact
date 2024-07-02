import React, {useEffect, useState} from "react";
import { useMutation } from 'react-query';
import { useRouter } from "next/router";
import styles from "../../styles/member/memberMyinfo.module.css";
import { myinfo } from "../../api/user";
import { updateMyinfo } from "../../api/user";
import { deleteMember } from "../../api/user";
import { logout } from "../../api/user";

const Myinfo = () => {

    const router = useRouter();
    const [memberNo, setMemberNo] = useState(null)
    const [isReadOnly, setIsReadOnly] = useState(false); //readOnly 상태 관리
    const [formData, setFormData] = useState({
        memberEmail:'',
        memberPwd: '',
        confirmPwd: '',
        memberName: '',
        memberNickName: '',
        subscribeYN: 'Y'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pwdChanged, setPwdChanged] = useState(null);

    const fetchUserMember = async (memberNo) => {
        try {
            console.log("memberNo:", memberNo);
            const res = await myinfo(memberNo);
            console.log(res);
            setFormData({
                memberEmail: res.memberEmail,
                memberName: res.memberName,
                memberNickName: res.memberNickName,
                subscribeYN: res.subscribeYN === 'Y' ? 'Y' : 'N',
                memberPwd: '',
                confirmPwd: ''
            });
            console.log(formData);
        } catch(error) {
            setError(error);
            console.error('회원 정보를 가져오는 중 오류 발생:', error);
        } finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        if (typeof window !== "undefined" && !memberNo) {
            const storedMemberNo = window.localStorage.getItem("memberNo");
            setMemberNo(storedMemberNo);

            if (storedMemberNo) {
                fetchUserMember(storedMemberNo);
            } else {
                setLoading(false);
            }
        }
    }, [memberNo]);


    useEffect(() => {
        if(formData.memberPwd !== formData.confirmPwd){
            setPwdChanged(true);
        }else{
            setPwdChanged(false);
        }
    }, [formData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'subscribeYN' ? value === 'true' : value.trim(),  //모든 입력값에서 공백 제거
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formData.memberPwd !== formData.confirmPwd){
            alert("비밀번호가 일치하지않습니다.");
            return;
        }
        formData.subscribeYN = formData.subscribeYN === 'true' ? 'Y' : 'N';
        console.log("Submitting form data:", formData); 
        updateMyinfoMutation.mutate(formData);
    };

    const updateMyinfoMutation = useMutation(
        async (updateMyinfoData) => {
            console.log("수정 데이터:", updateMyinfoData);
            return await updateMyinfo(memberNo, updateMyinfoData); //memberNo 를 포함하여 데이터를 보냄
        },
        {
            onSuccess: () => {
                alert("정보가 성공적으로 업데이트되었습니다.");
                setIsReadOnly(true); //수정이 완료되면 readOnly 상태로 설정
                router.push("/member/myinfo"); // 정보수정 후 이동할 페이지를 설정
            },
            onError: (error) => {
                console.error(error);
                alert("정보 업데이트 중 오류가 발생했습니다.");
            }
        }
    );

    const deleteMemberMutation = useMutation(
        async () => {
            console.log("회원삭제데이터:", memberNo);
            return await deleteMember(memberNo);
        },
        {
            onSuccess: () => {
                alert("회원탈퇴가 성공적으로 완료되었습니다.");
                logout();
                router.push("/main");
            },
            onError: (error) => {
                console.error(error);
                alert("회원탈퇴 중 오류가 발생했습니다.");
            }
        }
    );

    const handleDeleteAccount = () => {
        if(confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            deleteMemberMutation.mutate();
        }
    }

    const handleSubscribe = () => {
        if(confirm("구독하기 결제 페이지로 이동하시겠습니까?")){
            router.push("/payment");
        }
    }

    const goToMain = () => {
        router.push("/main");
    };

    if(loading){
        return <p>Loading...</p>;
    }

    if(error){
        return <p>회원 정보를 불러오는 중 오류가 발생했습니다.</p>;
    }

    console.log(memberNo);
    return (
        <div className={styles.centerDiv}>
            <form className={styles.form} onSubmit={handleSubmit}>
            <h1> 내 정보 보기</h1> <hr></hr>
                <div className={styles.formGroup}>
                    <label htmlFor="email">이메일:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="memberEmail" 
                        value={formData.memberEmail} 
                        readOnly={true} //항상 readOnly
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
                        readOnly={isReadOnly} //상태에 따라 변경
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
                        readOnly={isReadOnly} //상태에 따라 변경
                        />
                </div>
                {pwdChanged && <p className={styles.confirmPwd}>비밀번호가 일치하지 않습니다.</p>}
                <div className={styles.formGroup}>
                    <label htmlFor="name">이름:</label>
                    <input
                        type="text"
                        id="name"
                        name="memberName"
                        value={formData.memberName}
                        readOnly={true}
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
                        readOnly={isReadOnly} //상태에 따라 변경
                        />
                </div>

                <div className={styles.buttonContainer}>
                <button type="button" id="subscribeButton" onClick={handleSubscribe}>구독하기</button>
                    {updateMyinfoMutation.isLoading ? (
                        //수정 중일 때는 로딩 텍스트를 표시합니다.
                        <p>수정 중...</p>
                    ) : (
                        //수정 중일 때는 로딩 텍스트를 표시합니다.
                        <button type="submit" disabled={isReadOnly}>수정</button>
                    )}

                        <button type="button" id="mainButton" onClick={goToMain}>메인으로 돌아가기</button>
                        <button type="button" id="deleteButton" onClick={handleDeleteAccount} disabled={isReadOnly}>회원탈퇴</button>
                </div>
            </form>
            
        </div>
    );
};


export default Myinfo;