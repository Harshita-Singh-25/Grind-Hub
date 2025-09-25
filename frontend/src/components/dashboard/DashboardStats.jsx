// src/components/dashboard/DashboardStats.jsx
import React from 'react';

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
          <div className="card-body p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-base-content/70 text-sm font-medium mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-base-content/50 mt-1">
                  {stat.description}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor || 'bg-base-200'}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;