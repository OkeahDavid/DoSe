interface HeaderProps {
  onClearChat: () => void;
}

export default function Header({ onClearChat }: HeaderProps) {
    return (
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
              <button 
                onClick={onClearChat}
                className="px-4 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Clear Chat
              </button>
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
    );
  }