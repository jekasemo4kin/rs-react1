import { Component } from 'react';
import type { Pokemon } from '../services/api';

interface Props {
  pokemons: Pokemon[];
  isLoading: boolean;
}

export class ResultsList extends Component<Props> {
  render() {
    const { pokemons, isLoading } = this.props;

    if (isLoading) return <p>Загрузка данных...</p>;

    if (pokemons.length === 0) {
      return <p>По вашему запросу ничего не найдено.</p>;
    }

    return (
      <div className="results-grid">
        {pokemons.map((pokemon) => (
          <div key={pokemon.name} className="pokemon-card">

            {pokemon.imageUrl && (
              <img src={pokemon.imageUrl} alt={pokemon.name} />
            )}
            <h3>{pokemon.name}</h3>
          </div>
        ))}
      </div>
    );
  }
}