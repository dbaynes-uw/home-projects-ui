export default {
  calculateFrontPar(golf) {
    this.front_par = 0
    return this.front_par = golf.par_1_hole + 
                            golf.par_2_hole +
                            golf.par_3_hole +
                            golf.par_4_hole +
                            golf.par_5_hole +
                            golf.par_6_hole +
                            golf.par_7_hole +
                            golf.par_8_hole +
                            golf.par_9_hole 
  },
  calculateBackPar(golf) {
    this.back_par = 0
    return this.back_par = golf.par_10_hole + 
                           golf.par_11_hole +
                           golf.par_12_hole +
                           golf.par_13_hole +
                           golf.par_14_hole +
                           golf.par_15_hole +
                           golf.par_16_hole +
                           golf.par_17_hole +
                           golf.par_18_hole 
  },
  calculateTotalPar(golf) {
    this.total_par = 0
    return this.total_par = golf.par_1_hole + 
                            golf.par_2_hole +
                            golf.par_3_hole +
                            golf.par_4_hole +
                            golf.par_5_hole +
                            golf.par_6_hole +
                            golf.par_7_hole +
                            golf.par_8_hole +
                            golf.par_9_hole +
                            golf.par_10_hole + 
                            golf.par_11_hole +
                            golf.par_12_hole +
                            golf.par_13_hole +
                            golf.par_14_hole +
                            golf.par_15_hole +
                            golf.par_16_hole +
                            golf.par_17_hole +
                            golf.par_18_hole 
  },
  calculateFrontScore(golf) {
    this.front_score = 0
    return this.front_score = golf.score_1_hole + 
                              golf.score_2_hole +
                              golf.score_3_hole +
                              golf.score_4_hole +
                              golf.score_5_hole +
                              golf.score_6_hole +
                              golf.score_7_hole +
                              golf.score_8_hole +
                              golf.score_9_hole 
  },
  calculateBackScore(golf) {
    this.back_score = 0
    return this.back_score = golf.score_10_hole + 
                             golf.score_11_hole +
                             golf.score_12_hole +
                             golf.score_13_hole +
                             golf.score_14_hole +
                             golf.score_15_hole +
                             golf.score_16_hole +
                             golf.score_17_hole +
                             golf.score_18_hole 
  },
  calculateTotalScore(golf) {
    this.total_score = 0
    return this.total_score = golf.score_1_hole + 
                              golf.score_2_hole +
                              golf.score_3_hole +
                              golf.score_4_hole +
                              golf.score_5_hole +
                              golf.score_6_hole +
                              golf.score_7_hole +
                              golf.score_8_hole +
                              golf.score_9_hole +
                              golf.score_10_hole + 
                              golf.score_11_hole +
                              golf.score_12_hole +
                              golf.score_13_hole +
                              golf.score_14_hole +
                              golf.score_15_hole +
                              golf.score_16_hole +
                              golf.score_17_hole +
                              golf.score_18_hole 
  },
  calculateFrontPutts(golf) {
    this.front_putts = 0
    return this.front_putts = golf.putts_1_hole + 
                              golf.putts_2_hole +
                              golf.putts_3_hole +
                              golf.putts_4_hole +
                              golf.putts_5_hole +
                              golf.putts_6_hole +
                              golf.putts_7_hole +
                              golf.putts_8_hole +
                              golf.putts_9_hole 
  },
  calculateBackPutts(golf) {
    this.back_putts = 0
    return this.back_putts = golf.putts_10_hole +
                             golf.putts_11_hole +
                             golf.putts_12_hole +
                             golf.putts_13_hole +
                             golf.putts_14_hole +
                             golf.putts_15_hole +
                             golf.putts_16_hole +
                             golf.putts_17_hole +
                             golf.putts_18_hole 
  },
  calculateTotalPutts(golf) {
    this.total_putts = 0
    return this.total_putts = golf.putts_1_hole + 
                              golf.putts_2_hole +
                              golf.putts_3_hole +
                              golf.putts_4_hole +
                              golf.putts_5_hole +
                              golf.putts_6_hole +
                              golf.putts_7_hole +
                              golf.putts_8_hole +
                              golf.putts_9_hole +
                              golf.putts_10_hole +
                              golf.putts_11_hole +
                              golf.putts_12_hole +
                              golf.putts_13_hole +
                              golf.putts_14_hole +
                              golf.putts_15_hole +
                              golf.putts_16_hole +
                              golf.putts_17_hole +
                              golf.putts_18_hole 
  },
  calculateFrontPenalty(golf) {
    this.front_penalty = 0
    return this.front_penalty = golf.penalty_1_hole + 
                                golf.penalty_2_hole +
                                golf.penalty_3_hole +
                                golf.penalty_4_hole +
                                golf.penalty_5_hole +
                                golf.penalty_6_hole +
                                golf.penalty_7_hole +
                                golf.penalty_8_hole +
                                golf.penalty_9_hole 
  },
  calculateBackPenalty(golf) {
    this.back_penalty = 0
    return this.back_penalty = golf.penalty_10_hole +
                               golf.penalty_11_hole + 
                               golf.penalty_12_hole +
                               golf.penalty_13_hole +
                               golf.penalty_14_hole +
                               golf.penalty_15_hole +
                               golf.penalty_16_hole +
                               golf.penalty_17_hole +
                               golf.penalty_18_hole 
  },
  calculateTotalPenalty(golf) {
    this.total_penalty = 0
    return this.total_penalty = golf.penalty_1_hole + 
                                golf.penalty_2_hole +
                                golf.penalty_3_hole +
                                golf.penalty_4_hole +
                                golf.penalty_5_hole +
                                golf.penalty_6_hole +
                                golf.penalty_7_hole +
                                golf.penalty_8_hole +
                                golf.penalty_9_hole +
                                golf.penalty_10_hole +
                                golf.penalty_11_hole + 
                                golf.penalty_12_hole +
                                golf.penalty_13_hole +
                                golf.penalty_14_hole +
                                golf.penalty_15_hole +
                                golf.penalty_16_hole +
                                golf.penalty_17_hole +
                                golf.penalty_18_hole 
  },  
}