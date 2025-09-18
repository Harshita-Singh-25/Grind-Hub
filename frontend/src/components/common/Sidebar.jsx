// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { 
//   Home, 
//   MessageSquare, 
//   BookOpen, 
//   Target, 
//   User, 
//   Settings,
//   Trophy,
//   Users
// } from 'lucide-react';

// const Sidebar = () => {
//   const navItems = [
//     { name: 'Dashboard', icon: Home, path: '/' },
//     { name: 'Study Rooms', icon: MessageSquare, path: '/rooms' },
//     { name: 'Problems', icon: BookOpen, path: '/problems' },
//     { name: 'Study Session', icon: Target, path: '/study' },
//     { name: 'Mock Interviews', icon: Users, path: '/mock-interviews' },
//     { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
//     { name: 'Profile', icon: User, path: '/profile' },
//     { name: 'Settings', icon: Settings, path: '/settings' }
//   ];

//   return (
//     <div className="w-64 bg-base-200 min-h-screen p-4">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-primary">InterviewPrep</h1>
//         <p className="text-sm text-base-content/70">Level up your coding skills</p>
//       </div>
      
//       <nav className="space-y-2">
//         {navItems.map((item) => (
//           <NavLink
//             key={item.name}
//             to={item.path}
//             className={({ isActive }) =>
//               `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
//                 isActive 
//                   ? 'bg-primary text-primary-content' 
//                   : 'hover:bg-base-300'
//               }`
//             }
//           >
//             <item.icon size={20} />
//             <span>{item.name}</span>
//           </NavLink>
//         ))}
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  BookOpen, 
  Target, 
  User, 
  Settings,
  Trophy,
  Users
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Study Rooms', icon: MessageSquare, path: '/rooms' },
    { name: 'Problems', icon: BookOpen, path: '/problems' },
    { name: 'Study Session', icon: Target, path: '/study' },
    { name: 'Mock Interviews', icon: Users, path: '/mock-interviews' },
    { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' }
  ];

  return (
    <div className="w-64 bg-base-200 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">InterviewPrep</h1>
        <p className="text-sm text-base-content/70">Level up your coding skills</p>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-content' 
                  : 'hover:bg-base-300'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;