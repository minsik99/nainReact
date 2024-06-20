import React, {useEffect, useState} from "react";
import { observer } from "mobx-react";
import InterviewListComponent from "../../components/interview/InterviewlistComponent";
import { AuthProvider } from "../../api/authContext";

const videoComponent = observer(()=>{
    return (
        <div className="map_div">
            <AuthProvider>
                <InterviewListComponent/>
            </AuthProvider>
        </div>
    )
})

export default videoComponent;