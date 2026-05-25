import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  it('должен сохранять и считывать значение', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(result.current[0]).toBe('new-value');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'));
  });

  it('должен возвращать initialValue при ошибке парсинга', () => {
    localStorage.setItem('bad-key', 'invalid-json');
    const { result } = renderHook(() => useLocalStorage('bad-key', 'default'));
    
    expect(result.current[0]).toBe('default');
  });
});