import React, { useState } from 'react';
import RepositoryHeader from '../components/RepositoryHeader';
import RepositoryUploadCard from '../components/RepositoryUploadCard';
import RepositoryInformationCard from '../components/RepositoryInformationCard';
import RepositoryHistoryTable from '../components/RepositoryHistoryTable';

export default function RepositoryPage() {
  const [file, setFile] = useState(null);
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, success, error
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  
  const [repoInfo, setRepoInfo] = useState({
    name: '',
    description: '',
    type: 'Backend',
    language: 'Python',
    version: '1.0.0',
    tags: ''
  });

  const [repositoriesList, setRepositoriesList] = useState([
    { name: 'django-auth-flow', language: 'Python', files: 84, status: 'READY', uploadedAt: '2 days ago' },
    { name: 'fastapi-vector-db', language: 'Python', files: 142, status: 'READY', uploadedAt: '1 week ago' },
    { name: 'node-microservices', language: 'Node', files: 210, status: 'FAILED', uploadedAt: '3 weeks ago' }
  ]);

  const handleFileSelected = (selectedFile) => {
    if (!selectedFile.name.endsWith('.zip')) {
      setUploadState('error');
      return;
    }

    setFile(selectedFile);
    setUploadState('idle');

    // Auto-fill Repository Name without extension
    const cleanName = selectedFile.name.replace(/\.[^/.]+$/, "");
    setRepoInfo(prev => ({
      ...prev,
      name: cleanName
    }));
  };

  const handleStartUpload = () => {
    if (!file) return;

    setUploadState('uploading');
    setProgress(0);
    setCurrentStage(0);

    const intervalTime = 55; // 100 ticks in ~5.5s
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          
          // Append to history list
          const newRepo = {
            name: repoInfo.name || file.name.replace(/\.[^/.]+$/, ""),
            language: repoInfo.language || 'Python',
            files: 127,
            status: 'READY',
            uploadedAt: 'Just now'
          };
          setRepositoriesList(prevList => [newRepo, ...prevList]);
          setUploadState('success');
          return 100;
        }

        const nextProgress = prev + 1;

        if (nextProgress < 20) {
          setCurrentStage(0);
        } else if (nextProgress < 40) {
          setCurrentStage(1);
        } else if (nextProgress < 60) {
          setCurrentStage(2);
        } else if (nextProgress < 80) {
          setCurrentStage(3);
        } else {
          setCurrentStage(4);
        }

        return nextProgress;
      });
    }, intervalTime);
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
    setProgress(0);
    setCurrentStage(0);
    setRepoInfo({
      name: '',
      description: '',
      type: 'Backend',
      language: 'Python',
      version: '1.0.0',
      tags: ''
    });
  };

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
            progress={progress}
            currentStage={currentStage}
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
          />
        </div>
      </div>

      {/* Historical List uploads table */}
      <div className="w-full">
        <RepositoryHistoryTable 
          repositories={repositoriesList} 
        />
      </div>
    </div>
  );
}
