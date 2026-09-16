import { useCallback, useEffect, useState } from 'react';
import type { Pokemon } from './Api';

// localStorage-nøkkelen favorittene lagres under. Ligger her som en
// konstant slik at nøkkelen kun defineres ett sted i kodebasen.
const STORAGE_KEY = 'pokedex-favorites';

function readFavorites(): Pokemon[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Pokemon[]) : [];
  } catch {
    // Ugyldig JSON eller localStorage utilgjengelig (f.eks. privat
    // nettlesing i enkelte nettlesere) -> start med tom liste.
    return [];
  }
}

// Egen hook som kapsler inn lagring av favoritt-pokémon i localStorage.
// Favoritter skal overleve at siden lastes på nytt (i motsetning til
// f.eks. søketeksten, som er en god kandidat for sessionStorage).
export function useFavorites() {
  const [favorites, setFavorites] = useState<Pokemon[]>(() => readFavorites());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Lagring kan feile (f.eks. quota exceeded) - da fortsetter appen
      // bare med favorittene i minnet for resten av økten.
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (id: number) => favorites.some((favorite) => favorite.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((pokemon: Pokemon) => {
    setFavorites((current) => {
      const alreadyFavorite = current.some(
        (favorite) => favorite.id === pokemon.id
      );
      if (alreadyFavorite) {
        return current.filter((favorite) => favorite.id !== pokemon.id);
      }
      return [...current, pokemon];
    });
  }, []);

  return { favorites, isFavorite, toggleFavorite };
}
