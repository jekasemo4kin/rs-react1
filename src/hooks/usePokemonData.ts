import { useState, useEffect } from 'react';
import { PokemonApi, type Pokemon } from '../services/api';
import { useLocalStorage } from './useLocalStorage';
import { APP_CONFIG } from '../constants/config';

export const usePokemonData = (query: string, page: number) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [totalFilteredCount, setTotalFilteredCount] = useState<number>(0);
  const [cachedNames, setCachedNames] = useLocalStorage<{name: string, url: string}[]>('all_pokemon_names', []);

  useEffect(() => {
    if (cachedNames.length === 0) {
      PokemonApi.fetchAllPokemonNames().then(setCachedNames).catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (cachedNames.length === 0) return;

    const controller = new AbortController();
    
    const fetchDetails = async () => {
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
        console.error(e);
        if (!controller.signal.aborted) setIsError(true);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    fetchDetails();
    return () => controller.abort();
  }, [query, page, cachedNames]); 

  return { pokemons, isLoading, isError, totalFilteredCount };
};