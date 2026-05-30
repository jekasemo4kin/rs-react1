import { type SelectedPokemon } from '../store/pokemonSlice';

export const downloadCSV = (items: SelectedPokemon[]) => {
  const headers = ['ID', 'Name', 'SelectedAt'];
  
  const rows = items.map(item => [ item.id, item.name, new Date().toLocaleString()]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${items.length}_items.csv`;
  link.click();
  
  URL.revokeObjectURL(url);
}