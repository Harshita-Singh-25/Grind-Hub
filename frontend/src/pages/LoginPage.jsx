import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import AuthLayout from '../components/auth/AuthLayout';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { login, isLoggingIn } = useAuthStore();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login(formData);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
    }
  };

  const handleDemoLogin = async () => {
    try {
      await login({
        email: 'demo@codecollab.com',
        password: 'demo123'
      });
      toast.success('Demo login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Demo login failed. Please try again.');
    }
  };

  return (
    <AuthLayout type="login">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-base-content/70">Sign in to continue your interview prep journey</p>
      </div>

  

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Email Address</span>
          </label>
          <div className="relative">
            <input
              type="email"
              className={`input input-bordered w-full pl-10 ${errors.email ? 'input-error' : ''}`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" size={20} />
          </div>
          {errors.email && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.email}</span>
            </label>
          )}
        </div>

        {/* Password Field */}
        <div className="form-control">
          <div className="flex justify-between items-center mb-2">
            <label className="label-text font-medium">Password</label>
            <Link to="/forgot-password" className="link link-primary text-sm">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className={`input input-bordered w-full pl-10 pr-12 ${errors.password ? 'input-error' : ''}`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" size={20} />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-xs"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.password}</span>
            </label>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="divider my-8">OR</div>


      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-base-content/70">
          New to CodeCollab?{' '}
          <Link to="/signup" className="link link-primary font-semibold">
            Create an account
          </Link>
        </p>
      </div>

      {/* Terms */}
      <p className="text-center text-sm text-base-content/50 mt-8">
        By signing in, you agree to our{' '}
        <a href="#" className="link">Terms of Service</a> and{' '}
        <a href="#" className="link">Privacy Policy</a>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;