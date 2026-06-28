import React from 'react';
import useRoute from '../shared/hooks/useRoute';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import RepositoryPage from '../features/repository/pages/RepositoryPage';
import GraphExplorerPage from '../features/graph/pages/GraphExplorerPage';
import ExecutionFlowPage from '../features/execution-flow/pages/ExecutionFlowPage';
import AssistantPage from '../features/ai-assistant/pages/AssistantPage';
import SettingsPage from '../features/settings/pages/SettingsPage';

export default function AppRoutes() {
  const { route } = useRoute();

  switch (route) {
    case 'dashboard':
      return <DashboardPage />;
    case 'repository':
      return <RepositoryPage />;
    case 'graph':
      return <GraphExplorerPage />;
    case 'flow':
      return <ExecutionFlowPage />;
    case 'ai':
      return <AssistantPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <DashboardPage />;
  }
}
