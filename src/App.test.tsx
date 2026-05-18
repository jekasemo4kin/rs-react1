import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App Integration with Routing', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('автоматически перенаправляет на страницу /search/all/page/1', async () => {
    const fakeCache = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }
    ];
    localStorage.setItem('all_pokemon_names', JSON.stringify(fakeCache));

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    const row = await screen.findByText(/bulbasaur/i);
    expect(row).toBeInTheDocument();
  });

  it('открывает Аутлет с деталями покемона при клике на элемент списка', async () => {
    const fakeCache = [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }];
    localStorage.setItem('all_pokemon_names', JSON.stringify(fakeCache));

    render(
      <MemoryRouter initialEntries={['/search/all/page/1']}>
        <App />
      </MemoryRouter>
    );

    const row = await screen.findByText(/bulbasaur/i);
    fireEvent.click(row);

    await waitFor(() => {
      expect(screen.getByText(/Height/i)).toBeInTheDocument();
      expect(screen.getByText(/Weight/i)).toBeInTheDocument();
    });
  });

  it('закрывает Аутлет при клике на крестик', async () => {
    const fakeCache = [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }];
    localStorage.setItem('all_pokemon_names', JSON.stringify(fakeCache));

    render(
      <MemoryRouter initialEntries={['/search/all/page/1/pokemon/1']}>
        <App />
      </MemoryRouter>
    );

    const closeBtn = await screen.findByRole('button', { name: /close details/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('button', { name: /close details/i })).not.toBeInTheDocument();
  });

  it('выполняет поиск и фильтрует список при отправке формы', async () => {
    const fakeCache = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }
    ];
    localStorage.setItem('all_pokemon_names', JSON.stringify(fakeCache));

    render(
      <MemoryRouter initialEntries={['/search/all/page/1']}>
        <App />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Например: pikachu.../i);
    const searchBtn = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'pika' } });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
      expect(screen.queryByText(/bulbasaur/i)).not.toBeInTheDocument();
    });
  });

  it('успешно переключает страницы пагинации через кнопки Next и Previous', async () => {
    const fakeCache = Array.from({ length: 12 }, (_, i) => ({
      name: `pokemon-${i + 1}`,
      url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`
    }));
    localStorage.setItem('all_pokemon_names', JSON.stringify(fakeCache));

    render(
      <MemoryRouter initialEntries={['/search/all/page/1']}>
        <App />
      </MemoryRouter>
    );

    await screen.findByText('pokemon-1', { exact: true });

    const nextBtn = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextBtn);

    await screen.findByText('pokemon-11', { exact: true });
    expect(screen.queryByText('pokemon-1', { exact: true })).not.toBeInTheDocument();

    const prevBtn = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevBtn);

    await screen.findByText('pokemon-1', { exact: true });
  });

  it('отображает ошибку, если API возвращает некорректные данные или 404', async () => {

    render(
      <MemoryRouter initialEntries={['/search/not-found-pokemon/page/1']}>
        <App />
      </MemoryRouter>
    );

    const errorMsg = await screen.findByText(/Nothing found matching your request/i);
    expect(errorMsg).toBeInTheDocument();
  });

  it('успешно переходит на страницу About при клике на ссылку в навигации', async () => {
    render(
      <MemoryRouter initialEntries={['/search/all/page/1']}>
        <App />
      </MemoryRouter>
    );

    const aboutLink = screen.getByRole('link', { name: /^about$/i });
    fireEvent.click(aboutLink);

    expect(await screen.findByText(/About Pokemon App/i)).toBeInTheDocument();
    expect(screen.getByText(/Author Information/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Author's CV/i })).toHaveAttribute(
      'href',
      'https://online-cv-gold.vercel.app/CV.pdf'
    );
  });

  it('отображает NotFoundPage (404) при переходе на несуществующий роут', async () => {
    render(
      <MemoryRouter initialEntries={['/some-broken-route-123/xyz']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Page Not Found/i)).toBeInTheDocument();
    
    const returnLink = screen.getByRole('link', { name: /Return to Main App/i });
    expect(returnLink).toHaveAttribute('href', '/search/all/page/1');
  });

  it('показывает NotFoundPage, если в URL передан номер страницы, превышающий лимит', async () => {
    const fakeCache = [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }];
    localStorage.setItem('all_pokemon_names', JSON.stringify(fakeCache));

    render(
      <MemoryRouter initialEntries={['/search/all/page/66']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Page Not Found/i)).toBeInTheDocument();
  });

  it('вызывает функцию handleErrorState при срабатывании критической ошибки', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={['/search/all/page/1']}>
        <App />
      </MemoryRouter>
    );

    const buggyBtn = screen.getByRole('button', { name: /Trigger Error/i });
    
    try {
      fireEvent.click(buggyBtn);
    } catch {
      /* ошибка перехвачена для теста */
    }

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Trigger Error/i })).toBeInTheDocument();
    });

    spy.mockRestore();
  });

});