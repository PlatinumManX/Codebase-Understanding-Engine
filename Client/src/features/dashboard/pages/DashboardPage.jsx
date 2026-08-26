import React from 'react';
import { Link } from "react-router-dom";
import PageHeader from '../../../shared/components/PageHeader';
import StatCard from '../../../shared/components/StatCard';
import ProjectOverviewCard from '../components/ProjectOverviewCard';
import RecentRepositoriesCard from '../components/RecentRepositoriesCard';
import RecentQueriesCard from '../components/RecentQueriesCard';
import QuickActionsCard from '../components/QuickActionsCard';
import Card from '../../../shared/components/Card';
import { statistics, dashboardData, repositories } from '../../../shared/data/dummyData';

export default function DashboardPage() {
  const summary = dashboardData.projectSummary;

  // Custom configuration for the Repository Health items
  const healthItems = [
    {
      label: 'Complexity',
      value: summary.complexityScore,
      color: 'text-[#00f0ff]',
      accentBg: 'bg-[#00f0ff]',
      accentGlow: 'shadow-[0_0_8px_#00f0ff]',
      icon: (
        <svg className="w-4 h-4 text-[#00f0ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
    },
    {
      label: 'Test Coverage',
      value: summary.testCoverage,
      color: 'text-[#10b981]',
      accentBg: 'bg-[#10b981]',
      accentGlow: 'shadow-[0_0_8px_#10b981]',
      icon: (
        <svg className="w-4 h-4 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      label: 'Dead Code Warnings',
      value: `${summary.deadCodeWarnings} items`,
      color: 'text-yellow-500',
      accentBg: 'bg-yellow-500',
      accentGlow: 'shadow-[0_0_8px_rgba(245,158,11,0.6)]',
      icon: (
        <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      label: 'Circular Dependencies',
      value: `${summary.circularDependencies} found`,
      color: summary.circularDependencies > 0 ? 'text-red-400' : 'text-gray-400',
      accentBg: summary.circularDependencies > 0 ? 'bg-red-500' : 'bg-gray-500',
      accentGlow: summary.circularDependencies > 0 ? 'shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'shadow-none',
      icon: (
        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3L22 4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-6 py-2">
      {/* Page Header with customized typography elements to bypass standard props */}
      <PageHeader
        title={<span className="text-3xl font-bold tracking-tight font-sans block mt-0.5">Dashboard</span>}
        description={<span className="text-[13px] text-gray-400 font-sans block mt-0.5">Overview of your indexed repository code metrics and visual intelligence.</span>}
        breadcrumbs={['Home', 'Dashboard']}
        actions={
          <Link to="/repository" className="inline-flex">
            <button className="bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 hover:border-[#00f0ff]/50 px-3.5 py-2 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.05)] hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Repository
            </button>
          </Link>
        }
      />

      {/* 1. Repository Hero Section */}
      <ProjectOverviewCard
        overview={dashboardData.projectOverview}
        summary={dashboardData.projectSummary}
        statistics={statistics}
      />

      {/* 2. Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        {statistics.map((stat, idx) => (
          <StatCard
            key={idx}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            type={stat.type}
            className="bg-[#161b22]/30 border-[#30363d] shadow-[0_4px_20px_rgba(0,0,0,0.15)] [&_.text-2xl]:text-3xl [&_.text-xs]:text-[11px] [&_.text-xs]:text-gray-500 [&_.text-xs]:font-semibold [&_.mt-3]:mt-2"
          />
        ))}
      </div>

      {/* 3. Repository Health */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold tracking-tight text-white font-sans">
          Repository Health
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {healthItems.map((item, idx) => (
            <Card
              key={idx}
              className="relative overflow-hidden border-[#30363d] bg-[#161b22]/30 hover:border-gray-500 hover:shadow-[0_4px_25px_rgba(0,0,0,0.25)] transition-all duration-300"
              bodyClassName="p-4 flex flex-col justify-between h-[100px]"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider font-semibold">
                    {item.label}
                  </span>
                </div>
                <span className={`w-1.5 h-1.5 rounded-full ${item.accentBg} ${item.accentGlow}`} />
              </div>
              <div className="text-lg font-bold font-mono text-white mt-auto">
                {item.value}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold tracking-tight text-white font-sans">
          Code Intelligence Tools
        </h3>
        <QuickActionsCard actions={dashboardData.quickActions} />
      </div>

      {/* 5. Bottom Grid: Recent Queries & Recent Repositories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentQueriesCard queries={dashboardData.recentQueries} />
        <RecentRepositoriesCard repositories={repositories} />
      </div>
    </div>
  );
}
