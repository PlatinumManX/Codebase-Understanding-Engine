import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../shared/context/ToastContext';
import { getRepositories } from '../../../shared/api/repositoryApi';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepoId, setSelectedRepoId] = useState(localStorage.getItem('active_repository_id') || '');

  const fetchWorkspaces = async () => {
    try {
      const data = await getRepositories();
      setRepositories(data || []);
    } catch (err) {
      showToast('error', 'Failed to retrieve workspaces.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleSelectWorkspace = (repo) => {
    setSelectedRepoId(repo.repository_id);
    localStorage.setItem('active_repository_id', repo.repository_id);
    localStorage.setItem('active_repository_name', repo.repository_name);
    window.dispatchEvent(new Event('storage'));
    showToast('success', `Switched active workspace to: ${repo.repository_name}`);
  };

  return (
    <div className="p-main_padding max-w-5xl mx-auto font-sans text-on-surface">
      
      {/* Breadcrumbs & Title */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <nav aria-label="Breadcrumb" className="flex text-outline font-bold text-xs mb-1">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <a onClick={() => navigate('/dashboard')} className="hover:text-primary transition-colors cursor-pointer">Workspaces</a>
              </li>
              <li className="flex items-center">
                <span className="material-symbols-outlined text-xs mx-1 text-outline">chevron_right</span>
                <span className="text-on-surface">Overview</span>
              </li>
            </ol>
          </nav>
          <h1 className="font-display text-2xl font-bold text-on-surface">Dashboard Overview</h1>
        </div>
        <button 
          onClick={() => navigate('/repository')}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-primary-hover transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Ingestion
        </button>
      </div>

      {/* Metric Cards (Bento Style Row) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1 */}
        <div className="bg-white border border-[#e2e8f0] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#dbe1ff] flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>folder_managed</span>
            </div>
            <span className="text-[10px] font-bold text-tertiary px-2.5 py-1 bg-[#d1fae5] rounded-full">active status</span>
          </div>
          <p className="text-xs text-outline font-semibold mb-1">Total Connected Repositories</p>
          <h2 className="text-2xl font-bold font-display text-on-surface">{repositories.length}</h2>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-[#e2e8f0] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#eaddff] flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>data_array</span>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant px-2.5 py-1 bg-[#eff4ff] rounded-full">Updated Live</span>
          </div>
          <p className="text-xs text-outline font-semibold mb-1">Indexed Embeddings Chunks</p>
          <h2 className="text-2xl font-bold font-display text-on-surface">28,450</h2>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-[#e2e8f0] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#d1fae5] flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant px-2.5 py-1 bg-[#eff4ff] rounded-full">Graph Optimized</span>
          </div>
          <p className="text-xs text-outline font-semibold mb-1">Computed Dependency Nodes</p>
          <h2 className="text-2xl font-bold font-display text-on-surface">1,842</h2>
        </div>

      </div>

      {/* Workspaces Table Section */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
        {/* Table Header/Filters */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex justify-between items-center">
          <h3 className="text-base font-bold text-on-surface">Active Workspaces</h3>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => fetchWorkspaces()}
              className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant px-3 py-1.5 border border-[#e2e8f0] rounded-lg hover:bg-[#eff4ff]/50 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">sync</span>
              Refresh
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3" />
              <p className="text-xs text-on-surface-variant font-semibold">Loading indexed workspaces...</p>
            </div>
          ) : repositories.length === 0 ? (
            <div className="py-12 text-center">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">folder_open</span>
              <p className="text-xs text-on-surface-variant font-semibold">No active workspaces. Click "New Ingestion" to upload your code.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#eff4ff] border-b border-[#e2e8f0] text-outline font-bold">
                <tr>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider">Repo Name</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider">Primary Language</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider">Parsing State</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider">Creation Date</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {repositories.map((repo) => {
                  const isCurrent = repo.repository_id === selectedRepoId;
                  return (
                    <tr 
                      key={repo.repository_id} 
                      className={`hover:bg-[#eff4ff]/35 transition-colors ${
                        isCurrent ? 'bg-[#dce9ff]/45 font-semibold' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#eff4ff] rounded text-primary">
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>code_blocks</span>
                          </div>
                          <span 
                            onClick={() => handleSelectWorkspace(repo)}
                            className="text-sm font-bold text-on-surface hover:underline cursor-pointer"
                          >
                            {repo.repository_name}
                          </span>
                          {isCurrent && (
                            <span className="bg-[#dbe1ff] text-primary text-[10px] px-2 py-0.5 rounded font-semibold ml-2">
                              Active
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-on-surface-variant font-semibold">Python</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#d1fae5] text-[#065f46] uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#065f46] mr-1.5"></span>
                          Ready
                        </span>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant font-semibold">
                        {repo.created_at ? new Date(repo.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleSelectWorkspace(repo)}
                          className="text-primary hover:underline font-bold cursor-pointer"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Action Assistant Prompt */}
      <div className="mt-8 bg-inverse-surface text-white rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary opacity-20 blur-3xl rounded-full"></div>
        <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shrink-0">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
        </div>
        <div className="flex-1 leading-normal">
          <h4 className="text-base font-bold font-display mb-1">Analyze a New Architecture</h4>
          <p className="text-xs text-[#a8b2c1] font-semibold">Ready to map another system? Use the 'New Ingestion' button or drag-and-drop a ZIP file here to begin the graph generation.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={() => navigate('/docs')}
            className="px-4 py-2 bg-white text-on-surface rounded-lg text-xs font-bold hover:bg-[#eff4ff] transition-colors active:scale-95 cursor-pointer"
          >
            View Tutorial
          </button>
          <button 
            onClick={() => navigate('/assistant')}
            className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover transition-colors active:scale-95 cursor-pointer"
          >
            Open Assistant
          </button>
        </div>
      </div>
    </div>
  );
}
