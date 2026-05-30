import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePokemonData } from './usePokemonData';


const mockNames = [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }];

describe('usePokemonData', () => {
  beforeEach(() => {
    localStorage.setItem('all_pokemon_names', JSON.stringify(mockNames));
  });

  it('должен загружать данные покемонов', async () => {
    const { result } = renderHook(() => usePokemonData('all', 1));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemons).toHaveLength(1);
    expect(result.current.pokemons[0].name).toBe('bulbasaur');
    expect(result.current.isError).toBe(false);
  });

  it('должен возвращать ошибку при неудачном запросе', async () => {

    const { result } = renderHook(() => usePokemonData('unknown', 1));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemons).toEqual([]);
  });
});