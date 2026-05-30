import { APP_CONFIG } from '../constants/config';

export const getPaginationData = (totalCount: number, currentPage: number) => {
  const maxPages = Math.ceil(totalCount / APP_CONFIG.ITEMS_PER_PAGE) || 1;
  const hasMore = currentPage * APP_CONFIG.ITEMS_PER_PAGE < totalCount;
  const isInvalidPage = totalCount > 0 && (currentPage > maxPages || currentPage < 1);
  
  return { maxPages, hasMore, isInvalidPage };
};