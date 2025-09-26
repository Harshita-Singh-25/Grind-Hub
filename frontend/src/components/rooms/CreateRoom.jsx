import React, { useState } from 'react';
import { X, Lock, Globe, Users, Code, Monitor, Star, MessageCircle } from 'lucide-react';
import { useRoomStore } from '../../store/useRoomStore';
import { toast } from 'react-hot-toast';

const CreateRoom = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    difficulty: 'mixed',
    isPrivate: false,
    maxMembers: 50,
    tags: ''
  });

  const { createRoom, isCreatingRoom } = useRoomStore();

  const categories = [
    { value: 'algorithms', label: 'Algorithms & Data Structures', icon: Code },
    { value: 'system-design', label: 'System Design', icon: Monitor },
    { value: 'frontend', label: 'Frontend Development', icon: Globe },
    { value: 'backend', label: 'Backend Development', icon: Monitor },
    { value: 'general', label: 'General Discussion', icon: MessageCircle },
    { value: 'mock-interviews', label: 'Mock Interviews', icon: Star }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy', color: 'text-green-500' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
    { value: 'hard', label: 'Hard', color: 'text-red-500' },
    { value: 'mixed', label: 'Mixed', color: 'text-blue-500' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Room name and description are required');
      return;
    }

    if (formData.name.length < 3) {
      toast.error('Room name must be at least 3 characters long');
      return;
    }

    if (formData.description.length < 10) {
      toast.error('Description must be at least 10 characters long');
      return;
    }

    try {
      const roomData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        maxMembers: parseInt(formData.maxMembers)
      };

      await createRoom(roomData);
      onClose();
    } catch (error) {
      // Error is already handled in the store
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <h2 className="text-2xl font-bold">Create Study Room</h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            disabled={isCreatingRoom}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            {/* Room Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Room Name *</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., JavaScript Study Group"
                className="input input-bordered w-full"
                required
                maxLength={50}
                disabled={isCreatingRoom}
              />
              <label className="label">
                <span className="label-text-alt">{formData.name.length}/50 characters</span>
              </label>
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description *</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what this room is about, learning goals, etc."
                className="textarea textarea-bordered w-full h-24 resize-none"
                required
                maxLength={500}
                disabled={isCreatingRoom}
              />
              <label className="label">
                <span className="label-text-alt">{formData.description.length}/500 characters</span>
              </label>
            </div>
          </div>

          {/* Category & Difficulty */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Category</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="select select-bordered w-full"
                disabled={isCreatingRoom}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Difficulty Level</span>
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="select select-bordered w-full"
                disabled={isCreatingRoom}
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Room Settings</h3>
            
            {/* Privacy & Max Members */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Max Members */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Max Members</span>
                </label>
                <input
                  type="number"
                  name="maxMembers"
                  value={formData.maxMembers}
                  onChange={handleInputChange}
                  min="5"
                  max="100"
                  className="input input-bordered w-full"
                  disabled={isCreatingRoom}
                />
              </div>

              {/* Privacy Toggle */}
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text font-medium">
                    <div className="flex items-center gap-2">
                      {formData.isPrivate ? <Lock size={16} /> : <Globe size={16} />}
                      {formData.isPrivate ? 'Private Room' : 'Public Room'}
                    </div>
                  </span>
                  <input
                    type="checkbox"
                    name="isPrivate"
                    checked={formData.isPrivate}
                    onChange={handleInputChange}
                    className="toggle toggle-primary"
                    disabled={isCreatingRoom}
                  />
                </label>
                <label className="label">
                  <span className="label-text-alt">
                    {formData.isPrivate 
                      ? 'Only invited users can join' 
                      : 'Anyone can discover and join'
                    }
                  </span>
                </label>
              </div>
            </div>

            {/* Tags */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Tags (Optional)</span>
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="javascript, react, algorithms (comma-separated)"
                className="input input-bordered w-full"
                disabled={isCreatingRoom}
              />
              <label className="label">
                <span className="label-text-alt">Add tags to help others discover your room</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          {formData.name && formData.description && (
            <div className="bg-base-200 rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Room Preview:</h4>
              <div className="bg-base-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-bold"># {formData.name}</h5>
                  <div className="flex items-center gap-2">
                    {formData.isPrivate ? <Lock size={14} /> : <Globe size={14} />}
                    <Users size={14} />
                    <span className="text-sm">0/{formData.maxMembers}</span>
                  </div>
                </div>
                <p className="text-sm text-base-content/70 mb-2">{formData.description}</p>
                <div className="flex flex-wrap gap-1">
                  <span className="badge badge-outline badge-sm">
                    {categories.find(c => c.value === formData.category)?.label}
                  </span>
                  <span className={`badge badge-sm ${
                    formData.difficulty === 'easy' ? 'badge-success' :
                    formData.difficulty === 'medium' ? 'badge-warning' :
                    formData.difficulty === 'hard' ? 'badge-error' : 'badge-info'
                  }`}>
                    {formData.difficulty}
                  </span>
                  {formData.tags && formData.tags.split(',').map((tag, idx) => (
                    <span key={idx} className="badge badge-ghost badge-sm">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost flex-1"
              disabled={isCreatingRoom}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary flex-1"
              disabled={isCreatingRoom || !formData.name.trim() || !formData.description.trim()}
            >
              {isCreatingRoom ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating...
                </>
              ) : (
                'Create Room'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;