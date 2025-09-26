import React, { useState } from 'react';
import { 
  Users, 
  Lock, 
  Globe, 
  Crown, 
  Shield, 
  MessageCircle, 
  Calendar,
  Tag,
  MoreVertical,
  Settings,
  UserPlus,
  UserMinus,
  Trash2,
  Edit3
} from 'lucide-react';
import { useRoomStore } from '../../store/useRoomStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatDistanceToNow } from 'date-fns';

const RoomCard = ({ room, onRoomSelect }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { joinRoom, leaveRoom, deleteRoom, isJoiningRoom } = useRoomStore();
  const { authUser } = useAuthStore();

  const isCreator = room.createdBy._id === authUser?._id;
  const isModerator = room.moderators?.some(mod => mod._id === authUser?._id);
  const isMember = room.members?.some(member => member._id === authUser?._id);
  const canManage = isCreator || isModerator;

  // Get category display info
  const getCategoryInfo = (category) => {
    const categories = {
      'algorithms': { label: 'Algorithms', color: 'bg-blue-100 text-blue-800' },
      'system-design': { label: 'System Design', color: 'bg-purple-100 text-purple-800' },
      'frontend': { label: 'Frontend', color: 'bg-green-100 text-green-800' },
      'backend': { label: 'Backend', color: 'bg-orange-100 text-orange-800' },
      'general': { label: 'General', color: 'bg-gray-100 text-gray-800' },
      'mock-interviews': { label: 'Mock Interviews', color: 'bg-red-100 text-red-800' }
    };
    return categories[category] || categories.general;
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty) => {
    const colors = {
      'easy': 'badge-success',
      'medium': 'badge-warning',
      'hard': 'badge-error',
      'mixed': 'badge-info'
    };
    return colors[difficulty] || colors.mixed;
  };

  const handleJoinRoom = async () => {
    try {
      await joinRoom(room._id);
      // Optionally navigate to room
      if (onRoomSelect) {
        onRoomSelect(room);
      }
    } catch (error) {
      // Error handled in store
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom(room._id);
    } catch (error) {
      // Error handled in store
    }
  };

  const handleDeleteRoom = async () => {
    if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      try {
        await deleteRoom(room._id);
      } catch (error) {
        // Error handled in store
      }
    }
  };

  const handleEnterRoom = () => {
    if (isMember && onRoomSelect) {
      onRoomSelect(room);
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200 border border-base-200">
      <div className="card-body p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {room.isPrivate ? (
                <Lock size={16} className="text-base-content/60" />
              ) : (
                <Globe size={16} className="text-base-content/60" />
              )}
              <h3 className="font-bold text-lg leading-tight"># {room.name}</h3>
            </div>
            <p className="text-base-content/70 text-sm line-clamp-2 mb-2">
              {room.description}
            </p>
          </div>

          {/* Menu */}
          {canManage && (
            <div className="dropdown dropdown-end">
              <button 
                tabIndex={0} 
                className="btn btn-ghost btn-sm btn-circle"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreVertical size={16} />
              </button>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <button className="flex items-center gap-2">
                    <Edit3 size={14} />
                    Edit Room
                  </button>
                </li>
                <li>
                  <button className="flex items-center gap-2">
                    <Settings size={14} />
                    Room Settings
                  </button>
                </li>
                {isCreator && (
                  <li>
                    <button 
                      onClick={handleDeleteRoom}
                      className="flex items-center gap-2 text-error hover:bg-error/20"
                    >
                      <Trash2 size={14} />
                      Delete Room
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`badge badge-sm ${getCategoryInfo(room.category).color} border-0`}>
            {getCategoryInfo(room.category).label}
          </span>
          <span className={`badge badge-sm ${getDifficultyColor(room.difficulty)}`}>
            {room.difficulty.charAt(0).toUpperCase() + room.difficulty.slice(1)}
          </span>
          {room.tags && room.tags.map((tag, index) => (
            <span key={index} className="badge badge-ghost badge-sm">
              <Tag size={10} className="mr-1" />
              {tag}
            </span>
          ))}
        </div>

        {/* Creator & Members Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="avatar">
              <div className="w-6 h-6 rounded-full">
                <img 
                  src={room.createdBy.profilePic || "/default-avatar.png"} 
                  alt={room.createdBy.fullName}
                />
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isCreator && <Crown size={12} className="text-yellow-500" />}
              {isModerator && !isCreator && <Shield size={12} className="text-blue-500" />}
              <span className="text-sm text-base-content/70">
                {room.createdBy.fullName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-base-content/70">
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{room.members?.length || 0}/{room.maxMembers}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDistanceToNow(new Date(room.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>

        {/* Member Avatars */}
        {room.members && room.members.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-base-content/70">Members:</span>
            <div className="flex -space-x-2">
              {room.members.slice(0, 5).map((member, index) => (
                <div key={member._id} className="avatar">
                  <div className="w-6 h-6 rounded-full border-2 border-base-100">
                    <img 
                      src={member.profilePic || "/default-avatar.png"} 
                      alt={member.fullName}
                      title={member.fullName}
                    />
                  </div>
                </div>
              ))}
              {room.members.length > 5 && (
                <div className="w-6 h-6 rounded-full bg-base-300 border-2 border-base-100 flex items-center justify-center">
                  <span className="text-xs">+{room.members.length - 5}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {isMember ? (
            <>
              <button
                onClick={handleEnterRoom}
                className="btn btn-primary btn-sm flex-1"
              >
                <MessageCircle size={16} />
                Enter Room
              </button>
              <button
                onClick={handleLeaveRoom}
                className="btn btn-ghost btn-sm"
              >
                <UserMinus size={16} />
                Leave
              </button>
            </>
          ) : (
            <button
              onClick={handleJoinRoom}
              className="btn btn-primary btn-sm flex-1"
              disabled={isJoiningRoom || room.members?.length >= room.maxMembers}
            >
              {isJoiningRoom ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Joining...
                </>
              ) : room.members?.length >= room.maxMembers ? (
                'Room Full'
              ) : (
                <>
                  <UserPlus size={16} />
                  Join Room
                </>
              )}
            </button>
          )}
        </div>

        {/* Room Full Warning */}
        {room.members?.length >= room.maxMembers && !isMember && (
          <div className="alert alert-warning alert-sm mt-2">
            <span className="text-xs">This room is currently full</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;