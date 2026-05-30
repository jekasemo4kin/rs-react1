import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as router from 'react-router-dom';
import { MainPage } from './MainPage';
import { renderWithProviders } from '../__tests__/test-utils';
import * as usePokemonData from '../hooks/usePokemonData';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(),
  };
});

describe('MainPage', () => {
  type HookReturnType = ReturnType<typeof usePokemonData.usePokemonData>;

  beforeEach(() => {
    vi.mocked(router.useParams).mockReturnValue({ query: 'all', page: '1' });
  });

  it('рендерит заголовок и компоненты при загрузке', () => {
    vi.spyOn(usePokemonData, 'usePokemonData').mockReturnValue({
      pokemons: [], isLoading: false, isError: false, totalFilteredCount: 0
    } satisfies HookReturnType);

    renderWithProviders(<MainPage />);
    expect(screen.getByText(/PokeAPI Explorer/i)).toBeInTheDocument();
  });

  it('отображает кнопки пагинации, если totalFilteredCount > ITEMS_PER_PAGE', () => {
    vi.spyOn(usePokemonData, 'usePokemonData').mockReturnValue({
      pokemons: [], isLoading: false, isError: false, totalFilteredCount: 25
    } satisfies HookReturnType);

    renderWithProviders(<MainPage />);
    expect(screen.getByText(/Page 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Next/i)).toBeInTheDocument();
  });

  it('отображает NotFoundPage, если isInvalidPage', () => {
    vi.mocked(router.useParams).mockReturnValue({ query: 'all', page: '999' });
    
    vi.spyOn(usePokemonData, 'usePokemonData').mockReturnValue({
      pokemons: [], isLoading: false, isError: false, totalFilteredCount: 10
    } satisfies HookReturnType);

    renderWithProviders(<MainPage />);
    
    expect(screen.getByText(/Not Found/i)).toBeInTheDocument();
  });

  it('handlePageChange: навигация без id', () => {
    const navigate = vi.fn();
    vi.mocked(router.useNavigate).mockReturnValue(navigate);
    vi.spyOn(usePokemonData, 'usePokemonData').mockReturnValue({
      pokemons: [], isLoading: false, isError: false, totalFilteredCount: 50
    } satisfies HookReturnType);

    renderWithProviders(<MainPage />);
    fireEvent.click(screen.getByText(/Next/i));
    expect(navigate).toHaveBeenCalledWith('/search/all/page/2');
  });

  it('handlePageChange: навигация с id', () => {
    const navigate = vi.fn();
    vi.mocked(router.useNavigate).mockReturnValue(navigate);
    vi.mocked(router.useParams).mockReturnValue({ query: 'all', page: '1', id: '25' });
    vi.spyOn(usePokemonData, 'usePokemonData').mockReturnValue({
      pokemons: [], isLoading: false, isError: false, totalFilteredCount: 50
    } satisfies HookReturnType);

    renderWithProviders(<MainPage />);
    fireEvent.click(screen.getByText(/Next/i));
    expect(navigate).toHaveBeenCalledWith('/search/all/page/2/pokemon/25');
  });

  it('handleSearchSubmit: корректный поиск', () => {
    const navigate = vi.fn();
    vi.mocked(router.useNavigate).mockReturnValue(navigate);
    renderWithProviders(<MainPage />);
    
    const input = screen.getByPlaceholderText(/Например:/i);
    fireEvent.change(input, { target: { value: 'pikachu' } });
    
    const searchButton = screen.getByRole('button', { name: /Search/i });
    fireEvent.click(searchButton); 
    
    expect(navigate).toHaveBeenCalledWith('/search/pikachu/page/1');
  });
});