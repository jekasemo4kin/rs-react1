import { useState, useEffect } from 'react';
import { PokemonApi, type Pokemon } from '../services/api';
import { useLocalStorage } from './useLocalStorage';

interface CacheItem {
  name: string;
  url: string;
}

export const usePokemonData = (query: string, page: number) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [totalFilteredCount, setTotalFilteredCount] = useState<number>(0);
  const [cachedNames, setCachedNames] = useLocalStorage<CacheItem[]>('all_pokemon_names', []);

  const limitPerPage = 10;

  useEffect(() => {
    if (cachedNames.length === 0) {
      PokemonApi.fetchAllPokemonNames()
        .then(setCachedNames)
        .catch(console.error);
    }
  }, [cachedNames.length, setCachedNames]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const filteredList = query === 'all' 
          ? cachedNames 
          : cachedNames.filter((p) => p.name.toLowerCase().includes(query.toLowerCase().trim()));

        setTotalFilteredCount(filteredList.length);

        const maxPages = Math.ceil(filteredList.length / limitPerPage) || 1;
        if (page > maxPages || page < 1) {
          throw new Error('Invalid page');
        }

        const offset = (page - 1) * limitPerPage;
        const pageChunk = filteredList.slice(offset, offset + limitPerPage);
        const detailsData = await PokemonApi.getPokemonsDetailsList(pageChunk);
        
        setPokemons(detailsData);
      } catch (e) {
        setIsError(true);
        setPokemons([]);
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    if (cachedNames.length > 0) fetchData();
  }, [query, page, cachedNames]);

  return { pokemons, isLoading, isError, totalFilteredCount, limitPerPage };
};