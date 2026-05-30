import { renderHook } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('useLocalStorage', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.mocked(console.error).mockRestore();
  });

  it('должен возвращать initialValue при ошибке парсинга', () => {
    window.localStorage.setItem('bad-key', 'invalid-json');
    
    const { result } = renderHook(() => useLocalStorage('bad-key', 'default'));
    
    expect(result.current[0]).toBe('default');
    expect(console.error).toHaveBeenCalled();
  });
});