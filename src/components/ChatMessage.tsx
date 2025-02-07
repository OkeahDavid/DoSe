interface ChatMessageProps {
    type: 'bot' | 'user';
    content: string;
  }
  
  export default function ChatMessage({ type, content }: ChatMessageProps) {
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