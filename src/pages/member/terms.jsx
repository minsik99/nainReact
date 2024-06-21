import React, {useState} from 'react';
import { useRouter } from 'next/router';
import { signUp } from '../../api/user';
import styles from '../../styles/member/terms.module.css';
import SignUpForm from './signUpForm';


const Terms = () => {
    const router = useRouter();
    const [termsAgreed, setTermsAgreed] = useState({
        term1: false,
        term2: false,
        term3: false,
    });

    //전체 동의 체크 상태
    const [allTermsChecked, setAllTermsChecked] = useState(false);

    // 모든 약관에 동의했는지 여부를 체크
    const allTermsAgreed = termsAgreed.term1 && termsAgreed.term2 && termsAgreed.term3;

    // 전체 동의 체크박스가 변경될 때
    const handleAllTermsChange = (e) => {
        const checked = e.target.checked;
        setAllTermsChecked(checked);
        setTermsAgreed({
            term1: checked,
            term2: checked,
            term3: checked,
        });
    };

    // 개별 약관 동의 체크박스가 변경될 때
    const handleCheckboxChange = (e) => {
        const {name, checked} = e.target;
        setTermsAgreed({
            ...termsAgreed,
            [name]: checked,
        });
        // 개별 체크박스가 변경될 때 전체 동의 체크 여부 확인
        setAllTermsChecked(termsAgreed.term1 && termsAgreed.term2 && termsAgreed.term3);
    };

    // 개별 약관 확인 버튼 클릭 시
    const handleAgreeTerm1 = () => {
        setTermsAgreed({
            ...termsAgreed,
            term1: !termsAgreed.term1,
        });
    };

    const handleAgreeTerm2 = () => {
        setTermsAgreed({
            ...termsAgreed,
            term2: !termsAgreed.term2,
        });
    };

    const handleAgreeTerm3 = () => {
        setTermsAgreed({
            ...termsAgreed,
            term3: !termsAgreed.term3,
        });
    };

    // 전체 동의 버튼 클릭 시
    const handleAgreeTerm4 = () => {
        const newChekedStatus = !allTermsChecked;
        setAllTermsChecked(newChekedStatus);
        setTermsAgreed({
            term1: newChekedStatus,
            term2: newChekedStatus,
            term3: newChekedStatus,
        });
    };
    
    //동의 버튼 클릭 시
    const handleAgree = async () => {
        if(allTermsAgreed){
            localStorage.setItem('termsAgreed', 'true');

            try{
                router.push('/member/signUpForm'); //회원가입 페이지로 이동
            }catch(error){
                console.error('회원가입에 실패했습니다.', error);
                // 에러 로직 추가 가능
            }
        }else{
            alert('모든 약관에 동의해야 합니다.');
        }
    };
    
    //메인으로 돌아가기 버튼 클릭 시
    const handleGoBack = () => {
        router.push("/"); //메인 페이지로 이동
    }


    return(
        <div className={styles.termsContainer}>
            <h1>이용 약관</h1>
            <div className={styles.termCheckboxes}>
                <div className={styles.termChecked}>
                    <input type='checkbox' name="term1" checked={termsAgreed.term1} onChange={handleCheckboxChange} />
                    이용 약관 1에 동의합니다.
                </div>
                <button onClick={handleAgreeTerm1}>확인</button>
                <br />

                <div className={styles.termChecked}>
                    <input type='checkbox' name="term2" checked={termsAgreed.term2} onChange={handleCheckboxChange} />
                    이용 약관 2에 동의합니다.
                </div>
                <button onClick={handleAgreeTerm2}>확인</button>
                <br />

                <div className={styles.termChecked}>
                    <input type='checkbox' name="term3" checked={termsAgreed.term3} onChange={handleCheckboxChange} />
                    이용 약관 3에 동의합니다.
                </div>
                <button onClick={handleAgreeTerm3}>확인</button>
                <div className={styles.termChecked}>
                    <input type='checkbox' checked={allTermsChecked} onChange={handleAllTermsChange} />
                    전체 동의합니다.
                </div>
                <button onClick={handleAgreeTerm4}>전체 동의</button>
                
            </div>
            <div className={styles.buttonContainer}>
                <button onClick={handleAgree} disabled={!allTermsAgreed}>동의합니다</button>
                <button onClick={handleGoBack}>메인으로 돌아가기</button>
            </div>
        </div>
    );
};

export default Terms;