import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import instance from '../../api/axiosApi';

const ChatRoomsPage = () => {
    const [rooms, setRooms] = useState([]);
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

    return (
        <div>
            <h1>Chat Rooms</h1>
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
