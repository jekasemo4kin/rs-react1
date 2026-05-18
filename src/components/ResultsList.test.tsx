import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResultsList } from './ResultsList';

describe('ResultsList Component', () => {
  it('отображает лоадер при isLoading=true', () => {
    render(<ResultsList pokemons={[]} isLoading={true} isError={false} onItemClick={vi.fn()} />);
    expect(screen.getByText(/Searching for Pokémon.../i)).toBeInTheDocument();
  });

  it('отображает ошибку, если ничего не найдено', () => {
    render(<ResultsList pokemons={[]} isLoading={false} isError={true} onItemClick={vi.fn()} />);
    expect(screen.getByText(/Nothing found matching your request/i)).toBeInTheDocument();
  });

  it('вызывает onItemClick при нажатии на строку покемона', () => {
    const mockClick = vi.fn();
    const mockData = [{ name: 'pikachu', url: '', id: 25, imageUrl: 'pika.png' }];
    
    render(<ResultsList pokemons={mockData} isLoading={false} isError={false} onItemClick={mockClick} />);
    
    const row = screen.getByText(/pikachu/i).closest('tr')!;
    fireEvent.click(row);
    
    expect(mockClick).toHaveBeenCalledWith(25);
  });
});