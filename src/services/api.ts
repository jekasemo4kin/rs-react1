export interface Pokemon {
  name: string;
  url: string;
  imageUrl?: string;
  id?: number;
  height?: number;
  weight?: number;
  types?: string[];
}

export class PokemonApi {
  private static BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

  // 1. Загрузка абсолютно всех имён для кэширования в localStorage
  static async fetchAllPokemonNames(): Promise<{ name: string; url: string }[]> {
    const response = await fetch(`${this.BASE_URL}?limit=1350`); // 1025 id
    if (!response.ok) throw new Error('Failed to fetch all names');
    const data = await response.json();
    return data.results; // Массив объектов { name, url }
  }

  // 2. Загрузка детальной информации для списка покемонов (с картинками)
  static async getPokemonsDetailsList(shortList: { name: string; url: string }[]): Promise<Pokemon[]> {
    return Promise.all(
      shortList.map(async (p) => {
        try {
          const resp = await fetch(p.url);
          if (!resp.ok) return { name: p.name, url: p.url };
          const details = await resp.json();
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

  // 3. Получение одного конкретного покемона для Аутлета
  static async getPokemonByNameOrId(searchTerm: string | number): Promise<Pokemon> {
    const term = String(searchTerm).toLowerCase().trim();
    const response = await fetch(`${this.BASE_URL}/${term}`);

    if (!response.ok) {
      throw new Error('Pokemon not found');
    }

    const data = await response.json();
    return {
      name: data.name,
      url: `${this.BASE_URL}/${data.id}/`,
      id: data.id,
      imageUrl: data.sprites.front_default || undefined,
      height: data.height,
      weight: data.weight,
      types: data.types.map((t: { type: { name: string } }) => t.type.name),
    };
  }
}