import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, BrainCircuit, Bot, User, Loader2, Compass } from 'lucide-react';
import { HotelInfo } from '../types/hotel.ts';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: HotelInfo;
}

export const ConciergeModal: React.FC<ConciergeModalProps> = ({ isOpen, onClose, hotel }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Namaste and welcome! I am your AI Luxury Concierge and Pokhara Trip Sherpa at **Hotel Atrium** on Uday Marg. 

With deep knowledge of Lakeside, Annapurna trekking routes, sunrise viewpoints, and room options, I am here to help plan your perfect stay. How may I assist you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const suggestions = [
    "Plan a 3-day Pokhara itinerary from Hotel Atrium",
    "Which room is best for a couple wanting Annapurna mountain views?",
    "How do I arrange Sarangkot sunrise & paragliding?",
    "What is the luggage policy while trekking the Annapurna Circuit?",
  ];

  const handleSend = async (userText: string) => {
    const textToSend = userText.trim();
    if (!textToSend || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          history: newMessages.slice(0, -1),
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: "We are at your service! For immediate inquiries, please reach our front desk on WhatsApp at " + hotel.whatsapp + " or telephone " + hotel.phonePrimary + ".",
          },
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I am having temporary trouble connecting to the concierge knowledge base. Please feel free to call our 24/7 reception desk at " + hotel.phonePrimary + ".",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#18202a] text-stone-100 w-full max-w-2xl h-[85vh] max-h-[700px] rounded-2xl shadow-2xl border border-amber-500/30 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#141b24] border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                  Atrium Luxury Concierge
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                  <BrainCircuit className="w-3 h-3 text-amber-400" />
                  High Thinking Mode
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Pokhara trip planning, mountain treks &amp; bespoke stay advice
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-amber-600 text-stone-950 font-medium rounded-tr-none'
                    : 'bg-[#202b38] text-stone-200 border border-stone-800 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {m.content}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-stone-700 text-stone-200 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <BrainCircuit className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-[#202b38] border border-amber-500/30 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-amber-300 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>Formulating personalized Pokhara recommendations...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="p-3 bg-[#131922] border-t border-stone-800 overflow-x-auto">
          <div className="flex gap-2 text-[11px] whitespace-nowrap">
            <span className="text-stone-500 flex items-center gap-1 shrink-0 px-1">
              <Compass className="w-3 h-3 text-amber-400" />
              Suggestions:
            </span>
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="px-3 py-1 rounded-full bg-[#1e2733] hover:bg-stone-700 text-stone-300 hover:text-amber-300 border border-stone-700 transition-colors shrink-0"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#141b24] border-t border-stone-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about rooms, trek permits, Sarangkot, or Phewa Lake..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 bg-[#0f141a] border border-stone-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-stone-950 font-bold text-xs uppercase flex items-center justify-center transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
