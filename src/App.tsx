import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import {listAllPokemon, searchPokemon } from './Api'
import type { Pokemon } from './Api'
import './App.css'

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}




function App() {
  const [query, setQuery] = useState('')
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([])

  useEffect(() => {
    listAllPokemon().then(setAllPokemon)
  }, [])

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

      <section className="list">
        <ul>
          {allPokemon.map((poke) => (
            <li key={poke.id}>
              <a> {(poke.id)}</a>
              <a href={poke.apiUrl} target="_blank" rel="noreferrer">{poke.name}</a>
              <img src={poke.imageUrl} width={50}></img>
            </li>
          ))}
        </ul>
      </section>

      <section className="results" aria-live="polite">
        {error && <p className="message error">{error}</p>}
        {!error && !isLoading && pokemon.length === 0 && (
          <p className="message">Søkeresultatene dine vises her.</p>
        )}
        {pokemon.map((entry) => (
          <a className="song" href={entry.apiUrl} target="_blank" rel="noreferrer" key={entry.id}>
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
        ))}
      </section>
    </main>
  )
}

export default App
