import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Star, Clock, Users } from 'lucide-react';
import ProblemCard from './ProblemCard';
import CreateProblem from './CreateProblem';
import { useProblemStore } from '../../store/useProblemStore';

const ProblemList = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const { problems, fetchProblems, isLoading } = useProblemStore();

  const difficulties = ['easy', 'medium', 'hard'];
  const categories = ['algorithms', 'data-structures', 'system-design', 'frontend', 'backend'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'difficulty', label: 'By Difficulty' },
    { value: 'popular', label: 'Most Popular' }
  ];

  useEffect(() => {
    fetchProblems({
      search: searchTerm,
      difficulty: selectedDifficulty,
      category: selectedCategory,
      sortBy
    });
  }, [searchTerm, selectedDifficulty, selectedCategory, sortBy, fetchProblems]);

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
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={20} />
          Add Problem
        </button>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="form-control">
              <select
                className="select select-bordered w-full"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="form-control">
              <select
                className="select select-bordered w-full"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Problems List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="space-y-4">
          {problems.map(problem => (
            <ProblemCard key={problem._id} problem={problem} />
          ))}
          {problems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-base-content/70">No problems found. Add some to get started!</p>
            </div>
          )}
        </div>
      )}

      {/* Create Problem Modal */}
      {showCreateModal && (
        <CreateProblem onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default ProblemList;