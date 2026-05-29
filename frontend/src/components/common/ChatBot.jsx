import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { chatbotApi } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';

const WELCOME_MSG = {
  role: 'assistant',
  content: "Welcome to Silver Key Hotel! 🏨 I'm your AI concierge. I can help with room availability, pricing, amenities, directions, and more. How can I assist you today?",
  timestamp: new Date(),
};

const QUICK_REPLIES = [
  'What are your room rates?',
  'How do I get there?',
  'What amenities do you offer?',
  'Check-in timings?',
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(function () { return 'session-' + Date.now(); });
  const [isAiPowered, setIsAiPowered] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(function () {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(function () {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // FIX: sendMessage uses useCallback to avoid stale closures
  const sendMessage = useCallback(async function (overrideText) {
    var text = (overrideText || input).trim();
    if (!text || isLoading) return;

    var userMsg = { role: 'user', content: text, timestamp: new Date() };
    setMessages(function (prev) { return [...prev, userMsg]; });
    setInput('');
    setIsLoading(true);

    try {
      // Send last 8 messages for context
      var history = [];
      setMessages(function (prev) {
        history = [...prev].slice(-8).map(function (m) { return { role: m.role, content: m.content }; });
        return prev;
      });
      // Actually we need current messages + new user msg
      var historyForApi = [...messages.slice(-7), userMsg].map(function (m) {
        return { role: m.role, content: m.content };
      });

      var { data } = await chatbotApi.sendMessage(historyForApi, sessionId);

      if (isAiPowered === null) setIsAiPowered(data.aiPowered);

      setMessages(function (prev) {
        return [...prev, {
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        }];
      });
    } catch (err) {
      setMessages(function (prev) {
        return [...prev, {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please call us at +91 93228 00100 for immediate assistance.",
          timestamp: new Date(),
          isError: true,
        }];
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, sessionId, isAiPowered]);

  const handleQuickReply = function (reply) {
    // FIX: call sendMessage directly with the text, don't rely on state update timing
    sendMessage(reply);
  };

  const handleKeyDown = function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={function () { setIsOpen(!isOpen); }}
        className={'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-luxury flex items-center justify-center transition-all duration-300 ' + (
          isOpen ? 'bg-charcoal-800' : 'bg-gold-500 hover:bg-gold-600'
        )}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={24} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle size={24} className="text-charcoal-900" />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">1</span>
        )}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-sm shadow-luxury border border-charcoal-100 overflow-hidden flex flex-col"
            style={{ height: '480px' }}
          >
            {/* Header */}
            <div className="bg-charcoal-900 px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center">
                <Bot size={18} className="text-gold-400" />
              </div>
              <div>
                <div className="font-body font-bold text-white text-sm">Silver Key Concierge</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-charcoal-400 text-xs">
                    {isAiPowered === true ? 'AI-Powered' : isAiPowered === false ? 'Online' : 'Online'}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream">
              {messages.map(function (msg, i) {
                return (
                  <div key={i} className={'flex gap-2 ' + (msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                    <div className={'w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ' + (
                      msg.role === 'user' ? 'bg-gold-500/20' : 'bg-charcoal-800'
                    )}>
                      {msg.role === 'user' ? <User size={14} className="text-gold-600" /> : <Bot size={14} className="text-gold-400" />}
                    </div>
                    <div className={'max-w-[75%] px-3 py-2 rounded-sm text-sm leading-relaxed ' + (
                      msg.role === 'user'
                        ? 'bg-gold-500 text-charcoal-900 font-medium'
                        : msg.isError
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-white text-charcoal-700 shadow-sm border border-charcoal-100'
                    )}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-charcoal-800 flex items-center justify-center">
                    <Bot size={14} className="text-gold-400" />
                  </div>
                  <div className="bg-white px-4 py-3 rounded-sm border border-charcoal-100 shadow-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(function (i) {
                        return <span key={i} className="w-1.5 h-1.5 rounded-full bg-charcoal-400 animate-bounce" style={{ animationDelay: i * 0.15 + 's' }} />;
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies — show only at start */}
            {messages.length === 1 && (
              <div className="px-4 py-2 bg-parchment flex gap-2 overflow-x-auto">
                {QUICK_REPLIES.map(function (reply) {
                  return (
                    <button
                      key={reply}
                      onClick={function () { handleQuickReply(reply); }}
                      disabled={isLoading}
                      className="flex-shrink-0 text-xs bg-white border border-charcoal-200 text-charcoal-600 px-3 py-1.5 rounded-full hover:border-gold-400 hover:text-gold-600 transition-all disabled:opacity-50"
                    >
                      {reply}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-charcoal-100 bg-white flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={function (e) { setInput(e.target.value); }}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 text-sm px-3 py-2 border border-charcoal-200 rounded-sm focus:outline-none focus:border-gold-400 transition-colors"
                disabled={isLoading}
              />
              <button
                onClick={function () { sendMessage(); }}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 bg-gold-500 text-charcoal-900 rounded-sm flex items-center justify-center hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
