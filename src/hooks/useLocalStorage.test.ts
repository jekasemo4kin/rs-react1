import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('возвращает initialValue и пишет ошибку в консоль, если localStorage.getItem выбрасывает исключение', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage blocked');
    });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    expect(result.current[0]).toBe('default');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error reading localStorage key "test-key":',
      expect.any(Error)
    );
  });

  it('пишет ошибку в консоль, если localStorage.setItem выбрасывает исключение', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error setting localStorage key "test-key":',
      expect.any(Error)
    );
  });
});