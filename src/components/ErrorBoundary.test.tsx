// import { render, screen } from '@testing-library/react';
// import { describe, it, expect, vi} from 'vitest';
// import { ErrorBoundary } from './ErrorBoundary';

// const ProblemChild = () => {
//   throw new Error('Test Error');
// };

// describe('ErrorBoundary Component', () => {
 

//   it('отображает запасной UI (Fallback) при возникновении ошибки', () => {
//     const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

//     render(
//       <ErrorBoundary resetCondition={null} onErrorTrigger={vi.fn()}>
//         <ProblemChild />
//       </ErrorBoundary>
//     );

//     expect(screen.getByText(/Critical Application Error/i)).toBeInTheDocument();
    
//     consoleSpy.mockRestore();
//   });

//   it('вызывает проп onErrorTrigger при поимке ошибки', () => {
//     const mockOnErrorTrigger = vi.fn();
//     vi.spyOn(console, 'error').mockImplementation(() => {});

//     render(
//       <ErrorBoundary resetCondition={null} onErrorTrigger={mockOnErrorTrigger}>
//         <ProblemChild />
//       </ErrorBoundary>
//     );

//     expect(mockOnErrorTrigger).toHaveBeenCalledWith(true);
//   });

//   it('сбрасывает ошибку при изменении resetCondition', () => {
//     const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

//     const { rerender } = render(
//         <ErrorBoundary resetCondition={1} onErrorTrigger={vi.fn()}>
//         <ProblemChild />
//         </ErrorBoundary>
//     );
  
//     expect(screen.getByText(/Critical Application Error/i)).toBeInTheDocument();


//     rerender(
//         <ErrorBoundary resetCondition={2} onErrorTrigger={vi.fn()}>
//         <div>Fixed UI</div>
//         </ErrorBoundary>
//     );

//     expect(screen.queryByText(/Critical Application Error/i)).not.toBeInTheDocument();
//     expect(screen.getByText(/Fixed UI/i)).toBeInTheDocument();

//     consoleSpy.mockRestore();
// });

// });