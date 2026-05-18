import { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { ResultsList } from '../components/ResultsList';
import { PokemonApi } from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {NotFoundPage} from './NotFoundPage';
import type { Pokemon } from '../services/api';

interface CacheItem {
  name: string;
  url: string;
}

export function MainPage() {
  const { query, page, id } = useParams<{ query: string; page: string; id?: string }>();
  const navigate = useNavigate();

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [totalFilteredCount, setTotalFilteredCount] = useState<number>(0);

  const [cachedNames, setCachedNames] = useLocalStorage<CacheItem[]>('all_pokemon_names', []);

  const currentPage = Number(page) || 1;
  const currentQuery = query || 'all';
  const limitPerPage = 10;

  useEffect(() => {
    const initCache = async () => {
      if (cachedNames.length === 0) {
        try {
          const allPokemons = await PokemonApi.fetchAllPokemonNames();
          setCachedNames(allPokemons);
        } catch (e) {
          console.error('Failed to cache pokemon names', e);
        }
      }
    };
    initCache();
  }, [cachedNames, setCachedNames]);

  useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      let filteredList: CacheItem[] = [];

      if (cachedNames.length > 0) {
        if (currentQuery === 'all') {
          filteredList = cachedNames;
        } else {
          filteredList = cachedNames.filter((p) =>
            p.name.toLowerCase().includes(currentQuery.toLowerCase().trim())
          );
        }
      }

      setTotalFilteredCount(filteredList.length);

      if (filteredList.length === 0) {
        setPokemons([]);
        setIsLoading(false);
        return;
      }

      const maxPages = Math.ceil(filteredList.length / limitPerPage);

      if (currentPage > maxPages || currentPage < 1) {
        setPokemons([]);
        setIsLoading(false);
        setIsError(true); 
        return;
      }

      const offset = (currentPage - 1) * limitPerPage;
      const pageChunk = filteredList.slice(offset, offset + limitPerPage);

      const detailsData = await PokemonApi.getPokemonsDetailsList(pageChunk);
      setPokemons(detailsData);
    } catch (e) {
      console.error(e);
      setIsError(true);
      setPokemons([]);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [currentQuery, currentPage, cachedNames]);

  const handleSearchSubmit = (term: string) => {
    const nextQuery = term === '' ? 'all' : term;
    navigate(`/search/${nextQuery}/page/1`);
  };

  const handlePokemonClick = (nameOrId: string | number) => {
    navigate(`/search/${currentQuery}/page/${currentPage}/pokemon/${nameOrId}`);
  };

  const handlePageChange = (direction: number) => {
    const nextPage = currentPage + direction;
    if (nextPage < 1) return;

    if (id) {
      navigate(`/search/${currentQuery}/page/${nextPage}/pokemon/${id}`);
    } else {
      navigate(`/search/${currentQuery}/page/${nextPage}`);
    }
  };

  const hasMore = currentPage * limitPerPage < totalFilteredCount;
  const showPagination = !isLoading && !isError && totalFilteredCount > limitPerPage;

  const maxPages = Math.ceil(totalFilteredCount / limitPerPage);
  const isInvalidPage = totalFilteredCount > 0 && (currentPage > maxPages || currentPage < 1 || isNaN(Number(page)));

if (isInvalidPage && !isLoading) {
  return <NotFoundPage />;
}

  return (
    <div className="max-w-7xl mx-auto">
      <header className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-6">PokeAPI Explorer</h1>
        <SearchBar
          onSearch={handleSearchSubmit}
          initialValue={currentQuery === 'all' ? '' : currentQuery}
        />
      </header>

      <div className={`grid gap-8 ${id ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative min-h-100 flex flex-col">
          {showPagination && (
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

          <div className="flex-1">
            <ResultsList
              pokemons={pokemons}
              isLoading={isLoading}
              isError={isError}
              onItemClick={handlePokemonClick}
            />
          </div>
        </div>

        {id && (
          <div className="w-full">
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
}