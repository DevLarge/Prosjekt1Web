export type Pokemon = {
  id: number;
  name: string;
  imageUrl: string;
  apiUrl: string;
};

// Slik ser svaret fra liste-endepunktet ut (bare feltene vi bruker).
type PokemonListResponse = {
  results: Array<{ name: string; url: string }>;
};

// PokéAPI har ikke eget søke-endepunkt, så vi henter Pokémon-lista
// og bruker den til lokal filtrering og søk
const LIST_ENDPOINT = 'https://pokeapi.co/api/v2/pokemon?limit=10000';

// Henter den komplette Pokémon-lista fra PokéAPI
// Caching av serverdata håndteres av TanStack Query i React-laget
async function fetchPokemonList() {
  const response = await fetch(LIST_ENDPOINT);

  if (!response.ok) {
    throw new Error(`PokéAPI svarte med ${response.status}`);
  }

  const data = (await response.json()) as PokemonListResponse;
  return data.results;
}

// i Api.tsx
export async function listAllPokemon(): Promise<Pokemon[]> {
  const list = await fetchPokemonList();
  return list
    .map((entry) => ({ entry, id: idFromUrl(entry.url) }))
    .filter(({ id }) => id > 0)
    .map(({ entry, id }) => ({
      id,
      name: entry.name,
      imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      apiUrl: `https://pokeapi.co/api/v2/pokemon/${id}`,
    }));
}

export function pokemonApiUrl(id: number) {
  return `https://pokeapi.co/api/v2/pokemon/${id}`;
}

// Hvert listeelement har en url som ".../pokemon/25/". Vi plukker ut tallet
// (id-en) fordi vi trenger den for å bygge bilde-URL-en.
function idFromUrl(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\//);
  return match ? Number(match[1]) : 0;
}

export async function searchPokemon(query: string): Promise<Pokemon[]> {
  const list = await fetchPokemonList();
  const normalized = query.trim().toLowerCase();

  return list
    .filter((entry) => entry.name.includes(normalized))
    .map((entry) => ({ entry, id: idFromUrl(entry.url) }))
    .filter(({ id }) => id > 0)
    .slice(0, 24)
    .map(({ entry, id }) => ({
      id,
      name: entry.name,
      imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      apiUrl: `https://pokeapi.co/api/v2/pokemon/${id}`,
    }));
}
