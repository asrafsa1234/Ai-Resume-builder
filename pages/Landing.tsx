import React from 'react';
import { useNavigate } from 'react-router-dom';
import LiquidEther from '../components/effects/LiquidEther';
import { ArrowRight, CheckCircle, FileText, Sparkles, Download } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 text-white">
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

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
        <div className="pointer-events-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-200">
            Craft Your Perfect Resume with AI
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Create, edit, optimize, and download professional resumes in minutes.
            Powered by intelligent analysis to beat the ATS.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              Start Building Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/templates')}
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              View Templates
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-sm md:text-base text-white/80">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-white/10 rounded-full mb-2">
                 <FileText className="w-6 h-6" />
              </div>
              <span>Live Editor</span>
            </div>
             <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-white/10 rounded-full mb-2">
                 <Sparkles className="w-6 h-6" />
              </div>
              <span>AI Enhancement</span>
            </div>
             <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-white/10 rounded-full mb-2">
                 <CheckCircle className="w-6 h-6" />
              </div>
              <span>ATS Optimized</span>
            </div>
             <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-white/10 rounded-full mb-2">
                 <Download className="w-6 h-6" />
              </div>
              <span>PDF & DOCX</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;