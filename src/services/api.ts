export interface Pokemon {
  name: string;
  url: string;
  imageUrl?: string;
}

export class PokemonApi {
  private static BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

  static async searchPokemons(searchTerm: string): Promise<Pokemon[]> {
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
      const response = await fetch(`${this.BASE_URL}?limit=10`);
      if (!response.ok) throw new Error('Failed to fetch list');
      const data = await response.json();

      return Promise.all(
        data.results.map(async (p: { name: string; url: string }) => {
          const resp = await fetch(p.url);
          const details = await resp.json();
          return {
            name: p.name,
            url: p.url,
            imageUrl: details.sprites.front_default,
          };
        })
      );
    }

    const response = await fetch(`${this.BASE_URL}/${term}`);
    

    if (!response.ok) {
      throw new Error('Pokemon not found');
    }

    const data = await response.json();
    return [{
      name: data.name,
      url: `${this.BASE_URL}/${data.id}/`,
      imageUrl: data.sprites.front_default
    }];
  }
}