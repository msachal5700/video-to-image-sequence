import React, { useCallback, useState, useRef } from 'react';
import { UploadCloud, FileVideo, AlertCircle } from 'lucide-react';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndPassFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndPassFiles(e.target.files);
    }
  }, []);

  const validateAndPassFiles = (files: FileList) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('video/'));
    
    if (validFiles.length === 0) {
      setError('Please upload a valid video file.');
      return;
    }
    
    setSelectedCount(validFiles.length);
    validFiles.forEach(file => onFileSelect(file));
  };

  const handleZoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 font-sans my-4 relative
        ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/30'
            : 'border-gray-700 bg-gray-900 hover:border-gray-600 hover:bg-gray-900/80'
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleZoneClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="video/mp4,video/quicktime,video/webm"
        className="hidden"
        onChange={handleFileInput}
      />

      {selectedCount > 1 && (
        <div className="absolute top-4 right-4 bg-cyan-900/80 text-cyan-400 text-xs font-bold px-3 py-1.5 rounded-full border border-cyan-800">
          {selectedCount} videos selected
        </div>
      )}

      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        {error ? (
          <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
        ) : (
          <div className="text-5xl mb-4 group-hover:text-cyan-400">📁</div>
        )}

        <div className="space-y-2">
          {error ? (
            <p className="text-red-400 font-medium">{error}</p>
          ) : (
            <>
              <p className="text-white font-semibold text-lg mb-2">
                Drop your video here
              </p>
              <p className="text-gray-500 text-sm mb-1">
                MP4, MOV, WEBM supported · Large files depend on your device and browser · Drop multiple files for batch
              </p>
              <p className="text-cyan-400 text-xs">or click to browse</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dropzone;