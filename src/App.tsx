import React, { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'
import { ToastProvider } from './components/ui/Toast'

const router = createBrowserRouter(routes)

export default function App() {
  return (
    <ToastProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-paper text-text-primary">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-pine-600 border-t-transparent animate-spin" />
              <span className="font-mono text-xs text-text-muted">Loading Relziwallet Engine...</span>
            </div>
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </ToastProvider>
  )
}
