// Example questions written from the traffic rules for the first version.
// They will be replaced by the official exam question base (with photos and videos).

export type SignId = "stop" | "yield" | "limit70" | "priority" | "noOvertake" | "crossing" | "arrow" | "triangle";

/** Exam weighting: every question is worth 3, 2 or 1 point. */
export type Points = 1 | 2 | 3;

interface Base {
  id: string;
  category: string;
  question: string;
  points: Points;
  explanation: string;
  sign?: SignId;
}

/** Basic question, answered TAK (swipe right) or NIE (swipe left). */
export interface YesNoQuestion extends Base {
  type: "yn";
  answer: boolean;
}

/** Specialist question with three options, A/B/C, like on the real exam. */
export interface AbcQuestion extends Base {
  type: "abc";
  options: [string, string, string];
  answer: 0 | 1 | 2;
}

export type Question = YesNoQuestion | AbcQuestion;

export const QUESTIONS: Question[] = [
  { id: "yn-stop", type: "yn", category: "Znaki", sign: "stop", points: 3, answer: true,
    question: "Czy przed tym znakiem musisz zatrzymać pojazd, nawet gdy na skrzyżowaniu nic nie jedzie?",
    explanation: "Znak B-20 „STOP” nakazuje zawsze zatrzymać pojazd przed linią lub krawędzią jezdni i ustąpić pierwszeństwa." },
  { id: "yn-yield", type: "yn", category: "Znaki", sign: "yield", points: 3, answer: false,
    question: "Czy ten znak nakazuje bezwzględnie zatrzymać pojazd?",
    explanation: "Znak A-7 nakazuje ustąpić pierwszeństwa. Zatrzymujesz się tylko wtedy, gdy wymaga tego sytuacja na drodze." },
  { id: "yn-speed-town", type: "yn", category: "Prędkość", points: 3, answer: true,
    question: "Czy w obszarze zabudowanym w godzinach 5–23 dopuszczalna prędkość samochodu osobowego wynosi 50 km/h?",
    explanation: "W obszarze zabudowanym obowiązuje 50 km/h w godzinach 5–23 i 60 km/h w godzinach 23–5." },
  { id: "yn-limit70", type: "yn", category: "Prędkość", sign: "limit70", points: 2, answer: false,
    question: "Czy na drodze z tym znakiem możesz jechać samochodem osobowym 80 km/h?",
    explanation: "Znak B-33 ogranicza prędkość do 70 km/h. Każda wyższa prędkość to wykroczenie." },
  { id: "yn-motorway", type: "yn", category: "Prędkość", points: 2, answer: true,
    question: "Czy na autostradzie samochód osobowy może jechać 140 km/h?",
    explanation: "Na autostradzie limit dla samochodu osobowego wynosi 140 km/h, chyba że znaki stanowią inaczej." },
  { id: "yn-alcohol", type: "yn", category: "Alkohol", points: 3, answer: false,
    question: "Czy możesz prowadzić samochód, mając 0,3 promila alkoholu we krwi?",
    explanation: "Od 0,2‰ to już stan po użyciu alkoholu, a od 0,5‰ stan nietrzeźwości. W obu przypadkach nie wolno prowadzić." },
  { id: "yn-overtake-crossing", type: "yn", category: "Piesi", sign: "crossing", points: 3, answer: false,
    question: "Czy wolno wyprzedzać pojazd bezpośrednio przed przejściem dla pieszych?",
    explanation: "Wyprzedzanie pojazdu na przejściu dla pieszych i bezpośrednio przed nim jest zabronione." },
  { id: "yn-pedestrian", type: "yn", category: "Piesi", points: 3, answer: true,
    question: "Czy pieszy wchodzący na przejście dla pieszych ma pierwszeństwo przed samochodem?",
    explanation: "Od czerwca 2021 kierujący musi ustąpić pierwszeństwa pieszemu, który wchodzi na przejście albo na nim jest." },
  { id: "yn-stop-10m", type: "yn", category: "Zatrzymanie", points: 2, answer: false,
    question: "Czy możesz zatrzymać samochód 5 metrów przed przejściem dla pieszych?",
    explanation: "Zatrzymanie jest zabronione na przejściu i w odległości mniejszej niż 10 m przed nim." },
  { id: "yn-priority", type: "yn", category: "Pierwszeństwo", sign: "priority", points: 2, answer: true,
    question: "Czy ten znak informuje, że jedziesz drogą z pierwszeństwem?",
    explanation: "Znak D-1 oznacza drogę z pierwszeństwem. Na najbliższych skrzyżowaniach to inni ustępują Tobie." },
  { id: "yn-right-hand", type: "yn", category: "Pierwszeństwo", points: 3, answer: true,
    question: "Czy na skrzyżowaniu równorzędnym musisz ustąpić pierwszeństwa pojazdowi nadjeżdżającemu z prawej strony?",
    explanation: "To zasada prawej ręki: na skrzyżowaniu równorzędnym ustępujesz pojazdom z prawej." },
  { id: "yn-green-arrow", type: "yn", category: "Sygnały", sign: "arrow", points: 3, answer: false,
    question: "Czy przy zielonej strzałce warunkowej możesz skręcić w prawo bez zatrzymania się?",
    explanation: "Sygnał S-2 z zieloną strzałką wymaga zatrzymania się przed sygnalizatorem i ustąpienia pierwszeństwa." },
  { id: "yn-no-overtake", type: "yn", category: "Znaki", sign: "noOvertake", points: 1, answer: false,
    question: "Czy ten znak zabrania wyprzedzania motocykla jednośladowego?",
    explanation: "Znak B-25 zabrania wyprzedzania pojazdów silnikowych wielośladowych. Jednośladu wyprzedzić można, o ile nie zabraniają tego inne przepisy." },
  { id: "yn-bridge-uturn", type: "yn", category: "Manewry", points: 2, answer: false,
    question: "Czy wolno zawracać na moście?",
    explanation: "Zawracanie jest zabronione m.in. na autostradzie, drodze ekspresowej, moście, wiadukcie i w tunelu." },
  { id: "yn-child-seat", type: "yn", category: "Bezpieczeństwo", points: 2, answer: true,
    question: "Czy dziecko o wzroście 120 cm musi jechać w foteliku lub innym urządzeniu przytrzymującym?",
    explanation: "Dziecko poniżej 150 cm wzrostu przewozi się w foteliku. Wyjątek bez fotelika dotyczy tylko dzieci mających co najmniej 135 cm na tylnym siedzeniu." },
  { id: "yn-rear-fog", type: "yn", category: "Światła", points: 1, answer: true,
    question: "Czy tylne światło przeciwmgłowe możesz włączyć, gdy mgła ogranicza widoczność do mniej niż 50 m?",
    explanation: "Tylne światła przeciwmgłowe wolno włączyć przy widoczności mniejszej niż 50 m i trzeba je wyłączyć, gdy widoczność się poprawi." },
  { id: "yn-phone", type: "yn", category: "Telefon", points: 1, answer: false,
    question: "Czy podczas jazdy możesz rozmawiać przez telefon, trzymając go w ręce?",
    explanation: "W czasie jazdy można rozmawiać tylko przez zestaw głośnomówiący lub słuchawkę, bez trzymania telefonu." },
  { id: "yn-triangle-motorway", type: "yn", category: "Awaria", sign: "triangle", points: 2, answer: true,
    question: "Czy na autostradzie trójkąt ostrzegawczy ustawiasz około 100 m za pojazdem?",
    explanation: "Na autostradzie i drodze ekspresowej trójkąt stawiasz 100 m za pojazdem, poza obszarem zabudowanym 30–50 m, w obszarze zabudowanym bezpośrednio za pojazdem lub na nim." },

  { id: "abc-speed-rural", type: "abc", category: "Prędkość", points: 3, answer: 1,
    question: "Z jaką prędkością możesz jechać samochodem osobowym poza obszarem zabudowanym, na zwykłej drodze jednojezdniowej?",
    options: ["80 km/h", "90 km/h", "100 km/h"],
    explanation: "Poza obszarem zabudowanym limit wynosi 90 km/h. Na drodze dwujezdniowej z dwoma pasami w każdym kierunku jest to 100 km/h." },
  { id: "abc-triangle", type: "abc", category: "Awaria", sign: "triangle", points: 2, answer: 1,
    question: "W jakiej odległości za pojazdem ustawiasz trójkąt poza obszarem zabudowanym, na zwykłej drodze?",
    options: ["Bezpośrednio za pojazdem", "30–50 m", "100 m"],
    explanation: "Poza obszarem zabudowanym 30–50 m. 100 m dotyczy autostrady i drogi ekspresowej." },
  { id: "abc-alcohol", type: "abc", category: "Alkohol", points: 3, answer: 1,
    question: "Od jakiego stężenia alkoholu we krwi zaczyna się stan nietrzeźwości?",
    options: ["0,2‰", "0,5‰", "0,8‰"],
    explanation: "Stan po użyciu alkoholu to 0,2–0,5‰, a od 0,5‰ zaczyna się stan nietrzeźwości, czyli przestępstwo." },
  { id: "abc-probation", type: "abc", category: "Młody kierowca", points: 1, answer: 1,
    question: "Ile trwa okres próbny dla nowego kierowcy kategorii B?",
    options: ["1 rok", "2 lata", "3 lata"],
    explanation: "Okres próbny trwa 2 lata od wydania pierwszego prawa jazdy." },
  { id: "abc-probation-speed", type: "abc", category: "Młody kierowca", points: 2, answer: 0,
    question: "Z jaką maksymalną prędkością kierowca w okresie próbnym może jechać autostradą?",
    options: ["100 km/h", "120 km/h", "140 km/h"],
    explanation: "W okresie próbnym limity to 50 km/h w terenie zabudowanym, 80 km/h poza nim i 100 km/h na autostradzie i ekspresówce." },
  { id: "abc-stop", type: "abc", category: "Znaki", sign: "stop", points: 3, answer: 1,
    question: "Co oznacza ten znak?",
    options: ["Ustąp pierwszeństwa, zatrzymaj się tylko w razie potrzeby", "Zatrzymaj się zawsze i ustąp pierwszeństwa", "Zakaz zatrzymywania się"],
    explanation: "B-20 „STOP”: zatrzymanie jest obowiązkowe zawsze, nawet przy pustym skrzyżowaniu." },
  { id: "abc-pass-mark", type: "abc", category: "Egzamin", points: 1, answer: 1,
    question: "Ile punktów trzeba zdobyć, żeby zdać egzamin teoretyczny na kategorię B?",
    options: ["60 z 74", "68 z 74", "74 z 74"],
    explanation: "Egzamin to 32 pytania i maksymalnie 74 punkty. Do zaliczenia potrzeba 68." }
];
