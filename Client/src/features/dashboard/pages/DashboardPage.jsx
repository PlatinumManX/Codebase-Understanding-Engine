import React from 'react';
import PageHeader from '../../../shared/components/PageHeader';
import StatCard from '../../../shared/components/StatCard';
import ProjectOverviewCard from '../components/ProjectOverviewCard';
import RecentRepositoriesCard from '../components/RecentRepositoriesCard';
import RecentQueriesCard from '../components/RecentQueriesCard';
import QuickActionsCard from '../components/QuickActionsCard';
import { statistics, dashboardData, repositories } from '../../../shared/data/dummyData';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Overview of your indexed repository code metrics and visual intelligence."
        breadcrumbs={['Home', 'Dashboard']}
        actions={
          <a href="#repository" className="inline-flex">
            <button className="bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 hover:border-[#00f0ff]/50 px-3 py-1.5 rounded text-xs font-medium font-mono flex items-center gap-1.5 transition-all cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Repository
            </button>
          </a>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statistics.map((stat, idx) => (
          <StatCard
            key={idx}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            type={stat.type}
          />
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-2">
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 font-mono">
          Code Intelligence Tools
        </h3>
        <QuickActionsCard actions={dashboardData.quickActions} />
      </div>

      {/* Grid: Overview + Recent Uploads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectOverviewCard
            overview={dashboardData.projectOverview}
            summary={dashboardData.projectSummary}
          />
        </div>
        <div>
          <RecentRepositoriesCard repositories={repositories} />
        </div>
      </div>

      {/* Row: Recent AI Queries */}
      <div className="grid grid-cols-1 gap-6">
        <RecentQueriesCard queries={dashboardData.recentQueries} />
      </div>
    </div>
  );
}
