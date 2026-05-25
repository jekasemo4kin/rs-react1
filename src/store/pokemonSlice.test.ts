import { describe, it, expect, beforeEach, vi } from 'vitest';
import reducer, { toggleSelect, clearSelection } from './pokemonSlice';

describe('pokemonSlice', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('должен добавлять покемона в пустой список', () => {
    const initialState = { selectedItems: [] };
    const action = toggleSelect({ id: '1', name: 'bulbasaur' });
    const state = reducer(initialState, action);
    
    expect(state.selectedItems).toHaveLength(1);
    expect(state.selectedItems[0].id).toBe('1');
    expect(localStorage.getItem('selected_pokemons')).toContain('bulbasaur');
  });

  it('должен удалять покемона, если он уже выбран', () => {
    const initialState = { selectedItems: [{ id: '1', name: 'bulbasaur' }] };
    const action = toggleSelect({ id: '1', name: 'bulbasaur' });
    const state = reducer(initialState, action);
    
    expect(state.selectedItems).toHaveLength(0);
  });

  it('должен очищать все выбранные покемоны', () => {
    const initialState = { selectedItems: [{ id: '1', name: 'bulbasaur' }, { id: '2', name: 'pikachu' }] };
    const state = reducer(initialState, clearSelection());
    
    expect(state.selectedItems).toHaveLength(0);
  });
});