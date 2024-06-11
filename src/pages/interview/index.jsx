import React, {useEffect, useState} from "react";
import { observer } from "mobx-react";
import InterviewComponent from "../../components/interview/InterviewComponent";

const videoComponent = observer(()=>{
    return (
        <div className="map_div">
            <InterviewComponent/>
        </div>
    )
})

export default videoComponent;