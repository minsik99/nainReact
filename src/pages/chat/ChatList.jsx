import React, { useState } from 'react';

const ChatList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const getRandomParticipants = () => Math.floor(Math.random() * 500) + 1;

  const chatRooms = [
    { id: 1, name: '프론트엔드 개발자 모임', participants: getRandomParticipants(), category: '개발' },
    { id: 2, name: '백엔드 개발자 모임', participants: getRandomParticipants(), category: '개발' },
    { id: 3, name: '데브옵스 엔지니어 모임', participants: getRandomParticipants(), category: '엔지니어' },
    { id: 4, name: 'IT 기획자 모임', participants: getRandomParticipants(), category: '기획' },
    { id: 5, name: '프로젝트 매니저 모임', participants: getRandomParticipants(), category: 'PM' },
    { id: 6, name: '데이터 분석가 모임', participants: getRandomParticipants(), category: '개발' },
    { id: 7, name: '보안 전문가 모임', participants: getRandomParticipants(), category: '엔지니어' },
    { id: 8, name: 'UX/UI 디자이너 모임', participants: getRandomParticipants(), category: '기획' },
    { id: 9, name: '풀스택 개발자 모임', participants: getRandomParticipants(), category: '개발' },
    { id: 10, name: 'AI/ML 엔지니어 모임', participants: getRandomParticipants(), category: '엔지니어' },
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredChatRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chat-list-container">
      <h1>채팅방 리스트</h1>
      <input
        type="text"
        placeholder="채팅방 검색"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
      <div className="chat-room-list">
        {filteredChatRooms.map(room => (
          <div key={room.id} className="chat-room-item">
            <div className="chat-room-icon">
              <img src="/image/chat.png" alt="chat icon" />
            </div>
            <div className="chat-room-info">
              {room.name} | {`참여 인원 : ${room.participants}명`} {`# ${room.category}`}
            </div>
          </div>
        ))}
      </div>
      <button className="create-room-button">+ 채팅방 만들기</button>

      <style jsx>{`
        .chat-list-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .search-input {
          width: 100%;
          padding: 10px;
          margin-bottom: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .chat-room-list {
          margin-bottom: 20px;
        }
        .chat-room-item {
          display: flex;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #eee;
        }
        .chat-room-icon {
          margin-right: 10px;
        }
        .chat-room-icon img {
          width: 30px;
          height: 30px;
        }
        .chat-room-info p {
          margin: 0;
          padding: 0;
        }
        .create-room-button {
          display: block;
          width: 100%;
          padding: 10px;
          background-color: #66b2b2;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        .create-room-button:hover {
          background-color: #549999;
        }
      `}</style>
    </div>
  );
};

export default ChatList;
