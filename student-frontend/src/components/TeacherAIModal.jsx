import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2, Square } from 'lucide-react';
import axios from 'axios';

const TeacherAIModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi there! I am your Global Teacher AI Assistant. How can I help you analyze your classroom today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const fullTextRef = useRef('');

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    // Reset chat when opened
    if (isOpen) {
      setMessages([{ role: 'ai', text: `Hi there! I am your Global Teacher AI Assistant. How can I help you analyze your classroom today?` }]);
      setIsTyping(false);
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/teacher-ai', 
        { message: userMessage },
        { headers: { 'x-user-role': 'teacher' } }
      );
      
      const responseText = response.data.reply;
      fullTextRef.current = responseText;
      
      setIsLoading(false);
      setIsTyping(true);
      
      // Inject blank message for AI
      setMessages(prev => [...prev, { role: 'ai', text: '' }]);
      
      let i = 0;
      typingIntervalRef.current = setInterval(() => {
        if (i < responseText.length) {
          setMessages(prev => {
            const newM = [...prev];
            newM[newM.length - 1].text = responseText.slice(0, i + 1);
            return newM;
          });
          i++;
        } else {
          clearInterval(typingIntervalRef.current);
          setIsTyping(false);
        }
      }, 20);

    } catch (error) {
      console.error(error);
      setIsLoading(false);
      const errMsg = error.response?.data?.message || "Failed to reach AI. Ensure server is running.";
      setMessages(prev => [...prev, { role: 'ai', text: `⚠️ Error: ${errMsg}` }]);
    }
  };

  const handleStop = () => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    setIsTyping(false);
    
    // Snap to full text immediately when stopped
    setMessages(prev => {
      const newM = [...prev];
      if (newM[newM.length - 1].role === 'ai') {
        newM[newM.length - 1].text = fullTextRef.current;
      }
      return newM;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col h-[600px] max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-indigo-600 text-white rounded-t-2xl flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Global AI Assistant</h3>
              <p className="text-xs text-indigo-100 opacity-90">Analyzing: Full Classroom Roster</p>
            </div>
          </div>
          <button onClick={onClose} className="text-indigo-100 hover:text-white transition-colors bg-indigo-700/50 hover:bg-indigo-700 p-2 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 shadow-sm ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>

                <div className={`p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'}`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>

              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%] flex-row">
                <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-1 shadow-sm">
                  <Bot size={16} />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-500 rounded-tl-sm shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm font-medium">Tutor is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 rounded-b-2xl">
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Ask the Global Assistant for class insights..."
              className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-3 outline-none transition-all text-slate-700 placeholder:text-slate-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSend()}
              disabled={isLoading || isTyping}
            />
            {isTyping ? (
              <button 
                onClick={handleStop}
                className="bg-slate-800 hover:bg-slate-900 text-white p-3 rounded-xl shadow-md transition-colors"
                title="Stop printing"
              >
                <Square size={20} className="fill-current" />
              </button>
            ) : (
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Send size={20} className="-ml-1 -rotate-45 group-hover:rotate-0 transition-transform" />
              </button>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TeacherAIModal;
