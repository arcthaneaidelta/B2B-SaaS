import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';

// Public Pages
import { LandingPage } from '../features/landing/LandingPage';
import {
  PublicHowItWorks,
  PublicEmployers,
  PublicProfessionals,
  PublicVerificationStandards,
  PublicSecurity,
  PublicContact
} from '../features/public/PublicPages';
import { PublicPricing } from '../features/public/PublicPricing';
import { PublicDemoGuide } from '../features/public/PublicDemoGuide';
import { PublicLogin } from '../features/public/PublicLogin';

// Employer Workspace
import { EmployerOverview } from '../features/employer/EmployerOverview';
import { RequirementsView } from '../features/employer/RequirementsView';
import { MatchingView } from '../features/employer/MatchingView';
import { CandidateDetailView } from '../features/employer/CandidateDetailView';
import { ShortlistsView } from '../features/employer/ShortlistsView';
import { PipelineView } from '../features/employer/PipelineView';
import { BillingView } from '../features/employer/BillingView';
import { ContractsView } from '../features/employer/ContractsView';
import {
  CompanyTeamView,
  PassportsOverview,
  EmployerSettings
} from '../features/employer/EmployerExtras';

// Candidate Portal
import {
  CandidateOverview,
  CandidatePassport,
  CandidateDocuments,
  CandidateProfile,
  CandidatePrivacy
} from '../features/candidate/CandidateViews';

// Verification Console
import {
  VerificationQueueView,
  CaseDetailWorkspace,
  ExpirationTrackingView
} from '../features/verification/VerificationViews';

// Admin Console
import {
  AdminOverview,
  AdminMatchingRules,
  AdminAuditLog,
  AdminCandidates,
  AdminSettings
} from '../features/admin/AdminViews';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/how-it-works" element={<PublicHowItWorks />} />
      <Route path="/employers" element={<PublicEmployers />} />
      <Route path="/professionals" element={<PublicProfessionals />} />
      <Route path="/verification-standards" element={<PublicVerificationStandards />} />
      <Route path="/pricing" element={<PublicPricing />} />
      <Route path="/security" element={<PublicSecurity />} />
      <Route path="/contact" element={<PublicContact />} />
      <Route path="/demo" element={<PublicDemoGuide />} />
      <Route path="/login" element={<PublicLogin />} />

      {/* Employer Workspace routes (wrapped in AppShell) */}
      <Route
        path="/app/employer/*"
        element={
          <AppShell>
            <Routes>
              <Route path="overview" element={<EmployerOverview />} />
              <Route path="requirements" element={<RequirementsView />} />
              <Route path="matches" element={<MatchingView />} />
              <Route path="candidates/:id" element={<CandidateDetailView />} />
              <Route path="shortlists" element={<ShortlistsView />} />
              <Route path="pipeline" element={<PipelineView />} />
              <Route path="passports" element={<PassportsOverview />} />
              <Route path="company" element={<CompanyTeamView />} />
              <Route path="billing" element={<BillingView />} />
              <Route path="contracts" element={<ContractsView />} />
              <Route path="settings" element={<EmployerSettings />} />
              <Route path="*" element={<Navigate to="/app/employer/overview" replace />} />
            </Routes>
          </AppShell>
        }
      />

      {/* Candidate Portal routes */}
      <Route
        path="/app/candidate/*"
        element={
          <AppShell>
            <Routes>
              <Route path="overview" element={<CandidateOverview />} />
              <Route path="profile" element={<CandidateProfile />} />
              <Route path="documents" element={<CandidateDocuments />} />
              <Route path="passport" element={<CandidatePassport />} />
              <Route path="privacy" element={<CandidatePrivacy />} />
              <Route path="*" element={<Navigate to="/app/candidate/overview" replace />} />
            </Routes>
          </AppShell>
        }
      />

      {/* Verification Desk routes */}
      <Route
        path="/app/verification/*"
        element={
          <AppShell>
            <Routes>
              <Route path="overview" element={<VerificationQueueView />} />
              <Route path="queue" element={<VerificationQueueView />} />
              <Route path="cases/:id" element={<CaseDetailWorkspace />} />
              <Route path="expiration" element={<ExpirationTrackingView />} />
              <Route path="audit" element={<AdminAuditLog />} />
              <Route path="*" element={<Navigate to="/app/verification/overview" replace />} />
            </Routes>
          </AppShell>
        }
      />

      {/* Admin Console routes */}
      <Route
        path="/app/admin/*"
        element={
          <AppShell>
            <Routes>
              <Route path="overview" element={<AdminOverview />} />
              <Route path="candidates" element={<AdminCandidates />} />
              <Route path="matching-rules" element={<AdminMatchingRules />} />
              <Route path="subscriptions" element={<BillingView />} />
              <Route path="contracts" element={<ContractsView />} />
              <Route path="audit-log" element={<AdminAuditLog />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="*" element={<Navigate to="/app/admin/overview" replace />} />
            </Routes>
          </AppShell>
        }
      />

      {/* Fallback to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
