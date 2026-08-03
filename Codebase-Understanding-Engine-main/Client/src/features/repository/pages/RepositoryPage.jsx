import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../shared/context/ToastContext';
import { 
  uploadRepository, 
  getRepositories, 
  deleteRepository, 
  patchRepository 
} from '../../../shared/api/repositoryApi';

export default function RepositoryPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [file, setFile] = useState(null);
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, success, error
  const [statistics, setStatistics] = useState(null);
  
  const [repoInfo, setRepoInfo] = useState({
    name: '',
    excludeNodeModules: true,
    deepScan: false,
    autoDetectEntry: true
  });

  const [repositories, setRepositories] = useState([]);
  const [loadingRepositories, setLoadingRepositories] = useState(true);
  const [selectedRepoId, setSelectedRepoId] = useState(localStorage.getItem('active_repository_id') || '');

  const abortControllerRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchRepositories = async (signal) => {
    try {
      const data = await getRepositories(signal);
      setRepositories(data || []);
    } catch (err) {
      if (err.name === 'AbortError') return;
      showToast('error', 'Unable to load repositories.');
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
    if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
      showToast('error', 'Only ZIP archives are supported.');
      return;
    }

    const maxAllowedSize = 500 * 1024 * 1024; // 500 MB
    if (selectedFile.size > maxAllowedSize) {
      showToast('error', 'File size exceeds the 500 MB limit.');
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
        showToast('success', 'Repository parsed successfully.');
        
        // Save active workspace details on success
        if (response.repository_id) {
          localStorage.setItem('active_repository_id', response.repository_id);
          localStorage.setItem('active_repository_name', repoInfo.name || file.name.replace(/\.[^/.]+$/, ""));
          setSelectedRepoId(response.repository_id);
          // Trigger header update event
          window.dispatchEvent(new Event('storage'));
        }

        fetchRepositories();
      } else {
        throw new Error(response?.detail || 'Inbound parse error');
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setUploadState('error');
      showToast('error', err.message || 'An error occurred during upload');
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this repository workspace?')) return;
    try {
      await deleteRepository(id);
      showToast('success', 'Repository deleted successfully.');
      
      if (selectedRepoId === id) {
        setSelectedRepoId('');
        localStorage.removeItem('active_repository_id');
        localStorage.removeItem('active_repository_name');
        window.dispatchEvent(new Event('storage'));
      }
      
      fetchRepositories();
    } catch (err) {
      showToast('error', err.message || 'Failed to delete repository');
    }
  };

  const handleRename = async (id, newName) => {
    if (!newName.trim()) return;
    try {
      await patchRepository(id, { repository_name: newName });
      showToast('success', 'Repository renamed successfully.');
      
      if (selectedRepoId === id) {
        localStorage.setItem('active_repository_name', newName);
        window.dispatchEvent(new Event('storage'));
      }
      
      fetchRepositories();
    } catch (err) {
      showToast('error', err.message || 'Failed to rename repository');
    }
  };

  const handleSelect = (repo) => {
    setSelectedRepoId(repo.repository_id);
    localStorage.setItem('active_repository_id', repo.repository_id);
    localStorage.setItem('active_repository_name', repo.repository_name);
    window.dispatchEvent(new Event('storage'));
    showToast('success', `Active repository set to: ${repo.repository_name}`);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadState('idle');
    setRepoInfo(prev => ({
      ...prev,
      name: ''
    }));
  };

  const isUploading = uploadState === 'uploading';

  return (
    <div className="p-main_padding max-w-5xl mx-auto font-sans text-on-surface">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-8 text-on-surface-variant text-xs font-semibold">
        <a onClick={() => navigate('/dashboard')} className="hover:text-primary transition-colors cursor-pointer">Workspaces</a>
        <span className="material-symbols-outlined text-xs text-outline">chevron_right</span>
        <a onClick={() => navigate('/repository')} className="hover:text-primary transition-colors cursor-pointer">Import</a>
        <span className="material-symbols-outlined text-xs text-outline">chevron_right</span>
        <span className="text-primary font-bold">ZIP Upload</span>
      </nav>

      {/* Main Upload Card */}
      <section className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold font-display text-on-surface mb-2">Upload Codebase ZIP</h2>
            <p className="text-xs text-on-surface-variant">Select a local ZIP archive to start the mapping engine.</p>
          </div>

          {/* Drop Zone */}
          <div 
            onClick={() => fileInputRef.current.click()}
            className="relative border-2 border-dashed border-[#c3c6d7] rounded-xl p-12 text-center group cursor-pointer transition-all hover:bg-[#eff4ff] hover:border-primary"
          >
            <input 
              ref={fileInputRef}
              accept=".zip" 
              className="absolute inset-0 opacity-0 cursor-pointer hidden" 
              onChange={(e) => handleFileSelected(e.target.files[0])}
              type="file"
            />
            
            {!file ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#dbe1ff] text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_upload</span>
                </div>
                <p className="text-base font-bold text-on-surface mb-1">Drag and drop your ZIP here</p>
                <p className="text-xs text-on-surface-variant mb-4">or <span className="text-primary font-bold">browse files</span> from your computer</p>
                
                {/* Constraints Note */}
                <div className="flex items-center gap-4 py-2 px-4 bg-[#eff4ff] rounded-full border border-primary/5">
                  <span className="text-[11px] text-on-surface-variant flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-sm text-outline">info</span>
                    Maximum file size: 500MB
                  </span>
                  <div className="w-[1px] h-3 bg-[#c3c6d7]"></div>
                  <span className="text-[11px] text-on-surface-variant font-semibold">Supported formats: .zip</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-2 z-10">
                <span className="material-symbols-outlined text-6xl text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
                <p className="text-base font-bold text-primary truncate max-w-full mb-1">{file.name}</p>
                <p className="text-xs text-on-surface-variant mb-6 font-semibold">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="text-error text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                  Remove and choose another
                </button>
              </div>
            )}
          </div>

          {/* Configuration Options */}
          <div className="mt-12">
            <h3 className="text-xs font-bold uppercase tracking-wider text-outline mb-6">Ingestion Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Toggle 1 */}
              <label className="flex items-start gap-4 p-4 rounded-lg border border-[#e2e8f0] hover:border-primary transition-all cursor-pointer group">
                <div className="relative inline-block w-12 h-6 flex-shrink-0 mt-0.5">
                  <input 
                    type="checkbox"
                    checked={repoInfo.excludeNodeModules}
                    onChange={(e) => setRepoInfo(prev => ({ ...prev, excludeNodeModules: e.target.checked }))}
                    className="sr-only peer"
                    id="exclude-node"
                  />
                  <div className="block bg-[#c3c6d7] w-12 h-6 rounded-full transition-colors peer-checked:bg-primary"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-6"></div>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">Exclude node_modules / venv</p>
                  <p className="text-[11px] text-on-surface-variant mt-1">Saves processing time by ignoring dependencies.</p>
                </div>
              </label>

              {/* Toggle 2 */}
              <label className="flex items-start gap-4 p-4 rounded-lg border border-[#e2e8f0] hover:border-primary transition-all cursor-pointer group">
                <div className="relative inline-block w-12 h-6 flex-shrink-0 mt-0.5">
                  <input 
                    type="checkbox"
                    checked={repoInfo.deepScan}
                    onChange={(e) => setRepoInfo(prev => ({ ...prev, deepScan: e.target.checked }))}
                    className="sr-only peer"
                    id="deep-scan"
                  />
                  <div className="block bg-[#c3c6d7] w-12 h-6 rounded-full transition-colors peer-checked:bg-primary"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-6"></div>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">Deep Scan</p>
                  <p className="text-[11px] text-on-surface-variant mt-1">Include nested submodules and linked libraries.</p>
                </div>
              </label>

              {/* Toggle 3 */}
              <label className="flex items-start gap-4 p-4 rounded-lg border border-[#e2e8f0] hover:border-primary transition-all cursor-pointer group">
                <div className="relative inline-block w-12 h-6 flex-shrink-0 mt-0.5">
                  <input 
                    type="checkbox"
                    checked={repoInfo.autoDetectEntry}
                    onChange={(e) => setRepoInfo(prev => ({ ...prev, autoDetectEntry: e.target.checked }))}
                    className="sr-only peer"
                    id="auto-entry"
                  />
                  <div className="block bg-[#c3c6d7] w-12 h-6 rounded-full transition-colors peer-checked:bg-primary"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-6"></div>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">Auto-detect entry points</p>
                  <p className="text-[11px] text-on-surface-variant mt-1">AI identifies main application entry files automatically.</p>
                </div>
              </label>

            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-[#eff4ff] px-8 py-6 border-t border-[#e2e8f0] flex items-center justify-between">
          <div className="flex items-center gap-3 text-on-surface-variant text-xs font-semibold">
            <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            Files are encrypted during transit and deleted after mapping.
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleRemoveFile}
              disabled={!file || isUploading}
              className="px-6 py-2.5 rounded-lg border border-[#e2e8f0] text-on-surface text-xs font-semibold hover:bg-white transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button 
              onClick={handleStartUpload}
              disabled={!file || isUploading}
              className="px-8 py-2.5 rounded-lg bg-primary text-white text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer hover:bg-primary-hover"
            >
              {isUploading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  Ingesting...
                </>
              ) : (
                'Start Ingestion'
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Progress & Upload History List */}
      <div className="mt-12">
        <h3 className="text-xs font-bold uppercase tracking-wider text-outline mb-6">Recent Workspace Uploads</h3>
        
        {loadingRepositories ? (
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 flex flex-col items-center justify-center shadow-sm">
            <span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3" />
            <p className="text-xs text-on-surface-variant font-semibold">Querying workspace database catalogs...</p>
          </div>
        ) : repositories.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center shadow-sm">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">folder_open</span>
            <p className="text-xs text-on-surface-variant font-semibold">No workspaces indexed yet. Upload a ZIP file to begin.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#eff4ff] border-b border-[#e2e8f0] text-outline font-bold">
                  <th className="px-6 py-4">REPOSITORY NAME</th>
                  <th className="px-6 py-4">CREATION DATE</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {repositories.map((repo) => {
                  const isCurrent = repo.repository_id === selectedRepoId;
                  return (
                    <tr 
                      key={repo.repository_id} 
                      className={`border-b border-[#e2e8f0] hover:bg-[#eff4ff]/30 transition-colors ${
                        isCurrent ? 'bg-[#dce9ff]/45' : ''
                      }`}
                    >
                      <td className="px-6 py-4 font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">folder</span>
                        <span 
                          onClick={() => handleSelect(repo)}
                          className="hover:underline cursor-pointer"
                        >
                          {repo.repository_name}
                        </span>
                        {isCurrent && (
                          <span className="bg-[#dbe1ff] text-primary text-[10px] px-2 py-0.5 rounded font-semibold ml-2">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant font-semibold">
                        {repo.created_at ? new Date(repo.created_at).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-[#d1fae5] text-[#065f46] text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                          Ready
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button 
                          onClick={() => {
                            const newName = prompt('Enter new repository name:', repo.repository_name);
                            if (newName) handleRename(repo.repository_id, newName);
                          }}
                          className="text-primary hover:text-primary-hover font-bold cursor-pointer"
                        >
                          Rename
                        </button>
                        <button 
                          onClick={() => handleDelete(repo.repository_id)}
                          className="text-error hover:text-red-700 font-bold cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Decorative engine status */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center opacity-85">
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-outline uppercase tracking-widest">Why CodeMap AI?</h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#d1fae5] text-[#065f46] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm font-bold">check</span>
              </div>
              <span className="font-semibold">Instant dependency graph visualization</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#d1fae5] text-[#065f46] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm font-bold">check</span>
              </div>
              <span className="font-semibold">Context-aware architectural analysis</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#d1fae5] text-[#065f46] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm font-bold">check</span>
              </div>
              <span className="font-semibold">Automated document mapping generation</span>
            </li>
          </ul>
        </div>
        <div className="relative h-32 rounded-xl bg-[#eff4ff] overflow-hidden border border-[#e2e8f0] flex items-center justify-center p-6 shadow-sm">
          <div className="text-center">
            <p className="text-[10px] font-mono text-primary uppercase font-bold tracking-widest mb-1">Engine Status</p>
            <p className="text-base font-bold font-display text-on-surface">
              {isUploading ? 'AST Analyzing & Indexing...' : 'Waiting for repository selection...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
