import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { FoldLoader } from './FoldLoader';
import { ToastContainer } from '../ui/Toast';

export const StorefrontLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F6F3EE] text-[#1F2421]">
      <FoldLoader />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </div>
  );
};
