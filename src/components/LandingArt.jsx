// The human illustration used on the landing page only. Decorative.
export default function LandingArt() {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-brand-green-soft aspect-square w-full max-w-md mx-auto shadow-sm" aria-hidden="true">
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <circle cx="250" cy="140" r="95" fill="#FFD27A" />
        <path d="M30 400 V220 a115 115 0 0 1 230 0 V400 Z" fill="#B2DE2B" opacity="0.65" />
        {/* leaves */}
        <path d="M20 400 C40 330 90 300 150 290 C140 340 100 385 20 400 Z" fill="#5E9E4E" />
        <path d="M70 400 C90 350 130 330 180 330 C170 370 130 395 70 400 Z" fill="#9CCB6B" />
        {/* body */}
        <path d="M130 400 V300 a75 75 0 0 1 75 -75 h20 a75 75 0 0 1 75 75 V400 Z" fill="#FFB02E" />
        {/* arm */}
        <path d="M262 262 C290 270 312 300 328 340 L296 352 C284 322 270 304 250 296 Z" fill="#A9693F" />
        {/* neck and head */}
        <rect x="190" y="205" width="32" height="30" rx="10" fill="#A9693F" />
        <circle cx="206" cy="175" r="42" fill="#A9693F" />
        {/* hair */}
        <path d="M162 170 C158 128 190 112 214 116 C240 118 256 140 250 170 C240 150 220 144 196 146 C180 148 168 156 162 170 Z" fill="#26352B" />
        {/* plant pot */}
        <path d="M322 400 L330 366 H372 L378 400 Z" fill="#D9824E" />
        <path d="M350 366 C336 340 340 312 352 292 C368 316 366 344 350 366 Z" fill="#5E9E4E" />
        <path d="M352 366 C368 352 384 346 392 334 C388 356 376 366 352 366 Z" fill="#7FB55F" />
      </svg>
      <div className="absolute top-5 left-4 bg-white rounded-2xl shadow-md px-4 py-3 flex items-center gap-3">
        <span className="w-9 h-9 rounded-xl bg-brand-orange-soft flex items-center justify-center text-brand-orange font-bold">&#10022;</span>
        <div>
          <p className="font-heading font-bold text-sm">Scholarships</p>
          <p className="text-xs text-neutral-500">Browse by funding type</p>
        </div>
      </div>
      <div className="absolute bottom-5 right-4 bg-white rounded-2xl shadow-md px-4 py-3 flex items-center gap-3 max-w-[70%]">
        <span className="w-9 h-9 rounded-full bg-brand-green-soft flex items-center justify-center font-bold">&#10003;</span>
        <div>
          <p className="font-heading font-bold text-sm">Check eligibility</p>
          <p className="text-xs text-neutral-500">See where you stand</p>
        </div>
      </div>
    </div>
  )
}
