import { describe, it, expect, vi } from 'vitest';
import { downloadCSV } from './csv';
import { type SelectedPokemon } from '../store/pokemonSlice';

describe('csv utils', () => {
  it('должна вызывать создание ссылки для скачивания', () => {
    const linkMock = { 
      click: vi.fn(), 
      href: '', 
      download: '' 
    } as Partial<HTMLAnchorElement>;
    
    vi.spyOn(document, 'createElement').mockReturnValue(linkMock as HTMLAnchorElement);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('fake-url');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    const mockItems: SelectedPokemon[] = [{ 
      id: '25', 
      name: 'pikachu' 
    }];

    downloadCSV(mockItems);

    expect(linkMock.click).toHaveBeenCalled();
    expect(linkMock.download).toBe('1_items.csv');
  });
});