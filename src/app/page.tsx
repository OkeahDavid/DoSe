// src/app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import ChatWindow from '@/components/ChatWindow';

type MessageType = {
  type: 'bot' | 'user';
  content: string;
};

type NotificationType = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
};

export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      type: 'bot',
      content: "Hi, I'm DoSe! 👋 Upload your documents and I'll help you understand them better. You can ask me anything about the content once uploaded."
    }
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load saved chat and files from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem('doseMessages');
    const savedFiles = localStorage.getItem('doseFiles');
    const savedTheme = localStorage.getItem('doseTheme');
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    
    if (savedFiles) {
      setUploadedFiles(JSON.parse(savedFiles));
    }

    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
  }, []);

  // Save messages, files and theme to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('doseMessages', JSON.stringify(messages));
  }, [messages]);
  
  useEffect(() => {
    localStorage.setItem('doseFiles', JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  useEffect(() => {
    localStorage.setItem('doseTheme', theme);
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications((currentNotifications) => currentNotifications.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const newNotification = {
      id: Date.now().toString(),
      message,
      type
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const files = Array.from(e.target.files);

    try {
      for (const file of files) {
        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          addNotification(`${file.name} is too large. Maximum file size is 10MB.`, 'error');
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        setUploadedFiles(prev => [...prev, data.fileName]);
        
        // Use notification instead of chat message
        addNotification(`Successfully uploaded ${file.name}! You can now ask questions about its content.`, 'success');
      }
    } catch (error) {
      console.error('Upload error:', error);
      addNotification("Sorry, there was an error uploading the file. Please try again.", 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
  
    // Add user message to chat
    setMessages(prev => [...prev, {
      type: 'user',
      content: message
    }]);
  
    // If no files are uploaded yet
    if (uploadedFiles.length === 0) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "Please upload some documents first so I can help you with your questions!"
      }]);
      return;
    }
  
    // Set processing state to true
    setIsProcessing(true);
    
    try {
      console.log('📤 Sending message:', { message, files: uploadedFiles });
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: uploadedFiles
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API error:', errorData);
        throw new Error(errorData.error || 'API request failed');
      }
  
      const data = await response.json();
      console.log('✅ Received response:', data);
      
      setMessages(prev => [...prev, {
        type: 'bot',
        content: data.response
      }]);
    } catch (error) {
      console.error('❌ Chat error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "I apologize, but I'm having trouble processing your question. Please try again."
      }]);
    } finally {
      // Set processing state back to false
      setIsProcessing(false);
    }
  };

  const handleClearChat = () => {
    const initialMessage = {
      type: 'bot' as const,
      content: "Hi, I'm DoSe! 👋 Upload your documents and I'll help you understand them better. You can ask me anything about the content once uploaded."
    };
    setMessages([initialMessage]);
    setUploadedFiles([]);
    localStorage.removeItem('doseMessages');
    localStorage.removeItem('doseFiles');
  };

  const handleFileDelete = async (fileName: string) => {
    try {
      // Remove the file from the UI immediately for better UX
      setUploadedFiles(prev => prev.filter(file => file !== fileName));
      
      // Use notification instead of chat message
      addNotification(`Removed ${fileName} from your session.`, 'info');
      
      // Delete the file from the server
      await fetch(`/api/delete?file=${encodeURIComponent(fileName)}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      addNotification(`Error removing ${fileName}.`, 'error');
    }
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <main className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900 to-slate-800 text-white' : 'bg-gradient-to-b from-slate-100 to-white text-slate-900'}`}>
      <Header onClearChat={handleClearChat} onToggleTheme={toggleTheme} currentTheme={theme} />
      
      {/* Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-0 
              ${notification.type === 'success' ? 'bg-green-500/90' : 
                notification.type === 'error' ? 'bg-red-500/90' : 'bg-blue-500/90'} 
              text-white backdrop-blur-md flex items-start`}
          >
            <div className="flex-1">{notification.message}</div>
            <button 
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              className="ml-2 text-white/80 hover:text-white"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      <div className={`pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <FileUpload 
            isUploading={isUploading} 
            onFileSelect={handleFileSelect}
            uploadedFiles={uploadedFiles} 
            onFileDelete={handleFileDelete}
            theme={theme}
          />
          <ChatWindow 
            messages={messages} 
            onSendMessage={handleSendMessage}
            isProcessing={isProcessing || isUploading} 
            theme={theme}
          />
        </div>
      </div>
    </main>
  );
}