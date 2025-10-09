import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import EditProfilePage from './pages/EditProfilePage'; // New import



import Sidebar from './components/common/Sidebar';
//import Sidebar from './components/common/SideBar';
import Navbar from './components/common/Navbar';
import DashboardPage from './pages/DashBoardPage';
import RoomsPage from './pages/RoomsPage';
import ProblemsPage from './pages/ProblemsPage';
import StudyPage from './pages/StudyPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

import ChatPage from './pages/ChatPage'; // New import


import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    // Only check auth if we're not in a development environment without backend
    checkAuth();
  }, [checkAuth]);

  // Show loading spinner while checking auth
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-300">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-base-content/70">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300">
      {authUser ? (
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/rooms" element={<RoomsPage />} />
                <Route path="/chat" element={<ChatPage />} /> {/* New chat route */}

                <Route path="/problems" element={<ProblemsPage />} />
                <Route path="/study" element={<StudyPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/edit" element={<EditProfilePage />} /> {/* New edit profile route */}

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
      <Toaster position="top-right" />
    </div>
  );
}

export default App;