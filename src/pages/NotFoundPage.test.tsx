import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NotFoundPage } from './NotFoundPage';
import { renderWithProviders } from './../__tests__/test-utils';

describe('NotFoundPage', () => {
  it('отображает сообщение 404', () => {
    renderWithProviders(<NotFoundPage />);
    
    expect(screen.getByText('404')).toBeDefined();
    expect(screen.getByText(/Page Not Found/i)).toBeDefined();
  });

  it('содержит ссылку на главную страницу', () => {
    renderWithProviders(<NotFoundPage />);
    
    const link = screen.getByRole('link', { name: /Return to Main App/i });
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('/search/all/page/1');
  });
});