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

  // --- НОВЫЕ ТЕСТЫ ДЛЯ ПОДНЯТИЯ COVERAGE ---

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

    // Вводим "pika" и отправляем форму
    fireEvent.change(input, { target: { value: 'pika' } });
    fireEvent.click(searchBtn);

    // Должен остаться только pikachu, а bulbasaur исчезнуть
    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
      expect(screen.queryByText(/bulbasaur/i)).not.toBeInTheDocument();
    });
  });

  it('успешно переключает страницы пагинации через кнопки Next и Previous', async () => {
    // Создаем массив из 12 элементов, чтобы появилось 2 страницы (по 10 на страницу)
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

    // Ищем строгое совпадение строки "pokemon-1", игнорируя "pokemon-10"
    await screen.findByText('pokemon-1', { exact: true });

    const nextBtn = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextBtn);

    // Должен появиться покемон со 2-й страницы
    await screen.findByText('pokemon-11', { exact: true });
    expect(screen.queryByText('pokemon-1', { exact: true })).not.toBeInTheDocument();

    // Возвращаемся обратно
    const prevBtn = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevBtn);

    await screen.findByText('pokemon-1', { exact: true });
  });

  it('отображает ошибку, если API возвращает некорректные данные или 404', async () => {
    // Передаем несуществующий поисковый запрос, на который MSW вернет ошибку
    render(
      <MemoryRouter initialEntries={['/search/not-found-pokemon/page/1']}>
        <App />
      </MemoryRouter>
    );

    const errorMsg = await screen.findByText(/Nothing found matching your request/i);
    expect(errorMsg).toBeInTheDocument();
  });
});