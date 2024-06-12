import React from "react";
import { observer } from "mobx-react";
import LoginForm from "../../components/login/LoginForm";



const logintest = observer(() => {
    return (
        <div>
            <LoginForm />
        </div>
    );
});

export default logintest;
