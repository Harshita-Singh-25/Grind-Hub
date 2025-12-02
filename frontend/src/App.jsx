import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import EditProfilePage from './pages/EditProfilePage';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/NavBar';
import DashboardPage from './pages/DashBoardPage';
import RoomsPage from './pages/RoomsPage';
import ProblemsPage from './pages/ProblemsPage';
import StudyPage from './pages/StudyPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ChatPage from './pages/ChatPage';
import LandingPage from './pages/LandingPage'; // Add this import

import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/problems" element={<ProblemsPage />} />
                <Route path="/study" element={<StudyPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/edit" element={<EditProfilePage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* Change this */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
      <Toaster position="top-right" />
    </div>
  );
}

export default App;