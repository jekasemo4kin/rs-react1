import { useState } from 'react';

export function BuggyButton() {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error('Critical error!');
  }

  return (
    <button
      onClick={() => setShouldCrash(true)}
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3 
                 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl
                 shadow-[0_8px_30px_rgb(239,68,68,0.4)] transition-all 
                 hover:scale-110 active:scale-95 group"
      title="Тест Error Boundary"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={2.5} 
        stroke="currentColor" 
        className="w-5 h-5 group-hover:animate-pulse"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.34c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <span>Trigger Error</span>
    </button>
  );
}