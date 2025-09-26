import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, Trophy, Target, Edit } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const ProfilePage = () => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Link to="/profile/edit" className="btn btn-primary gap-2">
          <Edit size={16} />
          Edit Profile
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6 text-center">
              <div className="avatar mb-4">
                <div className="w-24 rounded-full">
                  <img 
                    src={authUser?.profilePic || '/default-avatar.png'} 
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h2 className="text-xl font-bold">{authUser?.fullName}</h2>
              <p className="text-base-content/70 mb-4">{authUser?.email}</p>
              <div className="badge badge-primary">{authUser?.role || 'Student'}</div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6">
              <h3 className="text-lg font-bold mb-4">Account Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <User size={20} className="text-primary" />
                  <div>
                    <span className="text-sm text-base-content/70">Full Name</span>
                    <p className="font-medium">{authUser?.fullName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <Mail size={20} className="text-primary" />
                  <div>
                    <span className="text-sm text-base-content/70">Email</span>
                    <p className="font-medium">{authUser?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <Calendar size={20} className="text-primary" />
                  <div>
                    <span className="text-sm text-base-content/70">Member Since</span>
                    <p className="font-medium">{new Date(authUser?.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <Trophy size={20} className="text-primary" />
                  <div>
                    <span className="text-sm text-base-content/70">Current Streak</span>
                    <p className="font-medium">{authUser?.streak || 0} days</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <Target size={20} className="text-primary" />
                  <div>
                    <span className="text-sm text-base-content/70">Problems Solved</span>
                    <p className="font-medium">{authUser?.totalProblems || 0}</p>
                  </div>
                </div>
              </div>

              <div className="divider"></div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Account Status</div>
                  <div className="stat-value text-lg text-success">Active</div>
                </div>
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Profile Complete</div>
                  <div className="stat-value text-lg text-primary">100%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;