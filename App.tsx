import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ResumeProvider } from './context/ResumeContext';
import { Loader2 } from 'lucide-react';

// Lazy loading pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Templates = lazy(() => import('./pages/Templates'));
const StartOptions = lazy(() => import('./pages/StartOptions'));
const Upload = lazy(() => import('./pages/Upload'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center w-full h-screen bg-slate-900 text-white">
    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ResumeProvider>
        <HashRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/start-options" element={<StartOptions />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </ResumeProvider>
    </AuthProvider>
  );
};

export default App;