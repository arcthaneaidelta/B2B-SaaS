import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Launcher
import { LauncherPage } from '../features/launcher/LauncherPage';

// Scan Experience
import { Landing } from '../features/scan/Landing';
import { RegisterFlow } from '../features/scan/RegisterFlow';
import { RegisterSuccess } from '../features/scan/RegisterSuccess';
import { OrderFlow } from '../features/scan/OrderFlow';
import { OrderSuccess } from '../features/scan/OrderSuccess';
import { PrivacyPage } from '../features/scan/PrivacyPage';

// Console
import { ConsoleShell } from '../features/console/Shell';
import { Dashboard } from '../features/console/Dashboard';
import { SchoolsPage } from '../features/console/SchoolsPage';
import { CatalogPage } from '../features/console/CatalogPage';
import { RecordsPage } from '../features/console/RecordsPage';
import { QRPage } from '../features/console/QRPage';
import { SignIn } from '../features/console/SignIn';

// Proposal support
import { HowItWorksPage } from '../features/howitworks/HowItWorksPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LauncherPage />,
  },
  // Scan Experience Routes
  {
    path: '/s',
    element: <Landing />,
  },
  {
    path: '/s/register',
    element: <RegisterFlow />,
  },
  {
    path: '/s/register/done',
    element: <RegisterSuccess />,
  },
  {
    path: '/s/order',
    element: <OrderFlow />,
  },
  {
    path: '/s/order/done',
    element: <OrderSuccess />,
  },
  {
    path: '/s/privacy',
    element: <PrivacyPage />,
  },
  // Owner Console Routes
  {
    path: '/admin/sign-in',
    element: <SignIn />,
  },
  {
    path: '/admin',
    element: <ConsoleShell />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'schools',
        element: <SchoolsPage />,
      },
      {
        path: 'catalog',
        element: <CatalogPage />,
      },
      {
        path: 'records',
        element: <RecordsPage />,
      },
      {
        path: 'qr',
        element: <QRPage />,
      },
    ],
  },
  // Proposal support
  {
    path: '/how-it-works',
    element: <HowItWorksPage />,
  },
  // Fallbacks
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
