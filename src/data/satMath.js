// SAT-style math questions (no calculator and calculator sections), made fresh each time the test starts.
// Each maker below copies the TYPE of one question from the owner's practice tests (section 3 of tests 1 to 8, section 4 of tests 1 to 8), with new numbers and names,
// so every attempt is different but tests the same skill. The wording is written for this site, not copied.
// Grid-in (type the answer) questions in the source are multiple choice here, like the rest of the test.
// Same file in the web app (src/data/satMath.js) and the phone app (mobile/src/lib/satMath.js): keep them identical.
// Each maker returns { section, q, options: [4 strings], answer: index of the right one, why }.

const r = (a, b) => a + Math.floor(Math.random() * (b - a + 1))
const pick = (list) => list[Math.floor(Math.random() * list.length)]
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a))
const M = '−' // minus sign
const num = (n) => (n < 0 ? `${M}${-n}` : String(n))
// "+ 5" or "− 5" after a term
const tail = (n) => (n < 0 ? ` ${M} ${-n}` : ` + ${n}`)
// A fraction in lowest terms: 6/4 -> "3/2", 4/2 -> "2", -1/3 -> "−1/3"
const frac = (n, d) => {
  if (d < 0) { n = -n; d = -d }
  const g = gcd(n, d) || 1
  n /= g; d /= g
  return d === 1 ? num(n) : `${n < 0 ? M : ''}${Math.abs(n)}/${d}`
}
// Coefficient in front of a letter: 1 -> "", -1 -> "−", 3/2 -> "(3/2)"
const coef = (n, d = 1) => {
  const f = frac(n, d)
  if (f === '1') return ''
  if (f === `${M}1`) return M
  return f.includes('/') ? `(${f})` : f
}

// Puts the right answer among the wrong ones in a random order. Wrong ones that repeat the right one or each other are dropped,
// and spare wrong ones fill the gap, so there are always 4 different choices.
function choices(right, wrong, spare = []) {
  const seen = new Set([right])
  const out = [right]
  for (const w of [...wrong, ...spare]) {
    if (out.length === 4) break
    if (w == null || seen.has(w)) continue
    seen.add(w)
    out.push(w)
  }
  // Numbers: fill with nearby numbers.
  const n = Number(right.replace(M, '-'))
  for (let k = 1; out.length < 4 && Number.isFinite(n); k++) {
    for (const w of [num(n + k), num(n - k)]) if (out.length < 4 && !seen.has(w)) { seen.add(w); out.push(w) }
  }
  // Fractions like 3/11: fill with nearby fractions over the same bottom number.
  const fm = right.match(/^(−?)(\d+)\/(\d+)$/)
  for (let k = 1; out.length < 4 && fm && k < 20; k++) {
    const top = (fm[1] ? -1 : 1) * Number(fm[2]), bot = Number(fm[3])
    for (const w of [frac(top + k, bot), frac(top - k, bot)]) if (out.length < 4 && !seen.has(w) && w !== '0') { seen.add(w); out.push(w) }
  }
  if (out.length < 4) throw new Error(`Not enough answer choices for ${right}`)
  const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5)
  return { options: order.map((i) => out[i]), answer: order.indexOf(0) }
}
// Numbers are shown with a real minus sign, like the rest of the text.
const show = (v) => (typeof v === 'number' ? num(v) : String(v))
const ask = (q, right, wrong, why, spare) => ({ section: 'Math', q, ...choices(show(right), wrong.map(show), (spare || []).map(show)), why })

const NAMES = ['Ama', 'Kofi', 'Esi', 'Yaw', 'Abena', 'Kwame', 'Akosua', 'Kojo', 'Efua', 'Nana']

// Section 3 of the owner's practice test 1 (no calculator), questions 1 to 20.
const NO_CALC = [
  // 1. Solve a linear equation with a fraction, then report 2x.
  function linearFraction() {
    const a = r(1, 9), b = r(1, 5), K = r(b + 1, b + 8)
    const twoX = 2 * (K - b) + a
    return ask(`If (2x ${M} ${a})/2 = k ${M} ${b} and k = ${K}, what is the value of 2x?`, twoX,
      [2 * (K - b), 2 * (K - b) - a, twoX / 2], `Put k = ${K}: (2x ${M} ${a})/2 = ${K - b}. Multiply both sides by 2: 2x ${M} ${a} = ${2 * (K - b)}. Add ${a}: 2x = ${twoX}.`, [twoX + 2])
  },
  // 2. Subtract complex numbers and read off the real or imaginary part.
  function complexSubtract() {
    const p = r(2, 9), q = r(1, 9), s = r(2, 9), t = r(1, 9)
    const realPart = pick([true, false])
    const re = p - s, im = q + t
    const right = realPart ? re : im
    return ask(`(${p} + ${q}i) ${M} (${s} ${M} ${t}i) = a + bi. In the equation above, a and b are real numbers and i = √${M}1. What is the value of ${realPart ? 'a' : 'b'}?`,
      num(right), realPart ? [num(p + s), num(-re), num(q - t)] : [num(q - t), num(-im), num(re)],
      `Subtract each part: real part ${p} ${M} ${s} = ${num(re)}, imaginary part ${q} ${M} (${M}${t}) = ${im}. So a = ${num(re)} and b = ${im}.`, [num(right + 1)])
  },
  // 3. Write the original price from "d dollars more than half the original price".
  function halfPricePlus() {
    const d = 5 * r(2, 12), name = pick(NAMES)
    return ask(`${name} paid k dollars for a phone. That was ${d} dollars more than half of the original price. What was the original price, in dollars?`,
      `2k ${M} ${2 * d}`, [`k + ${d}`, `k ${M} ${2 * d}`, `2k ${M} ${d}`],
      `k = (original price)/2 + ${d}. Subtract ${d}: k ${M} ${d} = (original price)/2. Multiply by 2: original price = 2k ${M} ${2 * d}.`)
  },
  // 4. Rearrange a daily total over n days to find one part.
  function rearrangeDaily() {
    const n = r(3, 7), name = pick(NAMES)
    return ask(`${name} trains m hours every morning and p hours every evening, the same each day. In ${n} days ${name} trains k hours in total. Which expression gives m?`,
      `(k ${M} ${n}p)/${n}`, [`(k ${M} p)/${n}`, `k ${M} ${n}p`, `${n}(k ${M} p)`],
      `Each day is m + p hours, so ${n}(m + p) = k. Then ${n}m = k ${M} ${n}p, and m = (k ${M} ${n}p)/${n}.`)
  },
  // 5. Read a change from a linear model.
  function linearModelChange() {
    const B = pick([5, 10, 20, 25]), t = r(2, 9), s2 = r(5, 30), s1 = s2 + t
    const A = 100 * Math.ceil((B * s1 + 100) / 100) + 100 * r(0, 6)
    const u1 = A - B * s1, u2 = A - B * s2
    return ask(`A shop finds that the number of units it sells, P, follows P = ${A} ${M} ${B}s, where s is the price in dollars. By how many dollars must the price go down for sales to rise from ${u1} units to ${u2} units?`,
      t, [2 * t, u2 - u1, B], `${u2} ${M} ${u1} = ${u2 - u1} more units. Each dollar off the price adds ${B} units, so the price goes down by ${u2 - u1}/${B} = ${t} dollars.`, [t + 1, t + 5])
  },
  // 6. Difference of two squares of binomials.
  function squaresDifference() {
    const m = r(1, 3), n = r(1, 3)
    const A = `${coef(m)}x²`, B = `${coef(n)}y²`
    return ask(`Which expression is equal to (${A} + ${B})² ${M} (${A} ${M} ${B})²?`,
      `${coef(4 * m * n)}x²y²`, [`${coef(2 * m * n)}x²y²`, `${coef(m * m)}x⁴ ${M} ${coef(n * n)}y⁴`, `2(${A} + ${B})`],
      `(P + Q)² ${M} (P ${M} Q)² = 4PQ. Here P = ${A} and Q = ${B}, so the answer is 4 × ${A} × ${B} = ${coef(4 * m * n)}x²y².`)
  },
  // 7. Time to reach a total at a steady rate.
  function rateTime() {
    const n = r(1, 4), name = pick(NAMES)
    const every = n === 1 ? 'every week' : `every ${n} weeks`
    return n === 1
      ? ask(`${name} earns k dollars ${every}. At this rate, how many weeks will it take ${name} to earn p dollars?`, 'p/k', ['k/p', 'kp', `p ${M} k`],
        'Weeks = total ÷ amount per week = p/k.')
      : ask(`${name} earns k dollars ${every}. At this rate, how many weeks will it take ${name} to earn p dollars?`, `${n}p/k`, [`p/(${n}k)`, `${n}k/p`, `kp/${n}`],
        `${name} earns k dollars per ${n} weeks, so p dollars takes p/k lots of ${n} weeks, which is ${n}p/k weeks.`)
  },
  // 8. Use one ratio to find another.
  function ratioFlip() {
    let m, c, n, v
    do { m = r(2, 5); c = r(2, 9); n = r(2, 9); v = (n * m) / c } while (!Number.isInteger(v * 2) || m === c)
    const show = (x) => (Number.isInteger(x) ? String(x) : x.toFixed(1))
    return ask(`If ${m}a/b = ${c}, what is the value of ${n}b/a?`, show(v), [show((n * c) / m), show(n / c), show(m * c)],
      `${m}a/b = ${c} means a/b = ${c}/${m}, so b/a = ${m}/${c}. Then ${n}b/a = ${n} × ${m}/${c} = ${show(v)}.`, [show(v + 1)])
  },
  // 9. Constants that make a system have no solution.
  function noSolutionSystem() {
    let t, b, p, q, C1, C2, a
    do {
      p = null
      t = r(2, 3); b = r(1, 4); a = t * b
      const prod = t * b * b
      const divs = [...Array(prod).keys()].map((x) => x + 1).filter((x) => prod % x === 0 && x <= 9 && prod / x <= 9)
      if (!divs.length) continue
      p = pick(divs); q = prod / p; C1 = r(2, 20); C2 = r(2, 20)
    } while (p == null || C1 * a === C2 * p)
    const wrong = [b, 2 * a, a + 1, a - 1, t, a + 2].filter((w) => w !== a && w !== -a && w !== 0)
    return ask(`${coef(p)}x + by = ${C1} and ax + ${coef(q)}y = ${C2}. In this system, a and b are constants and a = ${t}b. If the system has no solution, which could be the value of a?`,
      a, wrong.slice(0, 3), `No solution means the lines are parallel: ${p}/a = b/${q}, so ab = ${p * q}. With a = ${t}b, ${t}b² = ${p * q}, so b = ±${b} and a = ±${a}. The lines are not the same line, so a = ${a} works.`, wrong.slice(3))
  },
  // 10. Even function: f(n) = f(−n).
  function evenFunction() {
    const a = r(1, 4), c = r(2, 20), m = r(1, 4)
    let n; do { n = r(2, 6) } while (n === m)
    const v = a * m * m - c
    return ask(`f(x) = ax² ${M} ${c}. For the function f above, a is a constant and f(${m}) = ${num(v)}. Which of these is equal to f(${n})?`,
      `f(${M}${n})`, ['f(0)', `f(${m})`, `f(${M}${m})`],
      `First a: a(${m * m}) ${M} ${c} = ${num(v)}, so a = ${a}. Only x² appears, and (${M}${n})² = ${n}², so f(${M}${n}) = f(${n}).`)
  },
  // 11. People and time: same total work.
  function workPeople() {
    let W, H, H2, need
    do { W = r(2, 8); H = pick([6, 8, 10, 12, 15, 20, 24]); H2 = r(3, H * 2); need = (W * H) / H2 } while (!Number.isInteger(need) || need === W || H2 === H || need > 30)
    const inv = (W * H2) / H
    return ask(`A job takes ${H} hours when ${W} people work on it. How many people are needed to do the same job in ${H2} hours?`,
      need, [Number.isInteger(inv) ? inv : null, W, need * 2].filter((x) => x != null && x > 0),
      `The job is ${W} × ${H} = ${W * H} person-hours. In ${H2} hours that needs ${W * H}/${H2} = ${need} people.`, [need + 1, need + 2])
  },
  // 12. Complete the square.
  function completeSquare() {
    const h = pick([1, 2, 3, 4, 5, 6].flatMap((x) => [x, -x])), c = r(-10, 15)
    const k = c - h * h
    const sq = (s) => `(x ${s < 0 ? '+' : M} ${Math.abs(s)})²`
    const line = `x² ${h > 0 ? M : '+'} ${Math.abs(2 * h)}x${c === 0 ? '' : tail(c)}`
    const tailOf = (n) => (n === 0 ? '' : tail(n))
    return ask(`Which of the following is equal to f(x) = ${line}?`, `f(x) = ${sq(h)}${tailOf(k)}`,
      [`f(x) = ${sq(-h)}${tailOf(k)}`, `f(x) = ${sq(h)}${tailOf(-k)}`, `f(x) = ${sq(h)}${tailOf(c + h * h)}`],
      `Half of ${num(-2 * h)} is ${num(-h)}, so ${sq(h)} = ${line.replace(/ [+−] \d+$/, '')}${tail(h * h)}. To get ${num(c)} at the end, add ${num(k)}: f(x) = ${sq(h)}${tailOf(k)}.`, [`f(x) = ${sq(-h)}${tailOf(-k)}`, `f(x) = ${sq(h)}${tailOf(k + 1)}`, `f(x) = ${sq(h)}${tailOf(k - 1)}`])
  },
  // 13. Match coefficients after expanding a product.
  function matchCoefficients() {
    const p = r(2, 4), q = r(1, 5), a = r(2, 8), b = -r(1, 6)
    const A = p * a, C = -q * b, k = p * b - q * a
    return ask(`If ${A}x² ${M} kx + ${C} = (${p}x + ${q})(ax ${M} b) for all values of x, where a, b and k are constants, what is the value of k?`,
      num(k), [num(-k), num(p * b + q * a), num(-(p * b + q * a))],
      `(${p}x + ${q})(ax ${M} b) = ${p}ax² + (${q}a ${M} ${p}b)x ${M} ${q}b. So ${p}a = ${A} gives a = ${a}, and ${M}${q}b = ${C} gives b = ${num(b)}. The middle term is ${q}(${a}) ${M} ${p}(${num(b)}) = ${num(q * a - p * b)}, and it equals ${M}k, so k = ${num(k)}.`, [num(k + 2)])
  },
  // 14. Powers with the same base.
  function sameBasePowers() {
    const m = pick([2, 3]), base = m === 2 ? 9 : 27
    let a, b, e
    do { a = r(2, 6); b = r(1, 8); e = m * a - b } while (e < 1 || e > 6)
    return ask(`If a + b = ${a + b} and ${base}ᵃ/3ᵇ = ${3 ** e}, what is the value of a?`, a, [b, a + 1, a - 1].filter((x) => x > 0),
      `${base}ᵃ = 3^(${m}a) and ${3 ** e} = 3^${e}, so ${m}a ${M} b = ${e}. Add a + b = ${a + b}: ${m + 1}a = ${a + b + e}, so a = ${a}.`, [a + 2, a + 3])
  },
  // 15. Perpendicular slope.
  function perpendicularLine() {
    let p, q
    do { p = r(1, 5); q = r(1, 5) * pick([1, -1]) } while (gcd(p, q) !== 1 || Math.abs(p) === Math.abs(q))
    const rhs = r(1, 9)
    const c = r(-5, 5) || 2
    const line = (n, d) => `y = ${coef(n, d)}x${tail(c)}`
    return ask(`In the xy-plane, line ℓ has the equation ${coef(p)}x ${q < 0 ? M : '+'} ${coef(Math.abs(q))}y = ${rhs}. Line m is perpendicular to line ℓ. Which could be the equation of line m?`,
      line(q, p), [line(-q, p), line(-p, q), line(p, q)],
      `Line ℓ: y = ${coef(-p, q)}x + ..., so its slope is ${frac(-p, q)}. A perpendicular slope is the negative reciprocal: ${frac(q, p)}.`)
  },
  // 16. Right-triangle ratios from a tangent.
  function trigFromTan() {
    const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]])
    const sin = pick([true, false])
    return ask(`In a right triangle, one angle measures x°. If tan x° = ${a}/${b}, what is the value of ${sin ? 'sin' : 'cos'} x°?`,
      sin ? `${a}/${c}` : `${b}/${c}`, sin ? [`${b}/${c}`, `${b}/${a}`, `${c}/${b}`] : [`${a}/${c}`, `${b}/${a}`, `${c}/${a}`],
      `tan = opposite/adjacent = ${a}/${b}. The longest side is √(${a}² + ${b}²) = ${c}. So sin = ${a}/${c} and cos = ${b}/${c}.`)
  },
  // 17. An identity in x: match the x terms and the numbers.
  function identityConstants() {
    let m, n
    do { m = r(1, 4); n = r(1, 4) } while (gcd(m, n) !== 1)
    const t = r(1, 3), a = n * t, b = m * t, N = a + b
    const askA = pick([true, false])
    const mt = (s, v) => (v === 1 ? `(x ${s} 1)` : `(x ${s} ${v})`)
    return ask(`If a${mt('+', m)} + b${mt(M, n)} = ${N}x for all real numbers x, where a and b are constants, what is the value of ${askA ? 'a' : 'b'}?`,
      askA ? a : b, [askA ? b : a, N, N * 2].filter((x) => x !== (askA ? a : b)),
      `Match x terms: a + b = ${N}. The numbers must cancel: ${m}a ${M} ${n}b = 0. So a = ${a} and b = ${b}.`, [N + 1, (askA ? a : b) + 1])
  },
  // 18. How a change in one variable moves the other in a linear formula.
  function linearFormulaChange() {
    const u = r(2, 5); let v; do { v = r(2, 7) } while (gcd(u, v) !== 1)
    const t = r(2, 6), D = u * t, c = r(10, 90)
    return ask(`According to the formula p = (${u}/${v})k + ${c}, if p goes up by ${D}, by how much does k go up?`,
      v * t, [D, (D * u) % v === 0 ? (D * u) / v : u * u * t, u * t + v],
      `p changes by ${u}/${v} times the change in k. So ${D} = (${u}/${v}) × change, and the change = ${D} × ${v}/${u} = ${v * t}.`, [v * t + u])
  },
  // 19. Similar triangles (line of sight over a shorter object).
  function similarTriangles() {
    const h = r(3, 6), d1 = pick([5, 8, 10, 12, 15]), mult = r(3, 10), d2 = d1 * mult
    const k = (h * (d1 + d2)) / d1, name = pick(NAMES)
    const object = pick(['parked car', 'wall', 'signpost'])
    return ask(`${name} wants to find the height of a tree. Standing at point P on flat ground, ${name} lines up the top of a ${object} with the top of the tree. The ${object} is ${h} feet tall and stands at point Q, ${d1} feet from P. The tree stands at point R, ${d2} feet beyond Q, on the same straight line. How tall is the tree, in feet?`,
      k, [h * mult, h * (mult + 2), d2 / h].filter((x) => Number.isInteger(x) && x !== k),
      `The two triangles share the angle at P, so they are similar. The tree is ${d1} + ${d2} = ${d1 + d2} feet from P. Height/${d1 + d2} = ${h}/${d1}, so the height is ${h} × ${d1 + d2}/${d1} = ${k}.`, [k + h, k - h])
  },
  // 20. A system with a square root: substitute and keep the allowed root.
  function rootSystem() {
    const x = r(2, 9), N = x * (x + 1)
    return ask(`x² + y² = ${N} and y = √x. According to the system above, what is the value of x?`,
      x, [num(-(x + 1)), x + 1, x - 1],
      `y = √x means y² = x, so x² + x = ${N}, which is x² + x ${M} ${N} = 0 = (x ${M} ${x})(x + ${x + 1}). So x = ${x} or x = ${M}${x + 1}. A square root needs x ≥ 0, so x = ${x}.`, [x + 2])
  },
]

// A decimal without trailing zeros: 181.250 -> "181.25", 2.0 -> "2"
const dec = (x, d = 2) => num(Number(x.toFixed(d)))
const pt = (x, y) => `(${num(x)}, ${num(y)})`

// Section 4 of the owner's practice test 1 (calculator), questions 1 to 38. Questions with a graph give the graph's numbers in words.
const CALC = [
  // 1. Linear function from a table.
  function linearTable() {
    const s = r(2, 7), b = r(-5, 9), N = r(8, 15)
    const ys = [1, 2, 3, 4, 5].map((x) => s * x + b), ans = s * N + b
    return ask(`A linear function f has f(1) = ${num(ys[0])}, f(2) = ${num(ys[1])}, f(3) = ${num(ys[2])}, f(4) = ${num(ys[3])} and f(5) = ${num(ys[4])}. What is f(${N})?`,
      num(ans), [num(s * N), num(ans - s), num(ans + s)], `f goes up by ${s} each step, so f(x) = ${s}x${tail(b)}. Then f(${N}) = ${s}(${N})${tail(b)} = ${num(ans)}.`)
  },
  // 2. Rearrange in terms of another letter.
  function rearrangeTerms() {
    const k = r(2, 6), m = r(2, 9)
    return ask(`If ${k}(a + 2b ${M} c) = ${k * m}, what is the value of a + 2b in terms of c?`, `c + ${m}`, [`c ${M} ${m}`, `${k}c ${M} ${m}`, `c ${M} ${k * m}`],
      `Divide both sides by ${k}: a + 2b ${M} c = ${m}. Add c: a + 2b = c + ${m}.`)
  },
  // 3. Parallel lines: an obtuse and an acute angle add to 180.
  function parallelAngles() {
    const t = pick([2, 3, 4, 5, 8]), small = 180 / (t + 1), big = 180 - small
    return ask(`Two parallel lines are crossed by a third line. Angle 1 is one of the obtuse angles formed and angle 2 is one of the acute angles. If angle 1 is ${t} times angle 2, what is the measure of angle 1?`,
      `${big}°`, [`${small}°`, `${big - 15}°`, `${Math.min(big + 10, 175)}°`],
      `With parallel lines, every obtuse angle and every acute angle add to 180°. So ${t}x + x = 180, x = ${small}, and angle 1 = ${big}°.`)
  },
  // 4. Powers of 2.
  function powersOfTwo() {
    const [b1, e1] = pick([[4, 2], [8, 3], [16, 4]])
    let b2, e2; do { [b2, e2] = pick([[2, 1], [4, 2], [8, 3]]) } while (b2 === b1)
    const n = r(2, 5), k = r(1, 4), E = e1 * n + e2 * k
    return ask(`If ${b1}ⁿ × ${b2}^${k} = 2^${E}, what is the value of n?`, n, [n + 1, n - 1, n + 2].filter((x) => x > 0),
      `${b1}ⁿ = 2^(${e1}n) and ${b2}^${k} = 2^${e2 * k}. So ${e1}n + ${e2 * k} = ${E}, which gives n = ${n}.`, [n + 3])
  },
  // 5. Absolute value: sometimes no answer is possible.
  function absoluteValue() {
    const a = r(1, 9), b = r(1, 9), none = 'There is no such value of n.'
    if (pick([true, false])) {
      return ask(`For what value of n is |n + ${a}| + ${b} less than 0?`, none, [num(-a - 1), num(-a), num(b)],
        `|n + ${a}| is never negative, so |n + ${a}| + ${b} is always at least ${b}. It can never be less than 0.`)
    }
    return ask(`For what value of n is |n + ${a}| ${M} ${b} equal to 0?`, num(b - a), [num(-a - b - 1), num(a + b), none].filter((x) => x !== num(-a - b)),
      `|n + ${a}| = ${b}, so n + ${a} = ${b} or n + ${a} = ${M}${b}. That gives n = ${num(b - a)} or n = ${num(-a - b)}. Only ${num(b - a)} is offered.`)
  },
  // 6. Slope from the intercept and one point.
  function slopeFromPoint() {
    const c = r(3, 9), p = r(2, 6), q = r(0, c - 1)
    return ask(`Line ℓ has the equation y = mx + ${c}, where m is a constant. If the line passes through the point ${pt(p, q)}, what is the value of m?`,
      frac(q - c, p), [frac(c - q, p), frac(p, q - c), frac(q, p)].filter((x) => x !== frac(q - c, p)),
      `Put x = ${p} and y = ${q}: ${q} = ${p}m + ${c}, so ${p}m = ${num(q - c)} and m = ${frac(q - c, p)}.`, [frac(q - c - 1, p), frac(q - c + 1, p)])
  },
  // 7. Inequalities that leave only one possibility.
  function boysGirls() {
    const t = pick([2, 3]), G = r(4, 9), B = t * G + 1, word = t === 2 ? 'twice' : 'three times'
    return ask(`In a class, the number of boys is more than ${word} the number of girls. There are at least ${G} girls and no more than ${B} boys. How many students are in the class?`,
      G + B, [G + B - 1, G + B + 1, G + t * G], `Girls ≥ ${G}, so boys > ${t} × ${G} = ${t * G}, which means boys ≥ ${B}. Boys ≤ ${B}, so there are ${B} boys and ${G} girls (more girls would need more than ${B} boys): ${G + B} students.`)
  },
  // 8. Mean from a frequency chart.
  function frequencyMean() {
    let scores, counts, N, mean
    do {
      scores = [...new Set([...Array(5)].map(() => 10 * r(3, 10)))]
      counts = scores.map(() => r(1, 6)); N = counts.reduce((x, y) => x + y, 0)
      mean = scores.reduce((t, s, i) => t + s * counts[i], 0) / N
    } while (scores.length < 4 || !Number.isInteger(mean))
    const plain = scores.reduce((x, y) => x + y, 0) / scores.length
    return ask(`A chart shows the test scores of ${N} students: ${scores.map((s, i) => `${counts[i]} scored ${s}`).join(', ')}. What is the mean (average) score?`,
      mean, [dec(plain, 1), mean + 3, mean - 5], `Total = ${scores.map((s, i) => `${counts[i]} × ${s}`).join(' + ')} = ${mean * N}. Mean = ${mean * N}/${N} = ${mean}.`, [mean + 5])
  },
  // 9 and 10. A ball's height: time to the top and time to the ground.
  function ballPeak() {
    let r1, r2; do { r1 = r(6, 12); r2 = r(1, 4) } while ((r1 - r2) % 2)
    const B = 16 * (r1 - r2), C = 16 * r1 * r2, top = (r1 - r2) / 2
    return ask(`A ball is launched from the top of a building. Its height in feet after t seconds is h(t) = ${M}16t² + ${B}t + ${C}. How many seconds does it take the ball to reach its highest point?`,
      top, [r1 - r2, r1, top + 2].filter((x) => x !== top), `The highest point is at t = ${M}b/(2a) = ${B}/32 = ${top}.`, [top + 1])
  },
  function ballGround() {
    let r1, r2; do { r1 = r(6, 12); r2 = r(1, 4) } while ((r1 - r2) % 2)
    const B = 16 * (r1 - r2), C = 16 * r1 * r2
    return ask(`A ball is launched from the top of a building. Its height in feet after t seconds is h(t) = ${M}16t² + ${B}t + ${C}. After how many seconds does the ball hit the ground?`,
      r1, [(r1 - r2) / 2, r1 - r2, r1 + r2], `Set h(t) = 0 and divide by ${M}16: t² ${M} ${r1 - r2}t ${M} ${r1 * r2} = 0, so (t ${M} ${r1})(t + ${r2}) = 0. Time is positive, so t = ${r1}.`, [r1 + 1, r1 - 1])
  },
  // 11. Rectangle from its perimeter.
  function rectangleArea() {
    const W = r(5, 20) + pick([0, 0.5]), d = r(1, 6), L = W + d, P = 2 * (W + L)
    return ask(`The perimeter of a rectangle is ${dec(P)} cm. The length is ${d} cm more than the width. What is the area of the rectangle, in square centimetres?`,
      dec(W * L), [dec((P / 4) ** 2), dec(L * L), dec(W * (W + 2 * d))], `Width w and length w + ${d}: 2(w + w + ${d}) = ${dec(P)}, so w = ${dec(W)} and the length is ${dec(L)}. Area = ${dec(W)} × ${dec(L)} = ${dec(W * L)}.`, [dec(W * L + 10)])
  },
  // 12. Which point does NOT satisfy a system of inequalities.
  function notASolution() {
    const a1 = r(1, 4), c1 = r(-2, 2), a2 = r(1, 4), c2 = r(-2, 3)
    const ok = (x, y) => a1 * x - y > c1 && a2 * x + y > c2
    let yes, no
    do {
      const pts = [...Array(30)].map(() => [r(-6, 8), r(-9, 9)])
      yes = pts.filter(([x, y]) => ok(x, y)); no = pts.filter(([x, y]) => !ok(x, y))
    } while (new Set(yes.map(String)).size < 3 || !no.length)
    const good = [...new Map(yes.map((p) => [String(p), p])).values()].slice(0, 3)
    const [bx, by] = no[0]
    const lhs = (a, s) => `${coef(a)}x ${s} y`
    return ask(`${lhs(a1, M)} > ${num(c1)} and ${lhs(a2, '+')} > ${num(c2)}. Which of the following is NOT a solution of this system of inequalities?`,
      pt(bx, by), good.map(([x, y]) => pt(x, y)),
      `Test ${pt(bx, by)}: ${a1}(${num(bx)}) ${M} (${num(by)}) = ${num(a1 * bx - by)} and ${a2}(${num(bx)}) + (${num(by)}) = ${num(a2 * bx + by)}. At least one of these is not greater than the number it must beat, so this point fails. The other points pass both.`)
  },
  // 13. A point on a line given by a table with an unknown.
  function lineTableUnknown() {
    let s, k, y0, X
    do { s = pick([1, 1.5, 2, 2.5, 3]); k = r(2, 8); y0 = r(0, 6); X = r(10, 20) } while (!Number.isInteger(s * k) || !Number.isInteger(s * X))
    const y1 = y0 + s * k, y2 = y1 + 2 * s, m = y0 + s * X
    return ask(`A straight line passes through the points (0, ${y0}), (k, ${y1}) and (k + 2, ${y2}). If the point (${X}, m) is on the same line, what is m?`,
      m, [s * X, m - 2 * s, m + 4], `From (k, ${y1}) to (k + 2, ${y2}) the line rises ${2 * s} over 2, so the slope is ${s}. Then y = ${s}x + ${y0}, and m = ${s}(${X}) + ${y0} = ${m}.`, [m + 2])
  },
  // 14. Fractions spent one after another.
  function fractionsSpent() {
    const opts = [[3, 4, 2, 3], [1, 2, 2, 3], [2, 3, 1, 2], [3, 4, 1, 2], [1, 2, 3, 4], [4, 5, 1, 2], [2, 3, 3, 4], [1, 3, 1, 2], [3, 5, 1, 2]]
    const [n1, d1, n2, d2] = pick(opts), f = (d1 * d2) / ((d1 - n1) * (d2 - n2)), name = pick(NAMES)
    return ask(`${name} spent ${n1}/${d1} of an allowance on a book, then spent ${n2}/${d2} of what was left on lunch. This left P dollars. What was the allowance, in dollars?`,
      `${f}P`, [`${f + 2}P`, `${f - 2 > 1 ? f - 2 : f + 4}P`, `${f + 6}P`],
      `After the book, ${d1 - n1}/${d1} is left. After lunch, ${d2 - n2}/${d2} of that is left: ${frac((d1 - n1) * (d2 - n2), d1 * d2)} of the allowance = P. So the allowance is ${f}P.`)
  },
  // 15 and 16. Half-life.
  function halfLifeModel() {
    const A = pick([400, 600, 800, 1000, 1200]), H = pick([5, 10, 20, 25, 50])
    return ask(`A radioactive material loses half of its amount every ${H} years. There are ${A} grams now. Which equation gives the amount y, in grams, after t years?`,
      `y = ${A}(1/2)^(t/${H})`, [`y = ${A} ${M} ${A / 2}t`, `y = ${A}(1/2)^t`, `y = ${A}(1 ${M} 0.5t)`],
      `The amount halves once every ${H} years, so after t years it has halved t/${H} times: y = ${A}(1/2)^(t/${H}).`)
  },
  function halfLifeAmount() {
    const k = r(2, 5), H = pick([5, 10, 20, 25, 50]), A = pick([800, 1600, 640, 960, 3200])
    return ask(`A radioactive material loses half of its amount every ${H} years. If there are ${A} grams now, how many grams will be left after ${k * H} years?`,
      A / 2 ** k, [A / 2 ** (k - 1), A / 2 ** (k + 1), A / (2 * k)], `${k * H} years is ${k} half-lives. ${A} ÷ 2^${k} = ${A / 2 ** k}.`, [A / 2 ** k + 10])
  },
  // 17. Area of a triangle with a corner on each axis.
  function triangleArea() {
    let k, b; do { k = r(2, 6); b = r(1, 4) } while ((k * (k + b)) % 2)
    const A = (k * (k + b)) / 2, a = r(1, 5)
    return ask(`In the xy-plane, triangle OPQ has corners O(0, 0), P(${M}${a}, k) and Q(k + ${b}, 0), where k > 0. The area of the triangle is ${A}. What is the value of k?`,
      k, [k + 2, 2 * k, k + b].filter((x) => x !== k), `The base OQ lies on the x-axis and is k + ${b} long. The height is the y-value of P, which is k. So (1/2)k(k + ${b}) = ${A}, k² + ${b}k ${M} ${2 * A} = 0, and k = ${k}.`, [k + 1, k - 1])
  },
  // 18. Equation of a circle from its centre and one point.
  function circleEquation() {
    const [a, b] = pick([[3, 4], [4, 3], [5, 12], [6, 8], [1, 1], [2, 1]]), h = r(-6, 6) || 4, k = pick([0, 0, r(-5, 5)])
    const R = a * a + b * b
    const xs = (v) => (v === 0 ? 'x²' : `(x ${v > 0 ? M : '+'} ${Math.abs(v)})²`)
    const ys = (v) => (v === 0 ? 'y²' : `(y ${v > 0 ? M : '+'} ${Math.abs(v)})²`)
    const eq = (hh, kk, rr) => `${xs(hh)} + ${ys(kk)} = ${rr}`
    return ask(`A circle in the xy-plane has its centre at ${pt(h, k)} and passes through the point ${pt(h + a, k + b)}. Which is the equation of the circle?`,
      eq(h, k, R), [eq(h, k, a * a), eq(h, k, a + b), eq(-h, -k, R)],
      `The radius squared is (${a})² + (${b})² = ${R}, the squared distance from the centre to the point. So the equation is ${eq(h, k, R)}.`, [eq(h, k, R + 1)])
  },
  // 19. Average rate of change from points on a graph.
  function averageRate() {
    const xs = [-3, 0, 1, 3, 6].map((x) => x + r(-1, 0)), ys = xs.map(() => r(-2, 6))
    const dy = ys[4] - ys[0], dx = xs[4] - xs[0]
    if (dy === 0) ys[4] += 2
    const ans = frac(ys[4] - ys[0], dx)
    return ask(`The graph of f is made of straight pieces joining the points ${xs.map((x, i) => pt(x, ys[i])).join(', ')}. What is the average rate of change of f from x = ${num(xs[0])} to x = ${num(xs[4])}?`,
      ans, [frac(dx, ys[4] - ys[0]), frac(ys[4] - ys[3], xs[4] - xs[3]), 'It cannot be determined from the given information.'].filter((x) => x !== ans),
      `Average rate of change = (f(${num(xs[4])}) ${M} f(${num(xs[0])}))/(${num(xs[4])} ${M} (${num(xs[0])})) = (${num(ys[4])} ${M} ${num(ys[0])})/${dx} = ${ans}. Only the end points matter.`, [frac(ys[4] - ys[0] + 1, dx)])
  },
  // 20. Average speed over two parts of a trip.
  function averageSpeed() {
    let vl, d, t1, t2, avg
    do { vl = 5 * r(3, 8); d = 5 * r(2, 8); t1 = pick([0.5, 1, 1.5, 2]); t2 = pick([0.5, 0.8, 1, 1.5]); avg = ((vl + d) * t1 + vl * t2) / (t1 + t2) } while (!Number.isInteger(avg) || !Number.isInteger((vl + d) * t1) || !Number.isInteger(vl * t2))
    const vh = vl + d, d1 = vh * t1, d2 = vl * t2, name = pick(NAMES)
    return ask(`${name} drove ${d1} miles on the highway and ${d2} miles on local roads. On the highway ${name} drove ${d} miles per hour faster than on local roads. If the speed on local roads was ${vl} miles per hour, what was the average speed, in miles per hour, for the whole trip?`,
      avg, [(vh + vl) / 2, vl + d / 2, avg + 6].filter((x) => Number.isInteger(x) && x !== avg), `Highway: ${d1} ÷ ${vh} = ${t1} h. Local: ${d2} ÷ ${vl} = ${t2} h. Average = ${d1 + d2} miles ÷ ${t1 + t2} h = ${avg}.`, [avg + 3, avg - 3])
  },
  // 21. Two prices with a known difference.
  function ticketPrices() {
    const x = r(3, 12), d = r(2, 8), a = r(2, 8), c = r(2, 12), T = a * (x + d) + c * x
    return ask(`At a theatre, an adult ticket costs ${d} dollars more than a child ticket. A group of ${a} adults and ${c} children pays ${T} dollars in total. What is the cost, in dollars, of one adult ticket and one child ticket together?`,
      2 * x + d, [x, x + d, 2 * x + d + 2], `Child ticket = c dollars: ${a}(c + ${d}) + ${c}c = ${T}, so ${a + c}c = ${T - a * d} and c = ${x}. Adult = ${x + d}. Together: ${2 * x + d}.`, [2 * x + d - 1])
  },
  // 22. Slope of a line of best fit read from two points.
  function bestFitSpeed() {
    const H = pick([5, 6, 8, 10]), v = 5 * r(8, 15), D = v * H
    const near = v - 1, opts = [near, v - 6, v + 5, v + 8]
    return ask(`A scatterplot shows distance travelled (miles) against hours for 10 drivers. Its line of best fit goes from (0, 0) to (${H}, ${D}). Which of the following is closest to the drivers' average speed, in miles per hour?`,
      near, opts.slice(1), `The slope of the line is ${D} ÷ ${H} = ${v} miles per hour. Of the choices, ${near} is closest.`)
  },
  // 23. Factor theorem.
  function factorTheorem() {
    const c = pick([1, 2, 3, 4, 5, 6, 7].flatMap((x) => [x, -x]))
    const f = (v) => `(x ${v > 0 ? M : '+'} ${Math.abs(v)})`
    return ask(`For a polynomial p(x), p(${num(c)}) = 0. Which of the following must be true about p(x)?`,
      `${f(c)} is a factor of p(x).`, [`${f(-c)} is a factor of p(x).`, 'x is a factor of p(x).', `When p(x) is divided by ${f(c)}, the remainder is ${num(c)}.`],
      `If p(${num(c)}) = 0, then x = ${num(c)} is a root, so ${f(c)} is a factor. The remainder on dividing by ${f(c)} is p(${num(c)}) = 0.`)
  },
  // 24. Which quadrant holds solutions of a system of inequalities.
  function quadrantOfSystem() {
    let m1, b1, m2, b2, quads
    do {
      m1 = pick([1, 2, 3, 0.5]); b1 = pick([0.5, 1, 2, -1, -2]); m2 = pick([0.5, 1, 2, -1]); b2 = pick([2, 3, 4, -3])
      quads = new Set()
      for (let x = -40; x <= 40; x += 0.5) for (let y = -40; y <= 40; y += 0.5) {
        if (x === 0 || y === 0 || y > m1 * x + b1 || y < m2 * x + b2) continue
        quads.add(x > 0 ? (y > 0 ? 'I' : 'IV') : (y > 0 ? 'II' : 'III'))
      }
    } while (quads.size !== 1)
    const q = [...quads][0], line = (m, b) => `${m === 0.5 ? '(1/2)' : coef(m)}x${tail(b).replace('0.5', '1/2')}`
    return ask(`y ≤ ${line(m1, b1)} and y ≥ ${line(m2, b2)}. If this system of inequalities is graphed in the xy-plane, which quadrant contains solutions?`,
      `Quadrant ${q}`, ['I', 'II', 'III', 'IV'].filter((x) => x !== q).map((x) => `Quadrant ${x}`),
      `The solutions lie on or below y = ${line(m1, b1)} and on or above y = ${line(m2, b2)}. That region falls only in Quadrant ${q}.`)
  },
  // 25. Where a graph is below the x-axis: f(x) < |f(x)|.
  function belowAxis() {
    let xs, ys, f, cands, neg
    do {
      xs = [-4, -2, 0, 3, 5]; ys = [r(-1, 2), r(-2, 2), r(-3, -1), r(2, 5), r(-1, 1)]
      f = (x) => { for (let i = 0; i < 4; i++) if (x >= xs[i] && x <= xs[i + 1]) return ys[i] + ((ys[i + 1] - ys[i]) * (x - xs[i])) / (xs[i + 1] - xs[i]) }
      cands = [...new Set([...Array(12)].map(() => Math.round((r(-39, 49) / 10) * 10) / 10))]
      neg = cands.filter((x) => f(x) < -0.2); cands = cands.filter((x) => f(x) > 0.2)
    } while (!neg.length || cands.length < 3)
    return ask(`The graph of f, for ${M}4 ≤ x ≤ 5, is made of straight pieces joining ${xs.map((x, i) => pt(x, ys[i])).join(', ')}. For which of these values of x is f(x) < |f(x)|?`,
      num(neg[0]), cands.slice(0, 3).map(num), `f(x) < |f(x)| only when f(x) is negative, that is, where the graph is below the x-axis. f(${num(neg[0])}) ≈ ${dec(f(neg[0]), 1)}, which is negative. The other values give positive f(x).`)
  },
  // 26. Difference of squares with whole numbers.
  function squaresDiffSmallest() {
    let N, as
    do {
      N = r(15, 96); as = []
      for (let d = 1; d * d < N; d++) if (N % d === 0 && (d + N / d) % 2 === 0) as.push((d + N / d) / 2)
    } while (as.length < 2)
    const small = Math.min(...as), others = as.filter((x) => x !== small)
    return ask(`If a and b are positive integers and a² ${M} b² = ${N}, what is the smallest possible value of a?`,
      small, [...others, Math.ceil(Math.sqrt(N))].filter((x) => x !== small),
      `a² ${M} b² = (a ${M} b)(a + b) = ${N}. Both factors must be even or both odd. Possible values of a are ${as.sort((x, y) => x - y).join(', ')}, and the smallest is ${small}.`, [small - 1, small + 1])
  },
  // 27. Vertex of a parabola given in factored form.
  function parabolaVertex() {
    let k, h; do { k = pick([2, 3, 4]); h = r(1, 6) } while (!Number.isInteger((2 * h * h) / k))
    const yv = -(h * h) / k
    return ask(`The graph of y = (1/${k})x(x ${M} ${2 * h}) crosses the x-axis at x = 0 and x = ${2 * h}. What are the coordinates of its vertex?`,
      pt(h, yv).replace(/\.5/, '.5'), [pt(h, -h), pt(h, (2 * yv)), pt(h - 1, yv)].filter((x) => x !== pt(h, yv)),
      `The vertex is halfway between the x-intercepts: x = ${h}. Then y = (1/${k})(${h})(${h} ${M} ${2 * h}) = ${num(yv)}.`, [pt(h, yv - 1), pt(h, yv + 1), pt(h + 1, yv), pt(2 * h, yv)])
  },
  // 28. Perimeter of a 30-60-90 triangle.
  function triangle306090() {
    const H = 2 * r(2, 10), s = H / 2, l = (H * Math.sqrt(3)) / 2
    return ask(`In right triangle ABC, the right angle is at A, the hypotenuse BC is ${H}, and angle C is 30°. What is the approximate perimeter of the triangle?`,
      dec(H + s + l, 1), [dec(2 * H, 1), dec(H + 2 * s, 1), dec(H + s + (H * Math.SQRT2) / 2, 1)],
      `Opposite 30° is half the hypotenuse: AB = ${s}. The other leg is ${s}√3 ≈ ${dec(l, 2)}. Perimeter ≈ ${H} + ${s} + ${dec(l, 2)} ≈ ${dec(H + s + l, 1)}.`)
  },
  // 29. Volume from the areas of three faces.
  function boxVolume() {
    const x = r(2, 9), y = r(2, 9), z = r(1, 9), V = x * y * z
    return ask(`A box has width x, length y and height z. If xy = ${x * y}, yz = ${y * z} and xz = ${x * z}, what is the volume of the box?`,
      V, [x * y + y * z + x * z, 2 * V, V + 10].filter((p) => p !== V),
      `(xy)(yz)(xz) = (xyz)² = ${x * y} × ${y * z} × ${x * z} = ${V * V}. The volume is √${V * V} = ${V}.`, [V - 10])
  },
  // 30. Perimeter of a sector from its area.
  function sectorPerimeter() {
    const [deg, words] = pick([[270, 'a circle with a quarter (90°) slice cut out'], [180, 'a half circle'], [90, 'a quarter circle']]), rad = r(2, 6)
    const areaK = (deg * rad * rad) / 360, arc = (deg / 360) * 2 * Math.PI * rad
    const areaText = Number.isInteger(areaK) ? `${areaK}π` : `${frac(deg * rad * rad, 360)}π`
    return ask(`A sector with centre O and radius r is ${words} (${deg}°). If its area is ${areaText}, what is the approximate perimeter of the sector, including the two radii?`,
      dec(2 * rad + arc, 1), [dec(arc, 1), dec(rad + arc, 1), dec(2 * rad + 2 * Math.PI * rad, 1)],
      `Area = (${deg}/360)πr² = ${areaText}, so r = ${rad}. Arc = (${deg}/360) × 2π(${rad}) ≈ ${dec(arc, 2)}. Perimeter = 2(${rad}) + ${dec(arc, 2)} ≈ ${dec(2 * rad + arc, 1)}.`)
  },
  // 31. Two people working together.
  function workTogether() {
    let A, T, P; do { A = r(2, 8); T = r(1, A - 1); P = (A * T) / (A - T) } while (!Number.isInteger(P * 2))
    const n1 = pick(NAMES); let n2; do { n2 = pick(NAMES) } while (n2 === n1)
    return ask(`${n1} needs ${A} hours to paint a fence alone. With ${n2} helping, the job takes ${T} hour${T === 1 ? '' : 's'}. How many hours would ${n2} take to do the job alone?`,
      dec(P, 1), [A - T, A + T, dec(A / T, 1)].map(String).filter((x) => x !== dec(P, 1)),
      `Per hour: 1/${A} + 1/p = 1/${T}. So 1/p = 1/${T} ${M} 1/${A} = ${frac(A - T, A * T)}, and p = ${dec(P, 1)} hours.`, [dec(P + 1, 1)])
  },
  // 32. Sharing costs.
  function shareCosts() {
    let M2, S, B, k, each; do { M2 = pick([10, 12, 15, 20, 25]); S = pick([5, 8, 10, 12, 15]); k = r(1, 3); B = 50 * r(4, 12); each = S + (B + k * S) / M2 } while (!Number.isInteger(each))
    return ask(`${M2} club members are going on a trip to a park where entry costs $${S} per person. The members share the $${B} cost of a bus and the entry for ${k} adult supervisor${k > 1 ? 's' : ''} who go with them, and each pays their own entry. What is the cost, in dollars, for each member?`,
      each, [S + B / M2, (B + k * S) / M2, each + S].filter((x) => Number.isInteger(x) && x !== each),
      `Shared cost: $${B} + ${k} × $${S} = $${B + k * S}, which is $${(B + k * S) / M2} each. Add each member's own entry of $${S}: $${each}.`, [each + 2, each - 2])
  },
  // 33. Use a linear function twice.
  function linearTwice() {
    const s = pick([-3, -2, 2, 3, -1]), b = r(-4, 5), k = pick([1, 2, -1, 3]), v = s * k + b, m = pick([-2, 2, 3])
    const ans = s * m * k + b
    return ask(`The graph of a linear function f passes through (0, ${num(b)}) and (3, ${num(3 * s + b)}). If f(k) = ${num(v)}, what is the value of f(${m === -2 ? `${M}2k` : `${m}k`})?`,
      num(ans), [num(v), num(m * v), num(ans + s)], `Slope = (${num(3 * s + b)} ${M} ${num(b)})/3 = ${num(s)}, so f(x) = ${coef(s)}x${tail(b)}. f(k) = ${num(v)} gives k = ${num(k)}. Then f(${num(m * k)}) = ${num(ans)}.`, [num(ans - 1)])
  },
  // 34. Average equals a percent: find a ratio.
  function averagePercent() {
    let m, P, n, top, bot
    do { m = pick([2, 3, 4]); P = pick([25, 50, 75, 100]); n = pick([2, 4, 6, 8]); top = (2 * P * n) / 100 - 1; bot = m } while (top <= 0 || !Number.isInteger(top * 2))
    const ans = frac(Math.round(top * 2), bot * 2)
    return ask(`If the average of ${m}a and b is equal to ${P}% of ${n}b, what is the value of a/b?`, ans,
      [frac(Math.round(top * 2) + 2, bot * 2), frac(bot * 2, Math.round(top * 2)), frac((2 * P * n) / 100, m)].filter((x) => x !== ans),
      `(${m}a + b)/2 = ${P / 100} × ${n}b = ${(P * n) / 100}b. So ${m}a + b = ${(2 * P * n) / 100}b, ${m}a = ${dec(top, 2)}b, and a/b = ${ans}.`, [frac(Math.round(top * 2) + 4, bot * 2)])
  },
  // 35. Two cylinders with the same volume.
  function cylinderHeight() {
    const k = pick([2, 3]), H = pick([9, 10, 12, 16, 18, 20, 36]), h = H / (k * k)
    return ask(`Two cylinders have the same volume. Cylinder II has ${k === 2 ? 'twice' : 'three times'} the radius of cylinder I. Cylinder I is ${H} tall. How tall is cylinder II?`,
      dec(h, 2), [dec(H / k, 2), dec(H * k, 2), dec(H * k * k, 2)], `πr²(${H}) = π(${k}r)²h = ${k * k}πr²h, so h = ${H}/${k * k} = ${dec(h, 2)}.`)
  },
  // 36. A rational function is undefined where its denominator is 0.
  function undefinedPoint() {
    const a = r(1, 6) * pick([1, -1])
    let p, q; do { p = r(-5, 5); q = r(-5, 5) } while (p === a || q === a || p === -a || q === -a)
    const B = -(p + q), C = p * q, A = Math.abs(a)
    const num2 = `x²${B === 0 ? '' : `${B < 0 ? ` ${M} ` : ' + '}${Math.abs(B) === 1 ? '' : Math.abs(B)}x`}${C === 0 ? '' : tail(C)}`
    const den2 = a > 0 ? `(x + ${A})² ${M} ${4 * A}x` : `(x ${M} ${A})² + ${4 * A}x`
    return ask(`g(x) = (${num2})/(${den2}). For what value of x is g undefined?`, num(a), [num(-a), num(p), '0'].filter((x) => x !== num(a)),
      `The denominator is ${den2} = x² ${a > 0 ? M : '+'} ${2 * A}x + ${A * A} = (x ${a > 0 ? M : '+'} ${A})². It is 0 only at x = ${num(a)}, so g is undefined there.`, [num(q)])
  },
  // 37 and 38. Compound interest.
  function interestAnnual() {
    const P = pick([1000, 2000, 2500, 4000, 5000]), rate = r(2, 8), I = (P * rate) / 100
    return ask(`Money in a bank account grows by R(t) = P(1 + r/n)^(nt). If $${P.toLocaleString('en-US')} is deposited at ${rate}% annual interest compounded once a year, how many dollars of interest are earned after one year?`,
      dec(I), [dec(P + I), dec(P * rate), dec(I / 2)], `Interest = P × r = ${P} × ${rate / 100} = ${dec(I)}.`)
  },
  function interestQuarterly() {
    const P = pick([1000, 2000, 2500, 4000, 5000]), rate = r(2, 8), t = pick([1, 2])
    const q = Math.round(P * (1 + rate / 400) ** (4 * t)), yr = Math.round(P * (1 + rate / 100) ** t), simple = Math.round(P * (1 + (rate * t) / 100))
    return ask(`Money in a bank account grows by R(t) = P(1 + r/n)^(nt). If $${P.toLocaleString('en-US')} is deposited at ${rate}% annual interest compounded quarterly (4 times a year), what is the balance after ${t} year${t > 1 ? 's' : ''}, to the nearest dollar?`,
      q, [yr, simple, Math.round(P * (1 + rate / 400) ** t)].filter((x) => x !== q),
      `n = 4, r = ${rate / 100}: R = ${P}(1 + ${rate / 100}/4)^(4 × ${t}) = ${P}(${1 + rate / 400})^${4 * t} ≈ ${q}.`, [q + 1, q - 1])
  },
]

// Practice test 5, section 3 (no calculator), questions 1 to 20.
const T5_NOCALC = [
  // 1. Two letters on both sides: find their difference.
  function differenceOfLetters() {
    const k = r(2, 9), D = r(2, 15), c2 = r(1, 20), c1 = k * D - c2
    if (c1 <= 0) return differenceOfLetters()
    return ask(`If ${k}r ${M} ${c1} = ${k}s + ${c2}, what is the value of r ${M} s?`, D, [c1 + c2, D + 2, D - 3].filter((x) => x > 0 && x !== D),
      `Move the s term and the numbers: ${k}r ${M} ${k}s = ${c1} + ${c2} = ${k * D}. Divide by ${k}: r ${M} s = ${D}.`, [D + 1, D - 1])
  },
  // 2. Difference of squares in a system.
  function squaresSystem() {
    let x, y; do { x = r(3, 10); y = r(-4, x - 1) } while (x + y <= 0 || y === 0)
    const S = x + y, N = x * x - y * y, askX = pick([true, false])
    return ask(`x² ${M} y² = ${N} and x + y = ${S}. In this system of equations, what is the value of ${askX ? 'x' : 'y'}?`,
      num(askX ? x : y), [num(askX ? y : x), num(N / S), num(S)], `x² ${M} y² = (x + y)(x ${M} y), so ${S}(x ${M} y) = ${N} and x ${M} y = ${N / S}. Adding x + y = ${S} gives x = ${x}, so y = ${num(y)}.`, [num((askX ? x : y) + 1)])
  },
  // 3. Expand a square with 1/x.
  function squareWithReciprocal() {
    const k = r(1, 3), kx = k === 1 ? '1/x' : `${k}/x`, k2 = k === 1 ? '1/x²' : `${k * k}/x²`
    return ask(`Which of the following is equal to (x ${M} ${kx})² + ${4 * k}?`, `(x + ${kx})²`,
      [`x² ${M} ${k2} + ${4 * k}`, `x² + ${k2} + ${4 * k}`, `(x + ${kx})² ${M} ${4 * k}`],
      `(x ${M} ${kx})² = x² ${M} ${2 * k} + ${k2}. Adding ${4 * k} gives x² + ${2 * k} + ${k2}, which is (x + ${kx})².`)
  },
  // 4. cos a = sin b means a + b = 90.
  function complementAngles() {
    let x, m, n, c1, c2, a, b
    do { x = r(5, 25); m = r(1, 4); n = r(1, 3); const rest = 90 - (m + n) * x; c1 = r(-20, 30); c2 = rest - c1; a = m * x + c1; b = n * x + c2 } while (a <= 5 || b <= 5 || a >= 85 || c2 === 0 || c1 === 0)
    return ask(`In a right triangle, the two acute angles measure a° and b°, where a = ${coef(m)}x${tail(c1)} and b = ${coef(n)}x${tail(c2)}. If cos a° = sin b°, what is the value of x?`,
      x, [x + 5, x - 5, dec(90 / (m + n), 1)].filter((v) => String(v) !== String(x)), `cos a° = sin b° when a + b = 90. So ${m + n}x${tail(c1 + c2)} = 90 and x = ${x}.`, [x + 2])
  },
  // 5. Area of a 30-60-90 triangle from its hypotenuse.
  function triangleArea306090() {
    const H = 4 * r(1, 6), k = (H * H) / 8, root = (v) => `${v === 1 ? '' : v}√3`
    return ask(`In triangle ABC, angle A is 30° and angle B is 60°. The length of AB is ${H}. What is the area of triangle ABC?`,
      root(k), [root(2 * k), root(k / 2), String(k)], `Angle C is 90°, so AB = ${H} is the hypotenuse. The legs are ${H / 2} and ${H / 2}√3. Area = (1/2)(${H / 2})(${H / 2}√3) = ${root(k)}.`)
  },
  // 6. Product of square roots of negative numbers.
  function rootsOfNegatives() {
    const [a, b, v] = pick([[6, 24, 12], [2, 8, 4], [3, 12, 6], [2, 18, 6], [5, 20, 10], [3, 27, 9], [8, 18, 12], [4, 9, 6], [2, 32, 8]])
    return ask(`If i = √${M}1, which of the following is equal to √${M}${a} · √${M}${b}?`, num(-v), [String(v), `${v}i`, `${M}${v}i`],
      `√${M}${a} = i√${a} and √${M}${b} = i√${b}. Their product is i²√${a * b} = ${M}1 × ${v} = ${M}${v}. (Multiplying ${M}${a} by ${M}${b} first gives the wrong sign.)`)
  },
  // 7 and 8. Straight-line loss of value.
  function depreciationRate() {
    const Y = pick([5, 8, 10, 12, 15]), a = pick([20, 25, 40, 50, 60, 75]), V = a * Y, name = pick(NAMES)
    return ask(`${name} bought a machine for $${V}. After ${Y} years it will be worth $0. Its value in year t is P(t) = b + at, where a and b are constants. What is the value of a?`,
      num(-a), [String(a), num(-Y), String(V / 2)], `P(0) = ${V} gives b = ${V}. P(${Y}) = 0 gives ${V} + ${Y}a = 0, so a = ${M}${a}.`)
  },
  function depreciationTime() {
    const Y = pick([5, 8, 10, 12, 15]), a = pick([20, 25, 40, 50, 60, 75]), V = a * Y
    let D; do { D = 10 * r(2, Math.floor(V / 10) - 1) } while (!Number.isInteger((D / a) * 10))
    const t = D / a
    return ask(`A machine bought for $${V} loses the same amount of value every year and is worth $0 after ${Y} years. After how many years will its value have gone down by $${D}?`,
      dec(t, 1), [dec(Y - t, 1), dec(D / Y, 1), dec(t + 1, 1)].filter((x) => x !== dec(t, 1)), `It loses ${V}/${Y} = $${a} a year. $${D} ÷ $${a} = ${dec(t, 1)} years.`, [dec(t + 2, 1), dec(t + 0.5, 1)])
  },
  // 9. Solve a formula for one letter.
  function solveFormula() {
    return pick([true, false])
      ? ask('P = (A − d)/(B + d). Which of the following gives d in terms of the other letters?', 'd = (A − PB)/(P + 1)',
        ['d = (P − PB)/(A − 1)', 'd = (A − P)/(B − 1)', 'd = (A − 1)/(P − B)'],
        'Multiply by (B + d): PB + Pd = A − d. Collect d: Pd + d = A − PB, so d(P + 1) = A − PB and d = (A − PB)/(P + 1).')
      : ask('P = (A + d)/(B − d). Which of the following gives d in terms of the other letters?', 'd = (PB − A)/(P + 1)',
        ['d = (A − PB)/(P + 1)', 'd = (PB − A)/(P − 1)', 'd = (A + B)/(P + 1)'],
        'Multiply by (B − d): PB − Pd = A + d. Collect d: PB − A = d + Pd = d(P + 1), so d = (PB − A)/(P + 1).')
  },
  // 10. Cube from its long diagonal.
  function cubeFromDiagonal() {
    const D = r(3, 15)
    return ask(`A long diagonal of a cube (from one corner through the inside to the opposite corner) is ${D} long. What is the surface area of the cube?`,
      2 * D * D, [D * D, 6 * D * D, 3 * D * D], `If the edge is s, the long diagonal is s√3 = ${D}, so s² = ${D * D}/3. Surface area = 6s² = 6 × ${D * D}/3 = ${2 * D * D}.`)
  },
  // 11. "More than half of" with a total.
  function moreThanHalf() {
    const B = 2 * r(30, 200), c = 10 * r(1, 10), A = c + B / 2, T = A + B, n1 = pick(NAMES)
    let n2; do { n2 = pick(NAMES) } while (n2 === n1)
    const askA = pick([true, false])
    return ask(`On a road trip, ${n1} drove ${c} miles more than half the number of miles ${n2} drove. Together they drove ${T} miles. How many miles did ${askA ? n1 : n2} drive?`,
      askA ? A : B, [askA ? B : A, T / 2, (askA ? A : B) + c], `${n1} = ${c} + ${n2}/2. So ${c} + ${n2}/2 + ${n2} = ${T}, (3/2) × ${n2} = ${T - c}, ${n2} = ${B}, and ${n1} = ${A}.`, [(askA ? A : B) + 10])
  },
  // 12. When two phone plans cost the same.
  function plansEqual() {
    let r1, r2, F1, F2, m
    do { r1 = 5 * r(2, 8); r2 = 5 * r(1, 6); F1 = 5 * r(2, 8); m = 5 * r(4, 40); F2 = F1 + ((r1 - r2) * m) / 100 } while (r2 >= r1 || !Number.isInteger(F2 * 100) || F2 === F1)
    const c = (x) => `$${(x / 100).toFixed(2)}`
    return ask(`Plan A costs $${F1} a month plus ${c(r1)} a minute. Plan B costs $${Number.isInteger(F2) ? F2 : F2.toFixed(2)} a month plus ${c(r2)} a minute. For how many minutes in a month do both plans cost the same?`,
      m, [Math.round(F2 - F1), m + 20, m - 15].filter((x) => x > 0 && x !== m), `${F1} + ${r1 / 100}m = ${dec(F2)} + ${r2 / 100}m, so ${(r1 - r2) / 100}m = ${dec(F2 - F1)} and m = ${m}.`, [m + 5, m + 10])
  },
  // 13. Rewrite a fraction by dividing.
  function rewriteFraction() {
    const a = r(2, 10), b = r(1, 9), c = r(1, 4), rest = b + a * c
    return ask(`Which of the following is equal to (${a}x + ${b})/(x ${M} ${c})?`, `${rest}/(x ${M} ${c}) + ${a}`,
      [`${b}/(x ${M} ${c}) + ${a}`, `${b}/(x ${M} ${c}) ${M} ${a}`, num(-rest)],
      `${a}x + ${b} = ${a}(x ${M} ${c}) + ${rest}. Divide by (x ${M} ${c}): ${a} + ${rest}/(x ${M} ${c}).`)
  },
  // 14. A chase: when the faster one catches up.
  function chaseSpeed() {
    const t = pick([10, 20, 25, 40, 50]), p = r(30, 70), T = p + r(10, 30), G = (T - p) * t
    return ask(`A cheetah is ${G} feet behind its prey. It starts running at ${T} feet per second, and at the same moment the prey runs away in the same direction at p feet per second. The cheetah catches the prey after ${t} seconds. What is p?`,
      p, [T - p, G / t + T, Math.round(G / t)].filter((x) => x !== p && x > 0), `The cheetah covers ${T} × ${t} = ${T * t} feet. The prey covers ${G} feet less: ${T * t - G} feet. p = ${T * t - G}/${t} = ${p}.`, [p + 5, p - 7])
  },
  // 15. Remainder theorem.
  function remainderTheorem() {
    const a = r(1, 6), b = r(-6, 6), c = r(-9, 9), k = pick([1, 2, 3, -1, -2]), P = (x) => a * x * x + b * x + c
    const poly = `${coef(a)}x²${b ? `${b < 0 ? ` ${M} ` : ' + '}${Math.abs(b) === 1 ? '' : Math.abs(b)}x` : ''}${c ? tail(c) : ''}`
    const div = `(x ${k > 0 ? M : '+'} ${Math.abs(k)})`
    return ask(`When P(x) is divided by ${div}, P(x) = ${div}Q(x) + R, where Q(x) is the quotient and R is the remainder. If P(x) = ${poly}, what is R?`,
      num(P(k)), [num(P(-k)), num(c), num(a + b + c)], `Put x = ${num(k)}: the first part becomes 0, so R = P(${num(k)}) = ${num(P(k))}.`, [num(P(k) + 2), num(P(k) - 2)])
  },
  // 16. Difference of squares equal to a prime.
  function primeSquares() {
    const p = pick([7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47])
    return ask(`R² ${M} S² = ${p}. If R and S are positive integers, what is the value of R?`, (p + 1) / 2, [(p - 1) / 2, p, (p + 3) / 2],
      `(R ${M} S)(R + S) = ${p}. ${p} is prime, so R ${M} S = 1 and R + S = ${p}. Then R = ${(p + 1) / 2}.`)
  },
  // 17. Combine two groups with different ratios.
  function combinedRatio() {
    let a1, a2, b1, b2, kA, kB, c1, c2
    do {
      a1 = r(1, 5); a2 = r(1, 5); b1 = r(1, 5); b2 = r(1, 5); kA = r(5, 15); kB = r(5, 25)
      const boys = kA * a1 + kB * b1, girls = kA * a2 + kB * b2, g = gcd(boys, girls); c1 = boys / g; c2 = girls / g
    } while (gcd(a1, a2) !== 1 || gcd(b1, b2) !== 1 || a1 * b2 === a2 * b1 || c1 > 20 || c2 > 20)
    const nA = kA * (a1 + a2), nB = kB * (b1 + b2)
    const bg = (n, w) => `${n} ${n === 1 ? w : `${w}s`}`
    return ask(`Group A has ${nA} students, with ${bg(a1, 'boy')} for every ${bg(a2, 'girl')}. In group B there ${b1 === 1 ? 'is' : 'are'} ${bg(b1, 'boy')} for every ${bg(b2, 'girl')}. Together, the ratio of boys to girls is ${c1}:${c2}. How many students are in group B?`,
      nB, [nA, kB * b1, nB + nA].filter((x) => x !== nB), `Group A: ${kA * a1} boys and ${kA * a2} girls. Group B: ${b1}k boys and ${b2}k girls. (${kA * a1} + ${b1}k)/(${kA * a2} + ${b2}k) = ${c1}/${c2} gives k = ${kB}, so group B has ${nB} students.`, [nB + 10, nB - 5])
  },
  // 18. An equation true for every x: each coefficient is 0.
  function zeroCoefficients() {
    const p = r(1, 6), q = r(1, 6), s = r(1, 9)
    return ask(`(a ${M} ${p})x² + (b + ${q})x + (c ${M} ${s}) = 0. In this equation a, b and c are constants. If it is true for all values of x, what is a + b + c?`,
      num(p - q + s), [num(p + q + s), num(-(p - q + s)), num(p - q)], `For it to be 0 for every x, each bracket must be 0: a = ${p}, b = ${M}${q}, c = ${s}. So a + b + c = ${num(p - q + s)}.`, [num(p - q + s + 1)])
  },
  // 19. Infinitely many solutions: the equations are multiples.
  function infinitelyMany() {
    const k = r(2, 4), a1 = r(1, 9), b2 = r(1, 9), C2 = r(1, 9)
    const pr = frac(k * k * b2, a1)
    return ask(`${coef(a1)}x + py = ${k * C2} and rx + ${coef(b2)}y = ${C2}. In this system, p and r are constants. If the system has infinitely many solutions, what is the value of p/r?`,
      pr, [frac(a1, k * k * b2), frac(b2, a1), frac(k * b2, a1)].filter((x) => x !== pr), `Infinitely many solutions means the first equation is ${k} times the second: ${a1} = ${k}r, p = ${k} × ${b2} = ${k * b2}. So r = ${frac(a1, k)} and p/r = ${pr}.`, [frac(k * k * b2 + a1, a1)])
  },
  // 20. Midpoints cut off a quarter of a triangle.
  function midpointTriangle() {
    const ABC = 4 * r(3, 30), small = ABC / 4, shaded = ABC - small
    return ask(`In triangle ABC, D is the midpoint of AB and E is the midpoint of BC. The region of the triangle below segment DE (the part that is not triangle DBE) has area ${shaded}. What is the area of triangle ABC?`,
      ABC, [2 * shaded, shaded + shaded / 3 + 4, shaded * 4].filter((x) => Number.isInteger(x) && x !== ABC), `DE is half of AC, so triangle DBE is similar with half the sides and 1/4 of the area. The rest is 3/4 of ABC: ${shaded} = (3/4) × ABC, so ABC = ${ABC}.`, [ABC + 4, ABC - 4])
  },
]

// Another form (different story or different thing asked) of a type that is already in the list. sameAs is that type's
// first maker itself, not its name: the live build shortens function names, so names cannot be matched there.
// Forms of one type are grouped, so a test never asks the same skill twice and students do not learn one sentence by heart.
const form = (sameAs, make) => Object.assign(make, { sameAs })

// Practice test 2, section 3 (no calculator), questions 1 to 20.
const T2_NOCALC = [
  // 1. Substitute step by step.
  function substitutionChain() {
    const a = r(2, 5), c = r(2, 15), d = r(1, 6), e = r(1, 6), y = e + d, x = c + a * y
    return ask(`If x ${M} ${a}y = ${c}, y = z + ${d} and z = ${e}, what is the value of x?`, x, [c + a * e, c - a * y, x - a].filter((v) => v !== x),
      `z = ${e}, so y = ${e} + ${d} = ${y}. Then x = ${c} + ${a}(${y}) = ${x}.`, [x + 2])
  },
  // 2. A system with exactly one solution.
  form(NO_CALC[8], function oneSolutionSystem() {
    const p = r(1, 4), q = p * r(2, 4), C1 = r(2, 9), C2 = r(2, 9)
    const pair = (a, b) => `a = ${a} and b = ${b}`, ks = [1, 2, 3, 4].sort(() => Math.random() - 0.5)
    let a, b; do { a = r(1, 6); b = r(1, 12) } while (a * q === b * p)
    return ask(`${coef(p)}x + ${q}y = ${C1} and ax + by = ${C2}. If this system has exactly one solution, which could be the values of a and b?`,
      pair(a, b), ks.slice(0, 3).map((k) => pair(k * p, k * q)), `The system has exactly one solution unless the lines are parallel, which happens when a/b = ${p}/${q}. The pairs with b = ${q / p}a are parallel. Only ${pair(a, b)} breaks that pattern.`)
  }),
  // 3. Break even: cost equals revenue.
  form(T5_NOCALC[11], function breakEven() {
    const c = 10 * r(5, 30), price = c + 10 * r(5, 30), p = 10 * r(20, 200), F = (price - c) * p
    return ask(`A company makes and sells p phones. Making them costs ${F.toLocaleString('en-US')} + ${c}p dollars, and selling them brings in ${price}p dollars. For what value of p does the money brought in equal the cost?`,
      p, [Math.round(F / price), Math.round(F / c), p + 100].filter((v) => v !== p), `${price}p = ${F} + ${c}p, so ${price - c}p = ${F} and p = ${p}.`, [p - 50])
  }),
  // 4. Square with a reciprocal, the other way round.
  form(T5_NOCALC[2], function reciprocalSquareMinus() {
    const k = r(1, 3), kx = k === 1 ? '1/a' : `${k}/a`, k2 = k === 1 ? '1/a²' : `${k * k}/a²`
    return ask(`Which of the following is equal to (a + ${kx})² ${M} ${2 * k}?`, `a² + ${k2}`, [`a² + ${k2} ${M} ${2 * k}`, `a² ${M} ${2 * k}a + ${k2}`, `a² + ${2 * k} + ${k2}`],
      `(a + ${kx})² = a² + ${2 * k} + ${k2}. Taking away ${2 * k} leaves a² + ${k2}.`)
  }),
  // 5. Square-root equation.
  function rootEquation() {
    const p = r(1, 9), k = r(2, 6)
    return ask(`√(a² ${M} ${coef(p)}a + ${k * k}) = ${k}. If a is a positive number, what is the value of a?`, p, [k, k * k, p + k].filter((v) => v !== p),
      `Square both sides: a² ${M} ${coef(p)}a + ${k * k} = ${k * k}, so a² ${M} ${coef(p)}a = 0 and a(a ${M} ${p}) = 0. a is positive, so a = ${p}.`, [p + 1, p + 2])
  },
  // 6. A point on the line perpendicular to another.
  form(NO_CALC[14], function perpendicularPoint() {
    let y0, x0, p, k; do { y0 = r(2, 8); x0 = r(2, 9); p = r(1, 6); k = (-p * x0) / y0 } while (!Number.isInteger(k * 2) || x0 === y0)
    return ask(`In the xy-plane, line m passes through (0, ${y0}) and (${x0}, 0). Line ℓ passes through the origin and is perpendicular to line m. The point (${M}${p}, k) is on line ℓ. What is the value of k?`,
      num(k), [num((-p * y0) / x0 % 1 === 0 ? (-p * y0) / x0 : -p), num(-k), num(-p)].filter((v) => v !== num(k)),
      `Line m has slope ${M}${y0}/${x0}, so line ℓ has slope ${x0}/${y0}: y = (${x0}/${y0})x. At x = ${M}${p}, k = ${num(k)}.`, [num(k - 1), num(k + 1)])
  }),
  // 7. A chain of equal expressions, then an average.
  function chainAverage() {
    const n = pick([1, 2, 3]), m = n * r(2, 4), sum = n + m + n * m
    const avg = (() => { const g = gcd(sum, 3 * n); const t = sum / g, b = (3 * n) / g; return b === 1 ? `${t}a` : `${t}a/${b}` })()
    const wrong = (s, d) => { const g = gcd(s, d); return d / g === 1 ? `${s / g}a` : `${s / g}a/${d / g}` }
    return ask(`If ${m}a = ${n === 1 ? '' : n}b = c, what is the average (arithmetic mean) of a, b and c in terms of a?`, avg,
      [wrong(n + m + m, 3 * n), wrong(m, 1), wrong(sum, n)].filter((v) => v !== avg), `b = ${frac(m, n)}a and c = ${m}a. Their sum is a + ${frac(m, n)}a + ${m}a = ${frac(sum, n)}a. Dividing by 3 gives ${avg}.`, [wrong(sum + 3, 3 * n), wrong(sum + 6, 3 * n), `${m + n}a`, `${sum}a`, wrong(sum - 3, 3 * n)])
  },
  // 8. Area of a regular hexagon.
  function hexagonArea() {
    const s = 2 * r(1, 5), k = (3 * s * s) / 2
    return ask(`A regular hexagon has sides of length ${s}. What is its area?`, `${k}√3`, [String(k), `${s * s}√3`, `${(3 * s * s) / 4}√3`],
      `A regular hexagon is 6 equilateral triangles of side ${s}. Each has area (√3/4)(${s * s}) = ${(s * s) / 4}√3, so the hexagon has area ${k}√3.`)
  },
  // 9. A line through the point where a parabola crosses the x-axis.
  function lineThroughRoot() {
    const c = r(1, 5), m = r(1, 4)
    return ask(`The graphs of y = x² ${M} ${c * c} and y = ${coef(m)}x + b meet at two points. One of them is where the parabola crosses the negative x-axis. What is the value of b?`,
      m * c, [c, m, c * c].filter((v) => v !== m * c), `The parabola crosses the negative x-axis at x = ${M}${c}, the point (${M}${c}, 0). It is on the line: 0 = ${m}(${M}${c}) + b, so b = ${m * c}.`, [m * c + 1, m * c + 2])
  },
  // 10. Combine two fractions.
  function combineFractions() {
    const a = r(1, 4), half = a === 1 ? '1/2' : `1/${2 * a}`, d = `x² ${M} ${a * a}`
    return ask(`Which of the following is equal to (${half})(1/(x ${M} ${a}) ${M} 1/(x + ${a}))?`, `1/(${d})`, [`(${half})(1/(${d}))`, `${M}2/(${d})`, `${M}2x/(${d})`],
      `1/(x ${M} ${a}) ${M} 1/(x + ${a}) = ((x + ${a}) ${M} (x ${M} ${a}))/(${d}) = ${2 * a}/(${d}). Times ${half} gives 1/(${d}).`)
  },
  // 11. Solve a formula that turns into a quadratic.
  function cylinderSurface() {
    const rr = r(1, 6), h = r(1, 8), S = 2 * rr * rr + 2 * rr * h
    return ask(`The surface area of a cylinder with radius r and height h is S = 2πr² + 2πrh. If the surface area is ${S}π and the height is ${h}, what is r?`,
      rr, [rr + 1, h, Math.round(S / (2 * h))].filter((v) => v !== rr), `2πr² + ${2 * h}πr = ${S}π. Divide by 2π: r² + ${h}r ${M} ${S / 2} = 0, which is (r ${M} ${rr})(r + ${rr + h}) = 0. r is positive, so r = ${rr}.`, [rr + 2])
  },
  // 13. Knowing one root gives the other.
  function otherRoot() {
    let p, q; do { p = pick([1, 2, 3, 4, 5]); q = r(-7, 7) } while (q === 0 || q === p || q === -p)
    const c = p * q
    return ask(`f(x) = x² + ax${tail(c)}. If f(${p}) = 0, which of the following must be true?`, `f(${num(q)}) = 0`, [`f(${num(-q)}) = 0`, `f(${num(-p)}) = 0`, 'f(0) = 0'],
      `f(${p}) = 0 gives ${p * p} + ${p}a${tail(c)} = 0, so a = ${num(-(p + q))}. Then f(x) = (x ${M} ${p})(x ${q < 0 ? '+' : M} ${Math.abs(q)}), so f(${num(q)}) = 0 too.`)
  },
  // 14. Two complex numbers that are equal.
  form(NO_CALC[1], function equalComplex() {
    let p, q, s, t, a; do { p = r(2, 5); q = r(2, 5); s = r(-6, 6); a = r(-5, 5); t = q * a + s } while (a === 0 || t === 0 || s === 0)
    const b = p * a
    return ask(`${p}a + (${q}a${tail(s)})i = b ${t < 0 ? M : '+'} ${Math.abs(t)}i. If i = √${M}1 and a and b are real constants, what is the value of b?`,
      num(b), [num(a), num(-b), num(t)].filter((v) => v !== num(b)), `The imaginary parts match: ${q}a${tail(s)} = ${num(t)}, so a = ${num(a)}. The real parts match: b = ${p}a = ${num(b)}.`, [num(b + p)])
  }),
  // 15. Turn a story about a mistake into an equation.
  function mistakeEquation() {
    const n = r(8, 12), m = n - r(1, 3), d = r(2, 9), name = pick(NAMES)
    return ask(`${name} wanted the average of ${n} test scores but divided their correct total S by ${m} by mistake. The result was ${d} more than it should have been. Which equation can be used to find S?`,
      `S/${m} = S/${n} + ${d}`, [`S/${n} = S/${m} + ${d}`, `${n}S = ${m}S + ${d}`, `(S + ${d})/${n} = S/${m}`],
      `The correct average is S/${n}. The wrong one is S/${m}, which is ${d} bigger: S/${m} = S/${n} + ${d}.`)
  },
  // 16. Area of a trapezoid under a line.
  function areaUnderLine() {
    const q = pick([2, 3, 4]), p = 1, b = r(2, 8), X = q * r(2, 5), top = b + (p * X) / q, A = ((b + top) / 2) * X
    return ask(`Line m has slope 1/${q} and crosses the y-axis at E(0, ${b}). D is the point (${X}, 0), and C is the point on line m straight above D. What is the area of the four-sided shape OECD, where O is the origin?`,
      dec(A), [dec(b * X), dec(top * X), dec(A / 2)].filter((v) => v !== dec(A)), `C is at x = ${X}, so its y is ${b} + ${X}/${q} = ${top}. OECD is a trapezoid with parallel sides ${b} and ${top} and width ${X}: area = (${b} + ${top})/2 × ${X} = ${dec(A)}.`, [dec(A + 6)])
  },
  // 17. Two savings plans meet.
  form(T5_NOCALC[11], function savingsEqual() {
    const n1 = pick(NAMES); let n2; do { n2 = pick(NAMES) } while (n2 === n1)
    const w = r(5, 30), s1 = r(3, 10), s2 = s1 + r(1, 6), b2 = 5 * r(1, 10), b1 = b2 + (s2 - s1) * w
    return ask(`${n1} has saved ${b1} dollars and saves ${s1} dollars a week. ${n2} has saved ${b2} dollars and saves ${s2} dollars a week. After how many weeks will they have saved the same amount?`,
      w, [b1 - b2, Math.round((b1 + b2) / (s1 + s2)), w + 5].filter((v) => v !== w), `${b1} + ${s1}w = ${b2} + ${s2}w, so ${s2 - s1}w = ${b1 - b2} and w = ${w}.`, [w + 2, w - 2])
  }),
  // 18. True for all x, another form.
  form(T5_NOCALC[17], function zeroCoefficientsPlus() {
    const p = r(2, 9), q = r(2, 9), s = r(1, 6)
    return ask(`(a ${M} ${p})x² + (b ${M} ${q})x + c + ${s} = 0. In this equation a, b and c are constants. If it is true for all values of x, what is a + b + c?`,
      p + q - s, [p + q + s, p + q, p - q - s].filter((v) => v !== p + q - s), `Each part must be 0: a = ${p}, b = ${q}, c = ${M}${s}. So a + b + c = ${p + q - s}.`, [p + q - s + 1])
  }),
  // 19. Arc length in radians.
  function arcLength() {
    const d = pick([2, 3, 4, 5, 6, 8, 10, 12]), n = pick([1, 1, 2, 3].filter((x) => gcd(x, d) === 1)), rad = r(2, 12)
    const L = frac(rad * n, d), angle = n === 1 ? `π/${d}` : `${n}π/${d}`
    return ask(`In a circle with centre O and radius r, the angle AOB measures ${angle} radians. If the minor arc AB is ${L === '1' ? '' : L.includes('/') ? `(${L})` : L}π long, what is r?`,
      rad, [Math.round((rad * n) / d) || rad + 3, rad * 2, d].filter((v) => v !== rad), `Arc = r × angle, so ${L}π = r × ${angle}, and r = ${rad}.`, [rad + 1, rad - 1])
  },
  // 20. A two-way table from fractions and a ratio.
  function twoWayTable() {
    let T, B, G, O, gy, go, bo, fb, p, q, g
    do {
      T = 10 * r(4, 12); fb = pick([[1, 2], [2, 5], [3, 5], [4, 7], [3, 7], [1, 3], [2, 3]]); [p, q] = pick([[1, 2], [2, 3], [1, 3], [3, 2], [2, 5]]); g = pick([[1, 2], [2, 3], [1, 3], [3, 4]])
      B = (T * fb[0]) / fb[1]; G = T - B; O = (T * p) / (p + q); gy = (G * g[0]) / g[1]; go = G - gy; bo = O - go
    } while (![B, O, gy].every(Number.isInteger) || bo < 1 || bo > B)
    return ask(`A class has ${T} students. ${fb[0]}/${fb[1]} of them are boys, and the ratio of students aged 10 or older to students under 10 is ${p}:${q}. If ${g[0]}/${g[1]} of the girls are under 10, how many boys are 10 or older?`,
      bo, [O, go, B - bo].filter((v) => v !== bo), `Boys: ${B}, girls: ${G}. Aged 10 or older: ${T} × ${p}/${p + q} = ${O}. Girls under 10: ${gy}, so girls 10 or older: ${go}. Boys 10 or older: ${O} ${M} ${go} = ${bo}.`, [bo + 2, bo - 1])
  },
]
// 12. Solve a formula for one letter, another form. (Kept apart because the list above is in question order.)
T2_NOCALC.push(form(T5_NOCALC[8], function solveRatioFormula() {
  return ask('R = (m₁ + m₂)/m₁. Which of the following gives m₁ in terms of R and m₂?', 'm₁ = m₂/(R − 1)',
    ['m₁ = m₂/R', 'm₁ = (R − 1)/m₂', 'm₁ = (m₂ − R)/R'],
    'Multiply by m₁: Rm₁ = m₁ + m₂. Then Rm₁ − m₁ = m₂, m₁(R − 1) = m₂, and m₁ = m₂/(R − 1).')
}))

// Practice test 3, section 3 (no calculator), questions 1 to 20.
const T3_NOCALC = [
  // 1. Pie chart where a straight line makes two equal angles.
  function pieChart() {
    let N, m; do { N = pick([20, 40, 60, 80, 100]); m = 5 * r(1, 4) } while (!Number.isInteger((N * (25 + m)) / 100) || !Number.isInteger((N * m) / 100))
    const math = (N * (25 + m)) / 100
    return ask(`${N} students voted for their favourite subject, shown in a pie chart. The Art and Music slices together make a right angle (90°), and Music is ${m}% of the votes. The edge between Art and Music is a straight line through the centre; on the far side it is the edge between Math and Science. Math sits next to Art, opposite Music. How many students voted for Math?`,
      math, [(N * 25) / 100, (N * (50 - m)) / 100, (N * (25 - m)) / 100].filter((v) => v !== math && v > 0), `The straight line makes equal opposite angles, so the part of Math past the 90° mark matches Music: ${m}%. Math = 25% + ${m}% = ${25 + m}% of ${N} = ${math}.`, [math + 2, math - 2])
  },
  // 2. Find an expression without solving for the letter.
  function expressionWithoutSolving() {
    const a = r(2, 7), b = r(1, 9), v = r(2, 12), c = v + b, k = r(2, 4), d = r(1, 9)
    return ask(`If ${a}r + ${b} = ${c}, what is the value of ${k * a}r + ${d}?`, k * v + d, [k * c + d, v + d, k * v].filter((x) => x !== k * v + d),
      `${a}r = ${c} ${M} ${b} = ${v}. ${k * a}r is ${k} times that: ${k * v}. Add ${d}: ${k * v + d}. There is no need to find r itself.`, [k * v + d + 1])
  },
  // 3. Negative exponent.
  function negativeExponent() {
    const m = r(2, 9), k = pick([m, r(2, 6)])
    return ask(`If a⁻² = 1/${m}, what is the value of ${k}a²?`, k * m, [frac(k, m), m, k * k].filter((x) => String(x) !== String(k * m)),
      `a⁻² = 1/a², so 1/a² = 1/${m} and a² = ${m}. Then ${k}a² = ${k * m}.`, [k * m + 1, k + m])
  },
  // 4. Quotient and remainder.
  function quotientRemainder() {
    const d = pick([5, 7, 8, 10, 12])
    return ask(`When a number p is divided by ${d}, the quotient is k and the remainder is r. Which expression gives r?`, `r = p ${M} ${d}k`, [`r = ${d}p ${M} k`, `r = ${d}(k ${M} p)`, `r = ${d}k ${M} p`],
      `p = ${d}k + r: ${d} goes into p k times, with r left over. So r = p ${M} ${d}k.`)
  },
  // 5. Sum of reciprocals with a known product.
  function reciprocalSum() {
    let a, b; do { a = r(2, 9); b = r(2, 12) } while (a === b)
    const P = a * b, S = a + b
    return ask(`If ${frac(S, P)} = 1/a + 1/b and ab = ${P}, what is the value of a + b?`, S, [P, S + 3, P - S].filter((x) => x !== S && x > 0),
      `1/a + 1/b = (a + b)/(ab) = (a + b)/${P}. So (a + b)/${P} = ${frac(S, P)} and a + b = ${S}.`, [S + 1, S - 1])
  },
  // 6. Width of a rectangle under a parabola.
  function parabolaRectangle() {
    const c = r(3, 6), x0 = r(1, c - 1), h = c * c - x0 * x0
    return ask(`f(x) = ${M}x² + ${c * c}. Rectangle MATH has M and H on the x-axis and A and T on the graph of f. If the side MA is ${h} tall, how long is side AT?`,
      2 * x0, [x0, c, 2 * c].filter((x) => x !== 2 * x0), `A and T are on the graph at height ${h}: ${M}x² + ${c * c} = ${h}, so x² = ${x0 * x0} and x = ±${x0}. AT goes from x = ${M}${x0} to x = ${x0}: ${2 * x0} long.`, [2 * x0 + 1, 2 * x0 + 2])
  },
  // 7. Shaded area under a line through two rectangles.
  form(T2_NOCALC[14], function areaUnderLineRectangles() {
    let w, h, L, H, A; do { w = r(2, 6); h = r(1, 4); L = r(4, 12); H = (h * (w + L)) / w; A = ((h + H) / 2) * L } while (!Number.isInteger(H) || !Number.isInteger(A))
    return ask(`A small rectangle ABED has AB = ${w} along the ground and height AD = ${h}. A large rectangle stands next to it on BC = ${L}. A straight line from A passes through the top of side BE and reaches the top-right corner of the large rectangle. What is the area of the part of the large rectangle below this line?`,
      A, [L * H, L * h, (L * H) / 2].filter((x) => x !== A), `The line rises ${h} for every ${w} across, so at C (${w + L} from A) it is ${H} high. The region under it is a trapezoid with heights ${h} and ${H} and width ${L}: (${h} + ${H})/2 × ${L} = ${A}.`, [A + 4, A - 4])
  }),
  // 8. Infinitely many solutions, another form.
  form(T5_NOCALC[18], function infinitelyManySum() {
    const p = r(1, 5), k = r(2, 5), C2 = r(1, 9)
    return ask(`ax ${M} by = ${k * C2} and ${coef(p)}x + y = ${C2}. If this system has infinitely many solutions, what is a + b?`,
      num(k * p - k), [num(k * p + k), num(k), num(-(k * p - k))].filter((x) => x !== num(k * p - k)), `The first equation must be ${k} times the second: a = ${k * p} and ${M}b = ${k}, so b = ${M}${k}. a + b = ${num(k * p - k)}.`, [num(k * p - k + 1)])
  }),
  // 9. Factors read from a table of values.
  form(CALC[22], function factorsFromTable() {
    const xs = [-3, -2, 0, 2, 3, 4], zeros = [...xs].sort(() => Math.random() - 0.5).slice(0, 2)
    const vals = xs.map((x) => (zeros.includes(x) ? 0 : pick([1, -1]) * r(1, 8)))
    const f = (v) => `(x ${v > 0 ? M : '+'} ${Math.abs(v)})`, fz = (v) => (v === 0 ? 'x' : f(v))
    const others = xs.filter((x) => !zeros.includes(x))
    const stmts = [zeros[0], zeros[1], pick(others)].sort(() => Math.random() - 0.5)
    const truth = stmts.map((v) => zeros.includes(v))
    const label = (t) => { const on = ['I', 'II', 'III'].filter((_, i) => t[i]); return on.length === 3 ? 'I, II and III' : `${on.join(' and ')} only` }
    const right = label(truth)
    const all = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1]].map((t) => label(t.map(Boolean)))
    return ask(`A polynomial g has these values: ${xs.map((x, i) => `g(${num(x)}) = ${num(vals[i])}`).join(', ')}. Which of these must be true? I. ${fz(stmts[0])} is a factor of g(x). II. ${fz(stmts[1])} is a factor of g(x). III. ${fz(stmts[2])} is a factor of g(x).`,
      right, all.filter((x) => x !== right).sort(() => Math.random() - 0.5).slice(0, 3), `(x ${M} c) is a factor exactly when g(c) = 0. g is 0 at x = ${num(zeros[0])} and x = ${num(zeros[1])} only, so the true statements are ${right.replace(' only', '')}.`)
  }),
  // 10. Inverse variation.
  function inverseVariation() {
    const n = pick([1, 2]), x1 = r(1, 4), y1 = r(2, 12), k = y1 * x1 ** n, x2 = x1 * r(2, 5), y2 = frac(k, x2 ** n)
    const what = n === 1 ? 'x' : 'x²'
    return ask(`y is inversely proportional to ${what}, and y = ${y1} when x = ${x1}. What is y when x = ${x2}?`, y2,
      [String(y1 * (x2 / x1) ** n), frac(k, x2), String(k)].filter((v) => v !== y2), `Inversely proportional means y × ${what} stays the same: ${y1} × ${x1 ** n} = ${k}. At x = ${x2}: y = ${k}/${x2 ** n} = ${y2}.`, [frac(k + 1, x2 ** n), frac(k, x2 ** n + 1)])
  },
  // 12. Isosceles right triangle on a grid.
  function isoscelesRightTriangle() {
    const x1 = r(-4, 2), y1 = r(-4, 2), x2 = x1 + r(3, 9), k = y1 + (x2 - x1)
    return ask(`Triangle PQR has P(${num(x1)}, ${num(y1)}), R(${num(x2)}, ${num(y1)}) and Q(${num(x2)}, k), with k > ${num(y1)}. It is an isosceles right triangle with the right angle at R. What is k?`,
      num(k), [num(x2 - x1), num(x2), num(k + 1)].filter((v) => v !== num(k)), `PR is flat and ${x2 - x1} long. The right angle is at R, so the two equal sides are PR and RQ: RQ = ${x2 - x1}, so k = ${num(y1)} + ${x2 - x1} = ${num(k)}.`, [num(k - 1), num(k + 2)])
  },
  // 13. Divide complex numbers.
  form(NO_CALC[1], function complexDivide() {
    const n = 2 * r(1, 5), plus = pick([true, false]), askA = pick([true, false])
    const a = plus ? n / 2 : -n / 2, b = n / 2
    return ask(`${n}i/(1 ${plus ? '+' : M} i) = a + bi. If i = √${M}1 and a and b are real constants, what is the value of ${askA ? 'a' : 'b'}?`,
      num(askA ? a : b), [num(askA ? -a : -b), num(n), num(askA ? b : a)].filter((v) => v !== num(askA ? a : b)),
      `Multiply top and bottom by (1 ${plus ? M : '+'} i): ${n}i(1 ${plus ? M : '+'} i)/2 = (${n}i ${plus ? '+' : M} ${n})/2 = ${num(a)} + ${b}i. So a = ${num(a)} and b = ${b}.`, [num((askA ? a : b) + 1), num((askA ? a : b) + 2)])
  }),
  // 14. A fraction equation that becomes a quadratic.
  function fractionQuadratic() {
    let h, b, D; do { h = r(1, 3); b = r(1, 6); D = h * h + b } while (Number.isInteger(Math.sqrt(D)))
    const sol = (p, d) => `x = ${p} ± √${d}`
    return ask(`1/x = x/(${coef(2 * h)}x + ${b}). What are the solutions to this equation?`, sol(h, D),
      [sol(num(-h), D), sol(h, D + 1), `x = (${h} ± √${D})/2`],
      `Cross-multiply: x² = ${2 * h}x + ${b}, so x² ${M} ${2 * h}x ${M} ${b} = 0. Complete the square: (x ${M} ${h})² = ${D}, so x = ${h} ± √${D}.`)
  },
  // 15. What changes when one variable changes, as statements.
  form(NO_CALC[17], function formulaStatements() {
    const v = pick([2, 3, 4]), u = pick([3, 5, 7, 9, 11].filter((x) => gcd(x, v) === 1)), c = r(10, 60)
    const options = [[`When K goes up by 1, P goes up by ${c}.`, false], [`When K goes up by ${v}, P goes up by ${u}.`, true], [`When K goes up by ${2 * v}, P goes up by ${2 * u}.`, true],
      [`When K goes up by 1, P goes up by ${u}.`, false], [`When K goes up by ${u}, P goes up by ${v}.`, false]]
    let st; do { st = [...options].sort(() => Math.random() - 0.5).slice(0, 3) } while (!st.some((s) => s[1]))
    const label = (t) => { const on = ['I', 'II', 'III'].filter((_, i) => t[i]); return on.length === 3 ? 'I, II and III' : `${on.join(' and ')} only` }
    const right = label(st.map((s) => s[1]))
    const all = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1]].map((t) => label(t.map(Boolean)))
    return ask(`P = (${u}/${v})K + ${c}. Which of these must be true? I. ${st[0][0]} II. ${st[1][0]} III. ${st[2][0]}`,
      right, all.filter((x) => x !== right).sort(() => Math.random() - 0.5).slice(0, 3), `P changes by ${u}/${v} of the change in K, so K up by ${v} gives P up by ${u}, and K up by ${2 * v} gives P up by ${2 * u}. The ${c} never changes anything. True: ${right.replace(' only', '')}.`)
  }),
  // 16. The other solution of a quadratic, another form.
  form(T2_NOCALC[11], function otherSolution() {
    let s, t; do { s = r(2, 9); t = r(1, 9) } while (s === t)
    return ask(`x² ${M} ax = ${M}${s * t}. This equation has two real solutions. If one of them is ${s} and a is a constant, what is the other solution?`,
      t, [num(-t), s + t, s * t], `Put x = ${s}: ${s * s} ${M} ${s}a = ${M}${s * t}, so a = ${s + t}. Then x² ${M} ${s + t}x + ${s * t} = (x ${M} ${s})(x ${M} ${t}), and the other solution is ${t}.`, [t + 1])
  }),
  // 17. A fraction equation with a whole-number answer.
  function fractionLinear() {
    const p = r(1, 3), s = r(1, 6), c = r(2, 9), d = r(1, 9), tot = (c + d) * s, A = r(1, tot - 1), B = tot - A, x = p + s
    return ask(`${A}/(x ${M} ${p}) ${M} ${c} = ${d} ${M} ${B}/(x ${M} ${p}). If x > ${p}, what is the solution?`, x, [s, x + 1, tot].filter((v) => v !== x),
      `Collect the fractions: ${tot}/(x ${M} ${p}) = ${c + d}. So x ${M} ${p} = ${s} and x = ${x}.`, [x + 2])
  },
  // 18. Parallel lines and a triangle between them.
  form(CALC[2], function parallelTriangle() {
    const t = 2 * r(20, 50), a = (180 - t) / 2, b = 180 - a
    return ask(`Lines ℓ and m are parallel. A triangle has its top corner on ℓ and its other two corners on m. At the top corner, the angle inside the triangle and the angle between the right side and line ℓ are equal; call each a°. The inside angle at the bottom-left corner is ${t}°. What is b, the angle outside the triangle at the bottom-right corner, between the right side and line m?`,
      b, [a, t, 180 - t].filter((x) => x !== b), `The angle between the left side and ℓ equals the ${t}° angle (alternate angles). The three angles on ℓ add to 180: ${t} + 2a = 180, so a = ${a}. The inside bottom-right angle is 180 ${M} ${t} ${M} ${a} = ${a}, so b = 180 ${M} ${a} = ${b}.`, [b + 10, b - 10])
  }),
  // 19. Sharing items among guests.
  function partyShare() {
    const sets = [[8, 4, 6], [2, 3, 4], [3, 4, 6], [4, 5, 10], [2, 5, 10], [3, 6, 9]]
    const [a, b, c] = pick(sets), L = [a, b, c].reduce((x, y) => (x * y) / gcd(x, y)), P = L * r(2, 8), T = P / a + P / b + P / c
    return ask(`At a party there was one drink for every ${a} people, one bag of snacks for every ${b} people and one cake for every ${c} people. There were ${T} drinks, bags and cakes in all. How many people were at the party?`,
      P, [T * 2, Math.round((T * (a + b + c)) / 3), P + L].filter((v) => v !== P), `With P people: P/${a} + P/${b} + P/${c} = ${T}. Over ${L}: (${L / a} + ${L / b} + ${L / c})P/${L} = ${T}, so P = ${T} × ${L}/${L / a + L / b + L / c} = ${P}.`, [P - L])
  },
  // 20. A triangle inside a trapezoid.
  function trapezoidTriangle() {
    const k = r(2, 5)
    return ask(`In trapezoid ABCD, BC is the short top side and AD the long bottom side, with AD = ${k} × BC. M is the midpoint of AD. What fraction of the trapezoid's area is triangle BMC?`,
      `1/${k + 1}`, [`1/${k}`, `1/${2 * (k + 1)}`, `1/${k + 2}`], `With height h: triangle BMC = (1/2) × BC × h. Trapezoid = (1/2)(BC + ${k}BC)h = ${frac(k + 1, 2)} × BC × h. The fraction is (1/2)/(${frac(k + 1, 2)}) = 1/${k + 1}.`)
  },
]
// 11. Vertex of a parabola from its factors. (Added here because it uses CALC, after the list above.)
T3_NOCALC.push(form(CALC[26], function vertexFromFactors() {
  let p, q; do { p = r(1, 8); q = r(1, 8) } while ((p - q) % 2)
  const k = pick([1, 2, 3, -1, -2])
  return ask(`y = ${coef(k)}(x ${M} ${p})(x + ${q}). The graph of this equation, where the number in front is a constant, has its vertex at (a, b). What is a?`,
    num((p - q) / 2), [num((p + q) / 2), num((q - p) / 2), num(p - q)].filter((v) => v !== num((p - q) / 2)), `The graph crosses the x-axis at x = ${p} and x = ${M}${q}. The vertex is halfway: a = (${p} + (${M}${q}))/2 = ${num((p - q) / 2)}.`, [num((p - q) / 2 + 1)])
}))

// A polynomial in x, written the usual way: poly([1, -3, 2]) -> "x² − 3x + 2"
const poly = (cs) => {
  const pw = ['', 'x', 'x²', 'x³'], deg = cs.length - 1
  let s = ''
  cs.forEach((c, i) => {
    const p = deg - i
    if (c === 0) return
    const mag = Math.abs(c) === 1 && p > 0 ? '' : String(Math.abs(c))
    s += s ? ` ${c < 0 ? M : '+'} ${mag}${pw[p]}` : `${c < 0 ? M : ''}${mag}${pw[p]}`
  })
  return s || '0'
}

// Practice test 4, section 3 (no calculator), questions 1 to 18 (the PDF stops at 18).
const T4_NOCALC = [
  // 1. Which expression can never be 0.
  function neverZero() {
    const c = r(1, 9), h = r(1, 5), a = r(2, 9), b = r(2, 9)
    const right = pick([`x² + ${c}`, `(x ${M} ${h})² + ${c}`, `|x| + ${c}`])
    return ask('Which of the following expressions can never be equal to 0, whatever the value of x?', right, [`x² ${M} ${a}`, `${b} ${M} x²`, `(x + ${h})² ${M} ${c}`],
      `${right.split(' + ')[0]} is never negative, so adding ${c} keeps the whole expression at ${c} or more. Each of the others is 0 for some x (a square or |x| can equal any number that is 0 or more).`)
  },
  // 2. Rate of change of a linear function from two values.
  form(CALC[18], function rateFromValues() {
    let p, q, d, v, m; do { p = r(3, 9); q = r(0, p - 1); d = r(2, 6); v = r(1, 6); m = (v * d) / (p - q) } while (!Number.isInteger(m))
    return ask(`f(x) = mx + b, where m and b are constants. If (f(${p}) ${M} f(${q}))/${d} = ${v}, what is m?`, m, [v, v * d, p - q].filter((x) => x !== m),
      `f(${p}) ${M} f(${q}) = ${p - q}m. So ${p - q}m/${d} = ${v} and m = ${m}.`, [m + 1, m + 2])
  }),
  // 3. A line through two points parallel to a given line.
  form(CALC[5], function parallelThroughPoints() {
    let n, d, y1, y2, ab; do { n = r(1, 3); d = r(2, 4); y1 = r(-3, 6); y2 = r(-6, 3); ab = ((y1 - y2) * d) / n } while (y1 === y2 || !Number.isInteger(ab) || gcd(n, d) !== 1)
    return ask(`The line through (a, ${num(y1)}) and (b, ${num(y2)}) is parallel to y = (${n}/${d})x ${M} 10. What is a ${M} b?`, num(ab), [num(-ab), num(y1 - y2), num((y1 - y2) * n)].filter((x) => x !== num(ab)),
      `Parallel lines have equal slopes: (${num(y1)} ${M} (${num(y2)}))/(a ${M} b) = ${n}/${d}. So a ${M} b = ${y1 - y2} × ${d}/${n} = ${num(ab)}.`, [num(ab + 1), num(ab - 1)])
  }),
  // 4. No solution: equal slopes.
  form(NO_CALC[8], function noSolutionSlope() {
    let p, q; do { p = r(1, 6); q = r(2, 6) } while (gcd(p, q) !== 1)
    const C = r(1, 9), c1 = frac(C + 1, q + 1)
    return ask(`y = mx ${M} ${c1} and ${coef(p)}x + ${q}y = ${C}. In this system, m is a constant. If the system has no solution, what is m?`, frac(-p, q), [frac(-q, p), frac(p, q), frac(q, p)],
      `${coef(p)}x + ${q}y = ${C} is y = ${coef(-p, q)}x + ${frac(C, q)}. No solution means parallel but different lines: same slope, so m = ${frac(-p, q)}.`)
  }),
  // 5. Put an expression into a function.
  function shiftedInput() {
    const p = r(1, 4), q = pick([-3, -2, -1, 1, 2, 3]), c = r(1, 6)
    const fx = `(x ${M} ${p})² ${q < 0 ? M : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}(x ${M} ${p}) ${M} ${c}`
    return ask(`If f(x) = ${fx}, which of the following is equal to f(${p} ${M} x)?`, poly([1, -q, -c]), [poly([1, q, -c]), poly([1, -q, c]), poly([1, q, c])],
      `Put ${p} ${M} x in place of x: each (x ${M} ${p}) becomes (${p} ${M} x ${M} ${p}) = ${M}x. So f = (${M}x)² ${q < 0 ? M : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}(${M}x) ${M} ${c} = ${poly([1, -q, -c])}.`)
  },
  // 6. Triangle inside a parabola.
  form(T3_NOCALC[5], function parabolaTriangle() {
    const c = r(2, 6)
    return ask(`f(x) = ${M}x² + ${c * c}. A and C are where the graph crosses the x-axis, and B is its highest point. What is the area of triangle ABC?`, c ** 3, [2 * c ** 3, (c ** 3) / 2, c * c].filter((x) => Number.isInteger(x)),
      `The graph crosses the x-axis at x = ±${c}, so AC = ${2 * c}. B = (0, ${c * c}), so the height is ${c * c}. Area = (1/2)(${2 * c})(${c * c}) = ${c ** 3}.`, [c ** 3 + c, c ** 3 - c])
  }),
  // 7. A ratio after a shift.
  form(NO_CALC[7], function ratioShift() {
    const k = r(1, 4), n = r(1, 5), d = r(2, 6), ans = frac(n + k * d, d)
    return ask(`If (a ${M} ${k === 1 ? '' : k}b)/b = ${frac(n, d)}, what is a/b?`, ans, [frac(n, d), frac(n + d, d), frac(n * k, d)].filter((x) => x !== ans),
      `(a ${M} ${k === 1 ? '' : k}b)/b = a/b ${M} ${k}. So a/b = ${frac(n, d)} + ${k} = ${ans}.`, [frac(n + k * d + 1, d), frac(n + k * d - 1, d)])
  }),
  // 8. Constants from a point that solves a system.
  function constantsFromPoint() {
    const s = r(2, 5), m = r(2, 6), v = m * s, k = m * s * s - v, askK = pick([true, false])
    return ask(`y = m√x and y = mx ${M} k, where m and k are constants. If (${s * s}, ${v}) is a solution of this system, what is the value of ${askK ? 'k' : 'm'}?`,
      askK ? k : m, askK ? [m, v, m * s * s] : [k, v, s], `From y = m√x: ${v} = m × ${s}, so m = ${m}. From y = mx ${M} k: ${v} = ${m * s * s} ${M} k, so k = ${k}.`, [(askK ? k : m) + 1, (askK ? k : m) + 2])
  },
  // 9. A level line across a shifted parabola.
  form(T3_NOCALC[5], function parabolaChordShifted() {
    const h = r(3, 12), s = r(2, 6)
    return ask(`f(x) = (x ${M} ${h})². Rectangle MATH has M and H on the x-axis and A and T on the graph of f. If MA = ${s * s}, how long is AT?`, 2 * s, [s, s * s, h].filter((x) => x !== 2 * s),
      `(x ${M} ${h})² = ${s * s} gives x ${M} ${h} = ±${s}, so x = ${h - s} or ${h + s}. AT = ${2 * s}.`, [2 * s + 2, 2 * s - 1])
  }),
  // 10. Which equation has no solution (or infinitely many).
  function whichNoSolution() {
    const wantNone = pick([true, false])
    const eq = (a, b, c, d, e) => `${a}x${tail(b)} = ${c}x + ${d}x${tail(e)}`
    const a = r(6, 12), c = r(1, a - 2), d = a - c, b = r(-9, 9) || 3
    const none = eq(a, b, c, d, b + r(1, 9)), many = eq(a, b, c, d, b), one1 = eq(a, b, c, d + 1, b + 2), one2 = eq(a + 1, b, c, d - 1, b - 3)
    return ask(`Which of the following equations has ${wantNone ? 'no solution' : 'infinitely many solutions'}?`, wantNone ? none : many, [wantNone ? many : none, one1, one2],
      `Collect x on each side. When both sides have the same amount of x, the x terms cancel: if the numbers left are different there is no solution, and if they match every x works. In ${wantNone ? none : many} both sides have ${a}x and the numbers ${wantNone ? 'differ' : 'match'}.`)
  },
  // 11. A vertex value fixes the constant in front.
  form(CALC[26], function vertexValueK() {
    let p, q, w; do { p = r(1, 8); q = r(1, 12) } while ((p + q) % 2); w = (p + q) / 2
    const kn = pick([1, 2]), kd = pick([1, w]), k = frac(kn, kd), b = -(kn * w * w) / kd
    return ask(`f(x) = k(x + ${p})(x ${M} ${q}), where k is a constant. The graph is a parabola with vertex (a, b). If b = ${num(b)}, what is k?`, k, [frac(kd, kn), frac(kn, kd * w), String(w)].filter((x) => x !== k),
      `The vertex is halfway between ${M}${p} and ${q}: a = ${num((q - p) / 2)}. Then b = k(${w})(${M}${w}) = ${M}${w * w}k. So ${M}${w * w}k = ${num(b)} and k = ${k}.`, [frac(kn + 1, kd)])
  }),
  // 12. Exterior angle of a triangle between parallel lines.
  form(CALC[2], function exteriorAngle() {
    const b = r(30, 90), e = r(25, 150 - b)
    return ask(`Two straight lines cross at a point between parallel lines ℓ and m, and both continue down to m, making a triangle with m. The angle at the crossing point, inside the triangle, is ${b}°. The inside angle at the left corner on m is ${e}°. What is c, the angle outside the triangle at the right corner on m?`,
      b + e, [180 - b - e, 180 - b, 180 - e].filter((x) => x !== b + e), `The inside angle at the right corner is 180 ${M} ${b} ${M} ${e} = ${180 - b - e}. The outside angle is 180 ${M} ${180 - b - e} = ${b + e}: an outside angle of a triangle equals the two far inside angles added.`)
  }),
  // 13. Match terms after dividing.
  form(NO_CALC[12], function divisionMatch() {
    const A = r(2, 7), s = r(1, 4), R = r(2, 9), C = R - s, k = s - A
    return ask(`(${A}x² + kx${tail(C)})/(x ${M} 1) = ax + ${s} + ${R}/(x ${M} 1) for all x except 1, where k and a are constants. What is k?`, num(k), [num(-k), num(A + s), num(s)].filter((x) => x !== num(k)),
      `Multiply by (x ${M} 1): ${A}x² + kx${tail(C)} = (ax + ${s})(x ${M} 1) + ${R} = ax² + (${s} ${M} a)x + ${C}. So a = ${A} and k = ${s} ${M} ${A} = ${num(k)}.`, [num(k + 1), num(k - 1)])
  }),
  // 14. Solve a squared equation.
  form(T3_NOCALC[12], function squaredEquation() {
    let p, N, h, q; do { p = pick([2, 3, 4]); N = r(1, 9); h = r(1, 5); q = r(1, 6) } while (Number.isInteger(Math.sqrt(N * p)) || N % p === 0)
    const rhs = N - q
    const sol = (t) => `x = ${h} ± ${t}`
    return ask(`What are the solutions to ${p}(x ${M} ${h})² ${M} ${q} = ${num(rhs)}?`, sol(`√${N * p}/${p}`), [sol(`√${N * p}/${2 * p}`), sol(`√${N * p}`), `x = ${M}${h} ± √${N * p}/${p}`],
      `Add ${q}: ${p}(x ${M} ${h})² = ${N}. Divide: (x ${M} ${h})² = ${N}/${p}. So x ${M} ${h} = ±√(${N}/${p}) = ±√${N * p}/${p}.`)
  }),
  // 15. Complete a survey table.
  form(T2_NOCALC[18], function surveyTable() {
    let p, F, J, T; do { p = pick([20, 25, 40, 50, 60, 75]); F = 10 * r(3, 12); J = F / (1 - p / 100); T = 10 * r(Math.ceil(J / 10) + 3, Math.ceil(J / 10) + 25) } while (!Number.isInteger(J))
    const S = T - J
    return ask(`A school asked students whether they were for or against a new canteen. ${F} juniors were for it, ${p}% of juniors were against it, and ${T} students answered in total (juniors and seniors). How many seniors answered?`,
      S, [J, T - F, Math.round((T * p) / 100)].filter((x) => x !== S), `${100 - p}% of juniors were for it: ${F} = ${(100 - p) / 100} × juniors, so there are ${J} juniors. Seniors = ${T} ${M} ${J} = ${S}.`, [S + 10, S - 10])
  }),
  // 16. Altitude in a right triangle from a cosine.
  function altitudeTrig() {
    const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]), t = pick([1, 2, 3, 4])
    const AC = c * t, BC = b * t, AB = a * t, BD = (a * b * t) / c
    return ask(`Triangle ABC has a right angle at B, and BD is drawn from B straight down to AC, meeting it at a right angle. Angle C is x° with cos x° = ${b}/${c}${t === 1 && c === 5 ? ' (0.8)' : ''}. If AC = ${AC}, what is BD (to 2 decimal places where needed)?`,
      dec(BD), [String(BC), String(AB), dec((AB * AB) / AC)].filter((x) => x !== dec(BD)), `cos C = BC/AC, so BC = ${b}/${c} × ${AC} = ${BC}. In triangle BDC, sin C = BD/BC and sin C = ${a}/${c}, so BD = ${a}/${c} × ${BC} = ${dec(BD)}.`, [dec(BD + 1)])
  },
  // 17. Factor a cubic by grouping.
  function groupingCubic() {
    const a = r(1, 4), b = r(1, 9), rr = r(1, 9)
    return ask(`For what real value of x is ${poly([a, -a * rr, b, -b * rr])} = 0?`, rr, [-rr, b, frac(b, a)].filter((x) => show(x) !== show(rr)),
      `Group: ${coef(a)}x²(x ${M} ${rr}) + ${b}(x ${M} ${rr}) = (${coef(a)}x² + ${b})(x ${M} ${rr}). ${coef(a)}x² + ${b} is never 0, so x = ${rr}.`, [rr + 1, rr + 2])
  },
  // 18. Crossed lines between two upright posts.
  function crossedLines() {
    const A = r(3, 12), C = r(2, 9), W = r(8, 20), h = (A * C) / (A + C)
    return ask(`Two upright posts stand ${W} apart: AB is ${A} tall and CD is ${C} tall, with A and C on the ground. A line from B to C and a line from A to D cross at P. PQ goes straight down from P to the ground. How long is PQ (to 2 decimal places where needed)?`,
      dec(h), [dec((A + C) / 2), dec((A * C) / W), dec(Math.abs(A - C))].filter((x) => x !== dec(h)), `Similar triangles give 1/PQ = 1/AB + 1/CD, so PQ = (${A} × ${C})/(${A} + ${C}) = ${dec(h)}. The distance between the posts does not matter.`, [dec(h + 1), dec(h + 0.5)])
  },
]

// "Which of these are true?" with statements I, II and III: the right combination plus 3 wrong ones.
const ROMAN = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1]]
const romanLabel = (t) => { const on = ['I', 'II', 'III'].filter((_, i) => t[i]); return on.length === 3 ? 'I, II and III' : `${on.join(' and ')} only` }
const romanWrong = (right) => ROMAN.map((t) => romanLabel(t.map(Boolean))).filter((x) => x !== right).sort(() => Math.random() - 0.5).slice(0, 3)
const sup = (n) => String(n).split('').map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join('')

// Practice test 6, section 3 (no calculator), questions 1 to 20.
const T6_NOCALC = [
  // 1. Another expression found without solving.
  form(T3_NOCALC[1], function expressionScaled() {
    const p = r(2, 5), q = r(1, 9), m = r(2, 6)
    return ask(`If ${m * p}x ${M} ${m * q} = a, what is ${p}x ${M} ${q} in terms of a?`, `a/${m}`, [`a/${m} ${M} ${q}`, `a/${m} + ${q}`, `a/${m} + ${m}`],
      `${m * p}x ${M} ${m * q} = ${m}(${p}x ${M} ${q}). So ${m}(${p}x ${M} ${q}) = a and ${p}x ${M} ${q} = a/${m}.`, [`a/${m} ${M} ${m}`, `${m}a`, `a ${M} ${q}`])
  }),
  // 2. Arithmetic sequence.
  function arithmeticSequence() {
    const a = 5 * r(2, 8), d = r(2, 9), n = r(8, 30), name = pick(NAMES), v = a + (n - 1) * d
    return ask(`${name} walks on a treadmill for ${a} minutes on day 1 and adds ${d} minutes each day after that. How many minutes will ${name} walk on day ${n}?`,
      v, [a + n * d, n * d, a + (n - 2) * d], `Day 1 is ${a}, and ${d} is added ${n - 1} times to reach day ${n}: ${a} + ${n - 1} × ${d} = ${v}.`)
  },
  // 3. Count whole numbers inside an absolute-value inequality.
  form(CALC[4], function absCount() {
    const c = r(-4, 6), d = r(2, 6), strict = pick([true, false]), n = strict ? 2 * d - 1 : 2 * d + 1
    const lhs = `|a ${c < 0 ? '+' : M} ${Math.abs(c)}|`
    return ask(`How many integers a satisfy ${lhs} ${strict ? '<' : '≤'} ${d}?`, n, [strict ? 2 * d + 1 : 2 * d - 1, 2 * d, d].filter((x) => x !== n),
      `${lhs} ${strict ? '<' : '≤'} ${d} means ${num(c - d)} ${strict ? '<' : '≤'} a ${strict ? '<' : '≤'} ${num(c + d)}. The integers from ${num(strict ? c - d + 1 : c - d)} to ${num(strict ? c + d - 1 : c + d)} number ${n}.`, [n + 1])
  }),
  // 4. A line's equation from the shape of its graph.
  function lineFromGraph() {
    const c = r(1, 9), down = pick([true, false]), above = pick([true, false])
    const eqs = { true_true: `x + y ${M} ${c} = 0`, false_true: `x ${M} y + ${c} = 0`, true_false: `x + y + ${c} = 0`, false_false: `x ${M} y ${M} ${c} = 0` }
    const right = eqs[`${down}_${above}`]
    return ask(`Line ℓ ${down ? 'goes down' : 'goes up'} from left to right and crosses the y-axis ${above ? 'above' : 'below'} the origin. Which of the following could be the equation of line ℓ?`,
      right, Object.values(eqs).filter((e) => e !== right), `Write each as y = mx + b. ${down ? 'Going down needs a negative slope (x + y form)' : 'Going up needs a positive slope (x − y form)'}, and crossing ${above ? 'above' : 'below'} the origin needs b ${above ? '> 0' : '< 0'}. Only ${right} has both.`)
  },
  // 5. Values read from a graph, as statements.
  form(CALC[24], function graphStatements() {
    const xs = [-4, -3, 0, 1, 3, 7], ys = [0, r(2, 4), 0, r(-3, -1), r(1, 3), null]; ys[5] = ys[4]
    const f = (x) => { for (let i = 0; i < 5; i++) if (x >= xs[i] && x <= xs[i + 1]) return ys[i] + ((ys[i + 1] - ys[i]) * (x - xs[i])) / (xs[i + 1] - xs[i]) }
    const target = ys[4]
    const picks = [pick([-2, -1, 2]), 1, pick([4.5, 5, 6.2])]
    const st = [[`f(${num(picks[0])})`, f(picks[0])], [`|f(${picks[1]})|`, Math.abs(f(picks[1]))], [`f(${picks[2]})`, f(picks[2])]]
    const truth = st.map(([, v]) => Math.abs(v - target) < 1e-9)
    if (!truth.some(Boolean)) return graphStatements()
    const right = romanLabel(truth)
    return ask(`The graph of f is made of straight pieces joining ${xs.map((x, i) => pt(x, ys[i])).join(', ')}. Which of the following are equal to ${target}? I. ${st[0][0]} II. ${st[1][0]} III. ${st[2][0]}`,
      right, romanWrong(right), `Reading the pieces: ${st.map(([s, v]) => `${s} = ${dec(v)}`).join(', ')}. So the ones equal to ${target} are ${right.replace(' only', '')}.`)
  }),
  // 6. Roots written as powers.
  function rootsToPowers() {
    const roots = { 2: '√', 3: '∛', 4: '∜' }, n1 = pick([3, 4]), n2 = pick([2, 3]), p = r(2, 6), q = r(2, 5), a = n1 * p, b = n2 * q
    return ask(`If x is positive, which of the following is equal to (${roots[n1]}x${sup(a)})(${roots[n2]}x${sup(b)})?`, `x${sup(p + q)}`, [`x${sup(a + b)}`, `x${sup(p * q)}`, `x${sup(Math.round((a + b) / (n1 + n2)))}`].filter((v) => v !== `x${sup(p + q)}`),
      `${roots[n1]}x${sup(a)} = x^(${a}/${n1}) = x${sup(p)} and ${roots[n2]}x${sup(b)} = x^(${b}/${n2}) = x${sup(q)}. Multiplying adds the powers: x${sup(p + q)}.`, [`x${sup(p + q + 1)}`])
  },
  // 7 and 8. Complete a two-way table.
  form(T2_NOCALC[18], function completeTable() {
    let J1, P, S2, T, statJ, juniors; do { J1 = 10 * r(4, 12); P = J1 + 10 * r(4, 12); S2 = 10 * r(3, 12); T = P + S2 + 10 * r(1, 8); statJ = T - P - S2; juniors = J1 + statJ } while (!Number.isInteger((100 * statJ) / juniors))
    const pct = pick([true, false]), ans = pct ? (100 * statJ) / juniors : statJ
    return ask(`At a school only juniors and seniors take Physics or Statistics (each student takes one). ${J1} juniors take Physics, ${P} students in all take Physics, ${S2} seniors take Statistics, and ${T} students take one of the two. ${pct ? 'What percent of juniors take Statistics?' : 'How many juniors take Statistics?'}`,
      ans, pct ? [Math.round((100 * statJ) / T), Math.round((100 * statJ) / (T - P)), 100 - ans] : [T - P, P - J1, S2 - statJ].filter((x) => x > 0), `Statistics has ${T} ${M} ${P} = ${T - P} students; minus ${S2} seniors leaves ${statJ} juniors.${pct ? ` Juniors in all: ${J1} + ${statJ} = ${juniors}, so ${statJ}/${juniors} = ${ans}%.` : ''}`, [ans + 5, ans + 10])
  }),
  // 9. Which data set has the smallest spread.
  function smallestSpread() {
    const sd = (a) => { const m = a.reduce((x, y) => x + y, 0) / a.length; return Math.sqrt(a.reduce((t, v) => t + (v - m) ** 2, 0) / a.length) }
    const v = r(1, 4), tight = [...Array(10)].map((_, i) => (i % 2 ? v : v + 1))
    const sets = [tight, [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5].slice(0, 10), [0, 1, 1, 2, 2, 2, 3, 3, 3, 5], [0, 1, 2, 2, 2, 3, 3, 3, 4, 5]]
    const txt = (a) => [...a].sort((x, y) => x - y).join(', ')
    if (Math.min(...sets.slice(1).map(sd)) <= sd(tight)) return smallestSpread()
    return ask('Which of the following data sets has the smallest standard deviation?', txt(tight), sets.slice(1).map(txt),
      `Standard deviation measures how far values sit from the mean. In ${txt(tight)} every value is ${v} or ${v + 1}, right next to the mean, so it is the smallest. The others spread from 0 to 5.`)
  },
  // 10. Square-root equation where one answer does not work.
  form(T2_NOCALC[4], function rootEquationCheck() {
    let d, v, w, c; do { d = r(1, 5); v = r(d + 1, d + 8); w = 2 * d + 1 - v; c = d * d - v * w } while (w >= d || c === 0)
    const set = (...a) => `{${a.map(num).join(', ')}}`
    return ask(`√(x ${c < 0 ? M : '+'} ${Math.abs(c)}) = x ${M} ${d}. What is the solution set of this equation?`, set(v), [set(w), set(w, v), 'No solution'],
      `Square both sides: x ${c < 0 ? M : '+'} ${Math.abs(c)} = x² ${M} ${2 * d}x + ${d * d}, so x² ${M} ${2 * d + 1}x + ${d * d - c} = 0 and x = ${num(w)} or ${v}. Check: at x = ${num(w)}, x ${M} ${d} is negative, but a square root cannot be negative. Only ${v} works.`)
  }),
  // 11. Match coefficients against a product plus a line.
  form(NO_CALC[12], function matchShift() {
    const p = r(1, 4), q = r(1, 5), B = r(-6, 2), C = r(1, 9), a = B + p + q, b = C - p * q
    const pair = (x, y) => `a = ${num(x)}, b = ${num(y)}`
    return ask(`${poly([1, B, C])} = (x ${M} ${p})(x ${M} ${q}) + ax + b. If this is true for all x, what are a and b?`, pair(a, b), [pair(-a, b), pair(a, -b), pair(b, a)].filter((x) => x !== pair(a, b)),
      `(x ${M} ${p})(x ${M} ${q}) = ${poly([1, -(p + q), p * q])}. Adding ax + b and matching: ${M}${p + q} + a = ${num(B)} gives a = ${num(a)}, and ${p * q} + b = ${C} gives b = ${num(b)}.`, [pair(a + 1, b), pair(a, b + 1), pair(a - 1, b - 1)])
  }),
  // 12. Difference of fourth powers.
  form(NO_CALC[5], function fourthPowers() {
    const n = r(2, 5), n2 = n * n
    return ask(`Which of the following is equal to x⁴ ${M} 1/${n2 * n2}?`, `(x² + 1/${n2})(x + 1/${n})(x ${M} 1/${n})`, [`(x² ${M} 1/${n2})²`, `(x ${M} 1/${n})⁴`, `(x² + x + 1/${n2})²`],
      `x⁴ ${M} 1/${n2 * n2} = (x² + 1/${n2})(x² ${M} 1/${n2}), and x² ${M} 1/${n2} = (x + 1/${n})(x ${M} 1/${n}).`)
  }),
  // 13. Sum of the solutions of a quadratic.
  function sumOfSolutions() {
    const k = r(2, 6), p = r(2, 12) * pick([1, -1]), c = k * r(1, 9)
    return ask(`${k}(x² ${p < 0 ? '+' : M} ${Math.abs(p)}x) = ${c}. What is the sum of the solutions of this equation?`, num(p), [num(2 * p), num(-p), num(c / k)].filter((x) => x !== num(p)),
      `Divide by ${k}: x² ${p < 0 ? '+' : M} ${Math.abs(p)}x ${M} ${c / k} = 0. For x² + bx + c = 0 the solutions add to ${M}b, so the sum is ${num(p)}.`, [num(p + 1)])
  },
  // 14 and 15. Rate and prediction from a line of best fit.
  form(CALC[21], function bestFitPredict() {
    const H = pick([7, 8, 10]), rate = pick([12, 14, 15, 16, 17.5, 18, 20]), D = rate * H, X = pick([20, 25, 30, 40])
    return ask(`A scatterplot of students' pay against hours worked has a line of best fit through (0, 0) and (${H}, ${D}). Based on the line, about how much will a student be paid for ${X} hours of work, in dollars?`,
      dec(rate * X), [dec(D), dec(rate * X * 1.5), dec(rate * X * 0.6)], `The line's slope is ${D}/${H} = ${dec(rate)} dollars an hour. For ${X} hours: ${dec(rate)} × ${X} ≈ ${dec(rate * X)}.`)
  }),
  // 16. How many times a horizontal line meets a W-shaped graph.
  function countIntersections() {
    const p = 2 * r(1, 4), c = r(1, 9), min = -c - (p * p) / 4
    const cases = [[-c + r(1, 6), 2], [-c, 3], [min + 1 < -c ? r(min + 1, -c - 1) : null, 4], [min, 2], [min - r(1, 5), 0]].filter((x) => x[0] != null)
    const [k, n] = pick(cases)
    return ask(`f(x) = x⁴ ${M} ${p}x² ${M} ${c}. The graph is W-shaped: it has a high point at (0, ${M}${c}) between two low points at y = ${num(min)}. How many points does the line y = ${num(k)} share with the graph of f?`,
      n, [0, 2, 3, 4].filter((x) => x !== n), `The line y = ${num(k)} ${k > -c ? `is above the middle high point, so it crosses each outer arm once: 2 points` : k === -c ? 'touches the middle high point and crosses each outer arm: 3 points' : k > min ? 'lies between the low points and the middle high point, so it crosses all 4 slopes: 4 points' : k === min ? 'touches the two low points: 2 points' : 'is below the lowest points: 0 points'}.`)
  },
  // 17. A constant from a function built on another.
  form(T4_NOCALC[7], function composedConstant() {
    const s = r(1, 5), n = r(1, 5), a = r(2, 5), b = a * n - s * s, v = r(-6, 3), k = s - v
    return ask(`f(x) = g(x) ${M} k and g(x) = √(${a}x ${b < 0 ? '+' : M} ${Math.abs(b)}), where k is a constant. If f(${n}) = ${num(v)}, what is k?`, num(k), [num(-k), num(s), num(v)].filter((x) => x !== num(k)),
      `g(${n}) = √(${a * n} ${b < 0 ? '+' : M} ${Math.abs(b)}) = √${s * s} = ${s}. f(${n}) = ${s} ${M} k = ${num(v)}, so k = ${num(k)}.`, [num(k + 1), num(k + 2)])
  }),
  // 18. Volume of a pipe (cylinder with a hole).
  function pipeVolume() {
    const rr = r(2, 10), t = r(1, 4), h = r(5, 15), V = t * (2 * rr + t) * h
    return ask(`A pipe is a cylinder with a round hole through the middle. It is ${h} inches tall and its wall is ${t} inch${t === 1 ? '' : 'es'} thick. If the volume of the pipe material is ${V}π cubic inches, what is the radius r of the hole, in inches?`,
      rr, [rr + t, 2 * rr, Math.round(V / (h * t))].filter((x) => x !== rr), `Volume = π(r + ${t})²(${h}) ${M} πr²(${h}) = ${h}π(${2 * t}r + ${t * t}). So ${2 * t}r + ${t * t} = ${V / h}, and r = ${rr}.`, [rr + 1, rr - 1])
  },
  // 19. A quadratic hiding inside a function.
  function disguisedQuadratic() {
    let p, q, v; do { p = r(1, 7); q = r(1, 7); v = r(-5, 9) } while (p === q || p * q + v === 0)
    const s = p + q, c = p * q + v, n = r(1, 5)
    return ask(`f(x) = (g(x))² ${M} ${s}g(x)${tail(c)}. If f(${n}) = ${num(v)}, which of the following could be the value of g(${n})?`, p, [-p, s, p * q].filter((x) => x !== q && x !== p),
      `Let u = g(${n}). Then u² ${M} ${s}u${tail(c)} = ${num(v)}, so u² ${M} ${s}u + ${p * q} = 0 = (u ${M} ${p})(u ${M} ${q}). So g(${n}) is ${p} or ${q}.`, [-q, s + 1])
  },
  // 20. Rectangle from the y-intercept of a parabola.
  form(T3_NOCALC[5], function parabolaInterceptRectangle() {
    const h = r(2, 6)
    return ask(`P is where the graph of y = ${poly([1, -2 * h, h * h])} crosses the y-axis. Q is the other point on the graph at the same height as P, and R is straight below Q on the x-axis. What is the area of rectangle OPQR, where O is the origin?`,
      2 * h ** 3, [h ** 3, h * h, 4 * h ** 3], `P = (0, ${h * h}). At height ${h * h}: x² ${M} ${2 * h}x = 0, so the other x is ${2 * h}. The rectangle is ${2 * h} by ${h * h}: area ${2 * h ** 3}.`)
  }),
]

// Practice test 7, section 3 (no calculator), questions 1 to 20.
const T7_NOCALC = [
  // 1. A range written as an absolute value.
  form(CALC[4], function absRange() {
    const mid = r(-3, 9), half = r(1, 6), lo = mid - half, hi = mid + half
    const ab = (s, op) => `|x ${s} ${Math.abs(mid)}| ${op} ${half}`, sIn = mid < 0 ? '+' : M, sOut = mid < 0 ? M : '+'
    return ask(`Which of the following is the same as ${num(lo)} ≤ x ≤ ${num(hi)}?`, ab(sIn, '≤'), [ab(sOut, '≤'), ab(sIn, '≥'), ab(sOut, '≥')],
      `The middle of ${num(lo)} and ${num(hi)} is ${num(mid)}, and each end is ${half} away. So x is within ${half} of ${num(mid)}: ${ab(sIn, '≤')}.`)
  }),
  // 2. Correlation from how a scatter plot looks.
  function correlationFromPlot() {
    const down = pick([true, false]), kind = pick(['tight', 'tight', 'weak', 'exact'])
    const sgn = down ? -1 : 1, val = { tight: 0.95, weak: 0.3, exact: 1 }[kind] * sgn
    const words = { tight: 'lie close to, but not exactly on, a straight line', weak: 'are spread out widely but drift slightly', exact: 'all lie exactly on one straight line' }[kind]
    const pool = kind === 'weak' ? [-0.95, -0.3, 0.3, 0.95] : [-1, -0.95, 0.95, 1]
    return ask(`In a scatter plot, the points go ${down ? 'down' : 'up'} from left to right and ${words}. Which correlation coefficient best fits the data?`,
      num(val), pool.filter((v) => v !== val).map(num), `${down ? 'Going down means a negative' : 'Going up means a positive'} correlation. ${kind === 'exact' ? 'Points exactly on a line give ±1.' : kind === 'tight' ? 'Close to a line, but not on it, is strong but not perfect: about 0.95.' : 'Widely spread points give a weak value near 0.'} So ${num(val)}.`)
  },
  // 3. A value of a linear function from another value.
  form(CALC[0], function linearValue() {
    const p = r(1, 5), q = pick([2, 3, 4].filter((x) => gcd(x, p) === 1)), x1 = q * r(1, 4), x2 = x1 + q * r(-3, -1), v = r(-5, 9), m = -p / q, f2 = v + m * (x2 - x1)
    return ask(`f(x) = ${M}(${p}/${q})x + b, where b is a constant. If f(${x1}) = ${num(v)}, what is f(${num(x2)})?`, num(f2), [num(-f2), num(v - m * (x2 - x1)), num(f2 + p)].filter((x) => x !== num(f2)),
      `Going from x = ${x1} to x = ${num(x2)} changes x by ${num(x2 - x1)}, so f changes by ${M}(${p}/${q})(${num(x2 - x1)}) = ${num(m * (x2 - x1))}. f(${num(x2)}) = ${num(v)} + ${num(m * (x2 - x1))} = ${num(f2)}.`, [num(f2 - 1)])
  }),
  // 4. Negative power times a root.
  form(T6_NOCALC[5], function negativeRootPower() {
    const n = r(1, 4), k = 2 * n + 1
    return ask(`Which of the following is equal to x⁻${sup(n)}(1/√x), for x > 0?`, `1/√(x${sup(k)})`, [`1/√(x${sup(k - 2)})`, `1/x${sup(n + 1)}`, `√(x${sup(k)})/2`],
      `x⁻${sup(n)} = x^(${M}${n}) and 1/√x = x^(${M}1/2). Add the powers: x^(${M}${k}/2) = 1/√(x${sup(k)}).`)
  }),
  // 5. Trigonometry inside a rectangle with midpoints.
  function rectangleTrig() {
    const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]])
    return ask(`In rectangle ABCD, E is the midpoint of BC and F is the midpoint of CD. If sin∠BAE = ${a}/${c}, what is tan∠EFC?`, frac(2 * a, b), [frac(a, b), frac(b, 2 * a), frac(a, c)],
      `In right triangle ABE, sin = BE/AE = ${a}/${c}, so BE = ${a}k and AB = ${b}k. Then CE = BE = ${a}k and CF = AB/2 = ${frac(b, 2)}k. tan∠EFC = CE/CF = ${frac(2 * a, b)}.`)
  },
  // 6. Find f(x) from f(kx).
  form(T4_NOCALC[4], function innerScale() {
    const k = r(2, 4), a = r(1, 7), b = r(1, 9)
    const ax = `${coef(a, k)}x + ${b}`
    return ask(`If f(${k}x) = ${coef(a)}x + ${b}, which of the following is f(x)?`, ax, [`(1/${k})(${coef(a)}x + ${b})`, `(1/${k})x + ${b}`, `${coef(a, k)}x + ${k * b}`],
      `Let u = ${k}x, so x = u/${k}. Then f(u) = ${a}(u/${k}) + ${b} = ${coef(a, k)}u + ${b}. So f(x) = ${ax}.`, [`${coef(a, k)}x ${M} ${b}`, `${coef(a * k)}x + ${b}`, `${coef(a, k)}x`])
  }),
  // 7. Square of a difference with a reciprocal.
  form(T5_NOCALC[2], function squareMinusRecip() {
    const k = r(1, 3), ka = k === 1 ? '1/a' : `${k}/a`, k2 = k === 1 ? '1/a²' : `${k * k}/a²`
    return ask(`Which of the following is equal to (a ${M} ${ka})²?`, `a² + ${k2} ${M} ${2 * k}`, [`a² ${M} ${k2}`, `a² + ${k2}`, `a² + ${k2} + ${2 * k}`],
      `(a ${M} ${ka})² = a² ${M} 2(a)(${ka}) + ${k2} = a² ${M} ${2 * k} + ${k2}.`)
  }),
  // 8. Choose the linear model for a steady drop.
  form(CALC[14], function linearModelChoice() {
    const V = 50 * r(4, 20), d = 5 * r(2, 8), rate = dec(d / V, 3)
    return ask(`A phone is worth $${V} now and loses $${d} of value each year. Which equation gives its value P, in dollars, after t years?`, `P = ${V} ${M} ${d}t`, [`P = ${V} + ${d}t`, `P = ${V}(1 ${M} ${rate})^t`, `P = ${V}(1 + ${rate})^t`],
      `Losing the same $${d} every year is a straight-line (linear) drop: start at ${V} and take away ${d} for each year, P = ${V} ${M} ${d}t.`)
  }),
  // 9. When a steady drop reaches a value.
  form(T5_NOCALC[7], function depreciationReach() {
    const d = 5 * r(2, 8), V = d * r(8, 20), t = r(2, 7), W = V - d * t
    return ask(`A phone is worth $${V} now and loses $${d} of value each year. In how many years will it be worth $${W}?`, t, [Math.round(W / d), t + 1, Math.round(V / d)].filter((x) => x !== t),
      `It must lose $${V - W}. At $${d} a year that takes ${V - W}/${d} = ${t} years.`, [t + 2])
  }),
  // 10. A parallel line in standard form.
  form(NO_CALC[14], function parallelEquation() {
    let p, q; do { p = r(2, 5); q = r(2, 6) } while (p === q)
    const k = r(1, 3), slope = frac(q, p), e = r(1, 12)
    const line = (a, b) => `${coef(a)}x ${b < 0 ? '+' : M} ${coef(Math.abs(b))}y = ${e}`
    return ask(`(1/${p})x ${M} (1/${q})y = ${r(2, 10)}. Which of the following equations gives a line parallel to the graph of this equation?`, line(q * k, p * k), [line(q * k, -p * k), line(p * k, q * k), line(p * k, -q * k)],
      `Multiply by ${p * q}: ${q}x ${M} ${p}y = (number), so y = (${slope})x + ... . A parallel line has slope ${slope}. ${line(q * k, p * k)} gives y = (${slope})x ${M} ${frac(e, p * k)}.`)
  }),
  // 11. Square root of a fraction.
  form(T2_NOCALC[4], function rootFraction() {
    const a = r(1, 9), b = r(2, 4), x = frac(-a, b * b - 1)
    return ask(`√((x ${M} ${a})/x) = ${b}. Which of the following is the solution to this equation?`, x, [frac(a, b * b - 1), frac(b * b - 1, -a), 'There is no solution'],
      `Square both sides: (x ${M} ${a})/x = ${b * b}, so x ${M} ${a} = ${b * b}x and ${M}${a} = ${b * b - 1}x. x = ${x}. Check: (x ${M} ${a})/x is then ${b * b}, which is positive, so it works.`)
  }),
  // 12. A horizontal line that misses a parabola.
  form(T6_NOCALC[13], function lineMissesParabola() {
    const n = r(2, 8), low = -n * n
    return ask(`y = k and y = (x + ${n})(x ${M} ${n}). In this system, k is a constant. If the system has no solution, which of the following could be k?`, num(low - r(1, 30)), [num(n * n), num(-low + 10), num(low + r(1, 10))],
      `(x + ${n})(x ${M} ${n}) = x² ${M} ${n * n}, whose lowest value is ${num(low)}. The line y = k misses it only when k < ${num(low)}.`)
  }),
  // 13. Match vertex form to standard form.
  form(NO_CALC[11], function vertexFormMatch() {
    const m = r(1, 4), a = r(-4, 5) || 2, b = r(-9, 30), B = -2 * m * a, C = m * a * a + b
    return ask(`f(x) = ${coef(m)}(x ${M} a)² + b, where a and b are constants. If f(x) = ${poly([m, B, C])} is the same function, what is b?`, num(b), [num(C), num(b + m * a * a * 2), num(-b)].filter((x) => x !== num(b)),
      `Expand: ${coef(m)}x² ${M} ${2 * m}ax + ${m}a² + b. Matching x terms: ${M}${2 * m}a = ${num(B)}, so a = ${num(a)}. Then ${m}(${a * a}) + b = ${C}, so b = ${num(b)}.`, [num(b + 1), num(b - 1)])
  }),
  // 14. Simplify a fraction inside a fraction.
  function complexFraction() {
    const m = r(1, 4), n = r(2, 5)
    return ask(`If a > 1, which of the following is equal to (1 ${M} ${m}/(${n}a))/(a ${M} ${m * m}/(${n * n}a))?`, `${n}/(${n}a + ${m})`, [`${n}/(${n}a ${M} ${m})`, `(${n}a ${M} ${m})/(${n}a + ${m})`, `(${n}a ${M} ${m})/${n}`],
      `Top: (${n}a ${M} ${m})/(${n}a). Bottom: (${n * n}a² ${M} ${m * m})/(${n * n}a) = (${n}a ${M} ${m})(${n}a + ${m})/(${n * n}a). Dividing cancels (${n}a ${M} ${m}) and leaves ${n * n}a/(${n}a × (${n}a + ${m})) = ${n}/(${n}a + ${m}).`)
  },
  // 15. Powers when a linear combination is known.
  form(NO_CALC[13], function exponentLinear() {
    const k = pick([2, 3]), p = pick([2, 3, 4]), e1 = pick([2, 3, 4].filter((e) => (k * p) % e === 0)), u = (k * p) / e1, t = r(1, 3)
    const b1 = 3 ** e1, b2 = 3 ** k
    return ask(`If ${p}x ${M} y = ${frac(t, k)}, what is the value of ${b1}^(${u === 1 ? '' : u}x)/${b2}^y?`, 3 ** t, [3 ** (t + 1), 3 ** (t * k), t * 3].filter((x) => x !== 3 ** t),
      `${b1}^(${u === 1 ? '' : u}x) = 3^(${k * p}x) and ${b2}^y = 3^(${k}y). The quotient is 3^(${k}(${p}x ${M} y)) = 3^(${k} × ${frac(t, k)}) = 3^${t} = ${3 ** t}.`, [3 ** t + 3])
  }),
  // 16. Inverse proportion with function notation.
  form(T3_NOCALC[9], function inverseHalf() {
    const a = r(2, 8), v = r(2, 12) * 2, b = a * pick([2, 3, 4])
    return ask(`y = f(x) is inversely proportional to x. If f(${a}) = ${v}, what is f(${b})?`, frac(a * v, b), [String((v * b) / a), String(v), frac(a * v, b * b)].filter((x) => x !== frac(a * v, b)),
      `Inversely proportional: x × f(x) stays the same, ${a} × ${v} = ${a * v}. So f(${b}) = ${a * v}/${b} = ${frac(a * v, b)}.`, [frac(a * v + b, b)])
  }),
  // 17. Areas split by a point on a diagonal.
  function diagonalAreaRatio() {
    let p, q; do { p = r(1, 4); q = r(p + 1, 7) } while (gcd(p, q) !== 1)
    const S = p * r(2, 10), ans = (S * (q - p)) / p
    return ask(`In rectangle ABCD, E is on diagonal AC with AE = ${p}/${q} of AC. If the area of triangle AED is ${S}, what is the area of triangle CED?`, ans, [S, (S * q) / p, (S * p) / (q - p)].filter((x) => Number.isInteger(x) && x !== ans),
      `Triangles AED and CED share the same height from D to AC, so their areas are in the ratio AE : EC = ${p} : ${q - p}. So CED = ${S} × ${q - p}/${p} = ${ans}.`, [ans + p, ans + 2 * p])
  },
  // 18. Area of a right triangle from a sine.
  form(NO_CALC[15], function rightTriangleSine() {
    const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17]]), t = r(1, 4), AB = b * t, BC = a * t
    return ask(`Triangle ABC has a right angle at B. Angle A is x° with sin x° = ${a}/${c}${c === 5 ? ' (0.6)' : ''}, and AB = ${AB}. What is the area of triangle ABC?`,
      (AB * BC) / 2, [AB * BC, (AB * c * t) / 2, (BC * c * t) / 2].filter((x) => x !== (AB * BC) / 2), `sin x = ${a}/${c} means the sides are ${a}k, ${b}k and ${c}k, with AB (next to angle A) = ${b}k = ${AB}, so k = ${t} and BC = ${BC}. Area = (1/2)(${AB})(${BC}) = ${(AB * BC) / 2}.`)
  }),
  // 19. Triangle under the meeting point of a cubic and a line.
  function cubicLineTriangle() {
    const m = pick([1, 2]), a = pick([1, 2, 4, 8].filter((x) => x !== m * m)), area = frac(m * m, 2 * a)
    return ask(`The graphs of f(x) = ax³ and g(x) = ${coef(m)}x meet at the origin O and at a point A with positive x. B is on the x-axis straight below A. If the area of triangle AOB is ${area}, what is a?`,
      a, [2 * a, m, a * a].filter((x) => x !== a), `ax³ = ${m}x gives x² = ${m}/a. A = (x, ${m}x), so the area is (1/2)(x)(${m}x) = ${m}x²/2 = ${m * m}/(2a). Setting ${m * m}/(2a) = ${area} gives a = ${a}.`, [a + 1, a + 3, 3 * a, 16])
  },
  // 20. Partial fractions.
  function partialFractions() {
    const p = r(1, 6), q = r(1, 6), s = p + q, c = s * r(1, 5) * pick([1, -1]), askA = pick([true, false]), a = c / s, b = -c / s
    return ask(`${num(c)}/(${poly([1, q - p, -p * q])}) = a/(x ${M} ${p}) + b/(x + ${q}), for all x except ${p} and ${M}${q}. What is the value of ${askA ? 'a' : 'b'}?`,
      num(askA ? a : b), [num(askA ? b : a), num(c), num((askA ? a : b) * 2)].filter((x) => x !== num(askA ? a : b)),
      `The bottom is (x ${M} ${p})(x + ${q}). So ${c} = a(x + ${q}) + b(x ${M} ${p}). Put x = ${p}: ${c} = ${s}a, a = ${num(a)}. Put x = ${M}${q}: ${c} = ${M}${s}b, b = ${num(b)}.`, [num((askA ? a : b) + 1)])
  },
]

// Practice test 8, section 3 (no calculator), questions 1 to 20.
const T8_NOCALC = [
  // 1. Find x² without finding x.
  form(T3_NOCALC[1], function squareWithoutSolving() {
    const k = r(1, 9), s = 1 + k
    return ask(`If ${k}/(x ${M} 1) = x + 1 and x ≠ 1, what is the value of x²?`, s, [k, k - 1, s * s].filter((v) => v !== s && v > 0),
      `Multiply by (x ${M} 1): ${k} = (x + 1)(x ${M} 1) = x² ${M} 1. So x² = ${s}.`, [s + 1, s + 2])
  }),
  // 2. Rectangle inside a semicircle.
  function semicircleRectangle() {
    const [w, h, rr] = pick([[4, 3, 5], [3, 4, 5], [12, 5, 13], [5, 12, 13], [8, 6, 10], [6, 8, 10], [15, 8, 17], [8, 15, 17]])
    return ask(`A rectangle ABCD sits inside a semicircle: A and D are on the diameter, and B and C are on the curve. The diameter is ${2 * rr} and the rectangle's height CD is ${h}. How long is BC?`,
      2 * w, [w, rr, 2 * rr - h].filter((x) => x !== 2 * w), `The centre is the midpoint of AD. From the centre to C is a radius, ${rr}. Half of BC is √(${rr}² ${M} ${h}²) = ${w}, so BC = ${2 * w}.`, [2 * w + 2, 2 * w - 2])
  },
  // 3. A negative fraction power.
  form(NO_CALC[13], function fractionPowerSolve() {
    const k = r(1, 3), m = frac(1, k), val = 4 ** k
    return ask(`If ${val} = (1/4)^(${M}1/m), what is the value of m?`, m, [`${M}${m}`, frac(1, 2 * k), `${M}${frac(1, 2 * k)}`].filter((x) => x !== m),
      `(1/4)^(${M}1/m) = 4^(1/m). And ${val} = 4^${k}. So 1/m = ${k} and m = ${m}.`, [String(k)])
  }),
  // 4. Cost of a trip from a price per unit and a rate.
  form(NO_CALC[6], function fuelCost() {
    const price = pick([2.25, 2.5, 3, 3.5, 4.2, 5]), mpg = pick([20, 25, 30, 40]), trips = r(2, 12), miles = mpg * trips, name = pick(NAMES)
    return ask(`${name} pays $${price.toFixed(2)} per gallon of fuel and drives ${mpg} miles on one gallon. How many dollars will ${name} spend to drive ${miles} miles?`,
      dec(price * trips), [dec(price * mpg), dec(miles / price), dec(price * trips * 2)], `${miles} miles ÷ ${mpg} miles per gallon = ${trips} gallons. ${trips} × $${price.toFixed(2)} = $${dec(price * trips)}.`, [dec(price * trips + 2)])
  }),
  // 5. Altitude to the hypotenuse.
  function altitudeHypotenuse() {
    const [db, cd] = pick([[4, 6], [2, 4], [4, 8], [3, 6], [1, 3], [9, 6], [8, 4]]), ad = (cd * cd) / db, area = (ad * cd) / 2
    return ask(`Triangle ABC has a right angle at C. CD is drawn from C straight down to AB, with D between A and B. If DB = ${db} and CD = ${cd}, what is the area of triangle ACD?`,
      dec(area), [dec((db * cd) / 2), dec(((ad + db) * cd) / 2), dec(ad * cd)], `Triangles ACD and CBD are similar, so AD/CD = CD/DB: AD = ${cd}²/${db} = ${dec(ad)}. Area of ACD = (1/2)(${dec(ad)})(${cd}) = ${dec(area)}.`)
  },
  // 6. Percents of squares give a ratio.
  form(CALC[33], function percentSquares() {
    const [p, q, rat] = pick([[125, 5, [1, 5]], [20, 80, [2, 1]], [50, 2, [1, 5]], [9, 36, [2, 1]], [8, 50, [5, 2]], [45, 5, [1, 3]]])
    return ask(`If a and b are positive and ${p}% of a² is equal to ${q}% of b², what is a/b?`, frac(rat[0], rat[1]), [frac(rat[1], rat[0]), frac(rat[0] * rat[0], rat[1] * rat[1]), String(rat[0] + rat[1])],
      `${p / 100}a² = ${q / 100}b², so a²/b² = ${q}/${p} = ${frac(q, p)}. a and b are positive, so a/b = ${frac(rat[0], rat[1])}.`)
  }),
  // 7 and 8. A phone plan with free minutes.
  function planOverage() {
    const base = pick([10, 15, 20, 25]), K = pick([100, 200, 300, 500]), rate = pick([0.1, 0.15, 0.2, 0.25]), extra = r(4, 30) * 10, paid = base + rate * extra, askK = pick([true, false])
    return askK
      ? ask(`A phone plan costs $${base} for the first ${K} minutes and $${rate.toFixed(2)} for each extra minute. The cost for t minutes (more than ${K}) is C(t) = ${base} + ${rate}(t ${M} K). What is K?`, K, [rate, base, K + base].map(String),
        `The extra minutes are the minutes over ${K}, which is t ${M} ${K}. So K = ${K}.`)
      : ask(`A phone plan costs $${base} for the first ${K} minutes and $${rate.toFixed(2)} for each extra minute. A customer paid $${dec(paid)}. How many minutes did they use?`, K + extra, [extra, Math.round(paid / rate), K + extra + 50],
        `$${dec(paid)} ${M} $${base} = $${dec(paid - base)} for extra minutes. ${dec(paid - base)} ÷ ${rate} = ${extra} extra minutes, so ${K} + ${extra} = ${K + extra} in all.`)
  },
  // 9. Factor theorem with an unknown.
  form(CALC[22], function factorUnknown() {
    const c = pick([1, 2, -1]), B = r(-5, 5), a = -(c ** 4 + B * c ** 3) / (1 - c)
    if (!Number.isInteger(a) || c === 1) return factorUnknown()
    const fx = `x⁴${B ? `${B < 0 ? ` ${M} ` : ' + '}${Math.abs(B) === 1 ? '' : Math.abs(B)}x³` : ''} ${M} ax + a`
    return ask(`If (x ${c > 0 ? M : '+'} ${Math.abs(c)}) is a factor of ${fx}, where a is a constant, what is a?`, num(a), [num(-a), num(a * 2), num(a + 2)].filter((x) => x !== num(a)),
      `A factor (x ${c > 0 ? M : '+'} ${Math.abs(c)}) means the polynomial is 0 at x = ${num(c)}: ${c ** 4}${tail(B * c ** 3)} ${M} a(${num(c)}) + a = 0, so ${c ** 4 + B * c ** 3} + ${num(1 - c)}a = 0 and a = ${num(a)}.`, [num(a - 1)])
  }),
  // 10. Altitude from the right angle, from a sine.
  form(T4_NOCALC[15], function altitudeFromSine() {
    const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17]]), t = pick([2, 4, 5]), BC = c * t, AB = a * t, AC = b * t, AD = (AB * AC) / BC
    return ask(`Triangle ABC has a right angle at A, and AD is drawn from A to BC, meeting it at a right angle. If sin C = ${a}/${c}${c === 5 ? ' (0.6)' : ''} and BC = ${BC}, what is AD (to 2 decimal places where needed)?`,
      dec(AD), [String(AB), String(AC), dec((AB * AB) / BC)].filter((x) => x !== dec(AD)), `sin C = AB/BC, so AB = ${AB}; then AC = ${AC}. Area two ways: (1/2)(${AB})(${AC}) = (1/2)(${BC})(AD), so AD = ${AB * AC}/${BC} = ${dec(AD)}.`)
  }),
  // 11. An identity with a bracket.
  form(NO_CALC[16], function identityBracket() {
    const a = r(2, 7), b = r(-6, 6) || 3
    return ask(`If a(x + b) = ${a}x${tail(a * b)} for all real x, what is b?`, num(b), [num(-b), num(a * b), num(a)].filter((x) => x !== num(b)),
      `Matching x terms gives a = ${a}. Then ab = ${num(a * b)}, so b = ${num(b)}.`, [num(b + 1), num(b - 1)])
  }),
  // 13. Divide complex numbers with a real part.
  form(NO_CALC[1], function complexQuotient() {
    const [p, q] = pick([[3, 1], [2, 1], [1, 2], [4, 3], [1, 3]]), den = p * p + q * q, re = (p * p - q * q) / den, im = (2 * p * q) / den, askA = pick([true, false])
    return ask(`(${p} + ${q === 1 ? '' : q}i)/(${p} ${M} ${q === 1 ? '' : q}i) = a + bi, where a and b are real numbers and i = √${M}1. What is ${askA ? 'a' : 'b'}?`,
      dec(askA ? re : im), [dec(askA ? im : re), dec(-(askA ? re : im)), dec(p / den)].filter((x) => x !== dec(askA ? re : im)),
      `Multiply top and bottom by (${p} + ${q === 1 ? '' : q}i): the top is ${p * p} + ${2 * p * q}i + ${q * q}i² = ${p * p - q * q} + ${2 * p * q}i, and the bottom is ${p * p} + ${q * q} = ${den}. So a = ${dec(re)} and b = ${dec(im)}.`, [dec((askA ? re : im) + 0.1)])
  }),
  // 14 and 15. Probability and fractions from a two-way table.
  form(T2_NOCALC[18], function tableProbability() {
    let MA, A, F, T, FA, FG, MT, MG; do { MA = 10 * r(3, 10); A = MA + 10 * r(2, 8); F = 10 * r(5, 12); T = 10 * r(15, 30); FA = A - MA; FG = F - FA; MT = T - F; MG = MT - MA } while (FG <= 0 || MG <= 0)
    const prob = pick([true, false])
    return prob
      ? ask(`In a survey of ${T} students, ${MA} boys prefer Algebra, ${A} students in all prefer Algebra and ${F} are girls. Everyone else prefers Geometry. What is the probability that a student picked at random is a girl who prefers Geometry (to 3 decimal places where needed)?`,
        dec(FG / T, 3), [dec(FA / T, 3), dec(FG / F, 3), dec(MG / T, 3)].filter((x) => x !== dec(FG / T, 3)), `Girls who prefer Algebra: ${A} ${M} ${MA} = ${FA}. Girls who prefer Geometry: ${F} ${M} ${FA} = ${FG}. Probability = ${FG}/${T} = ${dec(FG / T, 3)}.`, [dec(FG / T + 0.05, 3)])
      : ask(`In a survey of ${T} students, ${MA} boys prefer Algebra, ${A} students in all prefer Algebra and ${F} are girls. Everyone else prefers Geometry. What fraction of the boys prefer Geometry?`,
        frac(MG, MT), [frac(MG, T), frac(MA, MT), frac(MG, MA)].filter((x) => x !== frac(MG, MT)), `Boys: ${T} ${M} ${F} = ${MT}. Boys who prefer Geometry: ${MT} ${M} ${MA} = ${MG}. Fraction = ${frac(MG, MT)}.`, [frac(MG + 1, MT)])
  }),
  // 16. Parallel lines cut two crossing lines in proportion.
  function parallelProportion() {
    const a = r(2, 12), b = r(2, 15), k = pick([0.5, 1.5, 2, 2.5, 3]), c = a * k, d = b * k
    return ask(`Three parallel lines cross two other lines. On the first crossing line they cut off pieces AB = ${a} and BC = ${b}. On the second, the matching pieces are PQ = ${dec(c)} and QR. How long is QR?`,
      dec(d), [dec((a * b) / c), dec(b + c - a), dec(c * 2)].filter((x) => x !== dec(d)), `Parallel lines cut crossing lines in the same ratio: QR/PQ = BC/AB = ${b}/${a}. QR = ${dec(c)} × ${b}/${a} = ${dec(d)}.`, [dec(d + 1), dec(d - 1)])
  },
  // 17. A round trip at two speeds.
  form(CALC[19], function roundTripDistance() {
    const [v1, v2] = pick([[60, 40], [50, 30], [45, 30], [60, 30], [40, 24], [80, 60]]), D = (v1 * v2 / gcd(v1, v2)) * r(1, 3) / pick([1, 2]), T = D / v1 + D / v2
    if (!Number.isInteger(D)) return roundTripDistance()
    return ask(`${pick(NAMES)} drove from town A to town B at ${v1} miles per hour and came back the same way at ${v2} miles per hour. The round trip took ${dec(T)} hours. How far is it from A to B, in miles?`,
      D, [Math.round((T * (v1 + v2)) / 2), 2 * D, Math.round(T * v2)].filter((x) => x !== D), `Time = D/${v1} + D/${v2} = ${dec(T)}. So D(1/${v1} + 1/${v2}) = ${dec(T)} and D = ${D}.`, [D + 6])
  }),
  // 18. Another cubic by grouping, written as an equation.
  form(T4_NOCALC[16], function groupingCubicEquals() {
    const b = r(1, 9), rr = r(1, 6)
    return ask(`x³ ${M} ${coef(rr)}x² + ${b}x = ${b * rr}. For what real value of x is this equation true?`, rr, [-rr, b, rr + b].filter((v) => v !== rr),
      `Move ${b * rr} over: x²(x ${M} ${rr}) + ${b}(x ${M} ${rr}) = (x² + ${b})(x ${M} ${rr}) = 0. x² + ${b} is never 0, so x = ${rr}.`, [rr + 1])
  }),
  // 19. A perfect square with an unknown middle term.
  form(NO_CALC[12], function perfectSquareMatch() {
    const h = r(2, 7), j = r(1, 4)
    return ask(`x² + (k + ${j})x + ${h * h} = (x + h)², where k and h are positive constants. If this is true for all x, what is k?`, 2 * h - j, [2 * h, h - j, h * h - j].filter((v) => v !== 2 * h - j),
      `(x + h)² = x² + 2hx + h². So h² = ${h * h} gives h = ${h}, and k + ${j} = ${2 * h}, so k = ${2 * h - j}.`, [2 * h - j + 1])
  }),
  // 20. Two squares with an L-shaped gap.
  form(CALC[25], function lShapeSquares() {
    let N, pairs; do { N = 4 * r(3, 12); pairs = []; for (let d = 2; d * d < N; d += 2) if (N % d === 0 && (N / d) % 2 === 0) pairs.push([(d + N / d) / 2, (N / d - d) / 2]) } while (pairs.length !== 1)
    const [b, a] = pairs[0]
    return ask(`A square of side a sits in a corner of a larger square of side b (a and b are whole numbers). The L-shaped part of the larger square not covered has area ${N}. What is the area of the larger square?`,
      b * b, [a * a, N, (b + 1) ** 2], `b² ${M} a² = (b ${M} a)(b + a) = ${N}. Whole-number sides need both factors even: ${b - a} × ${b + a}, so b = ${b} and a = ${a}. The larger square's area is ${b * b}.`)
  }),
]
// 12. A semicircle on the axes, a form of question 2. (Added after the list so it can point at question 2.)
T8_NOCALC.push(form(T8_NOCALC[1], function semicircleIntercept() {
  const [w, h, rr] = pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10]]), left = -(rr - w), right = rr + w
  return ask(`A semicircle above the x-axis runs from (${num(left)}, 0) to (${right}, 0). It crosses the y-axis at R(0, b). What is b?`, h, [w, rr, Math.round((right - left) / 4)].filter((x) => x !== h),
    `The centre is (${w}, 0) and the radius is ${rr}. R is ${w} across from the centre, so b = √(${rr}² ${M} ${w}²) = ${h}.`, [h + 1, h - 1])
}))

const money = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(2))

// Practice test 2, section 4 (calculator). Question 6 is left out: it only asks to pick one of four drawn graphs.
const T2_CALC = [
  // 1. A deduction, then a percent off.
  function discountSequence() {
    const D = 10 * r(2, 6), T = 50 * r(2, 6), p = pick([10, 20, 25, 30, 40]), keep = (100 - p) / 100, pp = p / 100
    const e = (a, b) => `${dec(a)}k ${M} ${dec(b)}`
    return ask(`A store takes $${D} off every purchase over $${T}. After that, early shoppers get a further ${p}% off. What does an early shopper pay for a purchase of k dollars, with k > ${T}?`,
      e(keep, D * keep), [e(pp, D * pp), e(pp, D * keep), e(keep, D)], `First take off $${D}: k ${M} ${D}. Then ${p}% off leaves ${100 - p}%: ${dec(keep)}(k ${M} ${D}) = ${e(keep, D * keep)}.`)
  },
  // 2. Map scale.
  form(NO_CALC[6], function mapScale() {
    const c = r(2, 9)
    return ask(`On a map, ${c} centimetres stand for k kilometres. How many kilometres do p centimetres stand for?`, `pk/${c}`, [`${c}pk`, `k/(${c}p)`, `${c}k/p`],
      `One centimetre stands for k/${c} kilometres, so p centimetres stand for p × k/${c} = pk/${c}.`)
  }),
  // 3. Parallel lines with a right angle between them.
  form(CALC[2], function parallelRightAngle() {
    const d = 2 * r(3, 20), a1 = 45 + d / 2
    return ask(`Lines ℓ and m are parallel. A bent path goes from ℓ down to m, turning through a right angle (90°) between them. Angle 1 is between the path and ℓ, and angle 2 is between the path and m, both on the side of the bend. If angle 1 is ${d}° more than angle 2, what is angle 1?`,
      a1, [90 - a1, 45, a1 + 10].filter((x) => x !== a1 && x > 0), `Draw a line through the corner parallel to ℓ and m: it splits the 90° into parts equal to angle 1 and angle 2. So angle 1 + angle 2 = 90 and angle 1 = angle 2 + ${d}. Then 2 × angle 2 = ${90 - d}, angle 2 = ${45 - d / 2}, and angle 1 = ${a1}.`, [a1 - 5])
  }),
  // 4. What the numbers in a model mean.
  function interpretConstant() {
    const S = 10 * r(6, 30), rate = 5 * r(2, 10), name = pick(NAMES), askStart = pick([true, false])
    const opts = [`${name} has already saved $${S}.`, `${name} saves $${S} each week.`, `The computer costs $${S}.`, `${name} has already saved $${rate}.`, `${name} saves $${rate} each week.`, `The computer costs $${rate}.`]
    const right = askStart ? opts[0] : opts[4]
    return ask(`${name} is saving for a computer. The total saved after w weeks is T = ${S} + ${rate}w. What does the number ${askStart ? S : rate} mean?`,
      right, (askStart ? [opts[1], opts[2], opts[3]] : [opts[3], opts[1], opts[5]]), `At w = 0, T = ${S}, so ${S} is what was saved before the weeks start. Each week adds ${rate}, so ${rate} is the amount saved per week.`)
  },
  // 5. A proportion table.
  form(CALC[0], function proportionTable() {
    const k = r(3, 9), n = r(10, 20)
    return ask(`Human age H is directly proportional to dog age D. A chart shows: D = 0 gives H = a, D = 2 gives H = ${2 * k}, D = 4 gives H = ${4 * k}, and D = ${n} gives H = b. What is a + b?`,
      k * n, [k * n + k, 2 * k * n, k * (n - 1)], `Directly proportional means H = kD with no constant, so a = 0. From D = 2, H = ${2 * k}: H = ${k}D. Then b = ${k * n} and a + b = ${k * n}.`)
  }),
  // 7. A fraction condition with a linked pair.
  form(T2_NOCALC[0], function fractionCondition() {
    const q = pick([2, 3]), c = q === 2 ? r(1, 9) : 2 * r(1, 5), b = (2 * c * q) / (2 * (q - 1)), a = 2 * b - c
    return ask(`In the fraction (a ${M} ${c})/(2b), a is ${c} less than two times b. If the fraction equals 1/${q}, what is a?`, dec(a), [dec(b), dec(a + c), dec(2 * b)].filter((x) => x !== dec(a)),
      `a = 2b ${M} ${c}, so a ${M} ${c} = 2b ${M} ${2 * c}. Then (2b ${M} ${2 * c})/(2b) = 1/${q} gives ${q}(2b ${M} ${2 * c}) = 2b, so b = ${dec(b)} and a = ${dec(a)}.`, [dec(a + 1)])
  }),
  // 8. The most items within a budget.
  function maxCount() {
    let B, F, c; do { B = 5 * r(8, 30); F = 5 * r(1, 4); c = r(2, 7) } while ((B - F) % c === 0)
    const n = Math.floor((B - F) / c), name = pick(NAMES)
    return ask(`${name} has $${B} to spend at a fair. Entry is $${F} and each ride costs $${c}. What is the greatest number of rides ${name} can go on?`, n, [n + 1, Math.floor(B / c), Math.round((B + F) / c)].filter((x) => x !== n),
      `Money for rides: ${B} ${M} ${F} = ${B - F}. ${B - F} ÷ ${c} = ${dec((B - F) / c)}, and only whole rides count: ${n}.`, [n - 1])
  },
  // 9. Choose the system of inequalities.
  function inequalitySystemChoice() {
    const p1 = pick([5, 8, 10, 12]), p2 = p1 + pick([2, 5, 10]), N = 50 * r(4, 12), R = 500 * r(2, 8)
    return ask(`A concert sells x tickets at $${p1} and y tickets at $${p2}. At most ${N} tickets can be sold, and ticket money must be at least $${R}. Which system fits?`,
      `${p1}x + ${p2}y ≥ ${R}, x + y ≤ ${N}, x ≥ 0, y ≥ 0`, [`${p1}x + ${p2}y ≤ ${R}, x + y ≤ ${N}, x ≥ 0, y ≥ 0`, `${p1}x + ${p2}y ≤ ${N}, x + y ≥ ${R}, x ≥ 0, y ≥ 0`, `${p1}/x + ${p2}/y ≤ ${N}, x + y ≤ ${R}, x ≥ 0, y ≥ 0`],
      `Money: ${p1}x + ${p2}y must be at least ${R} (≥). Tickets: x + y can be at most ${N} (≤). Ticket numbers cannot be negative.`)
  },
  // 11 and 12. Area inside a fixed length of fence.
  function fenceArea() {
    const P = 4 * r(10, 50), half = P / 2, askF = pick([true, false])
    if (askF) return ask(`A farmer has ${P} feet of fence for a rectangle with length x and width y. Which expression gives the area as a function of x?`, `${half}x ${M} x²`, [`${P}x ${M} x²`, `${half}x + x²`, `${half}x²`],
      `2x + 2y = ${P}, so y = ${half} ${M} x. Area = x(${half} ${M} x) = ${half}x ${M} x².`)
    const y = r(5, half - 5), x = half - y
    return ask(`A farmer uses ${P} feet of fence for a rectangle with length x and width y. If y = ${y}, what is the area in square feet?`, x * y, [y * y, half * y, P * y].filter((v) => v !== x * y),
      `x + y = ${half}, so x = ${x}. Area = ${x} × ${y} = ${x * y}.`, [x * y + 10])
  },
  // 14. Largest area for a perimeter limit.
  function maxRectangleArea() {
    const P = 2 * r(20, 60), strict = pick([true, false]), s = strict ? P / 2 - 1 : P / 2, A = Math.floor(s / 2) * Math.ceil(s / 2)
    return ask(`A rectangle with whole-number sides has a perimeter ${strict ? 'less than' : 'of at most'} ${P} inches. What is the largest possible area, in square inches?`,
      A, [(P / 4) ** 2, strict ? Math.floor(P / 4) ** 2 + P : (P / 2 - 1) ** 2 / 4, A - 1].map((v) => Math.round(v)).filter((v) => v !== A),
      `The sides add to ${strict ? `at most ${s} (the perimeter must be even and below ${P})` : `at most ${s}`}. The area is largest when the sides are as close as possible: ${Math.floor(s / 2)} × ${Math.ceil(s / 2)} = ${A}.`, [A + 1, A + 5])
  },
  // 13. Extend a steady change to a later year.
  form(CALC[0], function percentTrend() {
    const y1 = 1990 + 5 * r(0, 2), gap = 10, v1 = r(100, 250) / 10, step = pick([0.2, 0.3, 0.4, 0.5]) * pick([1, -1]), v2 = v1 + step * gap, y3 = y1 + gap + 5 * r(1, 4), v3 = v2 + step * (y3 - y1 - gap)
    return ask(`The percent of workers over 60 at a factory was ${dec(v1, 1)} in ${y1} and ${dec(v2, 1)} in ${y1 + gap}. If it changes by the same amount every year, what will it be in ${y3}?`,
      dec(v3, 1), [dec(v2 + (v2 - v1), 1), dec(v2 + step, 1), dec(v3 + 1, 1)].filter((x) => x !== dec(v3, 1)), `It changes by (${dec(v2, 1)} ${M} ${dec(v1, 1)})/${gap} = ${dec(step, 2)} a year. From ${y1 + gap} to ${y3} is ${y3 - y1 - gap} years: ${dec(v2, 1)} + ${y3 - y1 - gap} × ${dec(step, 2)} = ${dec(v3, 1)}.`, [dec(v3 - 1, 1)])
  }),
  // 10. A value halfway between two known values.
  form(CALC[0], function linearMidValue() {
    const x1 = r(1, 5), d = r(2, 6), m = r(-4, 5) || 2, c = r(-5, 9), x2 = x1 + 2 * d, x3 = x1 + d, f = (x) => m * x + c
    return ask(`A linear function f has f(${x1}) = ${num(f(x1))} and f(${x2}) = ${num(f(x2))}. What is f(${x3})?`, num(f(x3)), [num(f(x3) + m), num(f(x2) + m * d), num(f(x1) + f(x2))].filter((x) => x !== num(f(x3))),
      `${x3} is halfway between ${x1} and ${x2}, so f(${x3}) is halfway between ${num(f(x1))} and ${num(f(x2))}: ${num(f(x3))}.`, [num(f(x3) - 1)])
  }),
  // 15. Which quadrant holds z².
  form(NO_CALC[1], function complexSquareQuadrant() {
    let a, b; do { a = r(-5, 5); b = r(-5, 5) } while (!a || !b || a * a === b * b)
    const re = a * a - b * b, im = 2 * a * b, q = re > 0 ? (im > 0 ? 'I' : 'IV') : (im > 0 ? 'II' : 'III')
    return ask(`Complex numbers are plotted with the real part across and the imaginary part up. If z = ${num(a)} ${b < 0 ? M : '+'} ${Math.abs(b)}i, which quadrant contains z²?`, `Quadrant ${q}`, ['I', 'II', 'III', 'IV'].filter((x) => x !== q).map((x) => `Quadrant ${x}`),
      `z² = (${num(a)})² ${M} (${Math.abs(b)})² + 2(${num(a)})(${num(b)})i = ${num(re)} ${im < 0 ? M : '+'} ${Math.abs(im)}i. Real part ${re > 0 ? 'positive' : 'negative'}, imaginary part ${im > 0 ? 'positive' : 'negative'}: Quadrant ${q}.`)
  }),
  // 16. Two 30-degree angles stacked in a right triangle.
  form(CALC[27], function stackedAngles() {
    const s = r(1, 3), rt = (k) => `${k === 1 ? '' : k}√3`
    return ask(`Triangle ABD has a right angle at D. C is on BD with CD = ${s} and AD = ${rt(s)}. Angle BAC equals angle CAD. How long is AB?`, rt(2 * s), [String(3 * s), String(2 * s), rt(3 * s)],
      `tan∠CAD = ${s}/${rt(s)} = 1/√3, so ∠CAD = 30° and ∠BAD = 60°. Then BD = AD × √3 = ${3 * s} and AB = √(AD² + BD²) = √(${3 * s * s} + ${9 * s * s}) = ${rt(2 * s)}.`)
  }),
  // 17 and 18. Exponential growth from points on its graph.
  form(CALC[15], function exponentialGraph() {
    const A = pick([500, 1000, 2000]), b = pick([2, 3]), askB = pick([true, false]), n = r(4, 6)
    return askB
      ? ask(`The number of bacteria after x hours is f(x) = ${A} × b^x. Its graph passes through (1, ${A * b}) and (2, ${A * b * b}). What is b?`, b, [A, b + 1, b * b],
        `f(1) = ${A}b = ${A * b}, so b = ${b}. Check: f(2) = ${A} × ${b * b} = ${A * b * b}.`)
      : ask(`The number of bacteria after x hours is f(x) = ${A} × b^x, and the graph passes through (1, ${A * b}) and (2, ${A * b * b}). How many bacteria are there after ${n} hours?`, A * b ** n, [A * b ** (n - 1), A * b * n, A * b ** (n + 1)],
        `b = ${A * b}/${A} = ${b}. f(${n}) = ${A} × ${b}^${n} = ${A * b ** n}.`)
  }),
  // 19. Scale a sample up to the whole group.
  function sampleScale() {
    const n = pick([40, 50, 60, 80, 100]), k = r(5, n / 2), N = n * r(5, 20)
    return ask(`A survey of ${n} students found that ${k} of them chose science as their favourite subject. If the school has ${N} students, about how many would be expected to choose science?`,
      (k * N) / n, [k * (N / 100), N - (k * N) / n, k * 10].map(Math.round).filter((v) => v !== (k * N) / n), `${k} out of ${n} is ${dec((100 * k) / n, 1)}%. ${dec((100 * k) / n, 1)}% of ${N} is ${dec((k * N) / n)}.`, [Math.round((k * N) / n) + 10])
  },
  // 20. Centre of a circle from its expanded equation.
  form(CALC[17], function circleCenterExpanded() {
    const h = r(-5, 5), k = r(-5, 5), c = r(1, 20)
    if (!h && !k) return circleCenterExpanded()
    const xs = h ? `x² ${h > 0 ? M : '+'} ${Math.abs(2 * h)}x` : 'x²', ys = k ? `y² ${k > 0 ? M : '+'} ${Math.abs(2 * k)}y` : 'y²'
    return ask(`${xs} + ${ys} = ${c}. This is the equation of a circle. What is its centre?`, pt(h, k), [pt(-h, -k), pt(2 * h, 2 * k), pt(h, -k)].filter((x) => x !== pt(h, k)),
      `Complete the squares: (x ${M} ${num(h)})² + (y ${M} ${num(k)})² = ${c + h * h + k * k}. The centre is ${pt(h, k)}.`, [pt(k, h), pt(h + 1, k)])
  }),
  // 21. Intercept of a perpendicular line through a point.
  form(NO_CALC[14], function perpendicularIntercept() {
    let x0, y0, X, s, b; do { x0 = r(1, 4); y0 = r(1, 5); X = x0 + r(1, 4); s = (X - x0) / y0; b = y0 - s * x0 } while (!Number.isInteger(b))
    return ask(`Line ℓ passes through P(${x0}, ${y0}) and (${X}, 0). Line m has the equation y = ax + b, is perpendicular to ℓ and passes through P. What is b?`, num(b), [num(-b), num(y0), dec(b + s)].filter((x) => x !== num(b)),
      `Line ℓ has slope ${M}${y0}/${X - x0}, so line m has slope ${frac(X - x0, y0)}. Through P: ${y0} = ${frac(X - x0, y0)} × ${x0} + b, so b = ${num(b)}.`, [num(b - 1), num(b + 2)])
  }),
  // 22. Solve an exponent, then use it.
  form(NO_CALC[13], function powerFromExponent() {
    const a = pick([2, 3]), k = r(1, 4), c = r(1, 4), E = a * k - c
    if (E < 1) return powerFromExponent()
    return ask(`2^(${a}k ${M} ${c}) = ${2 ** E}. What is the value of 2^k?`, 2 ** k, [2 ** (k + 1), k, 2 ** E].filter((v) => v !== 2 ** k),
      `${2 ** E} = 2^${E}, so ${a}k ${M} ${c} = ${E} and k = ${k}. Then 2^k = ${2 ** k}.`, [2 ** k + 2])
  }),
  // 23. Which statement about f and |f| is true.
  form(CALC[24], function absStatement() {
    const xs = [-3, 0, 2, 4, 6], ys = [3, 1, r(-4, -2), 0, 5]
    const f = (x) => { for (let i = 0; i < 4; i++) if (x >= xs[i] && x <= xs[i + 1]) return ys[i] + ((ys[i + 1] - ys[i]) * (x - xs[i])) / (xs[i + 1] - xs[i]) }
    const neg = pick([2, 2.5, 3]), pos = pick([-2, -1, 5]), any = pick([0, -2.5])
    return ask(`The graph of f is made of straight pieces joining ${xs.map((x, i) => pt(x, ys[i])).join(', ')}. Which of the following is true?`,
      `f(${neg}) < |f(${neg})|`, [`f(${num(pos)}) < |f(${num(pos)})|`, `f(${num(any)}) > |f(${num(any)})|`, `f(${neg}) > |f(${neg})|`],
      `f(x) < |f(x)| only when f(x) is negative. f(${neg}) = ${dec(f(neg))}, which is negative. f(x) > |f(x)| is never true, and f(${num(pos)}) is not negative.`)
  }),
  // 24. A downward parabola and a horizontal line that miss each other.
  form(T6_NOCALC[13], function parabolaNoSolution() {
    const n = pick([2, 4, 5, 10]), c = r(2, 9)
    return ask(`y = ${M}(1/${n})x² + k and y = ${c}. In this system k is a constant. For which value of k does the system have no real solution?`, dec(c - r(1, 20) / 10, 2), [String(c + r(1, 5)), String(c), dec(c + 3.5)],
      `The parabola opens downward with its highest point at y = k. It misses the line y = ${c} only when k < ${c}.`)
  }),
  // 25. Shaded area in a rectangle with midpoints.
  function rectangleMidpointShaded() {
    const A = r(2, 15)
    return ask(`In rectangle ABCD, E is the midpoint of BC and F is the midpoint of CD. Triangle CEF has area ${A}. What is the area of the region inside triangle BCD but outside triangle CEF?`, 3 * A, [4 * A, 2 * A, 8 * A],
      `CEF has half the width and half the height of the rectangle, so its area is 1/8 of the rectangle: the rectangle is ${8 * A}. Triangle BCD is half: ${4 * A}. Without CEF: ${4 * A} ${M} ${A} = ${3 * A}.`)
  },
  // 26. x² + y² from x − y and xy.
  form(T3_NOCALC[1], function sumSquaresFromDiff() {
    let x, y; do { x = r(-3, 9); y = r(-6, 6) } while (x === y || x * y === 0)
    const sum = pick([true, false]), d = sum ? x + y : x - y, p = x * y, ans = sum ? d * d - 2 * p : d * d + 2 * p
    return ask(`x ${sum ? '+' : M} y = ${num(d)} and xy = ${num(p)}. What is x² + y²?`, ans, [d * d, d * d + p, sum ? d * d + 2 * p : d * d - 2 * p].filter((v) => v !== ans),
      `(x ${sum ? '+' : M} y)² = x² + y² ${sum ? '+' : M} 2xy. So x² + y² = ${d * d} ${sum ? M : '+'} 2(${num(p)}) = ${ans}.`, [ans + 1])
  }),
  // 27. Fourth corner of a parallelogram.
  function parallelogramVertex() {
    const A = [r(-5, 0), r(-6, 0)], B = [A[0] + r(2, 5), A[1] - r(1, 4)], D = [A[0] + r(1, 4), A[1] + r(4, 12)], C = [B[0] + D[0] - A[0], B[1] + D[1] - A[1]]
    return ask(`ABCD is a parallelogram (corners in that order) with A${pt(...A)}, B${pt(...B)} and D${pt(...D)}. What are the coordinates of C?`, pt(...C),
      [pt(A[0] + D[0] - B[0], A[1] + D[1] - B[1]), pt(A[0] + B[0] - D[0], A[1] + B[1] - D[1]), pt(C[0] + 1, C[1] - 1)],
      `In a parallelogram, going from A to B is the same move as going from D to C. A to B moves (${num(B[0] - A[0])}, ${num(B[1] - A[1])}), so C = D + that move = ${pt(...C)}.`)
  },
  // 28. Largest value inside a circle with a limit.
  function maxUnderCircle() {
    const [a, h, R] = pick([[4, 3, 5], [3, 4, 5], [12, 5, 13], [5, 12, 13], [8, 6, 10], [6, 8, 10]])
    return ask(`a² + b² ≤ ${R * R} and b ≥ ${h}. What is the greatest possible value of a?`, a, [num(-a), h, R].filter((x) => x !== a),
      `b is at least ${h}, so b² is at least ${h * h}. Then a² ≤ ${R * R} ${M} ${h * h} = ${a * a}, so a ≤ ${a}.`, [a + 1])
  },
  // 29. From an equilateral triangle to a square on the same side.
  form(T2_NOCALC[7], function equilateralToSquare() {
    const s = 2 * r(2, 8), k = (s * s) / 4
    return ask(`A square and an equilateral triangle share one side. If the triangle's area is ${k}√3 square inches, what is the area of the square?`, s * s, [`${2 * k}√3`, String(k * 4 + 4 * s), `${s * s}√3`],
      `An equilateral triangle of side s has area (√3/4)s². So s²/4 = ${k}, s² = ${s * s}, and the square's area is ${s * s}.`)
  }),
  // 30. Average speed from points on a distance graph.
  form(CALC[18], function averageSpeedGraph() {
    const ts = [0, 1, 2, 3, 4, 5, 6, 7, 8], ds = [0]; for (let i = 1; i < 9; i++) ds.push(ds[i - 1] + 10 * r(4, 10))
    const t1 = r(1, 4), t2 = t1 + r(2, 4), v = (ds[t2] - ds[t1]) / (t2 - t1)
    return ask(`A car's distance travelled (miles) after t hours is read from a graph: ${ts.map((t, i) => `t = ${t}: ${ds[i]}`).join(', ')}. What is its average speed, in miles per hour, from t = ${t1} to t = ${t2}?`,
      dec(v), [dec(ds[t2] / t2), dec((ds[t2] - ds[t1]) / t2), 'It cannot be determined from the given information.'].filter((x) => x !== dec(v)), `Average speed = change in distance ÷ change in time = (${ds[t2]} ${M} ${ds[t1]})/(${t2} ${M} ${t1}) = ${dec(v)}.`, [dec(v + 5)])
  }),
  // 31. Distance at a steady rate.
  form(NO_CALC[6], function bikeRate() {
    const d = 5 * r(4, 12), h = r(2, 5), t = r(3, 9) + 0.5, name = pick(NAMES)
    return ask(`${name} rides ${d} miles in ${h} hours. At this rate, how many miles can ${name} ride in ${Math.floor(t)} hours and 30 minutes?`, dec((d / h) * t), [dec((d / h) * Math.floor(t)), dec(d * t / 2), dec((d / h) * (t + 1))],
      `${name} rides ${dec(d / h)} miles per hour. ${Math.floor(t)} hours 30 minutes is ${t} hours: ${dec(d / h)} × ${t} = ${dec((d / h) * t)} miles.`)
  }),
  // 32. Consecutive odd or even numbers.
  function consecutiveNumbers() {
    const odd = pick([true, false]), n = r(4, 9), first = 2 * r(1, 20) + (odd ? 1 : 0), last = first + 2 * (n - 1), avg = (first + last) / 2, askMax = pick([true, false])
    return ask(`The average of ${n} consecutive ${odd ? 'odd' : 'even'} integers is ${dec(avg)}. What is the ${askMax ? 'greatest' : 'smallest'} of them?`, askMax ? last : first,
      askMax ? [last - 2, last + 2, avg + n] : [first + 2, first - 2, avg - n].filter((v) => v !== first), `They are spaced 2 apart and centred on ${dec(avg)}. The ${n} numbers run from ${first} to ${last}.`)
  },
  // 33. A composition of functions.
  function compositionValue() {
    const m = pick([1, 2, 3]), c = r(-4, 4), d = r(1, 5), kk = r(1, 4), w = kk * kk - d, v = m * w + c
    return ask(`f(x) = ${coef(m)}x${c ? tail(c) : ''} and g(x) = x² ${M} ${d}. If f(g(k)) = ${num(v)}, what is |k|?`, kk, [kk * kk, Math.abs(w) || kk + 2, kk + 1].filter((x) => x !== kk),
      `f(g(k)) = ${m === 1 ? '' : m}g(k)${c ? tail(c) : ''} = ${num(v)}, so g(k) = ${num(w)}. Then k² ${M} ${d} = ${num(w)}, k² = ${kk * kk} and |k| = ${kk}.`, [kk + 2])
  },
  // 34. Axis of symmetry fixes a coefficient.
  form(CALC[26], function axisOfSymmetry() {
    const a = r(1, 6), h = r(-4, 5) || 2, c = r(-9, 9)
    return ask(`In the xy-plane, the line x = ${num(h)} is the axis of symmetry of f(x) = ${coef(a)}x² ${M} kx${c ? tail(c) : ''}. What is k?`, num(2 * a * h), [num(a * h), num(-2 * a * h), num(2 * h)].filter((x) => x !== num(2 * a * h)),
      `The axis of ax² + bx + c is x = ${M}b/(2a). Here b = ${M}k, so x = k/${2 * a} = ${num(h)} and k = ${num(2 * a * h)}.`, [num(2 * a * h + a)])
  }),
  // 35. Mixing two solutions.
  function mixturePercent() {
    let a, b, p, q, m; do { a = 10 * r(1, 6); b = 10 * r(1, 6); p = 5 * r(1, 6); q = 5 * r(1, 8); m = (a * p + b * q) / (a + b) } while (p === q || !Number.isInteger(m * 2))
    return ask(`${a} grams of solution P is ${p}% salt and ${b} grams of solution Q is ${q}% salt. If they are mixed, what percent of the mixture is salt?`, dec(m), [dec((p + q) / 2), dec(p + q), dec((a * p + b * q) / 100)].filter((x) => x !== dec(m)),
      `Salt: ${a} × ${p / 100} + ${b} × ${q / 100} = ${dec((a * p + b * q) / 100)} grams in ${a + b} grams. ${dec((a * p + b * q) / 100)}/${a + b} = ${dec(m)}%.`, [dec(m + 1)])
  },
  // 36. Radius of a circle inside a right triangle.
  function incircleRadius() {
    const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]), k = pick([1, 2]), A = a * k, B = b * k, C = c * k, rr = (A + B - C) / 2
    return ask(`A circle fits inside right triangle PQR, touching all three sides. The legs are PQ = ${A} and PR = ${B}. What is the radius of the circle?`, rr, [C / 2, dec((A * B) / C), rr + 1].map(String).filter((x) => x !== String(rr)),
      `The hypotenuse is ${C}. For a right triangle the inside circle's radius is (leg + leg ${M} hypotenuse)/2 = (${A} + ${B} ${M} ${C})/2 = ${rr}. (Check: area ${(A * B) / 2} = radius × half the perimeter = ${rr} × ${(A + B + C) / 2}.)`)
  },
  // 37 and 38. A linear cost from two known costs.
  form(CALC[0], function linearCostTwoPoints() {
    const fixed = r(5, 25), rate = pick([0.25, 0.5, 0.75, 1, 1.5]), m1 = 5 * r(2, 6), m2 = m1 + 5 * r(1, 4), m3 = m2 + 5 * r(1, 3), askFixed = pick([true, false])
    const c1 = fixed + rate * m1, c2 = fixed + rate * m2
    return ask(`An internet call costs a fixed charge plus a charge per minute. A ${m1}-minute call costs $${money(c1)} and a ${m2}-minute call costs $${money(c2)}. ${askFixed ? 'What is the fixed charge, in dollars?' : `What does a ${m3}-minute call cost, in dollars?`}`,
      dec(askFixed ? fixed : fixed + rate * m3), askFixed ? [dec(rate), dec(c1 - rate), dec(c1 / m1)] : [dec(rate * m3), dec((c2 / m2) * m3), dec(c2 + rate)],
      `Per minute: (${money(c2)} ${M} ${money(c1)})/(${m2} ${M} ${m1}) = ${dec(rate)}. Fixed: ${money(c1)} ${M} ${m1} × ${dec(rate)} = ${fixed}.${askFixed ? '' : ` A ${m3}-minute call: ${fixed} + ${m3} × ${dec(rate)} = ${dec(fixed + rate * m3)}.`}`)
  }),
]

// Practice test 3, section 4 (calculator). Question 33 is left out: it cannot be stated clearly without its drawing.
const T3_CALC = [
  // 1. Reading a distance-time graph.
  function tripGraph() {
    const go = 20 * r(1, 3), stay = 10 * r(2, 5), back = 10 * r(1, 3), shop = 10 * r(1, 2), home = 10 * r(1, 3), D = r(3, 8), mid = r(1, D - 1)
    const t = [0, go, go + stay, go + stay + back, go + stay + back + shop, go + stay + back + shop + home], d = [0, D, D, mid, mid, 0]
    const clock = (m) => `${1 + Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`
    return ask(`A cyclist leaves home at 1:00 to ride to the library, then rides to a shop, then rides home. A graph of distance from home shows these points, joined by straight lines: ${t.map((m, i) => `${clock(m)} → ${d[i]} miles`).join(', ')}. How many minutes did the cyclist stay at the library?`,
      stay, [shop, go, stay + 10].filter((x) => x !== stay), `The library is the farthest point, ${D} miles. The distance stays at ${D} from ${clock(go)} to ${clock(go + stay)}: ${stay} minutes.`, [stay - 10, stay + 20])
  },
  // 2. Find one letter from a linked equation.
  form(T3_NOCALC[1], function linkedEquation() {
    const p = r(1, 5), q = r(3, 12), k = r(2, 9) * 5, h = k - p
    return ask(`If ${p}/k = ${q} and ${q}k + h = ${k}, what is h?`, h, [k + p, k - q, q * p].filter((x) => x !== h), `${p}/k = ${q} means ${q}k = ${p}. So ${p} + h = ${k} and h = ${h}.`, [h + 1])
  }),
  // 3. A rule for the next entry in a linear table.
  form(CALC[0], function tableRule() {
    const m = r(2, 6), c = r(-4, 6)
    const xs = [-1, 0, 1, 2], rule = `b = ${m}a${tail(c)}`
    return ask(`A linear function f has ${xs.map((x) => `f(${num(x)}) = ${num(m * x + c)}`).join(', ')}, and f(a) = b. Which equation gives b?`, rule,
      [`b = a${tail(c)}`, `b = ${m}a${tail(c + m)}`, `b = ${m + 1}a${tail(c)}`], `f goes up by ${m} each time n goes up by 1, and f(0) = ${num(c)}. So f(n) = ${m}n${tail(c)} and ${rule}.`)
  }),
  // 4. A conditional probability from a two-way table.
  form(T2_NOCALC[18], function conditionalTable() {
    let MA, MT, FM, T, FT, FA, A; do { MA = 5 * r(3, 10); MT = MA + 5 * r(2, 8); FM = 5 * r(2, 8); T = MT + FM + 5 * r(2, 8); FT = T - MT; FA = FT - FM; A = MA + FA } while (FA <= 0)
    return ask(`${T} students chose Art or Music. ${MA} boys chose Art, ${MT} students are boys, and ${FM} girls chose Music. If a student who chose Art is picked at random, what is the probability that it is a girl?`,
      frac(FA, A), [frac(FA, T), frac(FA, FT), frac(MA, A)].filter((x) => x !== frac(FA, A)), `Girls: ${T} ${M} ${MT} = ${FT}. Girls who chose Art: ${FT} ${M} ${FM} = ${FA}. All Art students: ${MA} + ${FA} = ${A}. Probability = ${FA}/${A} = ${frac(FA, A)}.`, [frac(FA + 1, A), frac(FM, T), frac(A, T), frac(FA, MT)])
  }),
  // 5 and 6. Mean or biggest change from paired scores.
  form(CALC[7], function pairedScores() {
    const n = r(6, 9), t1 = [...Array(n)].map(() => 10 * r(4, 10)), t2 = t1.map(() => 10 * r(4, 10)), askMean = pick([true, false])
    const mean = t1.reduce((a, b) => a + b, 0) / n, change = Math.max(...t1.map((v, i) => Math.abs(v - t2[i])))
    return ask(`${n} students took two tests. Their (test 1, test 2) scores are ${t1.map((v, i) => pt(v, t2[i])).join(', ')}. ${askMean ? 'What is the mean score on test 1 (to 2 decimal places where needed)?' : 'What is the greatest change in one student’s score from test 1 to test 2?'}`,
      askMean ? dec(mean) : change, askMean ? [dec(t2.reduce((a, b) => a + b, 0) / n), dec(mean + 2.5), dec(mean - 3)] : [change + 10, change - 10, Math.max(...t1) - Math.min(...t2)].filter((x) => x !== change && x > 0),
      askMean ? `Add the test 1 scores: ${t1.reduce((a, b) => a + b, 0)}. Divide by ${n}: ${dec(mean)}.` : `Work out |test 2 ${M} test 1| for each student. The largest is ${change}.`, [change + 20])
  }),
  // 7. Meaning of the rate in a model.
  form(T2_CALC[3], function interpretRate() {
    const rate = pick([0.1, 0.2, 0.3, 0.5]), start = r(5, 20), y0 = 2000 + 5 * r(0, 4)
    return ask(`A bird's average lifespan, in years, is modelled by L = ${rate}(t ${M} ${y0}) + ${start}, where t is the year. What does the number ${rate} mean?`,
      `The lifespan goes up by ${rate} years each year after ${y0}.`, [`The lifespan in ${y0} was ${rate} years.`, `The lifespan goes up by ${rate} years every 10 years.`, `The lifespan goes down by ${rate} years each year after ${y0}.`],
      `${rate} multiplies (t ${M} ${y0}), the number of years after ${y0}, so each extra year adds ${rate} to L. At t = ${y0}, L = ${start}.`)
  }),
  // 8. Diameter from an expanded circle equation.
  form(CALC[17], function circleDiameter() {
    const h = r(-4, 4), k = r(-4, 4), R2 = pick([5, 10, 13, 20, 8, 18]), c = R2 - h * h - k * k
    const xs = h ? `x² ${h > 0 ? M : '+'} ${Math.abs(2 * h)}x` : 'x²', ys = k ? `y² ${k > 0 ? M : '+'} ${Math.abs(2 * k)}y` : 'y²'
    const root = (n) => { for (let s = 10; s > 1; s--) if (n % (s * s) === 0) return `${s === 1 ? '' : s}√${n / (s * s)}`.replace('√1', ''); return `√${n}` }
    return ask(`${xs} + ${ys}${tail(-c)} = 0 is the equation of a circle. What is its diameter?`, `2${root(R2)}`.replace(/^2(\d+)√/, (m, d) => `${2 * d}√`), [root(R2), String(R2), String(2 * R2)],
      `Complete the squares: (x ${M} ${num(h)})² + (y ${M} ${num(k)})² = ${R2}. The radius is √${R2}, so the diameter is 2√${R2}.`)
  }),
  // 9. Combine two equations instead of solving.
  function systemCombination() {
    let a, b, x, y; do { a = r(2, 6); b = r(1, 5); x = r(-3, 8); y = r(-3, 8) } while (a === b || (x + y) === 0)
    const C1 = x - a * y, C2 = a * x - y
    return ask(`x ${M} ${a}y = ${num(C1)} and ${a}x ${M} y = ${num(C2)}. What is x + y?`, num(x + y), [num(x - y), num((C1 + C2) / 2), num(C2 - C1)].filter((v) => v !== num(x + y)),
      `Subtract the first equation from the second: (${a}x ${M} y) ${M} (x ${M} ${a}y) = ${a - 1}x + ${a - 1}y = ${num(C2 - C1)}. Divide by ${a - 1}: x + y = ${num(x + y)}.`, [num(x + y + 1)])
  },
  // 10. A power of a power.
  form(NO_CALC[13], function powerOfPower() {
    const p = pick([2, 3, 4]), q = pick([3, 5]), k = q * r(-3, -1), e = (k * p) / q
    return ask(`If a > 0 and (a^k)^(${p}/${q}) = 1/a^${-e}, what is k?`, num(k), [num(-k), num(e), num(k + q)].filter((x) => x !== num(k)),
      `(a^k)^(${p}/${q}) = a^(${p}k/${q}) and 1/a^${-e} = a^(${num(e)}). So ${p}k/${q} = ${num(e)} and k = ${num(k)}.`, [num(k - 1)])
  }),
  // 11. Similar triangles across a lake.
  form(NO_CALC[18], function lakeWidth() {
    const DE = r(4, 9), CD = r(6, 15), k = pick([20, 25, 40, 50]), BE = DE * k, AB = CD * k
    return ask(`To measure a lake's length AB, a surveyor draws lines AD and BC that cross at E, with AB parallel to CD. DE = ${DE} feet, CD = ${CD} feet and BE = ${BE} feet. How long is the lake?`, AB, [BE + CD, (BE * DE) / CD, CD * DE].map(Math.round).filter((x) => x !== AB),
      `Triangles ABE and DCE are similar (AB ∥ CD). BE matches DE, and AB matches CD: AB/${CD} = ${BE}/${DE}, so AB = ${AB}.`, [AB + 50])
  }),
  // 12. Collect like terms and factor.
  function factorCommon() {
    // Built so the x²y terms leave exactly −x²y, as in the source question.
    const s = r(2, 5), p = s - 1, q = r(1, 5), t = r(2, 6), u = r(1, 5), w = q + t
    return ask(`Which of the following is equal to ${p === 1 ? '' : p}x²y ${M} ${q === 1 ? '' : q}xy² ${M} xy(${s}x + ${t}y ${M} ${u})?`,
      `${M}xy(x + ${w}y ${M} ${u})`, [`xy(x ${M} ${w}y ${M} ${u})`, `xy(x + ${w}y ${M} ${u})`, `${M}xy(x ${M} ${w}y + ${u})`],
      `Expand the bracket: ${M}${s}x²y ${M} ${t}xy² + ${u}xy. Add the first two terms: ${p}x²y ${M} ${s}x²y = ${M}x²y and ${M}${q}xy² ${M} ${t}xy² = ${M}${w}xy². So the total is ${M}x²y ${M} ${w}xy² + ${u}xy = ${M}xy(x + ${w}y ${M} ${u}).`)
  },
  // 13. Arc of a circle from a tangent.
  form(T2_NOCALC[17], function tangentArc() {
    const rr = r(2, 12), rt = (k) => `${k}√3`
    return ask(`PT is tangent to a circle with centre O at T. OP meets the circle at M. Angle OPT is 30° and TP = ${rt(rr)}. How long is the minor arc TM?`, `${frac(rr, 3)}π`.replace(/^(\d+)\//, '$1/').replace(/^(\d+\/\d+)π$/, '($1)π'),
      [`${frac(2 * rr, 3)}π`.replace(/^(\d+\/\d+)π$/, '($1)π'), `${rr}π`, `${frac(rr, 6)}π`.replace(/^(\d+\/\d+)π$/, '($1)π')],
      `OT is a radius and meets the tangent at 90°. With angle P = 30°, OT = TP/√3 = ${rr}, and angle TOP = 60° = π/3. Arc TM = ${rr} × π/3.`, [`${rr + 1}π`])
  }),
  // 14. Split a total by a ratio.
  function ratioSum() {
    const a = r(1, 5), b = r(a + 1, 9), k = r(2, 9), total = (a + b) * k, s = r(2, Math.min(20, total - 1))
    return ask(`Two numbers are in the ratio ${a}:${b}. If ${s} is taken away from their sum, the result is ${total - s}. What is the average of the two numbers?`, dec(total / 2), [dec(total), dec((total - s) / 2), dec(b * k)].filter((x) => x !== dec(total / 2)),
      `The sum is ${total - s} + ${s} = ${total}, and the average of two numbers is half their sum: ${dec(total / 2)}. (The numbers are ${a * k} and ${b * k}.)`, [dec(total / 2 + 1)])
  },
  // 15. Area of the triangle cut off by a line.
  form(CALC[16], function lineTriangleArea() {
    return ask('f(x) = mx − m, with m > 0. Its graph crosses the y-axis at P and the x-axis at R. O is the origin. Which expression gives the area of triangle OPR?', 'm/2', ['m', 'm²/2', 'm²'],
      'At x = 0, y = −m, so OP = m. At y = 0, mx = m, so x = 1 and OR = 1. Area = (1/2)(1)(m) = m/2.')
  }),
  // 16. One pipe fills while another empties.
  form(CALC[30], function fillAndEmpty() {
    let a, b, T; do { a = r(2, 6); b = r(a + 1, 12); T = (a * b) / (b - a) } while (!Number.isInteger(T * 2))
    return ask(`Pipe S fills a tank in ${a} hours. Pipe U empties it in ${b} hours. With both open, how many hours does it take to fill the empty tank?`, dec(T), [dec((a * b) / (a + b)), String(b - a), String(a + b)].filter((x) => x !== dec(T)),
      `Each hour: 1/${a} filled, 1/${b} emptied, so 1/${a} ${M} 1/${b} = ${frac(b - a, a * b)} of the tank. Time = ${dec(T)} hours.`, [dec(T + 1)])
  }),
  // 17. Solve a reciprocal formula.
  form(T5_NOCALC[8], function reciprocalFormula() {
    return ask('1/R + 1/S = 1/T. Which of the following gives S in terms of R and T?', 'S = RT/(R − T)', ['S = (R − T)/(RT)', 'S = (T − R)/(RT)', 'S = RT/(T − R)'],
      '1/S = 1/T − 1/R = (R − T)/(RT). Flip both sides: S = RT/(R − T).')
  }),
  // 18. How long an object stays above a height.
  form(CALC[8], function timeAbove() {
    let p, q; do { p = r(1, 4); q = r(p + 1, 7) } while (false)
    const a = pick([4, 5, 6, 16]), B = a * (p + q), H = a * p * q
    return ask(`h(t) = ${B}t ${M} ${a}t² gives the height, in feet, of an object t seconds after it is thrown up. For how many seconds is the object higher than ${H} feet?`, q - p, [q, p + q, (p + q) / 2].filter((x) => x !== q - p),
      `${B}t ${M} ${a}t² > ${H} means t² ${M} ${p + q}t + ${p * q} < 0, so (t ${M} ${p})(t ${M} ${q}) < 0: ${p} < t < ${q}. That is ${q - p} seconds.`, [q - p + 1])
  }),
  // 19 and 20. Two club plans read from a graph.
  form(T5_NOCALC[11], function clubPlans() {
    const fee = 50 * r(2, 6), rb = 5 * r(6, 12), ra = rb + 5 * r(2, 6), m = fee / (ra - rb)
    if (!Number.isInteger(m)) return clubPlans()
    const askRate = pick([true, false])
    return ask(`Club A charges $${ra} a month and no joining fee. Club B charges a $${fee} joining fee plus a monthly charge; after 12 months its total is $${fee + 12 * rb}. ${askRate ? 'What is club B’s monthly charge, in dollars?' : 'What is the total cost, in dollars, when both clubs cost the same?'}`,
      askRate ? rb : ra * m, askRate ? [Math.round((fee + 12 * rb) / 12), ra, rb + 5] : [fee + rb * 12, ra * (m + 1), fee * 2].filter((x) => x !== ra * m),
      `Club B: (${fee + 12 * rb} ${M} ${fee})/12 = ${rb} a month. Equal when ${ra}m = ${fee} + ${rb}m: m = ${m} months, total $${ra * m}.`, [ra * m + 10])
  }),
  // 21. Which constants make a parabola miss a line.
  form(T6_NOCALC[13], function parabolaMissChoice() {
    const c = r(2, 9), h = r(1, 4), pair = (a, b) => `a = ${num(a)} and b = ${num(b)}`
    const right = pick([[r(1, 3), c + r(1, 5)], [-r(1, 3), c - r(1, 5)]])
    return ask(`y = a(x ${M} ${h})² + b and y = ${c}. For which values of a and b does this system have no solution?`, pair(...right),
      [pair(r(1, 3), c - r(1, 5)), pair(r(1, 3), c), pair(-r(1, 3), c + r(1, 5))], `The parabola's vertex is at height b. If a > 0 it opens up, so it misses y = ${c} only when b > ${c}. If a < 0 it opens down and misses only when b < ${c}.`)
  }),
  // 22. A constant from a difference of two values.
  form(CALC[18], function differenceConstant() {
    const t1 = pick([0.1, 0.2, 1]), t2 = t1 * pick([2, 3]), a = pick([100, 160, 200, 240, 16]), H = 30, diff = a * (t2 * t2 - t1 * t1)
    return ask(`An apple falls from a branch ${H} feet up. Its height after t seconds is D(t) = ${H} ${M} at². If D(${t1}) ${M} D(${t2}) = ${dec(diff)}, what is a?`, a, [Math.round(diff / (t2 - t1)), Math.round(diff / (t2 * t2)), a + 40],
      `D(${t1}) ${M} D(${t2}) = a(${t2}² ${M} ${t1}²) = ${dec(t2 * t2 - t1 * t1, 4)}a = ${dec(diff)}, so a = ${a}.`)
  }),
  // 23. Mean, median and mode statements.
  function meanMedianMode() {
    let v, mean, med, mode; do {
      v = [...Array(6)].map(() => 5 * r(1, 8)); v[r(0, 5)] = v[r(0, 5)]
      const s = [...v].sort((a, b) => a - b); mean = v.reduce((a, b) => a + b, 0) / 6; med = (s[2] + s[3]) / 2
      const cnt = {}; v.forEach((x) => { cnt[x] = (cnt[x] || 0) + 1 }); const top = Math.max(...Object.values(cnt)); const modes = Object.keys(cnt).filter((k) => cnt[k] === top)
      mode = top > 1 && modes.length === 1 ? Number(modes[0]) : null
    } while (mode == null)
    const t = [mean === med, mean === mode, med === mode]
    if (!t.some(Boolean)) return meanMedianMode()
    const right = romanLabel(t)
    return ask(`Daily high temperatures for 6 days were ${v.join(', ')}. Which of these are true? I. mean = median II. mean = mode III. median = mode`, right, romanWrong(right),
      `Mean = ${dec(mean)}, median = ${dec(med)}, mode = ${mode}. So the true ones are ${right.replace(' only', '')}.`)
  },
  // 24. sin a = cos b in a right triangle.
  form(T5_NOCALC[3], function sinCosRightAngle() {
    return ask('In triangle DEF, the angles at E, F and D are a°, b° and c°. If sin(a°) = cos(b°) and a ≠ b, which of the following must be true?', 'c = 90', ['a = b', 'a > b', 'a = 60'],
      'sin(a°) = cos(b°) happens when a + b = 90 (complementary angles). Then c = 180 − 90 = 90.')
  }),
  // 25. A class size that keeps every part whole.
  function divisibilityCount() {
    const [f1, f2, f3] = pick([[[2, 3], [2, 5], [1, 3]], [[3, 4], [1, 3], [1, 2]], [[1, 2], [3, 5], [2, 3]], [[2, 5], [1, 2], [1, 3]]])
    // Every group (girls, senior girls, senior girls who passed) must be a whole number, so the class size must make
    // each running product a whole number: it is a multiple of each running product's denominator.
    const den = (n, d) => d / gcd(n, d), lcm = (a, b) => (a * b) / gcd(a, b)
    const need = [den(f1[0], f1[1]), den(f1[0] * f2[0], f1[1] * f2[1]), den(f1[0] * f2[0] * f3[0], f1[1] * f2[1] * f3[1])].reduce(lcm)
    const good = need * r(1, 3), bad = [good + need / 3, good - need / 2, good + need / 5, good + 1, good - 1].map(Math.round).filter((x) => x > 0 && x % need !== 0)
    return ask(`In a class, ${f1[0]}/${f1[1]} of the students are girls, ${f2[0]}/${f2[1]} of the girls are seniors, and ${f3[0]}/${f3[1]} of the senior girls passed a test. Which could be the number of students in the class?`, good, bad,
      `The girls who passed are ${f1[0]}/${f1[1]} × ${f2[0]}/${f2[1]} × ${f3[0]}/${f3[1]} = ${frac(f1[0] * f2[0] * f3[0], f1[1] * f2[1] * f3[1])} of the class, and every group must be a whole number of students. The class size must be a multiple of ${need}: ${good} works.`, [good + 1, good + 2])
  },
  // 26. A cone on a cylinder.
  form(CALC[34], function coneOnCylinder() {
    const V = r(300, 3000), k = pick([1, 2, 3])
    const cone = (V * k) / 3, total = V + cone
    return ask(`A silo is a cylinder with a cone on top. They have the same radius, and the cone is ${k === 1 ? 'as tall as' : `${k} times as tall as`} the cylinder. If the cylinder holds ${V} cubic feet, what is the volume of the silo, in cubic feet (to 2 decimal places where needed)?`,
      dec(total), [dec(V * 2), dec(V + V * k), dec(V + V / 3)].filter((x) => x !== dec(total)), `A cone holds 1/3 of a cylinder with the same base and height. This cone is ${k} times as tall, so it holds ${k}/3 × ${V} = ${dec(cone)}. Total: ${dec(total)}.`, [dec(total + 10)])
  }),
  // 27. Count the integers where a quadratic is negative.
  form(CALC[4], function negativeCount() {
    const p = r(-3, 2), q = p + r(3, 8)
    return ask(`k = ${poly([1, -(p + q), p * q])}. For how many integers x is k negative?`, q - p - 1, [q - p, q - p + 1, q - p - 2].filter((x) => x >= 0),
      `k = (x ${p < 0 ? '+' : M} ${Math.abs(p)})(x ${M} ${q})${p === 0 ? '' : ''} is negative between its roots, ${num(p)} < x < ${q}. The integers strictly between are ${q - p - 1} in number.`, [q - p + 2])
  }),
  // 28. Two rectangles inside a square.
  function rectanglesInSquare() {
    const [p, q] = pick([[5, 2], [3, 1], [4, 1], [7, 3]]), g = r(2, 5)
    const k = (3 * g - 2 * g) / (p - 2 * q), side = p * k + 2 * g
    if (!(k > 0) || !Number.isInteger(k)) return rectanglesInSquare()
    return ask(`Two identical rectangles, each a tall by b wide, stand side by side inside a square. The gaps between the rectangles and the square's sides, and between the two rectangles, are all ${g} inches. If a : b = ${p} : ${q}, what is the area of the square?`,
      side * side, [(side - g) ** 2, (side + g) ** 2, side * 4],
      `Across: 3 gaps + 2b = ${3 * g} + 2b. Up: 2 gaps + a = ${2 * g} + a. They are equal (a square). With a = ${p}k and b = ${q}k: ${3 * g} + ${2 * q}k = ${2 * g} + ${p}k, so k = ${k}, the side is ${side} and the area is ${side * side}.`)
  },
  // 29. Area between two cuts in a right triangle.
  form(T5_NOCALC[19], function stripInTriangle() {
    const n = pick([3, 4]), i = r(1, n - 2), T = n * n * r(2, 9), big = (T * ((n - i) ** 2)) / (n * n), small = (T * ((n - i - 1) ** 2)) / (n * n)
    return ask(`Right triangle ABC has its right angle at A. Points cut AC into ${n} equal parts, and at each cut a line goes straight up to BC. If triangle ABC has area ${T}, what is the area of the strip between cut ${i} and cut ${i + 1} (counting from A)?`,
      dec(big - small), [dec(T / n), dec(big), dec(small)].filter((x) => x !== dec(big - small)), `The triangle to the right of each cut is similar to ABC. Cut ${i} leaves ${n - i}/${n} of the length, so ${(n - i) ** 2}/${n * n} of the area: ${dec(big)}. Cut ${i + 1} leaves ${dec(small)}. The strip is ${dec(big)} ${M} ${dec(small)} = ${dec(big - small)}.`, [dec(big - small + 1)])
  }),
  // 30. Equal complex numbers with roots.
  form(NO_CALC[1], function complexRootsEqual() {
    const s = pick([2, 3, 5, 7]), p = r(1, 3), q = r(p + 1, 5)
    return ask(`a ${M} b + ${q}i√${s} = ${p === 1 ? '' : p}√${s} + (a + b)i, where a and b are real and i = √${M}1. What is a² ${M} b²?`, p * q * s, [p * q, (p + q) * s, p * q * s * 2],
      `Real parts: a ${M} b = ${p === 1 ? '' : p}√${s}. Imaginary parts: a + b = ${q}√${s}. a² ${M} b² = (a ${M} b)(a + b) = ${p * q} × ${s} = ${p * q * s}.`)
  }),
  // 31. Where two linear functions from tables meet.
  form(T5_NOCALC[11], function twoTablesMeet() {
    const m1 = r(3, 6), c1 = r(1, 9), m2 = r(1, m1 - 1), a = r(3, 12), c2 = c1 + (m1 - m2) * a, b = m1 * a + c1
    return ask(`Linear function f has f(1) = ${m1 + c1}, f(3) = ${3 * m1 + c1}, f(5) = ${5 * m1 + c1}. Linear function g has g(0) = ${c2}, g(1) = ${c2 + m2}, g(2) = ${c2 + 2 * m2}. If f(a) = g(a) = b, what is a + b?`, a + b, [b, a + c2, a + b + m1],
      `f(x) = ${m1}x + ${c1} and g(x) = ${m2}x + ${c2}. Equal when ${m1 - m2}x = ${c2 - c1}, x = ${a}; then b = ${b}, and a + b = ${a + b}.`)
  }),
  // 32. Share out items two ways.
  form(T5_NOCALC[11], function shareTwoWays() {
    const s = r(8, 30), p = r(3, 6), q = p + r(1, 3), left = r(2, 15), need = (q - p) * s - left
    if (need <= 0) return shareTwoWays()
    return ask(`A teacher has some workbooks. Giving each student ${p} leaves ${left} over. Giving each student ${q} would need ${need} more. How many students are there?`, s, [s + 2, left + need, Math.round((left + need) / q)].filter((x) => x !== s),
      `The number of books is ${p}s + ${left} = ${q}s ${M} ${need}. So ${q - p}s = ${left + need} and s = ${s}.`, [s - 1])
  }),
  // 34. A shifted function's values give its constants.
  form(T4_NOCALC[4], function shiftedValues() {
    const h = r(1, 4), a = r(-5, 6), b = r(-5, 9)
    const f = (x) => x * x + a * x + b
    return ask(`f(x) = x² + ax + b and g(x) = f(x ${M} ${h}). If g(${h}) = ${num(f(0))} and g(${h + 1}) = ${num(f(1))}, what is a?`, num(a), [num(b), num(-a), num(a + 1)].filter((x) => x !== num(a)),
      `g(${h}) = f(0) = b = ${num(b)}. g(${h + 1}) = f(1) = 1 + a + b = ${num(f(1))}, so a = ${num(a)}.`, [num(a - 1)])
  }),
  // 35. Sector area from an arc length.
  form(T2_NOCALC[17], function sectorFromArc() {
    const d = pick([2, 3, 4, 6]), L = r(4, 15), rr = (L * d) / Math.PI, A = (rr * L) / 2
    return ask(`Central angle AOB measures π/${d} radians, and minor arc AB is ${L} long. What is the area of the sector, to the nearest tenth?`, dec(A, 1), [dec(rr, 1), dec(A * 2, 1), dec(Math.PI * rr * rr, 1)],
      `r = arc/angle = ${L}/(π/${d}) = ${dec(rr, 2)}. Sector area = (1/2) × r × arc = (1/2)(${dec(rr, 2)})(${L}) ≈ ${dec(A, 1)}.`)
  }),
  // 36. Minimum value after finding a constant.
  form(CALC[26], function minimumAfterConstant() {
    const b = 2 * r(1, 4), v = r(1, 9), k = -v, minv = v - (b * b) / 4
    return ask(`P(x) = x² + ${b}x ${M} k. If P(0) = ${v}, what is the minimum value of P?`, num(minv), [num(v), num(-minv), num(minv - b)].filter((x) => x !== num(minv)),
      `P(0) = ${M}k = ${v}, so k = ${num(k)} and P(x) = x² + ${b}x + ${v}. The lowest point is at x = ${M}${b / 2}: P = ${(b * b) / 4} ${M} ${b * b / 2} + ${v} = ${num(minv)}.`, [num(minv + 1)])
  }),
  // 37 and 38. When a business makes a profit.
  form(T5_NOCALC[11], function profitPoint() {
    const p = 5 * r(10, 30), c = p - 5 * r(1, 6), F = 500 * r(2, 10), target = pick([0, 10000, 50000, 100000])
    const x = target === 0 ? Math.floor(F / (p - c)) + 1 : (target + F) / (p - c)
    if (!Number.isInteger(x)) return profitPoint()
    return ask(`A company's revenue is R = ${p}x and its cost is C = ${c}x + ${F}, for x units sold. ${target === 0 ? 'What is the smallest number of units for which it makes a profit?' : `How many units must it sell to make a profit of $${target.toLocaleString('en-US')}?`}`,
      x, [Math.round(F / p), Math.round((target + F) / p), x + 1].filter((v) => v !== x),
      `Profit = R ${M} C = ${p - c}x ${M} ${F}. ${target === 0 ? `${p - c}x > ${F} means x > ${dec(F / (p - c))}, so the smallest whole number is ${x}.` : `${p - c}x ${M} ${F} = ${target} gives x = ${x}.`}`, [x + 2])
  }),
]

// Practice test 4, section 4 (calculator), questions 1 to 38.
const T4_CALC = [
  // 12. Percent loss then percent gain.
  function percentChange() {
    const p = pick([10, 20, 25, 30, 40, 50]), q = pick([10, 20, 25, 30, 40, 50]), P = 1000 * r(2, 20), end = P * (1 - p / 100) * (1 + q / 100), ch = (100 * (end - P)) / P
    const say = (c) => (c === 0 ? 'It did not change.' : `It ${c > 0 ? 'increased' : 'decreased'} by ${dec(Math.abs(c))} percent.`)
    return ask(`An investment of $${P.toLocaleString('en-US')} lost ${p}% in the first year, then gained ${q}% in the second year. How did it change over the two years?`, say(ch), [say(q - p), say(-ch), say(ch + (ch === 0 ? 5 : 0) - (ch === 0 ? 0 : 1))].filter((x) => x !== say(ch)),
      `After year 1: ${100 - p}% remains, so ${dec(1 - p / 100)} of it. After year 2: × ${dec(1 + q / 100)}. In all × ${dec((1 - p / 100) * (1 + q / 100), 4)}, which is ${say(ch).toLowerCase().replace('it ', '')}`, [say(ch + 2), say(ch - 3)])
  },
  // 1. Add two equations to get a sum.
  form(T3_CALC[7], function addEquations() {
    const m = r(2, 9), g = r(2, 9), a = r(1, 4), b = r(a + 1, 6), C1 = a * m + b * g, C2 = b * m + a * g
    return ask(`${a === 1 ? '' : a} movie${a > 1 ? 's' : ''} and ${b} games cost $${C1} to rent. ${b} movies and ${a === 1 ? 'one game' : `${a} games`} cost $${C2}. How much does one movie and one game cost together, in dollars?`, m + g, [m, g, Math.round((C1 + C2) / 2)].filter((x) => x !== m + g),
      `Add the two equations: ${a + b} movies + ${a + b} games = $${C1 + C2}. Divide by ${a + b}: one movie + one game = $${m + g}.`, [m + g + 1])
  }),
  // 2. Difference between two slices of a pie chart.
  form(T3_NOCALC[0], function pieDifference() {
    let a, c, o, N; do { a = r(25, 45); c = r(5, 20); o = r(10, 25); N = 100 * r(1, 5) } while (100 - a - c - o <= 5 || a <= 100 - a - c - o)
    const g = 100 - a - c - o
    return ask(`A pie chart shows the subjects ${N} students take: Algebra ${a}%, Calculus ${c}%, Other ${o}%, and Geometry the rest. How many more students take Algebra than Geometry?`, ((a - g) * N) / 100, [(a * N) / 100, (g * N) / 100, ((a - c) * N) / 100].filter((x) => x !== ((a - g) * N) / 100),
      `Geometry is 100 ${M} ${a} ${M} ${c} ${M} ${o} = ${g}%. The gap is ${a} ${M} ${g} = ${a - g}% of ${N} = ${((a - g) * N) / 100}.`, [((a - g) * N) / 100 + 2])
  }),
  // 3. A middle value from a known difference.
  form(CALC[0], function tableFromDifference() {
    const f0 = r(-4, 9), s = r(-3, 5) || 2, d = 3 * s
    return ask(`A linear function f has f(${M}1) = a, f(0) = ${num(f0)}, f(1) = k and f(2) = b. If b ${M} a = ${num(d)}, what is k?`, num(f0 + s), [num(f0 + d), num(f0 - s), num(d)].filter((x) => x !== num(f0 + s)),
      `From x = ${M}1 to x = 2 is 3 steps, so each step adds ${num(d)}/3 = ${num(s)}. k = f(1) = ${num(f0)} + ${num(s)} = ${num(f0 + s)}.`, [num(f0 + s + 1)])
  }),
  // 4. Scale a two-way table sample to a whole school.
  form(T2_CALC[15], function tableToSchool() {
    let BF, GA, G, T, B, BA, A, N; do { BF = 5 * r(3, 10); GA = r(10, 30); G = GA + r(10, 30); T = 100; B = T - G; BA = B - BF; A = BA + GA; N = 100 * r(3, 12) } while (BA <= 0)
    return ask(`In a random sample of ${T} students, ${BF} boys were for a new piano, ${GA} girls were against it, and ${G} of the students were girls. About how many of the ${N} students in the school would be expected to be against it?`, (A * N) / T, [(GA * N) / T, ((T - A) * N) / T, A].filter((x) => x !== (A * N) / T),
      `Boys: ${T} ${M} ${G} = ${B}, so ${B} ${M} ${BF} = ${BA} boys were against. Against in all: ${BA} + ${GA} = ${A} of ${T} = ${A}%. ${A}% of ${N} = ${(A * N) / T}.`, [(A * N) / T + 8])
  }),
  // 5. Average growth per year from a growth chart.
  form(CALC[18], function averageGrowth() {
    const ages = [0, 1, 2, 3, 4, 5, 6, 7], h = [r(18, 21)]; for (let i = 1; i < 8; i++) h.push(h[i - 1] + (i < 3 ? r(4, 6) : r(1, 3)))
    const a1 = r(1, 3), a2 = r(a1 + 2, 7), g = (h[a2] - h[a1]) / (a2 - a1)
    return ask(`A chart of boys' average height (inches) by age shows: ${ages.map((a, i) => `age ${a}: ${h[i]}`).join(', ')}. What is the average growth per year, in inches, from age ${a1} to age ${a2}?`, dec(g), [String(h[a2] - h[a1]), dec(h[a2] / a2), dec(g + 1)].filter((x) => x !== dec(g)),
      `(${h[a2]} ${M} ${h[a1]})/(${a2} ${M} ${a1}) = ${h[a2] - h[a1]}/${a2 - a1} = ${dec(g)} inches a year.`, [dec(g + 2)])
  }),
  // 6. Percent increase between two values.
  function percentIncreaseValues() {
    const a = pick([20, 25, 30, 40, 50, 60, 80]), p = pick([10, 20, 25, 40, 50, 60, 75]), b = (a * (100 + p)) / 100
    if (!Number.isInteger(b)) return percentIncreaseValues()
    return ask(`A boy's height went from ${a} inches to ${b} inches. By what percent did his height increase?`, p, [Math.round((100 * (b - a)) / b), b - a, p + 10].filter((x) => x !== p),
      `Increase = ${b} ${M} ${a} = ${b - a}. Percent increase = ${b - a}/${a} × 100 = ${p}% (divide by the starting value).`, [p - 5])
  },
  // 7. Intercept of a parallel line.
  form(NO_CALC[14], function parallelIntercept() {
    const p = r(1, 4), q = r(1, 6), X = r(2, 9), s = q / p, b = -s * X
    return ask(`Line ℓ passes through (${M}${p}, 0) and (0, ${q}). Line m is parallel to ℓ and passes through (${X}, 0) and (0, b). What is b?`, dec(b), [dec(-X / s), dec(-b), dec(-q * X)].filter((x) => x !== dec(b)),
      `Line ℓ has slope ${q}/${p} = ${frac(q, p)}. Parallel lines share the slope, so line m rises ${frac(q, p)} per step: going from x = ${X} back to x = 0 drops ${frac(q * X, p)}, so b = ${dec(b)}.`, [dec(b - 1)])
  }),
  // 8. Area of a circle from an expanded equation.
  form(CALC[17], function circleAreaExpanded() {
    const h = r(-5, 5) || 4, k = pick([0, r(-4, 4)]), R2 = h * h + k * k
    const xs = `x² ${h > 0 ? M : '+'} ${Math.abs(2 * h)}x`, ys = k ? `y² ${k > 0 ? M : '+'} ${Math.abs(2 * k)}y` : 'y²'
    return ask(`${xs} + ${ys} = 0 is the equation of a circle. What is its area?`, `${R2}π`, [`${2 * R2}π`, `${Math.abs(h)}π`, `${R2 * R2}π`, `${R2 + 2}π`, `${4 * R2}π`].filter((x) => x !== `${R2}π`),
      `Complete the squares: (x ${M} ${num(h)})² + (y ${M} ${num(k)})² = ${R2}. So r² = ${R2} and the area is ${R2}π.`, [`${R2 + 1}π`])
  }),
  // 9. A value from a shifted rule.
  form(T4_NOCALC[4], function shiftedRuleValue() {
    const s = r(1, 6), a = r(2, 5), c = r(-12, 6), t = r(-5, 3), x = t + s
    return ask(`If f(x ${M} ${s}) = ${a}x${tail(c)} for all x, what is f(${num(t)})?`, num(a * x + c), [num(a * t + c), num(a * (t - s) + c), num(a * x)].filter((v) => v !== num(a * x + c)),
      `f(${num(t)}) needs x ${M} ${s} = ${num(t)}, so x = ${num(x)}. Then f(${num(t)}) = ${a}(${num(x)})${tail(c)} = ${num(a * x + c)}.`, [num(a * x + c + 1)])
  }),
  // 10. A linear model from a start and an end.
  form(CALC[14], function linearSupply() {
    const start = 5 * r(3, 10), d = r(4, 12), rate = r(1, Math.floor(start / d) - 0 || 1), end = start - rate * d
    if (end < 0) return linearSupply()
    return ask(`A family starts a trip with ${start} pounds of rice. After ${d} days they have ${end} pounds left, using the same amount each day. Which function gives the amount T left after d days?`, `T(d) = ${start} ${M} ${rate}d`, [`T(d) = ${rate}d`, `T(d) = ${rate}d + ${start}`, `T(d) = ${start} ${M} ${d}d`, `T(d) = ${start} ${M} ${rate + 1}d`, `T(d) = ${end} + ${rate}d`],
      `They use (${start} ${M} ${end})/${d} = ${rate} pounds a day, starting from ${start}: T(d) = ${start} ${M} ${rate}d.`)
  }),
  // 11. Meaning of a point on a model's graph.
  form(T2_CALC[3], function interpretIntercept() {
    const H = 50 * r(4, 12), v = pick([4, 5, 8, 10, 16]), t = H / v
    return ask(`A lift moving down from a height of ${H} feet follows ${v}x + y = ${H}, where y is its height above the lobby and x is time in seconds. What does the point (${dec(t)}, 0) mean?`,
      `The lift takes ${dec(t)} seconds to reach the lobby.`, [`The lift stops at a height of ${dec(t)} feet.`, `The lift moves down at ${dec(t)} feet per second.`, `The lift moves ${dec(t)} feet from the lobby.`],
      `y = 0 means the lift is at the lobby (height 0), and x = ${dec(t)} is the time. So it gets there after ${dec(t)} seconds.`)
  }),
  // 13. Signs of coefficients from which quadrants a line crosses.
  form(T6_NOCALC[3], function quadrantSigns() {
    const opts = { 'I, II and III, but not IV': ['a < 0 and b > 0'], 'I, II and IV, but not III': ['a > 0 and b > 0'], 'II, III and IV, but not I': ['a < 0 and b < 0'], 'I, III and IV, but not II': ['a > 0 and b < 0'] }
    const key = pick(Object.keys(opts)), right = opts[key][0]
    return ask(`The graph of ax + by = 5 passes through Quadrants ${key}. Which of the following must be true?`, right, ['a > 0 and b > 0', 'a > 0 and b < 0', 'a < 0 and b > 0', 'a < 0 and b < 0'].filter((x) => x !== right),
      `Write y = (${M}a/b)x + 5/b. The quadrants crossed fix the sign of the slope and of the y-intercept 5/b, which give the signs of b and then a: ${right}.`)
  }),
  // 14. Height of a double cone from its volume.
  form(CALC[34], function doubleCone() {
    const rr = r(2, 6), h = 3 * r(2, 10), V = (rr * rr * h) / 3
    return ask(`A tank is two cones joined at their bases, each with radius ${rr} feet. If the tank's volume is ${dec(V)}π cubic feet, what is its total height h, from tip to tip, in feet?`, h, [h / 2, h * 2, Math.round(V / (rr * rr))].filter((x) => x !== h),
      `Two cones of height h/2 hold 2 × (1/3)π(${rr * rr})(h/2) = (${rr * rr}/3)πh. Set equal to ${dec(V)}π: h = ${h}.`, [h + 3])
  }),
  // 15. Isosceles triangle under a parabola.
  form(T3_NOCALC[5], function parabolaIsosceles() {
    const c = r(2, 6), k = r(1, 3), top = k * c * c
    return ask(`f(x) = ${M}${k === 1 ? '' : k}x² + ${2 * k * c}x. Triangle OPQ has O at the origin, Q where the graph meets the positive x-axis, and P at the graph's highest point. What is the area of triangle OPQ?`, top * c, [top * 2 * c, top, (top * c) / 2].filter((x) => x !== top * c),
      `${M}${k === 1 ? '' : k}x(x ${M} ${2 * c}) = 0 gives Q = (${2 * c}, 0). The top is at x = ${c}: P = (${c}, ${top}). Area = (1/2)(${2 * c})(${top}) = ${top * c}.`)
  }),
  // 16. Part of a job left after working together.
  form(CALC[30], function jobLeft() {
    const a = pick([4, 6, 8, 10, 12]), b = pick([3, 4, 6, 8, 12].filter((x) => x !== a)), t = r(1, 3), done = t * (1 / a + 1 / b)
    if (done >= 1) return jobLeft()
    const lcm = (a * b) / gcd(a, b), left = frac(lcm - t * (lcm / a + lcm / b), lcm)
    return ask(`Cathy can do a job in ${a} hours and Danny in ${b} hours. If they work together for ${t} hour${t > 1 ? 's' : ''}, what fraction of the job is left?`, left, [frac(t * (lcm / a + lcm / b), lcm), frac(1, a + b), frac(t, a + b)].filter((x) => x !== left),
      `Together they do 1/${a} + 1/${b} = ${frac(lcm / a + lcm / b, lcm)} of the job each hour. In ${t} hour${t > 1 ? 's' : ''}: ${frac(t * (lcm / a + lcm / b), lcm)}. Left: ${left}.`)
  }),
  // 17. Which distance is impossible.
  function distanceRange() {
    const D = r(8, 20), p = r(1, 5), q = r(1, 5), lo = Math.max(0, D - p - q), hi = D + p + q
    const ok = [lo, Math.round((lo + hi) / 2), hi]
    return ask(`Points X and Y are ${D} apart. Point P is ${p} from X and point Q is ${q} from Y. Which of the following CANNOT be the distance PQ?`, String(lo > 1 ? lo - 1 : hi + 1), ok.map(String),
      `PQ is shortest when P and Q are on segment XY facing each other: ${D} ${M} ${p} ${M} ${q} = ${lo}. It is longest when they point away: ${D} + ${p} + ${q} = ${hi}. Any distance from ${lo} to ${hi} is possible, so ${lo > 1 ? lo - 1 : hi + 1} is not.`)
  },
  // 18. A price pattern that grows by the same step.
  form(T6_NOCALC[1], function pricePattern() {
    const step = r(2, 3), first = 10 * r(3, 8), add = 5 * r(4, 8), n = step * r(30, 120)
    const cost = first + add * (n / step - 1)
    return ask(`Desks are priced as follows: ${step} desks cost $${first}, ${2 * step} cost $${first + add}, ${3 * step} cost $${first + 2 * add}, and so on. What do ${n} desks cost, in dollars?`, cost, [(first * n) / step, cost + add, add * (n / step)].filter((x) => x !== cost),
      `Each extra ${step} desks adds $${add}. ${n} desks is ${n / step} groups, so the cost is ${first} + ${n / step - 1} × ${add} = ${cost}.`, [cost - add])
  }),
  // 19 and 20. A river's cross-section from a parabola.
  form(CALC[26], function riverParabola() {
    const a = 5 * r(1, 4), b = a + 10 * r(2, 6), w = (b - a) / 2, depth = pick([w * w / 2, w * w / 4, w * w / 8, w * w]), k = depth / (w * w), askK = pick([true, false])
    if (!Number.isInteger(depth)) return riverParabola()
    return askK
      ? ask(`A river's cross-section is D(x) = k(x ${M} ${a})(x ${M} ${b}), where D is depth in metres and x is distance across. The deepest point is ${depth} metres below the surface (D = ${M}${depth}). What is k?`, frac(depth, w * w), [frac(w * w, depth), String(depth), frac(depth, w)].filter((x) => x !== frac(depth, w * w)),
        `The deepest point is halfway, at x = ${(a + b) / 2}: D = k(${w})(${M}${w}) = ${M}${w * w}k = ${M}${depth}, so k = ${frac(depth, w * w)}.`)
      : ask(`A river's cross-section is D(x) = k(x ${M} ${a})(x ${M} ${b}), where D is depth in metres, x is distance across, and k > 0. How wide is the river at the surface, in metres?`, b - a, [b, a, w].filter((x) => x !== b - a),
        `The surface is where D = 0: x = ${a} and x = ${b}. Width = ${b} ${M} ${a} = ${b - a}.`, [b - a + 5])
  }),
  // 21. Segment of the hypotenuse from a sine.
  form(T4_NOCALC[15], function hypotenuseSegment() {
    const s = pick([0.2, 0.25, 0.3, 0.35, 0.4, 0.5, 0.6]), BC = 10 * r(1, 4)
    return ask(`Triangle ABC has a right angle at C, and CD goes straight down from C to AB. Angle A is a° with sin(a°) = ${s}. If BC = ${BC}, how long is BD?`, dec(BC * s), [dec(BC / s), dec(BC * (1 - s)), String(BC)],
      `Angle B = 90 ${M} a, so cos B = sin a = ${s}. In right triangle BDC, BD = BC × cos B = ${BC} × ${s} = ${dec(BC * s)}.`)
  }),
  // 22. Which polynomial has a given factor.
  form(CALC[22], function whichHasFactor() {
    const c = pick([1, 2, -1]), make = (good) => { let cs; do { cs = [r(1, 3), r(-3, 3), r(-3, 3)]; const v = cs[0] * c ** 3 + cs[1] * c ** 2 + cs[2] * c; cs.push(good ? -v : -v + r(1, 3) * pick([1, -1])) } while (cs[3] === 0); return cs }
    const P = (cs) => `${poly(cs)}`
    const right = P(make(true)), wrong = [P(make(false)), P(make(false)), P(make(false))]
    if (new Set([right, ...wrong]).size < 4) return whichHasFactor()
    return ask(`Which of the following polynomials has (x ${c > 0 ? M : '+'} ${Math.abs(c)}) as a factor?`, right, wrong, `(x ${c > 0 ? M : '+'} ${Math.abs(c)}) is a factor exactly when the polynomial is 0 at x = ${num(c)}. Only ${right} gives 0 there.`)
  }),
  // 23. Cost with a flat start, then a steady rate.
  form(T8_NOCALC[6], function flatThenRate() {
    const base = 50 * r(3, 8), h0 = r(1, 3), h1 = h0 + r(4, 8), top = base + 50 * r(2, 6), slope = frac(top - base, h1 - h0)
    return ask(`A consultant charges $${base} for up to ${h0} hours. After that the cost rises steadily, reaching $${top} at ${h1} hours. Which gives the cost C(x) for x hours, with x > ${h0}?`, `C(x) = ${base} + (${slope})(x ${M} ${h0})`, [`C(x) = ${base} + (${slope})x`, `C(x) = ${base} + ${top - base}x`, `C(x) = ${base}`],
      `The rise is (${top} ${M} ${base})/(${h1} ${M} ${h0}) = ${slope} dollars an hour, counted only after ${h0} hours: C(x) = ${base} + (${slope})(x ${M} ${h0}).`)
  }),
  // 24. When |x| = k has a solution.
  form(CALC[4], function absSolutionStatements() {
    const right = 'I only'
    return ask('|x| = k. If this equation has a real solution, which of these must be true? I. k ≥ 0 II. k < 0 III. x > 0', right, ['II only', 'I and III only', 'II and III only'],
      '|x| is never negative, so k ≥ 0. k < 0 gives no solution. x can be negative (x = −k), so x > 0 is not required.')
  }),
  // 25. Area of a sector from its arc.
  form(CALC[29], function sectorAreaFromArc() {
    const [deg, num2, den] = pick([[270, 3, 4], [180, 1, 2], [90, 1, 4], [240, 2, 3]]), L = r(4, 20)
    const area = frac(L * L * den, 4 * num2)
    return ask(`A sector of a circle has a central angle of ${deg}° and its curved edge is ${L} long. What is the area of the sector?`, `${area}/π`.replace(/^(\d+)\/(\d+)\/π$/, '$1/($2π)'), [`${L * L}π`, `${frac(L * L, 4)}π`, `${frac(L * L * den, 2 * num2)}/π`.replace(/^(\d+)\/(\d+)\/π$/, '$1/($2π)')],
      `Arc = (${deg}/360) × 2πr = ${L}, so r = ${frac(L * den, 2 * num2)}/π. Area = (1/2) × r × arc = ${area}/π.`)
  }),
  // 26. Constants that make an equation true for all x.
  form(NO_CALC[16], function allXConstants() {
    const k = r(2, 9), p = r(2, 4), C = p * k
    return ask(`(k ${M} 1)x + ${p}k = ax + ${C} for all real x, where k and a are constants. What is a?`, k - 1, [k, C, k + 1].filter((x) => x !== k - 1),
      `The numbers must match: ${p}k = ${C}, so k = ${k}. The x terms match: a = k ${M} 1 = ${k - 1}.`)
  }),
  // 27. A horizontal line meeting a wavy graph three times.
  form(T6_NOCALC[13], function threeSolutions() {
    const s = r(10, 16), m1 = -r(3, 6), M1 = r(5, 9), m2 = -r(8, 12), e = r(13, 18)
    return ask(`The graph of f, for ${M}5 ≤ x ≤ 15, starts at (${M}5, ${s}), falls to a low point at height ${num(m1)}, rises to a high point at height ${M1}, falls to a low point at height ${num(m2)}, and rises to end at (15, ${e}). If y = f(x) and y = k have exactly three solutions, which could be k?`, num(m1), [String(M1 + 2), String(Math.round((m1 + M1) / 2) || 1), num(m1 - 1)],
      `y = ${num(m1)} touches the first low point once and crosses the two parts of the graph that go below it once each: 3 points. Heights between ${m1} and ${M1} give 4 points, just above ${M1} gives 2, and just below ${m1} gives 2.`)
  }),
  // 28. Squares growing along a line.
  function squaresAlongLine() {
    const a = r(2, 5), ratio = pick([2, 1.5, 3]), b = a * ratio, c = b * ratio
    if (!Number.isInteger(b) || !Number.isInteger(c)) return squaresAlongLine()
    return ask(`Three squares sit side by side on a line, and one straight line passes through the top-left corner of each. The first two squares have areas ${a * a} and ${b * b}. What is the area of the third square?`, c * c, [(2 * b - a) ** 2, b * b * 2, (a + b) ** 2].filter((x) => x !== c * c),
      `Each square starts where the last one ends, and the corners lie on one line, so the sides grow by the same factor: ${b}/${a} = ${dec(ratio)}. The third side is ${b} × ${dec(ratio)} = ${c}, area ${c * c}.`, [c * c + 1])
  },
  // 29. Averages of pairs give the average of all three.
  form(T3_CALC[7], function pairAverages() {
    const a = r(2, 20), b = r(2, 30), c = r(2, 30), s1 = (a + 2 * b) / 2, s2 = (b + 2 * c) / 2, s3 = (c + 2 * a) / 2
    if (![s1, s2, s3].every(Number.isInteger) || (a + b + c) % 3) return pairAverages()
    return ask(`The average of a and 2b is ${s1}, the average of b and 2c is ${s2}, and the average of c and 2a is ${s3}. What is the average of a, b and c?`, (a + b + c) / 3, [a + b + c, (s1 + s2 + s3) / 3, (a + b + c) / 3 + 4].map((x) => Math.round(x)).filter((x) => x !== (a + b + c) / 3),
      `Add the three: a + 2b + b + 2c + c + 2a = 2(${s1} + ${s2} + ${s3}), so 3(a + b + c) = ${2 * (s1 + s2 + s3)} and a + b + c = ${a + b + c}. The average is ${(a + b + c) / 3}.`, [(a + b + c) / 3 + 2])
  }),
  // 30. Arc on the outer circle from a sector on the inner one.
  form(T2_NOCALC[17], function concentricArc() {
    const d = 5, n = 2, rIn = 5 * r(1, 3), [p, q] = pick([[2, 3], [1, 1], [3, 2], [1, 2]]), rOut = rIn + (rIn * q) / p
    if (!Number.isInteger(rOut)) return concentricArc()
    const area = (rIn * rIn * n) / (2 * d), arc = (rOut * n) / d
    return ask(`Two circles share centre O. Two rays from O cut the small circle at P and Q and the large circle at R and S. Angle POQ is 2π/5 and sector OPQ has area ${dec(area)}π. If OP : PR = ${p} : ${q}, how long is arc RS?`, `${dec(arc)}π`, [`${dec((rIn * n) / d)}π`, `${dec(arc * 2)}π`, `${dec(((rOut - rIn) * n) / d)}π`].filter((x) => x !== `${dec(arc)}π`),
      `Sector area = (1/2)r²θ: (1/2)r²(2π/5) = ${dec(area)}π gives OP = ${rIn}. PR = ${rIn} × ${q}/${p} = ${dec(rOut - rIn)}, so OR = ${rOut}. Arc RS = ${rOut} × 2π/5 = ${dec(arc)}π.`, [`${dec(arc + 1)}π`])
  }),
  // 31. One function from another's value.
  form(T3_NOCALC[1], function functionFromOther() {
    const m = r(2, 5), c = r(-6, 6) || 1, v = r(-4, 8), g = m * v + c
    return ask(`g(x) = ${m}f(x)${tail(c)}. If g(1) = ${num(g)}, what is f(1)?`, num(v), [num(g), num(g - c), num(v + 1)].filter((x) => x !== num(v)),
      `${num(g)} = ${m}f(1)${tail(c)}, so ${m}f(1) = ${num(g - c)} and f(1) = ${num(v)}.`)
  }),
  // 32. A made-up operation.
  function customOperation() {
    const c = r(-3, 3), x = r(2, 5), y = r(2, 6), d = r(1, 3), val = x * y - x + c
    let k = null; for (let t = 1; t < 30; t++) if (t * (t - d) - t + c === val) { k = t; break }
    if (k == null) return customOperation()
    return ask(`For all a and b, a ∇ b = ab ${M} a${c ? tail(c) : ''}. If k ∇ (k ${M} ${d}) = ${x} ∇ ${y}, what is the positive value of k?`, k, [x, y, k + 1].filter((v) => v !== k),
      `${x} ∇ ${y} = ${x * y} ${M} ${x}${tail(c)} = ${val}. k ∇ (k ${M} ${d}) = k(k ${M} ${d}) ${M} k${tail(c)} = k² ${M} ${d + 1}k${tail(c)}. Setting this to ${val} and solving gives the positive k = ${k}.`, [k + 2])
  },
  // 33. Percent condition gives a ratio expression.
  form(CALC[33], function percentRatioExpression() {
    const [a, b, p, c, q] = pick([[4, 5, 250, 4, 9], [2, 3, 200, 2, 7], [3, 2, 150, 4, 5], [5, 1, 300, 2, 1]])
    const mn = (p / 100) * c - b, m = mn / a // m/n
    const val = (m + 1) / (m - 1)
    if (!Number.isFinite(val) || m === 1) return percentRatioExpression()
    return ask(`If ${a}m + ${b}n is equal to ${p}% of ${c}n, what is (m + n)/(m ${M} n)?`, dec(val), [dec(m), dec(1 / m), dec((m - 1) / (m + 1))].filter((x) => x !== dec(val)),
      `${a}m + ${b}n = ${dec((p / 100) * c)}n, so ${a}m = ${dec(mn)}n and m/n = ${dec(m)}. Divide top and bottom by n: (m/n + 1)/(m/n ${M} 1) = ${dec(val)}.`, [dec(val + 1)])
  }),
  // 34. Triangle inside a parallelogram.
  form(T3_NOCALC[18], function parallelogramTriangle() {
    const [p, q] = pick([[2, 3], [1, 2], [1, 3], [3, 2], [1, 1]]), A = (p) * r(2, 12) * 2 / 2, total = (A * 2 * (p + q)) / p
    return ask(`ABCD is a parallelogram, and M is on BC with BM : MC = ${p} : ${q}. If triangle ABM has area ${A}, what is the area of triangle AMD?`, dec(total / 2), [dec(total), dec((A * q) / p), dec(total / 2 - A)].filter((x) => x !== dec(total / 2)),
      `Triangle ABM has base BM = ${p}/${p + q} of BC, so its area is ${p}/${p + q} × half the parallelogram. Half the parallelogram is ${A} × ${p + q}/${p} = ${dec(total / 2)}, and triangle AMD (base AD = BC, same height) is exactly half the parallelogram: ${dec(total / 2)}.`, [dec(total / 2 + 5)])
  }),
  // 35. When a steady decline reaches an amount.
  form(T5_NOCALC[7], function declineAmount() {
    const rate = 50 * r(2, 10), P0 = 1000 * r(10, 40), drop = rate * r(2, 12)
    return ask(`A town's population is P(x) = ${P0.toLocaleString('en-US')} ${M} ${rate}x, where x is years since 2000. In how many years will the population have fallen by ${drop.toLocaleString('en-US')}?`, drop / rate, [Math.round(P0 / rate), drop / rate + 2, Math.round(drop / 100)].filter((x) => x !== drop / rate),
      `It falls by ${rate} a year. ${drop} ÷ ${rate} = ${drop / rate} years.`, [drop / rate + 1])
  }),
  // 36. An equilateral triangle cut by parallel lines.
  function equilateralSplit() {
    const s = 2 * r(3, 10), [p, q] = pick([[1, 3], [1, 2], [2, 3], [1, 4]]), DC = (s * q) / (p + q)
    return ask(`Equilateral triangle ABC has sides of ${s}. D is on AC, E is on AB with ED parallel to BC, and F is on BC with DF parallel to AB. If DE : DF = ${p} : ${q}, what is the perimeter of triangle CDF?`, dec(3 * DC), [dec(3 * (s - DC)), dec(DC), dec(s * 3 / 2)].filter((x) => x !== dec(3 * DC)),
      `Triangles ADE and DCF are equilateral (their sides are parallel to ABC's), so DE = AD and DF = DC. AD : DC = ${p} : ${q} and AD + DC = ${s}, so DC = ${dec(DC)}. The perimeter of CDF is 3 × ${dec(DC)} = ${dec(3 * DC)}.`, [dec(3 * DC + 3)])
  },
  // 37. Sum of reciprocals of the roots.
  form(T6_NOCALC[11], function reciprocalRoots() {
    // Two real solutions need B² > 4aC.
    let a, B, C; do { a = r(2, 5); B = r(3, 12); C = r(1, 9) } while (B * B <= 4 * a * C)
    return ask(`If a and b are the two solutions of ${a}x² ${M} ${B}x + ${C} = 0, what is 1/a + 1/b?`, frac(B, C), [frac(C, B), frac(B, a), frac(C, a)].filter((x) => x !== frac(B, C)),
      `1/a + 1/b = (a + b)/(ab). For ${a}x² ${M} ${B}x + ${C}: a + b = ${frac(B, a)} and ab = ${frac(C, a)}. So (${frac(B, a)})/(${frac(C, a)}) = ${frac(B, C)}.`, [frac(B + 1, C)])
  }),
  // 38. Where a line meets a parabola.
  function lineParabolaIntersection() {
    const h = 3, k = -4, aN = 4, aD = 9 // y = (4/9)(x − 3)² − 4 through (0, 0) and (6, 0)
    const c = pick([6, 4, 8]), // line through (0, −c) and (6, 0)
      m = c / 6
    // (4/9)(x − 3)² − 4 = m x − c  →  4x² − (24 + 9m)x + 36 − 36 + 9c = 0
    const A = 4, B = -(24 + 9 * m), C = 9 * c, disc = B * B - 4 * A * C, r1 = (-B - Math.sqrt(disc)) / (2 * A), r2 = (-B + Math.sqrt(disc)) / (2 * A)
    const rr = Math.abs(r2 - 6) < 1e-9 ? r1 : r2
    return ask(`A parabola has its vertex at (${h}, ${num(k)}) and passes through the origin. A line passes through (0, ${M}${c}) and (6, 0). The graphs meet at (6, 0) and at another point (r, s). What is r (to 2 decimal places where needed)?`, dec(rr), [String(h), dec(6 - rr), dec(rr + 1)].filter((x) => x !== dec(rr)),
      `The parabola is y = (${aN}/${aD})(x ${M} ${h})² ${M} ${-k} (through the origin). The line is y = ${dec(m)}x ${M} ${c}. Setting them equal gives ${A}x² ${M} ${-B}x + ${C} = 0, with solutions x = 6 and x = ${dec(rr)}.`)
  },
]
// 6. Percent increase from a chart, a form of question 12. (Added after the list so it can point at it.)
// It sits at position 6 in the list above; move it to the end as a form of percentChange (position 0).
T4_CALC.push(form(T4_CALC[0], T4_CALC.splice(6, 1)[0]))

// Practice test 5, section 4 (calculator), questions 1 to 38.
const T5_CALC = [
  // 1. Flat price for a bundle, then a rate per extra item.
  form(T8_NOCALC[6], function bundleThenRate() {
    const base = 5 * r(4, 10), N = 100 * r(2, 6), rate = pick([0.05, 0.08, 0.1, 0.12, 0.15])
    return ask(`A phone company charges $${base} for the first ${N} texts and $${rate.toFixed(2)} for each text after that. Which expression gives the total cost, in dollars, for n texts, with n > ${N}?`,
      `${rate}(n ${M} ${N}) + ${base}`, [`${rate}n + ${base}`, `${rate}n + ${base}(${N})`, `${rate}(n ${M} ${N}) + ${base}(${N})`],
      `Only the texts over ${N} cost extra: n ${M} ${N} of them at $${rate.toFixed(2)} each. Add the $${base}: ${rate}(n ${M} ${N}) + ${base}.`)
  }),
  // 2. Time to earn an amount at a steady rate.
  form(NO_CALC[6], function earnTime() {
    const d = r(2, 9)
    return ask(`${pick(NAMES)} earns P dollars in ${d} days. At this rate, how many days will it take to earn S dollars?`, `${d}S/P`, [`${d}S`, `${d}P/S`, `S/(${d}P)`],
      `Each day brings P/${d} dollars. S dollars takes S ÷ (P/${d}) = ${d}S/P days.`)
  }),
  // 3. A value from a shifted rule.
  form(T4_NOCALC[4], function shiftedValue() {
    const s = r(2, 7), a = r(2, 6), c = r(-20, 5), t = r(-3, 6), x = t + s
    return ask(`If f(x ${M} ${s}) = ${a}x${tail(c)}, what is f(${num(t)})?`, num(a * x + c), [num(a * t + c), num(a * (t - s) + c), num(-(a * x + c))].filter((v) => v !== num(a * x + c)),
      `x ${M} ${s} = ${num(t)} when x = ${x}. f(${num(t)}) = ${a}(${x})${tail(c)} = ${num(a * x + c)}.`, [num(a * x + c + 2)])
  }),
  // 4. Total of a two-way table.
  form(T2_NOCALC[18], function tableTotal() {
    const BS = r(8, 20), BT = BS + r(4, 12), GJ = r(10, 30), ST = BS + r(10, 35), BJ = BT - BS, GS = ST - BS, T = BT + GS + GJ
    return ask(`A reading group has only seniors and juniors. ${BS} boys are seniors, there are ${BT} boys in all, ${GJ} girls are juniors, and ${ST} students are seniors. How many students are in the group?`, T, [BT + GJ + BS, ST + GJ, T - BJ].filter((x) => x !== T),
      `Senior girls: ${ST} ${M} ${BS} = ${GS}. Girls: ${GS} + ${GJ} = ${GS + GJ}. Total: ${BT} + ${GS + GJ} = ${T}.`, [T + 5])
  }),
  // 5 and 6. Direct variation.
  form(T3_NOCALC[9], function directVariation() {
    const W1 = pick([4, 5, 8, 10, 20]), k = pick([1.5, 2, 2.5, 3, 4]), L1 = k * W1, L2 = k * r(3, 30) / pick([1, 2]), askW = pick([true, false])
    return askW
      ? ask(`A spring's stretch L (cm) varies directly with the weight W (grams) hung on it. ${W1} grams stretch it ${dec(L1)} cm. How many grams stretch it ${dec(L2)} cm?`, dec(L2 / k), [dec(L2 * k), dec(L2 - L1 + W1), dec((L2 * W1) / (L1 + 1))].filter((x) => x !== dec(L2 / k)),
        `L = kW with k = ${dec(L1)}/${W1} = ${dec(k)}. W = ${dec(L2)}/${dec(k)} = ${dec(L2 / k)}.`, [dec(L2 / k + 1)])
      : ask(`A spring's stretch L (cm) varies directly with the weight W (grams) hung on it. ${W1} grams stretch it ${dec(L1)} cm. Which equation relates W and L?`, `L = ${dec(k)}W`, [`L = ${dec(1 / k, 2)}W`, `L = ${dec(L1 - W1)}W`, `L = ${dec(k)}W + ${dec(L1)}`].filter((x) => x !== `L = ${dec(k)}W`),
        `Direct variation means L = kW with no added number. k = ${dec(L1)}/${W1} = ${dec(k)}.`, [`L = ${dec(k + 1)}W`])
  }),
  // 7. Fewest extra items to reach a target.
  form(T2_CALC[6], function moreToReach() {
    const p = 5 * r(2, 6), n = r(20, 60), k = 10 * r(5, 30), now = p * n - k, target = now + 10 * r(5, 25), need = Math.ceil((target + k) / p) - n
    return ask(`A car wash's profit is p(x) = ${p}x ${M} k dollars for x cars, where k is a constant. Today ${n} cars were washed for a profit of $${now}. To make a profit of at least $${target}, how many more cars must be washed?`, need, [need + 1, need - 1, Math.round((target - now) / p) + 3].filter((x) => x !== need && x > 0),
      `${now} = ${p}(${n}) ${M} k, so k = ${k}. Need ${p}x ${M} ${k} ≥ ${target}, x ≥ ${dec((target + k) / p)}, so x = ${n + need}: ${need} more cars.`, [need + 2])
  }),
  // 8. Two exponent equations give a difference of squares.
  form(NO_CALC[13], function exponentSquares() {
    const s = pick([0.5, 1, 1.5, 2]), d = r(1, 4)
    const [b1, sumExp] = s === 1 ? [4, 2] : s === 2 ? [4, 4] : s === 0.5 ? [4, 1] : [4, 3], val1 = 2 ** sumExp
    return ask(`If ${b1}^(a + b) = ${val1} and 9^(a ${M} b) = ${9 ** d}, what is a² ${M} b²?`, dec(s * d), [dec(s + d), dec(d), dec(s * d * 2)].filter((x) => x !== dec(s * d)),
      `${b1}^(a + b) = 2^(2(a + b)) = 2^${sumExp}, so a + b = ${dec(s)}. 9^(a ${M} b) = 9^${d}, so a ${M} b = ${d}. a² ${M} b² = (a + b)(a ${M} b) = ${dec(s * d)}.`, [dec(s * d + 1)])
  }),
  // 9. Undo a shift to find f(x).
  form(T4_NOCALC[4], function undoShift() {
    const s = r(1, 6), a = r(2, 5); let c; do { c = r(-9, 9) } while (c === 0 || c === -a * s || c === a * s || c === -s)
    return ask(`If f(x ${M} ${s}) = ${a}x${tail(c)} for all x, which of the following is f(x)?`, `f(x) = ${a}x${tail(c + a * s)}`, [`f(x) = ${a}x${tail(c - a * s)}`, `f(x) = ${a}x${tail(c + s)}`, `f(x) = ${a}x${tail(c)}`],
      `Write u = x ${M} ${s}, so x = u + ${s}. Then f(u) = ${a}(u + ${s})${tail(c)} = ${a}u${tail(c + a * s)}.`)
  }),
  // 10. Which point lies on the perpendicular line.
  form(NO_CALC[14], function pointOnPerpendicular() {
    const p = r(2, 5), q = r(2, 5), t = r(1, 4) * q
    return ask(`Line m passes through (0, ${q}) and (${p}, 0). Line ℓ passes through the origin and is perpendicular to m. Which point lies on line ℓ?`, pt(t, (t * p) / q), [pt(t, t + 1), pt(t + 1, (t * p) / q), pt((t * p) / q, t)].filter((x) => x !== pt(t, (t * p) / q)),
      `m has slope ${M}${q}/${p}, so ℓ has slope ${frac(p, q)}: y = ${coef(p, q)}x. At x = ${t}, y = ${dec((t * p) / q)}.`, [pt(t, -(t * p) / q), pt(-t, (t * p) / q)])
  }),
  // 11. Equal complex numbers give a ratio.
  form(NO_CALC[1], function complexRatio() {
    let p, q, s; do { p = r(2, 7); q = r(1, 4); s = r(1, 4) } while (p === 1)
    const ratio = frac(-(q + s), p - 1) // pa + qb = a − sb  →  (p − 1)a = −(q + s)b
    return ask(`${p}a + ${q === 1 ? '' : q}b + ${r(2, 9)}i = (a ${M} ${s === 1 ? '' : s}b) + ki, where a, b and k are real constants and i = √${M}1. What is a/b?`, ratio, [frac(q + s, p - 1), frac(p - 1, -(q + s)), frac(p - 1, q + s)].filter((x) => x !== ratio),
      `The real parts match: ${p}a + ${q}b = a ${M} ${s}b, so ${p - 1}a = ${M}${q + s}b and a/b = ${ratio}.`)
  }),
  // 12. Meaning of a rate in a velocity model.
  form(T2_CALC[3], function velocityMeaning() {
    const v0 = 10 * r(20, 60), g = pick([9.8, 32, 4.9])
    return ask(`A ball is shot straight up. Its velocity after t seconds is v(t) = ${v0} ${M} ${g}t. What does ${g} mean?`, `For every 1 second that passes, the velocity goes down by ${g}.`,
      [`For every 1 second that passes, the velocity goes up by ${g}.`, `For every 1 second less, the velocity goes down by ${g}.`, `For every ${g} seconds, the velocity goes up by ${v0}.`],
      `${g} multiplies t, so each extra second changes v by ${M}${g}: the velocity falls by ${g} each second. ${v0} is the starting velocity.`)
  }),
  // 13. Slope sign when the coefficients cancel.
  form(T6_NOCALC[3], function slopeFromSum() {
    const pos = pick([true, false])
    return ask(`ax + by = 5, where a and b are non-zero constants. If a ${pos ? '+' : M} b = 0, which of the following must be true about the graph?`, `The slope is ${pos ? 'positive' : 'negative'}.`, [`The slope is ${pos ? 'negative' : 'positive'}.`, 'The slope is zero.', 'The line is vertical.'],
      `The slope is ${M}a/b. ${pos ? 'a + b = 0 means a = −b, so −a/b = 1' : 'a − b = 0 means a = b, so −a/b = −1'}: ${pos ? 'positive' : 'negative'}.`)
  }),
  // 14. Walk part of the way, run the rest.
  form(CALC[19], function walkThenRun() {
    const [f, rest] = pick([[1, 3], [1, 2], [1, 4], [2, 5]]), k = pick([2, 3, 4]), t = r(2, 9) * k * (rest - f) / f
    if (!Number.isInteger(t)) return walkThenRun()
    const runTime = (t * (rest - f)) / (f * k)
    return ask(`${pick(NAMES)} walked ${f}/${rest} of the way to a friend's house, then ran the rest ${k} times as fast. Walking took ${t} minutes. How many minutes did the whole trip take?`, t + runTime, [t * (rest / f), t + t / k, t * 2].filter((x) => x !== t + runTime),
      `The rest is ${rest - f}/${rest} of the way, ${(rest - f) / f} times the walked part. At ${k} times the speed it takes ${t} × ${(rest - f) / f} ÷ ${k} = ${dec(runTime)} minutes. Total: ${dec(t + runTime)}.`, [t + runTime + 2])
  }),
  // 15. A system with fractions.
  form(T3_CALC[7], function fractionSystem() {
    const x = r(4, 20), y = r(1, 9), p = pick([2, 4, 8]), q = pick([4, 10])
    const c1 = x / p - (2 * y) / p, c2 = x / q + (2 * y) / q
    if (!Number.isInteger(c1) || !Number.isInteger(c2)) return fractionSystem()
    return ask(`(1/${p})x ${M} (1/${p / 2 === 1 ? 1 : p / 2})y = ${num(c1)} and (1/${q})x + (1/${q / 2})y = ${c2}. If (a, b) is the solution, what is a + b?`, x + y, [x - y, x, c1 + c2].filter((v) => v !== x + y),
      `Multiply the first by ${p}: x ${M} 2y = ${p * c1}. Multiply the second by ${q}: x + 2y = ${q * c2}. Adding gives x = ${x}, then y = ${y}. a + b = ${x + y}.`, [x + y + 1])
  }),
  // 16. Where a line through the origin meets a parabola.
  form(T4_CALC[T4_CALC.length - 2], function parabolaLineOrigin() {
    const h = r(3, 6), k = 2 * h, a = -k / (h * h), m = pick([1, 2]), // y = a(x − h)² + k through the origin; line y = mx
      // a(x − h)² + k = mx → a x² − (2ah + m)x = 0 → x = (2ah + m)/a
      rr = (2 * a * h + m) / a
    if (!(rr > 0)) return parabolaLineOrigin()
    return ask(`The parabola y = a(x ${M} ${h})² + ${k} passes through the origin. The line through the origin and (${h}, ${m * h}) meets the parabola again at (r, s). What is r (to 2 decimal places where needed)?`, dec(rr), [String(h), dec(2 * h), dec(rr + 1)].filter((x) => x !== dec(rr)),
      `Through the origin: ${h * h}a + ${k} = 0, so a = ${frac(-k, h * h)}. The line is y = ${m === 1 ? '' : m}x. Setting a(x ${M} ${h})² + ${k} = ${m === 1 ? '' : m}x and cancelling x = 0 leaves x = ${dec(rr)}.`)
  }),
  // 17. Pick the system for a shaded region.
  form(T2_CALC[7], function regionSystem() {
    const a = r(2, 5), b = r(2, 6), c = r(5, 12), p = r(4, 8), q = r(3, 9)
    const par = `x² ${M} ${p}x + ${q}`
    return ask(`A shaded region lies on or above the parabola y = ${par} (solid curve) and strictly below the line ${a}x ${M} ${b}y = ${c} (dashed line). Which system describes it?`,
      `${a}x ${M} ${b}y ${M} ${c} > 0 and y ≥ ${par}`, [`${a}x ${M} ${b}y ${M} ${c} ≥ 0 and y ≥ ${par}`, `${a}x + ${b}y ${M} ${c} > 0 and y ≥ ${par}`, `${a}x ${M} ${b}y ${M} ${c} > 0 and y ≥ x² + ${p}x + ${q}`],
      `Below the line ${a}x ${M} ${b}y = ${c} means y < (${a}x ${M} ${c})/${b}, which is ${a}x ${M} ${b}y ${M} ${c} > 0. A dashed line means strict (>), a solid curve means ≥.`)
  }),
  // 18. No solution for a linear equation with a constant.
  form(T4_NOCALC[9], function noSolutionConstant() {
    const d = r(2, 6), c = r(1, 9), e = r(1, 9)
    return ask(`(x ${M} ${c})/${d} = kx + ${e}, where k is a constant. If this equation has no solution, what is k?`, `1/${d}`, [`${d}`, `1/${d + 1}`, `${M}1/${d}`],
      `(x ${M} ${c})/${d} = (1/${d})x ${M} ${frac(c, d)}. No solution means the x terms match but the numbers do not: k = 1/${d} (and ${M}${frac(c, d)} ≠ ${e}).`)
  }),
  // 19. A circle between two squares.
  function circleSquares() {
    return ask('A circle fits exactly inside square PQRS (touching all four sides), and a smaller square fits exactly inside the circle (its corners on the circle). If PS = a, what is the area of the region inside the circle but outside the small square?', 'a²(π − 2)/4',
      ['a²(π − 4)/4', 'πa²/4 − 4', 'πa² − 8'], 'The circle has radius a/2 and area πa²/4. The small square’s diagonal is the diameter a, so its area is a²/2. The difference is πa²/4 − a²/2 = a²(π − 2)/4.')
  },
  // 20. Signs from slope and intercept.
  form(T6_NOCALC[3], function signsFromLine() {
    const negSlope = pick([true, false]), negInt = pick([true, false])
    const aSign = negSlope === negInt ? 'a < 0' : 'a > 0'
    return ask(`ax + by ${M} 2 = 0, where a and b are constants. If the graph has a ${negSlope ? 'negative' : 'positive'} slope and a ${negInt ? 'negative' : 'positive'} y-intercept, which must be true?`, aSign, [aSign === 'a < 0' ? 'a > 0' : 'a < 0', 'a = 0', 'a ≥ 0'].filter((x) => x !== aSign).concat(aSign === 'a > 0' ? ['a ≤ 0'] : []).slice(0, 3),
      `y = (${M}a/b)x + 2/b. The y-intercept 2/b is ${negInt ? 'negative, so b < 0' : 'positive, so b > 0'}. The slope ${M}a/b is ${negSlope ? 'negative, so a/b > 0' : 'positive, so a/b < 0'}, which gives ${aSign}.`)
  }),
  // 21. Average rate of change from two values.
  form(CALC[18], function rateTwoValues() {
    const a = r(-3, 4), b = a + r(2, 6), fa = r(-6, 9), fb = r(-9, 9)
    return ask(`The average rate of change of f from a to b is (f(b) ${M} f(a))/(b ${M} a). If f(${num(a)}) = ${num(fa)} and f(${num(b)}) = ${num(fb)}, what is it?`, frac(fb - fa, b - a), [frac(b - a, fb - fa || 1), frac(fa - fb, b - a), frac(fb + fa, b - a)].filter((x) => x !== frac(fb - fa, b - a)),
      `(${num(fb)} ${M} ${num(fa)})/(${num(b)} ${M} ${num(a)}) = ${num(fb - fa)}/${b - a} = ${frac(fb - fa, b - a)}.`, [frac(fb - fa + 1, b - a)])
  }),
  // 22. The other diagonal of a rhombus.
  form(NO_CALC[14], function rhombusDiagonal() {
    const x1 = r(0, 3), y1 = r(0, 3), dx = 2 * r(1, 4), dy = 2 * r(1, 5), mx = x1 + dx / 2, my = y1 + dy / 2, s = frac(-dx, dy), b = my + (dx * mx) / dy
    return ask(`Rhombus MATH has opposite corners M(${x1}, ${y1}) and T(${x1 + dx}, ${y1 + dy}). Line ℓ passes through the other two corners, A and H. Which is the equation of ℓ?`, `y = ${coef(-dx, dy)}x + ${frac(Math.round(b * dy), dy)}`,
      [`y = ${coef(-dy, dx)}x + ${frac(Math.round(b * dy), dy)}`, `y = ${coef(dy, dx)}x + ${frac(Math.round(b * dy), dy)}`, `y = ${coef(-dx, dy)}x + ${my}`].filter((x) => x !== `y = ${coef(-dx, dy)}x + ${frac(Math.round(b * dy), dy)}`),
      `The diagonals of a rhombus cross at right angles at their midpoints. MT has slope ${frac(dy, dx)} and midpoint (${mx}, ${my}). ℓ has slope ${s} through (${mx}, ${my}): y = ${coef(-dx, dy)}x + ${frac(Math.round(b * dy), dy)}.`, [`y = ${coef(-dx, dy)}x + ${frac(Math.round(b * dy) + dy, dy)}`])
  }),
  // 23. A horizontal line meeting a circle twice.
  form(T6_NOCALC[13], function circleLineTwice() {
    const h = r(-3, 3), k = r(-3, 3), R = r(2, 6), c = R * R - h * h - k * k
    const xs = h ? ` ${h > 0 ? M : '+'} ${Math.abs(2 * h)}x` : '', ys = k ? ` ${k > 0 ? M : '+'} ${Math.abs(2 * k)}y` : ''
    const good = k + r(-(R - 1), R - 1)
    return ask(`x² + y²${xs}${ys} = ${num(c)} and y = c. For which value of c does the system have exactly two real solutions?`, `c = ${num(good)}`, [`c = ${num(k + R)}`, `c = ${num(k + R + 1)}`, `c = ${num(k - R - 2)}`],
      `Complete the squares: (x ${M} ${num(h)})² + (y ${M} ${num(k)})² = ${R * R}, a circle of radius ${R} centred at (${num(h)}, ${num(k)}). It spans y from ${num(k - R)} to ${num(k + R)}. A flat line crosses it twice only strictly between those: c = ${num(good)}. At ${num(k + R)} it only touches once.`)
  }),
  // 24. A segment of the hypotenuse from a sine.
  form(T4_NOCALC[15], function hypotenusePieceSine() {
    const s = pick([0.2, 0.3, 0.4, 0.5, 0.6]), AC = 5 * r(1, 6), BC = AC * s
    return ask(`Triangle ABC has a right angle at B, and BD goes straight from B to AC. If AC = ${AC} and sin A = ${s}, how long is DC?`, dec(BC * s), [dec(BC), dec(AC * s * s * 2), dec(AC - BC)].filter((x) => x !== dec(BC * s)),
      `sin A = BC/AC, so BC = ${dec(BC)}. Angle DBC equals angle A, so DC = BC × sin A = ${dec(BC * s)}.`, [dec(BC * s + 1)])
  }),
  // 25. Where a circle crosses the x-axis.
  form(CALC[17], function circleXIntercept() {
    const [a, b, R] = pick([[8, 15, 17], [3, 4, 5], [5, 12, 13], [6, 8, 10], [9, 12, 15]]), h = r(-4, 5)
    return ask(`A circle centred at (${num(h)}, 0) passes through (${num(h + a)}, ${b}). Point R is where it crosses the negative side of the x-axis. What are the coordinates of R?`, pt(h - R, 0), [pt(h - a, 0), pt(-R, 0), pt(h - b, 0)].filter((x) => x !== pt(h - R, 0)),
      `The radius is √(${a}² + ${b}²) = ${R}. Going ${R} left from (${num(h)}, 0) gives R = ${pt(h - R, 0)}.`, [pt(h - R - 1, 0)])
  }),
  // 26. Matching coefficients with three unknowns.
  form(NO_CALC[12], function matchThree() {
    // The constant on the right is k itself, so k = a + b + 1 keeps everything consistent.
    let a, b, k; do { a = r(1, 6); b = r(-3, 4); k = a + b + 1 } while (b === 0 || k < 1)
    const D = a - 2 * b
    return ask(`(a + b)x² + (a ${M} 2b)x + k = (k ${M} 1)x² + ${num(D)}x + ${k} for all x, where a, b and k are constants. What is a?`, num(a), [num(b), num(k), num(D)].filter((x) => x !== num(a)),
      `Numbers: k = ${k}. Then a + b = k ${M} 1 = ${a + b}, and a ${M} 2b = ${num(D)}. Subtract: 3b = ${num(a + b - D)}, so b = ${num(b)} and a = ${a + b} ${M} (${num(b)}) = ${num(a)}.`, [num(a + 1)])
  }),
  // 27. A quarter circle minus a rectangle.
  form(T8_NOCALC[1], function quarterMinusRectangle() {
    const d = 2 * r(3, 8), ang = pick([30, 60, 45])
    const w = d * Math.cos((ang * Math.PI) / 180), h = d * Math.sin((ang * Math.PI) / 180), area = (Math.PI * d * d) / 4 - w * h
    return ask(`Rectangle ABCO has corner O at the centre of a quarter circle, and corner B on the arc. Diagonal AC is ${d} long and angle ACO is ${ang}°. To the nearest whole number, what is the area inside the quarter circle but outside the rectangle?`, String(Math.round(area)), [String(Math.round((Math.PI * d * d) / 4)), String(Math.round(w * h)), String(Math.round(area) + 5)],
      `The rectangle's diagonals are equal, so OB = AC = ${d}, the radius. OC = ${d}cos ${ang}° ≈ ${dec(w)} and OA = ${d}sin ${ang}° ≈ ${dec(h)}. Quarter circle: π(${d})²/4 ≈ ${dec((Math.PI * d * d) / 4)}. Minus the rectangle ${dec(w * h)}: about ${Math.round(area)}.`)
  }),
  // 28 and 29. A launched object's peak time and height.
  form(CALC[8], function rocketPeak() {
    const g = 9.8, t = 5 * r(2, 6), v0 = g * t, h0 = 10 * r(1, 10), hmax = v0 * t - 0.5 * g * t * t + h0, askT = pick([true, false])
    return ask(`A rocket is launched from ${h0} metres up at ${dec(v0)} metres per second. Its height is h = ${dec(v0)}t ${M} 4.9t² + ${h0}. ${askT ? 'How many seconds does it take to reach its highest point?' : 'What is its greatest height, in metres?'}`,
      askT ? t : dec(hmax), askT ? [t * 2, t / 2, t + 5] : [dec(hmax - h0), dec(v0 * t), dec(hmax * 2)],
      `The top is at t = ${dec(v0)}/(2 × 4.9) = ${t}. h(${t}) = ${dec(v0 * t)} ${M} ${dec(4.9 * t * t)} + ${h0} = ${dec(hmax)}.`)
  }),
  // 30. A triangle on a base along the x-axis.
  form(CALC[16], function triangleOnAxis() {
    let k, p; do { k = r(3, 9); p = r(1, k - 1) } while (((k - p) * k) % 2)
    const A = ((k - p) * k) / 2, x = r(k + 1, k + 6)
    return ask(`Triangle PRS has P(${p}, 0), S(k, 0) and R(${x}, k), with k > ${p}. Its area is ${A}. What is k?`, k, [k + 1, k - 1, x].filter((v) => v !== k),
      `The base PS is k ${M} ${p} and the height is k (R's height). (1/2)(k ${M} ${p})k = ${A}, so k² ${M} ${p}k ${M} ${2 * A} = 0 and k = ${k}.`, [k + 2])
  }),
  // 31. Isosceles triangle hanging from a parabola chord.
  form(T3_NOCALC[5], function chordTriangle() {
    const c = r(3, 6), w = 2 * r(1, c - 1), half = w / 2, y = (c + half) * (c - half)
    return ask(`y = x(${2 * c} ${M} x). Points A and B are on the graph with AB = ${w} and AB parallel to the x-axis. C is on the x-axis, directly below the midpoint of AB. What is the area of triangle ABC?`, (w * y) / 2, [w * y, y, (w * c * c) / 2].filter((x) => x !== (w * y) / 2),
      `The graph is symmetric about x = ${c}, so A and B are at x = ${c - half} and ${c + half}, both at height ${c - half} × ${c + half} = ${y}. Area = (1/2)(${w})(${y}) = ${(w * y) / 2}.`)
  }),
  // 32. Size of a complex number.
  form(NO_CALC[1], function complexModulus() {
    const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]), s1 = pick([1, -1]), s2 = pick([1, -1])
    return ask(`The size (magnitude) of a complex number is its distance from the origin. What is the magnitude of ${num(s1 * a)} ${s2 < 0 ? M : '+'} ${b}i?`, c, [a + b, c * c, Math.abs(a - b)].filter((x) => x !== c),
      `Magnitude = √(${a}² + ${b}²) = √${a * a + b * b} = ${c}.`)
  }),
  // 33. Count whole-number points under a line.
  function latticeCount() {
    const a = r(2, 6), b = r(2, 6), c = r(10, 30)
    let n = 0; for (let x = 1; x < 30; x++) for (let y = 1; y < 30; y++) if (a * x + b * y < c) n++
    return ask(`For how many pairs of positive integers (x, y) is ${a}x + ${b}y < ${c}?`, n, [n + 1, n - 1, n + 3].filter((x) => x >= 0),
      `Go through y = 1, 2, …: for each, count the positive x with ${a}x < ${c} ${M} ${b}y. The counts add to ${n}.`, [n + 2])
  },
  // 34. A strip between parallel lines in a triangle.
  form(T5_NOCALC[19], function triangleStripThirds() {
    const n = 3, base = r(2, 10) * 5, total = (base * 9) / 5, strip = (total * 3) / 9
    return ask(`In triangle ABC, lines DE, FG and AC are parallel, with D and F on side AB so that AF = FD = DB. If the four-sided region AFGC has area ${base}, what is the area of DEGF?`, dec(strip), [dec(base), dec(total / 9), dec(base / 2)].filter((x) => x !== dec(strip)),
      `Triangles DBE, FBG and ABC are similar with sides 1 : 2 : ${n}, so areas 1 : 4 : 9 (in ninths of ABC). AFGC is 9 ${M} 4 = 5 ninths = ${base}, so ABC = ${dec(total)}. DEGF is 4 ${M} 1 = 3 ninths = ${dec(strip)}.`, [dec(strip + 2)])
  }),
  // 35. Rectangle between y = x² and y = −x².
  form(T3_NOCALC[5], function rectangleTwoParabolas() {
    const x = r(2, 6), area = 4 * x ** 3
    return ask(`Rectangle ABCD has B and C on y = x² and A and D on y = ${M}x², with its sides parallel to the axes. If its area is ${area}, how long is BC?`, 2 * x, [x, x * x, 2 * x * x].filter((v) => v !== 2 * x),
      `With corners at x = ±t, BC = 2t and the height is t² ${M} (${M}t²) = 2t². Area = 4t³ = ${area}, so t = ${x} and BC = ${2 * x}.`)
  }),
  // 36. Infinitely many solutions with a constant on one side.
  form(T5_NOCALC[18], function infinitelyManyConstant() {
    const p = r(2, 6), q = r(2, 5), k = pick([-2, 2, -3, 3, 1.5, -1.5]), C2 = r(1, 6), a = 1 - (C2 / k)
    if (!Number.isInteger(a * 2)) return infinitelyManyConstant()
    return ask(`${p}s ${M} ${q}t ${M} 1 = ${M}a and ${dec(p * k)}s + bt ${M} ${C2} = 0. If this system has infinitely many solutions, what is a?`, dec(a), [dec(-a), dec(1 + C2 / k), dec(C2)].filter((x) => x !== dec(a)),
      `Write them as ${p}s ${M} ${q}t = 1 ${M} a and ${dec(p * k)}s + bt = ${C2}. The second must be ${dec(k)} times the first: ${C2} = ${dec(k)}(1 ${M} a), so a = ${dec(a)}.`)
  }),
  // 37. Circumference of the circle inside a right triangle.
  form(T2_CALC[32], function incircleCircumference() {
    const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]), rr = (a + b - c) / 2
    return ask(`A circle touches all three sides of right triangle ABC, which has its right angle at C. If AB = ${c} and BC = ${a}, what is the circle's circumference, to the nearest tenth?`, dec(2 * Math.PI * rr, 1), [dec(Math.PI * rr * rr, 1), dec(Math.PI * rr, 1), dec(2 * Math.PI * (rr + 1), 1)],
      `AC = √(${c}² ${M} ${a}²) = ${b}. The radius is (${a} + ${b} ${M} ${c})/2 = ${rr}. Circumference = 2π(${rr}) ≈ ${dec(2 * Math.PI * rr, 1)}.`)
  }),
  // 38. Constant from a known factor.
  form(CALC[22], function factorConstant() {
    const c = pick([1, 2, 3, -1]), cs = [r(1, 4), r(-9, 4), r(-6, 9)], v = cs[0] * c * c + cs[1] * c + cs[2]
    return ask(`f(x) = ${poly(cs)} ${M} k, where k is a constant. If (x ${c > 0 ? M : '+'} ${Math.abs(c)}) is a factor of f(x), what is k?`, num(v), [num(-v), num(v + cs[0]), num(cs[2])].filter((x) => x !== num(v)),
      `A factor (x ${c > 0 ? M : '+'} ${Math.abs(c)}) means f(${num(c)}) = 0: ${num(v)} ${M} k = 0, so k = ${num(v)}.`, [num(v + 1)])
  }),
]

// Practice test 6, section 4 (calculator), questions 1 to 38. All but the angle question are new forms of existing types.
// An angle in radians as a multiple of π: 105 degrees -> "7π/12".
const piRad = (deg) => { const g = gcd(deg, 180), n = deg / g, d = 180 / g; return `${n === 1 ? '' : n}π${d === 1 ? '' : '/' + d}` }
// "k√s" with k = 1 shown as "√s".
const rootOf = (k, s) => `${k === 1 ? '' : k}√${s}`
const T6_CALC = [
  // 1. Put in the value, then solve for the other letter.
  form(T2_NOCALC[0], function productSolve() {
    let t, a, y, b, c; do { t = r(1, 6); a = r(1, 6); y = r(2, 9); b = r(-5, 5); c = (t + a) * y - t * t - b * t } while (c === 0 || b === 0)
    return ask(`If (x + ${a})y = ${poly([1, b, c])}, what is the value of y when x = ${t}?`, y, [y + a, (t + a) * y, y - 1],
      `Put x = ${t}: (${t} + ${a})y = ${t * t}${tail(b * t)}${tail(c)} = ${(t + a) * y}. So y = ${(t + a) * y}/${t + a} = ${y}.`, [y + 2])
  }),
  // 2. New price for some of the items.
  form(NO_CALC[6], function cutPriceCost() {
    const n = pick([8, 10, 12, 20]), m = r(2, 5), cut = r(1, 3)
    return ask(`The total cost of ${n} notebooks that all cost the same is k dollars. If the price of each notebook is cut by $${cut}, how much will ${m} notebooks cost at the new price?`,
      `${coef(m, n)}k ${M} ${m * cut}`, [`k ${M} ${cut}`, `${coef(m, n)}k ${M} ${cut}`, `${coef(1, n)}k ${M} ${m * cut}`],
      `One notebook costs k/${n}, so the new price is k/${n} ${M} ${cut}. ${m} of them cost ${m}(k/${n} ${M} ${cut}) = ${coef(m, n)}k ${M} ${m * cut}.`)
  }),
  // 3. Growth factor in an exponential model.
  form(CALC[14], function growthFactor() {
    const p = pick([1.5, 2.4, 2.8, 3.5, 4.2, 6.5]), base = pick([180, 250, 320, 400])
    return ask(`The yearly cost of servicing a boiler goes up by ${p}% each year. ${pick(NAMES)} paid $${base} this year, and the cost t years from now is C(t) = ${base}Pᵗ. What is the value of P?`,
      dec(1 + p / 100, 3), [dec(p / 100, 3), dec(p / 10, 2), dec(1 + p / 10, 2)],
      `Going up by ${p}% means each year's cost is 100% + ${p}% = ${dec(1 + p / 100, 3)} times the year before, so P = ${dec(1 + p / 100, 3)}.`)
  }),
  // 4. Value of an exponential model after some years.
  form(CALC[15], function growthAmount() {
    const p = pick([2, 2.5, 3, 4, 5, 6]), base = pick([200, 250, 320, 400, 500]), y = r(3, 6), v = (t, q) => Math.round(base * (1 + q / 100) ** t)
    return ask(`A yearly service fee is $${base} now and goes up by ${p}% each year. To the nearest dollar, what will the fee be ${y} years from now?`,
      `$${v(y, p)}`, [`$${v(y - 2, p)}`, `$${v(y, 2 * p)}`, `$${v(y, 3 * p)}`],
      `Each year multiplies the fee by ${dec(1 + p / 100, 3)}. After ${y} years: ${base}(${dec(1 + p / 100, 3)})${sup(y)} ≈ $${v(y, p)}.`, [`$${v(y + 2, p)}`, `$${v(y - 1, p)}`])
  }),
  // 5. Describe the graph of a line given in intercept form.
  form(T6_NOCALC[3], function interceptFormGraph() {
    const p = r(2, 9), q = r(2, 9), neg = pick([true, false])
    const says = (up, above) => `It goes ${up ? 'up' : 'down'} from left to right and crosses the y-axis ${above ? 'above' : 'below'} the origin.`
    return ask(`x/${p} ${neg ? M : '+'} y/${q} = 1. In the xy-plane, which of the following describes the graph of the equation above?`, says(neg, !neg),
      [says(!neg, !neg), says(neg, neg), says(!neg, neg)],
      `Solve for y: y = ${neg ? `${coef(q, p)}x ${M} ${q}` : `${M}${coef(q, p)}x + ${q}`}. The slope is ${neg ? 'positive' : 'negative'} and the y-intercept is ${neg ? M : ''}${q}.`)
  }),
  // 6. Which constants give no solution.
  form(T4_NOCALC[9], function noSolutionConstants() {
    const m = pick([0.4, 0.6, 0.8, 1.5, 2.5]), c = r(2, 9), d = pick([m, c + r(1, 3)])
    return ask(`ax + ${c} = ${m}x + b. In the equation above, a and b are constants. For which of the following values of a and b does the equation have no solution?`,
      `a = ${m}, b = ${d}`, [`a = ${m}, b = ${c}`, `a = ${c}, b = ${m}`, `a = ${2 * c}, b = ${c}`],
      `No solution means the x terms cancel but the numbers do not: a = ${m} and b ≠ ${c}. Only a = ${m}, b = ${d} does that. (a = ${m}, b = ${c} gives infinitely many solutions.)`)
  }),
  // 7. Angle between a line through the origin and the positive x-axis, in radians.
  function angleFromSlope() {
    const [slope, deg] = pick([['√3', 60], ['', 45], ['(√3/3)', 30], [`${M}√3`, 120], [M, 135], [`${M}(√3/3)`, 150]])
    const all = [30, 45, 60, 90, 120, 135, 150].filter((x) => x !== deg).sort(() => Math.random() - 0.5)
    return ask(`In the xy-plane, O is the origin, P is a point on the line y = ${slope}x above the x-axis, and R is a point on the positive x-axis. What is the measure, in radians, of angle POR?`,
      piRad(deg), all.slice(0, 3).map(piRad),
      `The slope is the tangent of the angle the line makes with the positive x-axis. tan θ = ${slope.replace(/[()]/g, '') || '1'}${slope === M ? '1' : ''} gives θ = ${deg}°, which is ${piRad(deg)} radians.`)
  },
  // 8. Simplify a complex fraction with i in the bottom.
  form(NO_CALC[1], function overI() {
    let p, q, plus, V; do { p = r(1, 6); q = r(1, 6); plus = pick([true, false]); V = plus ? p - q : p + q } while (V === 0)
    const ci = (n) => (n === 1 ? 'i' : n === -1 ? `${M}i` : `${num(n)}i`)
    return ask(`If i = √${M}1, which of the following is equal to (${p} ${plus ? '+' : M} ${q}i²)/i?`, ci(-V), [ci(V), num(V), `${num(-V)} + i`],
      `i² = ${M}1, so the top is ${p} ${plus ? M : '+'} ${q} = ${num(V)}. Then ${num(V)}/i = ${num(V)}i/i² = ${ci(-V)}.`, [ci(V + 1), ci(-V - 1)])
  }),
  // 9. Remainder when dividing by x − t.
  form(T5_NOCALC[14], function remainderValue() {
    const t = pick([1, 2, 3, -1, -2]), b = r(-6, 6), c = r(-9, 9), R = t * t + b * t + c
    return ask(`What is the remainder when ${poly([1, b, c])} is divided by x ${t > 0 ? M : '+'} ${Math.abs(t)}?`, R, [t * t - b * t + c, c, R + t],
      `The remainder is the value at x = ${num(t)}: (${num(t)})²${tail(b)}(${num(t)})${tail(c)} = ${num(R)}.`, [R + 1, R - 1])
  }),
  // 10. Product of two k-th roots.
  form(NO_CALC[13], function rootProduct() {
    const [c, k] = pick([[2, 4], [2, 5], [2, 6], [2, 7], [3, 3], [3, 4], [2, 8]]), m = r(1, k - 1), a = c ** m, b = c ** (k - m)
    return ask(`(ᵏ√${a})(ᵏ√${b}) = ${c}. In the equation above, ᵏ√ means the k-th root. What is the value of k?`, k, [k - 1, k + 1, m],
      `The roots multiply: ᵏ√(${a} × ${b}) = ᵏ√${a * b} = ${c}. Since ${c}${sup(k)} = ${a * b}, k = ${k}.`, [k + 2, k - 2])
  }),
  // 11. Constant that makes two lines perpendicular.
  form(NO_CALC[14], function perpendicularConstant() {
    let p, q; do { p = r(1, 4); q = r(1, 6) } while (p === q)
    const c1 = r(1, 9), c2 = r(1, 9)
    return ask(`ax ${M} y = ${c1} and ${p === 1 ? '' : p}x + ${q}y = ${c2}. If the lines represented above are perpendicular, what is the value of a?`, frac(q, p), [frac(-q, p), frac(p, q), frac(-p, q)],
      `The first line has slope a. The second has slope ${M}${frac(p, q)}. Perpendicular slopes multiply to ${M}1: a × (${M}${frac(p, q)}) = ${M}1, so a = ${frac(q, p)}.`)
  }),
  // 12. Hourly rate from two pay amounts.
  form(CALC[18], function extraHoursRate() {
    const h = r(3, 9), who = pick(NAMES)
    return ask(`${who} works one week and earns a dollars. If ${who} had worked ${h} more hours that week, the pay would have been b dollars. If the hourly rate is the same, what is the hourly rate, in dollars?`,
      `(b ${M} a)/${h}`, [`b/${h}`, `a/${h}`, `(a ${M} b)/${h}`],
      `The extra ${h} hours brought in b ${M} a dollars, so one hour pays (b ${M} a)/${h}.`)
  }),
  // 13. Fill in a missing cell of a two-way table.
  form(T2_NOCALC[18], function tableMissingCell() {
    const [A, B, C] = ['New Year', 'Easter', 'Christmas'], mA = r(20, 60), mB = r(20, 60), mC = r(20, 60), fA = r(20, 70), fB = r(20, 70), fC = r(20, 70)
    const MT = mA + mB + mC, TB = mB + fB, TC = mC + fC, T = MT + fA + fB + fC
    return ask(`In a survey, people chose their favorite holiday: ${A}, ${B} or ${C}. ${mA} males chose ${A} and ${mC} males chose ${C}, and ${MT} males answered in all. ${fA} females chose ${A}. ${TB} people chose ${B}, ${TC} chose ${C}, and ${T} people answered. How many females chose ${B}?`,
      fB, [mB, TB - mA, fC].filter((v) => v !== fB),
      `Males who chose ${B}: ${MT} ${M} ${mA} ${M} ${mC} = ${mB}. Females who chose ${B}: ${TB} ${M} ${mB} = ${fB}.`, [fB + 5, fB - 5])
  }),
  // 14. Which cell is a given percent of the total.
  form(T2_NOCALC[18], function tablePercentCell() {
    let mA, mB, mC, fA, fB, fC, T, cells, pick1
    do {
      mA = r(20, 60); mB = r(20, 60); mC = r(20, 60); fA = r(20, 70); fB = r(20, 70); fC = r(20, 70); T = mA + mB + mC + fA + fB + fC
      cells = [[`Females who chose Easter`, fB], [`Males who chose Christmas`, mC], [`Females who chose New Year`, fA], [`Females who chose Christmas`, fC]]
      pick1 = r(0, 3)
    } while (cells.some(([, v], i) => i !== pick1 && Math.abs(Math.round((100 * v) / T) - Math.round((100 * cells[pick1][1]) / T)) < 3))
    const pc = Math.round((100 * cells[pick1][1]) / T)
    return ask(`In a survey, ${T} people chose their favorite holiday: New Year, Easter or Christmas. ${mA} males chose New Year, ${mC} males chose Christmas and ${mA + mB + mC} males answered in all. ${fA} females chose New Year, ${mB + fB} people chose Easter and ${mC + fC} chose Christmas. Which group is about ${pc}% of everyone who answered?`,
      cells[pick1][0], cells.filter((_, i) => i !== pick1).map((c) => c[0]),
      `Fill in the table: females who chose Easter = ${mB + fB} ${M} ${mB} = ${fB}, females who chose Christmas = ${mC + fC} ${M} ${mC} = ${fC}. ${cells[pick1][1]}/${T} ≈ ${pc}%.`)
  }),
  // 15. True statements about a linear cost model.
  form(NO_CALC[17], function linearModelStatements() {
    let s, b, K, IIok, IIIok, d; do { s = pick([1.5, 2.5, 0.5, 4, 1.2]) * pick([1, -1]); b = 10 * r(20, 50); K = 10 * r(1, 4); d = 10; IIok = pick([true, false]); IIIok = pick([true, false]) } while (!(s > 0 || IIok || IIIok))
    const C = b + s * K, shownC = IIok ? C : C + 10 * pick([1, -1]), step = Math.abs(s * d), dir = IIIok === s < 0 ? 'decreases' : 'increases'
    const right = romanLabel([s > 0, IIok, IIIok])
    return ask(`C = ${dec(s, 1)}K + ${b}. The equation above gives the cost C, in dollars, of producing K toys. Which of the following must be true? I. There is a positive correlation between C and K. II. When the company produces ${K} toys, the cost is $${dec(shownC, 1)}. III. As K increases by ${d}, C ${dir} by $${dec(step, 1)}.`,
      right, romanWrong(right),
      `I: the slope ${dec(s, 1)} is ${s > 0 ? 'positive, so true' : 'negative, so false'}. II: C = ${dec(s, 1)}(${K}) + ${b} = ${dec(C, 1)}, so ${IIok ? 'true' : 'false'}. III: 10 more toys change C by ${dec(s * d, 1)}, so ${IIIok ? 'true' : 'false'}.`)
  }),
  // 16. Match coefficients when the constant also depends on k.
  form(NO_CALC[12], function matchWithK() {
    let q, p, c; do { q = r(2, 5); p = r(1, 6); c = p * (q - 1) - q } while (c === 0)
    const k = p + q
    return ask(`If x² + kx + k${tail(c)} = (x + p)(x + ${q}) for all values of x, where k and p are constants, what is the value of k?`, k, [p, q, p * q].filter((v) => v !== k),
      `Expand: x² + (p + ${q})x + ${q}p. So k = p + ${q} and k${tail(c)} = ${q}p. Then p + ${q + c} = ${q}p, so p = ${p} and k = ${k}.`, [k + 1, k - 1])
  }),
  // 17. Solve for k inside a function value.
  form(T2_CALC[29], function functionAtRoot() {
    let a, k, b, n, v; do { a = r(2, 4); k = r(2, 9); b = r(1, 9); n = pick([2, 3]); v = (a * k - b) / n } while (!Number.isInteger(v) || v <= 0)
    return ask(`f(x) = ${a}x² ${M} ${b}. If (1/${n})f(√k) = ${v}, what is the value of k?`, k, [k * k, n * v + b, v],
      `f(√k) = ${a}k ${M} ${b}. So (${a}k ${M} ${b})/${n} = ${v}, ${a}k ${M} ${b} = ${n * v}, ${a}k = ${n * v + b} and k = ${k}.`, [k + 1, k - 1])
  }),
  // 18. Angle between two points seen from the origin, in radians.
  form(null, function angleBetweenPoints() { // joins angleFromSlope below the list
    const at = (deg, k) => ({
      30: [rootOf(k, 3), String(k)], 45: [rootOf(k, 2), rootOf(k, 2)], 60: [String(k), rootOf(k, 3)],
      120: [`${M}${k}`, rootOf(k, 3)], 135: [`${M}${rootOf(k, 2)}`, rootOf(k, 2)], 150: [`${M}${rootOf(k, 3)}`, String(k)],
    })[deg]
    const a = pick([30, 45, 60]), b = pick([120, 135, 150]), A = at(a, r(1, 6)), B = at(b, r(1, 6))
    return ask(`In the xy-plane, O is the origin, A = (${A[0]}, ${A[1]}) and B = (${B[0]}, ${B[1]}). What is the measure, in radians, of angle AOB?`,
      piRad(b - a), [piRad(180 - (b - a)), piRad(b), piRad(a)],
      `OA makes ${a}° with the positive x-axis (tan = ${A[1]}/${A[0]}) and OB makes ${b}°. Angle AOB = ${b}° ${M} ${a}° = ${b - a}°, which is ${piRad(b - a)} radians.`, [piRad(b - a + 15), piRad(b - a - 15)])
  }),
  // 19. Coordinates of a corner of a regular hexagon.
  form(T2_NOCALC[7], function hexagonCorner() {
    const s0 = r(1, 8), L = pick([2, 3, 4, 5, 6, 8]), left = pick([true, false])
    const right = left ? s0 - L / 2 : s0 + 1.5 * L
    return ask(`A regular hexagon with sides of length ${L} sits on the x-axis: its bottom side runs from (${s0}, 0) to (${s0 + L}, 0). P(a, b) is the corner of the hexagon farthest to the ${left ? 'left' : 'right'}. What is the value of a?`,
      dec(right, 1), left ? [dec(s0 - L, 1), dec(s0, 1), dec(s0 - L * 0.87, 1)] : [dec(s0 + L, 1), dec(s0 + 2 * L, 1), dec(s0 + L + L * 0.87, 1)],
      `Each corner of a regular hexagon is 120°. The slanted side from the bottom corner goes out at 60° from the x-axis, so it moves ${L} × cos 60° = ${dec(L / 2, 1)} sideways. a = ${left ? `${s0} ${M} ${dec(L / 2, 1)}` : `${s0 + L} + ${dec(L / 2, 1)}`} = ${dec(right, 1)}.`, [dec(right + 0.5, 1), dec(right - 0.5, 1)])
  }),
  // 20. What a point in a system of inequalities tells you about the constants.
  form(T2_CALC[7], function inequalityConstants() {
    const y0 = r(-3, 5), m1 = r(-4, -1), m2 = r(1, 4), aBelow = pick([true, false])
    const q = aBelow ? `y > ${m1 === -1 ? M : num(m1)}x + a and y < ${m2 === 1 ? '' : m2}x + b` : `y < ${m1 === -1 ? M : num(m1)}x + a and y > ${m2 === 1 ? '' : m2}x + b`
    return ask(`${q}. In this system of inequalities, a and b are constants. If (0, ${num(y0)}) is a solution of the system, which of the following must be true?`,
      aBelow ? 'a < b' : 'a > b', [aBelow ? 'a > b' : 'a < b', 'a = b', 'a = −b'],
      `Put x = 0, y = ${num(y0)}: ${aBelow ? `${num(y0)} > a and ${num(y0)} < b, so a < ${num(y0)} < b` : `${num(y0)} < a and ${num(y0)} > b, so b < ${num(y0)} < a`}.`)
  }),
  // 21. Solution set when one factor is a quadratic with irrational roots.
  form(T3_NOCALC[12], function cubicSolutionSet() {
    let t, h, D; do { t = r(-4, 4); h = r(-4, 4); D = pick([2, 3, 5, 6, 7, 10, 11]) } while (h === 0 || t === 0)
    const c = h * h - D, set = (a, root) => `{${num(a)}, ${num(root[0])} ± ${root[1]}}`
    return ask(`(x ${t > 0 ? M : '+'} ${Math.abs(t)})(${poly([1, 2 * h, c])}) = 0. Which of the following is the solution set of the equation above?`,
      set(t, [-h, `√${D}`]), [set(t, [h, `√${D}`]), set(-t, [-h, `√${D}`]), set(t, [-h, `2√${D}`])],
      `The first factor gives x = ${num(t)}. For ${poly([1, 2 * h, c])} = 0, complete the square: (x ${h > 0 ? '+' : M} ${Math.abs(h)})² = ${D}, so x = ${num(-h)} ± √${D}.`)
  }),
  // 22. Statements about two triangles made by parallel segments.
  form(NO_CALC[18], function parallelBowtie() {
    const yes = ['AB/CD = BE/CE', 'AB/CD = AE/DE', '∠ABE = ∠DCE', '∠BAE = ∠CDE', 'AE · CE = BE · DE']
    const no = ['BE · CE = AE · DE', '∠ABE = ∠CDE', 'BC ⊥ AD', 'AB/CD = BE/DE', 'AB/CD = CE/BE', '∠BAE = ∠DCE'].sort(() => Math.random() - 0.5)
    const right = pick(yes)
    return ask(`Segments AD and BC cross at point E, and AB is parallel to CD (A and B are on one side of E, C and D on the other). Which of the following must be true?`, right, no.slice(0, 3),
      `AB ∥ CD makes the alternate angles equal (∠ABE = ∠DCE and ∠BAE = ∠CDE), so triangle ABE is similar to triangle DCE with A↔D, B↔C, E↔E. Matching sides: AB/DC = BE/CE = AE/DE, which also gives AE · CE = BE · DE.`)
  }),
  // 23. Find a coefficient of a cubic from where its graph crosses the axes.
  form(CALC[22], function cubicFromGraph() {
    let p, r1, r2, r3, s1; do { p = pick([1, 2]); [r1, r2, r3] = [r(-4, -1), r(1, 4), pick([r(-5, -1), r(1, 5)])]; s1 = r1 + r2 + r3 } while (s1 === 0 || new Set([r1, r2, r3]).size < 3)
    const a = p * (r1 * r2 + r1 * r3 + r2 * r3), b = -p * r1 * r2 * r3, x2 = -p * s1
    const head = `${p === 1 ? '' : p}x³ ${x2 < 0 ? M : '+'} ${Math.abs(x2) === 1 ? '' : Math.abs(x2)}x² + ax + b`
    return ask(`f(x) = ${head}, where a and b are constants. The graph of f crosses the y-axis at (0, ${num(b)}) and crosses the x-axis at x = ${num(r1)}, at x = ${r2} and at one other point. What is the value of a?`,
      a, [-a, b, a + p].filter((v) => v !== a),
      `f(0) = b, so b = ${num(b)}. Then f(${r2}) = 0: ${p * r2 ** 3}${tail(x2 * r2 * r2)} + ${r2}a${tail(b)} = 0, so ${r2}a = ${num(-(p * r2 ** 3 + x2 * r2 * r2 + b))} and a = ${num(a)}.`, [a + 1, a - 1, a + 2])
  }),
  // 24. Slope after shifting and stretching a line.
  form(T4_NOCALC[4], function shiftedSlope() {
    const c = pick([1, 1, 2, 3, -1, -2]), mn = r(1, 5), md = pick([2, 3, 5, 7].filter((d) => gcd(d, mn) === 1)), h = r(1, 6), k = r(-12, 12)
    return ask(`g(x) = ${coef(c)}f(x ${M} ${h})${k ? tail(k) : ''}. If the slope of the linear function f is ${frac(mn, md)}, what is the slope of the function g?`, frac(c * mn, md),
      [frac(-c * mn, md), frac(c * md, mn), frac(-c * md, mn)],
      `Sliding the graph ${h} right${k ? ` and ${Math.abs(k)} ${k > 0 ? 'up' : 'down'}` : ''} does not change its slope.${c === 1 ? '' : ` Multiplying by ${c} multiplies the slope by ${c}.`} The slope of g is ${frac(c * mn, md)}.`, [frac(mn + md, md), frac(c * mn + 1, md)])
  }),
  // 25. Absolute value inequality for a height limit.
  form(CALC[4], function heightLimitAbs() {
    const L = r(40, 50), half = r(4, 12), U = L + 2 * half, mid = L + half, out = pick([true, false])
    return ask(`A ride only lets on riders who are at least ${L} inches tall and at most ${U} inches tall. Which inequality describes the heights h, in inches, of people who are ${out ? 'NOT allowed' : 'allowed'} on the ride?`,
      `|h ${M} ${mid}| ${out ? '>' : '≤'} ${half}`, [`|h ${M} ${mid}| ${out ? '≤' : '>'} ${half}`, `|h ${M} ${L}| > ${U}`, `|h ${M} ${U}| > ${L}`],
      `The allowed heights run from ${L} to ${U}, centered at ${mid} with ${half} on each side: |h ${M} ${mid}| ≤ ${half}. ${out ? `Not allowed is the opposite: |h ${M} ${mid}| > ${half}.` : ''}`)
  }),
  // 26. Quadratic in 1/a.
  form(T6_NOCALC[16], function reciprocalQuadratic() {
    let u1, u2; do { u1 = r(1, 5); u2 = -r(1, 6) } while (u1 + u2 === 0)
    const p = -(u1 + u2), q = u1 * u2
    return ask(`a⁻² ${p < 0 ? M : '+'} ${Math.abs(p) === 1 ? '' : Math.abs(p)}a⁻¹ ${M} ${-q} = 0. In the equation above, a > 0. What is the value of a?`, frac(1, u1), [num(u1), frac(1, -u2), num(-u2)],
      `Let u = 1/a: u² ${p < 0 ? M : '+'} ${Math.abs(p) === 1 ? '' : Math.abs(p)}u ${M} ${-q} = 0, so (u ${M} ${u1})(u + ${-u2}) = 0. Since a > 0, u = ${u1}, so a = ${frac(1, u1)}.`, [frac(1, u1 + 1), frac(2, u1)])
  }),
  // 27. Diagonal of a cube from its volume or surface area.
  form(T5_NOCALC[9], function cubeDiagonalFrom() {
    const s = r(2, 7), byVol = pick([true, false]), face = pick([true, false])
    const right = face ? `${s}√2` : `${s}√3`
    return ask(`The ${byVol ? `volume of a cube is ${s ** 3}` : `surface area of a cube is ${6 * s * s}`}. What is the length of a diagonal of ${face ? 'one face of the cube' : 'the cube that goes through the inside, from one corner to the opposite corner'}?`,
      right, [String(s), face ? `${s}√3` : `${s}√2`, `${2 * s}√2`],
      `${byVol ? `s³ = ${s ** 3}` : `6s² = ${6 * s * s}`}, so s = ${s}. ${face ? `A face diagonal is s√2 = ${s}√2.` : `The long diagonal is √(s² + s² + s²) = s√3 = ${s}√3.`}`)
  }),
  // 28. Change in a formula when two letters change.
  form(T3_NOCALC[9], function formulaScale() {
    const [vw, vm] = pick([['doubled', 2], ['tripled', 3]]), [rw, rn, rd] = pick([['halved', 1, 2], ['doubled', 2, 1], ['tripled', 3, 1], ['cut to one third', 1, 3]])
    const f = frac(vm * vm * rd, rn)
    return ask(`F = kv²/r. In the equation above, k is a constant. If v is ${vw} and r is ${rw}, which of the following is true?`, `F is multiplied by ${f}.`,
      [`F is multiplied by ${frac(vm * rd, rn)}.`, `F is multiplied by ${frac(vm * vm * rn, rd)}.`, `F is multiplied by ${vm * vm}.`],
      `v² is multiplied by ${vm * vm}. Dividing by the new r multiplies F by ${frac(rd, rn)}. In all, F is multiplied by ${vm * vm} × ${frac(rd, rn)} = ${f}.`, [`F is multiplied by ${frac(vm * vm * rd + 1, rn)}.`])
  }),
  // 29. Square inside an isosceles triangle.
  form(NO_CALC[18], function squareInTriangle() {
    const [B, H] = pick([[10, 10], [6, 12], [12, 6], [15, 10], [20, 5], [12, 4], [8, 24], [30, 20], [24, 12]]), x = (B * H) / (B + H)
    return ask(`An isosceles triangle has a base of ${B} and a height of ${H}. A square sits on the base with its two top corners on the other two sides. What is the area of the square?`,
      x * x, [(x - 1) ** 2, (x + 1) ** 2, (B * H) / 4].filter((v) => v !== x * x),
      `Above the square is a smaller triangle like the big one, with base x and height ${H} ${M} x. So x/${B} = (${H} ${M} x)/${H}, ${H}x = ${B * H} ${M} ${B}x, x = ${x}. Area = ${x * x}.`, [x * x + 2 * x])
  }),
  // 30. Greatest or least difference from two absolute value equations.
  form(CALC[4], function absDifferenceExtreme() {
    const p = r(1, 6), s = r(3, 10), q = r(1, 6), t = r(3, 9), most = pick([true, false])
    const kHi = p + s, kLo = p - s, mHi = -q + t, mLo = -q - t, right = most ? kHi - mLo : kLo - mHi
    return ask(`|k ${M} ${p}| = ${s} and |m + ${q}| = ${t}. In the equations above, what is the ${most ? 'greatest' : 'least'} possible value of k ${M} m?`, right,
      [kHi - mHi, kLo - mLo, most ? s + t : -(s + t)].filter((v) => v !== right),
      `k = ${p} ± ${s}, so k is ${num(kLo)} or ${kHi}. m = ${M}${q} ± ${t}, so m is ${num(mLo)} or ${num(mHi)}. ${most ? `Greatest: ${kHi} ${M} (${num(mLo)}) = ${right}.` : `Least: ${num(kLo)} ${M} ${mHi < 0 ? `(${num(mHi)})` : mHi} = ${num(right)}.`}`, [right + 1, right - 1])
  }),
  // 31. Ratio of two pieces of a rectangle side from two tangents.
  form(T7_NOCALC[4], function rectangleTanRatio() {
    let a1, b1, a2, b2; do { a1 = r(1, 4); b1 = r(2, 6); a2 = r(1, 4); b2 = r(2, 7) } while (gcd(a1, b1) !== 1 || gcd(a2, b2) !== 1 || a1 * b2 === b1 * a2 || a1 >= b1 || a2 >= b2)
    return ask(`ABCD is a rectangle with AB on top and CD on the bottom. Point P is on side BC. If tan∠BAP = ${a1}/${b1} and tan∠CDP = ${a2}/${b2}, what is the value of BP/CP?`,
      frac(a1 * b2, b1 * a2), [frac(b1 * a2, a1 * b2), frac(a1 * a2, b1 * b2), frac(a1, a2)],
      `tan∠BAP = BP/AB, so BP = (${a1}/${b1})AB. tan∠CDP = CP/DC and DC = AB, so CP = (${a2}/${b2})AB. BP/CP = (${a1}/${b1}) ÷ (${a2}/${b2}) = ${frac(a1 * b2, b1 * a2)}.`)
  }),
  // 32. Same base on both sides with a squared exponent.
  form(NO_CALC[13], function squaredExponent() {
    const p = r(1, 5), base = pick(['a', 'a', '3', '5'])
    return ask(`${base}^((x + ${p})²) = (1/${base})^(${M}${4 * p}x).${base === 'a' ? ' In the equation above, a > 0 and a ≠ 1.' : ''} What is the value of x?`, p, [-p, 2 * p, 4 * p],
      `(1/${base})^(${M}${4 * p}x) = ${base}^(${4 * p}x). So (x + ${p})² = ${4 * p}x, x² ${M} ${2 * p}x + ${p * p} = 0, (x ${M} ${p})² = 0 and x = ${p}.`, [p + 1])
  }),
  // 33. Ratio of kinetic energies.
  form(T3_NOCALC[9], function energyRatio() {
    const n = pick([2, 3, 4]), v2 = pick([4, 5, 6, 8, 10]), v1 = v2 * pick([1, 2, 3])
    return ask(`Kinetic energy = (1/2)mv², where m is the mass and v is the speed. One cart has mass k kilograms and moves at ${v1} meters per second. Another has mass ${n}k kilograms and moves at ${v2} meters per second. What is the ratio of the first cart's kinetic energy to the second cart's?`,
      frac(v1 * v1, n * v2 * v2), [frac(v1, n * v2), frac(n * v2 * v2, v1 * v1), frac(v1 * v1, v2 * v2)],
      `First: (1/2)(k)(${v1})² = ${(v1 * v1) / 2}k. Second: (1/2)(${n}k)(${v2})² = ${(n * v2 * v2) / 2}k. Ratio = ${(v1 * v1) / 2}/${(n * v2 * v2) / 2} = ${frac(v1 * v1, n * v2 * v2)}.`, [frac(v1 * v1 + 1, n * v2 * v2)])
  }),
  // 34. Greatest height of h = ct(T − t).
  form(CALC[8], function productPeak() {
    const c = r(2, 5), T = 2 * r(5, 15), top = (c * T * T) / 4
    return ask(`h = ${c}t(${T} ${M} t). An arrow is shot straight up and comes back down. Its height h, in meters, t seconds after it is shot is given by the equation above. What is the greatest height, in meters, the arrow reaches?`,
      top, [c * T, (T / 2) ** 2, (c * T * T) / 2],
      `The height is 0 at t = 0 and t = ${T}, so it is greatest halfway, at t = ${T / 2}. h = ${c}(${T / 2})(${T / 2}) = ${top}.`, [top + c])
  }),
  // 35. Distance from the origin to a line.
  form(T8_NOCALC[4], function distanceToLine() {
    const [p, q, c] = pick([[4, 3, 5], [3, 4, 5], [8, 6, 10], [6, 8, 10], [5, 12, 13], [12, 5, 13], [15, 8, 17]])
    return ask(`Line ℓ passes through (0, ${q}) and (${p}, 0). Line m passes through the origin O and is perpendicular to ℓ, meeting it at P. What is the length of OP?`, frac(p * q, c),
      [frac(c, 2), frac(p * q, p + q), frac(p + q, 2)],
      `ℓ and the axes make a right triangle with legs ${p} and ${q} and hypotenuse ${c}. Its area is (1/2)(${p})(${q}) = ${(p * q) / 2}, which is also (1/2)(${c})(OP). So OP = ${p * q}/${c}${frac(p * q, c) === `${p * q}/${c}` ? '' : ` = ${frac(p * q, c)}`}.`)
  }),
  // 36. Infinitely many solutions with b in both equations.
  form(T5_NOCALC[18], function infinitelyManyB() {
    const s = r(2, 5), a = r(2, 6), A = s * a, B = s * s
    return ask(`${A}x + ${B}y = b and ax + by = 1. In the system of equations above, a and b are constants and b > 0. If the system has infinitely many solutions, what is the value of a?`,
      a, [s, A, a * s].filter((v) => v !== a),
      `The first equation must be a multiple of the second: ${A}/a = ${B}/b = b/1. From ${B}/b = b, b² = ${B} and b = ${s}. Then ${A}/a = ${s}, so a = ${a}.`, [a + 1, a - 1])
  }),
  // 37. Area of the trapezoid under where a line meets y = x².
  form(T4_CALC[T4_CALC.length - 2], function trapezoidUnderParabola() {
    const m = r(1, 3), u = r(1, 3), w = u + m, c = u * w, area = ((u * u + w * w) * (u + w)) / 2
    return ask(`f(x) = x² and g(x) = ${m === 1 ? '' : m}x + ${c}. The graphs of f and g meet at B (left) and C (right). A and D are the points on the x-axis straight below B and C. What is the area of quadrilateral ABCD?`,
      dec(area, 1), [dec(area * 2, 1), dec((w * w * (u + w)) / 2, 1), dec(((u + w) * (u + w)) / 2, 1)],
      `x² = ${m === 1 ? '' : m}x + ${c} gives (x + ${u})(x ${M} ${w}) = 0, so B = (${M}${u}, ${u * u}) and C = (${w}, ${w * w}). ABCD is a trapezoid with parallel sides ${u * u} and ${w * w} and width ${u + w}: area = (${u * u} + ${w * w})/2 × ${u + w} = ${dec(area, 1)}.`, [dec(area + 1, 1)])
  }),
  // 38. Slope of f from two values of g = pf + k.
  form(T3_NOCALC[1], function slopeThroughG() {
    const p = r(2, 4), x1 = r(0, 3), d = r(2, 5), x2 = x1 + d, y1 = r(-5, 12), dy = r(2, 20), y2 = y1 + dy
    return ask(`g(x) = ${p}f(x) + k. In the equation above, f is a linear function and k is a constant. If g(${x1}) = ${num(y1)} and g(${x2}) = ${num(y2)}, what is the slope of f?`, frac(dy, p * d),
      [frac(dy, d), frac(p * dy, d), frac(d, dy)],
      `The slope of g is (${num(y2)} ${M} ${y1 < 0 ? `(${num(y1)})` : y1})/(${x2} ${M} ${x1}) = ${frac(dy, d)}. The k does not change slope, and the ${p} multiplies it, so the slope of f is (${frac(dy, d)}) ÷ ${p} = ${frac(dy, p * d)}.`)
  }),
]
T6_CALC[17].sameAs = T6_CALC[6] // angleBetweenPoints is a form of angleFromSlope

// Practice test 7, section 4 (calculator), questions 2 to 38 (question 1 needs its drawn graph). All are new forms of existing types.
const T7_CALC = [
  // 2. Value of an expression from a ratio.
  form(T3_NOCALC[1], function ratioExpression() {
    let k, c, d, e, v; do { k = r(2, 5); c = r(2, 8); d = r(2, 6); e = r(2, 4); v = (c * d * k) / e } while (!Number.isInteger(v))
    return ask(`If x/y = ${k}, what is the value of ${c}(x²/y)(${d}/(${e}x))?`, v, [c * d * k, (c * d) / e, v * k].filter((w) => w !== v && Number.isInteger(w)),
      `Cancel one x: ${c}(x²/y)(${d}/(${e}x)) = (${c * d}/${e})(x/y) = (${c * d}/${e})(${k}) = ${v}.`, [v + 3, v - 3, v * 2])
  }),
  // 3. Angles made by a line crossing two parallel lines.
  form(CALC[2], function parallelAngleEquation() {
    let p, q, a, b, x, same, A1; do { p = r(1, 5); q = r(1, 5); x = r(10, 40) + pick([0, 0.5]); a = r(5, 30); same = pick([true, false]); A1 = p * x - a; b = same ? 180 - A1 - q * x : A1 - q * x } while (p === q || A1 <= 10 || A1 >= 170 || b === 0 || !Number.isInteger(b))
    const other = same ? (-a - b) / (q - p) : (180 + a - b) / (p + q)
    return ask(`Lines ℓ and m are parallel and are crossed by a third line. Between ℓ and m, ${same ? 'on the same side of the third line' : 'on opposite sides of the third line (alternate angles)'}, one angle is (${p === 1 ? '' : p}x ${M} ${a})° and the other is (${q === 1 ? '' : q}x${tail(b)})°. What is the value of x?`,
      dec(x, 1), [dec(other, 1), dec(x + 2.5, 1), dec(x - 2.5, 1)],
      same ? `Angles between the lines on the same side add to 180°: ${p === 1 ? '' : p}x ${M} ${a} + ${q === 1 ? '' : q}x${tail(b)} = 180, so ${p + q}x = ${180 + a - b} and x = ${dec(x, 1)}.`
        : `Alternate angles are equal: ${p === 1 ? '' : p}x ${M} ${a} = ${q === 1 ? '' : q}x${tail(b)}, so ${num(p - q)}x = ${num(a + b)} and x = ${dec(x, 1)}.`, [dec(x + 5, 1)])
  }),
  // 4. Difference of squares from a sum and a difference.
  form(NO_CALC[5], function squaresOverTwoX() {
    let s, d, useX, v; do { s = r(6, 20); d = r(2, 10); useX = pick([true, false]); v = (s * d) / (useX ? s + d : s - d) } while ((s + d) % 2 || d >= s || !Number.isInteger(v))
    return ask(`If x + y = ${s} and x ${M} y = ${d}, what is the value of (x² ${M} y²)/(2${useX ? 'x' : 'y'})?`, v, [s * d, (s + d) / 2, (s * d) / 2].filter((w) => w !== v),
      `x² ${M} y² = (x + y)(x ${M} y) = ${s * d}. Adding and subtracting the equations: 2x = ${s + d} and 2y = ${s - d}. So the value is ${s * d}/${useX ? s + d : s - d} = ${v}.`, [v + 1, v + 2])
  }),
  // 5. Extra cost from extra hours.
  form(NO_CALC[4], function extraHoursCost() {
    const a = 10 * r(5, 15), b = 50 * r(2, 8), h = r(3, 6), e = r(1, 3)
    return ask(`C(t) = ${a}t + ${b}. The cost C, in dollars, of renting a hall for t hours is given above. ${pick(NAMES)} booked the hall for ${h} hours and then added ${e} more hour${e > 1 ? 's' : ''}. How much more will the extra time cost?`,
      `$${a * e}`, [`$${a * e + b}`, `$${a * (h + e)}`, `$${a * (h + e) + b}`],
      `Each hour adds $${a}, and the $${b} is paid once. ${e} more hour${e > 1 ? 's' : ''} cost${e > 1 ? '' : 's'} ${e} × $${a} = $${a * e}.`, [`$${a * (e + 1)}`, `$${a * e + a / 2}`])
  }),
  // 6. Interval with the greatest average rate of change, from a table.
  form(CALC[18], function fastestInterval() {
    let incs; do { incs = [0, 0, 0, 0, 0].map(() => 10 * r(2, 12)) } while (new Set(incs).size < 5)
    const ds = [0]; incs.forEach((v) => ds.push(ds[ds.length - 1] + v))
    const best = incs.indexOf(Math.max(...incs)), others = [0, 1, 2, 3, 4].filter((i) => i !== best).sort(() => Math.random() - 0.5).slice(0, 3)
    const say = (i) => `Between hour ${2 * i} and hour ${2 * i + 2}`
    return ask(`${pick(NAMES)} drives to a city. The total distance driven was ${ds.map((d, i) => `${d} miles after ${2 * i} hours`).join(', ')}. In which time interval was the average rate of change of the distance the greatest?`,
      say(best), others.map(say),
      `Each interval is 2 hours, so compare how far was driven in each: ${incs.join(', ')} miles. The most is ${incs[best]} miles, ${say(best).toLowerCase()}.`)
  }),
  // 7. Absolute value that can never be negative.
  form(CALC[4], function absNeverNegative() {
    const c = r(3, 15), kind = pick(['lt', 'le', 'eq'])
    const q = kind === 'lt' ? `|n ${M} ${c}| < 0` : kind === 'le' ? `|n ${M} ${c}| ≤ 0` : `|n ${M} ${c}| = ${M}${r(1, 5)}`
    const none = 'There is no such value of n.'
    return ask(`For what value of n is ${q}?`, kind === 'le' ? String(c) : none, kind === 'le' ? [num(-c), String(c + 5), none] : [num(-c), String(c), String(c + 5)],
      kind === 'le' ? `An absolute value is never negative, so it can only be 0: n ${M} ${c} = 0 and n = ${c}.` : `An absolute value is never negative, so it cannot be ${kind === 'lt' ? 'less than 0' : 'a negative number'}. No n works.`)
  }),
  // 8. Find the constant from one value, then another value.
  form(T4_NOCALC[7], function otherValueFromPoint() {
    let t, k, c0; do { t = r(1, 4); k = r(-6, 6); c0 = r(-9, 9) } while (k === 0 || c0 === 0)
    const f = (x) => x * x + k * x + c0, v = f(-t)
    return ask(`f(x) = x² + kx${tail(c0)}. In the equation above, k is a constant. If f(${M}${t}) = ${num(v)}, what is the value of f(${t})?`, f(t), [v, -v, -f(t)].filter((w) => w !== f(t)),
      `f(${M}${t}) = ${t * t} ${M} ${t}k${tail(c0)} = ${num(v)}, so ${t}k = ${num(t * t + c0 - v)} and k = ${num(k)}. f(${t}) = ${t * t}${tail(k * t)}${tail(c0)} = ${num(f(t))}.`, [f(t) + 2, f(t) - 2])
  }),
  // 9. Cost increase when more units are made.
  form(NO_CALC[4], function moreUnitsCost() {
    const a = 5 * r(4, 12), b = 100 * r(5, 12), p = 5 * r(3, 8), U = 50 * r(1, 4)
    return ask(`C(n) = ${a}n + ${b} and n(t) = ${p}t. A company's weekly cost of making n phones is C dollars, and it makes n phones in t hours. By how much does the weekly cost go up if the number of phones goes up by ${U}?`,
      `$${a * U}`, [`$${a * U + b}`, `$${a * U * p}`, `$${p * U}`],
      `Each phone adds $${a}. ${U} more phones add ${U} × $${a} = $${a * U}. The $${b} does not change.`, [`$${a * (U + 50)}`, `$${a * U / 2}`])
  }),
  // 10. Hours needed to reach a cost.
  form(T2_CALC[29], function hoursForCost() {
    const a = 5 * r(4, 12), b = 100 * r(5, 12), p = 5 * r(3, 8), t = r(4, 20), n = p * t, C = a * n + b
    return ask(`C(n) = ${a}n + ${b} and n(t) = ${p}t. A company's weekly cost of making n phones is C dollars, and it makes n phones in t hours. If the weekly cost is $${C}, how many hours did it take to make the phones?`,
      t, [n, dec(C / (a * p), 1), dec((C + b) / (a * p), 1)].filter((w) => w !== String(t)),
      `${a}n + ${b} = ${C}, so ${a}n = ${C - b} and n = ${n}. Then ${p}t = ${n}, so t = ${t}.`, [t + 2, t - 2])
  }),
  // 11. Solve a complex equation for a or b.
  form(NO_CALC[1], function complexInverse() {
    let p, q; do { p = r(1, 4); q = r(1, 4) } while (q * p === 1)
    const D = p * p + 1, A = frac(q * p - 1, D), B = frac(-(p + q), D), askA = pick([true, false])
    return ask(`((${p} + i)/(${q} ${M} i))(a + bi) = 1. In the equation above, a and b are real numbers. If i = √${M}1, what is the value of ${askA ? 'a' : 'b'}?`,
      askA ? A : B, askA ? [frac(-(q * p - 1), D), frac(q * p + 1, D), frac(p + q, D)] : [frac(p + q, D), frac(q * p - 1, D), frac(-(p + q), q * q + 1)],
      `a + bi = (${q} ${M} i)/(${p} + i). Multiply top and bottom by ${p} ${M} i: (${q} ${M} i)(${p} ${M} i)/(${p * p} + 1) = (${q * p - 1} ${M} ${p + q}i)/${D}. So a = ${A} and b = ${B}.`)
  }),
  // 12. x-intercept of a line perpendicular to a given line.
  form(NO_CALC[14], function perpendicularXIntercept() {
    let n, d; do { n = r(1, 3); d = r(2, 5) } while (gcd(n, d) !== 1)
    const sg = pick([1, -1]), Y = r(2, 12), c = r(-4, 4)
    return ask(`Line ℓ passes through (0, ${Y}) and is perpendicular to the line y = ${sg < 0 ? M : ''}${coef(n, d)}x${c ? tail(c) : ''}. Line ℓ crosses the x-axis at P(a, 0). What is the value of a?`,
      frac(sg * Y * n, d), [frac(sg * Y * d, n), frac(-sg * Y * n, d), num(Y)],
      `Perpendicular slopes multiply to ${M}1, so ℓ has slope ${frac(-sg * d, n)}: y = ${coef(-sg * d, n)}x + ${Y}. Set y = 0: x = ${frac(sg * Y * n, d)}.`, [frac(sg * Y * n + d, d)])
  }),
  // 13. Correlation coefficient of points exactly on a line.
  form(T7_NOCALC[1], function exactCorrelation() {
    const up = pick([true, false]), x0 = r(5, 9), y0 = up ? 9 + r(0, 3) * 0.25 : 30 + r(0, 10), st = up ? 0.25 : r(2, 4)
    const xs = [0, 1, 2, 3].map((i) => x0 + i * 0.5), ys = [0, 1, 2, 3].map((i) => (up ? y0 + i * st : y0 - i * st))
    return ask(`${up ? 'Shoe size' : 'Price, in dollars'}: ${xs.join(', ')}. ${up ? 'Foot length, in inches' : 'Number sold per day'}: ${ys.join(', ')}. The values in each list match in order. What is the correlation coefficient between the two?`,
      up ? '1' : '−1', up ? ['−1', '−0.95', '0.95'] : ['1', '−0.95', '0.95'],
      `Each step of 0.5 in the first list changes the second by the same amount (${up ? '+' : M}${st}), so the points lie exactly on a line going ${up ? 'up' : 'down'}. That is a perfect ${up ? 'positive' : 'negative'} correlation: ${up ? '1' : '−1'}.`)
  }),
  // 14. cos of one angle equals sin of another.
  form(T5_NOCALC[3], function cosEqualsSin() {
    const [P, Q, R] = pick([['R', 'S', 'T'], ['A', 'B', 'C'], ['P', 'Q', 'R']]), askAngle = pick([true, false])
    return askAngle
      ? ask(`In triangle ${P}${Q}${R}, angles ${P} and ${R} are acute and cos∠${P} = sin∠${R}. What is the measure of angle ${Q}?`, '90°', ['45°', '60°', '180°'],
        `For acute angles, cos∠${P} = sin∠${R} means ∠${P} + ∠${R} = 90°. The angles of a triangle add to 180°, so ∠${Q} = 90°.`)
      : ask(`In triangle ${P}${Q}${R}, angles ${P} and ${R} are acute and cos∠${P} = sin∠${R}. Which of the following must be true?`, `Triangle ${P}${Q}${R} is a right triangle.`,
        [`Triangle ${P}${Q}${R} is equilateral.`, `Triangle ${P}${Q}${R} is isosceles.`, `Triangle ${P}${Q}${R} is an obtuse triangle.`],
        `For acute angles, cos∠${P} = sin∠${R} means ∠${P} + ∠${R} = 90°, so ∠${Q} = 90° and the triangle is a right triangle.`)
  }),
  // 15. Signs of a, b and c from how a parabola looks.
  form(T6_NOCALC[3], function parabolaSigns() {
    let up, right, above, t; do { up = pick([true, false]); right = pick([true, false]); above = pick([true, false]); t = [up, up !== right, above] } while (!t.some(Boolean))
    const ans = romanLabel(t)
    return ask(`The graph of f(x) = ax² + bx + c opens ${up ? 'upward' : 'downward'}, its ${up ? 'lowest' : 'highest'} point is to the ${right ? 'right' : 'left'} of the y-axis, and it crosses the y-axis ${above ? 'above' : 'below'} the origin. Which of the following must be true? I. a > 0 II. b > 0 III. c > 0`,
      ans, romanWrong(ans),
      `Opening ${up ? 'up' : 'down'} means a ${up ? '>' : '<'} 0. The turning point is at x = ${M}b/(2a), which is ${right ? 'positive' : 'negative'}, so b has the ${right ? 'opposite' : 'same'} sign as a: b ${up !== right ? '>' : '<'} 0. The y-intercept is c, so c ${above ? '>' : '<'} 0.`)
  }),
  // 16. Clear fractions, then solve a system.
  form(T3_CALC[7], function fractionCoefficientSystem() {
    let p, q, u, v, x0, y0, L; do { p = r(1, 4); q = r(1, 4); u = r(1, 6); v = r(1, 5); x0 = r(-3, 3); y0 = r(-3, 3); L = pick([6, 8, 12, 24]) } while (p * v + q * u === 0 || x0 === y0 || p * x0 - q * y0 === 0)
    const s = p * x0 - q * y0, w = u * x0 + v * y0, askX = pick([true, false])
    return ask(`${coef(p, L)}x ${M} ${coef(q, L)}y = ${frac(s, L)} and ${u === 1 ? '' : u}x + ${v === 1 ? '' : v}y = ${num(w)}. If (a, b) is the solution of the system, what is the value of ${askX ? 'a' : 'b'}?`,
      askX ? x0 : y0, askX ? [-x0, y0, x0 + 1] : [-y0, x0, y0 + 1],
      `Multiply the first equation by ${L}: ${p === 1 ? '' : p}x ${M} ${q === 1 ? '' : q}y = ${num(s)}. Solving with ${u === 1 ? '' : u}x + ${v === 1 ? '' : v}y = ${num(w)} gives x = ${num(x0)} and y = ${num(y0)}.`, [askX ? x0 - 1 : y0 - 1, askX ? x0 + 2 : y0 + 2])
  }),
  // 17. Median of two frequency tables together.
  form(CALC[7], function combinedMedian() {
    const split = () => { let c; do { c = [0, 0, 0, 0].map(() => 5 * r(1, 8)) } while (c.reduce((a, b) => a + b) >= 100); return [...c, 100 - c.reduce((a, b) => a + b)] }
    const at = (cs, k) => { let s = 0; for (let i = 0; i < 5; i++) { s += cs[i]; if (s >= k) return i } }
    let E, W, both, med; do { E = split(); W = split(); both = E.map((v, i) => v + W[i]); med = (at(both, 100) + at(both, 101)) / 2 } while (both.indexOf(Math.max(...both)) === med)
    const list = (cs) => cs.map((v, i) => `${v} with ${i}`).join(', ')
    return ask(`100 families in each of two villages were asked how many pets they own (0 to 4). East village: ${list(E)}. West village: ${list(W)}. What is the median number of pets for all 200 families?`,
      dec(med, 1), [dec(both.indexOf(Math.max(...both)), 1), dec(med + 0.5, 1), dec(med + 1, 1)],
      `Together: ${list(both)}. The median of 200 values is the average of the 100th and 101st. Counting up from 0 pets, both land on ${at(both, 100) === at(both, 101) ? at(both, 100) : `${at(both, 100)} and ${at(both, 101)}`}, so the median is ${dec(med, 1)}.`, [dec(Math.max(0, med - 1), 1), dec(med + 1.5, 1)])
  }),
  // 18. Expected count in two towns from two samples.
  form(T2_CALC[15], function twoTownEstimate() {
    const eP = 5 * r(1, 8), wP = 5 * r(1, 8), NE = 1000 * r(5, 20), NW = 1000 * r(5, 20), k = r(1, 4), right = (eP * NE) / 100 + (wP * NW) / 100
    return ask(`A survey picked 100 families at random in each of two villages. In East village, ${eP} of the 100 own ${k} pet${k > 1 ? 's' : ''}; in West village, ${wP} of the 100 do. East village has ${NE} families and West village has ${NW}. About how many families in the two villages own ${k} pet${k > 1 ? 's' : ''}?`,
      right, [eP + wP, (eP * NW) / 100 + (wP * NE) / 100, ((eP + wP) / 200) * (NE + NW)].filter((v) => v !== right),
      `East: ${eP}% of ${NE} = ${(eP * NE) / 100}. West: ${wP}% of ${NW} = ${(wP * NW) / 100}. Total: ${right}.`, [right + 100, right - 100])
  }),
  // 19. Area of a circle from its expanded equation.
  form(CALC[17], function circleAreaFromEquation() {
    let h, k, F, R2; do { h = r(-5, 5); k = r(-5, 5); F = r(-10, 10); R2 = h * h + k * k - F } while (R2 <= 0 || (h === 0 && k === 0))
    const eq = `x² + y²${h ? `${tail(-2 * h)}x` : ''}${k ? `${tail(-2 * k)}y` : ''}${F ? tail(F) : ''} = 0`
    return ask(`${eq}. The equation of a circle in the xy-plane is shown above. What is the area of the circle, to the nearest tenth?`, dec(Math.PI * R2, 1),
      [dec(Math.PI * Math.sqrt(R2), 1), dec(2 * Math.PI * Math.sqrt(R2), 1), dec((Math.PI * R2) / 2, 1)],
      `Complete the squares: (x ${h >= 0 ? M : '+'} ${Math.abs(h)})² + (y ${k >= 0 ? M : '+'} ${Math.abs(k)})² = ${h * h} + ${k * k}${F ? ` ${F > 0 ? M : '+'} ${Math.abs(F)}` : ''} = ${R2}. So r² = ${R2} and the area is ${R2}π ≈ ${dec(Math.PI * R2, 1)}.`, [dec(Math.PI * R2 + 1, 1)])
  }),
  // 20. Triangles with the same top corner split in a ratio.
  form(CALC[16], function ratioSplitTriangles() {
    let a, b, c, S, v; do { [a, b, c] = [r(1, 5), r(2, 7), r(1, 5)]; S = r(2, 12) * (a + c); v = (S * b) / (a + c) } while (!Number.isInteger(v))
    return ask(`Points A, B, C and D lie on a line in that order, and E is a point not on the line. AB : BC : CD = ${a} : ${b} : ${c}. If triangles ABE and CDE have a combined area of ${S}, what is the area of triangle EBC?`,
      v, [S, (S * (a + b + c)) / (a + c), S + v].filter((w) => w !== v),
      `All the triangles have the same height from E, so area goes with the base. ABE and CDE use ${a} + ${c} = ${a + c} parts for ${S}, so one part is ${S / (a + c)}. EBC uses ${b} parts: ${v}.`, [v + 2, v - 1])
  }),
  // 21. "Less than or more than" as one absolute value inequality.
  form(CALC[4], function orAsAbsolute() {
    let L, U; do { L = r(-12, 8); U = r(L + 4, 30) } while ((L + U) % 2 || L + U === 0)
    const mid = (L + U) / 2, half = (U - L) / 2, outside = pick([true, false]), abs = (m, op) => `|K ${m > 0 ? M : '+'} ${Math.abs(m)}| ${op} ${half}`
    return ask(`${outside ? `K ≤ ${num(L)} or K ≥ ${num(U)}` : `${num(L)} ≤ K ≤ ${num(U)}`}. Which of the following is equivalent to the above?`,
      abs(mid, outside ? '≥' : '≤'), [abs(mid, outside ? '≤' : '≥'), abs(-mid, '≥'), abs(-mid, '≤')],
      `The middle of ${num(L)} and ${num(U)} is ${num(mid)}, and each end is ${half} away from it. ${outside ? `Outside that range means the distance from ${num(mid)} is at least ${half}` : `Inside the range means the distance from ${num(mid)} is at most ${half}`}: ${abs(mid, outside ? '≥' : '≤')}.`)
  }),
  // 22. Volume of a cone with a different radius.
  form(T3_NOCALC[9], function coneRadiusScale() {
    const k = pick([2, 3]), V = pick([4, 5, 8, 9]) * k * k * pick([5, 10]), small = V / (k * k)
    return ask(`Two water tanks are right circular cones with the same height. The larger tank's top has radius ${k}r and the smaller tank's top has radius r. If the larger tank holds ${V} gallons, how many gallons does the smaller tank hold?`,
      dec(small, 2), [dec(V / k, 2), dec(V / k ** 3, 2), dec(V / 2, 2)].filter((w) => w !== dec(small, 2)),
      `Cone volume = (1/3)πr²h. With the same height, volume goes with r². The radius is ${k} times smaller, so the volume is ${k * k} times smaller: ${V}/${k * k} = ${dec(small, 2)}.`, [dec(small * 2, 2)])
  }),
  // 23. Semicircles on the sides of a right triangle.
  form(T8_NOCALC[1], function semicirclesOnTriangle() {
    const t = r(2, 6), sum = 2 * t * t, A1 = r(1, sum - 1), A2 = sum - A1
    return ask(`Right triangle RST has its right angle at R. A semicircle is drawn outward on each side, with that side as its diameter. If the semicircle on RS has area ${A1} and the semicircle on RT has area ${A2}, what is the length of ST?`,
      `${4 * t}/√π`, [`${4 * t}/π`, `${2 * t}/√π`, `${2 * t}/π`],
      `A semicircle on a diameter d has area (1/2)π(d/2)² = πd²/8. The two smaller semicircles add up to the big one (because RS² + RT² = ST²): πST²/8 = ${sum}. ST² = ${8 * sum}/π, so ST = ${4 * t}/√π.`)
  }),
  // 24. Average rate of change of f = p·g + c from two values of g.
  form(CALC[18], function rateThroughG() {
    const p = pick([2, 3, -2]), c = r(-9, 9), x1 = r(-4, 0), x2 = x1 + r(2, 8), y1 = r(-3, 3)
    let y2; do { y2 = r(-3, 3) } while (y2 === y1)
    return ask(`f(x) = ${num(p)}g(x)${tail(c)}. If g(${num(x1)}) = ${num(y1)} and g(${num(x2)}) = ${num(y2)}, what is the average rate of change of f(x) from x = ${num(x1)} to x = ${num(x2)}?`,
      frac(p * (y2 - y1), x2 - x1), [frac(y2 - y1, x2 - x1), frac(-p * (y2 - y1), x2 - x1), frac(p * (y2 - y1) + c, x2 - x1)],
      `f(${num(x2)}) ${M} f(${num(x1)}) = ${num(p)}(g(${num(x2)}) ${M} g(${num(x1)})) = ${num(p)}(${num(y2 - y1)}) = ${num(p * (y2 - y1))}; the ${num(c)} cancels. Divide by ${x2 - x1}: ${frac(p * (y2 - y1), x2 - x1)}.`, [frac(p * (y2 - y1) + 1, x2 - x1)])
  }),
  // 25. Solve an equation with negative powers.
  form(T3_NOCALC[2], function negativePowerSolve() {
    let B, n, c, m, b; do { B = pick([2, 3]); n = pick([2, 3]); c = pick([2, 3, 4]); m = B ** n / c; b = r(1, 4) } while (!Number.isInteger(m))
    const a = b + n
    return ask(`If k > 0 and the value of k⁻${sup(a)} is ${c === 2 ? 'twice' : c === 3 ? 'three times' : 'four times'} the value of ${m === 1 ? '' : m}k⁻${sup(b)}, what is the value of k?`,
      frac(1, B), [num(B), frac(1, B ** n), num(B ** n)],
      `k⁻${sup(a)} = ${c * m}k⁻${sup(b)}. Divide by k⁻${sup(b)}: k⁻${sup(n)} = ${c * m}, so k${sup(n)} = 1/${B ** n} and k = ${frac(1, B)}.`)
  }),
  // 26. Cylinder inside a sphere.
  form(CALC[34], function cylinderInSphere() {
    const [R, rr, half] = pick([[10, 6, 8], [10, 8, 6], [5, 3, 4], [5, 4, 3], [13, 5, 12], [13, 12, 5], [15, 9, 12], [17, 8, 15]]), h = 2 * half
    return ask(`A right cylinder fits inside a sphere of radius ${R}, with both circular edges touching the sphere. If the radius of the cylinder's base is ${rr}, what is the volume of the cylinder?`,
      `${rr * rr * h}π`, [`${rr * rr * half}π`, `${R * R * h}π`, `${rr * rr * 2 * R}π`],
      `From the center of the sphere to a point on a circular edge is ${R}. That point is ${rr} out from the axis, so it is √(${R}² ${M} ${rr}²) = ${half} up from the center. The height is 2 × ${half} = ${h}. Volume = π(${rr})²(${h}) = ${rr * rr * h}π.`)
  }),
  // 27. Price of one item inside boxes inside a carton.
  form(NO_CALC[6], function costPerCup() {
    const n = pick([20, 25, 50, 100]), c = 100 / n
    return ask(`A carton holds k boxes of paper cups, and each box holds ${n} cups. If the carton costs d dollars, what is the cost of one cup, in cents?`,
      `${c === 1 ? '' : c}d/k`, ['kd', `d/(${n}k)`, `${n}k/d`],
      `There are ${n}k cups for d dollars, which is 100d cents. One cup: 100d/(${n}k) = ${c === 1 ? '' : c}d/k cents.`)
  }),
  // 28. Two parallel lines and the sum of their x-intercepts.
  form(NO_CALC[14], function parallelInterceptSum() {
    let Y1, Y2, S, a; do { Y1 = r(2, 8); Y2 = r(1, Y1 - 1); S = r(4, 16); a = (Y2 * S) / (Y1 + Y2) } while (Y1 <= Y2 || !Number.isInteger(2 * a))
    const b = S - a
    return ask(`Lines ℓ and m are parallel and slope downward. Line ℓ crosses the y-axis at (0, ${Y1}) and the x-axis at x = b. Line m crosses the y-axis at (0, ${Y2}) and the x-axis at x = a. If a + b = ${S}, what is the value of a?`,
      dec(a, 1), [dec(b, 1), dec(S / 2, 1), dec((Y1 * S) / (Y1 + Y2) - 1, 1)],
      `Both lines have slope ${M}s, so b = ${Y1}/s and a = ${Y2}/s. a + b = ${Y1 + Y2}/s = ${S}, so s = ${frac(Y1 + Y2, S)}. a = ${Y2} ÷ ${frac(Y1 + Y2, S)} = ${dec(a, 1)}.`, [dec(a + 0.5, 1), dec(a - 0.5, 1)])
  }),
  // 29. Infinitely many solutions: x part and number part both zero.
  form(T5_NOCALC[17], function infinitelyManyLinear() {
    const p = r(2, 4), a = r(2, 9), k = p * a, c = r(1, k - 1), d = k - c
    return ask(`(k ${M} ${p}a)x + k ${M} ${c} = ${d}. In the equation above, a and k are constants. If the equation has infinitely many solutions, what is the value of a?`,
      a, [k, c, d].filter((v) => v !== a),
      `For every x to work, the x term must vanish and the numbers must match. k ${M} ${c} = ${d}, so k = ${k}. Then k ${M} ${p}a = 0, so a = ${k}/${p} = ${a}.`, [a + 1, a * 2])
  }),
  // 30. Constant in y = |ax(x − w)| from the top of its bump.
  form(CALC[26], function absParabolaConstant() {
    let w, H, A; do { w = 2 * r(1, 5); H = r(1, 8); A = frac(4 * H, w * w) } while (A === frac(H, w))
    const sg = pick([1, -1]), right = sg < 0 ? frac(-4 * H, w * w) : A
    const bad = new Set([A, frac(-4 * H, w * w)])
    const wrong = [frac(sg * H, w), frac(-sg * H, w), frac(sg * w, H), frac(sg * 2 * H, w * w), num(sg * H)].filter((x) => !bad.has(x))
    return ask(`The graph of y = |ax(x ${M} ${w})| touches the x-axis at (0, 0) and (${w}, 0), and between them it rises to a high point at (${w / 2}, ${H}). Which of the following could be the value of a?`,
      right, wrong.slice(0, 3),
      `At x = ${w / 2}: |a × ${w / 2} × (${w / 2} ${M} ${w})| = |a| × ${(w * w) / 4} = ${H}, so |a| = ${A}. a could be ${A} or ${frac(-4 * H, w * w)}; only ${right} is a choice.`)
  }),
  // 31. Area of a triangle made by two lines and the x-axis.
  form(CALC[16], function twoLinesTriangle() {
    let m, n, d, X, c; do { m = r(2, 4); d = pick([2, 3]); n = r(1, 2 * d); X = d * r(1, 4); c = m * X - (n * X) / d } while (gcd(n, d) !== 1 || c <= 0 || !Number.isInteger(c))
    const yP = (n * X) / d, area = frac(c * yP, 2 * m)
    return ask(`The lines y = ${coef(n, d)}x and y = ${m}x ${M} ${c} meet at P. The second line crosses the x-axis at R, and O is the origin. What is the area of triangle OPR?`,
      area, [frac(c * yP, m), frac(X * yP, 2), frac(c * X, 2 * m)],
      `${coef(n, d)}x = ${m}x ${M} ${c} gives x = ${X}, so P = (${X}, ${yP}). R is where ${m}x ${M} ${c} = 0: x = ${frac(c, m)}. Area = (1/2)(${frac(c, m)})(${yP}) = ${area}.`, [frac(c * yP + m, 2 * m)])
  }),
  // 32. Slope of a third side from the other two slopes.
  form(CALC[5], function thirdSideSlope() {
    let p, s, tN, tD, X, k; do { p = r(1, 4); s = r(1, 3); [tN, tD] = pick([[1, 2], [1, 3], [2, 3], [2, 1], [1, 1]]); X = tD * r(2, 4); k = s * p + (tN * X) / tD } while (X === p)
    return ask(`P(${p}, 0) is on the x-axis and Q is on the y-axis. The slope of PQ is ${M}${s}. Point R is (${X}, k), and the slope of QR is ${frac(tN, tD)}. What is the slope of PR?`,
      frac(k, X - p), [frac(X - p, k), frac(k, X), num(k)],
      `Q = (0, ${s * p}) because from P, going left ${p} at slope ${M}${s} rises ${s * p}. From Q, going right ${X} at slope ${frac(tN, tD)} rises ${frac(tN * X, tD)}, so k = ${k}. Slope of PR = ${k}/(${X} ${M} ${p}) = ${frac(k, X - p)}.`, [frac(k + 1, X - p)])
  }),
  // 33. Area of a parallelogram made from two radii.
  form(T5_NOCALC[4], function radiusParallelogram() {
    const rr = 2 * r(1, 6), [deg, rad] = pick([[30, 'π/6'], [150, '5π/6'], [90, 'π/2']]), area = deg === 90 ? rr * rr : (rr * rr) / 2
    return ask(`O is the center of a circle with area ${rr * rr}π. OPQR is a parallelogram with P and R on the circle. If angle POR is ${rad} radians, what is the area of OPQR?`,
      area, [rr * rr * 2, (rr * rr) / 4, deg === 90 ? (rr * rr) / 2 : rr * rr].filter((v) => v !== area),
      `r² = ${rr * rr}, so OP = OR = ${rr}. Area = OP × OR × sin∠POR = ${rr} × ${rr} × sin ${deg}° = ${area}.`, [area + rr])
  }),
  // 34. Smallest y in a system of two "greater than" inequalities.
  form(T2_CALC[7], function minYInRegion() {
    const a = r(2, 6), c = r(5, 20), x0 = 10 * r(2, 8), B2 = 50 * r(2, 10), y0 = c * x0 + B2, B1 = y0 + a * x0
    return ask(`y ≥ ${M}${a}x + ${B1} and y ≥ ${c}x + ${B2}. In the xy-plane, the point (r, s) is in the solution set of the system above. What is the smallest possible value of s?`,
      y0, [B1, B2, x0].filter((v) => v !== y0),
      `One line goes down and the other goes up, so the lowest point of the region is where they meet: ${M}${a}x + ${B1} = ${c}x + ${B2} gives x = ${x0}, y = ${y0}.`, [y0 + 50, y0 - 50])
  }),
  // 35. Area of a triangle with one flat side.
  form(CALC[16], function flatBaseTriangle() {
    const xA = r(-8, 0), xB = r(2, 10), y = r(-3, 5), xC = r(-6, 10), h = r(3, 12), base = xB - xA, area = (base * h) / 2
    return ask(`In the xy-plane, A = (${num(xA)}, ${num(y)}), B = (${xB}, ${num(y)}) and C = (${num(xC)}, ${num(y + h)}). What is the area of triangle ABC?`,
      dec(area, 1), [dec(base * h, 1), dec((base + h) / 2, 1), dec(((base + 2) * h) / 2, 1)],
      `AB is flat (both at y = ${num(y)}), so its length is ${xB} ${M} (${num(xA)}) = ${base}. C is ${h} above it. Area = (1/2)(${base})(${h}) = ${dec(area, 1)}.`, [dec(area + 1, 1)])
  }),
  // 36. Triangle from a parabola's x-intercepts and y-intercept.
  form(T3_NOCALC[5], function parabolaInterceptTriangle() {
    const p = r(1, 6), q = r(1, 6), k = pick([1, 1, 2]), T = k * p * q, area = ((p + q) * T) / 2
    return ask(`y = ${k === 1 ? M : `${M}${k}`}(x ${M} ${p})(x + ${q}). The graph crosses the x-axis at S (left) and R (right) and the y-axis at T. What is the area of triangle STR?`,
      dec(area, 1), [dec((p + q) * T, 1), dec((p * q) / 2, 1), dec(((p + q) * k * ((p + q) / 2) ** 2) / 2, 1)],
      `S = (${M}${q}, 0) and R = (${p}, 0), so SR = ${p + q}. At x = 0, y = ${k === 1 ? M : `${M}${k}`}(${M}${p})(${q}) = ${T}, so T = (0, ${T}). Area = (1/2)(${p + q})(${T}) = ${dec(area, 1)}.`, [dec(area + 1, 1)])
  }),
  // 37. Yearly factor for a loss of value.
  form(CALC[14], function lossFactor() {
    const p = pick([8, 12, 15, 18, 20, 22]), N = 1000 * r(12, 40)
    return ask(`A new car loses ${p}% of its value every year. A car that costs $${N} new is worth V(n) = ${N} · Cⁿ dollars after n years. What is the value of C?`,
      dec(1 - p / 100, 2), [dec(p / 100, 2), dec(1 + p / 100, 2), dec(p / 10, 1)],
      `Losing ${p}% leaves ${100 - p}% each year, so C = ${dec(1 - p / 100, 2)}.`)
  }),
  // 38. Value after some years of steady percent loss.
  form(CALC[15], function lossAfterYears() {
    const p = pick([8, 12, 15, 18, 20]), N = 1000 * r(12, 40), n = r(3, 6), v = (t) => Math.round(N * (1 - p / 100) ** t)
    return ask(`A new car costs $${N} and loses ${p}% of its value every year. To the nearest dollar, what is it worth ${n} years after it was bought?`,
      `$${v(n)}`, [`$${Math.round(N * (1 - (p * n) / 100))}`, `$${v(n - 1)}`, `$${Math.round(N * (p / 100) ** 1 * n)}`],
      `Each year keeps ${100 - p}% of the value: ${N}(${dec(1 - p / 100, 2)})${sup(n)} ≈ $${v(n)}.`, [`$${v(n + 1)}`])
  }),
]

// Practice test 8, section 4 (calculator). Questions 9 and 24 need their drawn graphs, so they are left out.
const T8_CALC = [
  // 1. Factor out x, then double.
  form(T3_NOCALC[1], function factorThenScale() {
    const t = r(2, 6), s = r(3, 15), m = pick([2, 3, 5]), N = t * s
    return ask(`If ax + bx = ${N}, what is the value of ${m}a + ${m}b when x = ${t}?`, m * s, [N, s, m * N].filter((v) => v !== m * s),
      `ax + bx = (a + b)x. With x = ${t}: ${t}(a + b) = ${N}, so a + b = ${s} and ${m}a + ${m}b = ${m * s}.`, [m * s + m, m * s - m])
  }),
  // 2. Angles of a trapezoid.
  form(CALC[2], function trapezoidAngles() {
    const d = r(95, 130), bb = r(45, 85), x = 180 - bb, y = 180 - d
    return ask(`ABCD is a four-sided figure with AB parallel to CD. Angle D is ${d}°, angle B is ${bb}°, angle C is x° and angle A is y°. What is the value of x ${M} y?`, d - bb,
      [x + y, 180 - (d - bb), d + bb - 180].filter((v) => v !== d - bb && v > 0),
      `With AB ∥ CD, angles on the same leg add to 180°: x = 180 ${M} ${bb} = ${x} and y = 180 ${M} ${d} = ${y}. x ${M} y = ${d - bb}.`, [d - bb + 5, d - bb - 5])
  }),
  // 3. y-intercept from a point and a distance.
  form(CALC[5], function interceptFromDistance() {
    const [h, q, c] = pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [12, 5, 13], [5, 12, 13]]), p = r(1, h - 1)
    const at = (v) => `(0, ${v})`
    return ask(`Line ℓ passes through B(${p}, ${q}) and through point A on the negative x-axis. If AB = ${c}, what is the y-intercept of the line?`, at(frac(q * (h - p), h)),
      [at(frac(q * p, h)), at(frac(q * (h + p), h)), at(q)],
      `B is ${q} above the x-axis and AB = ${c}, so A is √(${c}² ${M} ${q}²) = ${h} to the left of B: A = (${num(p - h)}, 0). The slope is ${frac(q, h)}, so the y-intercept is ${q} ${M} ${frac(q, h)}(${p}) = ${frac(q * (h - p), h)}.`, [at(frac(q * (h - p) + 1, h)), at(frac(q * (h - p) - 1, h))])
  }),
  // 4. Line parallel to an axis through a point.
  form(T6_NOCALC[3], function axisParallelLine() {
    let u, v; do { u = r(-9, 9); v = r(-9, 9) } while (u === 0 || v === 0 || Math.abs(u) === Math.abs(v))
    const xAxis = pick([true, false])
    return ask(`In the xy-plane, line ℓ is parallel to the ${xAxis ? 'x' : 'y'}-axis and passes through the point ${pt(u, v)}. What is the equation of the line?`,
      xAxis ? `y = ${num(v)}` : `x = ${num(u)}`, xAxis ? [`x = ${num(u)}`, `y = ${num(u)}`, `x = ${num(v)}`] : [`y = ${num(v)}`, `x = ${num(v)}`, `y = ${num(u)}`],
      `A line parallel to the ${xAxis ? 'x-axis is flat: every point has the same y' : 'y-axis goes straight up: every point has the same x'}, here ${xAxis ? num(v) : num(u)}. So ${xAxis ? `y = ${num(v)}` : `x = ${num(u)}`}.`)
  }),
  // 5. Product of two roots as a power.
  form(NO_CALC[13], function rootsAsPower() {
    let a, b; do { a = r(2, 5); b = r(2, 5) } while (a === b)
    const B = pick([10, 2, 5]), sq = pick([true, false]), k = sq ? frac(a + b, 2 * a * b) : frac(a + b, a * b)
    return ask(`If (${a === 2 ? '' : sup(a)}√${B})(${b === 2 ? '' : sup(b)}√${B}) = ${sq ? B * B : B}ᵏ, what is the value of k?`, k,
      [sq ? frac(a + b, a * b) : frac(a + b, 2 * a * b), frac(2, a + b), frac(1, a * b)],
      `${a === 2 ? '' : sup(a)}√${B} = ${B}^(1/${a}) and ${b === 2 ? '' : sup(b)}√${B} = ${B}^(1/${b}). Their product is ${B}^(${frac(a + b, a * b)}).${sq ? ` ${B * B}ᵏ = ${B}^(2k), so 2k = ${frac(a + b, a * b)} and k = ${k}.` : ` So k = ${k}.`}`)
  }),
  // 6. When a quick formula matches the exact one.
  form(T5_NOCALC[11], function approxFormulaMatch() {
    const half = pick([true, false]), C0 = half ? 10 * r(1, 8) : 5 * r(1, 12), m = half ? 1.5 : 2, c = 32 + (1.8 - m) * C0
    const cc = Math.round(c)
    return ask(`F = (9/5)C + 32 changes degrees Celsius C to degrees Fahrenheit F. A student uses the quick formula F = ${m}C + ${cc} instead. For what Celsius temperature does the quick formula give the correct Fahrenheit temperature?`,
      C0, [cc, C0 + 5, 0].filter((v) => v !== C0),
      `Set them equal: (9/5)C + 32 = ${m}C + ${cc}. Then ${32 - cc === 0 ? '0' : num(32 - cc)} = ${dec(m - 1.8, 1)}C, so C = ${C0}.`, [C0 + 10, C0 - 5])
  }),
  // 7. Other x-intercept from the turning point.
  form(T2_NOCALC[11], function otherInterceptFromVertex() {
    const h = r(-3, 8), k = r(2, 12), d = r(1, 6), x1 = h - d, other = h + d
    return ask(`The graph of the function f in the xy-plane is a parabola with its highest point at ${pt(h, k)}. If one x-intercept is ${pt(x1, 0)}, what is the other x-intercept?`,
      pt(other, 0), [pt(-x1, 0), pt(2 * h, 0), pt(other + 1, 0)],
      `A parabola is symmetric about the vertical line through its top, x = ${num(h)}. ${pt(x1, 0)} is ${d} to the left, so the other is ${d} to the right: ${pt(other, 0)}.`, [pt(other - 1, 0), pt(other + 2, 0), pt(other - 2, 0)])
  }),
  // 8. A squared equation with a linear one.
  form(T5_NOCALC[1], function squaredWithLinear() {
    const n = r(2, 4), c = r(1, 6), askA = pick([true, false]), a = frac(c, 2), b = frac(-c, 2 * n)
    return ask(`a² = ${n * n}b² and a = ${c} + ${n}b. In the system of equations above, what is the value of ${askA ? 'a' : 'b'}?`,
      askA ? a : b, askA ? [frac(-c, 2), frac(c, 2 * n), num(c)] : [frac(c, 2 * n), frac(-c, n), frac(c, 2)],
      `a² = ${n * n}b² means a = ${n}b or a = ${M}${n}b. a = ${n}b would make ${c} = 0, so a = ${M}${n}b: ${M}${n}b = ${c} + ${n}b, b = ${b} and a = ${a}.`)
  }),
  // 10. An interval that fits inside an absolute value inequality.
  form(CALC[4], function subsetInterval() {
    let p, q, rr, L, U; do { p = pick([1, 2, 3]); q = r(-9, 12); rr = r(4, 15); L = (q - rr) / p; U = (q + rr) / p } while (!Number.isInteger(L) || !Number.isInteger(U) || U - L < 4)
    const iv = (a, b) => `${num(a)} < x < ${num(b)}`
    return ask(`|${p === 1 ? '' : p}x ${q < 0 ? '+' : M} ${Math.abs(q)}| < ${rr}. Which of the following intervals is a subset of the values of x that satisfy the inequality above?`,
      iv(L + 1, U - 1), [iv(L - 2, U + 2), iv(L + 1, U + 1), iv(L - 1, U - 1)],
      `${M}${rr} < ${p === 1 ? '' : p}x ${q < 0 ? '+' : M} ${Math.abs(q)} < ${rr}, so ${num(q - rr)} < ${p === 1 ? '' : p}x < ${q + rr}${p === 1 ? '' : ` and ${num(L)} < x < ${num(U)}`}. Only ${iv(L + 1, U - 1)} fits inside.`)
  }),
  // 11. How many to remove for a given probability.
  form(T2_NOCALC[18], function removeForProbability() {
    const k = pick([2, 3, 4]), m = r(2, 10), W = m * (k - 1), n = r(2, 15), B = m + n
    return ask(`A bag holds ${B} black marbles and ${W} white marbles and nothing else. How many black marbles must be taken out so that the probability of picking a black marble at random is 1/${k}?`,
      n, [B - W, m, Math.round(B / k)].filter((v) => v !== n && v > 0),
      `After taking out n black marbles: (${B} ${M} n)/(${B + W} ${M} n) = 1/${k}. So ${k}(${B} ${M} n) = ${B + W} ${M} n, ${k * B} ${M} ${k}n = ${B + W} ${M} n and n = ${n}.`, [n + 2, n - 1, n + 4])
  }),
  // 12. Radius from the length around two semicircles.
  form(T2_NOCALC[17], function twoSemicirclesLength() {
    const rr = r(2, 9)
    return ask(`Two semicircles of radius r have their centers O and P on one straight line, one bulging above the line and one below, touching end to end. The figure is the two arcs plus the straight segment joining their far ends. If its total length is ${2 * rr}π + ${4 * rr}, what is r?`,
      rr, [2 * rr, 4 * rr, rr + 2],
      `The two arcs together are one full circle: 2πr. The straight segment is two diameters: 4r. So 2πr + 4r = ${2 * rr}π + ${4 * rr} and r = ${rr}.`, [rr - 1])
  }),
  // 13. Product from two power equations.
  form(T3_NOCALC[1], function powerProduct() {
    const n = r(5, 15), c = pick([2, 4, 5, 10, 20]), N = c * 50 * r(1, 10)
    return ask(`If x${sup(n)} = ${N} and x${sup(n - 1)}/y = ${c}, what is the value of xy?`, N / c, [N * c, c, N / (c * c)].filter((v) => Number.isInteger(v) && v !== N / c),
      `Divide: x${sup(n)} ÷ (x${sup(n - 1)}/y) = x${sup(n)} × y/x${sup(n - 1)} = xy. That is ${N}/${c} = ${N / c}.`, [N / c + 10, N / c - 10, N])
  }),
  // 14. Median from a count of scores.
  form(CALC[7], function medianFromCounts() {
    const scores = [30, 40, 50, 60, 70, 80, 90, 100].sort(() => Math.random() - 0.5).slice(0, 5)
    const counts = scores.map(() => r(3, 10)), total = counts.reduce((a, b) => a + b)
    const sorted = scores.map((s, i) => [s, counts[i]]).sort((a, b) => a[0] - b[0]), list = []
    sorted.forEach(([s, c]) => { for (let i = 0; i < c; i++) list.push(s) })
    const med = total % 2 ? list[(total - 1) / 2] : (list[total / 2 - 1] + list[total / 2]) / 2
    const mode = scores[counts.indexOf(Math.max(...counts))]
    return ask(`A chart shows the test scores of ${total} students: ${scores.map((s, i) => `${counts[i]} scored ${s}`).join(', ')}. What is the median score?`,
      dec(med, 1), [dec(scores[2], 1), dec(mode, 1), dec(med + 5, 1)],
      `Put the ${total} scores in order: ${sorted.map(([s, c]) => `${c} × ${s}`).join(', ')}. The middle ${total % 2 ? `one is number ${(total + 1) / 2}` : `two are numbers ${total / 2} and ${total / 2 + 1}`}, which gives ${dec(med, 1)}.`, [dec(med - 5, 1), dec(med + 10, 1)])
  }),
  // 15. Fee function from a setup charge and one total.
  form(CALC[0], function setupFeeFunction() {
    const S = 25 * r(2, 8), h = r(4, 10), rate = pick([30, 37.5, 40, 47.5, 52.5, 60, 72.5]), T = S + rate * h
    return ask(`A studio charges a setup fee of $${S} plus an hourly rate. A ${h}-hour session costs $${money(T)} in all. Which function f gives the total fee, in dollars, for t hours?`,
      `f(t) = ${S} + ${dec(rate, 2)}t`, [`f(t) = ${dec(T, 2)} + ${S}t`, `f(t) = ${S} + ${dec(T / h, 2)}t`, `f(t) = ${S} + ${dec(T - S, 2)}t`],
      `Without the setup fee, ${h} hours cost ${dec(T, 2)} ${M} ${S} = ${dec(T - S, 2)}, so the hourly rate is ${dec(T - S, 2)}/${h} = ${dec(rate, 2)}. f(t) = ${S} + ${dec(rate, 2)}t.`)
  }),
  // 16. Total fee for a longer session.
  form(CALC[0], function setupFeeTotal() {
    const S = 25 * r(2, 8), h = r(4, 10), rate = pick([30, 37.5, 40, 47.5, 52.5, 60, 72.5]), T = S + rate * h, H = h + r(1, 5)
    return ask(`A studio charges a setup fee of $${S} plus an hourly rate. A ${h}-hour session costs $${money(T)} in all. How much, in dollars, does a ${H}-hour session cost?`,
      dec(S + rate * H, 2), [dec((T / h) * H, 2), dec(S + (T / h) * H, 2), dec(rate * H, 2)],
      `Hourly rate: (${dec(T, 2)} ${M} ${S})/${h} = ${dec(rate, 2)}. For ${H} hours: ${S} + ${dec(rate, 2)}(${H}) = ${dec(S + rate * H, 2)}.`, [dec(S + rate * H + 10, 2)])
  }),
  // 17. Line through the parabola's y-intercept and another meeting point.
  form(T4_CALC[T4_CALC.length - 2], function lineThroughTwoMeets() {
    let h, X, m; do { h = r(1, 4); X = r(1, 8); m = X - 2 * h } while (m === 0 || X === 2 * h)
    const b = h * h, yX = (X - h) ** 2, line = (sl, ic) => `y = ${sl}x${ic ? tail(ic) : ''}`
    return ask(`f(x) = (x ${M} ${h})². The graph of the line g(x) meets the graph of f on the y-axis and again at ${pt(X, yX)}. Which of the following is the equation of g?`,
      line(coef(m), b), [line(coef(yX, X), 0), line(coef(m + 1), yX - (m + 1) * X), line(coef(m - 1), yX - (m - 1) * X)],
      `On the y-axis, f(0) = ${b}, so g passes through (0, ${b}) and ${pt(X, yX)}. Slope = (${yX} ${M} ${b})/${X} = ${num(m)}. g: ${line(coef(m), b)}.`, [line(coef(m), b + 1), line(coef(m), -b), line(coef(-m), b)])
  }),
  // 18. Square of a difference of reciprocals.
  form(T5_NOCALC[2], function reciprocalDifferenceSquare() {
    const P = r(2, 8), S = 2 * P + r(1, 40), minus = pick([true, false]), top = minus ? S - 2 * P : S + 2 * P
    return ask(`If x² + y² = ${S} and xy = ${P}, what is the value of (1/x ${minus ? M : '+'} 1/y)²?`, frac(top, P * P),
      [frac(top, P), frac(minus ? S + 2 * P : S - 2 * P, P * P), frac(S, P * P)],
      `1/x ${minus ? M : '+'} 1/y = (y ${minus ? M : '+'} x)/(xy). Squared: (x² + y² ${minus ? M : '+'} 2xy)/(xy)² = (${S} ${minus ? M : '+'} ${2 * P})/${P * P} = ${frac(top, P * P)}.`)
  }),
  // 19. Split a fraction into two simpler fractions.
  form(T7_NOCALC[19], function splitFraction() {
    const n = r(1, 5), c = r(1, 6), askB = pick([true, false])
    return ask(`${c}/(x(x + ${n})) = a/x ${M} b/(x + ${n}). In the equation above, a and b are constants. If the equation is true for all positive x, what is the value of ${askB ? 'b' : 'a'}?`,
      frac(c, n), [frac(-c, n), num(c), frac(n, c)],
      `Combine the right side: (a(x + ${n}) ${M} bx)/(x(x + ${n})). So ${c} = (a ${M} b)x + ${n}a for all x: ${n}a = ${c} and a ${M} b = 0. a = b = ${frac(c, n)}.`, [frac(c + 1, n)])
  }),
  // 20. Which point cannot be on a reflected line.
  function reflectedLinePoint() {
    let p, q; do { p = r(-4, 4); q = r(-8, 8) } while (p === 0 || q === 0)
    const yAxis = pick([true, false]), f = (x) => (yAxis ? p * x + q : p * x - q)
    const xs = [-2, -1, 0, 1, 2, 3, 4].sort(() => Math.random() - 0.5).slice(0, 4), on = xs.slice(0, 3).map((x) => pt(x, f(x)))
    const off = pt(xs[3], f(xs[3]) + pick([1, 2, 3, -1, -2]))
    return ask(`The line ${p === 1 ? '' : p === -1 ? M : num(p)}x + y = ${num(q)} in the xy-plane is reflected across the ${yAxis ? 'y' : 'x'}-axis. Which of the following points CANNOT be on the new line?`,
      off, on,
      `Reflecting across the ${yAxis ? 'y-axis turns x into −x' : 'x-axis turns y into −y'}: ${yAxis ? `${coef(-p)}x + y = ${num(q)}` : `${coef(p)}x ${M} y = ${num(q)}`}, so y = ${coef(p)}x${tail(yAxis ? q : -q)}. ${off} does not fit; the other three do.`)
  },
  // 21. Rectangle under a line through the origin.
  form(T2_NOCALC[14], function rectangleOnLine() {
    let n, d; do { n = r(1, 4); d = r(2, 5) } while (gcd(n, d) !== 1 || n === d)
    const t = r(1, 4), a = d * t, b = n * t, A = a * b, askB = pick([true, false])
    return ask(`O is the origin and Q(a, b) is on the line y = ${coef(n, d)}x, with a > 0. P is on the y-axis and R is on the x-axis so that OPQR is a rectangle. If the area of OPQR is ${A}, what is the value of ${askB ? 'b' : 'a'}?`,
      askB ? b : a, askB ? [a, b + n, 2 * b] : [b, a + d, 2 * a],
      `The rectangle is a wide and b tall, with b = ${coef(n, d)}a. Area: a × ${coef(n, d)}a = ${A}, so a² = ${a * a}, a = ${a} and b = ${b}.`, [askB ? b + 1 : a + 1])
  }),
  // 22. Price of one bag from the overall cost per pound.
  form(T2_NOCALC[6], function costPerPoundBag() {
    let w, p1, p2, avg, W, p3; do { w = [5 * r(1, 4), 5 * r(3, 6), 5 * r(7, 12)]; avg = r(4, 8); p1 = w[0] * r(avg - 2, avg + 3); p2 = w[1] * r(avg - 2, avg + 3); W = w[0] + w[1] + w[2]; p3 = avg * W - p1 - p2 } while (p3 <= 0 || p3 === avg * w[2])
    return ask(`${pick(NAMES)} bought a ${w[0]}-pound bag of flour for $${p1}, a ${w[1]}-pound bag for $${p2} and a ${w[2]}-pound bag. If the average cost per pound of all the flour is $${avg}.00, what was the price of the ${w[2]}-pound bag?`,
      `$${p3}`, [`$${avg * w[2]}`, `$${p3 + 40}`, `$${Math.max(10, p3 - 40)}`],
      `${W} pounds at $${avg} a pound cost $${avg * W} in all. The last bag: ${avg * W} ${M} ${p1} ${M} ${p2} = $${p3}.`, [`$${p3 + 20}`])
  }),
  // 23. Greatest percent increase.
  form(T4_CALC[0], function greatestPercentIncrease() {
    const people = ['Ama', 'Kofi', 'Esi', 'Yaw'], cut = (a, b) => (b - a) / a
    let t1, t2, pc; do { t1 = people.map(() => 10 * r(4, 8)); t2 = t1.map((v) => v + 10 * r(1, 4)); pc = t1.map((v, i) => cut(v, t2[i])) } while (t2.some((v) => v > 100) || [...pc].sort((a, b) => b - a)[0] - [...pc].sort((a, b) => b - a)[1] < 0.03)
    const best = pc.indexOf(Math.max(...pc))
    return ask(`Test 1 and test 2 scores: ${people.map((p, i) => `${p} ${t1[i]} then ${t2[i]}`).join('; ')}. Who had the greatest percent increase from test 1 to test 2?`,
      people[best], people.filter((_, i) => i !== best),
      `Percent increase = (test 2 ${M} test 1)/test 1: ${people.map((p, i) => `${p} ${Math.round(pc[i] * 100)}%`).join(', ')}. The greatest is ${people[best]}.`)
  }),
  // 25. Compare spreads (standard deviation).
  form(T6_NOCALC[7], function compareSpread() {
    const mid = r(18, 28), A = [mid - r(1, 3), mid + r(1, 4), mid - r(0, 2), mid + r(0, 3)], kind = pick(['A', 'B', 'same'])
    const B = kind === 'same' ? A.map((v) => v + 3).sort(() => Math.random() - 0.5) : [mid - r(5, 8), mid + r(6, 10), mid - r(3, 6), mid + r(2, 5)]
    const [X, Y] = kind === 'A' ? [B, A] : [A, B], say = { A: 'The standard deviation in Amber City is larger than in Buner City.', B: 'The standard deviation in Buner City is larger than in Amber City.', same: 'The standard deviation is the same in both cities.' }
    return ask(`High temperatures, in °C, for spring, summer, autumn and winter: Amber City ${X.join(', ')}; Buner City ${Y.join(', ')}. Which of the following is true?`,
      say[kind], [...Object.keys(say).filter((k) => k !== kind).map((k) => say[k]), 'The standard deviations cannot be compared from these data.'],
      kind === 'same' ? `Buner's values are Amber's values each raised by 3, just in a different order. Adding the same number to every value does not change the spread, so the standard deviations are equal.`
        : `${kind === 'A' ? 'Amber' : 'Buner'} City's values (${(kind === 'A' ? X : Y).join(', ')}) are much more spread out from their middle than the other city's, so its standard deviation is larger.`)
  }),
  // 26. Radius from a tangent and a sine.
  form(T4_NOCALC[15], function tangentRadius() {
    const [a, b, c] = pick([[4, 3, 5], [3, 4, 5], [12, 5, 13], [5, 12, 13], [8, 15, 17]]), k = r(1, 4), askR = pick([true, false])
    return ask(`PR is tangent to the circle with center O at point P, and PR = ${b * k}. If sin∠R = ${frac(a, c)}${a / c === 0.8 || a / c === 0.6 ? ` (${dec(a / c, 1)})` : ''}, what is ${askR ? 'the radius of the circle' : 'the length of OR'}?`,
      askR ? a * k : c * k, askR ? [b * k, c * k, a * k + b * k] : [a * k, b * k, a * k + b * k],
      `A radius meets a tangent at a right angle, so OPR is a right triangle with the right angle at P. sin∠R = OP/OR = ${frac(a, c)}, so the sides are in the ratio ${a} : ${b} : ${c} (OP : PR : OR). PR = ${b * k} gives OP = ${a * k} and OR = ${c * k}.`)
  }),
  // 27. Two exponential equations make a linear system.
  form(NO_CALC[13], function exponentSystem() {
    let m1, m2; do { m1 = r(1, 6); m2 = r(1, 6) } while (m1 === m2)
    const askX = pick([true, false]), x = frac(2 * m2 - m1, 3), y = frac(2 * m1 - m2, 3)
    return ask(`2^(x + 2y) = ${2 ** m1} and 3^(2x + y) = ${3 ** m2}. In the system of equations above, what is the value of ${askX ? 'x' : 'y'}?`,
      askX ? x : y, askX ? [y, num(m1), num(m2)] : [x, num(m2), num(m1)],
      `${2 ** m1} = 2${sup(m1)} and ${3 ** m2} = 3${sup(m2)}, so x + 2y = ${m1} and 2x + y = ${m2}. Solving: x = ${x}, y = ${y}.`, [frac(m1 + m2, 3), frac(m1 + m2, 2)])
  }),
  // 28. Which sum cannot happen.
  form(NO_CALC[5], function cannotBeSum() {
    const P = pick([12, 18, 20, 24, 30, 36]), sums = []
    for (let d = 1; d * d <= P; d++) if (P % d === 0) sums.push(d + P / d)
    let bad; do { bad = r(Math.min(...sums) - 2, Math.max(...sums) + 3) } while (sums.includes(bad) || bad < 2)
    return ask(`(x + y)² ${M} (x ${M} y)² = ${4 * P}. In the equation above, x and y are positive integers. Which of the following CANNOT be the value of x + y?`,
      bad, sums.sort(() => Math.random() - 0.5).slice(0, 3),
      `Expand: (x + y)² ${M} (x ${M} y)² = 4xy = ${4 * P}, so xy = ${P}. The positive integer pairs give sums ${sums.sort((a, b) => a - b).join(', ')}. ${bad} is not one of them.`)
  }),
  // 29. Order of three numbers from the order of their pair averages.
  form(T2_NOCALC[6], function averagesOrder() {
    const order = ['a', 'b', 'c'].sort(() => Math.random() - 0.5), val = { [order[0]]: 3, [order[1]]: 2, [order[2]]: 1 }
    const avgs = [['P', 'a', 'b', 'c'], ['Q', 'b', 'c', 'a'], ['R', 'c', 'a', 'b']].map(([n, u, v, out]) => [n, (val[u] + val[v]) / 2, out]).sort((x, y) => y[1] - x[1])
    const right = order.join(' > '), wrong = [['a', 'b', 'c'], ['c', 'b', 'a'], ['b', 'a', 'c'], ['a', 'c', 'b'], ['b', 'c', 'a'], ['c', 'a', 'b']].map((o) => o.join(' > ')).filter((s) => s !== right).sort(() => Math.random() - 0.5).slice(0, 2)
    return ask(`P is the average of a and b, Q is the average of b and c, and R is the average of c and a. If ${avgs.map((x) => x[0]).join(' > ')}, which of the following is true?`,
      right, [...wrong, 'a = b = c'],
      `Each average leaves out one number, and the biggest average leaves out the smallest number. ${avgs[0][0]} leaves out ${avgs[0][2]}, so ${avgs[0][2]} is smallest; ${avgs[2][0]} leaves out ${avgs[2][2]}, so ${avgs[2][2]} is largest. ${right}.`)
  }),
  // 30. Profit function for a stall.
  form(T5_NOCALC[11], function stallProfit() {
    const S = 10 * r(5, 20), c = pick([0.2, 0.25, 0.3, 0.35, 0.4]), s = pick([0.75, 0.8, 1, 1.25, 1.5]), m = (Math.round((s - c) * 100) / 100).toFixed(2), sp = s.toFixed(2)
    return ask(`${pick(NAMES)} sets up a juice stall. The set-up cost is $${S}, each cup of juice costs $${c.toFixed(2)} to make, and each cup sells for $${sp}. Which function gives the profit P, in dollars, from selling n cups?`,
      `P(n) = ${m}n ${M} ${S}`, [`P(n) = ${sp}n ${M} ${S}`, `P(n) = ${sp}n + ${S}`, `P(n) = ${m}n + ${S}`],
      `Each cup earns $${sp} ${M} $${c.toFixed(2)} = $${m}. Subtract the $${S} set-up cost once: P(n) = ${m}n ${M} ${S}.`)
  }),
  // 31. Circumference from an expanded circle equation.
  form(CALC[17], function circumferenceFromEquation() {
    let h, k; do { h = r(-5, 5); k = r(-5, 5) } while (h === 0 || k === 0)
    const R2 = h * h + k * k, R = Math.sqrt(R2)
    return ask(`x² ${tail(-2 * h).trim()}x + y² ${tail(-2 * k).trim()}y = 0. The equation of a circle in the xy-plane is shown above. To the nearest tenth, what is the circumference of the circle?`,
      dec(2 * Math.PI * R, 1), [dec(Math.PI * R2, 1), dec(Math.PI * R, 1), dec(2 * Math.PI * R2, 1)],
      `Complete the squares: (x ${h > 0 ? M : '+'} ${Math.abs(h)})² + (y ${k > 0 ? M : '+'} ${Math.abs(k)})² = ${h * h} + ${k * k} = ${R2}. r = √${R2}, so the circumference is 2π√${R2} ≈ ${dec(2 * Math.PI * R, 1)}.`, [dec(2 * Math.PI * R + 1, 1)])
  }),
  // 32. Cost per extra unit from a model with a fraction.
  form(T2_CALC[3], function perUnitFromFraction() {
    const d = pick([4, 8, 10, 16, 20]), per = r(30, 250) / 10, m = Math.round(per * d * 10) / 10, b = r(300, 1500)
    return ask(`C = (${m}x + ${b})/${d}. The cost C, in dollars, of making x units is modeled above. According to the model, by how many dollars does the cost go up for each extra unit?`,
      dec(m / d, 2), [dec(m, 2), dec(b / d, 2), dec((m + b) / d, 2)],
      `C = (${m}/${d})x + ${b}/${d}. Each extra unit adds ${m}/${d} = ${dec(m / d, 2)} dollars.`)
  }),
  // 33. Difference of values of a linear function.
  form(CALC[18], function linearDifference() {
    const s = pick([1, 2, 3, 4, 0.5, 1.5]), x1 = r(1, 6), x2 = x1 + 2 * r(1, 4), x3 = r(2, 9), x4 = x3 + 2 * r(2, 7), D = s * (x2 - x1)
    return ask(`If f is a linear function for which f(${x2}) ${M} f(${x1}) = ${dec(D, 1)}, what is the value of f(${x4}) ${M} f(${x3})?`, dec(s * (x4 - x3), 1),
      [dec(D, 1), dec(D * (x4 - x3), 1), dec(s, 1)],
      `The slope is ${dec(D, 1)}/(${x2} ${M} ${x1}) = ${dec(s, 1)}. Over ${x4 - x3} units, f changes by ${dec(s, 1)} × ${x4 - x3} = ${dec(s * (x4 - x3), 1)}.`, [dec(s * (x4 - x3) + 2, 1)])
  }),
  // 34. Square under a parabola.
  form(T3_NOCALC[5], function squareUnderParabola() {
    const s = 2 * r(2, 12), c = r(1, s - 1)
    const a = frac(4 * (s - c), s * s)
    return ask(`The graph of y = ax² + ${c} is drawn in the xy-plane. A and D are on the x-axis, B and C are on the graph, and ABCD is a square of area ${s * s} that is centered on the y-axis. What is the value of a?`,
      a, [frac(s - c, s * s), frac(4 * s, s * s), frac(2 * (s - c), s * s)],
      `The side is ${s}, so C = (${s / 2}, ${s}). Then a(${s / 2})² + ${c} = ${s}, ${(s * s) / 4}a = ${s - c} and a = ${a}.`, [frac(4 * (s - c) + 1, s * s)])
  }),
  // 35. Angle inside a triangle made by splitting two corners.
  form(CALC[27], function splitCornersAngle() {
    let q, beta; do { q = pick([1, 2, 3]); beta = 10 * r(2, 12) } while ((180 - beta) % (q + 1))
    const s = (180 - beta) / (q + 1), k = 180 - q * s
    return ask(`In triangle ABC, angle B is ${beta}°. Point D is inside the triangle. AD splits angle A into x° (next to AB) and ${q === 1 ? '' : q}x° (next to AC), and CD splits angle C into y° (next to CB) and ${q === 1 ? '' : q}y° (next to CA). If angle ADC is k°, what is the value of k?`,
      k, [beta, 180 - beta, 180 - s].filter((v) => v !== k),
      `Triangle ABC: ${beta} + ${q + 1}x + ${q + 1}y = 180, so x + y = ${s}. Triangle ADC: k + ${q === 1 ? '' : q}x + ${q === 1 ? '' : q}y = 180, so k = 180 ${M} ${q * s} = ${k}.`, [k + 10, k - 10])
  }),
  // 36. Four rectangles around a square.
  form(T3_CALC[25], function rectanglesAroundSquare() {
    const a = r(1, 8), b = a + r(2, 8), byPerim = pick([true, false])
    return ask(`Four rectangles, each a by b with a < b, are placed around a smaller square to make a larger square. The smaller square has area ${(b - a) ** 2}, and ${byPerim ? `each rectangle has perimeter ${2 * (a + b)}` : `the larger square has area ${(a + b) ** 2}`}. What is the value of b?`,
      b, [a, a + b, b - a].filter((v) => v !== b),
      `The small square's side is b ${M} a = ${b - a}. ${byPerim ? `2(a + b) = ${2 * (a + b)}` : `The big square's side is a + b`}, so a + b = ${a + b}. Adding: 2b = ${2 * b}, b = ${b}.`, [b + 1, b - 1])
  }),
  // 37. Circles in a row inside a bigger circle.
  form(T3_NOCALC[9], function circlesInCircle() {
    const n = pick([2, 3]), A = r(3, 20)
    return ask(`${n === 2 ? 'Two' : 'Three'} equal circles sit in a row along a diameter of a larger circle, touching each other, with the ones at the ends touching the larger circle. If each small circle has area ${A}, what is the area of the part of the larger circle outside the small circles?`,
      n * n * A - n * A, [n * n * A, n * A, (n * n - 1) * A].filter((v) => v !== n * n * A - n * A),
      `The big diameter is ${n} small diameters, so its radius is ${n} times as long and its area is ${n * n} times as big: ${n * n * A}. Take away the ${n} small circles: ${n * n * A} ${M} ${n * A} = ${n * n * A - n * A}.`, [n * n * A - n * A + A])
  }),
  // 38. Largest constant below a parabola.
  form(CALC[26], function maxBelowParabola() {
    const h = r(-5, 5), m = r(-6, 8), b = -2 * h, c = m + h * h
    return ask(`f(x) = ${poly([1, b, c])} and g(x) = k. If f(x) ≥ g(x) for all real numbers x, and k is a constant, what is the greatest possible value of k?`,
      m, [c, h, c + h * h].filter((v) => v !== m),
      `f(x) = (x ${h >= 0 ? M : '+'} ${Math.abs(h)})²${tail(m)}, so its smallest value is ${num(m)}. k can be at most ${num(m)}.`, [m + 1, m - 1])
  }),
]

export const MAKERS = [...NO_CALC, ...CALC, ...T5_NOCALC, ...T2_NOCALC, ...T3_NOCALC, ...T4_NOCALC, ...T6_NOCALC, ...T7_NOCALC, ...T8_NOCALC, ...T2_CALC, ...T3_CALC, ...T4_CALC, ...T5_CALC, ...T6_CALC, ...T7_CALC, ...T8_CALC]

// Types: each one is a list of forms. A form made with form(name, ...) joins the type of the maker with that name.
export const TYPES = (() => {
  const groups = new Map()
  for (const m of MAKERS) if (!m.sameAs) groups.set(m, [m])
  for (const m of MAKERS) if (m.sameAs) {
    if (!groups.has(m.sameAs)) throw new Error('A form points at a maker that is not a type')
    groups.get(m.sameAs).push(m)
  }
  return [...groups.values()]
})()

// One new question of every type, in the order of the owner's set.
export const makeMathQuestions = () => TYPES.map((forms, n) => ({ id: `m${n + 1}-${Math.random().toString(36).slice(2, 7)}`, ...pick(forms)() }))

// How many math questions one test asks. Each test picks this many different types at random, then one form of each, with new numbers.
export const MATH_PER_TEST = 5

// A full short test: random math types (kept in the source order), then the reading and writing questions from the sample set.
export function makeSatTest(sample) {
  const types = [...TYPES.keys()].sort(() => Math.random() - 0.5).slice(0, MATH_PER_TEST).sort((a, b) => a - b)
  const math = types.map((n) => ({ id: `m${n + 1}-${Math.random().toString(36).slice(2, 7)}`, ...pick(TYPES[n])() }))
  return [...math, ...sample.filter((q) => q.section !== 'Math')]
}
