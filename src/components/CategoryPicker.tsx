import { CATEGORIES, type CategoryId } from "../data/categories";

interface Props {
  current: CategoryId | null;
  onPick: (id: CategoryId) => void;
}

export function CategoryPicker({ current, onPick }: Props) {
  return (
    <div className="picker">
      <div className="hero">
        <h1>Zdaj<b>ko</b></h1>
        <p>Na jaką kategorię prawa jazdy się uczysz? Dobierzemy pytania z egzaminu dla tej kategorii. Zmienisz ją później w menu.</p>
      </div>
      <div className="cats">
        {CATEGORIES.map(c => (
          <button key={c.id} className={`cat-tile${c.id === current ? " on" : ""}`} onClick={() => onPick(c.id)}>
            <b>{c.id}</b>
            <span>{c.name}</span>
            {c.note && <small>{c.note}</small>}
          </button>
        ))}
      </div>
    </div>
  );
}
