import React from 'react';
import { TrendingUp, Clock, Target, Trophy } from 'lucide-react';

const StudyStats = () => {
  // Mock data
  const mockStats = {
    weeklyHours: [2, 3, 1, 4, 2, 3, 2],
    totalHours: 17,
    averageSession: 35,
    streak: 5
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="text-primary" size={24} />
          <h2 className="text-2xl font-bold">Study Statistics</h2>
        </div>

        {/* Weekly Chart */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">This Week's Progress</h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {mockStats.weeklyHours.map((hours, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div 
                  className="bg-primary rounded-t w-8 transition-all duration-300"
                  style={{ height: `${(hours / 4) * 100}%`, minHeight: hours > 0 ? '8px' : '2px' }}
                ></div>
                <span className="text-xs text-base-content/70">{days[index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="divider"></div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Clock className="text-blue-500" size={20} />
            <div>
              <div className="font-bold">{mockStats.totalHours}h</div>
              <div className="text-xs text-base-content/70">Total Hours</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Target className="text-green-500" size={20} />
            <div>
              <div className="font-bold">{mockStats.averageSession}min</div>
              <div className="text-xs text-base-content/70">Avg Session</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyStats;