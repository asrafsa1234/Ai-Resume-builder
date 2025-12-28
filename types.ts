export interface User {
  email: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ResumeSection {
  id: string;
  type: 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'custom';
  title: string;
  content: string | any; // Simplified for this demo
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  date: string;
  points: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export interface ResumeTheme {
  primaryColor: string;
  fontHeading: string;
  fontBody: string;
}

export interface ResumeData {
  title: string;
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  theme: ResumeTheme;
}

export interface Resume {
  id: string;
  title: string;
  sections: ResumeSection[];
  lastModified: Date;
}

export interface TemplateItem {
  image: string;
  title: string;
  subtitle: string;
  handle: string;
  borderColor: string;
  gradient: string;
  url?: string;
  id: string;
}