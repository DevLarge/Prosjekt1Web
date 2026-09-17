import { useState } from 'react';
import type { FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listAllPokemon } from './Api';
import { useFavorites } from './useFavorites';
import FavoritesSidebar from './FavoritesSidebar';
import './App.css';

const SEARCH_STORAGE_KEY = 'pokemon-search';
const RECENT_SEARCHES_STORAGE_KEY = 'pokemon-recent-searches';
const MAX_RECENT_SEARCHES = 5;

function loadRecentSearches(): string[] {
  try {
    const raw = sessionStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function App() {
  const [query, setQuery] = useState(
    () => sessionStorage.getItem(SEARCH_STORAGE_KEY) ?? '',
  );

  // TanStack Query håndterer henting og caching av Pokémon-lista.
  const {
    data: allPokemon = [],
    isPending,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ['pokemon'],
    queryFn: listAllPokemon,
  });

  const [submittedQuery, setSubmittedQuery] = useState(
    () => sessionStorage.getItem(SEARCH_STORAGE_KEY) ?? '',
  );

  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState(loadRecentSearches);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const pokemon = submittedQuery
    ? allPokemon
      .filter((entry) =>
        entry.name.includes(submittedQuery.toLowerCase()),
      )
      .slice(0, 24)
    : [];

  function addToRecentSearches(trimmedQuery: string) {
    const withoutDuplicate = recentSearches.filter(
      (entry) => entry.toLowerCase() !== trimmedQuery.toLowerCase(),
    );
    const updated = [trimmedQuery, ...withoutDuplicate].slice(
      0,
      MAX_RECENT_SEARCHES,
    );
    setRecentSearches(updated);
    sessionStorage.setItem(
      RECENT_SEARCHES_STORAGE_KEY,
      JSON.stringify(updated),
    );
  }

  function runSearch(rawQuery: string) {
    const trimmedQuery = rawQuery.trim();

    if (!trimmedQuery) {
      setSubmittedQuery('');
      setError('Skriv inn et navn (eller en del av et navn) først.');
      return;
    }

    sessionStorage.setItem(SEARCH_STORAGE_KEY, trimmedQuery);
    setSubmittedQuery(trimmedQuery);
    setError('');
    addToRecentSearches(trimmedQuery);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runSearch(query);
  }

  function handleSelectRecentSearch(recentQuery: string) {
    setQuery(recentQuery);
    setShowSuggestions(false);
    runSearch(recentQuery);
  }

  return (
    <>
      <main className="search-page">
        <section className="search-header">
          <p className="eyebrow">PokéAPI</p>
          <h1>Finn en Pokémon</h1>
          <p>
            Søk på navn, eller en del av et navn – for eksempel «char» eller
            «pikachu».
          </p>
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setShowSuggestions(false)}
                placeholder="For eksempel: bulba"
                aria-label="Søk etter Pokémon"
              />
              {showSuggestions && recentSearches.length > 0 && (
                <ul className="recent-searches">
                  {recentSearches.map((recentQuery) => (
                    <li key={recentQuery}>
                      <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleSelectRecentSearch(recentQuery)}
                      >
                        {recentQuery}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button type="submit" disabled={isPending}>
              {isPending ? 'Laster Pokémon...' : 'Søk'}
            </button>
          </form>
        </section>

        <section className="results" aria-live="polite">
          {isError && (
            <p className="message error">
              Kunne ikke hente Pokémon: {queryError.message}
            </p>
          )}

          {!isError && error && (
            <p className="message error">{error}</p>
          )}

          {!isError && 
            !error && 
            !isPending &&
            submittedQuery && 
            pokemon.length === 0 && (
              <p className="message error">
                Fant ingen Pokémon som matcher «{submittedQuery}».
              </p>
            )}

          {!isError &&
            !error &&
            !isPending &&
            !submittedQuery && (
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
                    event.currentTarget.style.visibility = 'hidden';
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
  );
}

export default App;
