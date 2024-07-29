import React, { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';
import instance from '../../api/axiosApi';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import ko from 'date-fns/locale/ko';

const MQTT_BROKER_URL = process.env.NEXT_PUBLIC_MQTT_BROKER_URL;
const ChatRoomDetail = ({ room, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [client, setClient] = useState(null);
  const [sentMessageIds, setSentMessageIds] = useState(new Set());
  const [updateTime, setUpdateTime] = useState(Date.now());
  const messagesEndRef = useRef(null);
  const [memberNo, setMemberNo] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const memberNo = window.localStorage.getItem("memberNo");
      if (memberNo) {
        setMemberNo(parseInt(memberNo));
      }
    }
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!room || !room.chatRoomNo) return;

    const fetchMessages = async () => {
      try {
        const response = await instance.get(`/api/chat/rooms/${room.chatRoomNo}/messages`);
        setMessages(response.data);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [room]);

  useEffect(() => {
    if (!room || !room.chatRoomNo) return;

    const client = mqtt.connect(MQTT_BROKER_URL);

    client.on('connect', () => {
      console.log('Connected to MQTT Broker');
      client.subscribe(`chat/messages/${room.chatRoomNo}`);
    });

    client.on('message', (topic, message) => {
      const payload = JSON.parse(message.toString());
      console.log('Received message:', payload);
      console.log('Received message date:', payload.messageDate);

      if (!sentMessageIds.has(payload.messageNo)) {
        const parsedDate = parseISO(payload.messageDate);
        if (isNaN(parsedDate)) {
          console.error('Invalid date received:', payload.messageDate);
        } else {
          setMessages((prevMessages) => [...prevMessages, { ...payload, messageDate: parsedDate }]);
          scrollToBottom();
        }
      }
    });

    setClient(client);

    return () => {
      if (client) {
        client.end();
      }
    };
  }, [room, sentMessageIds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateTime(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    const message = {
      messageText: newMessage,
      chatRoomNo: room.chatRoomNo,
    };
    try {
      const response = await instance.post(`/api/chat/rooms/${room.chatRoomNo}/send`, message);
      console.log('Sent message response:', response.data);

      if (response.data && response.data.messageDate) {
        const messageDate = parseISO(response.data.messageDate);
        setMessages((prevMessages) => [...prevMessages, { ...response.data, messageDate }]);
        setSentMessageIds((prevIds) => new Set(prevIds).add(response.data.messageNo));
      } else {
        console.error('Invalid response data:', response.data);
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      console.error('Invalid date:', date);
      return "Invalid date";
    }
    const timeAgo = formatDistanceToNow(parsedDate, { addSuffix: true, locale: ko });
    const exactTime = format(parsedDate, 'a h:mm', { locale: ko });
    return `${exactTime} (${timeAgo})`;
  };

  return (
    <div className="chat-room-detail">
      <div className="chat-room-header">
        <button className="back-button" onClick={onClose}>◀</button>
        <div>
          <h2>{room?.name}</h2>
          <p>{room?.description}</p>
        </div>
        <div className="participants-count"> {room?.participants}</div>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${message.memberNo == memberNo ? 'my-message' : 'other-message'}`}
          >
            <p><strong>{message.nickname}</strong></p>
            <p className="message-text">{message.messageText}</p>
            <span className="message-date">{formatDate(message.messageDate)}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <textarea
          value={newMessage}
          onChange={handleMessageChange}
          onKeyPress={handleKeyPress}
          placeholder="채팅 메시지 보내기"
        />
        <button onClick={handleSendMessage}>▶</button>
      </div>
      <style jsx>{`
        .chat-room-detail {
          width: 100%;
          max-width: 400px;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .chat-room-header {
          padding: 10px;
          background: #66b2b2;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .back-button {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
        }
        .chat-messages {
          flex: 1;
          padding: 10px;
          overflow-y: auto;
          max-height: 500px;
          display: flex;
          flex-direction: column;
          overflow-anchor: none; /* 스크롤 위치 고정 */
        }
        .chat-messages > :first-child {
          overflow-anchor: auto; /* 스크롤 위치 초기화 */
        }
        .chat-message {
          margin-bottom: 10px;
          padding: 10px;
          border-radius: 10px;
          max-width: 70%;
        }
        .chat-message.my-message {
          background: #d7f2f0;
          align-self: flex-end;
          text-align: left;
        }
        .chat-message.other-message {
          background: #fff;
          border: 1px solid #ddd;
          align-self: flex-start;
          text-align: left;
        }
        .message-text {
          white-space: pre-wrap; /* 줄바꿈을 유지하여 표시 */
        }
        .message-date {
          display: block;
          font-size: 0.75rem;
          color: #666;
          margin-top: 5px;
        }
        .chat-input {
          display: flex;
          padding: 10px;
          border-top: 1px solid #ddd;
        }
        .chat-input textarea {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          resize: none;
        }
        .chat-input button {
          background: #66b2b2;
          color: white;
          border: none;
          padding: 0 15px;
          margin-left: 10px;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ChatRoomDetail;

