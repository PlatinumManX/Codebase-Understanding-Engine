import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../shared/components/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#040609] text-gray-200 flex flex-col items-center justify-center font-mono select-none p-6">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-[88px] font-extrabold text-[#00f0ff] leading-none animate-pulse">404</h1>
        <h2 className="text-[22px] font-bold text-white uppercase tracking-wider">Page Not Found</h2>
        <p className="text-slate-400 font-sans text-[17px] leading-relaxed">
          The requested coordinate does not exist in the CodeMap AI relational catalog.
        </p>
        <div className="pt-4">
          <Button variant="primary" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
