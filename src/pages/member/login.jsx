import React from "react";
import { observer } from "mobx-react";
import LoginForm from "../../components/login/LoginForm";
import styles from "../../styles/member/member.module.css";



const logintest = observer(() => {
    return (
        <div>
            <LoginForm />
        </div>
    );
});

export default logintest;
