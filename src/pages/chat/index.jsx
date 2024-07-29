import { useEffect, useState } from 'react';
import instance from '../../api/axiosApi';
import dynamic from 'next/dynamic';
import styles from '../../styles/chat/room.module.css';

const CreateRoomPopup = dynamic(() => import('./CreateRoomPopup'), { ssr: false });
const ChatRoomDetail = dynamic(() => import('./ChatRoomDetail'), { ssr: false });

const ChatRoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateRoomPopup, setShowCreateRoomPopup] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await instance.get('/api/chat/rooms');
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, []);

    const handleRoomClick = (room) => {
        setSelectedRoom(room);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCreateRoom = () => {
        setShowCreateRoomPopup(true);
    };

    const handleClosePopup = () => {
        setShowCreateRoomPopup(false);
    };

    const handleRoomSubmit = async (newRoom) => {
        try {
            const response = await instance.post('/api/chat/rooms', newRoom);
            setRooms([...rooms, response.data]);
            setShowCreateRoomPopup(false);
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    const handleRoomClose = () => {
        setSelectedRoom(null);
    };

    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.chatListContainer}>
            <div className={styles.chatList}>
                <h1>채팅방 리스트</h1>
                <input
                    type="text"
                    placeholder="채팅방 검색"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                />
                <div className={styles.chatRoomList}>
                    {filteredRooms.map(room => (
                        <div key={room.chatRoomNo} className={styles.chatRoomItem} onClick={() => handleRoomClick(room)}>
                            <div className={styles.chatRoomIcon}>
                                <img src="/image/chat.png" alt="chat icon" />
                            </div>
                            <div className={styles.chatRoomInfo}>
                                {room.name}
                            </div>
                        </div>
                    ))}
                </div>
                <button className={styles.createRoomButton} onClick={handleCreateRoom}>+ 채팅방 만들기</button>

                {showCreateRoomPopup && (
                    <CreateRoomPopup onClose={handleClosePopup} onSubmit={handleRoomSubmit} />
                )}
            </div>

            {selectedRoom && (
                <div className={styles.chatRoomDetailContainer}>
                    <ChatRoomDetail room={selectedRoom} onClose={handleRoomClose} />
                </div>
            )}
        </div>
    );
};

export default ChatRoomsPage;
