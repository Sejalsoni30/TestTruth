import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { ProjectProvider } from './context/ProjectContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { AppLayout } from './layouts/AppLayout.js';

import { LandingPage } from './pages/LandingPage.js';
import { PricingPage } from './pages/PricingPage.js';
import { LegalPage } from './pages/LegalPage.js';
import { MethodologyPage } from './pages/MethodologyPage.js';
import { SecurityPage } from './pages/SecurityPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { FaqPage } from './pages/FaqPage.js';
import { ChangelogPage } from './pages/ChangelogPage.js';
import { DocsPage } from './pages/DocsPage.js';
import { GuidesPage } from './pages/GuidesPage.js';
import { ApiReferencePage } from './pages/ApiReferencePage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { ProjectWorkspacePage } from './pages/ProjectWorkspacePage.js';
import { SourceAnalysisPage } from './pages/SourceAnalysisPage.js';
import { ReliabilityAnalysisPage } from './pages/ReliabilityAnalysisPage.js';
import { MutationResultsPage } from './pages/MutationResultsPage.js';
import { ExecutionDetailsPage } from './pages/ExecutionDetailsPage.js';
import { AIScenariosPage } from './pages/AIScenariosPage.js';
import { ReportsPage } from './pages/ReportsPage.js';
import { SettingsPage } from './pages/SettingsPage.js';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ProjectProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/legal/:type" element={<LegalPage />} />
              <Route path="/methodology" element={<MethodologyPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/changelog" element={<ChangelogPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/docs/:slug" element={<DocsPage />} />
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/guides/:slug" element={<GuidesPage />} />
              <Route path="/api-reference" element={<ApiReferencePage />} />
              <Route path="/api-docs" element={<ApiReferencePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Authenticated Workspace Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/projects" element={<ProjectWorkspacePage />} />
                <Route path="/source-analysis" element={<SourceAnalysisPage />} />
                <Route path="/reliability-analysis" element={<ReliabilityAnalysisPage />} />
                <Route path="/mutation-results" element={<MutationResultsPage />} />
                <Route path="/execution-details" element={<ExecutionDetailsPage />} />
                <Route path="/ai-scenarios" element={<AIScenariosPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/reports/:runId" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ProjectProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
