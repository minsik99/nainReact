import React, {useEffect, useState} from "react";
import { observer } from "mobx-react";
import WebcamComponent from "../../component/WebcamComponent";

const testComponent = observer(()=>{
    return (
        <div className="map_div">
            <WebcamComponent/>
        </div>
    )
})

export default testComponent;