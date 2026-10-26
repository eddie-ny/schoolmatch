// Original illustration for the International path: a globe, a paper plane and a graduation cap. Decorative only.
export default function IntlArt({ className = '' }) {
  return (
    <svg viewBox="30 10 280 230" className={className} aria-hidden="true" focusable="false">
      <circle cx="170" cy="130" r="86" fill="#FFB02E" />
      <circle cx="170" cy="130" r="86" fill="none" stroke="#fff" strokeWidth="3" opacity="0.7" />
      <ellipse cx="170" cy="130" rx="38" ry="86" fill="none" stroke="#fff" strokeWidth="3" opacity="0.7" />
      <path d="M84 130 H256 M96 92 H244 M96 168 H244" stroke="#fff" strokeWidth="3" opacity="0.7" />
      <path d="M120 84 C140 70 160 80 158 100 C156 118 130 120 124 108 Z" fill="#5E9E4E" />
      <path d="M190 120 C214 112 232 130 226 150 C220 168 196 166 190 150 Z" fill="#5E9E4E" />
      {/* paper plane */}
      <path d="M20 70 L120 28 L92 112 L66 86 Z" fill="#fff" />
      <path d="M66 86 L120 28 L74 96 Z" fill="#D9D9D9" />
      <path d="M20 70 C40 74 52 90 60 106" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
      {/* graduation cap */}
      <path d="M200 40 L270 62 L200 84 L130 62 Z" fill="#26352B" />
      <path d="M160 74 V96 C176 108 224 108 240 96 V74 L200 86 Z" fill="#3A4F40" />
      <path d="M270 62 V92" stroke="#B2DE2B" strokeWidth="4" strokeLinecap="round" />
      <circle cx="270" cy="96" r="5" fill="#B2DE2B" />
    </svg>
  )
}
