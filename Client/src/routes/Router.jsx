import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import DashboardLayout from './DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import NotFound from './NotFound';

// Pages
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

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Pages with Header/Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Standalone Public Pages (No Header/Footer) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Pages */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/repository" element={<RepositoryPage />} />
          <Route path="/graph" element={<GraphExplorerPage />} />
          <Route path="/flow" element={<ExecutionFlowPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Wildcard Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
