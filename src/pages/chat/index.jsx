import React from "react";
import { observer } from "mobx-react";
import WebSocketClient from "../../components/chat/WebSocketClient";

const chatComponent = observer(()=>{
    return (
        <div>
            <WebSocketClient />
        </div>
    )
})

export default chatComponent;