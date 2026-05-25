import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BuggyButton } from './BuggyButton';

describe('BuggyButton', () => {
  it('рендерится без ошибок', () => {
    render(<BuggyButton />);
    expect(screen.getByText(/Trigger Error/i)).toBeDefined();
  });
});