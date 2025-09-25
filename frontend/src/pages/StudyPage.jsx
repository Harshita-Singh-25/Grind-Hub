import React, { useEffect } from 'react';
import StudyTimer from '../components/study/StudyTimer';
import StudyHistory from '../components/study/StudyHistory';
import DailyGoals from '../components/study/DailyGoals';
import { useStudyStore } from '../store/useStudyStore';

const StudyPage = () => {
  const { fetchStudyHistory, fetchDailyGoal } = useStudyStore();

  useEffect(() => {
    fetchStudyHistory();
    fetchDailyGoal();
  }, [fetchStudyHistory, fetchDailyGoal]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Study Session</h1>
          <p className="text-base-content/70 mt-1">
            Track your study time and manage your learning goals
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timer Section */}
        <div className="lg:col-span-2">
          <StudyTimer />
        </div>
        
        {/* Goals Sidebar */}
        <div className="space-y-6">
          <DailyGoals />
        </div>
      </div>

      {/* History Section */}
      <div className="w-full">
        <StudyHistory />
      </div>
    </div>
  );
};

export default StudyPage;