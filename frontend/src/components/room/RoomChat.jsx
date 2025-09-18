import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Code, Paperclip } from 'lucide-react';
import { useSocketContext } from '../../context/SocketContext';
import { useRoomStore } from '../../store/useRoomStore';
import { useAuthStore } from '../../store/useAuthStore';

const RoomChat = ({ room }) => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('text');
  const messagesEndRef = useRef(null);

  const { socket } = useSocketContext();
  const { authUser } = useAuthStore();
  const { roomMessages, fetchRoomMessages } = useRoomStore();

  useEffect(() => {
    if (room?._id) {
      fetchRoomMessages(room._id);
      socket?.emit('join-room', room._id);
    }

    return () => {
      if (room?._id) {
        socket?.emit('leave-room', room._id);
      }
    };
  }, [room?._id]);

  useEffect(() => {
    const handleNewRoomMessage = (newMessage) => {
      useRoomStore.setState((state) => ({
        roomMessages: [...state.roomMessages, newMessage]
      }));
    };

    socket?.on('new-room-message', handleNewRoomMessage);

    return () => {
      socket?.off('new-room-message', handleNewRoomMessage);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !room?._id) return;

    socket?.emit('room-message', {
      roomId: room._id,
      message: message.trim(),
      messageType
    });

    setMessage('');
  };

  const getMessageTypeIcon = (type) => {
    switch(type) {
      case 'code': return <Code size={16} className="text-green-500" />;
      case 'file': return <Paperclip size={16} className="text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg"># {room?.name}</h3>
            <p className="text-sm text-base-content/70">{room?.description}</p>
          </div>
          <div className="badge badge-primary">
            {room?.members?.length || 0} members
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {roomMessages.map((msg, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img 
                  src={msg.senderId?.profilePic || '/default-avatar.png'} 
                  alt="avatar" 
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">
                  {msg.senderId?.fullName}
                </span>
                <span className="text-xs text-base-content/50">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
                {getMessageTypeIcon(msg.messageType)}
              </div>
              <div className={`p-3 rounded-lg ${
                msg.messageType === 'code' 
                  ? 'bg-base-300 font-mono text-sm' 
                  : 'bg-base-200'
              }`}>
                {msg.messageType === 'code' ? (
                  <pre className="whitespace-pre-wrap">{msg.message}</pre>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-base-300">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <div className="dropdown dropdown-top">
            <label tabIndex={0} className="btn btn-ghost btn-sm">
              {messageType === 'code' ? <Code size={18} /> : <Smile size={18} />}
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <button type="button" onClick={() => setMessageType('text')}>
                  💬 Text Message
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setMessageType('code')}>
                  💻 Code Snippet
                </button>
              </li>
            </ul>
          </div>
          
          <input
            type="text"
            placeholder={
              messageType === 'code' 
                ? 'Share your code...' 
                : 'Type a message...'
            }
            className={`input input-bordered flex-1 ${
              messageType === 'code' ? 'font-mono' : ''
            }`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          
          <button type="submit" className="btn btn-primary">
            <Send size={18} />
          </button>
        </form>
        
        <div className="text-xs text-base-content/50 mt-2">
          Press Enter to send • Use dropdown for message type
        </div>
      </div>
    </div>
  );
};

export default RoomChat;