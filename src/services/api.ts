export interface Pokemon {
  name: string;
  url: string;
  imageUrl?: string;
  id?: number;
  height?: number;
  weight?: number;
  types?: string[];
}

interface PokeApiResult {
  name: string;
  url: string;
}

interface PokeApiFetchAllResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokeApiResult[];
}

interface PokeApiTypeSlot {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokeApiDetailsResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
  };
  types: PokeApiTypeSlot[];
}

export class PokemonApi {
  private static BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
  private static POKEMON_TOTAL_LIMIT = 1350;

  static async fetchAllPokemonNames(): Promise<PokeApiResult[]> {
    const response = await fetch(`${this.BASE_URL}?limit=${this.POKEMON_TOTAL_LIMIT}`);
    if (!response.ok) throw new Error('Failed to fetch all names');
    
    const data: PokeApiFetchAllResponse = await response.json();
    return data.results;
  }

  static async getPokemonsDetailsList(shortList: PokeApiResult[]): Promise<Pokemon[]> {
    return Promise.all(
      shortList.map(async (p) => {
        try {
          const resp = await fetch(p.url);
          if (!resp.ok) return { name: p.name, url: p.url };
          
          const details: PokeApiDetailsResponse = await resp.json();
          return {
            name: p.name,
            url: p.url,
            id: details.id,
            imageUrl: details.sprites.front_default || undefined,
          };
        } catch {
          return { name: p.name, url: p.url };
        }
      })
    );
  }

  static async getPokemonByNameOrId(searchTerm: string | number): Promise<Pokemon> {
    const term = String(searchTerm).toLowerCase().trim();
    const response = await fetch(`${this.BASE_URL}/${term}`);

    if (!response.ok) {
      throw new Error('Pokemon not found');
    }

    const data: PokeApiDetailsResponse = await response.json();
    return {
      name: data.name,
      url: `${this.BASE_URL}/${data.id}/`,
      id: data.id,
      imageUrl: data.sprites.front_default || undefined,
      height: data.height,
      weight: data.weight,
      types: data.types.map((t) => t.type.name),
    };
  }
}