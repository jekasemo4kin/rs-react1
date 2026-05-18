// import { render, screen, fireEvent } from '@testing-library/react';
// import { describe, it, expect, vi, beforeEach } from 'vitest';
// import { SearchBar } from './SearchBar';

// describe('SearchBar Component', () => {
//   const mockOnSearch = vi.fn();

//   beforeEach(() => {
//     localStorage.clear();
//     vi.clearAllMocks();
//   });

//   it('отображает значение из localStorage при инициализации', () => {
//     localStorage.setItem('search_term', 'pikachu');
//     render(<SearchBar onSearch={mockOnSearch} hasError={false} />);
    
//     const input = screen.getByPlaceholderText(/Например: pikachu.../i) as HTMLInputElement;
//     expect(input.value).toBe('pikachu');
//   });

//   it('сохраняет значение в localStorage и вызывает onSearch при нажатии на кнопку', () => {
//     render(<SearchBar onSearch={mockOnSearch} hasError={false} />);
    
//     const input = screen.getByPlaceholderText(/Например: pikachu.../i);
//     const button = screen.getByRole('button', { name: /search/i });

//     fireEvent.change(input, { target: { value: 'charizard' } });
//     fireEvent.click(button);

//     expect(localStorage.getItem('search_term')).toBe('charizard');
//     expect(mockOnSearch).toHaveBeenCalledWith('charizard');
//   });

//   it('не вызывает поиск повторно, если запрос не изменился', async () => {
//     const onSearchMock = vi.fn();
//     render(<SearchBar onSearch={onSearchMock} hasError={false} />);
//     const input = screen.getByPlaceholderText(/Например: pikachu.../i);
//     const button = screen.getByRole('button', { name: /search/i });

//     fireEvent.change(input, { target: { value: 'pikachu' } });
//     fireEvent.click(button);
//     fireEvent.click(button);

//     expect(onSearchMock).toHaveBeenCalledTimes(1);
// });

// });