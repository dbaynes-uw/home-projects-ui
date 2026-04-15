// Sums golf[`${field}_N_hole`] for N in [from, to], treating null/undefined as 0
function sumHoles(golf, field, from, to) {
  let total = 0
  for (let i = from; i <= to; i++) {
    total += Number(golf[`${field}_${i}_hole`]) || 0
  }
  return total
}

export default {
  calculateFrontPar(golf)     { return sumHoles(golf, 'par',     1,  9) },
  calculateBackPar(golf)      { return sumHoles(golf, 'par',    10, 18) },
  calculateTotalPar(golf)     { return sumHoles(golf, 'par',     1, 18) },

  calculateFrontScore(golf)   { return sumHoles(golf, 'score',   1,  9) },
  calculateBackScore(golf)    { return sumHoles(golf, 'score',  10, 18) },
  calculateTotalScore(golf)   { return sumHoles(golf, 'score',   1, 18) },

  calculateFrontPutts(golf)   { return sumHoles(golf, 'putts',   1,  9) },
  calculateBackPutts(golf)    { return sumHoles(golf, 'putts',  10, 18) },
  calculateTotalPutts(golf)   { return sumHoles(golf, 'putts',   1, 18) },

  calculateFrontPenalty(golf) { return sumHoles(golf, 'penalty', 1,  9) },
  calculateBackPenalty(golf)  { return sumHoles(golf, 'penalty',10, 18) },
  calculateTotalPenalty(golf) { return sumHoles(golf, 'penalty', 1, 18) },

  determineHolesPlayed(golf) {
    let count = 0
    for (let i = 1; i <= 18; i++) {
      if (Number(golf[`score_${i}_hole`]) > 0) count++
    }
    return count
  },

  calculateAverageScore9(golfs) {
    const rounds = golfs.filter(g => this.determineHolesPlayed(g) === 9)
    if (!rounds.length) return 0
    const total = rounds.reduce((sum, g) => sum + sumHoles(g, 'score', 1, 9), 0)
    return (total / rounds.length).toFixed(1)
  },

  calculateAverageScore18(golfs) {
    const rounds = golfs.filter(g => this.determineHolesPlayed(g) === 18)
    if (!rounds.length) return 0
    const total = rounds.reduce((sum, g) => sum + sumHoles(g, 'score', 1, 18), 0)
    return (total / rounds.length).toFixed(1)
  },
}

