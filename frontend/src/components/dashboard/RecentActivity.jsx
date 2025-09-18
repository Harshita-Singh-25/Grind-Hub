import React from 'react';
import { Clock, BookOpen, Code, CheckCircle } from 'lucide-react';

const RecentActivity = () => {
  // Mock data for recent activity
  const activities = [
    {
      id: 1,
      type: 'study',
      title: 'Completed study session',
      description: 'Focused on algorithms for 45 minutes',
      time: '2 hours ago',
      icon: Clock,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'problem',
      title: 'Solved problem',
      description: 'Binary Tree Level Order Traversal',
      time: '4 hours ago',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'room',
      title: 'Joined study room',
      description: 'Data Structures & Algorithms group',
      time: '6 hours ago',
      icon: BookOpen,
      color: 'text-purple-500'
    },
    {
      id: 4,
      type: 'problem',
      title: 'Attempted problem',
      description: 'Two Sum solution submitted',
      time: '1 day ago',
      icon: Code,
      color: 'text-orange-500'
    }
  ];

  const getActivityIcon = (activity) => {
    const IconComponent = activity.icon;
    return <IconComponent className={`w-5 h-5 ${activity.color}`} />;
  };

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="text-primary" size={24} />
          <h2 className="text-2xl font-bold">Recent Activity</h2>
        </div>
        
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg bg-base-200/50">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-base-content">{activity.title}</h3>
                <p className="text-sm text-base-content/70">{activity.description}</p>
                <p className="text-xs text-base-content/50 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-8">
            <p className="text-base-content/70">No recent activity yet</p>
            <p className="text-sm text-base-content/50 mt-1">Start studying to see your activity here</p>
          </div>
        )}

        <div className="card-actions mt-4">
          <button className="btn btn-ghost btn-sm w-full">View all activity</button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;