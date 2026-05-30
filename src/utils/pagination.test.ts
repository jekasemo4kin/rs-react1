import { describe, it, expect } from 'vitest';
import { getPaginationData } from './pagination';

describe('getPaginationData', () => {
  it('должен правильно рассчитывать количество страниц', () => {
    const totalCount = 25; 
    const currentPage = 1;
    const { maxPages, hasMore } = getPaginationData(totalCount, currentPage);
    
    expect(maxPages).toBe(3);
    expect(hasMore).toBe(true);
  });

  it('должен возвращать isInvalidPage: true для несуществующей страницы', () => {
    const totalCount = 20;
    const currentPage = 5;
    const { isInvalidPage } = getPaginationData(totalCount, currentPage);
    
    expect(isInvalidPage).toBe(true);
  });

  it('должен возвращать isInvalidPage: false для первой страницы, если данные есть', () => {
    const totalCount = 10;
    const currentPage = 1;
    const { isInvalidPage } = getPaginationData(totalCount, currentPage);
    
    expect(isInvalidPage).toBe(false);
  });
});