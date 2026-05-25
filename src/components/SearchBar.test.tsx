import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from './SearchBar';
import { renderWithProviders } from './../__tests__/test-utils';

describe('SearchBar', () => {
  it('отображает переданное начальное значение', () => {
    renderWithProviders(
      <SearchBar onSearch={vi.fn()} initialValue="pikachu" />
    );
    const input = screen.getByPlaceholderText('Например: pikachu...') as HTMLInputElement;
    expect(input.value).toBe('pikachu');
  });

  it('вызывает onSearch с правильным значением при сабмите', () => {
    const handleSearch = vi.fn();
    renderWithProviders(
      <SearchBar onSearch={handleSearch} initialValue="" />
    );

    const input = screen.getByPlaceholderText('Например: pikachu...');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'charizard ' } });
    fireEvent.click(button);

    expect(handleSearch).toHaveBeenCalledWith('charizard');
  });

  it('обновляет состояние, если изменяется initialValue', () => {
    const { rerender } = renderWithProviders(
      <SearchBar onSearch={vi.fn()} initialValue="bulbasaur" />
    );

    rerender(<SearchBar onSearch={vi.fn()} initialValue="squirtle" />);
    
    const input = screen.getByPlaceholderText('Например: pikachu...') as HTMLInputElement;
    expect(input.value).toBe('squirtle');
  });
});