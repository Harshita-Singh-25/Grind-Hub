import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Target, 
  BookOpen, 
  Code, 
  TrendingUp, 
  Clock,
  Shield,
  Trophy,
  MessageSquare,
  Calendar,
  Star,
  Award,
  ChevronRight,
  Zap,
  CheckCircle,
  BarChart3,
  Video,
  Lock
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(12800);

  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 10));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleFeatureClick = () => {
    navigate('/signup');
  };

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Curated DSA Problems",
      description: "Hand-picked coding questions categorized by topic and difficulty level",
      onClick: handleFeatureClick
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaborative Study Rooms",
      description: "Real-time coding sessions with peers, voice/text chat, and resource sharing",
      onClick: handleFeatureClick
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Daily Goal Tracker",
      description: "Built-in study timer and task manager to maintain consistency",
      onClick: handleFeatureClick
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Structured Discussions",
      description: "Topic-based discussions to learn collaboratively and clarify doubts",
      onClick: handleFeatureClick
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Friendly Competition",
      description: "Stay motivated through leaderboards and achievement badges",
      onClick: handleFeatureClick
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Progress Analytics",
      description: "Track your improvement with detailed performance insights",
      onClick: handleFeatureClick
    }
  ];

  const futureFeatures = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "Blockchain Skill Verification",
      description: "Tamper-proof digital certificates for verified skills",
      onClick: handleFeatureClick
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Mock Interview Platform",
      description: "Video chat for realistic interview practice",
      onClick: handleFeatureClick
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Virtual Hackathons",
      description: "Integrated coding events with real-time evaluation",
      onClick: handleFeatureClick
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Mobile App",
      description: "On-the-go access for continuous learning",
      onClick: handleFeatureClick
    }
  ];

  const testimonials = [
    {
      name: "Prachi Jha",
      role: "Creator • Full Stack Development ",
      text: "Created GrindHub to solve the isolation problem in technical interview preparation",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harshita"
    },
    {
      name: "Alex Chen",
      role: "Software Engineer @ Google",
      text: "The collaborative rooms made interview prep engaging instead of lonely. Landed my job in 2 months!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
    },
    {
      name: "Sarah Johnson",
      role: "Recent Bootcamp Grad",
      text: "From isolated prep to community learning. Got 3 offers with peer support on GrindHub.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-300">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-base-100/90 backdrop-blur-lg z-50 border-b border-base-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">GrindHub</h1>
                <p className="text-xs text-base-content/60">Peer Learning Platform</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
               <a href="#features" className="link link-hover font-medium">Features</a>
              <a href="#how-it-works" className="link link-hover font-medium">How It Works</a>
              <a href="#testimonials" className="link link-hover font-medium">Testimonials</a>
              <a href="#tech-stack" className="link link-hover font-medium">Technology</a>
            </div>
            
            <div className="flex items-center gap-4">
              <button onClick={handleLogin} className="btn btn-ghost">
                Sign In
              </button>
              <button onClick={handleSignup} className="btn btn-primary">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
        
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2">
              
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                From Isolated Study
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  To Collaborative Success
                </span>
              </h1>
              
              <p className="text-xl text-base-content/80 mb-8 max-w-2xl">
                GrindHub is a centralized, real-time peer learning platform that transforms 
                individual technical interview preparation into a collaborative, goal-oriented, 
                and engaging learning experience.
              </p>
              
              {/* Live Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
                <div className="stat bg-base-100 rounded-2xl p-4 shadow">
                  <div className="stat-title text-sm">Active Learners</div>
                  <div className="stat-value text-2xl">
                    <span className="countdown">
                      <span style={{'--value': Math.floor(userCount / 1000)}}></span>
                      <span style={{'--value': Math.floor((userCount % 1000) / 100)}}></span>
                      <span style={{'--value': Math.floor((userCount % 100) / 10)}}></span>
                      <span style={{'--value': userCount % 10}}></span>
                    </span>
                  </div>
                </div>
                <div className="stat bg-base-100 rounded-2xl p-4 shadow">
                  <div className="stat-title text-sm">Problems Solved</div>
                  <div className="stat-value text-2xl">500K+</div>
                </div>
                <div className="stat bg-base-100 rounded-2xl p-4 shadow">
                  <div className="stat-title text-sm">Study Rooms</div>
                  <div className="stat-value text-2xl">1.2K+</div>
                </div>
                <div className="stat bg-base-100 rounded-2xl p-4 shadow">
                  <div className="stat-title text-sm">Success Rate</div>
                  <div className="stat-value text-2xl">95%</div>
                </div>
              </div>
              
              
              <p className="text-sm text-base-content/60 mt-4">
                No credit card required • Join {userCount.toLocaleString()}+ developers
              </p>
            </div>
            
            {/* Right - App Preview */}
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="mockup-window border bg-base-200 shadow-2xl">
                  <div className="flex justify-center px-4 py-12 bg-base-300">
                    <div className="space-y-6 max-w-md">
                      {/* Mock Study Room */}
                      <div className="card bg-base-100 shadow-lg">
                        <div className="card-body p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="avatar placeholder">
                                <div className="bg-primary text-primary-content rounded-full w-10">
                                  <span>HS</span>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-bold">Harshita Singh</h3>
                                <p className="text-xs opacity-70">Solving: Dynamic Programming</p>
                              </div>
                            </div>
                            <button onClick={handleSignup} className="badge badge-primary cursor-pointer">
                              Live
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex -space-x-2">
                              {[1,2,3,4].map(i => (
                                <div key={i} className="avatar">
                                  <div className="w-8">
                                    <img 
                                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} 
                                      alt="Peer" 
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button onClick={handleSignup} className="btn btn-sm btn-primary cursor-pointer">
                              Join Room
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Stats */}
                      <div className="stats shadow bg-base-100">
                        <div className="stat">
                          <div className="stat-title">Daily Streak</div>
                          <div className="stat-value text-primary">42</div>
                          <div className="stat-desc">days</div>
                        </div>
                        <div className="stat">
                          <div className="stat-title">Problems</div>
                          <div className="stat-value text-secondary">156</div>
                          <div className="stat-desc">solved</div>
                        </div>
                      </div>
                      
                      {/* Problem Card */}
                      <div className="card bg-base-100 shadow">
                        <div className="card-body p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="card-title text-sm">Two Sum</h4>
                            <button onClick={handleSignup} className="badge badge-accent cursor-pointer">
                              Easy
                            </button>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              24 solving now
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              85% success rate
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section id="how-it-works" className="py-16 px-4 bg-base-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">The Problem We Solve</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Traditional interview preparation leaves developers isolated and unmotivated
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🚫",
                title: "Isolation in Prep",
                desc: "Students prepare in isolation with no peer support",
                onClick: handleSignup
              },
              {
                icon: "📉",
                title: "Lack of Motivation",
                desc: "Difficult to stay consistent without community",
                onClick: handleSignup
              },
              {
                icon: "🔀",
                title: "Fragmented Resources",
                desc: "Tools scattered across multiple platforms",
                onClick: handleSignup
              },
              {
                icon: "💬",
                title: "No Real-time Feedback",
                desc: "Missing instant help and collaborative spaces",
                onClick: handleSignup
              }
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95 cursor-pointer"
              >
                <div className="card-body items-center text-center">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="text-base-content/70">{item.desc}</p>
                  <div className="mt-4 text-primary text-sm flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Sign up to solve
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section  id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">GrindHub's Solution</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              A centralized platform transforming individual prep into collaborative success
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={feature.onClick}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95 cursor-pointer group"
              >
                <div className="card-body">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="card-title text-lg">{feature.title}</h3>
                  <p className="text-base-content/70">{feature.description}</p>
                  <div className="mt-4 pt-4 border-t border-base-300">
                    <span className="text-primary text-sm flex items-center gap-1">
                      Click to access
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="tech-stack" className="py-20 px-4 bg-base-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Technology Stack</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Built with modern technologies for scalability and performance
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "React.js", color: "bg-blue-500/10 text-blue-600", desc: "Frontend" },
              { name: "Node.js", color: "bg-green-500/10 text-green-600", desc: "Backend" },
              { name: "MongoDB", color: "bg-emerald-500/10 text-emerald-600", desc: "Database" },
              { name: "Socket.io", color: "bg-orange-500/10 text-orange-600", desc: "Real-time" },
              { name: "Tailwind CSS", color: "bg-cyan-500/10 text-cyan-600", desc: "Styling" },
              { name: "Zustand", color: "bg-purple-500/10 text-purple-600", desc: "State Management" },
              { name: "JWT", color: "bg-red-500/10 text-red-600", desc: "Authentication" },
              { name: "Vercel/Render", color: "bg-indigo-500/10 text-indigo-600", desc: "Deployment" }
            ].map((tech, index) => (
              <div key={index} className="card bg-base-100 shadow">
                <div className="card-body items-center text-center p-6">
                  <div className={`px-4 py-2 rounded-full ${tech.color} font-medium`}>
                    {tech.name}
                  </div>
                  <p className="text-sm text-base-content/70 mt-2">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          
        </div>
      </section>

    

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-base-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Join thousands who've transformed their interview prep with GrindHub
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img src={testimonial.avatar} alt={testimonial.name} />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-base-content/70">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="italic">"{testimonial.text}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-2xl">
            <div className="card-body py-16">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
                <Code className="w-10 h-10" />
              </div>
              <h2 className="text-4xl font-bold mb-6">Ready to Ace Your Interviews?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join GrindHub today and transform your isolated prep into collaborative success
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleSignup}
                  className="btn btn-lg bg-base-100 text-primary hover:bg-base-200"
                >
                  Start Free 14-Day Trial
                </button>
                <button 
                  onClick={handleLogin}
                  className="btn btn-lg btn-outline btn-primary-content"
                >
                  Sign In to Continue
                </button>
              </div>
              <p className="mt-6 text-sm opacity-80">
                Created by Harshita Singh • D15 C • Roll no: 70 • Department of Information Technology
              </p>
              <p className="text-sm opacity-80">
                Faculty: Mrs. Rupali Kale • Course: Full Stack Development (NITPL52)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-300 py-8 px-4 border-t border-base-content/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold">GrindHub</h3>
                <p className="text-xs text-base-content/60">Peer Learning Platform</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6 justify-center mb-4 md:mb-0">
              <button onClick={handleSignup} className="link link-hover font-medium">
                Sign Up
              </button>
              <button onClick={handleLogin} className="link link-hover font-medium">
                Sign In
              </button>
              <button onClick={handleFeatureClick} className="link link-hover font-medium">Features</button>
              <button onClick={handleFeatureClick} className="link link-hover font-medium">Technology</button>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-base-content/60">
                © 2024 GrindHub. All rights reserved.
              </p>
              <p className="text-xs text-base-content/50 mt-1">
                Created by Harshita Singh • D15 C • Roll no: 70
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;