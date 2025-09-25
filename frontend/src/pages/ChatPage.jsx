import React from 'react';
//import { useChatStore } from '../../store/useChatStore';
import { useChatStore } from '../store/useChatStore';
import ChatSidebar from '../components/chat/ChatSidebar';
import NoChatSelected from '../components/chat/NoChatSelected';
import ChatContainer from '../components/chat/ChatContainer';

const ChatPage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="flex h-full bg-base-100">
      {/* Chat Sidebar - List of users */}
      <ChatSidebar />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </div>
    </div>
  );
};

export default ChatPage;