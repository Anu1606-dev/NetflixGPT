import React, { useRef, useState } from 'react';
import useImageSearch from '../hooks/useImageSearch';
import MovieDetailCard from './MovieDetailCard';

const ImageSearchModal = ({ onClose }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const { identifyImage, preview, isSearching, result, error, reset } = useImageSearch();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    identifyImage(file);
  };

  const handleFileInputChange = (e) => {
    handleFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[60] overflow-y-auto flex flex-col">
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-white/10 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <h1 className="text-sm sm:text-base font-semibold">Identify from Image</h1>
        </div>
        <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-white transition">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 py-8 sm:py-12">
        {!preview && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full max-w-md aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition ${
              isDragging ? "border-red-500 bg-red-500/5" : "border-gray-600 hover:border-gray-400"
            }`}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-gray-300 text-sm text-center px-6">
              Drag & drop a screenshot here, or click to upload
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        )}

        {preview && (
          <div className="w-full max-w-md">
            <div className="relative rounded-2xl overflow-hidden mb-6">
              <img src={preview} alt="Uploaded screenshot" className="w-full aspect-video object-cover" />
              {isSearching && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
                  <span className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></span>
                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:0.15s]"></span>
                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:0.3s]"></span>
                  </span>
                  <p className="text-white text-sm">Analyzing image...</p>
                </div>
              )}
            </div>

            {!isSearching && error && (
              <p className="text-red-500 text-sm text-center mb-6">{error}</p>
            )}

            {!isSearching && result && (
              <div className="flex justify-center mb-6">
                <MovieDetailCard detail={result} />
              </div>
            )}

            {!isSearching && (
              <button
                onClick={reset}
                className="w-full text-sm text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-full transition"
              >
                Try another image
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSearchModal;