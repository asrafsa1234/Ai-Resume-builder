import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileText, Loader2, ArrowLeft } from 'lucide-react';

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    // Mock upload delay
    setTimeout(() => {
      setUploading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col p-6 text-white">
      <button 
        onClick={() => navigate('/start-options')} 
        className="self-start flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Upload your resume</h1>
        <p className="text-slate-400 mb-8">We accept PDF, DOCX, and TXT formats.</p>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer bg-slate-800/30 ${
            isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500'
          }`}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
          />
          
          {!file ? (
            <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer w-full h-full">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <UploadIcon className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-xl font-medium mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-slate-500">PDF, DOCX, or TXT (max 10MB)</p>
            </label>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-blue-400" />
              </div>
              <p className="text-xl font-medium mb-2">{file.name}</p>
              <p className="text-sm text-slate-500 mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <button 
                onClick={() => setFile(null)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Remove file
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="mt-8 w-full max-w-xs py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            'Continue to Editor'
          )}
        </button>
      </div>
    </div>
  );
};

export default Upload;