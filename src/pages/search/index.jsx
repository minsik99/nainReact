import React, {useEffect, useState} from "react";
import { observer } from "mobx-react";
import SearchComponent from "../../components/search/SearchComponent";

const testComponent = observer(()=>{
    return (
        <div className="map_div">
            <SearchComponent/>
        </div>
    )
})

export default testComponent;