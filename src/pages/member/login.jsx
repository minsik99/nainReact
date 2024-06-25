import React from "react";
import { observer } from "mobx-react";
import LoginForm from "../../components/login/loginForm";
import styles from '../../styles/member/memberLogin.module.css';


const logintest = observer(() => {
    return (
        <div className={styles.centerDiv}>
            <LoginForm styles={styles} />
        </div>
    );
});

export default logintest;
