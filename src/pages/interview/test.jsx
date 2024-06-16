import React, {useEffect, useState} from "react";
import { observer } from "mobx-react";

const interviewComponent = observer(()=>{
    return (
        <div className="map_div">
            <InterviewlistComponent/>
        </div>
    )
})

export default interviewComponent;