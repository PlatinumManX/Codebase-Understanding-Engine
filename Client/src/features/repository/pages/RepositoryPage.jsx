import React, { useState, useEffect, useRef } from 'react';
import RepositoryHeader from '../components/RepositoryHeader';
import RepositoryUploadCard from '../components/RepositoryUploadCard';
import RepositoryInformationCard from '../components/RepositoryInformationCard';
import RepositoryHistoryTable from '../components/RepositoryHistoryTable';
import Card from '../../../shared/components/Card';
import { useToast } from '../../../shared/context/ToastContext';
import { 
  uploadRepository, 
  getRepositories, 
  deleteRepository, 
  patchRepository 
} from '../../../shared/api/repositoryApi';

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

  const [repositories, setRepositories] = useState([]);
  const [loadingRepositories, setLoadingRepositories] = useState(true);
  const [selectedRepoId, setSelectedRepoId] = useState(localStorage.getItem('active_repository_id') || '');

  const abortControllerRef = useRef(null);

  const fetchRepositories = async (signal) => {
    try {
      const data = await getRepositories(signal);
      setRepositories(data || []);
    } catch (err) {
      if (err.name === 'AbortError') return;
      showToast('error','Unable to load repositories.');
    } finally {
      setLoadingRepositories(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchRepositories(controller.signal);
    return () => controller.abort();
  }, []);

  const handleFileSelected = (selectedFile) => {
    // 1. Only ZIP extension validated
    if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
      showToast('error','Only ZIP archives are supported.');
      setUploadState('error');
      return;
    }

    // 2. Size validation limit to 500 MB
    const maxAllowedSize = 500 * 1024 * 1024;
    if (selectedFile.size > maxAllowedSize) {
      showToast('error','File size exceeds the 500 MB limit.');
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
        showToast('success','Repository parsed successfully.');
        
        // Refresh local history list dynamically without refresh page
        fetchRepositories();
      } else {
        throw new Error(response?.detail || 'Inbound parse error');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      setUploadState('error');
      showToast('error',err.message || 'An error occurred during upload');
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRepository(id);
      showToast('success','Repository deleted successfully.');
      
      // If deleted repository is currently selected, clear localStorage and local state
      if (selectedRepoId === id) {
        setSelectedRepoId('');
        localStorage.removeItem('active_repository_id');
        localStorage.removeItem('active_repository_name');
      }
      
      fetchRepositories();
    } catch (err) {
      showToast('error',err.message || 'Failed to delete repository');
    }
  };

  const handleRename = async (id, newName) => {
    try {
      await patchRepository(id, { repository_name: newName });
      showToast('success','Repository renamed successfully.');
      
      // If renamed repository is currently selected, update localStorage name value
      if (selectedRepoId === id) {
        localStorage.setItem('active_repository_name', newName);
      }
      
      fetchRepositories();
    } catch (err) {
      showToast('error',err.message || 'Failed to rename repository');
    }
  };

  const handleSelect = (repo) => {
    setSelectedRepoId(repo.repository_id);
    localStorage.setItem('active_repository_id', repo.repository_id);
    localStorage.setItem('active_repository_name', repo.repository_name);
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

      {/* Historical List uploads table */}
      <div className="w-full">
        {loadingRepositories ? (
          <Card 
            title="Recent Repository Uploads" 
            titleClassName="text-[20px] font-bold text-white font-mono"
            subtitle="Loading ingested projects..."
          >
            <div className="py-12 flex flex-col items-center justify-center font-mono">
              <span className="w-8 h-8 rounded-full border-2 border-[#00f0ff] border-t-transparent animate-spin mb-3" />
              <p className="text-xs text-slate-400">Querying database metadata catalog...</p>
            </div>
          </Card>
        ) : (
          <RepositoryHistoryTable 
            repositories={repositories} 
            selectedRepoId={selectedRepoId}
            onSelect={handleSelect}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        )}
      </div>
    </div>
  );
}
