import type { Pokemon } from './Api';

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

type FavoritesSidebarProps = {
  favorites: Pokemon[];
  onRemove: (pokemon: Pokemon) => void;
};

// Viser de lagrede favorittene. Selve komponenten er den samme uansett
// skjermstørrelse - det er CSS-en (.favorites-bar) som gjør den om fra en
// fast sidebar på store skjermer til en horisontal bunn-bar på mobil.
function FavoritesSidebar({ favorites, onRemove }: FavoritesSidebarProps) {
  return (
    <aside className="favorites-bar" aria-label="Favoritt-pokémon">
      <h2 className="favorites-title">
        Favoritter{' '}
        {favorites.length > 0 && (
          <span className="favorites-count">{favorites.length}</span>
        )}
      </h2>
      {favorites.length === 0 ? (
        <p className="favorites-empty">
          Ingen favoritter enda. Trykk på <span aria-hidden="true">★</span> på
          en Pokémon for å legge den til her.
        </p>
      ) : (
        <ul className="favorites-list">
          {favorites.map((pokemon) => (
            <li key={pokemon.id} className="favorite-item">
              <img src={pokemon.imageUrl} alt="" loading="lazy" />
              <span className="favorite-name">{capitalize(pokemon.name)}</span>
              <button
                type="button"
                className="favorite-remove"
                onClick={() => onRemove(pokemon)}
                aria-label={`Fjern ${capitalize(pokemon.name)} fra favoritter`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default FavoritesSidebar;
