import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SelectedPokemon {
  id: string;
  name: string;
}

interface PokemonState {
  selectedItems: SelectedPokemon[];
}

const loadInitialState = (): SelectedPokemon[] => {
  const saved = localStorage.getItem('selected_pokemons');
  return saved ? JSON.parse(saved) : [];
};

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState: { selectedItems: loadInitialState() } as PokemonState,
  reducers: {
    toggleSelect: (state, action: PayloadAction<SelectedPokemon>) => {
      const { id, name } = action.payload;
      const index = state.selectedItems.findIndex(item => item.id === id);
        
      if (index !== -1) {
          state.selectedItems.splice(index, 1);
      } else {
          state.selectedItems.push({ id, name });
      }
      localStorage.setItem('selected_pokemons', JSON.stringify(state.selectedItems));
    },
    
    clearSelection: (state) => {
      state.selectedItems = [];
      localStorage.setItem('selected_pokemons', JSON.stringify([]));
    }
  }
});

export const { toggleSelect, clearSelection } = pokemonSlice.actions;
export default pokemonSlice.reducer;