'use client';

import React from 'react';
import Link from 'next/link';
import MainLayout from '../components/MainLayout';
import { AlertCircle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <MainLayout title="Page Not Found">
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="relative">
          <AlertCircle className="w-20 h-20 text-indigo-400 mx-auto animate-bounce duration-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white">404 - Page Not Found</h1>
          <p className="text-slate-400 max-w-sm mx-auto text-sm sm:text-base">
            Oops! The page you are looking for does not exist or has been relocated.
          </p>
        </div>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-605 text-white font-bold rounded-xl shadow-lg transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
