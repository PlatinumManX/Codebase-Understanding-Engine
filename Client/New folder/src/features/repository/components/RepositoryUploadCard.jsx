import React from 'react';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import RepositoryDropzone from './RepositoryDropzone';
import RepositoryProgress from './RepositoryProgress';
import RepositorySummaryCard from './RepositorySummaryCard';
import RepositoryErrorState from './RepositoryErrorState';

export default function RepositoryUploadCard({
  file,
  uploadState,
  statistics,
  onFileSelected,
  onStartUpload,
  onRemoveFile,
  onReset
}) {
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleString();
  };

  const isUploading = uploadState === 'uploading';

  if (uploadState === 'uploading') {
    return <RepositoryProgress />;
  }

  if (uploadState === 'success') {
    return (
      <RepositorySummaryCard 
        repoName={file ? file.name.replace(/\.[^/.]+$/, "") : 'unknown'} 
        fileSizeLabel={file ? formatBytes(file.size) : '24 MB'}
        statistics={statistics}
        onUploadAnother={onReset}
      />
    );
  }

  if (uploadState === 'error') {
    return (
      <RepositoryErrorState 
        onReplace={onReset} 
        errorMsg="Only ZIP archives (.zip) are supported for parsing and analysis."
      />
    );
  }

  // Idle state
  return (
    <Card 
      title="Repository Upload" 
      titleClassName="text-[22px] font-semibold text-white font-mono"
      subtitle="Select a local ZIP archive containing code segments"
    >
      <div className="space-y-6">
        {!file ? (
          <RepositoryDropzone onFileSelected={onFileSelected} />
        ) : (
          <div className="space-y-6 select-none font-mono">
            {/* File Selected Overview Details */}
            <div className="flex items-start gap-4 p-5 border border-[#30363d] bg-[#0d1117]/35 rounded-xl hover:border-slate-500 transition-all duration-200">
              {/* File Icon */}
              <div className="p-3 bg-[#161b22] border border-[#30363d] rounded-xl text-cyan-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-sm font-bold text-white truncate leading-tight">
                  {file.name}
                </h4>
                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <p>Size: {formatBytes(file.size)}</p>
                  <p>Modified: {formatDate(file.lastModified)}</p>
                  <div className="pt-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-cyan-400 font-semibold uppercase text-[10px]">Ready for Ingestion</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Remove / Replace Buttons */}
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={onRemoveFile} 
                disabled={isUploading}
                className="flex-1 text-xs py-2"
              >
                Remove File
              </Button>
              <Button 
                variant="outline" 
                onClick={onRemoveFile} 
                disabled={isUploading}
                className="flex-1 text-xs py-2"
              >
                Replace File
              </Button>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            onClick={onStartUpload}
            disabled={!file || isUploading}
            className={`w-full font-mono text-[15px] py-3 shadow-[0_0_20px_rgba(0,240,255,0.15)] border-[#00f0ff]/40 ${
              (!file || isUploading) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            Upload Repository
          </Button>
        </div>
      </div>
    </Card>
  );
}
