import React, { useEffect, useState, useRef } from 'react';

const WebSocketClient = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const ws = useRef(null);

    useEffect(() => {
        // WebSocket 서버와 연결
        ws.current = new WebSocket('ws://localhost:9999/ws');

        ws.current.onopen = () => {
            console.log('WebSocket 연결 성공');
        };

        ws.current.onmessage = (event) => {
            const message = event.data;
            setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'other' }]);
        };

        ws.current.onclose = () => {
            console.log('WebSocket 연결 종료');
        };

        return () => {
            ws.current.close();
        };
    }, []);

    const sendMessage = () => {
        if (ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(input);
            // 보낸 메시지를 메시지 리스트에 추가
            setMessages((prevMessages) => [...prevMessages, { text: input, sender: 'me' }]);
            setInput(''); // 입력창 초기화
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`chat-message ${message.sender}`}>
                        {message.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyPress={(e) => { if (e.key === 'Enter') sendMessage(); }}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default WebSocketClient;