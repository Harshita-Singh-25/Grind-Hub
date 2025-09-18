import React from 'react';
import { Clock, Calendar, Target } from 'lucide-react';

const StudyHistory = () => {
  // Mock data
  const mockSessions = [
    {
      _id: '1',
      type: 'problem-solving',
      duration: 45,
      createdAt: new Date().toISOString(),
      completed: true,
      notes: 'Worked on Two Sum problem'
    },
    {
      _id: '2',
      type: 'study',
      duration: 30,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      completed: true,
      notes: 'Reviewed binary trees'
    }
  ];

  const getSessionIcon = (type) => {
    switch(type) {
      case 'problem-solving': return '🔍';
      case 'study': return '📚';
      case 'mock-interview': return '🎤';
      case 'peer-session': return '👥';
      default: return '📝';
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-primary" size={24} />
          <h2 className="text-2xl font-bold">Study History</h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">75</div>
            <div className="text-xs text-base-content/70">Total Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">2</div>
            <div className="text-xs text-base-content/70">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">1</div>
            <div className="text-xs text-base-content/70">Problems</div>
          </div>
        </div>

        <div className="divider"></div>

        {/* Recent Sessions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Recent Sessions</h3>
          
          {mockSessions.map(session => (
            <div key={session._id} className="flex items-center gap-4 p-3 bg-base-200 rounded-lg">
              <div className="text-2xl">{getSessionIcon(session.type)}</div>
              <div className="flex-1">
                <div className="font-medium capitalize">
                  {session.type.replace('-', ' ')}
                </div>
                <div className="text-sm text-base-content/70">
                  {session.notes || 'No notes'}
                </div>
                <div className="text-xs text-base-content/50">
                  {new Date(session.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Clock size={14} />
                <span>{session.duration}min</span>
              </div>
            </div>
          ))}

          {mockSessions.length === 0 && (
            <div className="text-center py-8 text-base-content/70">
              <Target size={48} className="mx-auto mb-4 opacity-50" />
              <p>No study sessions yet. Start your first session!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyHistory;