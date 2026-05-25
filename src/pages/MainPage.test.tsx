import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {  Routes, Route } from 'react-router-dom';
import { MainPage } from './MainPage';
import { renderWithProviders } from '../__tests__/test-utils';
import * as usePokemonData from '../hooks/usePokemonData';

describe('MainPage', () => {
  it('рендерит заголовок и компоненты при загрузке', () => {
    vi.spyOn(usePokemonData, 'usePokemonData').mockReturnValue({
      pokemons: [],
      isLoading: false,
      isError: false,
      totalFilteredCount: 0
    } as ReturnType<typeof usePokemonData.usePokemonData>);

    renderWithProviders(<MainPage />);
    expect(screen.getByText(/PokeAPI Explorer/i)).toBeInTheDocument();
  });

  it('отображает кнопки пагинации, если totalFilteredCount > ITEMS_PER_PAGE', () => {
    vi.spyOn(usePokemonData, 'usePokemonData').mockReturnValue({
      pokemons: [],
      isLoading: false,
      isError: false,
      totalFilteredCount: 25
    } as ReturnType<typeof usePokemonData.usePokemonData>);

    renderWithProviders(<MainPage />);
    expect(screen.getByText(/Page 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Next/i)).toBeInTheDocument();
  });

  it('отображает NotFoundPage, если isInvalidPage (через getPaginationData)', () => {
    vi.spyOn(usePokemonData, 'usePokemonData').mockReturnValue({
      pokemons: [],
      isLoading: false,
      isError: false,
      totalFilteredCount: 10
    } as ReturnType<typeof usePokemonData.usePokemonData>);

    renderWithProviders(
      <Routes>
        <Route path="/search/:query/page/:page" element={<MainPage />} />
      </Routes>,
      { route: '/search/all/page/999' }
    );
    
    expect(screen.getByText(/Not Found/i)).toBeInTheDocument();
  });
});