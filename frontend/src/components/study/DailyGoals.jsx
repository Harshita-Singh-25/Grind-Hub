import React, { useState, useEffect } from 'react';
import { Target, Edit2, Check } from 'lucide-react';
import { useStudyStore } from '../../store/useStudyStore';
import toast from 'react-hot-toast';

const DailyGoals = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  
  const { 
    dailyGoal, 
    studyStats, 
    updateDailyGoal, 
    fetchDailyGoal,
    error 
  } = useStudyStore();

  useEffect(() => {
    fetchDailyGoal();
  }, [fetchDailyGoal]);

  const progress = dailyGoal ? Math.min((dailyGoal.current / dailyGoal.target) * 100, 100) : 0;

  const handleUpdateGoal = async () => {
    const target = Number(newGoal);
    if (target && target >= 5 && target <= 480) {
      try {
        await updateDailyGoal(target);
        setIsEditing(false);
        setNewGoal('');
        toast.success('Daily goal updated!');
      } catch (error) {
        toast.error('Failed to update goal');
      }
    } else {
      toast.error('Goal must be between 5 and 480 minutes');
    }
  };

  const getMessage = () => {
    if (progress >= 100) return "Goal achieved! You're on fire!";
    if (progress >= 75) return "Almost there! You've got this!";
    if (progress >= 50) return "Halfway there! Keep pushing!";
    if (progress >= 25) return "Great start! Building momentum!";
    return "Every minute counts towards your goals!";
  };

  if (!dailyGoal) {
    return (
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-6">
          <div className="flex items-center justify-center">
            <span className="loading loading-spinner loading-md text-primary"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="text-primary" size={24} />
            <h2 className="text-xl font-bold">Daily Goal</h2>
          </div>
          {!isEditing ? (
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setIsEditing(true);
                setNewGoal(dailyGoal.target.toString());
              }}
            >
              <Edit2 size={16} />
            </button>
          ) : (
            <button 
              className="btn btn-primary btn-sm"
              onClick={handleUpdateGoal}
            >
              <Check size={16} />
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span className="text-xs">{error}</span>
          </div>
        )}

        {/* Goal Display/Edit */}
        <div className="mb-6">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="input input-bordered input-sm w-20"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                min="5"
                max="480"
                placeholder="60"
              />
              <span className="text-sm">minutes per day</span>
            </div>
          ) : (
            <div className="text-2xl font-bold">
              {dailyGoal.target} <span className="text-base font-normal">minutes/day</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Today's Progress</span>
            <span className="font-semibold">
              {dailyGoal.current}min / {dailyGoal.target}min
            </span>
          </div>
          <div className="w-full bg-base-300 rounded-full h-3">
            <div 
              className="bg-primary rounded-full h-3 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-center mt-2">
            <span className={`text-sm font-semibold ${
              progress >= 100 ? 'text-success' : 'text-primary'
            }`}>
              {Math.round(progress)}% Complete
            </span>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="bg-primary/10 rounded-lg p-4 text-center mb-4">
          <p className="text-sm font-medium text-primary">
            {getMessage()}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-secondary">
              {studyStats?.streak || 0}
            </div>
            <div className="text-xs text-base-content/70">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-accent">
              {studyStats?.totalProblems || 0}
            </div>
            <div className="text-xs text-base-content/70">Problems Solved</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyGoals;