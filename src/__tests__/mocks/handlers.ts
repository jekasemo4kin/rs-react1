import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://pokeapi.co/api/v2/pokemon', ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit');

    if (limit) {
      return HttpResponse.json({
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
        ]
      });
    }
  }),

  http.get('https://pokeapi.co/api/v2/pokemon/:name', ({ params }) => {
    const { name } = params;
    
    if (name === 'not-found-pokemon') {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({
      name: name,
      id: 1,
      sprites: {
        front_default: 'https://fake-image.com/pokemon.png'
      }
    });
  }),
];