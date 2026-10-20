import React from 'react';
import { HashRouter } from 'react-router-dom';
import { DemoProvider } from './state/demo-store';
import { ToastContainer } from './components/ui/Toast';
import { AppRoutes } from './app/routes';

export function App() {
  return (
    <DemoProvider>
      <HashRouter>
        <AppRoutes />
        <ToastContainer />
      </HashRouter>
    </DemoProvider>
  );
}

export default App;
