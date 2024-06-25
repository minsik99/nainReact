import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import instance from '../../api/axiosApi';

const ChatRoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [roomName, setRoomName] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await instance.get('/chat/rooms');
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, []);

    const enterRoom = (roomId) => {
        router.push(`/chat/${roomId}`);
    };

    const handleRoomNameChange = (event) => {
        setRoomName(event.target.value);
    };

    const createRoom = async () => {
        try {
            const response = await instance.post('/chat/rooms', { name: roomName });
            setRooms(prevRooms => [...prevRooms, response.data]);
            setRoomName('');
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            createRoom();
        }
    };

    return (
        <div>
            <h1>Chat Rooms</h1>
            <div>
                <input
                    type="text"
                    value={roomName}
                    onChange={handleRoomNameChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter new room name"
                />
                <button onClick={createRoom}>Create Room</button>
            </div>
            <div>
                {rooms.map((room) => (
                    <div key={room.chatRoomNo}>
                        <span>{room.name}</span>
                        <button onClick={() => enterRoom(room.chatRoomNo)}>Enter</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatRoomsPage;
