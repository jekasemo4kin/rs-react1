import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResultsList } from './ResultsList';
import { renderWithProviders } from './../__tests__/test-utils';

const mockPokemons = [
  { id: 1, name: 'bulbasaur', url: '...' },
  { id: 25, name: 'pikachu', url: '...' }
];

describe('ResultsList', () => {
  it('отображает список покемонов', () => {
    renderWithProviders(
      <ResultsList 
        pokemons={mockPokemons} 
        isLoading={false} 
        isError={false} 
        onItemClick={vi.fn()} 
      />
    );

    expect(screen.getByText('bulbasaur')).toBeDefined();
    expect(screen.getByText('pikachu')).toBeDefined();
  });

  it('вызывает onItemClick при клике на имя', () => {
    const handleItemClick = vi.fn();
    renderWithProviders(
      <ResultsList 
        pokemons={mockPokemons} 
        isLoading={false} 
        isError={false} 
        onItemClick={handleItemClick} 
      />
    );

    fireEvent.click(screen.getByText('bulbasaur'));
    expect(handleItemClick).toHaveBeenCalledWith('1');
  });

  it('отображает состояние загрузки', () => {
    renderWithProviders(
      <ResultsList pokemons={[]} isLoading={true} isError={false} onItemClick={vi.fn()} />
    );
    expect(screen.getByText(/Searching for Pokémon/i)).toBeDefined();
  });
});