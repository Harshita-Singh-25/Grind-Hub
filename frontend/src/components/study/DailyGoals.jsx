import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Edit2, 
  Check, 
  Plus, 
  Trash2, 
  Clock, 
  Flag, 
  CheckCircle2, 
  Circle,
  Timer,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useStudyStore } from '../../store/useStudyStore';
import toast from 'react-hot-toast';

const DailyGoals = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState('medium');
  const [newTodoTime, setNewTodoTime] = useState(30);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const { 
    dailyGoal, 
    studyStats, 
    updateDailyGoal, 
    fetchDailyGoal,
    addTodo,
    updateTodo,
    deleteTodo,
    error 
  } = useStudyStore();

  useEffect(() => {
    fetchDailyGoal();
  }, [fetchDailyGoal]);

  const progress = dailyGoal ? Math.min((dailyGoal.current / dailyGoal.target) * 100, 100) : 0;
  const todoProgress = dailyGoal ? Math.min((dailyGoal.completedTodos / dailyGoal.totalTodos) * 100, 100) : 0;

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

  const handleAddTodo = async () => {
    if (!newTodo.trim()) {
      toast.error('Please enter a todo item');
      return;
    }

    try {
      await addTodo({
        text: newTodo.trim(),
        priority: newTodoPriority,
        estimatedTime: newTodoTime
      });
      setNewTodo('');
      setNewTodoPriority('medium');
      setNewTodoTime(30);
      setShowAddForm(false);
      toast.success('Todo added successfully!');
    } catch (error) {
      toast.error('Failed to add todo');
    }
  };

  const handleToggleTodo = async (todoId, completed) => {
    try {
      await updateTodo(todoId, { completed });
      toast.success(completed ? 'Todo completed!' : 'Todo marked as incomplete');
    } catch (error) {
      toast.error('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await deleteTodo(todoId);
      toast.success('Todo deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete todo');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getMessage = () => {
    if (progress >= 100) return "Goal achieved! You're on fire! 🔥";
    if (progress >= 75) return "Almost there! You've got this! 💪";
    if (progress >= 50) return "Halfway there! Keep pushing! 🚀";
    if (progress >= 25) return "Great start! Building momentum! ⚡";
    return "Every minute counts towards your goals! ✨";
  };

  if (!dailyGoal) {
    return (
      <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-xl border-0">
        <div className="card-body p-6">
          <div className="flex items-center justify-center">
            <span className="loading loading-spinner loading-md text-primary"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-xl border-0">
      <div className="card-body p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Target className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Daily Goals</h2>
              <p className="text-sm text-base-content/70">Track your study progress</p>
            </div>
          </div>
          {!isEditing ? (
            <button 
              className="btn btn-ghost btn-sm hover:bg-primary/10"
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
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Today's Progress</span>
            <span className="font-semibold">
              {dailyGoal.current}min / {dailyGoal.target}min
            </span>
          </div>
          <div className="w-full bg-base-300 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary to-secondary rounded-full h-3 transition-all duration-500 ease-out"
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

        {/* Todo List Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-success" size={20} />
              <h3 className="font-semibold">Study Tasks</h3>
              <div className="badge badge-primary badge-sm">
                {dailyGoal.completedTodos}/{dailyGoal.totalTodos}
              </div>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus size={16} />
              Add Task
            </button>
          </div>

          {/* Add Todo Form */}
          {showAddForm && (
            <div className="bg-base-200 rounded-lg p-4 mb-4 border border-primary/20">
              <div className="space-y-3">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter your study task..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                />
                <div className="flex gap-2">
                  <select
                    className="select select-bordered select-sm"
                    value={newTodoPriority}
                    onChange={(e) => setNewTodoPriority(e.target.value)}
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <input
                      type="number"
                      className="input input-bordered input-sm w-20"
                      value={newTodoTime}
                      onChange={(e) => setNewTodoTime(Number(e.target.value))}
                      min="5"
                      max="480"
                    />
                    <span className="text-xs">min</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleAddTodo}
                  >
                    <Check size={16} />
                    Add Task
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Todo List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {dailyGoal.todos && dailyGoal.todos.length > 0 ? (
              dailyGoal.todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                    todo.completed 
                      ? 'bg-success/10 border-success/30 opacity-75' 
                      : 'bg-base-100 border-base-300 hover:border-primary/30'
                  }`}
                >
                  <button
                    className="btn btn-ghost btn-sm p-1"
                    onClick={() => handleToggleTodo(todo.id, !todo.completed)}
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="text-success" size={20} />
                    ) : (
                      <Circle className="text-base-content/50" size={20} />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className={`font-medium ${todo.completed ? 'line-through text-base-content/60' : ''}`}>
                      {todo.text}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-base-content/60">
                      <span className={getPriorityColor(todo.priority)}>
                        {getPriorityIcon(todo.priority)} {todo.priority}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Timer size={12} />
                        {todo.estimatedTime}min
                      </span>
                    </div>
                  </div>
                  
                  <button
                    className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-base-content/60">
                <Sparkles size={32} className="mx-auto mb-2 opacity-50" />
                <p>No tasks yet. Add your first study task!</p>
              </div>
            )}
          </div>
        </div>

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 text-center mb-4 border border-primary/20">
          <p className="text-sm font-medium text-primary">
            {getMessage()}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-base-200 rounded-lg">
            <div className="text-lg font-bold text-secondary flex items-center justify-center gap-1">
              <TrendingUp size={16} />
              {studyStats?.streak || 0}
            </div>
            <div className="text-xs text-base-content/70">Day Streak</div>
          </div>
          <div className="text-center p-3 bg-base-200 rounded-lg">
            <div className="text-lg font-bold text-accent flex items-center justify-center gap-1">
              <Target size={16} />
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