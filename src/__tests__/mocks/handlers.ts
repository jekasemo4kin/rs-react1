import { http, HttpResponse } from 'msw';

export const handlers = [
  // Перехват запроса на все имена (для кэша) или на обычную пагинацию
  http.get('https://pokeapi.co/api/v2/pokemon', ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit');

    if (limit === '1200' || limit === '1100') {
      return HttpResponse.json({
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }
        ]
      });
    }

    return HttpResponse.json({
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
      ]
    });
  }),

  // Перехват запроса конкретного покемона (по имени или ID)
  http.get('https://pokeapi.co/api/v2/pokemon/:name', ({ params }) => {
    const { name } = params;
    
    if (name === 'not-found-pokemon') {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({
      name: name,
      id: name === 'pikachu' ? 25 : 1,
      height: 7,
      weight: 60,
      types: [{ type: { name: 'electric' } }],
      sprites: {
        front_default: 'https://fake-image.com/pokemon.png'
      }
    });
  }),
];