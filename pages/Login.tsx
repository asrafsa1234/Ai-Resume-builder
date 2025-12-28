import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LiquidEther from '../components/effects/LiquidEther';
import BlobCursor from '../components/effects/BlobCursor';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDesktop, setIsDesktop] = useState(false);
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/start-options');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      // Error handled in context
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <LiquidEther
           colors={['#5227FF', '#FF9FFC', '#B19EEF']}
           mouseForce={20}
           cursorSize={100}
           isViscous={false}
           viscous={30}
           iterationsViscous={32}
           iterationsPoisson={32}
           resolution={0.5}
           isBounce={false}
           autoDemo={true}
           autoSpeed={0.5}
           autoIntensity={2.2}
           takeoverDuration={0.25}
           autoResumeDelay={3000}
           autoRampDuration={0.6}
        />
      </div>

      {/* Blob Cursor - Desktop Only */}
      {isDesktop && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <BlobCursor
            blobType="circle"
            fillColor="#5227FF"
            trailCount={3}
            sizes={[60, 125, 75]}
            innerSizes={[20, 35, 25]}
            innerColor="rgba(255,255,255,0.8)"
            opacities={[0.6, 0.6, 0.6]}
            shadowColor="rgba(0,0,0,0.75)"
            shadowBlur={5}
            shadowOffsetX={10}
            shadowOffsetY={10}
            filterStdDeviation={30}
            useFilter={true}
            fastDuration={0.1}
            slowDuration={0.5}
            zIndex={100}
          />
        </div>
      )}

      {/* Login Form */}
      <div className="relative z-20 flex items-center justify-center w-full h-full p-4 pointer-events-none">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 pointer-events-auto">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account? <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Sign up</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;