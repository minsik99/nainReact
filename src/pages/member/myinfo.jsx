import React, {useState} from "react";
import { observer } from "mobx-react";
import { mutation, useMutation } from 'react-query';
import { useRouter } from "next/router";
import axios from "axios";

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
            const res = await axios.put('/api/myinfo', myinfoData);
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

    return (
        <div className="center-div">
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="button-container">
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
            <style jsx>{`
                .button-container {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }
                #mainButton {
                background-color: lightgray; /* 버튼의 배경색을 밝은 회색으로 변경 */
                color: black; /* 버튼 텍스트 색상 */
                border: none; /* 버튼 테두리 제거 */
                padding: 10px 20px; /* 버튼 안쪽 여백 조정 */
                font-size: 16px; /* 버튼 텍스트 크기 조정 */
                cursor: pointer; /* 커서를 포인터로 변경 */
                border-radius: 5px; /* 버튼 모서리를 둥글게 변경 */
                }
                #mainButton:hover {
                background-color: darkgray; /* 버튼에 마우스를 올렸을 때 색상 변경 */
                }
            `}</style>
        </div>
    );
};


export default myinfo;