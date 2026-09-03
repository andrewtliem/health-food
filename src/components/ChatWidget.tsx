import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  MapPin, 
  Clock, 
  HelpCircle, 
  Loader2
} from 'lucide-react';
import { sendChatMessage } from '../lib/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const QUICK_QUESTIONS = [
  'Is oat milk in stock?',
  'Where is the UNKLAB pickup counter?',
  'What 100% vegan snacks do you have?',
  'How does Midtrans QRIS payment work?',
];

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Halo! 🌱 Welcome to **Eden Healthy Market** at Universitas Klabat (UNKLAB)!\n\nI'm your AI store assistant. Ask me anything about:\n• Live in-store stock & prices\n• 100% Vegetarian, Vegan, & Gluten-Free items\n• Campus Click & Collect pickup & hours\n• Midtrans QRIS & payment options`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await sendChatMessage(text, history);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I had trouble connecting to the store inventory. Please try again or visit our counter at Universitas Klabat!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-eden-800 hover:bg-eden-900 text-white rounded-full shadow-xl hover:shadow-2xl transition-all active:scale-95 group border border-eden-700/60"
          aria-label="Open Eden AI Customer Service"
        >
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-eden-700 flex items-center justify-center text-eden-200">
              <Bot className="w-4 h-4" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-eden-800 animate-pulse" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold leading-tight flex items-center gap-1">
              <span>Ask Eden AI</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </div>
            <div className="text-[10px] text-eden-200 font-medium">
              Live Stock & UNKLAB Info
            </div>
          </div>
        </button>
      )}

      {/* Chat Window Dialog */}
      {isOpen && (
        <div 
          className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-[92vw] sm:w-[380px] h-[520px] max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-eden-900 via-eden-800 to-emerald-800 text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-eden-200 border border-white/20">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-eden-900" />
              </div>
              <div>
                <div className="font-serif font-bold text-sm tracking-tight flex items-center gap-1.5">
                  <span>Eden AI Assistant</span>
                  <span className="text-[9px] font-mono bg-eden-700/80 px-1.5 py-0.2 rounded font-semibold text-eden-100">
                    Edge AI
                  </span>
                </div>
                <div className="text-[10px] text-eden-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-eden-400" />
                  <span>UNKLAB Campus Store • Open 08:00-20:00</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-eden-200 hover:text-white hover:bg-white/10 transition"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Info Bar */}
          <div className="bg-oat-50/90 px-3 py-1.5 border-b border-oat-200 flex items-center justify-between text-[11px] text-stone-600">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-eden-600" />
              Store: Open Daily (WITA)
            </span>
            <span className="text-emerald-700 font-semibold">
              ⚡ Real-Time Stock Linked
            </span>
          </div>

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-eden-700 text-white flex items-center justify-center text-[10px] shrink-0 mt-1">
                    🌱
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-eden-700 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-stone-800 rounded-tl-xs border border-stone-200/90 shadow-2xs'
                  }`}
                >
                  <div>{msg.content}</div>
                  <div
                    className={`text-[9px] mt-1 text-right font-mono ${
                      msg.role === 'user' ? 'text-eden-200' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center text-[10px] shrink-0 mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2 text-stone-400 text-xs italic pl-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-eden-600" />
                <span>Checking UNKLAB live store inventory...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions */}
          <div className="p-2 bg-white border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-stone-400 shrink-0 flex items-center gap-1 pl-1">
              <HelpCircle className="w-3 h-3" />
              Ask:
            </span>
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                disabled={isSending}
                className="px-2.5 py-1 bg-oat-50 hover:bg-oat-100 text-stone-700 text-[11px] font-medium rounded-full border border-oat-200 shrink-0 transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about oats, tempeh, UNKLAB hours..."
              disabled={isSending}
              className="flex-1 px-3.5 py-2 bg-stone-100/80 border border-stone-200 rounded-full text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-eden-500 focus:bg-white transition"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputMessage.trim() || isSending}
              className="p-2 rounded-full bg-eden-700 hover:bg-eden-800 text-white disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95 shrink-0 shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Disclaimer */}
          <div className="bg-stone-50 px-3 py-1 text-center border-t border-stone-100">
            <span className="text-[9px] text-stone-400">
              Eden AI Assistant • Connected to Cloudflare Edge API & D1
            </span>
          </div>

        </div>
      )}
    </div>
  );
};
