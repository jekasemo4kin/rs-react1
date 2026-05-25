import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import { Routes, Route } from 'react-router-dom';
import { PokemonDetail } from './PokemonDetail';
import { renderWithProviders } from '../__tests__/test-utils';
import { PokemonApi, type Pokemon } from '../services/api';

vi.mock('../services/api', () => ({
  PokemonApi: {
    getPokemonByNameOrId: vi.fn(),
  },
}));

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.mocked(console.error).mockRestore();
});

describe('PokemonDetail', () => {
  it('отображает данные покемона после успешной загрузки', async () => {
    // Явно типизируем мок-объект типом Pokemon
    const mockPokemon: Pokemon = {
      name: 'pikachu',
      id: 25,
      height: 4,
      weight: 60,
      types: ['electric'],
      imageUrl: 'fake-url',
      url: 'https://pokeapi.co/api/v2/pokemon/25/'
    };
    
    vi.mocked(PokemonApi.getPokemonByNameOrId).mockResolvedValue(mockPokemon);

    // Оборачиваем в Routes, чтобы useParams точно получил id='25'
    renderWithProviders(
      <Routes>
        <Route path="/search/:query/page/:page/pokemon/:id" element={<PokemonDetail />} />
      </Routes>,
      { route: '/search/all/page/1/pokemon/25' }
    );

    expect(await screen.findByText(/pikachu/i)).toBeInTheDocument();
    expect(PokemonApi.getPokemonByNameOrId).toHaveBeenCalledWith('25');
  });

  it('отображает сообщение об ошибке при сбое API', async () => {
    vi.mocked(PokemonApi.getPokemonByNameOrId).mockRejectedValue(new Error('API error'));

    renderWithProviders(
      <Routes>
        <Route path="/search/:query/page/:page/pokemon/:id" element={<PokemonDetail />} />
      </Routes>,
      { route: '/search/all/page/1/pokemon/999' }
    );

    expect(await screen.findByText(/Failed to load Pokémon details/i)).toBeInTheDocument();
  });
});