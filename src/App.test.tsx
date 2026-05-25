import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { App } from './App';
import { renderWithProviders } from './__tests__/test-utils'; 

vi.mock('./hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() })
}));

describe('App Routing', () => {
  it('рендерит AboutPage при переходе на /about', () => {
    renderWithProviders(<App />, { route: '/about' }); 
    expect(screen.getByRole('heading', { name: /About Pokemon App/i })).toBeDefined();
  });

  it('рендерит NotFoundPage при неизвестном маршруте', () => {
    renderWithProviders(<App />, { route: '/unknown-path' });
    expect(screen.getByText('404')).toBeDefined();
  });
});