import React, {useEffect, useState} from "react";
import { observer } from "mobx-react";
import SearchComponent from "../../components/search/SearchComponent";
import LoginForm from "../../components/login/loginForm";

const testComponent = observer(()=>{
    return (
        <div className="map_div">
            <LoginForm/>
        </div>
    )
})

export default testComponent;