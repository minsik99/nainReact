import React, {useEffect, useState} from "react";
import { observer } from "mobx-react";
import InterviewComponent from "../../components/interview/InterviewComponent";
import { AuthProvider } from "../../api/authContext";

const videoComponent = observer(()=>{
    return (
        <div className="map_div">
            <AuthProvider>
                <InterviewComponent/>
            </AuthProvider>
        </div>
    )
})

export default videoComponent;