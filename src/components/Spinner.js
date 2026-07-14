import React from 'react';

export default function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin"></div>
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/10 absolute inset-0"></div>
      </div>
    </div>
  );
}
