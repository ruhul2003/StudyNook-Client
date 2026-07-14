'use client';

import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout({ children, title }) {
  useEffect(() => {
    if (title) {
      document.title = `StudyNook – ${title}`;
    } else {
      document.title = 'StudyNook – Find Your Perfect Study Room';
    }
  }, [title]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
        {children}
      </main>
      <Footer />
    </div>
  );
}
