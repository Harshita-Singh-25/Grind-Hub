// src/components/study/StudyTimer.jsx
import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { useStudyStore } from '../../store/useStudyStore';
import toast from 'react-hot-toast';

const StudyTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sessionType, setSessionType] = useState('study');
  const [notes, setNotes] = useState('');
  
  const { 
    currentSession, 
    startStudySession, 
    endStudySession, 
    fetchStudyStats,
    error 
  } = useStudyStore();

  const sessionTypes = [
    { value: 'study', label: 'General Study' },
    { value: 'problem-solving', label: 'Problem Solving' },
    { value: 'mock-interview', label: 'Mock Interview' },
    { value: 'peer-session', label: 'Peer Learning' }
  ];

  useEffect(() => {
    let interval = null;
    if (isActive && currentSession) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, currentSession]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    if (!currentSession) {
      try {
        const session = await startStudySession({
          type: sessionType,
          notes: notes.trim() || undefined
        });
        setIsActive(true);
        setSeconds(0);
        toast.success('Study session started!');
      } catch (error) {
        toast.error('Failed to start session');
      }
    } else {
      setIsActive(!isActive);
    }
  };

  const handleStop = async () => {
    if (!currentSession) {
      setIsActive(false);
      setSeconds(0);
      return;
    }

    try {
      const duration = Math.floor(seconds / 60); // Convert to minutes
      await endStudySession(currentSession._id, {
        duration,
        notes: notes.trim() || undefined,
        completed: true
      });
      
      setIsActive(false);
      setSeconds(0);
      setNotes('');
      toast.success(`Session completed! ${duration} minutes studied.`);
      fetchStudyStats(); // Refresh dashboard stats
    } catch (error) {
      toast.error('Failed to end session');
    }
  };

  const handleCancel = async () => {
    if (!currentSession) {
      setIsActive(false);
      setSeconds(0);
      return;
    }

    try {
      await endStudySession(currentSession._id, {
        duration: Math.floor(seconds / 60),
        notes: notes.trim() || undefined,
        completed: false
      });
      
      setIsActive(false);
      setSeconds(0);
      setNotes('');
      toast.success('Session cancelled');
    } catch (error) {
      toast.error('Failed to cancel session');
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="text-primary" size={24} />
          <div>
            <h2 className="text-2xl font-bold">Study Timer</h2>
            <p className="text-sm text-base-content/70">
              {currentSession ? 'Session in progress' : 'Ready to start studying?'}
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className="text-6xl font-mono font-bold text-primary mb-4">
            {formatTime(seconds)}
          </div>
          
          {currentSession && (
            <div className="badge badge-primary badge-lg">
              {sessionTypes.find(t => t.value === currentSession.type)?.label}
            </div>
          )}
        </div>

        {/* Session Configuration */}
        {!currentSession && (
          <div className="space-y-4 mb-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Session Type</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
              >
                {sessionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Notes (Optional)</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="What will you be studying today?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
              />
              <label className="label">
                <span className="label-text-alt text-base-content/50">
                  {notes.length}/500 characters
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Session Notes - Show during active session */}
        {currentSession && (
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text font-medium">Session Notes</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              placeholder="Add notes about your study session..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
            />
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-3 justify-center">
          {!currentSession || !isActive ? (
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleStart}
              disabled={!currentSession && !sessionType}
            >
              <Play size={20} />
              {currentSession ? 'Resume' : 'Start Session'}
            </button>
          ) : (
            <button className="btn btn-warning btn-lg" onClick={handleStart}>
              <Pause size={20} />
              Pause
            </button>
          )}

          {currentSession && (
            <>
              <button className="btn btn-success btn-lg" onClick={handleStop}>
                <Square size={20} />
                Complete
              </button>
              <button className="btn btn-error btn-outline" onClick={handleCancel}>
                Cancel
              </button>
            </>
          )}
        </div>

        {/* Session Info */}
        {currentSession && (
          <div className="bg-base-200 rounded-lg p-4 mt-6">
            <div className="text-sm text-base-content/70">
              <p><strong>Started:</strong> {new Date(currentSession.startTime).toLocaleTimeString()}</p>
              {currentSession.notes && (
                <p><strong>Initial Notes:</strong> {currentSession.notes}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyTimer;