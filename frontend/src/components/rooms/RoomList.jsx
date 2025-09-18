import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';

const RoomList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for now
  const mockRooms = [
    {
      _id: '1',
      name: 'JavaScript Algorithms',
      description: 'Practice JS algorithms and data structures',
      category: 'algorithms',
      difficulty: 'medium',
      members: [{ _id: '1' }, { _id: '2' }],
      createdBy: { fullName: 'John Doe', profilePic: '/default-avatar.png' }
    },
    {
      _id: '2',
      name: 'System Design Study',
      description: 'Learn system design concepts together',
      category: 'system-design',
      difficulty: 'hard',
      members: [{ _id: '1' }],
      createdBy: { fullName: 'Jane Smith', profilePic: '/default-avatar.png' }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Study Rooms</h1>
          <p className="text-base-content/70">Join or create study rooms for collaborative learning</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} />
          Create Room
        </button>
      </div>

      {/* Search */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-6">
          <div className="form-control">
            <div className="input-group">
              <span><Search size={20} /></span>
              <input
                type="text"
                placeholder="Search rooms..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockRooms.map(room => (
          <div key={room._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body p-6">
              <h3 className="text-xl font-bold mb-2">{room.name}</h3>
              <p className="text-base-content/70 mb-4">{room.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge badge-outline">{room.category}</span>
                <span className={`badge ${
                  room.difficulty === 'easy' ? 'badge-success' :
                  room.difficulty === 'medium' ? 'badge-warning' : 'badge-error'
                }`}>
                  {room.difficulty}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/70">
                  {room.members.length} members
                </span>
                <button className="btn btn-primary btn-sm">Join Room</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
// import React, { useState, useEffect } from 'react';
// import { Plus, Search, Filter } from 'lucide-react';
// import RoomCard from './RoomCard';
// import CreateRoom from './CreateRoom';
// import { useRoomStore } from '../../store/useRoomStore';

// const RoomList = () => {
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedDifficulty, setSelectedDifficulty] = useState('');

//   const { rooms, fetchRooms, isLoading } = useRoomStore();

//   const categories = ['algorithms', 'system-design', 'frontend', 'backend', 'general', 'mock-interviews'];
//   const difficulties = ['easy', 'medium', 'hard', 'mixed'];

//   useEffect(() => {
//     fetchRooms({ 
//       search: searchTerm, 
//       category: selectedCategory, 
//       difficulty: selectedDifficulty 
//     });
//   }, [searchTerm, selectedCategory, selectedDifficulty, fetchRooms]);

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold">Study Rooms</h1>
//           <p className="text-base-content/70">Join or create study rooms for collaborative learning</p>
//         </div>
//         <button 
//           className="btn btn-primary"
//           onClick={() => setShowCreateModal(true)}
//         >
//           <Plus size={20} />
//           Create Room
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="card bg-base-100 shadow-lg">
//         <div className="card-body p-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {/* Search */}
//             <div className="form-control">
//               <div className="input-group">
//                 <span><Search size={20} /></span>
//                 <input
//                   type="text"
//                   placeholder="Search rooms..."
//                   className="input input-bordered w-full"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Category Filter */}
//             <div className="form-control">
//               <select
//                 className="select select-bordered w-full"
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//               >
//                 <option value="">All Categories</option>
//                 {categories.map(cat => (
//                   <option key={cat} value={cat}>
//                     {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Difficulty Filter */}
//             <div className="form-control">
//               <select
//                 className="select select-bordered w-full"
//                 value={selectedDifficulty}
//                 onChange={(e) => setSelectedDifficulty(e.target.value)}
//               >
//                 <option value="">All Difficulties</option>
//                 {difficulties.map(diff => (
//                   <option key={diff} value={diff}>
//                     {diff.charAt(0).toUpperCase() + diff.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Rooms Grid */}
//       {isLoading ? (
//         <div className="flex justify-center py-12">
//           <span className="loading loading-spinner loading-lg"></span>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {rooms.map(room => (
//             <RoomCard key={room._id} room={room} />
//           ))}
//           {rooms.length === 0 && (
//             <div className="col-span-full text-center py-12">
//               <p className="text-base-content/70">No rooms found. Create one to get started!</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Create Room Modal */}
//       {showCreateModal && (
//         <CreateRoom onClose={() => setShowCreateModal(false)} />
//       )}
//     </div>
//   );
// };

// export default RoomList;