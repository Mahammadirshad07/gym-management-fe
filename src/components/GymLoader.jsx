import React from 'react';
import { Dumbbell } from 'lucide-react';

export default function GymLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      {/* The Icon Animation */}
      <div className="relative">
        <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
        <Dumbbell className="w-16 h-16 text-cyan-400 animate-bounce" />
      </div>
      
      {/* The Text Animation */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
      </div>
      <p className="text-cyan-500/50 text-xs font-bold tracking-[0.3em] uppercase animate-pulse">
        Loading Assets
      </p>
    </div>
  );
}
