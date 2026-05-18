import type { Pokemon } from '../services/api';

interface Props {
  pokemons: Pokemon[];
  isLoading: boolean;
  isError: boolean;
  onItemClick: (nameOrId: string | number) => void;
}

export function ResultsList({ pokemons, isLoading, isError, onItemClick }: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-b-blue-600"></div>
        <p className="text-slate-500 font-medium animate-pulse">
          Searching for Pokémon...
        </p>
      </div>
    );
  }

  if (isError || pokemons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <p className="text-slate-400 text-lg font-medium">Nothing found matching your request.</p>
      </div>
    );
  }

  return (
    <table className="w-full text-left">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-100">
          <th className="px-8 py-4 font-semibold text-red-600">Name</th>
          <th className="px-8 py-4 font-semibold text-right text-red-600">Image</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {pokemons.map((pokemon) => (
          <tr 
            key={pokemon.name} 
            onClick={() => onItemClick(pokemon.id || pokemon.name)}
            className="hover:bg-blue-50/50 transition-colors cursor-pointer"
          >
            <td className="px-8 py-4 font-medium text-slate-700 capitalize">{pokemon.name}</td>
            <td className="px-8 py-4 text-right">
              {pokemon.imageUrl ? (
                <img src={pokemon.imageUrl} alt={pokemon.name} className="inline-block h-16 w-16 drop-shadow-md" />
              ) : (
                <div className="inline-flex h-16 w-16 bg-slate-100 rounded-full items-center justify-center text-xs text-slate-300">No Image</div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}