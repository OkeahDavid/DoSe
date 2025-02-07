import { useState } from 'react';

interface FileUploadProps {
    isUploading: boolean;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    uploadedFiles: string[];
}

export default function FileUpload({ isUploading, onFileSelect, uploadedFiles }: FileUploadProps) {
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
              onChange={onFileSelect}
            />
            <label
              htmlFor="file-upload"
              className={`flex flex-col items-center justify-center w-full h-32 px-4 transition 
                ${dragActive 
                  ? 'bg-slate-600/50 border-blue-500' 
                  : 'bg-slate-700/50 border-slate-600'} 
                border-2 border-dashed rounded-xl hover:bg-slate-700/70 cursor-pointer`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mb-3" />
                ) : (
                  <svg 
                    className="w-8 h-8 mb-3 text-slate-400" 
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
                <p className="text-sm text-slate-400">
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
              <h3 className="text-sm font-medium text-slate-300 mb-2">Uploaded Files:</h3>
              <div className="space-y-2">
                {uploadedFiles.map((fileName, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-2 text-sm text-slate-400 bg-slate-700/30 p-2 rounded-lg"
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                    <span className="truncate">{fileName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="text-sm text-slate-400">
              Supported formats: PDF, DOCX, TXT
            </div>
            <div className="text-xs text-slate-500">
              Maximum file size: 10MB
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}