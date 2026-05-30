import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store';
import { clearSelection } from '../store/pokemonSlice';
import { downloadCSV } from '../utils/csv.ts';

export function Flyout() {
  const selectedItems = useSelector((state: RootState) => state.pokemon.selectedItems);
  const dispatch = useDispatch();

  if (selectedItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 shadow-2xl flex justify-center items-center gap-6 z-50">
      <p className="font-bold text-slate-700 dark:text-slate-200">
        Selected: {selectedItems.length} Pokémon
      </p>
      <div className="flex gap-4">
        <button 
          onClick={() => dispatch(clearSelection())}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-colors"
        >
          Unselect all
        </button>
        <button 
          onClick={() => downloadCSV(selectedItems)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Download CSV
        </button>
      </div>
    </div>
  );
}