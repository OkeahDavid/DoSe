interface HeaderProps {
  onClearChat: () => void;
  onToggleTheme: () => void;
  currentTheme: 'dark' | 'light';
}

export default function Header({ onClearChat, onToggleTheme, currentTheme }: HeaderProps) {
    return (
      <nav className={`fixed top-0 w-full ${currentTheme === 'dark' ? 'bg-slate-900/50 backdrop-blur-md border-slate-700' : 'bg-white/50 backdrop-blur-md border-slate-200'} border-b z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🤖</div>
              <h1 className={`text-2xl font-bold ${currentTheme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text' : 'bg-gradient-to-r from-blue-600 to-purple-700 text-transparent bg-clip-text'}`}>
                DoSe
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={onToggleTheme}
                className={`p-2 rounded-full ${currentTheme === 'dark' ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'} transition-colors`}
                aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {currentTheme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                  </svg>
                )}
              </button>
              <button 
                onClick={onClearChat}
                className={`px-4 py-2 rounded-full text-sm font-medium ${currentTheme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}
              >
                Clear Chat
              </button>
              <button className={`hidden md:block px-4 py-2 rounded-full text-sm font-medium ${currentTheme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>
                About
              </button>
              <button className={`px-4 py-2 rounded-full ${currentTheme === 'dark' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-sm font-medium text-white transition-colors`}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }