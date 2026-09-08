import type { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import SectorsPage from '@/pages/SectorsPage';
import SectorDetailPage from '@/pages/SectorDetailPage';
import MasterInventoryPage from '@/pages/MasterInventoryPage';
import MilestoneAnalysisPage from '@/pages/MilestoneAnalysisPage';
import WhatIfSimulatorPage from '@/pages/WhatIfSimulatorPage';
import AlertsPage from '@/pages/AlertsPage';
import UploadPage from '@/pages/UploadPage';
import SettingsPage from '@/pages/SettingsPage';
import LandVerificationPage from '@/pages/LandVerificationPage';
import ForestClearancePage from '@/pages/ForestClearancePage';
import ArbitrationClaimsPage from '@/pages/ArbitrationClaimsPage';
import LoadingSpinner from '@/components/common/LoadingSpinner';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner message="Checking authentication…" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="inventory" element={<MasterInventoryPage />} />
        <Route path="milestones" element={<MilestoneAnalysisPage />} />
        <Route path="milestones/:projectId" element={<MilestoneAnalysisPage />} />
        <Route path="simulator" element={<WhatIfSimulatorPage />} />
        <Route path="sectors" element={<SectorsPage />} />
        <Route path="sectors/:sectorId" element={<SectorDetailPage />} />
        <Route path="projects/:projectId" element={<MilestoneAnalysisPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="verification" element={<LandVerificationPage />} />
        <Route path="land-gis" element={<LandVerificationPage />} />
        <Route path="clearances/forest" element={<ForestClearancePage />} />
        <Route path="arbitration-claims" element={<ArbitrationClaimsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
