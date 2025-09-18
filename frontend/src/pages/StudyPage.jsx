import React from 'react';
import StudyTimer from '../components/study/StudyTimer';
import StudyHistory from '../components/study/StudyHistory';

const StudyPage = () => {
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <StudyTimer />
      </div>
      <div>
        <StudyHistory />
      </div>
    </div>
  );
};

export default StudyPage;