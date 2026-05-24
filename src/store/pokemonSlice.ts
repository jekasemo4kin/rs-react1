import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface PokemonState {
  selectedIds: string[];
}

const loadInitialState = (): string[] => {
  const saved = localStorage.getItem('selected_pokemons');
  return saved ? JSON.parse(saved) : [];
};

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState: { selectedIds: loadInitialState() } as PokemonState,
  reducers: {
    toggleSelect: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter(i => i !== id);
      } else {
        state.selectedIds.push(id);
      }
      localStorage.setItem('selected_pokemons', JSON.stringify(state.selectedIds));
    }
  }
});

export const { toggleSelect } = pokemonSlice.actions;
export default pokemonSlice.reducer;