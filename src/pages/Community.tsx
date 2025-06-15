import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  Trophy, 
  Users, 
  Plus,
  Search,
  Filter,
  UserPlus,
  UserCheck
} from 'lucide-react';

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  type: 'achievement' | 'question' | 'discussion';
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface User {
  id: number;
  name: string;
  avatar: string;
  role: string;
  followers: number;
  following: number;
  isFollowing: boolean;
}

const Community: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'feed' | 'people'>('feed');
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState<'achievement' | 'question' | 'discussion'>('discussion');

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: {
        name: 'Alice Johnson',
        avatar: 'AJ',
        role: 'student'
      },
      content: '🎉 Just completed my first React project! Built a todo app with hooks and context. The feeling of seeing everything work together is amazing!',
      type: 'achievement',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      isLiked: false
    },
    {
      id: 2,
      author: {
        name: 'Bob Smith',
        avatar: 'BS',
        role: 'student'
      },
      content: 'Can someone help me understand the difference between useEffect and useLayoutEffect? I\'ve read the docs but still confused about when to use each one.',
      type: 'question',
      timestamp: '4 hours ago',
      likes: 12,
      comments: 15,
      isLiked: true
    },
    {
      id: 3,
      author: {
        name: 'Carol Davis',
        avatar: 'CD',
        role: 'student'
      },
      content: 'Starting my journey with Python today! Any recommendations for beginner-friendly projects? Looking for something practical that will help me learn the fundamentals.',
      type: 'discussion',
      timestamp: '1 day ago',
      likes: 18,
      comments: 22,
      isLiked: false
    }
  ]);

  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Emma Wilson',
      avatar: 'EW',
      role: 'student',
      followers: 156,
      following: 89,
      isFollowing: false
    },
    {
      id: 2,
      name: 'David Chen',
      avatar: 'DC',
      role: 'student',
      followers: 203,
      following: 145,
      isFollowing: false
    },
    {
      id: 3,
      name: 'Sarah Miller',
      avatar: 'SM',
      role: 'student',
      followers: 98,
      following: 67,
      isFollowing: true
    }
  ]);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleFollow = (userId: number) => {
    setSuggestedUsers(suggestedUsers.map(user =>
      user.id === userId
        ? { ...user, isFollowing: !user.isFollowing, followers: user.isFollowing ? user.followers - 1 : user.followers + 1 }
        : user
    ));
  };

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: posts.length + 1,
        author: {
          name: user?.name || 'Current User',
          avatar: user?.name?.charAt(0).toUpperCase() || 'U',
          role: user?.role || 'student'
        },
        content: newPost,
        type: postType,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        isLiked: false
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'from-yellow-400 to-orange-500';
      case 'question': return 'from-blue-400 to-blue-600';
      case 'discussion': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement': return Trophy;
      case 'question': return MessageCircle;
      case 'discussion': return Users;
      default: return MessageCircle;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Community</h1>
          <p className="text-white/70">Connect, share, and learn together</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-white/10 backdrop-blur-lg rounded-lg p-1 border border-white/20 w-fit">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'feed'
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveTab('people')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'people'
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            People
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'feed' && (
              <>
                {/* Create Post */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="mb-4">
                        <select
                          value={postType}
                          onChange={(e) => setPostType(e.target.value as any)}
                          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                        >
                          <option value="discussion" className="bg-gray-800">Discussion</option>
                          <option value="question" className="bg-gray-800">Question</option>
                          <option value="achievement" className="bg-gray-800">Achievement</option>
                        </select>
                      </div>
                      <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Share your thoughts, ask questions, or celebrate achievements..."
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={handleCreatePost}
                          disabled={!newPost.trim()}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Post</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Posts Feed */}
                <div className="space-y-4">
                  {posts.map((post) => {
                    const PostTypeIcon = getPostTypeIcon(post.type);
                    return (
                      <div key={post.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {post.author.avatar}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-white font-medium">{post.author.name}</h3>
                              <span className="text-white/60 text-sm">•</span>
                              <span className="text-white/60 text-sm capitalize">{post.author.role}</span>
                              <span className="text-white/60 text-sm">•</span>
                              <span className="text-white/60 text-sm">{post.timestamp}</span>
                              <div className={`px-2 py-1 bg-gradient-to-r ${getPostTypeColor(post.type)} rounded-full flex items-center space-x-1`}>
                                <PostTypeIcon className="w-3 h-3 text-white" />
                                <span className="text-white text-xs font-medium capitalize">{post.type}</span>
                              </div>
                            </div>
                            <p className="text-white/90 mb-4">{post.content}</p>
                            <div className="flex items-center space-x-6">
                              <button
                                onClick={() => handleLike(post.id)}
                                className={`flex items-center space-x-2 transition-colors ${
                                  post.isLiked ? 'text-red-400' : 'text-white/60 hover:text-red-400'
                                }`}
                              >
                                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                                <span className="text-sm">{post.likes}</span>
                              </button>
                              <button className="flex items-center space-x-2 text-white/60 hover:text-blue-400 transition-colors">
                                <MessageCircle className="w-5 h-5" />
                                <span className="text-sm">{post.comments}</span>
                              </button>
                              <button className="flex items-center space-x-2 text-white/60 hover:text-green-400 transition-colors">
                                <Share2 className="w-5 h-5" />
                                <span className="text-sm">Share</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {activeTab === 'people' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search people..."
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="p-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>

                {suggestedUsers.map((user) => (
                  <div key={user.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.avatar}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{user.name}</h3>
                          <p className="text-white/60 text-sm capitalize">{user.role}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-white/60 text-sm">{user.followers} followers</span>
                            <span className="text-white/60 text-sm">{user.following} following</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFollow(user.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          user.isFollowing
                            ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                        }`}
                      >
                        {user.isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                        <span>{user.isFollowing ? 'Following' : 'Follow'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Total Members</span>
                  <span className="text-white font-medium">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Posts Today</span>
                  <span className="text-white font-medium">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Active Now</span>
                  <span className="text-white font-medium">89</span>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-4">Trending Topics</h3>
              <div className="space-y-2">
                {['#ReactJS', '#JavaScript', '#Python', '#WebDev', '#Coding'].map((topic, index) => (
                  <button
                    key={index}
                    className="block w-full text-left px-3 py-2 text-blue-400 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-white/90">John liked your post</p>
                  <p className="text-white/60">2 minutes ago</p>
                </div>
                <div className="text-sm">
                  <p className="text-white/90">Sarah commented on your question</p>
                  <p className="text-white/60">5 minutes ago</p>
                </div>
                <div className="text-sm">
                  <p className="text-white/90">Mike started following you</p>
                  <p className="text-white/60">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;