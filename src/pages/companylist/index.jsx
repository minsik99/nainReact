import React, {useEffect, useState} from "react";
import { observer } from "mobx-react";
import CompanylistComponent from "../../components/companylist/CompanylistComponent";


const companyComponent = observer(()=>{
    return (
        <div className="map_div">
            <CompanylistComponent/>
        </div>
    )
})

export default companyComponent;