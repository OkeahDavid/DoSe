import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { AnchorHTMLAttributes, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface ChatMessageProps {
  type: 'bot' | 'user';
  content: string;
  theme?: 'dark' | 'light';
}

export default function ChatMessage({ type, content, theme = 'dark' }: ChatMessageProps) {
  const components: Components = {
    a: (props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => (
      <a 
        {...props} 
        className={`${theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'} underline`}
        target="_blank" 
        rel="noopener noreferrer" 
      />
    ),
    code: ({ children, inline, ...props }: { children?: ReactNode; inline?: boolean; className?: string }) => {
      return inline 
        ? <code 
            {...props} 
            className={`${
              theme === 'dark' 
                ? 'bg-slate-800/80 text-slate-200' 
                : 'bg-slate-100/80 text-slate-800'
            } px-1 py-0.5 rounded text-xs`} 
          >
            {children}
          </code>
        : <code 
            {...props} 
            className={`block ${
              theme === 'dark' 
                ? 'bg-slate-800/80 text-slate-200' 
                : 'bg-slate-100/80 text-slate-800'
            } p-2 rounded text-xs overflow-x-auto`} 
          >
            {children}
          </code>
    },
    ul: (props: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>) => (
      <ul {...props} className="list-disc pl-5 space-y-1" />
    ),
    ol: (props: DetailedHTMLProps<HTMLAttributes<HTMLOListElement>, HTMLOListElement>) => (
      <ol {...props} className="list-decimal pl-5 space-y-1" />
    ),
    table: (props: DetailedHTMLProps<HTMLAttributes<HTMLTableElement>, HTMLTableElement>) => (
      <div className="overflow-x-auto">
        <table {...props} className="border-collapse text-sm my-2" />
      </div>
    ),
    th: (props: DetailedHTMLProps<HTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>) => (
      <th 
        {...props} 
        className={`border ${
          theme === 'dark' 
            ? 'border-slate-600 bg-slate-800/50' 
            : 'border-slate-300 bg-slate-100'
        } px-3 py-1`} 
      />
    ),
    td: (props: DetailedHTMLProps<HTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>) => (
      <td 
        {...props} 
        className={`border ${
          theme === 'dark' 
            ? 'border-slate-600' 
            : 'border-slate-300'
        } px-3 py-1`} 
      />
    )
  };

  return (
    <div className={`flex ${type === 'bot' ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          type === 'bot'
            ? theme === 'dark' 
              ? 'bg-slate-700/50 text-slate-100' 
              : 'bg-slate-200/70 text-slate-800'
            : theme === 'dark'
              ? 'bg-blue-500/20 text-blue-100'
              : 'bg-blue-500/10 text-blue-800'
        }`}
      >
        {type === 'bot' ? (
          <div className={`prose ${theme === 'dark' ? 'prose-invert' : ''} prose-sm max-w-none`}>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={components}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  );
}