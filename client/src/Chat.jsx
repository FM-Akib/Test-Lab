import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Chat = () => {
  const [nickname, setNickname] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [joinedRoom, setJoinedRoom] = useState(false);

  // Load chat from localStorage
  useEffect(() => {
    const storedChat = localStorage.getItem('chat');
    if (storedChat) {
      setChat(JSON.parse(storedChat));
    }
  }, []);

  // Save chat to localStorage
  useEffect(() => {
    localStorage.setItem('chat', JSON.stringify(chat));
  }, [chat]);

  // Join room
  const joinRoom = () => {
    if (nickname !== '' && room !== '') {
      socket.emit('join_room', { nickname, room });
      setJoinedRoom(true);
    }
  };

  // Listen for messages (both sent and received)
  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });

    // Clean up to avoid duplicate listeners when the component re-renders
    return () => {
      socket.off('receive_message');
    };
  }, []);

  // Send message to server
  const sendMessage = () => {
    if (message !== '') {
      const messageData = {
        room: room,
        author: nickname,
        message: message,
        time: new Date().toLocaleTimeString(),
      };

      // Emit the message to the server (but don't update the chat locally)
      socket.emit('send_message', messageData);

      setMessage(''); // Clear input after sending
    }
  };

  // Render chat interface after joining a room
  if (!joinedRoom) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Join Chat</h2>
        <input
          type="text"
          placeholder="Enter Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="Enter Room Code"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={joinRoom}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Join Room
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Room: {room}</h2>
        <div className="border p-4 h-64 overflow-y-auto mb-4">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 flex items-center ${
                msg.author === nickname
                  ? 'justify-end' // Align right if it's the current user
                  : 'justify-start' // Align left for others
              }`}
            >
              <img
                src={`https://avatars.dicebear.com/api/initials/${msg.author}.svg`}
                alt="avatar"
                className="w-8 h-8 rounded-full mr-2"
              />
              <div
                className={`px-4 py-2 rounded-lg ${
                  msg.author === nickname
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-black'
                }`}
              >
                <b>{msg.author}</b> ({msg.time}): {msg.message}
              </div>
            </div>
          ))}
        </div>
        <input
          type="text"
          className="w-full p-2 border rounded mb-2"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
