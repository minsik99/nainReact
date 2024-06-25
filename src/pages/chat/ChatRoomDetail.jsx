import React, { useState } from 'react';

const ChatRoomDetail = ({ room, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, user: '사용자 이름 1', content: '안녕하세요.', time: '16:42' },
    { id: 2, user: '사용자 이름 2', content: '직무 관련 정보 교환해요!!', time: '16:45' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    const newMsg = {
      id: messages.length + 1,
      user: '사용자 이름 3',
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="chat-room-detail">
      <div className="chat-room-header">
        <button className="back-button" onClick={onClose}>◀</button>
        <div>
          <h2>{room.name}</h2>
          <p>{room.description}</p>
        </div>
        <div className="participants-count">참여자 수: {room.participants}</div>
      </div>
      <div className="chat-messages">
        {messages.map(message => (
          <div key={message.id} className="chat-message">
            <p><strong>{message.user}</strong></p>
            <p>{message.content}</p>
            <span>{message.time}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={handleMessageChange}
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
        }
        .chat-message {
          margin-bottom: 10px;
        }
        .chat-input {
          display: flex;
          padding: 10px;
          border-top: 1px solid #ddd;
        }
        .chat-input input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
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
