import React, { useEffect } from 'react';
import { Clock, Target, Trophy, BookOpen, TrendingUp } from 'lucide-react';
import DashboardStats from '../components/dashboard/DashboardStats';
import WeeklyProgress from '../components/dashboard/WeeklyProgress';
import QuickActions from '../components/dashboard/QuickActions';
import { useStudyStore } from '../store/useStudyStore';

const DashboardPage = () => {
  const { studyStats, fetchStudyStats, isLoading, error } = useStudyStore();

  useEffect(() => {
    fetchStudyStats();
  }, [fetchStudyStats]);

  if (isLoading && !studyStats) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <span>Error loading dashboard: {error}</span>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Daily Streak',
      value: studyStats?.streak || 0,
      icon: Trophy,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      description: 'Consecutive study days'
    },
    {
      title: 'Problems Solved',
      value: studyStats?.totalProblems || 0,
      icon: BookOpen,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      description: 'Total problems completed'
    },
    {
      title: 'Study Hours Today',
      value: `${studyStats?.todayHours || 0}h`,
      icon: Clock,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      description: 'Time studied today'
    },
    {
      title: 'Current Level',
      value: studyStats?.currentLevel || 'Beginner',
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      description: 'Based on problem count'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-base-content/70 mt-1">
            Ready to level up your interview skills?
          </p>
        </div>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <WeeklyProgress weeklyData={studyStats?.weeklyProgress} />
        </div>
        <div className="space-y-6">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;