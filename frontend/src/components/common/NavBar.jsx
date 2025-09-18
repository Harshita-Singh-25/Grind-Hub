import React from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const Navbar = () => {
  const { authUser, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-6">
      <div className="flex-1">
        <div className="form-control">
          <div className="input-group">
            <span><Search size={20} /></span>
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="input input-bordered w-full max-w-md" 
            />
          </div>
        </div>
      </div>
      
      <div className="flex-none gap-4">
        {/* Notifications */}
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <Bell size={20} />
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>

        {/* User Menu */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img 
                src={authUser?.profilePic || '/default-avatar.png'} 
                alt="Profile" 
              />
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <div className="justify-between">
                <span>{authUser?.fullName}</span>
                <span className="badge badge-sm">{authUser?.role || 'Student'}</span>
              </div>
            </li>
            <li><a href="/profile">Profile</a></li>
            <li><a>Settings</a></li>
            <li><a onClick={handleLogout}><LogOut size={16} />Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
// import React, { useState, useEffect } from 'react';
// import { 
//   Bell, 
//   Search, 
//   MessageSquare, 
//   LogOut, 
//   User, 
//   Settings, 
//   Moon, 
//   Sun,
//   ChevronDown
// } from 'lucide-react';
// //import { useAuthStore } from '../store/useAuthStore';
// import { useAuthStore } from "../store/useAuthStore";

// const Navbar = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
  
//   const { authUser, logout } = useAuthStore();
  
//   // Toggle dark mode and update document class
//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [darkMode]);
  
//   // Mock notifications data
//   const notifications = [
//     {
//       id: 1,
//       title: 'Study Room Invitation',
//       message: 'You have been invited to join "Algorithm Masters" room',
//       time: '10 minutes ago',
//       read: false
//     },
//     {
//       id: 2,
//       title: 'Daily Goal Completed',
//       message: 'Congratulations! You completed your daily study goal',
//       time: '2 hours ago',
//       read: true
//     },
//     {
//       id: 3,
//       title: 'New Problem Added',
//       message: 'A new problem "Binary Tree Maximum Path Sum" was added to your favorites category',
//       time: '1 day ago',
//       read: true
//     }
//   ];
  
//   const unreadCount = notifications.filter(n => !n.read).length;
  
//   const handleLogout = () => {
//     logout();
//     setIsDropdownOpen(false);
//   };
  
//   const handleSearch = (e) => {
//     e.preventDefault();
//     // Implement search functionality
//     console.log('Searching for:', searchQuery);
//   };
  
//   return (
//     <div className="navbar bg-base-100 shadow-md px-6 py-4">
//       {/* Search Bar */}
//       <div className="flex-1">
//         <form onSubmit={handleSearch} className="relative max-w-md">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search rooms, problems, users..."
//               className="w-full pl-10 pr-4 py-2 rounded-lg border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/70" size={18} />
//           </div>
//         </form>
//       </div>
      
//       {/* Right Side Actions */}
//       <div className="flex-none gap-4">
//         {/* Dark Mode Toggle */}
//         <button 
//           className="btn btn-ghost btn-circle"
//           onClick={() => setDarkMode(!darkMode)}
//           aria-label="Toggle dark mode"
//         >
//           {darkMode ? <Sun size={20} /> : <Moon size={20} />}
//         </button>
        
//         {/* Messages Link */}
//         <button className="btn btn-ghost btn-circle" aria-label="Messages">
//           <div className="indicator">
//             <MessageSquare size={20} />
//             <span className="badge badge-xs badge-primary indicator-item"></span>
//           </div>
//         </button>
        
//         {/* Notifications */}
//         <div className="dropdown dropdown-end">
//           <button 
//             className="btn btn-ghost btn-circle"
//             onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
//             aria-label="Notifications"
//           >
//             <div className="indicator">
//               <Bell size={20} />
//               {unreadCount > 0 && (
//                 <span className="badge badge-xs badge-primary indicator-item">
//                   {unreadCount}
//                 </span>
//               )}
//             </div>
//           </button>
          
//           {isNotificationsOpen && (
//             <div className="mt-3 card card-compact dropdown-content w-80 bg-base-100 shadow-lg z-50">
//               <div className="card-body">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-bold text-lg">Notifications</h3>
//                   <button className="text-sm text-primary">Mark all as read</button>
//                 </div>
                
//                 <div className="max-h-96 overflow-y-auto">
//                   {notifications.length > 0 ? (
//                     <ul className="menu menu-compact">
//                       {notifications.map(notification => (
//                         <li key={notification.id} className={`border-b border-base-200 last:border-0 ${!notification.read ? 'bg-base-200/50' : ''}`}>
//                           <a className="py-3 px-2">
//                             <div>
//                               <p className="font-medium">{notification.title}</p>
//                               <p className="text-sm text-base-content/70">{notification.message}</p>
//                               <p className="text-xs text-base-content/50 mt-1">{notification.time}</p>
//                             </div>
//                           </a>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p className="text-center text-base-content/70 py-4">No notifications</p>
//                   )}
//                 </div>
                
//                 <div className="card-actions mt-2">
//                   <button className="btn btn-ghost btn-sm w-full">View all notifications</button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
        
//         {/* User Profile Dropdown */}
//         <div className="dropdown dropdown-end">
//           <button 
//             className="btn btn-ghost flex items-center gap-2"
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//           >
//             <div className="avatar">
//               <div className="w-8 rounded-full">
//                 <img 
//                   src={authUser?.profilePic || '/default-avatar.png'} 
//                   alt={authUser?.fullName || 'User'} 
//                 />
//               </div>
//             </div>
//             <span className="hidden md:inline">{authUser?.fullName || 'User'}</span>
//             <ChevronDown size={16} />
//           </button>
          
//           {isDropdownOpen && (
//             <ul className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 z-50">
//               <li>
//                 <a href="/profile" className="flex items-center">
//                   <User size={16} />
//                   <span>Profile</span>
//                 </a>
//               </li>
//               <li>
//                 <a href="/settings" className="flex items-center">
//                   <Settings size={16} />
//                   <span>Settings</span>
//                 </a>
//               </li>
//               <li>
//                 <button onClick={handleLogout} className="flex items-center text-error">
//                   <LogOut size={16} />
//                   <span>Logout</span>
//                 </button>
//               </li>
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;