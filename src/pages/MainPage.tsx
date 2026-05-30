import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { ResultsList } from '../components/ResultsList';
import { usePokemonData } from '../hooks/usePokemonData';
import {NotFoundPage} from './NotFoundPage';
import { getPaginationData } from '../utils/pagination';
import { APP_CONFIG } from '../constants/config';

export function MainPage() {
  const { query = 'all', page = '1', id } = useParams<{ query: string; page: string; id?: string }>();
  const navigate = useNavigate();
  const currentPage = Number(page) || 1;
  const { pokemons, isLoading, isError, totalFilteredCount } = usePokemonData(query, currentPage);
  const { hasMore, isInvalidPage } = getPaginationData(totalFilteredCount, currentPage);

  if (isInvalidPage && !isLoading) return <NotFoundPage />;

  const handleSearchSubmit = (term: string) => {
    const queryParam = term.trim() === '' ? 'all' : term.trim();
    navigate(`/search/${queryParam}/page/1`);
  };

  const handlePageChange = (direction: number) => {
    const nextPage = currentPage + direction;
    if (id) {
      navigate(`/search/${query}/page/${nextPage}/pokemon/${id}`);
    } else {
      navigate(`/search/${query}/page/${nextPage}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-6">PokeAPI Explorer</h1>
        <SearchBar onSearch={handleSearchSubmit} initialValue={query === 'all' ? '' : query} />
      </header>

      <div className={`grid gap-8 ${id ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          {!isLoading && !isError && totalFilteredCount > APP_CONFIG.ITEMS_PER_PAGE && (
            <div className="border-b border-slate-100 px-8 py-4 flex justify-between items-center bg-slate-50/50">
              <button
                onClick={() => handlePageChange(-1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-semibold rounded-xl transition-all disabled:opacity-40 disabled:hover:bg-white active:scale-95"
              >
                Previous
              </button>
              <span className="text-sm font-medium text-slate-500">
                Page {currentPage} (Found: {totalFilteredCount})
              </span>
              <button
                onClick={() => handlePageChange(1)}
                disabled={!hasMore}
                className="px-4 py-2 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-semibold rounded-xl transition-all disabled:opacity-40 disabled:hover:bg-white active:scale-95"
              >
                Next
              </button>
            </div>
          )}
          <ResultsList pokemons={pokemons} isLoading={isLoading} isError={isError} onItemClick={(id) => navigate(`/search/${query}/page/${page}/pokemon/${id}`)} />
        </div>
        {id && <div className="w-full"><Outlet /></div>}
      </div>
    </div>
  );
}