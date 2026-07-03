import React, { useState, useEffect, useRef } from 'react';
import RepositoryHeader from '../components/RepositoryHeader';
import RepositoryUploadCard from '../components/RepositoryUploadCard';
import RepositoryInformationCard from '../components/RepositoryInformationCard';
import RepositoryHistoryTable from '../components/RepositoryHistoryTable';
import { useToast } from '../../../shared/context/ToastContext';
import { uploadRepository } from '../../../shared/api/repositoryApi';

export default function RepositoryPage() {
  const { showToast } = useToast();
  
  const [file, setFile] = useState(null);
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, success, error
  const [statistics, setStatistics] = useState(null);
  
  const [repoInfo, setRepoInfo] = useState({
    name: '',
    description: '',
    type: 'Backend',
    language: 'Python',
    version: '1.0.0',
    tags: ''
  });

  const abortControllerRef = useRef(null);

  // Abort ongoing requests when the page component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleFileSelected = (selectedFile) => {
    // 1. Only ZIP extension validated
    if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
      showToast('Only ZIP archives are supported.', 'error');
      setUploadState('error');
      return;
    }

    // 2. Size validation limit to 500 MB
    const maxAllowedSize = 500 * 1024 * 1024;
    if (selectedFile.size > maxAllowedSize) {
      showToast('File size exceeds the 500 MB limit.', 'error');
      setUploadState('error');
      return;
    }

    setFile(selectedFile);
    setUploadState('idle');

    // Auto-fill Repository Name without file extension
    const cleanName = selectedFile.name.replace(/\.[^/.]+$/, "");
    setRepoInfo(prev => ({
      ...prev,
      name: cleanName
    }));
  };

  const handleStartUpload = async () => {
    if (!file) return;

    setUploadState('uploading');
    setStatistics(null);

    // Cancel any previous pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await uploadRepository(
        repoInfo.name || file.name.replace(/\.[^/.]+$/, ""),
        file,
        controller.signal
      );

      if (response && response.success) {
        setStatistics(response.statistics);
        setUploadState('success');
        showToast('Repository parsed successfully.', 'success');
      } else {
        throw new Error(response?.detail || 'Inbound parse error');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      setUploadState('error');
      showToast(err.message || 'An error occurred during upload', 'error');
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadState('idle');
    setRepoInfo(prev => ({
      ...prev,
      name: ''
    }));
  };

  const handleReset = () => {
    setFile(null);
    setUploadState('idle');
    setStatistics(null);
    setRepoInfo({
      name: '',
      description: '',
      type: 'Backend',
      language: 'Python',
      version: '1.0.0',
      tags: ''
    });
  };

  const isUploading = uploadState === 'uploading';

  return (
    <div className="space-y-8 select-none">
      {/* Page Title & Breadcrumb Header */}
      <RepositoryHeader />

      {/* Main Responsive Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Side: Upload / Processing / Summary cards */}
        <div className="lg:col-span-3">
          <RepositoryUploadCard
            file={file}
            uploadState={uploadState}
            statistics={statistics}
            onFileSelected={handleFileSelected}
            onStartUpload={handleStartUpload}
            onRemoveFile={handleRemoveFile}
            onReset={handleReset}
          />
        </div>

        {/* Right Side: Information Configuration Form */}
        <div className="lg:col-span-2">
          <RepositoryInformationCard
            repoInfo={repoInfo}
            setRepoInfo={setRepoInfo}
            disabled={isUploading}
          />
        </div>
      </div>

      {/* Historical List uploads table - rendered empty until listing APIs exist */}
      <div className="w-full">
        <RepositoryHistoryTable 
          repositories={[]} 
        />
      </div>
    </div>
  );
}
