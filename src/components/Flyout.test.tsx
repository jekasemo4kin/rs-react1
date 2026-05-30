import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Flyout } from './Flyout';
import { renderWithProviders } from './../__tests__/test-utils';

describe('Flyout', () => {
  it('не отображается, если нет выбранных покемонов', () => {
    renderWithProviders(<Flyout />, { preloadedState: { pokemon: { selectedItems: [] } } });
    expect(screen.queryByText(/Selected:/i)).toBeNull();
  });

  it('отображает количество выбранных элементов', () => {
    const preloadedState = { pokemon: { selectedItems: [{ id: '1', name: 'bulbasaur' }] } };
    renderWithProviders(<Flyout />, { preloadedState });
    expect(screen.getByText(/Selected: 1 Pokémon/i)).toBeDefined();
  });

  it('диспатчит clearSelection при клике на кнопку', async () => {
    const { store } = renderWithProviders(
      <Flyout />, 
      { preloadedState: { pokemon: { selectedItems: [{ id: '1', name: 'bulbasaur' }] } } }
    );
    
    const button = screen.getByText(/Unselect all/i);
    fireEvent.click(button);
    
    expect(store.getState().pokemon.selectedItems).toHaveLength(0);
  });
});