import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { PublicLayout } from './components/layout/PublicLayout'
import { AdminLayout } from './components/layout/AdminLayout'

// Public Suite Screens
const LandingPage = lazy(() => import('./features/landing/LandingPage').then(m => ({ default: m.LandingPage })))
const ConverterPage = lazy(() => import('./features/convert/ConverterPage').then(m => ({ default: m.ConverterPage })))
const ComparePage = lazy(() => import('./features/compare/ComparePage').then(m => ({ default: m.ComparePage })))
const ProviderDetailPage = lazy(() => import('./features/compare/ProviderDetailPage').then(m => ({ default: m.ProviderDetailPage })))
const TripWizardPage = lazy(() => import('./features/trip/TripWizardPage').then(m => ({ default: m.TripWizardPage })))
const TripSimulatorPage = lazy(() => import('./features/trip/TripSimulatorPage').then(m => ({ default: m.TripSimulatorPage })))
const PaymentStrategyPage = lazy(() => import('./features/trip/PaymentStrategyPage').then(m => ({ default: m.PaymentStrategyPage })))
const ScenarioComparePage = lazy(() => import('./features/trip/ScenarioComparePage').then(m => ({ default: m.ScenarioComparePage })))
const StylesExplorerPage = lazy(() => import('./features/trip/StylesExplorerPage').then(m => ({ default: m.StylesExplorerPage })))
const DestinationsPage = lazy(() => import('./features/destinations/DestinationsPage').then(m => ({ default: m.DestinationsPage })))
const DestinationDetailPage = lazy(() => import('./features/destinations/DestinationDetailPage').then(m => ({ default: m.DestinationDetailPage })))
const RateInsightsPage = lazy(() => import('./features/rates/RateInsightsPage').then(m => ({ default: m.RateInsightsPage })))
const SavedTripsPage = lazy(() => import('./features/trip/SavedTripsPage').then(m => ({ default: m.SavedTripsPage })))
const SettingsPage = lazy(() => import('./features/content/SettingsPage').then(m => ({ default: m.SettingsPage })))
const MethodologyPage = lazy(() => import('./features/content/MethodologyPage').then(m => ({ default: m.MethodologyPage })))
const HelpPage = lazy(() => import('./features/content/HelpPage').then(m => ({ default: m.HelpPage })))
const DemoNotesPage = lazy(() => import('./features/content/DemoNotesPage').then(m => ({ default: m.DemoNotesPage })))
const NotFoundPage = lazy(() => import('./features/content/NotFoundPage').then(m => ({ default: m.NotFoundPage })))

// Admin Suite Screens
const AdminLoginPage = lazy(() => import('./features/admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })))
const AdminOverviewPage = lazy(() => import('./features/admin/AdminOverviewPage').then(m => ({ default: m.AdminOverviewPage })))
const FxCachePage = lazy(() => import('./features/admin/FxCachePage').then(m => ({ default: m.FxCachePage })))
const OverridesPage = lazy(() => import('./features/admin/OverridesPage').then(m => ({ default: m.OverridesPage })))
const AdminProvidersPage = lazy(() => import('./features/admin/AdminProvidersPage').then(m => ({ default: m.AdminProvidersPage })))
const FeeMatrixPage = lazy(() => import('./features/admin/FeeMatrixPage').then(m => ({ default: m.FeeMatrixPage })))
const RegionsPage = lazy(() => import('./features/admin/RegionsPage').then(m => ({ default: m.RegionsPage })))
const AuditLogPage = lazy(() => import('./features/admin/AuditLogPage').then(m => ({ default: m.AuditLogPage })))
const SandboxPage = lazy(() => import('./features/admin/SandboxPage').then(m => ({ default: m.SandboxPage })))

export const routes: RouteObject[] = [
  // Admin Login route (isolated, no sidebar)
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },

  // Admin Suite routes (guarded by AdminLayout)
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminOverviewPage /> },
      { path: 'fx-cache', element: <FxCachePage /> },
      { path: 'overrides', element: <OverridesPage /> },
      { path: 'providers', element: <AdminProvidersPage /> },
      { path: 'fee-matrix', element: <FeeMatrixPage /> },
      { path: 'regions', element: <RegionsPage /> },
      { path: 'audit', element: <AuditLogPage /> },
      { path: 'sandbox', element: <SandboxPage /> },
    ],
  },

  // Public Consumer Suite routes (wrapped by PublicLayout)
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'convert', element: <ConverterPage /> },
      { path: 'compare', element: <ComparePage /> },
      { path: 'compare/:providerId', element: <ProviderDetailPage /> },
      { path: 'trip/wizard', element: <TripWizardPage /> },
      { path: 'trip/:id', element: <TripSimulatorPage /> },
      { path: 'trip/:id/strategy', element: <PaymentStrategyPage /> },
      { path: 'trip/:id/compare', element: <ScenarioComparePage /> },
      { path: 'styles', element: <StylesExplorerPage /> },
      { path: 'destinations', element: <DestinationsPage /> },
      { path: 'destinations/:slug', element: <DestinationDetailPage /> },
      { path: 'rates', element: <RateInsightsPage /> },
      { path: 'trips', element: <SavedTripsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'methodology', element: <MethodologyPage /> },
      { path: 'help', element: <HelpPage /> },
      { path: 'demo-notes', element: <DemoNotesPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
