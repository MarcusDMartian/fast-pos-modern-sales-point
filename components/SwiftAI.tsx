
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, X, Send, Bot, User, Minimize2, Maximize2, BrainCircuit } from 'lucide-react';

const FastAI: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: t('ai.greeting') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen, isMinimized]);

  // Update initial message when language changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'bot') {
      setMessages([{ role: 'bot', text: t('ai.greeting') }]);
    }
  }, [i18n.language]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userText,
        config: {
          systemInstruction: t('ai.system_instruction')
        }
      });

      const botResponse = response.text || t('ai.model_error');
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error('Gemini API Error:', error);
      setMessages(prev => [...prev, { role: 'bot', text: t('ai.error') }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 w-24 h-24 bg-gradient-to-tr from-[var(--primary-600)] to-[var(--primary-700)] text-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(42,70,255,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[200] group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse opacity-50 group-hover:scale-150 transition-transform duration-1000"></div>
        <BrainCircuit size={40} strokeWidth={2.5} className="relative z-10" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-10 right-10 w-[420px] ${isMinimized ? 'h-24' : 'h-[650px]'} glass-modal shadow-[0_32px_64px_rgba(0,0,0,0.15)] rounded-[3.5rem] flex flex-col z-[200] overflow-hidden transition-all duration-500 animate-in slide-in-from-bottom border-white shadow-2xl`}>
      {/* Header */}
      <div className="p-8 bg-gradient-to-r from-[var(--primary-700)] to-[var(--primary-600)] text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-[1.2rem] backdrop-blur-md border border-white/20"><Bot size={24} /></div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-[0.2em] italic">Swift AI</h4>
            <span className="text-[9px] font-bold text-blue-200 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />{t('ai.status_online')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2 bg-red-400/20 text-white hover:bg-red-500 rounded-xl transition-all shadow-sm">
            <X size={18} strokeWidth={3} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-white/10">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom`}>
                <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm font-bold shadow-xl ${msg.role === 'user'
                    ? 'bg-[var(--primary-600)] text-white rounded-tr-none'
                    : 'glass-card text-[var(--primary-700)] rounded-tl-none border-white/60'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="glass-card p-4 rounded-2xl rounded-tl-none text-[var(--primary-700)] text-[10px] font-black italic uppercase tracking-widest bg-white/60">
                  {t('ai.thinking')}
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-white/30 border-t border-white/60">
            <div className="relative flex items-center gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder={isLoading ? t('ai.processing') : t('ai.placeholder')}
                className="flex-1 glass-card bg-white/60 px-8 py-5 rounded-3xl font-bold text-[var(--primary-700)] outline-none border-white focus:bg-white transition-all shadow-inner disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-16 h-16 bg-[var(--primary-600)] text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary-1000/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <Send size={24} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FastAI;
