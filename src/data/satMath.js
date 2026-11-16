// SAT-style math questions (no calculator and calculator sections), made fresh each time the test starts.
// Each maker below copies the TYPE of one question from the owner's practice tests (test 1 sections 3 and 4, tests 5 and 2 section 3), with new numbers and names,
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

export const MAKERS = [...NO_CALC, ...CALC, ...T5_NOCALC, ...T2_NOCALC]

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
export const MATH_PER_TEST = 10

// A full short test: random math types (kept in the source order), then the reading and writing questions from the sample set.
export function makeSatTest(sample) {
  const types = [...TYPES.keys()].sort(() => Math.random() - 0.5).slice(0, MATH_PER_TEST).sort((a, b) => a - b)
  const math = types.map((n) => ({ id: `m${n + 1}-${Math.random().toString(36).slice(2, 7)}`, ...pick(TYPES[n])() }))
  return [...math, ...sample.filter((q) => q.section !== 'Math')]
}
