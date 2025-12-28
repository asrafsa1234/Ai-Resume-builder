import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChromaGrid from '../components/effects/ChromaGrid';
import { ArrowLeft } from 'lucide-react';

const Templates: React.FC = () => {
  const navigate = useNavigate();

  // Sourced templates representing popular open-source/ATS-friendly styles
  const templates = [
    {
      id: 'harvard',
      image: 'https://placehold.co/600x800/ffffff/000000/png?text=Harvard+Standard',
      title: 'The Standard',
      subtitle: 'Ivy League Style',
      handle: 'ATS Gold',
      borderColor: '#000000',
      gradient: 'linear-gradient(145deg, #333333, #000)',
      url: '#' 
    },
    {
      id: 'sidebar',
      image: 'https://placehold.co/600x800/1e293b/ffffff/png?text=Dev+Sidebar',
      title: 'Tech Sidebar',
      subtitle: 'Two-Column Layout',
      handle: 'Modern',
      borderColor: '#3B82F6',
      gradient: 'linear-gradient(145deg, #3B82F6, #000)',
      url: '#'
    },
    {
      id: 'minimal',
      image: 'https://placehold.co/600x800/f8fafc/334155/png?text=Minimal+Sans',
      title: 'Minimalist Sans',
      subtitle: 'Clean & Simple',
      handle: 'Readable',
      borderColor: '#64748b',
      gradient: 'linear-gradient(145deg, #64748b, #000)',
      url: '#'
    },
    {
      id: 'executive',
      image: 'https://placehold.co/600x800/0f172a/e2e8f0/png?text=Executive+Suite',
      title: 'Executive',
      subtitle: 'Bold Headers',
      handle: 'Professional',
      borderColor: '#0f172a',
      gradient: 'linear-gradient(145deg, #0f172a, #000)',
      url: '#'
    },
     {
      id: 'creative',
      image: 'https://placehold.co/600x800/4f46e5/ffffff/png?text=Creative+Lead',
      title: 'Creative Lead',
      subtitle: 'Accent Header',
      handle: 'Design',
      borderColor: '#4f46e5',
      gradient: 'linear-gradient(195deg, #4f46e5, #000)',
      url: '#'
    },
     {
      id: 'compact',
      image: 'https://placehold.co/600x800/059669/ffffff/png?text=Compact+Pro',
      title: 'Compact Pro',
      subtitle: 'Dense Information',
      handle: 'Senior',
      borderColor: '#059669',
      gradient: 'linear-gradient(135deg, #059669, #000)',
      url: '#'
    }
  ];

  const handleGridClick = (e: React.MouseEvent) => {
    // Intercept click on ChromaGrid cards to navigate within the app
    const target = e.target as HTMLElement;
    const card = target.closest('.chroma-card');
    
    if (card && card.parentElement) {
      // Find the index of the clicked card to map it to our templates array
      // We filter children to only include the cards, ignoring overlay/fade elements
      const siblings = Array.from(card.parentElement.children).filter(child => 
        child.classList.contains('chroma-card')
      );
      const index = siblings.indexOf(card);
      
      if (index !== -1 && templates[index]) {
        // Persist selection
        localStorage.setItem('selectedTemplateId', templates[index].id);
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 relative overflow-hidden flex flex-col">
       {/* Header */}
       <div className="absolute top-0 left-0 w-full z-20 p-6 flex justify-between items-center pointer-events-auto">
           <button onClick={() => navigate('/start-options')} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
               <ArrowLeft className="w-5 h-5" /> Back
           </button>
           <h1 className="text-2xl font-bold text-white">Choose a Template</h1>
           <div className="w-20"></div> {/* Spacer */}
       </div>

      {/* Grid Container */}
      <div className="flex-1 w-full h-full relative mt-16">
        {/* Wrapper to capture clicks from ChromaGrid items */}
        <div className="w-full h-[800px]" onClick={handleGridClick}>
            <ChromaGrid 
                items={templates}
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
            />
        </div>
      </div>
      
      <div className="absolute bottom-6 w-full text-center z-20 pointer-events-none">
          <p className="text-white/50 text-sm">Select a template to start editing</p>
      </div>
    </div>
  );
};

export default Templates;