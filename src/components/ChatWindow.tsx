import { useState } from 'react';

// ChatMessage Component
interface ChatMessageProps {
  type: 'bot' | 'user';
  content: string;
}

function ChatMessage({ type, content }: ChatMessageProps) {
  return (
    <div className={`flex ${type === 'bot' ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          type === 'bot'
            ? 'bg-slate-700/50 text-slate-100'
            : 'bg-blue-500/20 text-blue-100'
        }`}
      >
        {content}
      </div>
    </div>
  );
}

// ChatInput Component
interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
}

function ChatInput({ onSendMessage, isDisabled }: ChatInputProps) {
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
        className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50"
      />
      <button 
        onClick={handleSend}
        disabled={isDisabled}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-blue-500"
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
}

export default function ChatWindow({ messages, onSendMessage, isProcessing }: ChatWindowProps) {
  return (
    <div className="lg:col-span-3">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 h-[600px] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pr-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} {...message} />
          ))}
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center py-2 text-slate-400">
            <div className="animate-pulse flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-200"></div>
            </div>
          </div>
        )}

        {/* Input */}
        <ChatInput onSendMessage={onSendMessage} isDisabled={isProcessing} />
      </div>
    </div>
  );
}