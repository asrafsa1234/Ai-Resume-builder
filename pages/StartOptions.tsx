import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp, FilePlus, ArrowRight } from 'lucide-react';

const StartOptions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
      <h1 className="text-3xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
        How will you make your resume?
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Option 1: Upload */}
        <button
          onClick={() => navigate('/upload')}
          className="group relative flex flex-col items-center p-10 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-2xl transition-all duration-300 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FileUp className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">I already have a resume</h2>
          <p className="text-slate-400 mb-8">Upload your existing PDF or DOCX to optimize and enhance it with AI.</p>
          <span className="flex items-center text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
            Upload Resume <ArrowRight className="ml-2 w-4 h-4" />
          </span>
        </button>

        {/* Option 2: Scratch */}
        <button
          onClick={() => navigate('/templates')}
          className="group relative flex flex-col items-center p-10 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-purple-500 rounded-2xl transition-all duration-300 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FilePlus className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Start from scratch</h2>
          <p className="text-slate-400 mb-8">Choose from our professional templates and build your resume step-by-step.</p>
          <span className="flex items-center text-purple-400 font-medium group-hover:translate-x-1 transition-transform">
            Browse Templates <ArrowRight className="ml-2 w-4 h-4" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default StartOptions;