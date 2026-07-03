import React from 'react';
import useRoute from '../shared/hooks/useRoute';
import LandingPage from '../features/landing/pages/LandingPage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import AboutPage from '../features/landing/pages/AboutPage';
import ContactPage from '../features/landing/pages/ContactPage';
import DocsPage from '../features/landing/pages/DocsPage';
import PricingPage from '../features/landing/pages/PricingPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import RepositoryPage from '../features/repository/pages/RepositoryPage';
import GraphExplorerPage from '../features/graph/pages/GraphExplorerPage';
import ExecutionFlowPage from '../features/execution-flow/pages/ExecutionFlowPage';
import AssistantPage from '../features/ai-assistant/pages/AssistantPage';
import SettingsPage from '../features/settings/pages/SettingsPage';

export default function AppRoutes() {
  const { route } = useRoute();

  switch (route) {
    case 'landing':
      return <LandingPage />;
    case 'login':
      return <LoginPage />;
    case 'register':
      return <RegisterPage />;
    case 'about':
      return <AboutPage />;
    case 'contact':
      return <ContactPage />;
    case 'docs':
      return <DocsPage />;
    case 'pricing':
      return <PricingPage />;
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
      return <LandingPage />;
  }
}
