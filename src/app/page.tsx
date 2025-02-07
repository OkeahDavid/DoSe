'use client';
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hi, I'm DoSe! 👋 Upload your documents and I'll help you understand them better. You can ask me anything about the content once uploaded."
    }
  ]);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-slate-900/50 backdrop-blur-md border-b border-slate-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🤖</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                DoSe
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-white transition-colors">
                About
              </button>
              <button className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-sm font-medium text-white transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* File Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Documents</h2>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    multiple
                    accept=".pdf,.docx,.txt"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-slate-700/50 border-2 border-slate-600 border-dashed rounded-xl hover:bg-slate-700/70 cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-slate-400">
                        {isUploading ? 'Uploading...' : 'Drop files or click to upload'}
                      </p>
                    </div>
                  </label>
                </div>
                <div className="text-sm text-slate-400">
                  Supported formats: PDF, DOCX, TXT
                </div>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pr-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.type === 'bot'
                          ? 'bg-slate-700/50 text-slate-100'
                          : 'bg-blue-500/20 text-blue-100'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="mt-4 relative">
                <input
                  type="text"
                  placeholder="Ask about your documents..."
                  className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}