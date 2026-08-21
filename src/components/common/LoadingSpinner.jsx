import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = "Loading live data from database...", size = "default", inline = false }) => {
  if (inline) {
    return (
      <div className="flex items-center gap-2 text-xs font-black text-[#4A0E0E]">
        <Loader2 className="animate-spin text-[#FFD700]" size={16} />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 sm:p-16 space-y-4 bg-[#FAF7F2]/60 rounded-3xl border-2 border-dashed border-amber-900/15 animate-in fade-in duration-300">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-amber-200 border-t-[#4A0E0E] animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-lg">
          🎇
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="font-serif font-black text-[#4A0E0E] text-base sm:text-lg">{message}</p>
        <p className="text-xs font-bold text-gray-500">Connecting to secure store services...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
