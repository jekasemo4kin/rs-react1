export interface Pokemon {
  name: string;
  url: string;
  imageUrl?: string;
}

export class PokemonApi {
  private static BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

  static async searchPokemons(searchTerm: string): Promise<Pokemon[]> {
    try {
      if (!searchTerm.trim()) {
        const response = await fetch(`${this.BASE_URL}?limit=20`);
        const data = await response.json();
        return data.results;
      }

      const response = await fetch(`${this.BASE_URL}/${searchTerm.toLowerCase().trim()}`);
      
      if (!response.ok) return [];

      const data = await response.json();
      return [{
        name: data.name,
        url: `${this.BASE_URL}/${data.id}/`,
        imageUrl: data.sprites.front_default
      }];
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  }
}