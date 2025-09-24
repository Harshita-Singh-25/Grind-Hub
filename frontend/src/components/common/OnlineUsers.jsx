import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { User } from 'lucide-react';

const OnlineUsers = () => {
  const { onlineUsers, authUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  // Filter out the current user from the online users list
  const otherOnlineUsers = onlineUsers?.filter(userId => userId !== authUser?._id) || [];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-200 transition-colors"
        aria-label="Online users"
      >
        <div className="relative">
          <User className="w-5 h-5" />
          {otherOnlineUsers.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
              {otherOnlineUsers.length}
            </span>
          )}
        </div>
        <span className="hidden md:inline">Online</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-base-100 rounded-lg shadow-lg z-10 border border-base-300">
          <div className="p-3 border-b border-base-300">
            <h3 className="font-medium">Online Users</h3>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {otherOnlineUsers.length > 0 ? (
              <ul>
                {otherOnlineUsers.map(userId => (
                  <li key={userId} className="p-3 hover:bg-base-200 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="truncate">{userId}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-3 text-sm text-base-content/70">
                No other users online
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineUsers;
