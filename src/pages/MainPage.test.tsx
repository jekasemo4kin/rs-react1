import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MainPage } from './MainPage';
import { renderWithProviders } from '../__tests__/test-utils';
import * as usePokemonData from '../hooks/usePokemonData';

describe('MainPage', () => {
  it('рендерит заголовок и компоненты поиска', () => {

    const spy = vi.spyOn(usePokemonData, 'usePokemonData');
    
    spy.mockReturnValue({
      pokemons: [],
      isLoading: false,
      isError: false,
      totalFilteredCount: 0
    } as ReturnType<typeof usePokemonData.usePokemonData>);

    renderWithProviders(<MainPage />);
    
    expect(screen.getByText(/PokeAPI Explorer/i)).toBeInTheDocument();
    
    spy.mockRestore();
  });
});