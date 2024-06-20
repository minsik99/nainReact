import React, {useEffect, useState} from "react";
import { observer } from "mobx-react";
import CompanylistComponent from "../../components/companylist/CompanylistComponent";


const companyComponent = observer(()=>{
    return (
        <div className="map_div" style={{padding: '10px', margin: '0 auto'}}>
            <CompanylistComponent/>
        </div>
    )
})

export default companyComponent;