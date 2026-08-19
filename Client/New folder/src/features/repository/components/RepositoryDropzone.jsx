import React, { useState, useRef } from 'react';

export default function RepositoryDropzone({ onFileSelected }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  const onBrowseClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={onBrowseClick}
      className={`border-2 border-dashed rounded-xl p-8 bg-[#0d1117]/25 transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[260px] select-none group relative ${
        isDragActive 
          ? 'border-[#00f0ff] bg-[#00f0ff]/5 shadow-[0_0_20px_rgba(0,240,255,0.1)]' 
          : 'border-[#30363d] hover:border-gray-500 hover:bg-[#161b22]/45'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip"
        onChange={handleFileInput}
        className="hidden"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/2 via-transparent to-[#a855f7]/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />

      {/* Large Upload Icon */}
      <div className={`p-4 bg-[#161b22] border rounded-full text-slate-400 mb-4 transition-transform group-hover:scale-105 ${
        isDragActive ? 'border-[#00f0ff] text-[#00f0ff]' : 'border-[#30363d]'
      }`}>
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      </div>

      <div className="space-y-2 z-10">
        <h3 className="text-[22px] font-bold text-white font-mono leading-none">
          Upload Repository ZIP
        </h3>
        <p className="text-[17px] text-slate-300 font-sans leading-normal max-w-sm">
          Drag & Drop your repository ZIP archive here or <span className="text-[#00f0ff] font-semibold underline cursor-pointer hover:text-[#00f0ff]/80 transition-colors">browse</span> from your device.
        </p>
        <div className="pt-2 flex flex-col gap-1 items-center font-mono text-slate-500 text-[13px]">
          <span>Supported Format: ZIP only</span>
          <span>Maximum size allowed: 500 MB</span>
        </div>
      </div>
    </div>
  );
}
