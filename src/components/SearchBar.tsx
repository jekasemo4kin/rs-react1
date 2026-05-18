import { useState } from 'react';
import type { SyntheticEvent } from 'react';

interface Props {
  onSearch: (term: string) => void;
  initialValue: string;
}

export function SearchBar({ onSearch, initialValue }: Props) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);

  if (initialValue !== prevInitialValue) {
    setSearchTerm(initialValue);
    setPrevInitialValue(initialValue);
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-2xl mx-auto">
      <div className="relative flex-1">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Например: pikachu..."
          className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700"
        />
      </div>
      <button 
        type="submit"
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
      >
        Search
      </button>
    </form>
  );
}