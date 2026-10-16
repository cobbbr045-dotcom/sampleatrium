import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  BrainCircuit,
  Bot,
  User,
  Loader2,
  Compass,
  RotateCcw,
  Calendar,
  MessageCircle,
  Phone,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { HotelInfo, RoomType } from '../types/hotel.ts';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  source?: 'ai' | 'knowledge-engine';
}

interface ConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: HotelInfo;
  rooms?: RoomType[];
  onOpenBooking?: (room?: RoomType) => void;
}

const DEFAULT_WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content: `Namaste and welcome to **Hotel Atrium** on tranquil Uday Marg, Lakeside, Pokhara!

I am your **Atrium Luxury Concierge** and Pokhara Trip Sherpa. I am equipped with our verified property details, room options, 24-hour solar hot showers, and Annapurna trek recommendations.

How may I assist you today? You can ask about our rooms, compare rates in Nepalese Rupees, plan a Pokhara itinerary, or explore Sarangkot sunrise viewpoints.`,
  source: 'knowledge-engine',
};

const SUGGESTED_QUESTIONS = [
  "What room options do you offer?",
  "How can I reserve a room?",
  "Plan a 3-day Pokhara itinerary.",
  "How do I reach Phewa Lake?",
  "What are the hotel's verified amenities?",
  "Can you help me compare rooms?",
];

// Lightweight safe formatter for bold text and bullet points without raw HTML injection
function formatMessageContent(text: string): React.ReactNode {
  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    // Process **bold** markers
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const formattedLine = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={partIdx} className="font-bold text-amber-200">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    const isBullet = line.trim().startsWith('•') || line.trim().startsWith('*') || line.trim().startsWith('-');
    const isNumbered = /^\d+\.\s/.test(line.trim());

    if (isBullet || isNumbered) {
      return (
        <div key={lineIdx} className="flex items-start gap-2 my-1 pl-1">
          <span className="text-amber-400 shrink-0 select-none">•</span>
          <span className="flex-1 min-w-0">
            {line.trim().replace(/^([•*-]|\d+\.)\s*/, '')}
          </span>
        </div>
      );
    }

    if (line.trim() === '') {
      return <div key={lineIdx} className="h-2" />;
    }

    return (
      <div key={lineIdx} className="min-w-0 break-words leading-relaxed">
        {formattedLine}
      </div>
    );
  });
}

export const ConciergeModal: React.FC<ConciergeModalProps> = ({
  isOpen,
  onClose,
  hotel,
  rooms = [],
  onOpenBooking,
}) => {
  const [messages, setMessages] = useState<Message[]>([DEFAULT_WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastFailedQuery, setLastFailedQuery] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Lock body scroll and handle accessibility focus restoration
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        textareaRef.current?.focus();
        scrollToBottom();
      }, 100);
    } else {
      document.body.style.overflow = '';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard Escape listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-scroll when messages update
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (userText: string) => {
    const textToSend = userText.trim();
    if (!textToSend || loading) return;

    setLastError(null);
    setLastFailedQuery(null);

    const userMsg: Message = { role: 'user', content: textToSend };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          history: updatedMessages.slice(0, -1).map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
            source: data.source || 'ai',
          },
        ]);
      } else {
        const errorMsg = data.error || 'Unable to generate response.';
        setLastError(errorMsg);
        setLastFailedQuery(textToSend);
      }
    } catch {
      setLastError('Network connection problem. Please check your internet connection or retry.');
      setLastFailedQuery(textToSend);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDownInTextarea = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handleResetChat = () => {
    setMessages([DEFAULT_WELCOME_MESSAGE]);
    setLastError(null);
    setLastFailedQuery(null);
    setInput('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Atrium Luxury Concierge"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="bg-[#141b24] text-stone-100 w-full sm:max-w-2xl lg:max-w-3xl h-full sm:h-[88vh] sm:max-h-[760px] sm:rounded-2xl shadow-2xl border-0 sm:border border-amber-500/30 flex flex-col overflow-hidden min-w-0"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0f141b] border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 flex items-center justify-center shadow-lg shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif font-bold text-base sm:text-lg text-white truncate">
                  Atrium Luxury Concierge
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium shrink-0">
                  <BrainCircuit className="w-3 h-3 text-amber-400" />
                  <span>Verified Knowledge</span>
                </span>
              </div>
              <p className="text-[11px] text-stone-400 truncate">
                Lakeside, Pokhara • Rooms, Trekking Guidance &amp; Bespoke Stay Advice
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              onClick={handleResetChat}
              className="p-2 rounded-lg text-stone-400 hover:text-amber-300 hover:bg-stone-800 transition-colors cursor-pointer"
              title="Reset conversation"
              aria-label="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              title="Close concierge (Esc)"
              aria-label="Close concierge"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Action Ribbon */}
        <div className="bg-[#18202a] px-4 py-2 border-b border-stone-800 flex items-center justify-between gap-2 overflow-x-auto text-[11px] shrink-0">
          <div className="text-stone-400 hidden md:block">
            Direct Concierge Desk:
          </div>
          <div className="flex items-center gap-2 ml-auto">
            {onOpenBooking && (
              <button
                onClick={() => onOpenBooking(rooms[0])}
                className="px-2.5 py-1 rounded bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 font-semibold border border-amber-500/30 flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              >
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>Reserve a Room</span>
              </button>
            )}
            <a
              href={`https://wa.me/${hotel.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1 transition-colors shrink-0"
            >
              <MessageCircle className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${hotel.phonePrimary}`}
              className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold border border-stone-700 flex items-center gap-1 transition-colors shrink-0"
            >
              <Phone className="w-3 h-3 text-stone-400" />
              <span>Call Front Desk</span>
            </a>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div
          className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5"
          aria-live="polite"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 min-w-0 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 mt-1 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm shadow-md min-w-0 break-words ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-medium rounded-tr-none shadow-amber-900/20'
                    : 'bg-[#1b2430] text-stone-200 border border-stone-800/80 rounded-tl-none shadow-black/30'
                }`}
                style={{ overflowWrap: 'anywhere' }}
              >
                {formatMessageContent(m.content)}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-stone-700 text-stone-200 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 justify-start items-center animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div className="bg-[#1b2430] border border-amber-500/30 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-amber-300 flex items-center gap-2.5">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>Consulting verified hotel knowledge base &amp; local Pokhara guide...</span>
              </div>
            </div>
          )}

          {/* Error & Retry banner */}
          {lastError && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="truncate">{lastError}</span>
              </div>
              {lastFailedQuery && (
                <button
                  onClick={() => handleSend(lastFailedQuery)}
                  className="px-3 py-1 rounded bg-red-800 hover:bg-red-700 text-white font-bold text-[11px] flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Question Chips (Properly Wrapped & Contained, Zero Overflow) */}
        <div className="p-3 bg-[#0f141b] border-t border-stone-800/80 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-amber-400/90 font-medium mb-2">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Suggested Questions:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 sm:max-h-none overflow-y-auto pr-1">
            {SUGGESTED_QUESTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(s)}
                disabled={loading}
                className="px-3 py-1.5 rounded-full bg-[#1b2430] hover:bg-amber-600/20 hover:border-amber-500/50 text-stone-300 hover:text-amber-200 text-[11px] sm:text-xs border border-stone-700/70 transition-all cursor-pointer text-left focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#141b24] border-t border-stone-800 shrink-0 pb-safe">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Ask about rooms, rates in NPR, Phewa Lake, Sarangkot, trek luggage..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDownInTextarea}
                disabled={loading}
                className="w-full bg-[#0b0f14] border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400 disabled:opacity-50 resize-none max-h-32 min-h-[42px]"
                style={{ overflowWrap: 'anywhere' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-[42px] px-4 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-stone-950 font-bold text-xs uppercase flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0 active:scale-95"
              aria-label="Send message to concierge"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-stone-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>Always verified with Hotel Atrium records</span>
          </div>
        </div>
      </div>
    </div>
  );
};
