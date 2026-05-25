import { describe, it, expect } from 'vitest';
import { PokemonApi } from './api';

describe('PokemonApi', () => {
  it('должен успешно получать список покемонов', async () => {
    const results = await PokemonApi.fetchAllPokemonNames();
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('bulbasaur');
  });

  it('должен выбрасывать ошибку при ненайденном покемоне', async () => {
    await expect(PokemonApi.getPokemonByNameOrId('not-found-pokemon')).rejects.toThrow('Pokemon not found');
  });
});