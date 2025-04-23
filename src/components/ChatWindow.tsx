import { useState } from 'react';
import ChatMessage from './ChatMessage';

// ChatInput Component
interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
  theme: 'dark' | 'light';
}

function ChatInput({ onSendMessage, isDisabled, theme }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !isDisabled) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="mt-4 relative">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Ask about your documents..."
        disabled={isDisabled}
        className={`w-full px-4 py-3 ${
          theme === 'dark' 
            ? 'bg-slate-700/30 border-slate-600 text-white placeholder-slate-400' 
            : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-500'
        } border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50`}
      />
      <button 
        onClick={handleSend}
        disabled={isDisabled}
        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 ${
          theme === 'dark' 
            ? 'bg-blue-500 hover:bg-blue-600' 
            : 'bg-blue-600 hover:bg-blue-700'
        } rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-blue-500`}
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  );
}

// Main ChatWindow Component
interface ChatWindowProps {
  messages: Array<{ type: 'bot' | 'user'; content: string }>;
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  theme: 'dark' | 'light';
}

export default function ChatWindow({ messages, onSendMessage, isProcessing, theme }: ChatWindowProps) {
  return (
    <div className="lg:col-span-3">
      <div className={`${
        theme === 'dark' 
          ? 'bg-slate-800/50 backdrop-blur-sm border-slate-700' 
          : 'bg-white/70 backdrop-blur-sm border-slate-200'
      } rounded-2xl p-6 border h-[600px] flex flex-col`}>
        {/* Messages */}
        <div className={`flex-1 overflow-y-auto space-y-4 ${
          theme === 'dark' 
            ? 'scrollbar-thumb-slate-700' 
            : 'scrollbar-thumb-slate-300'
        } scrollbar-thin scrollbar-track-transparent pr-4`}>
          {messages.map((message, index) => (
            <ChatMessage key={index} {...message} theme={theme} />
          ))}
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center py-2 text-slate-400">
            <div className="animate-pulse flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-slate-400' : 'bg-slate-600'} animate-bounce`}></div>
              <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-slate-400' : 'bg-slate-600'} animate-bounce delay-100`}></div>
              <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-slate-400' : 'bg-slate-600'} animate-bounce delay-200`}></div>
            </div>
          </div>
        )}

        {/* Input */}
        <ChatInput onSendMessage={onSendMessage} isDisabled={isProcessing} theme={theme} />
      </div>
    </div>
  );
}