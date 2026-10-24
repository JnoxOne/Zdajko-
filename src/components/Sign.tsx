import type { SignId } from "../data/questions";

const FONT = "Barlow Condensed, Arial Narrow, sans-serif";

function Limit({ value }: { value: number }) {
  return (
    <svg viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="54" fill="#fff" stroke="#d52b1e" strokeWidth="12" />
      <text x="60" y="78" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="52" fill="#17191c">{value}</text>
    </svg>
  );
}

const SIGNS: Record<SignId, { label: string; svg: React.ReactNode }> = {
  stop: {
    label: "Znak B-20 STOP",
    svg: (
      <svg viewBox="0 0 120 120">
        <polygon points="35,4 85,4 116,35 116,85 85,116 35,116 4,85 4,35" fill="#d52b1e" stroke="#fff" strokeWidth="4" />
        <text x="60" y="73" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="38" fill="#fff">STOP</text>
      </svg>
    )
  },
  yield: {
    label: "Znak A-7 ustąp pierwszeństwa",
    svg: (
      <svg viewBox="0 0 120 110">
        <path d="M8 8h104L60 102Z" fill="#f2c200" stroke="#d52b1e" strokeWidth="10" strokeLinejoin="round" />
      </svg>
    )
  },
  limit70: { label: "Znak B-33 ograniczenie prędkości do 70 km/h", svg: <Limit value={70} /> },
  priority: {
    label: "Znak D-1 droga z pierwszeństwem",
    svg: (
      <svg viewBox="0 0 120 120">
        <rect x="24" y="24" width="72" height="72" transform="rotate(45 60 60)" fill="#fff" stroke="#17191c" strokeWidth="2" />
        <rect x="36" y="36" width="48" height="48" transform="rotate(45 60 60)" fill="#f2c200" />
      </svg>
    )
  },
  noOvertake: {
    label: "Znak B-25 zakaz wyprzedzania",
    svg: (
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="#fff" stroke="#d52b1e" strokeWidth="12" />
        <rect x="28" y="50" width="26" height="22" rx="5" fill="#d52b1e" />
        <rect x="66" y="50" width="26" height="22" rx="5" fill="#17191c" />
        {[34, 48, 72, 86].map(cx => <circle key={cx} cx={cx} cy="74" r="4" fill="#17191c" />)}
      </svg>
    )
  },
  crossing: {
    label: "Znak D-6 przejście dla pieszych",
    svg: (
      <svg viewBox="0 0 120 120">
        <rect x="6" y="6" width="108" height="108" rx="10" fill="#0b5cad" />
        <path d="M60 20 102 92H18Z" fill="#fff" />
        <g fill="#17191c">
          <circle cx="62" cy="46" r="5" />
          <path d="M58 53h8l5 14-4 1-3-7-2 10 6 12h-5l-5-10-4 10h-5l5-13 1-11-4 5h-4Z" />
          <rect x="30" y="84" width="60" height="3" />
        </g>
      </svg>
    )
  },
  arrow: {
    label: "Sygnalizator z czerwonym światłem i zieloną strzałką warunkową",
    svg: (
      <svg viewBox="0 0 120 140">
        <rect x="22" y="4" width="76" height="132" rx="14" fill="#17191c" />
        <circle cx="60" cy="30" r="17" fill="#d52b1e" />
        <circle cx="60" cy="70" r="17" fill="#3a3d42" />
        <circle cx="60" cy="110" r="17" fill="#3a3d42" />
        <rect x="100" y="94" width="16" height="32" rx="4" fill="#17191c" />
        <path d="M103 110h7m-3-4 4 4-4 4" stroke="#3ccf6e" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  triangle: {
    label: "Trójkąt ostrzegawczy",
    svg: (
      <svg viewBox="0 0 120 110">
        <path d="M60 8 112 100H8Z" fill="none" stroke="#d52b1e" strokeWidth="12" strokeLinejoin="round" />
        <path d="M60 34 90 88H30Z" fill="#f08a3a" opacity=".55" />
      </svg>
    )
  }
};

export function Sign({ id }: { id: SignId }) {
  const s = SIGNS[id];
  return <div className="sign" role="img" aria-label={s.label}>{s.svg}</div>;
}
