// SAT-style math questions (no calculator and calculator sections), made fresh each time the test starts.
// Each maker below copies the TYPE of one question from the owner's practice tests (section 3 of tests 1 to 8, section 4 of tests 1 and 2), with new numbers and names,
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

export const MAKERS = [...NO_CALC, ...CALC, ...T5_NOCALC, ...T2_NOCALC, ...T3_NOCALC, ...T4_NOCALC, ...T6_NOCALC, ...T7_NOCALC, ...T8_NOCALC, ...T2_CALC]

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
