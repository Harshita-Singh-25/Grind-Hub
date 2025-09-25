// src/components/dashboard/WeeklyProgress.jsx
import React from 'react';
import { Calendar } from 'lucide-react';

const WeeklyProgress = ({ weeklyData = [] }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxHours = Math.max(...weeklyData, 1);

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-primary" size={24} />
          <div>
            <h2 className="text-xl font-bold">Weekly Progress</h2>
            <p className="text-sm text-base-content/70">Your study hours this week</p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-3 h-40 mb-4">
          {weeklyData.map((hours, index) => (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full bg-base-200 rounded-t-lg flex flex-col justify-end min-h-24">
                <div 
                  className="bg-primary rounded-t-lg w-full transition-all duration-500 ease-out min-h-1"
                  style={{ 
                    height: `${maxHours > 0 ? (hours / maxHours) * 100 : 0}%`,
                  }}
                  title={`${hours}h on ${days[index]}`}
                ></div>
              </div>
              <span className="text-xs text-base-content/70 font-medium">{days[index]}</span>
              <span className="text-xs text-primary font-bold">{hours}h</span>
            </div>
          ))}
        </div>

        <div className="stats stats-horizontal w-full bg-base-200/50">
          <div className="stat place-items-center py-2">
            <div className="stat-value text-sm text-primary">
              {weeklyData.reduce((a, b) => a + b, 0).toFixed(1)}h
            </div>
            <div className="stat-title text-xs">Total Week</div>
          </div>
          <div className="stat place-items-center py-2">
            <div className="stat-value text-sm text-secondary">
              {(weeklyData.reduce((a, b) => a + b, 0) / 7).toFixed(1)}h
            </div>
            <div className="stat-title text-xs">Daily Average</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyProgress;