/**
 * Drag-and-drop video upload zone.
 *
 * Wraps a native file input so keyboard users can still choose "Browse"
 * without implementing redundant keyboard handlers. The drag visual feedback is
 * progressive disclosure: useful if you know about drag-and-drop, invisible if
 * you do not.
 */

import React, { memo, useCallback, useRef, useState } from 'react';

interface VideoDropzoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

const VideoDropzoneComponent = ({ onFile, disabled = false }: VideoDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (file && !disabled) onFile(file);
    },
    [onFile, disabled]
  );

  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current += 1;
    if (event.dataTransfer.items.length > 0) setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      if (disabled) return;

      const file = event.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      handleFile(file);
      // Reset so the same file can be chosen again immediately after clearing.
      if (inputRef.current) inputRef.current.value = '';
    },
    [handleFile]
  );

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${
        isDragging
          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10'
          : 'border-gray-300 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50'
      } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-cyan-400'}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={handleInputChange}
        disabled={disabled}
        className="sr-only"
        id="fp-video-upload"
      />
      <label
        htmlFor="fp-video-upload"
        className={`flex min-h-[240px] flex-col items-center justify-center gap-4 px-6 py-12 text-center ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div
          aria-hidden="true"
          className={`text-6xl transition-transform ${isDragging ? 'scale-110' : 'scale-100'}`}
        >
          🎬
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {isDragging ? 'Drop your video here' : 'Choose or drag a video'}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            MP4, MOV, or WEBM up to 500MB
          </p>
        </div>
        <span className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-700">
          Browse files
        </span>
      </label>
    </div>
  );
};

export const VideoDropzone = memo(VideoDropzoneComponent);
VideoDropzone.displayName = 'VideoDropzone';
