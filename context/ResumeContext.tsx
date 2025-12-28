import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ResumeData, ExperienceItem, EducationItem, ResumeTheme } from '../types';

const defaultResumeData: ResumeData = {
  title: 'My Professional Resume',
  personal: {
    name: 'Your Name',
    email: 'email@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/you',
  },
  summary: 'Experienced professional with a strong background in delivering high-quality results. Proven ability to lead teams and manage complex projects.',
  experience: [
    {
      id: '1',
      role: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      date: '2020 - Present',
      points: [
        'Led development of core platform features using React and Node.js',
        'Optimized database queries reducing load times by 40%',
        'Mentored 3 junior developers',
      ],
    },
  ],
  education: [
    {
      id: '1',
      degree: 'B.S. Computer Science',
      school: 'University of Technology',
      year: '2016 - 2020',
    },
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS'],
  theme: {
    primaryColor: '#000000',
    fontHeading: 'Inter',
    fontBody: 'Inter'
  }
};

interface ResumeContextType {
  resumeData: ResumeData;
  updatePersonal: (field: keyof ResumeData['personal'], value: string) => void;
  updateSummary: (value: string) => void;
  updateTitle: (value: string) => void;
  updateExperience: (index: number, field: keyof ExperienceItem, value: any) => void;
  addExperience: () => void;
  removeExperience: (index: number) => void;
  updateEducation: (index: number, field: keyof EducationItem, value: any) => void;
  addEducation: () => void;
  removeEducation: (index: number) => void;
  updateSkills: (skills: string[]) => void;
  updateTheme: (field: keyof ResumeTheme, value: string) => void;
  setResumeData: (data: ResumeData) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resumeData, setResumeDataState] = useState<ResumeData>(defaultResumeData);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('resume_data');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Ensure theme exists for legacy data
        if (!parsed.theme) {
            parsed.theme = defaultResumeData.theme;
        }
        setResumeDataState(parsed);
      } catch (e) {
        console.error('Failed to parse resume data', e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('resume_data', JSON.stringify(resumeData));
  }, [resumeData]);

  const setResumeData = (data: ResumeData) => {
    setResumeDataState(data);
  };

  const updatePersonal = (field: keyof ResumeData['personal'], value: string) => {
    setResumeDataState((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  const updateSummary = (value: string) => {
    setResumeDataState((prev) => ({ ...prev, summary: value }));
  };

  const updateTitle = (value: string) => {
    setResumeDataState((prev) => ({ ...prev, title: value }));
  };

  const updateExperience = (index: number, field: keyof ExperienceItem, value: any) => {
    setResumeDataState((prev) => {
      const newExp = [...prev.experience];
      newExp[index] = { ...newExp[index], [field]: value };
      return { ...prev, experience: newExp };
    });
  };

  const addExperience = () => {
    setResumeDataState((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now().toString(),
          role: 'New Role',
          company: 'Company Name',
          date: 'Date Range',
          points: ['Responsibility 1'],
        },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setResumeDataState((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const updateEducation = (index: number, field: keyof EducationItem, value: any) => {
    setResumeDataState((prev) => {
      const newEdu = [...prev.education];
      newEdu[index] = { ...newEdu[index], [field]: value };
      return { ...prev, education: newEdu };
    });
  };

  const addEducation = () => {
    setResumeDataState((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          degree: 'Degree / Major',
          school: 'University Name',
          year: 'Graduation Year'
        },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    setResumeDataState((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const updateSkills = (skills: string[]) => {
    setResumeDataState((prev) => ({ ...prev, skills }));
  };

  const updateTheme = (field: keyof ResumeTheme, value: string) => {
      setResumeDataState((prev) => ({
          ...prev,
          theme: { ...prev.theme, [field]: value }
      }));
  };

  return (
    <ResumeContext.Provider
      value={{
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
        updateTheme,
        setResumeData,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};