// Sums golf[`${field}_N_hole`] for N in [from, to], treating null/undefined as 0
function sumHoles(golf, field, from, to) {
  let total = 0
  for (let i = from; i <= to; i++) {
    total += Number(golf[`${field}_${i}_hole`]) || 0
  }
  return total
}

export default {
  // ── Round-level par helpers (golf_rounds shape) ────────────────────────
  calculateFrontPar(round)     { return sumHoles(round, 'par',     1,  9) },
  calculateBackPar(round)      { return sumHoles(round, 'par',    10, 18) },
  calculateTotalPar(round)     { return sumHoles(round, 'par',     1, 18) },

  // ── Player score helpers (player_scores shape) ─────────────────────────
  calculateFrontScore(ps)   { return sumHoles(ps, 'score',   1,  9) },
  calculateBackScore(ps)    { return sumHoles(ps, 'score',  10, 18) },
  calculateTotalScore(ps)   { return sumHoles(ps, 'score',   1, 18) },

  calculateFrontPutts(ps)   { return sumHoles(ps, 'putts',   1,  9) },
  calculateBackPutts(ps)    { return sumHoles(ps, 'putts',  10, 18) },
  calculateTotalPutts(ps)   { return sumHoles(ps, 'putts',   1, 18) },

  calculateFrontPenalty(ps) { return sumHoles(ps, 'penalty', 1,  9) },
  calculateBackPenalty(ps)  { return sumHoles(ps, 'penalty',10, 18) },
  calculateTotalPenalty(ps) { return sumHoles(ps, 'penalty', 1, 18) },

  determineHolesPlayed(ps) {
    let count = 0
    for (let i = 1; i <= 18; i++) {
      if (Number(ps[`score_${i}_hole`]) > 0) count++
    }
    return count
  },

  // Average score for rounds with 9 or 18 holes played (array of player_scores)
  calculateAverageScore9(playerScoresList) {
    const rounds = playerScoresList.filter(ps => this.determineHolesPlayed(ps) === 9)
    if (!rounds.length) return 0
    const total = rounds.reduce((sum, ps) => sum + sumHoles(ps, 'score', 1, 9), 0)
    return (total / rounds.length).toFixed(1)
  },

  calculateAverageScore18(playerScoresList) {
    const rounds = playerScoresList.filter(ps => this.determineHolesPlayed(ps) === 18)
    if (!rounds.length) return 0
    const total = rounds.reduce((sum, ps) => sum + sumHoles(ps, 'score', 1, 18), 0)
    return (total / rounds.length).toFixed(1)
  },
}

