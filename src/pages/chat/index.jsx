import React from "react";
import { observer } from "mobx-react";
import ChatPage from "../../components/chat/chatpage";

const chatComponent = observer(()=>{
    return (
        <div>
            <ChatPage />
        </div>
    )
})

export default chatComponent;