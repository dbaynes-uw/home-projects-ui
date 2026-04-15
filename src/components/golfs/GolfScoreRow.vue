<template>
  <div class="score-row-card">
    <div class="score-inputs">
      <div class="score-cell">
        <label class="cell-label">Par</label>
        <input
          type="number"
          class="score-input"
          :value="par"
          min="3" max="5"
          inputmode="numeric"
          @input="$emit('update:par', +$event.target.value || null)"
        />
      </div>
      <div class="score-cell">
        <label class="cell-label">Score</label>
        <input
          type="number"
          class="score-input score-main"
          :value="score"
          min="1" max="12"
          inputmode="numeric"
          @input="$emit('update:score', +$event.target.value || null)"
        />
      </div>
      <div class="score-cell">
        <label class="cell-label">Putts</label>
        <input
          type="number"
          class="score-input"
          :value="putts"
          min="0" max="6"
          inputmode="numeric"
          @input="$emit('update:putts', +$event.target.value || null)"
        />
      </div>
      <div class="score-cell">
        <label class="cell-label">Penalty</label>
        <input
          type="number"
          class="score-input"
          :value="penalty"
          min="0" max="4"
          inputmode="numeric"
          @input="$emit('update:penalty', +$event.target.value || null)"
        />
      </div>
    </div>

    <div v-if="par && score" class="vs-par">
      <span :class="vsPar.css">{{ vsPar.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  holeNumber: { type: Number, required: true },
  par:        { type: Number, default: null },
  score:      { type: Number, default: null },
  putts:      { type: Number, default: null },
  penalty:    { type: Number, default: null },
})

defineEmits(['update:par', 'update:score', 'update:putts', 'update:penalty'])

const vsPar = computed(() => {
  if (!props.par || !props.score) return { label: '', css: '' }
  const diff = props.score - props.par
  if (diff <= -2) return { label: 'Eagle 🦅',      css: 'badge eagle' }
  if (diff === -1) return { label: 'Birdie 🐦',     css: 'badge birdie' }
  if (diff ===  0) return { label: 'Par ✓',         css: 'badge par' }
  if (diff ===  1) return { label: 'Bogey',          css: 'badge bogey' }
  if (diff ===  2) return { label: 'Double Bogey',   css: 'badge double' }
  return { label: `+${diff}`, css: 'badge triple' }
})
</script>

<style scoped>
.score-row-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  padding: 1.5rem 1rem;
  margin: 0.5rem auto;
  max-width: 480px;
}

.score-inputs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.score-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.cell-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #666;
  letter-spacing: 0.06em;
}

.score-input {
  width: 100%;
  height: 68px;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  border: 2px solid #ddd;
  border-radius: 12px;
  background: #f8f9fa;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  color: #333;
}

.score-input:focus {
  border-color: #2d6a2d;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(45, 106, 45, 0.15);
}

.score-main {
  font-size: 2.4rem;
  height: 76px;
  border-color: #2d6a2d;
  background: #f0f7f0;
}

/* Hide number spinners on webkit */
.score-input::-webkit-inner-spin-button,
.score-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.vs-par {
  text-align: center;
  margin-top: 1rem;
}

.badge {
  display: inline-block;
  padding: 0.35rem 1.25rem;
  border-radius: 24px;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.02em;
}

.eagle  { background: #ffd700; color: #333; }
.birdie { background: #e53935; color: white; }
.par    { background: #43a047; color: white; }
.bogey  { background: #90caf9; color: #1a237e; }
.double { background: #1565c0; color: white; }
.triple { background: #880e4f; color: white; }
</style>
