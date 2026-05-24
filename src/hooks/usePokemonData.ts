import { useState, useEffect } from 'react';
import { PokemonApi, type Pokemon } from '../services/api';
import { useLocalStorage } from './useLocalStorage';
import { APP_CONFIG } from '../constants/config';

export const usePokemonData = (query: string, page: number) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [totalFilteredCount, setTotalFilteredCount] = useState<number>(0);
  const [cachedNames] = useLocalStorage<{name: string, url: string}[]>('all_pokemon_names', []);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchData = async () => {
      if (cachedNames.length === 0) return;
      
      setIsLoading(true);
      setIsError(false);
      
      try {
        const filteredList = query === 'all' 
          ? cachedNames 
          : cachedNames.filter((p) => p.name.toLowerCase().includes(query.toLowerCase().trim()));

        setTotalFilteredCount(filteredList.length);

        const offset = (page - 1) * APP_CONFIG.ITEMS_PER_PAGE;
        const pageChunk = filteredList.slice(offset, offset + APP_CONFIG.ITEMS_PER_PAGE);
        
        const detailsData = await PokemonApi.getPokemonsDetailsList(pageChunk);
        
        if (!controller.signal.aborted) {
          setPokemons(detailsData);
        }
      } catch (e) {
        if (!controller.signal.aborted) {
          setIsError(true);
          setPokemons([]);
          console.error(e);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, [query, page, cachedNames]);

  return { pokemons, isLoading, isError, totalFilteredCount };
};