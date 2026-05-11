import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResultsList } from './ResultsList';

describe('ResultsList Component', () => {
  it('отображает пустую таблицу, когда покемонов нет', () => {
    render(<ResultsList pokemons={[]} isLoading={false} isError={false} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('отображает сообщение об ошибке (Nothing found)', () => {
    render(<ResultsList pokemons={[]} isLoading={false} isError={true} />);
    expect(screen.getByText(/Nothing found matching your request/i)).toBeInTheDocument();
  });

  it('рендерит список покемонов правильно', () => {
    const mockData = [{ name: 'pikachu', url: '', imageUrl: 'pika.png' }];
    render(<ResultsList pokemons={mockData} isLoading={false} isError={false} />);
    
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'pika.png');
  });
});