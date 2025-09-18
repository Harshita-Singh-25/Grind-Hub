import React, { useState } from 'react';
import { Plus, Search, Clock, Users, Star } from 'lucide-react';

const ProblemList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  // Mock data for now
  const mockProblems = [
    {
      _id: '1',
      title: 'Two Sum',
      description: 'Given an array of integers, return indices of two numbers that add up to target.',
      difficulty: 'easy',
      category: 'algorithms',
      tags: ['array', 'hash-table'],
      companies: ['Google', 'Amazon'],
      likes: 45,
      submissions: 120,
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: 'Valid Parentheses',
      description: 'Given a string containing just characters "(", ")", "{", "}", "[" and "]", determine if input is valid.',
      difficulty: 'easy',
      category: 'algorithms',
      tags: ['string', 'stack'],
      companies: ['Microsoft', 'Facebook'],
      likes: 32,
      submissions: 89,
      createdAt: new Date().toISOString()
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'badge-success';
      case 'medium': return 'badge-warning';
      case 'hard': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Practice Problems</h1>
          <p className="text-base-content/70">Sharpen your coding skills with curated problems</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} />
          Add Problem
        </button>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="form-control">
              <div className="input-group">
                <span><Search size={20} /></span>
                <input
                  type="text"
                  placeholder="Search problems..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="form-control">
              <select
                className="select select-bordered w-full"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Category placeholder */}
            <div className="form-control">
              <select className="select select-bordered w-full">
                <option value="">All Categories</option>
                <option value="algorithms">Algorithms</option>
                <option value="data-structures">Data Structures</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-4">
        {mockProblems.map(problem => (
          <div key={problem._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-base-content">{problem.title}</h3>
                    <span className={`badge ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-base-content/70 mb-4">
                    {problem.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="badge badge-outline">{problem.category}</span>
                    {problem.tags.map((tag, index) => (
                      <span key={index} className="badge badge-ghost text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-base-content/70">
                    <div className="flex items-center gap-1">
                      <Star size={16} />
                      <span>{problem.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{problem.submissions} submissions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button className="btn btn-primary btn-sm">
                    Solve
                  </button>
                  <button className="btn btn-ghost btn-sm">
                    <Star size={16} className="text-yellow-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemList;