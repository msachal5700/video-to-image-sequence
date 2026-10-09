import React, { useCallback, useState, useId } from 'react';
import { UploadCloud, FileVideo, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect }) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCount, setSelectedCount] = useState(0);
  // Unique id so the <label> activates the input natively — no programmatic
  // .click() on a display:none input, which browsers may silently ignore
  // (Clarity showed first-click dead clicks on this zone).
  const inputId = useId();

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
    // Reset so the same file can be chosen again (e.g. after "Convert Another"
    // the input still holds the previous selection and onChange would not fire).
    e.target.value = '';
  }, []);

  const validateAndPassFiles = (files: FileList) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('video/'));
    
    if (validFiles.length === 0) {
      setError(t('dropzone.invalid', { defaultValue: 'Please upload a valid video file.' }));
      return;
    }
    
    setSelectedCount(validFiles.length);
    validFiles.forEach(file => onFileSelect(file));
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
    >
      <input
        id={inputId}
        type="file"
        multiple
        accept="video/mp4,video/quicktime,video/webm"
        className="sr-only"
        onChange={handleFileInput}
      />
      <label htmlFor={inputId} className="block cursor-pointer">

      {selectedCount > 1 && (
        <div className="absolute top-4 right-4 bg-cyan-900/80 text-cyan-400 text-xs font-bold px-3 py-1.5 rounded-full border border-cyan-800">
          {t('dropzone.selected', { count: selectedCount, defaultValue: `${selectedCount} videos selected` })}
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
                {t('dropzone.drop')}
              </p>
              <p className="text-gray-500 text-sm mb-1">
                {t('dropzone.support')}
              </p>
              <p className="text-cyan-400 text-xs">{t('dropzone.browse')}</p>
            </>
          )}
        </div>
      </div>
      </label>
    </div>
  );
};

export default Dropzone;