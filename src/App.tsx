import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CodeEditor from './pages/CodeEditor';
import Tests from './pages/Tests';
import Community from './pages/Community';
import ResumeBuilder from './pages/ResumeBuilder';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="code" element={<CodeEditor />} />
              <Route path="tests" element={<Tests />} />
              <Route path="community" element={<Community />} />
              <Route path="resume" element={<ResumeBuilder />} />
              <Route path="profile" element={<Profile />} />
              <Route path="admin" element={<AdminPanel />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;