import { render, screen, fireEvent } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import { BuggyButton } from './BuggyButton';
import { ErrorBoundary } from './ErrorBoundary';

it('восстанавливает приложение при клике на кнопку перезагрузки в ErrorBoundary', () => {
  // Глушим ошибку в консоли, которую выплевывает React в режиме разработки
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <ErrorBoundary resetCondition={false} onErrorTrigger={vi.fn()}>
      <BuggyButton />
    </ErrorBoundary>
  );

  // 1. Проверяем, что изначально кнопка на экране
  const triggerBtn = screen.getByText(/Trigger Error/i);
  expect(triggerBtn).toBeInTheDocument();

  // 2. Ломаем приложение
  fireEvent.click(triggerBtn);

  // 3. Убеждаемся, что сработал Fallback UI и появилась кнопка перезагрузки
  const reloadBtn = screen.getByRole('button', { name: /Reload Application/i });
  expect(reloadBtn).toBeInTheDocument();

  // 4. Кликаем по кнопке восстановления стейта
  fireEvent.click(reloadBtn);

  // 5. Приложение должно ожить, и кнопка слома снова должна быть в DOM
  expect(screen.getByText(/Trigger Error/i)).toBeInTheDocument();

  consoleSpy.mockRestore();
});