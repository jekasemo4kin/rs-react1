import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PokemonApi } from './api';

describe('PokemonApi', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('fetchAllPokemonNames: выбрасывает ошибку при !response.ok', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);
    await expect(PokemonApi.fetchAllPokemonNames()).rejects.toThrow('Failed to fetch all names');
  });

  it('getPokemonsDetailsList: возвращает базовые данные при ошибке одного из запросов', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);
    const result = await PokemonApi.getPokemonsDetailsList([{ name: 'pika', url: '...' }]);
    expect(result[0]).toEqual({ name: 'pika', url: '...' });
  });

  it('getPokemonByNameOrId: возвращает данные при успехе', async () => {
    const mockData = {
      name: 'pikachu', id: 25, height: 4, weight: 60,
      sprites: { front_default: 'url' },
      types: [{ type: { name: 'electric' } }]
    };
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response);

    const res = await PokemonApi.getPokemonByNameOrId('25');
    expect(res.name).toBe('pikachu');
  });

  it('getPokemonByNameOrId: корректно обрабатывает отсутствие изображения', async () => {
    const mockData = {
      name: 'bulbasaur', id: 1, height: 7, weight: 69,
      sprites: { front_default: null },
      types: []
    };
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response);

    const res = await PokemonApi.getPokemonByNameOrId('1');
    expect(res.imageUrl).toBeUndefined();
  });

});