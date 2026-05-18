import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PokemonApi } from '../services/api';
import type { Pokemon } from '../services/api';

export function PokemonDetail() {
  const { id, query, page } = useParams<{ id: string; query: string; page: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const data = await PokemonApi.getPokemonByNameOrId(id);
        setPokemon(data);
      } catch (e) {
        console.error(e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleClose = () => {
    // Возвращаем пользователя на список, сохраняя поисковый запрос и страницу
    navigate(`/search/${query}/page/${page}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-b-blue-600"></div>
      </div>
    );
  }

  if (isError || !pokemon) {
    return (
      <div className="p-6 text-center text-slate-400 font-medium">
        Failed to load Pokémon details.
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative h-fit sticky top-4 animate-fadeIn">
      {/* Кнопка закрытия (Крестик) */}
      <button 
        onClick={handleClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors"
        aria-label="Close details"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex flex-col items-center text-center">
        {pokemon.imageUrl ? (
          <img src={pokemon.imageUrl} alt={pokemon.name} className="h-40 w-40 drop-shadow-lg mb-4" />
        ) : (
          <div className="h-40 w-40 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-4">No Image</div>
        )}
        <h2 className="text-2xl font-bold text-slate-800 capitalize mb-2">{pokemon.name}</h2>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">ID: {pokemon.id}</span>

        <div className="w-full grid grid-cols-2 gap-4 text-left">
          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-400 block mb-1">Height</span>
            <span className="font-semibold text-slate-700">{pokemon.height}</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-400 block mb-1">Weight</span>
            <span className="font-semibold text-slate-700">{pokemon.weight}</span>
          </div>
        </div>

        {pokemon.types && (
          <div className="w-full text-left mt-4">
            <span className="text-xs text-slate-400 block mb-2">Types</span>
            <div className="flex gap-2 flex-wrap">
              {pokemon.types.map(t => (
                <span key={t} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full capitalize">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}