// SAT-style math questions (no calculator), made fresh each time the test starts.
// Each maker below copies the TYPE of one question from the owner's practice set (16 Nov), with new numbers and names,
// so every attempt is different but tests the same skill. The wording is written for this site, not copied.
// Questions 16 to 20 were grid-in (type the answer) in the source; here they are multiple choice like the rest of the test.
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
const ask = (q, right, wrong, why, spare) => ({ section: 'Math', q, ...choices(String(right), wrong.map(String), (spare || []).map(String)), why })

const NAMES = ['Ama', 'Kofi', 'Esi', 'Yaw', 'Abena', 'Kwame', 'Akosua', 'Kojo', 'Efua', 'Nana']

export const MAKERS = [
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

// One new question of every type, in the order of the owner's set.
export const makeMathQuestions = () => MAKERS.map((make, n) => ({ id: `m${n + 1}-${Math.random().toString(36).slice(2, 7)}`, ...make() }))

// How many math questions one test asks. Each test picks this many different types at random, each with new numbers.
export const MATH_PER_TEST = 10

// A full short test: random math types (kept in the source order), then the reading and writing questions from the sample set.
export function makeSatTest(sample) {
  const types = [...MAKERS.keys()].sort(() => Math.random() - 0.5).slice(0, MATH_PER_TEST).sort((a, b) => a - b)
  const math = types.map((n) => ({ id: `m${n + 1}-${Math.random().toString(36).slice(2, 7)}`, ...MAKERS[n]() }))
  return [...math, ...sample.filter((q) => q.section !== 'Math')]
}
