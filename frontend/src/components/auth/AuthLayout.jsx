import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Sparkles, CheckCircle } from 'lucide-react';

const AuthLayout = ({ children, type = 'login' }) => {
  const features = [
    "Real-time collaborative coding",
    "500+ curated problems",
    "AI-powered mock interviews",
    "Progress tracking & analytics",
    "Study group matching",
    "Interview success guarantee"
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Auth Form */}
      <div className="flex flex-col justify-center p-6 sm:p-12 lg:p-20">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold">CodeCollab</span>
          </Link>

          {children}
        </div>
      </div>

      {/* Right Side - App Preview */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
        <div className="relative z-10 max-w-lg mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Interview Prep. Redefined.</span>
            </div>
            
            <h2 className="text-4xl font-bold mb-4">
              Join the #1 Platform for
              <span className="block text-primary">Tech Interview Prep</span>
            </h2>
            
            <p className="text-lg text-base-content/70 mb-8">
              Thousands of developers have landed their dream jobs using CodeCollab. 
              Start your journey today.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-base-content/80">{feature}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">10K+</div>
              <div className="text-sm text-base-content/70">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">500+</div>
              <div className="text-sm text-base-content/70">Problems</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">95%</div>
              <div className="text-sm text-base-content/70">Success Rate</div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <p className="italic mb-4">
                "CodeCollab's collaborative approach cut my interview prep time in half. 
                Landed offers from Google and Meta within 3 months!"
              </p>
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica" alt="avatar" />
                  </div>
                </div>
                <div>
                  <div className="font-bold">Jessica Miller</div>
                  <div className="text-sm text-base-content/70">Software Engineer @ Google</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default AuthLayout;