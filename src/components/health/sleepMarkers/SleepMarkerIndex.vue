<template>
  <div class="sleep-marker-index">
    <!-- ✅ SEARCH & FILTER BAR -->
    <div class="index-controls">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search sleep records..."
          class="search-input"
        />
      </div>

      <div class="filter-controls">
        <select v-model="qualityFilter" class="filter-select">
          <option value="">All Quality Levels</option>
          <option value="high">High Quality (8-10)</option>
          <option value="medium">Medium Quality (5-7)</option>
          <option value="low">Low Quality (1-4)</option>
        </select>

        <select v-model="sortBy" class="filter-select">
          <option value="date-desc">Date (Newest First)</option>
          <option value="date-asc">Date (Oldest First)</option>
          <option value="quality-desc">Quality (Highest First)</option>
          <option value="quality-asc">Quality (Lowest First)</option>
          <option value="duration-desc">Duration (Longest First)</option>
          <option value="duration-asc">Duration (Shortest First)</option>
        </select>

        <button @click="showColumnToggle = !showColumnToggle" class="btn-toggle-columns" title="Toggle Columns">
          <i class="fas fa-columns"></i>
        </button>
      </div>
    </div>

    <!-- ✅ COLUMN VISIBILITY TOGGLE -->
    <transition name="slide-down">
      <div v-if="showColumnToggle" class="column-toggle-panel">
        <h4><i class="fas fa-eye"></i> Visible Columns</h4>
        <div class="column-toggles">
          <label v-for="(visible, col) in visibleColumns" :key="col" class="column-toggle-item">
            <input type="checkbox" v-model="visibleColumns[col]" @change="saveColumnPreferences" />
            <span>{{ getColumnLabel(col) }}</span>
          </label>
        </div>
      </div>
    </transition>

    <!-- ✅ TABLE VIEW -->
    <div class="table-container compact-table">
      <table class="data-table">
        <thead>
          <tr>
            <th @click="setSortBy('date')" class="sortable">
              <i class="fas fa-calendar-day"></i>
              Date
              <i v-if="sortBy.startsWith('date')" :class="sortBy.includes('desc') ? 'fas fa-sort-down' : 'fas fa-sort-up'"></i>
            </th>
            <th v-if="visibleColumns.sleepScore" @click="setSortBy('sleepScore')" class="sortable">
              <i class="fas fa-star"></i>
              Score
              <i v-if="sortBy.startsWith('sleepScore')" :class="sortBy.includes('desc') ? 'fas fa-sort-down' : 'fas fa-sort-up'"></i>
            </th>            
            <th v-if="visibleColumns.inBed" @click="setSortBy('inBed')" class="sortable">
              <i class="fas fa-clock"></i>
              In Bed
              <i v-if="sortBy.startsWith('inBed')" :class="sortBy.includes('desc') ? 'fas fa-sort-down' : 'fas fa-sort-up'"></i>
            </th>
            <th v-if="visibleColumns.asleep" @click="setSortBy('asleep')" class="sortable">
              <i class="fas fa-moon"></i>
              Asleep
              <i v-if="sortBy.startsWith('asleep')" :class="sortBy.includes('desc') ? 'fas fa-sort-down' : 'fas fa-sort-up'"></i>              
            </th>
            <th v-if="visibleColumns.awake" @click="setSortBy('awake')" class="sortable">
              <i class="fa-solid fa-bolt"></i>
              Awake
              <i v-if="sortBy.startsWith('awake')" :class="sortBy.includes('desc') ? 'fas fa-sort-down' : 'fas fa-sort-up'"></i>
            </th>
            <th v-if="visibleColumns.rem" @click="setSortBy('rem')" class="sortable">
              <i class="fa-solid fa-brain"></i>
              REM
              <i v-if="sortBy.startsWith('rem')" :class="sortBy.includes('desc') ? 'fas fa-sort-down' : 'fas fa-sort-up'"></i>
            </th>
            <th v-if="visibleColumns.core" @click="setSortBy('core')" class="sortable">
              <i class="fa-solid fa-circle"></i>
              Core
              <i v-if="sortBy.startsWith('core')" :class="sortBy.includes('desc') ? 'fas fa-sort-down' : 'fas fa-sort-up'"></i>
            </th>
            <th v-if="visibleColumns.deep" @click="setSortBy('deep')" class="sortable">
              <i class="fa-solid fa-water"></i>
              Deep
              <i v-if="sortBy.startsWith('deep')" :class="sortBy.includes('desc') ? 'fas fa-sort-down' : 'fas fa-sort-up'"></i>
            </th>
            <th v-if="visibleColumns.fromBpm" @click="setSortBy('from-bpm')" class="sortable">
              <i class="fa-solid fa-heart"></i>
              BPM↓
              <i v-if="sortBy.startsWith('from-bpm')" :class="sortBy.includes('desc') ? 'fas fa-sort-down' : 'fas fa-sort-up'"></i>
            </th>
            <th v-if="visibleColumns.toBpm" @click="setSortBy('to-bpm')" class="sortable">
              <i class="fa-solid fa-heart"></i>
              BPM↑
              <i v-if="sortBy.startsWith('to-bpm')" :class="sortBy.includes('desc') ? 'fas fa-sort-down' : 'fas fa-sort-up'"></i>
            </th>
            <th v-if="visibleColumns.fromBreaths" @click="setSortBy('from-breaths')" class="sortable">
              <i class="fa-solid fa-wind"></i>
              Br↓
              <i v-if="sortBy.startsWith('from-breaths')" :class="sortBy.includes('desc') ? 'fas fa-sort-down' : 'fas fa-sort-up'"></i>
            </th>
            <th v-if="visibleColumns.toBreaths" @click="setSortBy('to-breaths')" class="sortable">
              <i class="fa-solid fa-wind"></i>
              Br↑
              <i v-if="sortBy.startsWith('to-breaths')" :class="sortBy.includes('desc') ? 'fas fa-sort-down' : 'fas fa-sort-up'"></i>
            </th>
            <th v-if="visibleColumns.oob" @click="setSortBy('oob')" class="sortable">
              <i class="fas fa-ghost"></i>
              OOB
              <i v-if="sortBy.startsWith('oob')" :class="sortBy.includes('desc') ? 'fas fa-sort-down' : 'fas fa-sort-up'"></i>
            </th>
            <th class="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="sleepMarker in filteredMarkers"
            :key="sleepMarker.id"
            class="data-row"
            @click="openModal(sleepMarker)"
          >
            <td class="date-cell">{{ formatDate(sleepMarker.sleep_date) }}</td>
            <td v-if="visibleColumns.sleepScore">{{ sleepMarker.sleep_score }}</td>
            <td v-if="visibleColumns.inBed">{{ sleepMarker.time_in_bed }}</td>
            <td v-if="visibleColumns.asleep">{{ sleepMarker.time_asleep }}</td>
            <td v-if="visibleColumns.awake">{{ sleepMarker.awake }}</td>
            <td v-if="visibleColumns.rem">{{ sleepMarker.rem }}</td>
            <td v-if="visibleColumns.core">{{ sleepMarker.core }}</td>
            <td v-if="visibleColumns.deep">{{ sleepMarker.deep }}</td>
            <td v-if="visibleColumns.fromBpm">{{ sleepMarker.from_heart_beats_per_minute }}</td>
            <td v-if="visibleColumns.toBpm">{{ sleepMarker.to_heart_beats_per_minute }}</td>
            <td v-if="visibleColumns.fromBreaths">{{ sleepMarker.from_breaths_per_minute }}</td>
            <td v-if="visibleColumns.toBreaths">{{ sleepMarker.to_breaths_per_minute }}</td>
            <td v-if="visibleColumns.oob" class="oob-cell">
              <i v-if="sleepMarker.had_oob" class="fas fa-ghost oob-icon" title="Had OOB"></i>
              <span v-else class="text-muted">-</span>
            </td>

            <td class="actions-cell" @click.stop>
              <button
                class="action-btn edit-btn"
                @click="openModal(sleepMarker)"
                title="View Details"
              >
                <i class="fas fa-eye"></i>
              </button>
              <button
                class="action-btn delete-btn"
                @click="$emit('delete', sleepMarker)"
                title="Delete"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- ✅ EMPTY STATE -->
      <div v-if="filteredMarkers.length === 0" class="empty-state">
        <i class="fas fa-bed"></i>
        <p>No sleep records found</p>
      </div>
    </div>

    <!-- ✅ STATS SUMMARY -->
    <div class="stats-summary">
      <div class="stat-item">
        <i class="fas fa-list"></i>
        <span class="stat-value">{{ filteredMarkers.length }}</span>
        <span class="stat-label">Records</span>
      </div>
      <div class="stat-item">
        <i class="fas fa-clock"></i>
        <span class="stat-value">{{ averageSleep }}</span>
        <span class="stat-label">Avg Sleep</span>
      </div>
      <div class="stat-item">
        <i class="fas fa-star"></i>
        <span class="stat-value">{{ averageScore }}</span>
        <span class="stat-label">Avg Score</span>
      </div>
    </div>

    <!-- ✅ MODAL (Same as SleepMarkers) -->
    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <div class="modal-header">
            <h2>
              <i class="fas fa-bed"></i>
              Sleep Details
            </h2>
            <button class="modal-close" @click="closeModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
        
          <div class="modal-body">
            <SleepMarkerCard
              v-if="selectedMarker"
              :sleepMarker="selectedMarker"
              viewMode="detail" 
            />
          </div>
        
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">
              <i class="fas fa-times"></i>
              Close
            </button>
            <button class="btn btn-primary" @click="handleEdit(selectedMarker)">
              <i class="fas fa-edit"></i>
              Edit
            </button>
            <button class="btn btn-danger" @click="handleDelete(selectedMarker)">
              <i class="fas fa-trash"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import SleepMarkerCard from './SleepMarkerCard.vue';

const props = defineProps({
  sleepMarkers: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete']);

// ✅ MODAL STATE
const showModal = ref(false);
const selectedMarker = ref(null);

// ✅ FILTERS & SEARCH
const searchQuery = ref('');
const qualityFilter = ref('');
const sortBy = ref('date-desc');

// ✅ COLUMN VISIBILITY
const showColumnToggle = ref(false);
const visibleColumns = ref({
  sleepScore: true,
  inBed: true,
  asleep: true,
  awake: true,
  rem: true,
  core: true,
  deep: true,
  fromBpm: false,
  toBpm: false,
  fromBreaths: false,
  toBreaths: false,
  oob: true
});

// ✅ Load column preferences from localStorage
onMounted(() => {
  const saved = localStorage.getItem('sleepMarkerColumns');
  if (saved) {
    try {
      visibleColumns.value = { ...visibleColumns.value, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Failed to load column preferences:', e);
    }
  }
});

// ✅ Save column preferences to localStorage
function saveColumnPreferences() {
  localStorage.setItem('sleepMarkerColumns', JSON.stringify(visibleColumns.value));
}

// ✅ Get readable column label
function getColumnLabel(col) {
  const labels = {
    sleepScore: 'Sleep Score',
    inBed: 'In Bed',
    asleep: 'Asleep',
    awake: 'Awake',
    rem: 'REM',
    core: 'Core',
    deep: 'Deep',
    fromBpm: 'BPM From',
    toBpm: 'BPM To',
    fromBreaths: 'Breaths From',
    toBreaths: 'Breaths To',
    oob: 'OOB'
  };
  return labels[col] || col;
}

// ✅ MODAL METHODS
function openModal(sleepMarker) {
  selectedMarker.value = sleepMarker;
  showModal.value = true;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  showModal.value = false;
  selectedMarker.value = null;
  document.body.style.overflow = '';
}

function handleEdit(sleepMarker) {
  closeModal();
  emit('edit', sleepMarker);
}

function handleDelete(sleepMarker) {
  closeModal();
  emit('delete', sleepMarker);
}

// ✅ FILTERED & SORTED MARKERS
const filteredMarkers = computed(() => {
  let filtered = [...props.sleepMarkers];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(m =>
      m.sleep_date?.toLowerCase().includes(query) ||
      m.sleep_notes?.toLowerCase().includes(query) ||
      m.dream_notes?.toLowerCase().includes(query)
    );
  }

  // Apply quality filter
  if (qualityFilter.value) {
    filtered = filtered.filter(m => {
      const quality = parseInt(m.sleep_quality);
      if (qualityFilter.value === 'high') return quality >= 8;
      if (qualityFilter.value === 'medium') return quality >= 5 && quality <= 7;
      if (qualityFilter.value === 'low') return quality <= 4;
      return true;
    });
  }

  // Apply sorting
  console
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return new Date(b.sleep_date) - new Date(a.sleep_date);
      case 'date-asc':
        return new Date(a.sleep_date) - new Date(b.sleep_date);
      case 'sleepScore-desc':
        return new Date(b.sleep_score) - new Date(a.sleep_score);
      case 'sleepScore-asc':
        return new Date(a.sleep_score) - new Date(b.sleep_score);        
      case 'oob-desc':
        return new Date(b.had_oob) - new Date(a.had_oob);
      case 'oob-asc':
        return new Date(a.had_oob) - new Date(b.had_oob);
      case 'inBed-desc':
        return (parseFloat(b.time_in_bed) || 0) - (parseFloat(a.time_in_bed) || 0);
      case 'inBed-asc':
        return (parseFloat(a.time_in_bed) || 0) - (parseFloat(b.time_in_bed) || 0);
      case 'asleep-desc':
        return parseTime(b.time_asleep) - parseTime(a.time_asleep);
      case 'asleep-asc':
        return parseTime(a.time_asleep) - parseTime(b.time_asleep);
      case 'awake-desc':
        return parseTime(b.awake) - parseTime(a.awake);
      case 'awake-asc':
        return parseTime(a.awake) - parseTime(b.awake);
      case 'rem-desc':
        return parseTime(b.rem) - parseTime(a.rem);
      case 'rem-asc':
        return parseTime(a.rem) - parseTime(b.rem);
      case 'core-desc':
        return parseTime(b.core) - parseTime(a.core);
      case 'core-asc':
        return parseTime(a.core) - parseTime(b.core);
      case 'deep-desc':
        return parseTime(b.deep) - parseTime(a.deep);
      case 'deep-asc':
        return parseTime(a.deep) - parseTime(b.deep);       
      
      case 'from-bpm-desc':
        return (parseInt(b.from_heart_beats_per_minute) || 0) - (parseFloat(a.from_heart_beats_per_minute) || 0);
      case 'from-bpm-asc':
        return (parseInt(a.from_heart_beats_per_minute) || 0) - (parseFloat(b.from_heart_beats_per_minute) || 0);
      case 'to-bpm-desc':
        return (parseInt(b.to_heart_beats_per_minute) || 0) - (parseFloat(a.to_heart_beats_per_minute) || 0);
      case 'to-bpm-asc':
        return (parseInt(a.to_heart_beats_per_minute) || 0) - (parseFloat(b.to_heart_beats_per_minute) || 0);

      case 'from-breaths-desc':
        return (parseFloat(b.from_breaths_per_minute) || 0) - (parseFloat(a.from_breaths_per_minute) || 0);
      case 'from-breaths-asc':
        return (parseFloat(a.from_breaths_per_minute) || 0) - (parseFloat(b.from_breaths_per_minute) || 0);
      case 'to-breaths-desc':
        return (parseFloat(b.to_breaths_per_minute) || 0) - (parseFloat(a.to_breaths_per_minute) || 0);
      case 'to-breaths-asc':
        return (parseFloat(a.to_breaths_per_minute) || 0) - (parseFloat(b.to_breaths_per_minute) || 0);


        //case 'to-breaths-desc':
      //  return (parseFloat(b.to_breaths_per_minute) || 0) - (parseFloat(a.to_breaths_per_minute) || 0);
      
        //case 'to-bpm-asc':
      //  console.log('Sorting bpm ascending', a.to_heart_beats_per_minute, b.to_heart_beats_per_minute);
      //  return (parseInt(a.to_heart_beats_per_minute) || 0) - (parseFloat(b.to_heart_beats_per_minute) || 0);
            
      default:
        return 0;
    }
  });

  return filtered;
});

function setSortBy(column) {
  if (sortBy.value.startsWith(column)) {
    sortBy.value = sortBy.value.includes('desc') ? `${column}-asc` : `${column}-desc`;
  } else {
    sortBy.value = `${column}-desc`;
  }
}

// ✅ FORMATTING HELPERS
function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
// ✅ STATS
const averageSleep = computed(() => {
  if (filteredMarkers.value.length === 0) return '-';
  
  // Filter out invalid or zero values
  const validTimes = filteredMarkers.value
    .map(m => parseTime(m.time_asleep))
    .filter(time => time > 0);
  
  if (validTimes.length === 0) return '-';
  
  const total = validTimes.reduce((sum, time) => sum + time, 0);
  const avg = total / validTimes.length;
  const hours = Math.floor(avg / 60);
  const minutes = Math.round(avg % 60);
  
  return `${hours}h ${minutes}m`;
});

function parseTime(timeStr) {
  if (!timeStr) return 0;
  // If it's a number, treat as minutes
  if (typeof timeStr === 'number') return timeStr;
  if (typeof timeStr === 'string') {
    // Handle 'Xh Ym' or 'Xh' or 'Ym' format
    const hoursMatch = timeStr.match(/(\d+(?:\.\d+)?)h/);
    const minutesMatch = timeStr.match(/(\d+)m/);
    if (hoursMatch || minutesMatch) {
      const hours = hoursMatch ? parseFloat(hoursMatch[1]) : 0;
      const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
      return Math.round(hours * 60 + minutes);
    }
    // Handle 'HH:MM' format
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      if (!isNaN(hours) && !isNaN(minutes)) {
        return hours * 60 + minutes;
      }
    }
    // Handle plain number string (minutes)
    const asInt = parseInt(timeStr);
    if (!isNaN(asInt)) {
      return asInt;
    }
  }
  return 0;
}
const averageScore = computed(() => {
  if (filteredMarkers.value.length === 0) return '-';
  const total = filteredMarkers.value.reduce((sum, m) => sum + parseInt(m.sleep_score), 0);
  return (total / filteredMarkers.value.length).toFixed(1);
});
</script>

<style scoped>
/* ✅ IMPORT SHARED STYLES */
@import '@/assets/styles/ui-components.css';
@import '@/assets/styles/list-view-components.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

.sleep-marker-index {
  width: 100%;
}

/* ✅ COMPACT TABLE STYLING (Option 5) */
.compact-table {
  font-size: 13px;
}

.compact-table th,
.compact-table td {
  padding: 6px 8px;
  white-space: nowrap;
}

.compact-table th {
  font-size: 12px;
  font-weight: 600;
}

.compact-table th i {
  font-size: 12px;
  margin-right: 4px;
}

.compact-table .action-btn {
  padding: 4px 8px;
  font-size: 12px;
}

.compact-table .action-btn i {
  font-size: 12px;
}

/* ✅ COLUMN TOGGLE BUTTON */
.btn-toggle-columns {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-toggle-columns:hover {
  background: #5568d3;
  transform: translateY(-1px);
}

.btn-toggle-columns i {
  font-size: 14px;
}

/* ✅ COLUMN TOGGLE PANEL */
.column-toggle-panel {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.column-toggle-panel h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 8px;
}

.column-toggle-panel h4 i {
  color: #667eea;
}

.column-toggles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
}

.column-toggle-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: #f7fafc;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 13px;
}

.column-toggle-item:hover {
  background: #edf2f7;
}

.column-toggle-item input[type="checkbox"] {
  cursor: pointer;
}

.column-toggle-item span {
  color: #4a5568;
  user-select: none;
}

/* ✅ SLIDE DOWN ANIMATION */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 0;
}

/* Quality badges */
.quality-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
}

.quality-high {
  background: #d4edda;
  color: #155724;
}

.quality-medium {
  background: #fff3cd;
  color: #856404;
}

.quality-low {
  background: #f8d7da;
  color: #721c24;
}

/* Glucose values */
.glucose-value {
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.glucose-good {
  color: #28a745;
  background: #d4edda;
}

.glucose-warning {
  color: #856404;
  background: #fff3cd;
}

.glucose-high {
  color: #721c24;
  background: #f8d7da;
}

/* OOB indicator */
.oob-cell {
  text-align: center;
}

.oob-icon {
  color: #667eea;
  font-size: 18px;
}

/* Stats summary */
.stats-summary {
  display: flex;
  gap: 24px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.stat-item i {
  font-size: 24px;
  color: #667eea;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
}

.stat-label {
  font-size: 14px;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ✅ MODAL STYLES (Same as SleepMarkers) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  overflow-y: auto;
}

.modal-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-size: 18px;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 32px;
  border-top: 1px solid #e2e8f0;
  background: #f7fafc;
  justify-content: flex-end;
}

/* Modal transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-container {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .stats-summary {
    flex-direction: column;
  }
}
</style>