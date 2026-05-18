// import { render, screen, fireEvent } from '@testing-library/react';
// import { it, expect, vi } from 'vitest';
// import { BuggyButton } from './BuggyButton';
// import { ErrorBoundary } from './ErrorBoundary';

// it('восстанавливает приложение при клике на кнопку перезагрузки в ErrorBoundary', () => {
//   const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

//   const reloadSpy = vi.fn();
//   Object.defineProperty(window, 'location', {
//     value: { reload: reloadSpy },
//     writable: true,
//   });

//   render(
//     <ErrorBoundary resetCondition={null} onErrorTrigger={vi.fn()}>
//       <BuggyButton />
//     </ErrorBoundary>
//   );

//   fireEvent.click(screen.getByText(/Trigger Error/i));

//   const reloadBtn = screen.getByRole('button', { name: /Reload Application/i });
//   fireEvent.click(reloadBtn);

//   expect(reloadSpy).toHaveBeenCalled();
//   consoleSpy.mockRestore();
// });