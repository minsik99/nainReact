// pages/index.js
import { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import instance from '../../api/axiosApi';

const MQTT_BROKER_URL = "ws://localhost:9001";

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [client, setClient] = useState(null);

    useEffect(() => {
        const client = mqtt.connect(MQTT_BROKER_URL);

        client.on('connect', () => {
            console.log('Connected to MQTT Broker');
            client.subscribe('chat/messages');
        });

        client.on('message', (topic, message) => {
            const payload = JSON.parse(message.toString());
            setMessages((prevMessages) => [...prevMessages, payload]);
        });

        setClient(client);

        return () => {
            if (client) {
                client.end();
            }
        };
    }, []);

    const sendMessage = async () => {

        const message = {
            "messageText": messageText,
        };
        try {
            await instance.post('/chat/send', message);
            setMessageText('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };


    return (
        <div>
            <h1>Chat Room</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>Member {msg.memberNo}:</strong> {msg.messageText}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Enter your message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}
export default ChatPage;