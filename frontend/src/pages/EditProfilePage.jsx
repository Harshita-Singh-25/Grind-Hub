import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Camera, ArrowLeft, Save } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || '',
    email: authUser?.email || '',
  });
  const [selectedImg, setSelectedImg] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
    };

    reader.onerror = () => {
      toast.error('Error reading file');
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email');
      return;
    }

    try {
      const updateData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
      };

      // Add profile picture if selected
      if (selectedImg) {
        updateData.profilePic = selectedImg;
      }

      await updateProfile(updateData);
      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/profile')}
          className="btn btn-ghost btn-circle"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold">Edit Profile</h1>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="avatar">
                  <div className="w-32 h-32 rounded-full">
                    <img
                      src={selectedImg || authUser?.profilePic || '/default-avatar.png'}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 btn btn-primary btn-circle btn-sm cursor-pointer ${
                    isUpdatingProfile ? 'loading' : ''
                  }`}
                >
                  {!isUpdatingProfile && <Camera size={16} />}
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-base-content/70 text-center">
                Click the camera icon to update your photo
                <br />
                <span className="text-xs">Max size: 5MB</span>
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Full Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    <User size={16} className="inline mr-2" />
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  className="input input-bordered"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={isUpdatingProfile}
                  required
                />
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    <Mail size={16} className="inline mr-2" />
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="input input-bordered"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isUpdatingProfile}
                  required
                />
              </div>
            </div>

            {/* Account Info Display */}
            <div className="divider">Account Information</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Member Since</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={new Date(authUser?.createdAt).toLocaleDateString()}
                  disabled
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Account Status</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value="Active"
                  disabled
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-6">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate('/profile')}
                disabled={isUpdatingProfile}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;