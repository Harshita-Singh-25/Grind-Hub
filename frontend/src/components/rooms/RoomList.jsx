import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';
import RoomCard from './RoomCard';
import CreateRoom from './CreateRoom';
import { useRoomStore } from '../../store/useRoomStore';

const RoomList = ({ onRoomSelect }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { 
    rooms, 
    fetchRooms, 
    isLoading,
    subscribeToRoomEvents,
    unsubscribeFromRoomEvents 
  } = useRoomStore();

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'algorithms', label: 'Algorithms & Data Structures' },
    { value: 'system-design', label: 'System Design' },
    { value: 'frontend', label: 'Frontend Development' },
    { value: 'backend', label: 'Backend Development' },
    { value: 'general', label: 'General Discussion' },
    { value: 'mock-interviews', label: 'Mock Interviews' }
  ];

  const difficulties = [
    { value: '', label: 'All Difficulties' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'mixed', label: 'Mixed' }
  ];

  // Fetch rooms on component mount and when filters change
  useEffect(() => {
    fetchRooms({
      search: searchTerm,
      category: selectedCategory,
      difficulty: selectedDifficulty
    });
  }, [searchTerm, selectedCategory, selectedDifficulty, fetchRooms]);

  // Subscribe to room events on mount
  useEffect(() => {
    subscribeToRoomEvents();
    return () => unsubscribeFromRoomEvents();
  }, [subscribeToRoomEvents, unsubscribeFromRoomEvents]);

  // Debounced search
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchRooms({
        search: searchTerm,
        category: selectedCategory,
        difficulty: selectedDifficulty
      });
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const handleRefresh = () => {
    fetchRooms({
      search: searchTerm,
      category: selectedCategory,
      difficulty: selectedDifficulty
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDifficulty('');
  };

  const activeFiltersCount = [selectedCategory, selectedDifficulty].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Study Rooms</h1>
          <p className="text-base-content/70">
            Join or create study rooms for collaborative learning
            {rooms.length > 0 && ` • ${rooms.length} room${rooms.length === 1 ? '' : 's'} available`}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleRefresh}
            className="btn btn-ghost btn-sm"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={20} />
            Create Room
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-6">
          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <div className="form-control flex-1">
              <div className="input-group">
                <span><Search size={20} /></span>
                <input
                  type="text"
                  placeholder="Search rooms by name, description, or tags..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <button 
              className={`btn ${showFilters ? 'btn-active' : 'btn-ghost'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={20} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="badge badge-primary badge-sm ml-1">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="border-t border-base-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Category</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Difficulty</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                  >
                    {difficulties.map(diff => (
                      <option key={diff.value} value={diff.value}>
                        {diff.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">&nbsp;</span>
                  </label>
                  <button
                    className="btn btn-ghost"
                    onClick={clearFilters}
                    disabled={!activeFiltersCount}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-4 text-base-content/70">Loading rooms...</p>
          </div>
        </div>
      )}

      {/* Rooms Grid */}
      {!isLoading && (
        <>
          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => (
                <RoomCard 
                  key={room._id} 
                  room={room} 
                  onRoomSelect={onRoomSelect}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold mb-2">No rooms found</h3>
                <p className="text-base-content/70 mb-6">
                  {searchTerm || selectedCategory || selectedDifficulty
                    ? "Try adjusting your search criteria or filters."
                    : "Be the first to create a study room and start learning together!"
                  }
                </p>
                {(searchTerm || selectedCategory || selectedDifficulty) ? (
                  <button 
                    className="btn btn-ghost"
                    onClick={clearFilters}
                  >
                    Clear All Filters
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <Plus size={20} />
                    Create Your First Room
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Active Filters Display */}
      {(searchTerm || selectedCategory || selectedDifficulty) && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-base-content/70">Active filters:</span>
          {searchTerm && (
            <span className="badge badge-ghost">
              Search: "{searchTerm}"
            </span>
          )}
          {selectedCategory && (
            <span className="badge badge-ghost">
              Category: {categories.find(c => c.value === selectedCategory)?.label}
            </span>
          )}
          {selectedDifficulty && (
            <span className="badge badge-ghost">
              Difficulty: {difficulties.find(d => d.value === selectedDifficulty)?.label}
            </span>
          )}
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <CreateRoom onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default RoomList;