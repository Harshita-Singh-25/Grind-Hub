// import React, { useState, useEffect } from 'react';
// import { Play, Pause, Square, Clock, Target } from 'lucide-react';
// import { useStudyStore } from '../../store/useStudyStore';

// const StudyTimer = () => {
//   const [isActive, setIsActive] = useState(false);
//   const [seconds, setSeconds] = useState(0);
//   const [sessionType, setSessionType] = useState('study');
//   const [selectedProblem, setSelectedProblem] = useState('');
//   const [notes, setNotes] = useState('');

//   const { startStudySession, endStudySession, currentSession } = useStudyStore();

//   const sessionTypes = [
//     { value: 'study', label: 'General Study' },
//     { value: 'problem-solving', label: 'Problem Solving' },
//     { value: 'mock-interview', label: 'Mock Interview' },
//     { value: 'peer-session', label: 'Peer Learning' }
//   ];

//   useEffect(() => {
//     let interval = null;
//     if (isActive) {
//       interval = setInterval(() => {
//         setSeconds(seconds => seconds + 1);
//       }, 1000);
//     } else if (!isActive && seconds !== 0) {
//       clearInterval(interval);
//     }
//     return () => clearInterval(interval);
//   }, [isActive, seconds]);

//   const formatTime = (totalSeconds) => {
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const secs = totalSeconds % 60;
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const handleStart = async () => {
//     if (!isActive) {
//       const sessionData = {
//         type: sessionType,
//         problem: selectedProblem || undefined,
//         notes: notes
//       };
//       await startStudySession(sessionData);
//     }
//     setIsActive(!isActive);
//   };

//   const handleStop = async () => {
//     if (currentSession) {
//       await endStudySession(currentSession._id, {
//         duration: Math.floor(seconds / 60),
//         notes: notes,
//         completed: true
//       });
//     }
//     setIsActive(false);
//     setSeconds(0);
//     setNotes('');
//   };

//   const handlePause = () => {
//     setIsActive(false);
//   };

//   return (
//     <div className="card bg-base-100 shadow-lg">
//       <div className="card-body p-6">
//         <div className="flex items-center gap-3 mb-6">
//           <Clock className="text-primary" size={24} />
//           <h2 className="text-2xl font-bold">Study Timer</h2>
//         </div>

//         {/* Timer Display */}
//         <div className="text-center mb-8">
//           <div className="text-6xl font-mono font-bold text-primary mb-2">
//             {formatTime(seconds)}
//           </div>
//           <p className="text-base-content/70">
//             {isActive ? 'Session in progress...' : 'Ready to start studying?'}
//           </p>
//         </div>

//         {/* Session Configuration */}
//         <div className="space-y-4 mb-6">
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text font-medium">Session Type</span>
//             </label>
//             <select
//               className="select select-bordered w-full"
//               value={sessionType}
//               onChange={(e) => setSessionType(e.target.value)}
//               disabled={isActive}
//             >
//               {sessionTypes.map(type => (
//                 <option key={type.value} value={type.value}>
//                   {type.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {sessionType === 'problem-solving' && (
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-medium">Problem (optional)</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Problem name or link"
//                 className="input input-bordered w-full"
//                 value={selectedProblem}
//                 onChange={(e) => setSelectedProblem(e.target.value)}
//                 disabled={isActive}
//               />
//             </div>
//           )}

//           <div className="form-control">
//             <label className="label">
//               <span className="label-text font-medium">Notes</span>
//             </label>
//             <textarea
//               className="textarea textarea-bordered h-20"
//               placeholder="What are you working on today?"
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//             ></textarea>
//           </div>
//         </div>

//         {/* Control Buttons */}
//         <div className="flex gap-3 justify-center">
//           {!isActive ? (
//             <button
//               className="btn btn-primary btn-lg"
//               onClick={handleStart}
//             >
//               <Play size={20} />
//               Start Session
//             </button>
//           ) : (
//             <>
//               <button
//                 className="btn btn-warning btn-lg"
//                 onClick={handlePause}
//               >
//                 <Pause size={20} />
//                 Pause
//               </button>
//               <button
//                 className="btn btn-error btn-lg"
//                 onClick={handleStop}
//               >
//                 <Square size={20} />
//                 End Session
//               </button>
//             </>
//           )}
//         </div>

//         {/* Quick Stats */}
//         <div className="divider"></div>
//         <div className="grid grid-cols-2 gap-4 text-center">
//           <div>
//             <p className="text-2xl font-bold text-primary">
//               {Math.floor(seconds / 60)}
//             </p>
//             <p className="text-sm text-base-content/70">Minutes Today</p>
//           </div>
//           <div>
//             <p className="text-2xl font-bold text-secondary">
//               {sessionType === 'problem-solving' ? '1' : '0'}
//             </p>
//             <p className="text-sm text-base-content/70">Problems Attempted</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudyTimer;


import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';

const StudyTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sessionType, setSessionType] = useState('study');

  const sessionTypes = [
    { value: 'study', label: 'General Study' },
    { value: 'problem-solving', label: 'Problem Solving' },
    { value: 'mock-interview', label: 'Mock Interview' },
    { value: 'peer-session', label: 'Peer Learning' }
  ];

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsActive(!isActive);
  };

  const handleStop = () => {
    setIsActive(false);
    setSeconds(0);
  };

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="text-primary" size={24} />
          <h2 className="text-2xl font-bold">Study Timer</h2>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className="text-6xl font-mono font-bold text-primary mb-2">
            {formatTime(seconds)}
          </div>
          <p className="text-base-content/70">
            {isActive ? 'Session in progress...' : 'Ready to start studying?'}
          </p>
        </div>

        {/* Session Type */}
        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text font-medium">Session Type</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
            disabled={isActive}
          >
            {sessionTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3 justify-center">
          {!isActive ? (
            <button className="btn btn-primary btn-lg" onClick={handleStart}>
              <Play size={20} />
              Start Session
            </button>
          ) : (
            <>
              <button className="btn btn-warning btn-lg" onClick={handleStart}>
                <Pause size={20} />
                Pause
              </button>
              <button className="btn btn-error btn-lg" onClick={handleStop}>
                <Square size={20} />
                End Session
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;