import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/member/terms.module.css';
import SignUpTerms from '../../components/member/SignUpTerms';

const Terms = () => {
    const router = useRouter();
    const [termsAgreed, setTermsAgreed] = useState({
        term1: false,
        term2: false,
        term3: false,
    });

    const [allTermsChecked, setAllTermsChecked] = useState(false);
    const allTermsAgreed = termsAgreed.term1 && termsAgreed.term2 && termsAgreed.term3;

    const handleAllTermsChange = (e) => {
        const checked = e.target.checked;
        setAllTermsChecked(checked);
        setTermsAgreed({
            term1: checked,
            term2: checked,
            term3: checked,
        });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setTermsAgreed({
            ...termsAgreed,
            [name]: checked,
        });
        setAllTermsChecked(termsAgreed.term1 && termsAgreed.term2 && termsAgreed.term3);
    };

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

    const handleAgreeTerm4 = () => {
        const newCheckedStatus = !allTermsChecked;
        setAllTermsChecked(newCheckedStatus);
        setTermsAgreed({
            term1: newCheckedStatus,
            term2: newCheckedStatus,
            term3: newCheckedStatus,
        });
    };

    const handleAgree = async () => {
        if (allTermsAgreed) {
            localStorage.setItem('termsAgreed', 'true');

            try {
                router.push('/member/signUpForm');
            } catch (error) {
                console.error('회원가입에 실패했습니다.', error);
            }
        } else {
            alert('모든 약관에 동의해야 합니다.');
        }
    };

    const handleGoBack = () => {
        router.push("/");
    }

    return (
        <div className={styles.termsContainer}>
            <h1>이용 약관</h1>
            <div className={styles.termCheckboxes}>
                <div className={styles.termChecked}>
                    <input type='checkbox' name="term1" checked={termsAgreed.term1} onChange={handleCheckboxChange} />
                    [필수] 서비스 이용 약관
                </div>
                <div className={styles.termContent}>
                    <SignUpTerms termNo={1}/>
                </div>
                <button onClick={handleAgreeTerm1}>확인</button>
                <br />

                <div className={styles.termChecked}>
                    <input type='checkbox' name="term2" checked={termsAgreed.term2} onChange={handleCheckboxChange} />
                    [필수] 유료 서비스 이용 약관
                </div>
                <div className={styles.termContent}>
                    <SignUpTerms termNo={2}/>
                </div>
                <button onClick={handleAgreeTerm2}>확인</button>
                <br />

                <div className={styles.termChecked}>
                    <input type='checkbox' name="term3" checked={termsAgreed.term3} onChange={handleCheckboxChange} />
                    [필수] 커뮤니티 이용 약관
                </div>
                <div className={styles.termContent}>
                    <SignUpTerms termNo={3}/>
                </div>
                <button onClick={handleAgreeTerm3}>확인</button>
                <br />

                <div className={styles.termChecked}>
                    <input type='checkbox' checked={allTermsChecked} onChange={handleAllTermsChange} />
                    이용약관 전체 동의
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
