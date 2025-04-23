import { useState } from 'react';

interface FileUploadProps {
    isUploading: boolean;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    uploadedFiles: string[];
    onFileDelete?: (fileName: string) => void;
    theme?: 'dark' | 'light';
}

export default function FileUpload({ 
  isUploading, 
  onFileSelect, 
  uploadedFiles,
  onFileDelete = () => {},
  theme = 'dark'
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const event = {
        target: {
          files: files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      onFileSelect(event);
    }
  };

  return (
    <div className="lg:col-span-1 mb-6 lg:mb-0">
      <div className={`${
        theme === 'dark'
          ? 'bg-slate-800/50 backdrop-blur-sm border-slate-700'
          : 'bg-white/70 backdrop-blur-sm border-slate-200'
      } rounded-2xl p-6 border`}>
        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-4`}>Documents</h2>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="file"
              className="hidden"
              id="file-upload"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={onFileSelect}
            />
            <label
              htmlFor="file-upload"
              className={`flex flex-col items-center justify-center w-full h-32 px-4 transition 
                ${dragActive 
                  ? theme === 'dark'
                    ? 'bg-slate-600/50 border-blue-500'
                    : 'bg-slate-200/70 border-blue-500'
                  : theme === 'dark'
                    ? 'bg-slate-700/50 border-slate-600'
                    : 'bg-slate-100/70 border-slate-300'
                } 
                border-2 border-dashed rounded-xl ${theme === 'dark' ? 'hover:bg-slate-700/70' : 'hover:bg-slate-200/70'} cursor-pointer`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${theme === 'dark' ? 'border-slate-400' : 'border-slate-600'} mb-3`} />
                ) : (
                  <svg 
                    className={`w-8 h-8 mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                    />
                  </svg>
                )}
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {isUploading 
                    ? 'Uploading...' 
                    : dragActive 
                      ? 'Drop files here' 
                      : 'Drop files or click to upload'}
                </p>
              </div>
            </label>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} mb-2`}>Uploaded Files:</h3>
              <div className="space-y-2">
                {uploadedFiles.map((fileName, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between text-sm ${
                      theme === 'dark'
                        ? 'text-slate-400 bg-slate-700/30'
                        : 'text-slate-600 bg-slate-100'
                    } p-2 rounded-lg`}
                  >
                    <div className="flex items-center space-x-2 truncate pr-2">
                      <svg 
                        className="w-4 h-4 flex-shrink-0" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                        />
                      </svg>
                      <span className="truncate">{fileName}</span>
                    </div>
                    <button 
                      onClick={() => onFileDelete(fileName)}
                      className={`p-1 ${
                        theme === 'dark'
                          ? 'hover:bg-red-500/20 text-slate-400 hover:text-red-400'
                          : 'hover:bg-red-100 text-slate-500 hover:text-red-500'
                      } rounded-full transition-colors`}
                      aria-label="Delete file"
                    >
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Supported formats: PDF, DOCX, TXT
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
              Maximum file size: 10MB
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}