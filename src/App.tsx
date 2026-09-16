import { useState } from 'react'
import type { FormEvent } from 'react'
import { searchPokemon } from './Api'
import type { Pokemon } from './Api'
import { useFavorites } from './useFavorites'
import FavoritesSidebar from './FavoritesSidebar'
import './App.css'

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
function App() {
  const [query, setQuery] = useState('')
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { favorites, isFavorite, toggleFavorite } = useFavorites()

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setPokemon([])
      setError('Skriv inn et navn (eller en del av et navn) først.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const results = await searchPokemon(trimmedQuery)
      setPokemon(results)
      if (results.length === 0) {
        setError(`Fant ingen Pokémon som matcher «${trimmedQuery}».`)
      }
    } catch (searchError) {
      setPokemon([])
      setError(searchError instanceof Error ? searchError.message : 'Noe gikk galt.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <main className="search-page">
        <section className="search-header">
          <p className="eyebrow">PokéAPI</p>
          <h1>Finn en Pokémon</h1>
          <p>Søk på navn, eller en del av et navn – for eksempel «char» eller «pikachu».</p>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="For eksempel: bulba"
              aria-label="Søk etter Pokémon"
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Søker...' : 'Søk'}
            </button>
          </form>
        </section>

        <section className="results" aria-live="polite">
          {error && <p className="message error">{error}</p>}
          {!error && !isLoading && pokemon.length === 0 && (
            <p className="message">Søkeresultatene dine vises her.</p>
          )}
          {pokemon.map((entry) => (
            <div className="song" key={entry.id}>
              <button
                type="button"
                className={`favorite-toggle${isFavorite(entry.id) ? ' is-favorite' : ''}`}
                onClick={() => toggleFavorite(entry)}
                aria-label={
                  isFavorite(entry.id)
                    ? `Fjern ${capitalize(entry.name)} fra favoritter`
                    : `Legg ${capitalize(entry.name)} til favoritter`
                }
                aria-pressed={isFavorite(entry.id)}
              >
                ★
              </button>
              <a className="song-link" href={entry.apiUrl} rel="noreferrer">
                <img
                  src={entry.imageUrl}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.style.visibility = 'hidden'
                  }}
                />
                <span>
                  <strong>{capitalize(entry.name)}</strong>
                  <small>#{entry.id} · se rå API-data</small>
                </span>
              </a>
            </div>
          ))}
        </section>
      </main>
      <FavoritesSidebar favorites={favorites} onRemove={toggleFavorite} />
    </>
  )
}

export default App
