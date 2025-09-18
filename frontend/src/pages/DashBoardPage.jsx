import React, { useEffect } from 'react';
import { Clock, Target, Trophy, BookOpen, TrendingUp } from 'lucide-react';
import DailyGoals from '../components/dashboard/DailyGoals';
import StudyStats from '../components/dashboard/StudyStats';
import RecentActivity from '../components/dashboard/RecentActivity';
import { useStudyStore } from '../store/useStudyStore';

const DashboardPage = () => {
  const { studyStats, fetchStudyStats } = useStudyStore();

  useEffect(() => {
    fetchStudyStats();
  }, [fetchStudyStats]);

  const stats = [
    {
      title: 'Daily Streak',
      value: studyStats?.streak || 0,
      icon: Trophy,
      color: 'text-orange-500'
    },
    {
      title: 'Problems Solved',
      value: studyStats?.totalProblems || 0,
      icon: BookOpen,
      color: 'text-blue-500'
    },
    {
      title: 'Study Hours Today',
      value: `${studyStats?.todayHours || 0}h`,
      icon: Clock,
      color: 'text-green-500'
    },
    {
      title: 'Current Level',
      value: studyStats?.currentLevel || 'Beginner',
      icon: TrendingUp,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
          <p className="text-base-content/70 mt-1">
            Ready to level up your interview skills?
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card bg-base-100 shadow-lg">
            <div className="card-body p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StudyStats />
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <DailyGoals />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;