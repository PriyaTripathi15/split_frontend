import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Bot,
  SendHorizonal,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from "../utils/axios";
const ChatBotWidget = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newUserMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');

    try {
      const res = await axios.post('/chat', { message: input });
      const botMessage = { role: 'bot', content: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: '⚠️ Gemini is currently unavailable.' },
      ]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, expanded]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="bg-teal-500 hover:bg-teal-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-all"
        >
          <Bot className="w-8 h-8" />
        </button>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="fixed bottom-4 right-4 w-[380px] h-[520px] bg-white border border-cyan-400 rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-teal-500 text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2 font-semibold text-md">
                <Bot className="w-5 h-5" />
                Split-It AI Assistant
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="hover:bg-teal-600 p-1 rounded"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 bg-cyan-50 px-3 py-2 overflow-y-auto text-sm">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-2 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-lg shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-teal-100 text-gray-800'
                        : 'bg-white border border-cyan-300 text-gray-700'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-cyan-200 flex gap-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 border border-gray-300 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
                placeholder="Ask Gemini anything..."
              />
              <button
                onClick={sendMessage}
                className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-lg transition-all"
              >
                <SendHorizonal size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBotWidget;
