import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Smile, 
  Code, 
  Paperclip, 
  Users, 
  Settings, 
  Crown, 
  Shield,
  UserPlus,
  UserMinus,
  MoreVertical,
  Hash,
  Lock,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { useRoomStore } from '../../store/useRoomStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatDistanceToNow } from 'date-fns';

const RoomChatInterface = ({ room, onBack }) => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('text');
  const [showMembers, setShowMembers] = useState(false);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const messagesEndRef = useRef(null);

  const { 
    roomMessages, 
    fetchRoomMessages, 
    sendRoomMessage, 
    subscribeToRoomEvents,
    unsubscribeFromRoomEvents,
    leaveRoom 
  } = useRoomStore();
  
  const { authUser } = useAuthStore();

  const isCreator = room.createdBy._id === authUser?._id;
  const isModerator = room.moderators?.some(mod => mod._id === authUser?._id);
  const isMember = room.members?.some(member => member._id === authUser?._id);
  const canManage = isCreator || isModerator;

  // Fetch messages and setup real-time updates
  useEffect(() => {
    if (room?._id) {
      fetchRoomMessages(room._id);
      subscribeToRoomEvents();
    }

    return () => {
      unsubscribeFromRoomEvents();
    };
  }, [room?._id]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !room?._id) return;

    try {
      await sendRoomMessage(room._id, {
        message: message.trim(),
        messageType
      });
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleLeaveRoom = async () => {
    if (window.confirm('Are you sure you want to leave this room?')) {
      try {
        await leaveRoom(room._id);
        onBack();
      } catch (error) {
        // Error handled in store
      }
    }
  };

  const getMessageTypeIcon = (type) => {
    switch(type) {
      case 'code': return <Code size={16} className="text-green-500" />;
      case 'file': return <Paperclip size={16} className="text-blue-500" />;
      default: return null;
    }
  };

  const getRoleIcon = (userId) => {
    if (room.createdBy._id === userId) {
      return <Crown size={14} className="text-yellow-500" title="Room Creator" />;
    }
    if (room.moderators?.some(mod => mod._id === userId)) {
      return <Shield size={14} className="text-blue-500" title="Moderator" />;
    }
    return null;
  };

  if (!isMember) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold mb-2">Access Denied</h3>
          <p className="text-base-content/70">You need to be a member of this room to view messages.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-base-100 border-b border-base-300 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back button for mobile */}
            <button 
              onClick={onBack}
              className="btn btn-ghost btn-sm btn-circle lg:hidden"
            >
              <ArrowLeft size={20} />
            </button>
            
            <div className="flex items-center gap-2">
              {room.isPrivate ? (
                <Lock size={20} className="text-base-content/60" />
              ) : (
                <Hash size={20} className="text-primary" />
              )}
              <div>
                <h3 className="font-bold text-lg">{room.name}</h3>
                <p className="text-sm text-base-content/70">{room.description}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Members count */}
            <button
              onClick={() => setShowMembers(!showMembers)}
              className="btn btn-ghost btn-sm"
            >
              <Users size={16} />
              <span className="hidden sm:inline">{room.members?.length || 0}</span>
            </button>

            {/* Room menu */}
            <div className="dropdown dropdown-end">
              <button className="btn btn-ghost btn-sm btn-circle">
                <MoreVertical size={16} />
              </button>
              <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <button onClick={() => setShowRoomInfo(!showRoomInfo)}>
                    <Settings size={14} />
                    Room Info
                  </button>
                </li>
                {canManage && (
                  <li>
                    <button>
                      <UserPlus size={14} />
                      Invite Members
                    </button>
                  </li>
                )}
                <li>
                  <button onClick={handleLeaveRoom} className="text-error">
                    <UserMinus size={14} />
                    Leave Room
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Room stats */}
        <div className="flex items-center gap-4 mt-2 text-sm text-base-content/60">
          <span>Created {formatDistanceToNow(new Date(room.createdAt), { addSuffix: true })}</span>
          <span>•</span>
          <span>{room.category.replace('-', ' ')}</span>
          <span>•</span>
          <span className={`capitalize ${
            room.difficulty === 'easy' ? 'text-green-500' :
            room.difficulty === 'medium' ? 'text-yellow-500' :
            room.difficulty === 'hard' ? 'text-red-500' : 'text-blue-500'
          }`}>
            {room.difficulty}
          </span>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Messages Container */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {roomMessages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💬</div>
                <h4 className="text-lg font-semibold mb-2">No messages yet</h4>
                <p className="text-base-content/70">Be the first to start the conversation!</p>
              </div>
            ) : (
              roomMessages.map((msg, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img 
                        src={msg.senderId?.profilePic || '/default-avatar.png'} 
                        alt="avatar" 
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {msg.senderId?.fullName}
                      </span>
                      {getRoleIcon(msg.senderId?._id)}
                      <span className="text-xs text-base-content/50">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                      {getMessageTypeIcon(msg.messageType)}
                    </div>
                    <div className={`p-3 rounded-lg break-words ${
                      msg.messageType === 'code' 
                        ? 'bg-base-300 font-mono text-sm overflow-x-auto' 
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
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-base-300 p-4">
            <div className="flex gap-2">
              {/* Message Type Selector */}
              <div className="dropdown dropdown-top">
                <button className="btn btn-ghost btn-sm">
                  {messageType === 'code' ? <Code size={18} /> : <Smile size={18} />}
                </button>
                <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <button onClick={() => setMessageType('text')}>
                      💬 Text Message
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setMessageType('code')}>
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
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              
              <button 
                onClick={handleSendMessage}
                className="btn btn-primary"
                disabled={!message.trim()}
              >
                <Send size={18} />
              </button>
            </div>
            
            <div className="text-xs text-base-content/50 mt-2">
              Press Enter to send • Shift+Enter for new line • Use dropdown for message type
            </div>
          </div>
        </div>

        {/* Members Sidebar */}
        {showMembers && (
          <div className="w-64 border-l border-base-300 bg-base-100">
            <div className="p-4 border-b border-base-300">
              <h4 className="font-semibold">Members ({room.members?.length || 0})</h4>
            </div>
            <div className="p-4 space-y-2 overflow-y-auto max-h-96">
              {room.members?.map(member => (
                <div key={member._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={member.profilePic || '/default-avatar.png'} alt={member.fullName} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm truncate">{member.fullName}</span>
                      {getRoleIcon(member._id)}
                    </div>
                    <span className="text-xs text-base-content/60">
                      {member._id === authUser._id ? 'You' : 'Member'}
                    </span>
                  </div>
                </div>
              )) || []}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomChatInterface;