import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from './SearchBar';

describe('SearchBar Component', () => {
  it('отображает переданное начальное значение', () => {
    render(<SearchBar onSearch={vi.fn()} initialValue="pikachu" />);
    const input = screen.getByPlaceholderText(/Например: pikachu.../i) as HTMLInputElement;
    expect(input.value).toBe('pikachu');
  });

  it('вызывает onSearch с очищенным от пробелов значением при отправке формы', () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} initialValue="" />);
    
    const input = screen.getByPlaceholderText(/Например: pikachu.../i);
    const form = screen.getByRole('button', { name: /search/i }).closest('form')!;

    fireEvent.change(input, { target: { value: '  charizard  ' } });
    fireEvent.submit(form);

    expect(mockOnSearch).toHaveBeenCalledWith('charizard');
  });
});