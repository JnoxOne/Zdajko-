# Zdajko

Nauka do egzaminu teoretycznego na prawo jazdy (kat. B) w formie kart, jak na Tinderze:
przesuwasz w prawo, gdy odpowiedź to TAK, w lewo, gdy NIE. Co czwarta karta to pytanie
specjalistyczne z odpowiedziami A/B/C.

## Co już działa

- Runda 16 kart: swipe TAK/NIE (palcem, myszką lub strzałkami ← →) i pytania A/B/C (klawisze A B C).
- Punktacja jak na egzaminie: pytania za 3, 2 lub 1 punkt, wynik przeliczany na skalę 74 pkt z progiem 68.
- Wyjaśnienie po każdej odpowiedzi, licznik serii.
- Zapis postępów w przeglądarce i tryb „Powtórz błędy”.
- PWA: aplikację można dodać do ekranu głównego telefonu i działa offline.

Pytania w `src/data/questions.ts` są przykładowe, napisane na podstawie przepisów.
Docelowo zastąpi je oficjalna baza pytań egzaminacyjnych z obrazkami i filmami.

## Plan

1. Import oficjalnej bazy pytań (z multimediami) i egzamin próbny 32 pytania / 25 minut.
2. Konta użytkowników.
3. Liga tygodnia, znajomi, wyzwania na punkty.

## Uruchomienie

```bash
npm install
npm run dev      # serwer deweloperski
npm test         # testy logiki gry
npm run build    # wersja produkcyjna w dist/
```

Każdy push do `main` uruchamia testy i publikuje aplikację na GitHub Pages
(`.github/workflows/deploy.yml`).
