import React from 'react';
import PageHeader from '../../../shared/components/PageHeader';
import RepoUploadCard from '../components/RepoUploadCard';
import ProcessingStatusCard from '../components/ProcessingStatusCard';
import RecentRepositoriesCard from '../../dashboard/components/RecentRepositoriesCard';
import { repositories } from '../../../shared/data/dummyData';

export default function RepositoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Repository Manager"
        description="Upload codebase files or clone public Git repositories to parse call hierarchies and semantic flows."
        breadcrumbs={['Home', 'Repository']}
      />

      {/* Upload zone & clone form */}
      <RepoUploadCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Processing Status */}
        <div className="lg:col-span-2">
          <ProcessingStatusCard />
        </div>
        {/* Recent Uploads list */}
        <div>
          <RecentRepositoriesCard repositories={repositories} />
        </div>
      </div>
    </div>
  );
}
