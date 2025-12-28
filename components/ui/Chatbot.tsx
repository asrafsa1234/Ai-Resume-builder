import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Sparkles, Navigation } from 'lucide-react';
import { createChatSession, sendChatMessage } from '../../services/geminiService';
import { ResumeData } from '../../types';

interface ChatbotProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
  resumeData: ResumeData;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ activeStep, setActiveStep, resumeData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: "Hi! I'm your Resume Assistant. I can help you write content or navigate the app. Try saying 'Go to Experience' or 'Write a summary for a Marketing Manager'." }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const session = createChatSession();
    setChatSession(session);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const getContextSummary = () => {
    return `
      Current Step Index: ${activeStep}
      Name: ${resumeData.personal.name}
      Job Title: ${resumeData.title}
      Experience Count: ${resumeData.experience.length}
      Education Count: ${resumeData.education.length}
      Skills: ${resumeData.skills.join(', ')}
    `;
  };

  const handleSend = async () => {
    if (!inputText.trim() || !chatSession) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const context = getContextSummary();
      const data = await sendChatMessage(chatSession, userMsg.text, context);
      
      const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: data.response };
      setMessages(prev => [...prev, aiMsg]);

      if (data.navigation_step !== null && data.navigation_step !== undefined) {
        if (data.navigation_step >= 0 && data.navigation_step <= 5) {
             setActiveStep(data.navigation_step);
        }
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: "Sorry, something went wrong." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                 <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                 <h3 className="font-bold text-sm">Resume Assistant</h3>
                 <div className="flex items-center gap-1 text-[10px] text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                    Online
                 </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1 items-center">
                     <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
                     <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
                     <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask to write a summary..."
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
              />
              <button 
                onClick={handleSend}
                disabled={!inputText.trim() || isLoading}
                className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-slate-700 rotate-90' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}
      >
         {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-7 h-7 text-white" />}
      </button>
    </div>
  );
};

export default Chatbot;