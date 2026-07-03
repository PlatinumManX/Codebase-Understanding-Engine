import React from 'react';
import { Outlet } from 'react-router-dom';
import MainLayout from '../shared/layouts/MainLayout';

export default function DashboardLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
