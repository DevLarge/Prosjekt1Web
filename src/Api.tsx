

export type Pokemon = {
	id: number
	name: string
	imageUrl: string
	apiUrl: string
}

// Slik ser svaret fra liste-endepunktet ut (bare feltene vi bruker).
type PokemonListResponse = {
	results: Array<{ name: string; url: string }>
}

// limit=100000 gir oss hele lista i ett kall. PokéAPI har ikke noe
// eget søke-endepunkt, så vi henter alle navnene én gang og filtrerer selv.
const LIST_ENDPOINT = 'https://pokeapi.co/api/v2/pokemon?limit=10000'

// Vi mellomlagrer lista i minnet så vi ikke henter den på nytt for hvert søk.
let cachedList: Array<{ name: string; url: string }> | null = null

async function fetchPokemonList() {
	if (cachedList) {
		return cachedList
	}

	const response = await fetch(LIST_ENDPOINT)

	if (!response.ok) {
		throw new Error(`PokéAPI svarte med ${response.status}`)
	}

	const data = (await response.json()) as PokemonListResponse
	cachedList = data.results
    console.log(cachedList)
	return cachedList
}

// i Api.tsx
export async function listAllPokemon(): Promise<Pokemon[]> {
  const list = await fetchPokemonList()
  return list
    .map((entry) => ({ entry, id: idFromUrl(entry.url) }))
    .filter(({ id }) => id > 0)
    .map(({ entry, id }) => ({
      id,
      name: entry.name,
      imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      apiUrl: `https://pokeapi.co/api/v2/pokemon/${id}`,
    }))
}


export function pokemonApiUrl(id: number) {
    return `https://pokeapi.co/api/v2/pokemon/${id}`
}

// Hvert listeelement har en url som ".../pokemon/25/". Vi plukker ut tallet
// (id-en) fordi vi trenger den for å bygge bilde-URL-en.
function idFromUrl(url: string): number {
	const match = url.match(/\/pokemon\/(\d+)\//)
	return match ? Number(match[1]) : 0
}

export async function searchPokemon(query: string): Promise<Pokemon[]> {
	const list = await fetchPokemonList()
	const normalized = query.trim().toLowerCase()

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
		}))
}
