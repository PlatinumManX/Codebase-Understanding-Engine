import React, { useState } from 'react';
import Card from '../../../shared/components/Card';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

export default function RepoUploadCard() {
  const [gitUrl, setGitUrl] = useState('');
  const [branch, setBranch] = useState('main');

  const handleClone = (e) => {
    e.preventDefault();
    alert(`Simulation: Cloning repository ${gitUrl} [branch: ${branch}]`);
    setGitUrl('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Git Import */}
      <Card title="Clone from Git Provider" subtitle="Import via public GitHub or GitLab URL">
        <form onSubmit={handleClone} className="space-y-4">
          <Input
            label="Git Repository URL"
            placeholder="https://github.com/username/repository.git"
            value={gitUrl}
            onChange={(e) => setGitUrl(e.target.value)}
            required
            icon={
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            }
          />
          <div className="flex gap-4">
            <Input
              label="Branch (optional)"
              placeholder="main"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-1/3 text-xs"
            />
            <div className="flex-1 flex items-end">
              <Button type="submit" variant="primary" className="w-full font-mono text-xs">
                Clone & Analyze
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* ZIP Upload */}
      <Card title="Upload Source Archive" subtitle="Drag & drop or upload ZIP/Tarball files">
        <div
          onClick={() => alert('Simulation: File dialog opened')}
          className="border border-[#30363d] border-dashed rounded-lg p-6 bg-[#0d1117]/25 hover:bg-[#161b22]/45 hover:border-gray-500 transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[155px]"
        >
          <div className="p-2 bg-[#161b22] border border-[#30363d] rounded-full text-gray-400 mb-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-300">Drag & Drop ZIP file here</span>
          <span className="text-[10px] text-gray-500 mt-1">or click to browse from local disk (max 100MB)</span>
        </div>
      </Card>
    </div>
  );
}
