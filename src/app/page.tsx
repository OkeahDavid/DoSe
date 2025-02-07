// src/app/page.tsx
'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import ChatWindow from '@/components/ChatWindow';

type MessageType = {
  type: 'bot' | 'user';
  content: string;
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const files = Array.from(e.target.files);

    try {
      for (const file of files) {
        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          setMessages(prev => [...prev, {
            type: 'bot',
            content: `${file.name} is too large. Maximum file size is 10MB.`
          }]);
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
        
        setMessages(prev => [...prev, {
          type: 'bot',
          content: `Successfully uploaded ${file.name}! You can now ask questions about its content.`
        }]);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "Sorry, there was an error uploading the file. Please try again."
      }]);
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
    }
  };

  const handleClearChat = () => {
    setMessages([{
      type: 'bot',
      content: "Hi, I'm DoSe! 👋 Upload your documents and I'll help you understand them better. You can ask me anything about the content once uploaded."
    }]);
    setUploadedFiles([]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Header onClearChat={handleClearChat} />
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <FileUpload 
            isUploading={isUploading} 
            onFileSelect={handleFileSelect}
            uploadedFiles={uploadedFiles} 
          />
          <ChatWindow 
            messages={messages} 
            onSendMessage={handleSendMessage}
            isProcessing={isUploading} 
          />
        </div>
      </div>
    </main>
  );
}