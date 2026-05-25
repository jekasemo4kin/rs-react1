import { render } from '@testing-library/react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import pokemonReducer from '../store/pokemonSlice';
import { ThemeProvider } from '../context/ThemeContext'; 

const rootReducer = combineReducers({ pokemon: pokemonReducer });

export function renderWithProviders(
  ui: React.ReactElement,
  { route = '/', preloadedState = {}, store = configureStore({ reducer: rootReducer, preloadedState }) } = {}
) {
  return {
    store,
    ...render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </ThemeProvider>
      </Provider>
    ),
  };
}