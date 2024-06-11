import React, {useEffect, useState} from "react";
import { observer } from "mobx-react";
import BoardListComponent from "../../components/board/BoardListComponent";

const boardComponent = observer(()=>{
    return (
        <div className="map_div">
            <BoardListComponent/>
        </div>
    )
})

export default boardComponent;