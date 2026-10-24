export const CATEGORIES = [
  { id: "B", name: "Samochód osobowy", note: "Najczęściej wybierana" },
  { id: "AM", name: "Motorower", note: "Do 45 km/h" },
  { id: "A1", name: "Motocykl do 125 cm³", note: "" },
  { id: "A2", name: "Motocykl do 35 kW", note: "" },
  { id: "A", name: "Motocykl", note: "Bez ograniczeń" },
  { id: "B1", name: "Czterokołowiec", note: "" },
  { id: "C1", name: "Ciężarówka do 7,5 t", note: "" },
  { id: "C", name: "Ciężarówka", note: "" },
  { id: "D1", name: "Autobus do 16 miejsc", note: "" },
  { id: "D", name: "Autobus", note: "" },
  { id: "T", name: "Ciągnik rolniczy", note: "" },
  { id: "PT", name: "Tramwaj", note: "" }
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

const KEY = "zdajko.category";

export function loadCategory(): CategoryId | null {
  try {
    const v = localStorage.getItem(KEY);
    return CATEGORIES.some(c => c.id === v) ? (v as CategoryId) : null;
  } catch {
    return null;
  }
}

export function saveCategory(id: CategoryId): void {
  try {
    localStorage.setItem(KEY, id);
  } catch {
    // Storage blocked: the choice lasts until the page is closed.
  }
}
