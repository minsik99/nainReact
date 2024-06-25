import React, { useState } from 'react';
import CreateRoomPopup from './CreateRoomPopup';
import ChatRoomDetail from './ChatRoomDetail';

const ChatList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateRoomPopup, setShowCreateRoomPopup] = useState(false);
  const [chatRooms, setChatRooms] = useState([
    { id: 1, name: '프론트엔드 개발자 모임', description: '프론트엔드 개발자들의 모임입니다.', participants: 100, category: '개발' },
    { id: 2, name: '백엔드 개발자 모임', description: '백엔드 개발자들의 모임입니다.', participants: 200, category: '개발' },
    { id: 3, name: '데브옵스 엔지니어 모임', description: '데브옵스 엔지니어들의 모임입니다.', participants: 150, category: '엔지니어' },
    { id: 4, name: 'IT 기획자 모임', description: 'IT 기획자들의 모임입니다.', participants: 50, category: '기획' },
    { id: 5, name: '프로젝트 매니저 모임', description: '프로젝트 매니저들의 모임입니다.', participants: 70, category: 'PM' },
    { id: 6, name: '데이터 분석가 모임', description: '데이터 분석가들의 모임입니다.', participants: 90, category: '개발' },
    { id: 7, name: '보안 전문가 모임', description: '보안 전문가들의 모임입니다.', participants: 80, category: '엔지니어' },
    { id: 8, name: 'UX/UI 디자이너 모임', description: 'UX/UI 디자이너들의 모임입니다.', participants: 60, category: '기획' },
    { id: 9, name: '풀스택 개발자 모임', description: '풀스택 개발자들의 모임입니다.', participants: 120, category: '개발' },
    { id: 10, name: 'AI/ML 엔지니어 모임', description: 'AI/ML 엔지니어들의 모임입니다.', participants: 110, category: '엔지니어' },
  ]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCreateRoom = () => {
    setShowCreateRoomPopup(true);
  };

  const handleClosePopup = () => {
    setShowCreateRoomPopup(false);
  };

  const handleRoomSubmit = (newRoom) => {
    setChatRooms([...chatRooms, { ...newRoom, id: chatRooms.length + 1, participants: Math.floor(Math.random() * 500) + 1 }]);
    setShowCreateRoomPopup(false);
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  const filteredChatRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chat-list-container">
      <div className="chat-list">
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
            <div key={room.id} className="chat-room-item" onClick={() => handleRoomClick(room)}>
              <div className="chat-room-icon">
                <img src="/image/chat.png" alt="chat icon" />
              </div>
              <div className="chat-room-info">
                {room.name} | {`참여 인원 : ${room.participants}명`} {`# ${room.category}`}
              </div>
            </div>
          ))}
        </div>
        <button className="create-room-button" onClick={handleCreateRoom}>+ 채팅방 만들기</button>

        {showCreateRoomPopup && (
          <CreateRoomPopup onClose={handleClosePopup} onSubmit={handleRoomSubmit} />
        )}
      </div>

      {selectedRoom && (
        <div className="chat-room-detail-container">
          <ChatRoomDetail room={selectedRoom} onClose={() => setSelectedRoom(null)} />
        </div>
      )}

      <style jsx>{`
        .chat-list-container {
          display: flex;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .chat-list {
          width: 50%;
        }
        .chat-room-detail-container {
          width: 50%;
          padding-left: 20px;
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
          cursor: pointer;
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
