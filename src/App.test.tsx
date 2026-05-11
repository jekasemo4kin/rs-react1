import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { server } from './__tests__/mocks/server';
import { http, HttpResponse } from 'msw';
import App from './App';
import { PokemonApi } from './services/api';

describe('App Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    server.resetHandlers();
    vi.clearAllMocks();
  });

  it('загружает данные из localStorage при монтировании и делает запрос', async () => {
    localStorage.setItem('search_term', 'pikachu');
    render(<App />);
    await waitFor(() => {
        expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });
  });

  it('отображает загрузку, а затем список покемонов', async () => {
    render(<App />);
    expect(screen.getByText(/Searching for Pokémon.../i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    });
  });

  it('отображает сообщение "Nothing found", если покемон не найден (404)', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Например: pikachu.../i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'not-found-pokemon' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Nothing found matching your request/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/bulbasaur/i)).not.toBeInTheDocument();
    logSpy.mockRestore();
  });

  it('обрабатывает критическую ошибку сети (Network Error)', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon*', () => {
        return HttpResponse.error();
      })
    );
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Nothing found matching your request./i)).toBeInTheDocument();
    });

    logSpy.mockRestore();
  });

  it('не вызывает повторный поиск при клике с тем же значением', async () => {
    const apiSpy = vi.spyOn(PokemonApi, 'searchPokemons');
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    });

    expect(apiSpy).toHaveBeenCalledTimes(1);
    const button = screen.getByRole('button', { name: /search/i });
    
    fireEvent.click(button);

    expect(apiSpy).toHaveBeenCalledTimes(1);
    apiSpy.mockRestore();
  });

  it('отображает ErrorBoundary при нажатии на BuggyButton и меняет состояние App', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);
    const bugBtn = screen.getByText(/Trigger Error/i);
    fireEvent.click(bugBtn);

    expect(screen.getByText(/Critical Application Error/i)).toBeInTheDocument();

    errorSpy.mockRestore();
  });

});