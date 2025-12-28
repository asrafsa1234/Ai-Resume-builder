import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import { improveText } from '../services/geminiService';
import { Sparkles, Download, FileDown, Plus, Trash2, ArrowRight, Settings, CheckSquare, Loader2, FileText, Save, ChevronLeft, LogOut, Palette, Type, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GooeyNav from '../components/ui/GooeyNav';
import Chatbot from '../components/ui/Chatbot';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const steps = [
  { label: "Contacts" },
  { label: "Experience" },
  { label: "Education" },
  { label: "Skills" },
  { label: "Summary" },
  { label: "Design" },
  { label: "Finalize" }
];

const COLORS = [
    { name: 'Noir', hex: '#000000' },
    { name: 'Slate', hex: '#334155' },
    { name: 'Blue', hex: '#2563eb' },
    { name: 'Purple', hex: '#7c3aed' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Rose', hex: '#e11d48' },
    { name: 'Amber', hex: '#d97706' },
];

const FONTS = [
    { name: 'Modern Sans', value: 'Inter' },
    { name: 'Classic Serif', value: 'Merriweather' },
    { name: 'Tech Mono', value: 'Roboto Mono' },
];

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const { 
    resumeData, 
    updatePersonal, 
    updateSummary, 
    updateTitle, 
    updateExperience, 
    addExperience, 
    removeExperience,
    updateEducation,
    addEducation,
    removeEducation,
    updateSkills,
    updateTheme
  } = useResume();
  const navigate = useNavigate();
  const [isImproving, setIsImproving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [templateId, setTemplateId] = useState('harvard');
  const [activeStep, setActiveStep] = useState(0);

  // New state for download customization
  const [downloadSettings, setDownloadSettings] = useState({
    fontSize: 'medium', // small, medium, large
    margins: 'standard', // compact, standard, wide
    showSummary: true,
    showExperience: true,
    showEducation: true,
    showSkills: true
  });

  useEffect(() => {
    const storedTemplate = localStorage.getItem('selectedTemplateId');
    if (storedTemplate) {
      setTemplateId(storedTemplate);
    }
  }, []);

  const handleAIImprove = async (text: string, type: 'grammar' | 'professional' | 'ats', field: 'summary' | 'experience', index?: number) => {
    setIsImproving(true);
    const improved = await improveText(text, type);
    
    if (field === 'summary') {
      updateSummary(improved);
    } else if (field === 'experience' && typeof index === 'number') {
      const points = improved.split('\n').filter(p => p.trim());
      updateExperience(index, 'points', points);
    }
    
    setIsImproving(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const downloadPDF = async () => {
    const element = document.getElementById('resume-preview-content');
    if (!element) {
        alert("Could not find resume content to generate PDF.");
        return;
    }
    
    setIsDownloading(true);
    
    try {
        const canvas = await html2canvas(element, { 
            scale: 2, 
            useCORS: true,
            logging: false
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = pdfWidth / imgWidth;
        const imgHeightInPdf = imgHeight * ratio;
        
        if (imgHeightInPdf > pdfHeight) {
             pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeightInPdf);
        } else {
             pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeightInPdf);
        }
        
        const safeTitle = (resumeData.title || 'resume').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        pdf.save(`${safeTitle}.pdf`);
        
    } catch (error) {
        console.error("PDF generation failed:", error);
        alert("Failed to generate PDF. Please try again.");
    } finally {
        setIsDownloading(false);
    }
  };
  
  const downloadDOCX = () => {
    const element = document.getElementById('resume-preview-content');
    if (!element) {
        alert("Could not find resume content.");
        return;
    }

    setIsDownloading(true);

    try {
        const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Resume</title></head><body>";
        const postHtml = "</body></html>";
        const html = preHtml + element.innerHTML + postHtml;

        const blob = new Blob(['\ufeff', html], {
            type: 'application/msword'
        });
        
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        
        const safeTitle = (resumeData.title || 'resume').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        downloadLink.href = url;
        downloadLink.download = `${safeTitle}.doc`;
        
        downloadLink.click();
        
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error("DOCX generation failed:", error);
        alert("Failed to generate document.");
    } finally {
        setIsDownloading(false);
    }
  };

  const handlePointsChange = (index: number, text: string) => {
    const points = text.split('\n');
    updateExperience(index, 'points', points);
  };

  const nextStep = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const getMarginClass = (type: 'all' | 'x' | 'y' = 'all') => {
    const m = downloadSettings.margins;
    if (type === 'all') {
      return m === 'compact' ? 'p-6' : m === 'wide' ? 'p-16' : 'p-12';
    }
    if (type === 'x') {
      return m === 'compact' ? 'px-8' : m === 'wide' ? 'px-16' : 'px-12';
    }
    if (type === 'y') {
      return m === 'compact' ? 'py-4' : m === 'wide' ? 'py-12' : 'py-8';
    }
    return '';
  };

  // --- Render Functions for Sidebar Inputs ---
  
  const renderSidebarContent = () => {
    switch(activeStep) {
      case 0: // CONTACTS
        return (
          <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Settings className="w-4 h-4" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800">Personal Details</h3>
                    <p className="text-xs text-slate-500">How employers can reach you.</p>
                </div>
            </div>

            <div className="space-y-4">
               {[
                   { label: 'Full Name', val: resumeData.personal.name, key: 'name' },
                   { label: 'Email', val: resumeData.personal.email, key: 'email' },
                   { label: 'Phone', val: resumeData.personal.phone, key: 'phone' },
                   { label: 'Location', val: resumeData.personal.location, key: 'location' },
                   { label: 'LinkedIn / Website', val: resumeData.personal.linkedin, key: 'linkedin' }
               ].map((field) => (
                   <div key={field.key}>
                       <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">{field.label}</label>
                       <input 
                         className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                         placeholder={`Enter your ${field.label.toLowerCase()}`}
                         value={field.val}
                         onChange={(e) => updatePersonal(field.key as any, e.target.value)}
                       />
                   </div>
               ))}
            </div>
          </div>
        );

      case 1: // EXPERIENCE
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Work Experience</h3>
                <p className="text-xs text-slate-500">Your professional journey.</p>
              </div>
              <button onClick={addExperience} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-xs font-bold flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            
            <div className="space-y-6">
                {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm relative group hover:border-blue-300 transition-colors">
                    <button 
                    onClick={() => removeExperience(index)} 
                    className="absolute top-3 right-3 text-slate-300 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-all"
                    title="Remove position"
                    >
                    <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="grid gap-3">
                        <div className="grid grid-cols-2 gap-3">
                             <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Role</label>
                                <input 
                                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    value={exp.role}
                                    onChange={(e) => updateExperience(index, 'role', e.target.value)}
                                    placeholder="Software Engineer"
                                />
                             </div>
                             <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company</label>
                                <input 
                                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    value={exp.company}
                                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                    placeholder="Acme Inc."
                                />
                             </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Date Range</label>
                            <input 
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                value={exp.date}
                                onChange={(e) => updateExperience(index, 'date', e.target.value)}
                                placeholder="Jan 2020 - Present"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase">Achievements</label>
                                <button 
                                    onClick={() => handleAIImprove(exp.points.join('\n'), 'professional', 'experience', index)}
                                    disabled={isImproving}
                                    className="text-[10px] flex items-center gap-1 text-purple-600 hover:text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full disabled:opacity-50 transition-colors"
                                >
                                    <Sparkles className="w-3 h-3" /> AI Polish
                                </button>
                            </div>
                            <textarea 
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-sm text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none h-32 leading-relaxed"
                                value={exp.points.join('\n')}
                                onChange={(e) => handlePointsChange(index, e.target.value)}
                                placeholder="• Led a team of 5 developers..."
                            />
                        </div>
                    </div>
                </div>
                ))}
            </div>
          </div>
        );

      case 2: // EDUCATION
        return (
           <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
             <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Education</h3>
                <p className="text-xs text-slate-500">Academic background.</p>
              </div>
              <button onClick={addEducation} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-xs font-bold flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>

            <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                <div key={edu.id} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm relative group hover:border-blue-300 transition-colors">
                    <button 
                    onClick={() => removeEducation(index)} 
                    className="absolute top-3 right-3 text-slate-300 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-all"
                    >
                    <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="space-y-3">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">School</label>
                            <input 
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                value={edu.school}
                                onChange={(e) => updateEducation(index, 'school', e.target.value)}
                                placeholder="University Name"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                             <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Degree</label>
                                <input 
                                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    value={edu.degree}
                                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                    placeholder="B.S. Computer Science"
                                />
                             </div>
                             <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Year</label>
                                <input 
                                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    value={edu.year}
                                    onChange={(e) => updateEducation(index, 'year', e.target.value)}
                                    placeholder="2020"
                                />
                             </div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
          </div>
        );

      case 3: // SKILLS
        return (
          <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
             <div className="mb-2">
                <h3 className="text-sm font-bold text-slate-800">Skills</h3>
                <p className="text-xs text-slate-500">Highlight your core competencies.</p>
             </div>
             
             <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Skill List (Comma Separated)</label>
                <textarea 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all h-48 resize-none leading-relaxed"
                    value={resumeData.skills.join(', ')}
                    onChange={(e) => updateSkills(e.target.value.split(',').map(s => s.trim()))}
                    placeholder="Java, Python, Leadership, Public Speaking..."
                />
                <div className="mt-3 flex flex-wrap gap-2">
                    {resumeData.skills.filter(s => s).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200">
                            {skill}
                        </span>
                    ))}
                </div>
             </div>
          </div>
        );

      case 4: // SUMMARY
         return (
          <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
             <div className="mb-2">
                <h3 className="text-sm font-bold text-slate-800">Professional Summary</h3>
                <p className="text-xs text-slate-500">Your elevator pitch.</p>
             </div>

             <div className="relative">
                <textarea 
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all h-60 resize-none leading-relaxed shadow-sm"
                    value={resumeData.summary}
                    onChange={(e) => updateSummary(e.target.value)}
                    placeholder="Briefly describe your professional background..."
                />
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleAIImprove(resumeData.summary, 'professional', 'summary')}
                  disabled={isImproving}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 hover:border-blue-200 rounded-xl text-blue-700 transition-all disabled:opacity-50 text-xs font-semibold shadow-sm hover:shadow"
                >
                  <Sparkles className="w-4 h-4" /> 
                  {isImproving ? 'Polishing...' : 'Make Professional'}
                </button>
                <button 
                  onClick={() => handleAIImprove(resumeData.summary, 'ats', 'summary')}
                  disabled={isImproving}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 hover:border-emerald-200 rounded-xl text-emerald-700 transition-all disabled:opacity-50 text-xs font-semibold shadow-sm hover:shadow"
                >
                  <CheckSquare className="w-4 h-4" /> 
                  {isImproving ? 'Optimizing...' : 'ATS Optimize'}
                </button>
             </div>
          </div>
         );

      case 5: // DESIGN (NEW)
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
             <div className="mb-2">
                <h3 className="text-sm font-bold text-slate-800">Design Theme</h3>
                <p className="text-xs text-slate-500">Customize look and feel.</p>
             </div>

             {/* Colors */}
             <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <Palette className="w-4 h-4 text-slate-400" />
                    <label className="text-xs font-bold text-slate-500 uppercase">Accent Color</label>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {COLORS.map(color => (
                        <button
                            key={color.hex}
                            onClick={() => updateTheme('primaryColor', color.hex)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                                resumeData.theme.primaryColor === color.hex ? 'border-slate-800 scale-110' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                        />
                    ))}
                    {/* Custom Color Picker input hidden but triggered via label or separate button could go here. 
                        For simplicity using a native input as the last item 
                    */}
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 flex items-center justify-center cursor-pointer">
                         <input 
                            type="color" 
                            value={resumeData.theme.primaryColor}
                            onChange={(e) => updateTheme('primaryColor', e.target.value)}
                            className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
                         />
                         <Plus className="w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
             </div>

             {/* Typography */}
             <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-slate-400" />
                    <label className="text-xs font-bold text-slate-500 uppercase">Typography</label>
                </div>
                
                <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1.5">Headings</label>
                    <div className="grid grid-cols-1 gap-2">
                        {FONTS.map(font => (
                            <button
                                key={`h-${font.value}`}
                                onClick={() => updateTheme('fontHeading', font.value)}
                                className={`px-3 py-2 text-xs text-left rounded-lg border transition-all ${
                                    resumeData.theme.fontHeading === font.value
                                    ? 'bg-slate-50 border-blue-500 text-blue-700 font-semibold'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                                style={{ fontFamily: font.value }}
                            >
                                {font.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1.5">Body Text</label>
                    <div className="grid grid-cols-1 gap-2">
                         {FONTS.map(font => (
                            <button
                                key={`b-${font.value}`}
                                onClick={() => updateTheme('fontBody', font.value)}
                                className={`px-3 py-2 text-xs text-left rounded-lg border transition-all ${
                                    resumeData.theme.fontBody === font.value
                                    ? 'bg-slate-50 border-blue-500 text-blue-700 font-semibold'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                                style={{ fontFamily: font.value }}
                            >
                                {font.name}
                            </button>
                        ))}
                    </div>
                </div>
             </div>
          </div>
        );

      case 6: // FINALIZE
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
             <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl text-center mb-2">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 text-green-500">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-green-900">Ready to Export</h3>
                <p className="text-xs text-green-700/80 mt-1 max-w-[200px] mx-auto">Your resume is looking great. Adjust final settings below.</p>
             </div>

             <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Document Settings</span>
                </div>
                
                {/* Font Size */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <label className="text-xs font-semibold text-slate-700 mb-3 block">Font Size</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['small', 'medium', 'large'].map((size) => (
                            <button
                                key={size}
                                onClick={() => setDownloadSettings(s => ({ ...s, fontSize: size as any }))}
                                className={`py-2 text-xs font-medium capitalize rounded-lg border transition-all ${
                                    downloadSettings.fontSize === size 
                                    ? 'bg-slate-900 text-white border-slate-900' 
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Margins */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <label className="text-xs font-semibold text-slate-700 mb-3 block">Page Margins</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['compact', 'standard', 'wide'].map((margin) => (
                            <button
                                key={margin}
                                onClick={() => setDownloadSettings(s => ({ ...s, margins: margin as any }))}
                                className={`py-2 text-xs font-medium capitalize rounded-lg border transition-all ${
                                    downloadSettings.margins === margin 
                                    ? 'bg-slate-900 text-white border-slate-900' 
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                {margin}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sections */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <label className="text-xs font-semibold text-slate-700 mb-3 block">Visible Sections</label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: 'showSummary', label: 'Summary' },
                            { id: 'showExperience', label: 'Experience' },
                            { id: 'showEducation', label: 'Education' },
                            { id: 'showSkills', label: 'Skills' }
                        ].map((item) => (
                            <label key={item.id} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none group">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                    (downloadSettings as any)[item.id] 
                                    ? 'bg-blue-600 border-blue-600' 
                                    : 'bg-white border-slate-300 group-hover:border-slate-400'
                                }`}>
                                     {(downloadSettings as any)[item.id] && <CheckSquare className="w-3 h-3 text-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={(downloadSettings as any)[item.id]}
                                    onChange={(e) => setDownloadSettings(s => ({ ...s, [item.id]: e.target.checked }))}
                                    className="hidden"
                                />
                                {item.label}
                            </label>
                        ))}
                    </div>
                </div>
             </div>
          </div>
        );
    }
  };

  const renderResumeContent = () => {
    // Style Helpers
    const { primaryColor, fontHeading, fontBody } = resumeData.theme;
    
    // Inline styles for dynamic theming
    const headingStyle = { fontFamily: fontHeading, color: primaryColor };
    const bodyStyle = { fontFamily: fontBody };
    const borderStyle = { borderColor: primaryColor };
    
    switch (templateId) {
      case 'harvard':
        return (
          <div className={`text-black max-w-[800px] w-[800px] bg-white min-h-[1100px] p-16 shadow-lg ${getMarginClass()}`} style={bodyStyle}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold uppercase tracking-wider mb-2" style={{ fontFamily: fontHeading, color: primaryColor }}>{resumeData.personal.name}</h1>
              <p className="text-sm text-gray-700">
                {resumeData.personal.email} | {resumeData.personal.phone}
              </p>
               <p className="text-sm text-gray-700">{resumeData.personal.location} | {resumeData.personal.linkedin}</p>
            </div>

            {downloadSettings.showSummary && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase border-b mb-3 pb-1 tracking-wider" style={{ ...headingStyle, ...borderStyle }}>Professional Summary</h2>
              <p className="text-sm text-justify leading-relaxed">{resumeData.summary}</p>
            </section>
            )}

            {downloadSettings.showExperience && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase border-b mb-3 pb-1 tracking-wider" style={{ ...headingStyle, ...borderStyle }}>Experience</h2>
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between font-bold text-sm mb-1">
                    <span style={{ color: '#000' }}>{exp.company}</span>
                    <span>{exp.date}</span>
                  </div>
                  <div className="italic text-sm mb-2" style={{ color: '#444' }}>{exp.role}</div>
                  <ul className="list-disc list-outside ml-5 text-sm space-y-1.5 text-justify">
                    {exp.points.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              ))}
            </section>
            )}

            {downloadSettings.showSkills && (
             <section className="mb-6">
              <h2 className="text-sm font-bold uppercase border-b mb-3 pb-1 tracking-wider" style={{ ...headingStyle, ...borderStyle }}>Skills</h2>
              <p className="text-sm leading-relaxed">{resumeData.skills.join(', ')}</p>
            </section>
            )}

            {downloadSettings.showEducation && (
             <section>
              <h2 className="text-sm font-bold uppercase border-b mb-3 pb-1 tracking-wider" style={{ ...headingStyle, ...borderStyle }}>Education</h2>
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="flex justify-between text-sm mb-2">
                  <div>
                    <span className="font-bold block" style={{ color: '#000' }}>{edu.school}</span>
                    <span className="italic" style={{ color: '#444' }}>{edu.degree}</span>
                  </div>
                  <span className="font-medium">{edu.year}</span>
                </div>
              ))}
            </section>
            )}
          </div>
        );

      case 'sidebar':
        const sidebarMainPadding = downloadSettings.margins === 'compact' ? 'p-6' : downloadSettings.margins === 'wide' ? 'p-12' : 'p-10';
        return (
          <div className="flex w-[800px] min-h-[1100px] bg-white shadow-lg" style={bodyStyle}>
            <aside className="w-[260px] text-white p-8 flex flex-col shrink-0" style={{ backgroundColor: primaryColor }}>
              <div className="mb-10">
                 <h1 className="text-3xl font-bold mb-2 leading-tight" style={{ fontFamily: fontHeading }}>{resumeData.personal.name}</h1>
                 <p className="text-sm opacity-90 font-medium">{resumeData.experience[0]?.role || 'Professional'}</p>
              </div>
              
              <div className="mb-10">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4 pb-2 border-b border-white/20">Contact</h3>
                <div className="text-xs opacity-90 leading-loose space-y-3">
                   <div className="break-all">{resumeData.personal.email}</div>
                   <div>{resumeData.personal.phone}</div>
                   <div>{resumeData.personal.location}</div>
                   <div className="break-all">{resumeData.personal.linkedin}</div>
                </div>
              </div>

              {downloadSettings.showSkills && (
               <div className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4 pb-2 border-b border-white/20">Skills</h3>
                <ul className="text-xs opacity-90 space-y-2">
                  {resumeData.skills.map((s, i) => <li key={i} className="flex items-start"><span className="mr-2 opacity-50">•</span>{s}</li>)}
                </ul>
              </div>
              )}
            </aside>
            <main className={`flex-1 text-slate-800 ${sidebarMainPadding}`}>
               {downloadSettings.showSummary && (
               <section className="mb-10">
                <h2 className="text-xl font-bold text-slate-900 border-b-2 border-slate-100 pb-2 mb-4" style={{ color: primaryColor, fontFamily: fontHeading }}>Profile</h2>
                 <p className="text-sm leading-relaxed text-slate-600 text-justify">{resumeData.summary}</p>
               </section>
               )}
               
               {downloadSettings.showExperience && (
               <section className="mb-10">
                 <h2 className="text-xl font-bold text-slate-900 border-b-2 border-slate-100 pb-2 mb-6" style={{ color: primaryColor, fontFamily: fontHeading }}>Experience</h2>
                 {resumeData.experience.map((exp) => (
                  <div key={exp.id} className="mb-8 last:mb-0">
                      <h3 className="font-bold text-lg text-slate-800">{exp.role}</h3>
                      <div className="flex justify-between text-slate-500 text-sm mb-3 font-medium">
                        <span>{exp.company}</span>
                        <span>{exp.date}</span>
                      </div>
                      <ul className="list-disc list-outside ml-4 text-sm text-slate-600 space-y-1.5 marker:text-slate-300">
                        {exp.points.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                  </div>
                 ))}
               </section>
               )}

               {downloadSettings.showEducation && (
               <section>
                 <h2 className="text-xl font-bold text-slate-900 border-b-2 border-slate-100 pb-2 mb-6" style={{ color: primaryColor, fontFamily: fontHeading }}>Education</h2>
                 {resumeData.education.map((edu) => (
                  <div key={edu.id} className="mb-4">
                      <h3 className="font-bold text-base text-slate-800">{edu.school}</h3>
                      <div className="flex justify-between text-slate-500 text-sm mt-1">
                        <span>{edu.degree}</span>
                        <span>{edu.year}</span>
                      </div>
                  </div>
                 ))}
               </section>
               )}
            </main>
          </div>
        );

      case 'minimal':
        return (
          <div className={`text-slate-900 max-w-[800px] w-[800px] bg-white min-h-[1100px] shadow-lg ${getMarginClass()}`} style={bodyStyle}>
            <header className="mb-12 border-b pb-8" style={borderStyle}>
               <h1 className="text-5xl font-extrabold tracking-tight mb-4" style={{ fontFamily: fontHeading, color: primaryColor }}>{resumeData.personal.name}</h1>
               <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
                 <span>{resumeData.personal.email}</span>
                 <span>{resumeData.personal.phone}</span>
                 <span>{resumeData.personal.location}</span>
               </div>
            </header>

            {downloadSettings.showSummary && (
            <section className="mb-10">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">About Me</h3>
               <p className="text-slate-800 leading-relaxed max-w-2xl">{resumeData.summary}</p>
            </section>
            )}

            {downloadSettings.showExperience && (
             <section className="mb-10">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Work Experience</h3>
               <div className="border-l-2 border-slate-100 pl-8 space-y-10">
                 {resumeData.experience.map((exp) => (
                  <div key={exp.id} className="relative">
                    <div className="absolute w-3 h-3 bg-white rounded-full -left-[39px] top-1.5 border-2" style={{ borderColor: primaryColor }}></div>
                    <h4 className="font-bold text-xl text-slate-900 mb-1" style={{ fontFamily: fontHeading }}>{exp.role}</h4>
                    <p className="text-slate-500 mb-4 font-medium text-sm">{exp.company} &middot; {exp.date}</p>
                    <ul className="space-y-2 text-slate-700 text-sm leading-relaxed">
                        {exp.points.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                 ))}
               </div>
            </section>
            )}

             {downloadSettings.showEducation && (
             <section className="mb-10">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Education</h3>
               <div className="border-l-2 border-slate-100 pl-8 space-y-6">
                 {resumeData.education.map((edu) => (
                  <div key={edu.id} className="relative">
                     <div className="absolute w-3 h-3 bg-white rounded-full -left-[39px] top-1.5 border-2" style={{ borderColor: primaryColor }}></div>
                    <h4 className="font-bold text-base text-slate-900" style={{ fontFamily: fontHeading }}>{edu.school}</h4>
                    <p className="text-slate-500 text-sm">{edu.degree} &middot; {edu.year}</p>
                  </div>
                 ))}
               </div>
            </section>
            )}
          </div>
        );

      case 'executive':
         const execPaddingX = getMarginClass('x') || 'px-12';
         const execPaddingY = getMarginClass('y') || 'py-12';
         return (
          <div className="text-slate-800 max-w-[800px] w-[800px] bg-white min-h-[1100px] shadow-lg" style={bodyStyle}>
             <div className="h-6 w-full" style={{ backgroundColor: primaryColor }}></div>
             <header className={`${execPaddingX} pt-12 pb-8 flex justify-between items-end border-b-2 border-gray-100`}>
                <div>
                   <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: fontHeading, color: primaryColor }}>{resumeData.personal.name}</h1>
                   <p className="font-semibold tracking-wide uppercase text-sm" style={{ color: primaryColor, opacity: 0.8 }}>{resumeData.experience[0]?.role || 'Executive'}</p>
                </div>
                <div className="text-right text-xs text-gray-500 space-y-1.5 font-medium">
                   <div>{resumeData.personal.email}</div>
                   <div>{resumeData.personal.phone}</div>
                   <div>{resumeData.personal.location}</div>
                </div>
             </header>

             <div className={`${execPaddingX} ${execPaddingY}`}>
                {downloadSettings.showSummary && (
                <section className="mb-10">
                   <h2 className="font-bold uppercase tracking-wide text-xs mb-4" style={{ color: primaryColor }}>Executive Summary</h2>
                   <p className="text-sm leading-loose text-gray-700 text-justify">{resumeData.summary}</p>
                </section>
                )}

                 {downloadSettings.showExperience && (
                 <section className="mb-10">
                   <h2 className="font-bold uppercase tracking-wide text-xs mb-6" style={{ color: primaryColor }}>Professional Experience</h2>
                   {resumeData.experience.map((exp) => (
                     <div key={exp.id} className="mb-8">
                        <div className="flex justify-between items-baseline mb-2">
                           <h3 className="font-bold text-lg text-gray-900" style={{ fontFamily: fontHeading }}>{exp.company}</h3>
                           <span className="text-xs font-bold text-white px-2 py-1 rounded" style={{ backgroundColor: primaryColor }}>{exp.date}</span>
                        </div>
                        <div className="italic text-gray-600 mb-3 font-medium text-sm">{exp.role}</div>
                        <ul className="list-disc ml-5 text-sm space-y-1.5 text-gray-700 leading-relaxed">
                           {exp.points.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                     </div>
                   ))}
                </section>
                 )}

                 {downloadSettings.showEducation && (
                 <section>
                   <h2 className="font-bold uppercase tracking-wide text-xs mb-6" style={{ color: primaryColor }}>Education</h2>
                   {resumeData.education.map((edu) => (
                     <div key={edu.id} className="mb-4">
                        <div className="flex justify-between items-baseline mb-1">
                           <h3 className="font-bold text-base text-gray-900" style={{ fontFamily: fontHeading }}>{edu.school}</h3>
                           <span className="text-sm text-gray-500 font-medium">{edu.year}</span>
                        </div>
                        <div className="italic text-gray-600 text-sm">{edu.degree}</div>
                     </div>
                   ))}
                </section>
                 )}
             </div>
          </div>
         );

      // Default/Fallback
      default:
         // Re-use minimal as default instead of recursive call
        return (
          <div className={`text-slate-900 max-w-[800px] w-[800px] bg-white min-h-[1100px] shadow-lg ${getMarginClass()}`} style={bodyStyle}>
            <header className="mb-12 border-b pb-8">
               <h1 className="text-5xl font-extrabold tracking-tight mb-4" style={{ fontFamily: fontHeading, color: primaryColor }}>{resumeData.personal.name}</h1>
               <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
                 <span>{resumeData.personal.email}</span>
                 <span>{resumeData.personal.phone}</span>
                 <span>{resumeData.personal.location}</span>
               </div>
            </header>
            
            <div className="p-4 bg-yellow-50 text-yellow-800 rounded mb-4">
                <p>Template "{templateId}" not found. Showing default.</p>
            </div>

            {/* Render minimal content as fallback */}
            {downloadSettings.showSummary && (
            <section className="mb-10">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">About Me</h3>
               <p className="text-slate-800 leading-relaxed max-w-2xl">{resumeData.summary}</p>
            </section>
            )}
             {/* ... (abbreviated fallback content) */}
          </div>
        );
    }
  };

  // Safe fallback render for switch
  const renderContentSafe = () => {
      try {
          return renderResumeContent();
      } catch (e) {
          console.error(e);
          return <div className="text-red-500 p-4">Error rendering template. Please select another template.</div>
      }
  }


  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden text-slate-900 font-sans">
        {/* TOP NAVBAR */}
        <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-40 relative shadow-sm">
            <div className="flex items-center gap-6">
                 {/* Logo Area */}
                <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-all">
                        R
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden md:block">ResumeAI</span>
                </div>

                {/* Vertical Divider */}
                <div className="w-px h-6 bg-slate-200 hidden md:block"></div>

                {/* Resume Title Input */}
                <div className="group flex flex-col justify-center">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5 group-hover:text-blue-500 transition-colors">Resume Name</label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="text" 
                            value={resumeData.title}
                            onChange={(e) => updateTitle(e.target.value)}
                            className="bg-transparent font-semibold text-slate-800 focus:outline-none focus:bg-slate-50 rounded px-1 -ml-1 w-64 transition-all placeholder-slate-300"
                            placeholder="Untitled Resume"
                        />
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Save className="w-3 h-3" /> Saved
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                 <button 
                    onClick={downloadDOCX}
                    disabled={isDownloading}
                    className="hidden md:flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                 >
                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                    DOCX
                 </button>
                 <button 
                    onClick={downloadPDF}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Download PDF
                 </button>
                 
                 <div className="w-px h-6 bg-slate-200 mx-2 hidden md:block"></div>

                 <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Logout">
                    <LogOut className="w-5 h-5" />
                 </button>
            </div>
        </header>

        {/* WORKSPACE */}
        <div className="flex-1 flex overflow-hidden">
            {/* LEFT EDITOR PANEL */}
            <aside className="w-full md:w-[420px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                {/* Stepper Navigation */}
                <div className="px-2 py-3 border-b border-slate-100 bg-white">
                    <GooeyNav items={steps} initialActiveIndex={activeStep} onChange={setActiveStep} />
                </div>
                
                {/* Dynamic Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white">
                    {renderSidebarContent()}
                </div>

                {/* Footer Navigation */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between gap-4">
                     <button 
                        onClick={prevStep} 
                        disabled={activeStep === 0}
                        className="px-5 py-2.5 text-slate-500 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-sm font-semibold transition-all disabled:opacity-30 flex items-center gap-2"
                     >
                        <ChevronLeft className="w-4 h-4" /> Back
                     </button>
                     <button 
                        onClick={nextStep} 
                        disabled={activeStep === steps.length - 1}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:bg-slate-400"
                     >
                        {activeStep === steps.length - 1 ? 'Review' : 'Next Step'} <ArrowRight className="w-4 h-4" />
                     </button>
                </div>
            </aside>

            {/* RIGHT PREVIEW CANVAS */}
            <main className="flex-1 bg-slate-100/80 relative overflow-hidden flex flex-col">
                 <div className="absolute inset-0 z-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                 
                 <div className="flex-1 overflow-y-auto p-8 relative z-10 flex justify-center">
                    <div className="w-fit pb-20 origin-top animate-in fade-in zoom-in-95 duration-500">
                        {/* Shadow wrapper for realism */}
                        <div id="resume-preview-content" className="relative transition-all duration-300 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/5">
                            {renderContentSafe()}
                        </div>
                    </div>
                 </div>

                 {/* Floating Chatbot */}
                 <Chatbot activeStep={activeStep} setActiveStep={setActiveStep} resumeData={resumeData} />
            </main>
        </div>
    </div>
  );
};

export default Dashboard;