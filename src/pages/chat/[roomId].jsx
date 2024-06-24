import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import mqtt from 'mqtt';
import instance from '../../api/axiosApi';

const MQTT_BROKER_URL = "ws://localhost:9001";

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [client, setClient] = useState(null);
    const router = useRouter();
    const { roomId } = router.query;

    useEffect(() => {
        if (!roomId) return;

        const fetchMessages = async () => {
            try {
                const response = await instance.get(`/chat/rooms/${roomId}/messages`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [roomId]);

    useEffect(() => {
        if (!roomId) return;

        const client = mqtt.connect(MQTT_BROKER_URL);

        client.on('connect', () => {
            console.log('Connected to MQTT Broker');
            client.subscribe(`chat/messages/${roomId}`);
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
    }, [roomId]);

    const sendMessage = async () => {
        const message = {
            "messageText": messageText,
            "chatRoomNo": roomId,
        };
        try {
            await instance.post(`/chat/rooms/${roomId}/send`, message);
            setMessageText('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            <h1>Chat Room {roomId}</h1>
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
};

export default ChatRoom;
