import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTheme } from './useTheme';
import { ThemeProvider } from '../context/ThemeContext';

describe('useTheme', () => {
  it('должен переключать тему', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).not.toBe('light');
  });
});