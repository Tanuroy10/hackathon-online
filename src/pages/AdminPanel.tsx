import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X,
  Search,
  Filter,
  BarChart3,
  Settings,
  Shield
} from 'lucide-react';

interface Question {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  joinDate: string;
  lastActive: string;
  testsCompleted: number;
  averageScore: number;
}

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'users' | 'settings'>('overview');
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [newQuestion, setNewQuestion] = useState<Omit<Question, 'id'>>({
    subject: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    difficulty: 'Easy',
    explanation: ''
  });

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      subject: 'JavaScript',
      question: 'What is the correct way to declare a variable in JavaScript?',
      options: ['var myVar = 5;', 'variable myVar = 5;', 'v myVar = 5;', 'declare myVar = 5;'],
      correctAnswer: 0,
      difficulty: 'Easy',
      explanation: 'In JavaScript, variables are declared using var, let, or const keywords.'
    },
    {
      id: '2',
      subject: 'React',
      question: 'What is JSX?',
      options: ['A JavaScript library', 'A syntax extension for JavaScript', 'A CSS framework', 'A database'],
      correctAnswer: 1,
      difficulty: 'Medium',
      explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in React.'
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'student',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
      testsCompleted: 12,
      averageScore: 87
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'student',
      joinDate: '2024-02-20',
      lastActive: '1 day ago',
      testsCompleted: 8,
      averageScore: 92
    }
  ]);

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-8 text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-white/70">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const handleAddQuestion = () => {
    if (newQuestion.question && newQuestion.subject) {
      const question: Question = {
        ...newQuestion,
        id: Date.now().toString()
      };
      setQuestions([...questions, question]);
      setNewQuestion({
        subject: '',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        difficulty: 'Easy',
        explanation: ''
      });
      setIsAddingQuestion(false);
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
  };

  const handleUpdateQuestion = () => {
    if (editingQuestion) {
      setQuestions(questions.map(q => q.id === editingQuestion.id ? editingQuestion : q));
      setEditingQuestion(null);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'from-green-400 to-green-600';
      case 'Medium': return 'from-yellow-400 to-orange-500';
      case 'Hard': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const stats = [
    { label: 'Total Users', value: '1,247', icon: Users, color: 'from-blue-400 to-blue-600' },
    { label: 'Total Questions', value: questions.length.toString(), icon: BookOpen, color: 'from-green-400 to-green-600' },
    { label: 'Tests Taken', value: '3,456', icon: BarChart3, color: 'from-purple-400 to-purple-600' },
    { label: 'Average Score', value: '84%', icon: BarChart3, color: 'from-yellow-400 to-orange-500' },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-white/70">Manage questions, users, and platform settings</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-white/10 backdrop-blur-lg rounded-lg p-1 border border-white/20 w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'questions', label: 'Questions', icon: BookOpen },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
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

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white">New user registered: Alice Johnson</span>
                  <span className="text-white/60 text-sm">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white">Question added to JavaScript category</span>
                  <span className="text-white/60 text-sm">4 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white">Test completed by Bob Smith (Score: 95%)</span>
                  <span className="text-white/60 text-sm">6 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="" className="bg-gray-800">All Subjects</option>
                  <option value="javascript" className="bg-gray-800">JavaScript</option>
                  <option value="react" className="bg-gray-800">React</option>
                  <option value="python" className="bg-gray-800">Python</option>
                </select>
              </div>
              <button
                onClick={() => setIsAddingQuestion(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>

            {/* Add/Edit Question Modal */}
            {(isAddingQuestion || editingQuestion) && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-white font-semibold mb-4">
                  {isAddingQuestion ? 'Add New Question' : 'Edit Question'}
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Subject</label>
                      <input
                        type="text"
                        value={isAddingQuestion ? newQuestion.subject : editingQuestion?.subject || ''}
                        onChange={(e) => {
                          if (isAddingQuestion) {
                            setNewQuestion({ ...newQuestion, subject: e.target.value });
                          } else if (editingQuestion) {
                            setEditingQuestion({ ...editingQuestion, subject: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., JavaScript, React, Python"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Difficulty</label>
                      <select
                        value={isAddingQuestion ? newQuestion.difficulty : editingQuestion?.difficulty || 'Easy'}
                        onChange={(e) => {
                          const difficulty = e.target.value as 'Easy' | 'Medium' | 'Hard';
                          if (isAddingQuestion) {
                            setNewQuestion({ ...newQuestion, difficulty });
                          } else if (editingQuestion) {
                            setEditingQuestion({ ...editingQuestion, difficulty });
                          }
                        }}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Easy" className="bg-gray-800">Easy</option>
                        <option value="Medium" className="bg-gray-800">Medium</option>
                        <option value="Hard" className="bg-gray-800">Hard</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Question</label>
                    <textarea
                      value={isAddingQuestion ? newQuestion.question : editingQuestion?.question || ''}
                      onChange={(e) => {
                        if (isAddingQuestion) {
                          setNewQuestion({ ...newQuestion, question: e.target.value });
                        } else if (editingQuestion) {
                          setEditingQuestion({ ...editingQuestion, question: e.target.value });
                        }
                      }}
                      rows={3}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Enter your question here..."
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Options</label>
                    <div className="space-y-2">
                      {(isAddingQuestion ? newQuestion.options : editingQuestion?.options || []).map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={(isAddingQuestion ? newQuestion.correctAnswer : editingQuestion?.correctAnswer) === index}
                            onChange={() => {
                              if (isAddingQuestion) {
                                setNewQuestion({ ...newQuestion, correctAnswer: index });
                              } else if (editingQuestion) {
                                setEditingQuestion({ ...editingQuestion, correctAnswer: index });
                              }
                            }}
                            className="text-blue-500"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(isAddingQuestion ? newQuestion.options : editingQuestion?.options || [])];
                              newOptions[index] = e.target.value;
                              if (isAddingQuestion) {
                                setNewQuestion({ ...newQuestion, options: newOptions });
                              } else if (editingQuestion) {
                                setEditingQuestion({ ...editingQuestion, options: newOptions });
                              }
                            }}
                            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Option ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Explanation</label>
                    <textarea
                      value={isAddingQuestion ? newQuestion.explanation : editingQuestion?.explanation || ''}
                      onChange={(e) => {
                        if (isAddingQuestion) {
                          setNewQuestion({ ...newQuestion, explanation: e.target.value });
                        } else if (editingQuestion) {
                          setEditingQuestion({ ...editingQuestion, explanation: e.target.value });
                        }
                      }}
                      rows={2}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Explain why this is the correct answer..."
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={isAddingQuestion ? handleAddQuestion : handleUpdateQuestion}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isAddingQuestion ? 'Add Question' : 'Update Question'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingQuestion(false);
                        setEditingQuestion(null);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">
                          {question.subject}
                        </span>
                        <div className={`px-2 py-1 bg-gradient-to-r ${getDifficultyColor(question.difficulty)} rounded text-white text-sm`}>
                          {question.difficulty}
                        </div>
                      </div>
                      <h3 className="text-white font-medium mb-3">{question.question}</h3>
                      <div className="space-y-1">
                        {question.options.map((option, index) => (
                          <div
                            key={index}
                            className={`text-sm p-2 rounded ${
                              index === question.correctAnswer
                                ? 'bg-green-500/20 text-green-300'
                                : 'text-white/70'
                            }`}
                          >
                            {String.fromCharCode(65 + index)}. {option}
                            {index === question.correctAnswer && ' ✓'}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="" className="bg-gray-800">All Roles</option>
                <option value="student" className="bg-gray-800">Students</option>
                <option value="admin" className="bg-gray-800">Admins</option>
              </select>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-6 py-3 text-left text-white font-medium">User</th>
                      <th className="px-6 py-3 text-left text-white font-medium">Role</th>
                      <th className="px-6 py-3 text-left text-white font-medium">Join Date</th>
                      <th className="px-6 py-3 text-left text-white font-medium">Last Active</th>
                      <th className="px-6 py-3 text-left text-white font-medium">Tests</th>
                      <th className="px-6 py-3 text-left text-white font-medium">Avg Score</th>
                      <th className="px-6 py-3 text-left text-white font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-t border-white/10">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-white font-medium">{user.name}</div>
                            <div className="text-white/60 text-sm">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white/70">{user.joinDate}</td>
                        <td className="px-6 py-4 text-white/70">{user.lastActive}</td>
                        <td className="px-6 py-4 text-white/70">{user.testsCompleted}</td>
                        <td className="px-6 py-4 text-white/70">{user.averageScore}%</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-blue-400 hover:text-blue-300 transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-red-400 hover:text-red-300 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-4">Platform Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">User Registration</h4>
                    <p className="text-white/60 text-sm">Allow new users to register</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Email Notifications</h4>
                    <p className="text-white/60 text-sm">Send email notifications to users</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Maintenance Mode</h4>
                    <p className="text-white/60 text-sm">Put the platform in maintenance mode</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-4">Test Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Default Test Duration (minutes)</label>
                  <input
                    type="number"
                    defaultValue={15}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Passing Score (%)</label>
                  <input
                    type="number"
                    defaultValue={70}
                    min={0}
                    max={100}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Max Attempts per Test</label>
                  <input
                    type="number"
                    defaultValue={3}
                    min={1}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;