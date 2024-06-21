import React, {useEffect, useState} from "react";
import { observer } from "mobx-react";
import InterviewListComponent from "../../components/interview/InterviewlistComponent";
import { AuthProvider } from "../../api/authContext";
import styles from '../../styles/interview/interviewListComponent.module.css';

const videoComponent = observer(()=>{
    return (
        <div className="mapDiv">
            <AuthProvider>
                <InterviewListComponent/>
            </AuthProvider>
        </div>
    )
})

export default videoComponent;