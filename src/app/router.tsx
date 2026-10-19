import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { StorefrontLayout } from '../components/site/StorefrontLayout';
import { AppLayout } from '../components/app/AppLayout';

// Storefront routes
import { Home } from '../routes/storefront/Home';
import { Plans } from '../routes/storefront/Plans';
import { PlanDetail } from '../routes/storefront/PlanDetail';
import { HowItWorks } from '../routes/storefront/HowItWorks';
import { Checkout } from '../routes/storefront/Checkout';
import { ThankYou } from '../routes/storefront/ThankYou';
import { Onboarding } from '../routes/storefront/Onboarding';

// Control Room App routes
import { Overview } from '../routes/app/Overview';
import { Pipeline } from '../routes/app/Pipeline';
import { Data } from '../routes/app/Data';
import { Runs } from '../routes/app/Runs';
import { Errors } from '../routes/app/Errors';
import { Payloads } from '../routes/app/Payloads';
import { Test } from '../routes/app/Test';
import { Handoff } from '../routes/app/Handoff';

// 404 Not Found Page
const NotFound = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
    <span className="font-mono text-xs uppercase tracking-wider text-[#B5654A] font-semibold">
      404 Error
    </span>
    <h1 className="font-display text-3xl font-medium text-[#1F2421] mt-2 mb-4">
      Page Not Found
    </h1>
    <p className="text-sm text-[#7A817B] max-w-sm mb-6">
      The requested scenario route does not exist.
    </p>
    <a
      href="/"
      className="px-4 py-2 bg-[#24473B] text-white text-xs font-semibold rounded-sm hover:bg-[#1B382F]"
    >
      Return to Storefront
    </a>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StorefrontLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'plans', element: <Plans /> },
      { path: 'plans/:tier', element: <PlanDetail /> },
      { path: 'how-it-works', element: <HowItWorks /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'thank-you', element: <ThankYou /> },
      { path: 'onboarding', element: <Onboarding /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      { index: true, element: <Overview /> },
      { path: 'pipeline', element: <Pipeline /> },
      { path: 'data', element: <Data /> },
      { path: 'runs', element: <Runs /> },
      { path: 'errors', element: <Errors /> },
      { path: 'payloads', element: <Payloads /> },
      { path: 'test', element: <Test /> },
      { path: 'handoff', element: <Handoff /> },
      { path: '*', element: <Navigate to="/app" replace /> },
    ],
  },
]);
