import React, {useEffect, useState} from "react";
import { observer } from "mobx-react";
import VideoStream from "../../components/interview/VideoStream";

const interviewComponent = observer(()=>{
    return (
        <div className="map_div">
            <VideoStream />
        </div>
    )
})

export default interviewComponent;