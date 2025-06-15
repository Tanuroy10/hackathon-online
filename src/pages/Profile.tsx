import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Trophy, 
  Star,
  BookOpen,
  Code,
  Users,
  Award,
  Target,
  TrendingUp
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [newSkill, setNewSkill] = useState('');

  const handleSave = () => {
    if (editedUser) {
      updateProfile(editedUser);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && editedUser) {
      const updatedSkills = [...(editedUser.skills || []), newSkill.trim()];
      setEditedUser({ ...editedUser, skills: updatedSkills });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    if (editedUser) {
      const updatedSkills = editedUser.skills?.filter(skill => skill !== skillToRemove) || [];
      setEditedUser({ ...editedUser, skills: updatedSkills });
    }
  };

  const stats = [
    { label: 'Challenges Completed', value: '24', icon: Trophy, color: 'from-yellow-400 to-orange-500' },
    { label: 'Tests Passed', value: '18', icon: BookOpen, color: 'from-blue-400 to-blue-600' },
    { label: 'Code Sessions', value: '156', icon: Code, color: 'from-green-400 to-green-600' },
    { label: 'Community Posts', value: '12', icon: Users, color: 'from-purple-400 to-purple-600' },
  ];

  const achievements = [
    { title: 'First Steps', description: 'Completed your first coding challenge', icon: Trophy, earned: true },
    { title: 'Quick Learner', description: 'Passed 5 tests in a row', icon: Star, earned: true },
    { title: 'Code Warrior', description: 'Completed 10 coding challenges', icon: Award, earned: true },
    { title: 'Community Helper', description: 'Helped 5 students in the community', icon: Users, earned: false },
    { title: 'Perfect Score', description: 'Got 100% on any test', icon: Target, earned: false },
    { title: 'Streak Master', description: 'Maintained a 7-day learning streak', icon: TrendingUp, earned: false },
  ];

  const recentActivity = [
    { type: 'challenge', title: 'Completed "Array Manipulation" challenge', time: '2 hours ago', points: '+50 XP' },
    { type: 'test', title: 'Passed JavaScript Fundamentals test', time: '1 day ago', score: '92%' },
    { type: 'community', title: 'Posted in React Discussion', time: '2 days ago', engagement: '8 likes' },
    { type: 'skill', title: 'Added TypeScript to skills', time: '3 days ago', status: 'Updated' },
  ];

  if (!user) return null;

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editedUser?.name || ''}
                      onChange={(e) => setEditedUser(editedUser ? { ...editedUser, name: e.target.value } : null)}
                      className="text-2xl font-bold bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      value={editedUser?.email || ''}
                      onChange={(e) => setEditedUser(editedUser ? { ...editedUser, email: e.target.value } : null)}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                    <div className="flex items-center space-x-4 text-white/70">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span className="capitalize">{user.role}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-6">
            <h3 className="text-white font-medium mb-2">About</h3>
            {isEditing ? (
              <textarea
                value={editedUser?.bio || ''}
                onChange={(e) => setEditedUser(editedUser ? { ...editedUser, bio: e.target.value } : null)}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            ) : (
              <p className="text-white/80">
                {user.bio || 'No bio added yet. Click edit to add one!'}
              </p>
            )}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {(editedUser?.skills || user.skills || []).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                >
                  <span>{skill}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-blue-300 hover:text-red-300 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    {activity.type === 'challenge' && <Trophy className="w-4 h-4 text-white" />}
                    {activity.type === 'test' && <BookOpen className="w-4 h-4 text-white" />}
                    {activity.type === 'community' && <Users className="w-4 h-4 text-white" />}
                    {activity.type === 'skill' && <Star className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-white/60 text-xs">{activity.time}</p>
                      <p className="text-white/80 text-xs">
                        {activity.points || activity.score || activity.engagement || activity.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-white font-semibold mb-6">Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  achievement.earned
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50'
                    : 'bg-white/5 border-white/20'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achievement.earned
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                      : 'bg-white/20'
                  }`}>
                    <achievement.icon className="w-4 h-4 text-white" />
                  </div>
                  <h4 className={`font-medium ${
                    achievement.earned ? 'text-yellow-300' : 'text-white/60'
                  }`}>
                    {achievement.title}
                  </h4>
                </div>
                <p className={`text-sm ${
                  achievement.earned ? 'text-white/90' : 'text-white/50'
                }`}>
                  {achievement.description}
                </p>
                {achievement.earned && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">
                      ✓ Earned
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;