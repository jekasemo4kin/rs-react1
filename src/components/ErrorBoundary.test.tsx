import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';
import { renderWithProviders } from './../__tests__/test-utils';

const ThrowError = () => {
  throw new Error('Test crash');
};

describe('ErrorBoundary', () => {
  it('отображает UI ошибки при падении дочернего компонента', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Critical Application Error/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Reload Application/i })).toBeDefined();

    spy.mockRestore();
  });
});