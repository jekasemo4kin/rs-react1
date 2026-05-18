import { render, screen, fireEvent } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import { BuggyButton } from './BuggyButton';
import { ErrorBoundary } from './ErrorBoundary';

it('восстанавливает приложение при клике на кнопку перезагрузки в ErrorBoundary', () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <ErrorBoundary resetCondition={false} onErrorTrigger={vi.fn()}>
      <BuggyButton />
    </ErrorBoundary>
  );

  const triggerBtn = screen.getByText(/Trigger Error/i);
  expect(triggerBtn).toBeInTheDocument();

  fireEvent.click(triggerBtn);

  const reloadBtn = screen.getByRole('button', { name: /Reload Application/i });
  expect(reloadBtn).toBeInTheDocument();

  fireEvent.click(reloadBtn);

  expect(screen.getByText(/Trigger Error/i)).toBeInTheDocument();

  consoleSpy.mockRestore();
});