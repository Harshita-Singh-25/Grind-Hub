import React from 'react';
import { Link } from 'react-router-dom';
import { Play, BookOpen, Target } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="text-primary" size={24} />
          <h2 className="text-xl font-bold">Quick Actions</h2>
        </div>

        <div className="space-y-4">
          <Link to="/study" className="btn btn-primary w-full gap-2">
            <Play size={18} />
            Start Study Session
          </Link>
          
          <Link to="/problems" className="btn btn-outline w-full gap-2">
            <BookOpen size={18} />
            Browse Problems
          </Link>
          
          <Link to="/rooms" className="btn btn-secondary w-full gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 4h4v4h-4V4zM4 4h4v4H4V4zM16 16h4v4h-4v-4zM4 16h4v4H4v-4zM10 4h4v4h-4V4zM10 10h4v4h-4v-4zM10 16h4v4h-4v-4z"/>
            </svg>
            Join Study Room
          </Link>
        </div>

        <div className="divider"></div>

        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-base-content/70">Recent Activity</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-base-content/60">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Last session completed</span>
            </div>
            <div className="flex items-center gap-2 text-base-content/60">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Problem solved today</span>
            </div>
            <div className="flex items-center gap-2 text-base-content/60">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Streak maintained</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;