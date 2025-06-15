import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Code, 
  BookOpen, 
  Users, 
  FileText, 
  Trophy, 
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Challenges Completed', value: '12', icon: Trophy, color: 'from-yellow-400 to-orange-500' },
    { label: 'Tests Taken', value: '8', icon: BookOpen, color: 'from-blue-400 to-blue-600' },
    { label: 'Community Posts', value: '5', icon: Users, color: 'from-green-400 to-green-600' },
    { label: 'Hours Coding', value: '24', icon: Clock, color: 'from-purple-400 to-purple-600' },
  ];

  const recentActivity = [
    { type: 'challenge', title: 'Completed Array Sorting Challenge', time: '2 hours ago', points: '+50 points' },
    { type: 'test', title: 'JavaScript Fundamentals Test', time: '1 day ago', score: '85%' },
    { type: 'community', title: 'Posted about React Hooks', time: '2 days ago', likes: '12 likes' },
    { type: 'resume', title: 'Updated Resume Template', time: '3 days ago', status: 'Draft saved' },
  ];

  const quickActions = [
    {
      title: 'Code Editor',
      description: 'Practice coding with our interactive editor',
      icon: Code,
      link: '/code',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Take a Test',
      description: 'Test your knowledge with MCQ quizzes',
      icon: BookOpen,
      link: '/tests',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Community',
      description: 'Connect with fellow students',
      icon: Users,
      link: '/community',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Resume Builder',
      description: 'Create your professional resume',
      icon: FileText,
      link: '/resume',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-white/70">
              Ready to continue your learning journey? Let's make today productive!
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="group bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">{action.title}</h3>
              <p className="text-white/60 text-sm">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className={`p-4 flex items-center justify-between ${
                index !== recentActivity.length - 1 ? 'border-b border-white/10' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {activity.type === 'challenge' && <Trophy className="w-4 h-4 text-white" />}
                  {activity.type === 'test' && <BookOpen className="w-4 h-4 text-white" />}
                  {activity.type === 'community' && <Users className="w-4 h-4 text-white" />}
                  {activity.type === 'resume' && <FileText className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <p className="text-white font-medium">{activity.title}</p>
                  <p className="text-white/60 text-sm">{activity.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">
                  {activity.points || activity.score || activity.likes || activity.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Showcase */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Latest Achievement</h2>
          <Star className="w-6 h-6 text-yellow-400" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Code Warrior</h3>
            <p className="text-white/70">Completed 10 coding challenges in a row!</p>
            <p className="text-white/60 text-sm">Earned 2 days ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;