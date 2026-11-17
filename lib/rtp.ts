// RTP balancing + case-opening simulation.
//
// Given item prices and a target expected value (EV = rtp% * casePrice),
// we compute a probability for each item. We use a softmax over normalized
// prices: q_i ∝ exp(-lambda * pn_i). Increasing lambda concentrates weight on
// cheaper items (lower EV); decreasing it favours expensive items (higher EV).
// A binary search on lambda finds the value that hits the target EV, so the
// distribution is smooth and every item keeps a non-zero drop chance.

export function computeDropChances(prices: number[], targetEV: number): number[] {
  const n = prices.length
  if (n === 0) return []
  if (n === 1) return [1]

  const maxPrice = Math.max(...prices, 1)
  const minPrice = Math.min(...prices)
  const maxAchievable = Math.max(...prices)

  // Clamp the target inside what the item set can actually produce.
  const target = Math.min(Math.max(targetEV, minPrice + 0.0001), maxAchievable - 0.0001)

  const pn = prices.map((p) => p / maxPrice)

  const evForLambda = (lambda: number): { ev: number; probs: number[] } => {
    const weights = pn.map((x) => Math.exp(-lambda * x))
    const sum = weights.reduce((a, b) => a + b, 0) || 1
    const probs = weights.map((w) => w / sum)
    const ev = probs.reduce((acc, q, i) => acc + q * prices[i], 0)
    return { ev, probs }
  }

  let lo = -60
  let hi = 60
  let best = evForLambda(0).probs
  for (let iter = 0; iter < 80; iter++) {
    const mid = (lo + hi) / 2
    const { ev, probs } = evForLambda(mid)
    best = probs
    // Higher lambda -> lower EV. If EV too high, increase lambda (search up).
    if (ev > target) {
      lo = mid
    } else {
      hi = mid
    }
    if (Math.abs(ev - target) < 0.0001) break
  }
  return best
}

export type SimulationResult = {
  opens: number
  spent: number
  playersWon: number
  netProfit: number
  actualRtp: number
}

/** Simulate opening a case `opens` times given item prices + probabilities. */
export function simulateOpenings(
  prices: number[],
  probs: number[],
  casePrice: number,
  opens = 1000,
): SimulationResult {
  // Cumulative distribution for sampling.
  const cum: number[] = []
  let acc = 0
  for (const p of probs) {
    acc += p
    cum.push(acc)
  }

  let won = 0
  for (let i = 0; i < opens; i++) {
    const r = Math.random() * (cum[cum.length - 1] || 1)
    let idx = cum.findIndex((c) => r <= c)
    if (idx < 0) idx = prices.length - 1
    won += prices[idx]
  }

  const spent = opens * casePrice
  return {
    opens,
    spent,
    playersWon: won,
    netProfit: spent - won,
    actualRtp: spent > 0 ? (won / spent) * 100 : 0,
  }
}

/** Expected RTP from probabilities (no randomness) — for display. */
export function expectedRtp(prices: number[], probs: number[], casePrice: number): number {
  if (casePrice <= 0) return 0
  const ev = probs.reduce((acc, q, i) => acc + q * prices[i], 0)
  return (ev / casePrice) * 100
}
