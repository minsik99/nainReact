import React, {useEffect, useState} from "react";
import { observer } from "mobx-react";
import MyResume from "./MyResume";

const testResumeComponent = observer(()=>{
    return (
        <div className="map_div">
            <MyResume/>
        </div>
    )
})

export default testResumeComponent;