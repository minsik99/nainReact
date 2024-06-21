import React from "react";
import { observer } from "mobx-react";
import LoginForm from "../../components/login/LoginForm";
import styles from '../../styles/member/memberLogin.module.css';


const logintest = observer(() => {
    return (
        <div className={styles.centerDiv}>
            <h1>회원가입</h1>
            <LoginForm styles={styles} />
        </div>
    );
});

export default logintest;
