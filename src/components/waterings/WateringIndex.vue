<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h3 id="h3-left">Total: {{ sortedWaterings.length }} Watering{{ sortedWaterings.length === 1 ? '' : 's' }}</h3>

  <div class="timeline-summary-wrap">
    <div class="timeline-summary-title">All Waterings Timeline</div>
    <div class="timeline-summary-track">
      <div
        v-for="segment in allTimelineSegments"
        :key="segment.key"
        class="timeline-summary-segment"
        :class="{ 'is-thin': segment.isThin, 'is-hovered': hoveredSegmentKey === segment.key }"
        :style="timelineSegmentStyle(segment)"
        @mouseenter="handleSegmentEnter(segment, $event)"
        @mouseleave="handleSegmentLeave"
      >
        <span class="timeline-segment-label">{{ segment.displayName }}</span>
      </div>
      <div
        v-if="tooltip.visible"
        class="timeline-tooltip"
        :style="{ left: tooltip.x + 'px' }"
      >
        <span class="timeline-tooltip-name">{{ tooltip.name }}</span>
        <span class="timeline-tooltip-time">{{ tooltip.timeRange }}</span>
      </div>
      <div class="timeline-now-marker" :style="nowMarkerStyle" title="Current time"></div>
    </div>
    <div class="timeline-axis">
      <span v-for="tick in timelineTicks" :key="tick">{{ tick }}</span>
    </div>
    <div v-if="timelineLegendItems.length" class="timeline-legend">
      <button
        v-for="item in timelineLegendItems"
        :key="`legend-${item.id}`"
        type="button"
        class="timeline-legend-item"
        :class="{ active: activeLegendId === item.id }"
        @click="toggleLegend(item.id)"
        :title="`${item.name} (${item.timeRange})`"
      >
        <span class="timeline-legend-swatch" :style="{ background: item.color }"></span>
        <span class="timeline-legend-name">{{ item.name }}</span>
        <span class="timeline-legend-time">{{ item.timeRange }}</span>
      </button>
      <button
        v-if="activeLegendId !== null"
        type="button"
        class="timeline-legend-clear"
        @click="activeLegendId = null"
      >
        Clear
      </button>
    </div>
  </div>

  <v-table density="compact">
    <tr>
      <th id="background-blue" @click="sortList('name')">Name</th>
      <th id="background-blue" @click="sortList('garden_names')">Garden</th>
      <th id="background-blue" @click="sortList('target')">Target</th>
      <th id="background-blue" @click="sortList('start_time')">Start</th>
      <th id="background-blue" @click="sortList('end_time')">End</th>
      <th id="background-blue" @click="sortList('duration')">Duration</th>
      <th id="background-blue" @click="sortList('days')">Days</th>
      <th id="background-blue">Actions</th>
    </tr>
    <tr v-for="watering in sortedWaterings" :key="watering.id">
      <td>{{ watering.name }}</td>
      <td>{{ getWateringGardenNames(watering) }}</td>
      <td>{{ watering.target }}</td>
      <td>{{ formatTime(watering.start_time) }}</td>
      <td>{{ formatTime(watering.end_time) }}</td>
      <td>{{ watering.duration }}</td>
      <td>{{ watering.days }}</td>
      <td style="padding-left: 0">
        <!--span v-if="this.onlineStatus"-->
          <span class="fa-stack">
            <router-link
              :to="{ name: 'WateringEdit', params: { id: `${watering.id}` } }"
            >
              <i
                id="travel-icon-edit"
                class="fa-solid fa-pen-to-square fa-stack-1x"
              >
              </i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link :to="{ name: 'Waterings' }">
                <i class="fa fa-eye" id="action-eye-icon"></i>
              </router-link>
            </span>
            <span class="fa-table-stack" id="action-delete-icon">
              <i
                @click="deleteWatering(watering)"
                class="fas fa-trash-alt fa-stack-1x"
                id="travel-icon-delete"
              >
              </i>
            </span>
          </span>
      </td>
    </tr>
  </v-table>
  <br />
  <b>Online Status: {{ onlineStatus }}</b>
</template>
<script setup>
import { ref, computed } from 'vue';
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
const props = defineProps({
  waterings: { type: Array, required: true }
});
// Emits
const emit = defineEmits(['edit','delete']);
// State
const onlineStatus = ref(navigator.onLine);

const sortKey = ref('start_time');
const sortAsc = ref(true);
const activeLegendId = ref(null);
const hoveredSegmentKey = ref(null);
const tooltip = ref({ visible: false, name: '', timeRange: '', x: 0 });
const TIMELINE_START_MIN = 5 * 60;   // 5:00 AM
const TIMELINE_END_MIN = 12 * 60;    // 12:00 PM (noon)
const TIMELINE_RANGE_MIN = TIMELINE_END_MIN - TIMELINE_START_MIN;
//?const inputSearchText = ref("");

const sortedWaterings = computed(() => {
  const arr = [...props.waterings];
  
  arr.sort((a, b) => {
    let valueA, valueB;
    
    // ✅ FIXED - Handle date fields specially
    if (sortKey.value === 'start_time' || sortKey.value === 'end_time') {
      const aVal = a[sortKey.value];
      const bVal = b[sortKey.value];
      // Nulls sort last regardless of direction
      if (!aVal && !bVal) return 0;
      if (!aVal) return 1;
      if (!bVal) return -1;
      const dateA = new Date(aVal);
      const dateB = new Date(bVal);
      return sortAsc.value ? dateA - dateB : dateB - dateA;
    } else {
      // ✅ Handle text fields (name, target, location, etc.)
      if (sortKey.value === 'garden_names') {
        valueA = getWateringGardenNames(a).toLowerCase();
        valueB = getWateringGardenNames(b).toLowerCase();
      } else {
        valueA = (a[sortKey.value] || '').toString().toLowerCase();
        valueB = (b[sortKey.value] || '').toString().toLowerCase();
      }
      
      if (valueA < valueB) return sortAsc.value ? -1 : 1;
      if (valueA > valueB) return sortAsc.value ? 1 : -1;
      return 0;
    }
  });
  return arr;
});

const allTimelineSegments = computed(() => {
  const segments = [];

  sortedWaterings.value.forEach((watering, index) => {
    const startMins = timeToMinutes(watering.start_time);
    const endMins = timeToMinutes(watering.end_time);
    if (startMins === null || endMins === null) return;

    const name = watering.name || 'Watering';
    const label = `${name}: ${formatTime(watering.start_time)} - ${formatTime(watering.end_time)}`;
    const hue = (index * 47) % 360;

    const daySegments = [];
    if (endMins > startMins) {
      daySegments.push({ start: startMins, end: endMins });
    } else if (endMins < startMins) {
      daySegments.push({ start: startMins, end: 24 * 60 });
      daySegments.push({ start: 0, end: endMins });
    } else {
      daySegments.push({ start: startMins, end: Math.min(startMins + 15, 24 * 60) });
    }

    daySegments.forEach((part, idx) => {
      const clippedStart = Math.max(part.start, TIMELINE_START_MIN);
      const clippedEnd = Math.min(part.end, TIMELINE_END_MIN);
      if (clippedEnd <= clippedStart) return;
      const visibleDuration = clippedEnd - clippedStart;

      segments.push({
        key: `${watering.id}-${idx}`,
        wateringId: watering.id,
        name,
        start: clippedStart,
        end: clippedEnd,
        hue,
        color: `hsla(${hue}, 70%, 45%, 0.65)`,
        label,
        startLabel: formatTime(watering.start_time),
        endLabel: formatTime(watering.end_time),
        isThin: visibleDuration < 55,
        displayName: compactTimelineName(name, visibleDuration)
      });
    });
  });

  return segments;
});

const nowMarkerStyle = computed(() => {
  const now = new Date();
  const mins = (now.getHours() * 60) + now.getMinutes();
  if (mins < TIMELINE_START_MIN || mins > TIMELINE_END_MIN) {
    return { display: 'none' };
  }
  const left = ((mins - TIMELINE_START_MIN) / TIMELINE_RANGE_MIN) * 100;
  return { left: `${left}%` };
});

const timelineTicks = computed(() => {
  // 5am to noon inclusive = 8 ticks at 1-hour intervals
  return Array.from({ length: 8 }, (_, i) => `${String(5 + i).padStart(2, '0')}:00`);
});

const timelineLegendItems = computed(() => {
  const seen = new Set();
  return allTimelineSegments.value
    .filter(segment => {
      if (seen.has(segment.wateringId)) return false;
      seen.add(segment.wateringId);
      return true;
    })
    .map(segment => ({
      id: segment.wateringId,
      name: segment.name,
      color: segment.color,
      timeRange: `${segment.startLabel} - ${segment.endLabel}`
    }));
});

function sortList(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
}
function deleteWatering(watering) {
  emit('delete', watering);
}

function toggleLegend(wateringId) {
  activeLegendId.value = activeLegendId.value === wateringId ? null : wateringId;
}

function handleSegmentEnter(segment, event) {
  hoveredSegmentKey.value = segment.key;
  const track = event.currentTarget.closest('.timeline-summary-track');
  const trackRect = track ? track.getBoundingClientRect() : null;
  const segRect = event.currentTarget.getBoundingClientRect();
  const xInTrack = trackRect ? segRect.left - trackRect.left + (segRect.width / 2) : 0;
  tooltip.value = {
    visible: true,
    name: segment.name,
    timeRange: `${segment.startLabel} – ${segment.endLabel}`,
    x: xInTrack
  };
}

function handleSegmentLeave() {
  hoveredSegmentKey.value = null;
  tooltip.value.visible = false;
}

function getWateringGardenNames(watering) {
  if (Array.isArray(watering?.gardens) && watering.gardens.length > 0) {
    const names = watering.gardens
      .map(g => g?.name)
      .filter(Boolean);
    if (names.length > 0) return names.join(', ');
  }

  if (watering?.garden?.name) {
    return watering.garden.name;
  }

  return 'Standalone';
}

function formatTime(value) {
  if (!value) {
    return '';
  }
  return DateFormatService.formatTimejs(value);
}

function timeToMinutes(value) {
  if (!value) return null;

  if (typeof value === 'string' && /^\d{1,2}:\d{2}/.test(value)) {
    const [h, m] = value.split(':').map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return (h * 60) + m;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return (parsed.getHours() * 60) + parsed.getMinutes();
}

function timelineSegmentStyle(segment) {
  const left = ((segment.start - TIMELINE_START_MIN) / TIMELINE_RANGE_MIN) * 100;
  const width = ((segment.end - segment.start) / TIMELINE_RANGE_MIN) * 100;

  return {
    left: `${left}%`,
    width: `${Math.max(width, 1.2)}%`,
    background: segment.color,
    opacity: activeLegendId.value === null || activeLegendId.value === segment.wateringId ? 1 : 0.18
  };
}

function nameInitials(name) {
  return (name || '')
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part[0].toUpperCase())
    .join('')
    .slice(0, 4) || 'W';
}

function compactTimelineName(name, visibleDuration) {
  const safeName = (name || 'Watering').trim();

  if (visibleDuration <= 45) {
    return nameInitials(safeName);
  }

  if (visibleDuration <= 75) {
    const firstWord = safeName.split(/\s+/)[0] || safeName;
    return firstWord.length > 8 ? `${firstWord.slice(0, 8)}…` : firstWord;
  }

  if (safeName.length > 16) {
    return `${safeName.slice(0, 16)}…`;
  }

  return safeName;
}
</script>
<style scoped>
#action-eye-icon {
  top: 0.4rem;
  font-size: 18px;
}
#action-delete-icon {
  position: relative;
  top: 0.5rem;
  left: 2.3rem;
}
.fa-table-stack {
  position: relative;
  left: 2rem;
}
i {
  bottom: 0px;
  color: gray;
}
tr.is-complete {
  background: #35495e;
  color: #fff;
}
#status-message {
  text-align: center;
  color: navy;
}

.timeline-summary-wrap {
  margin: 0.4rem 0 0.9rem;
  padding: 0.55rem 0.75rem 0.65rem;
  border: 1px solid #d9dee5;
  border-radius: 8px;
  background: #f8fafc;
}

.timeline-summary-title {
  font-weight: 600;
  font-size: 0.85rem;
  color: #334155;
  margin-bottom: 0.45rem;
}

.timeline-summary-track {
  position: relative;
  height: 22px;
  border-radius: 10px;
  overflow: visible;
  border: 1px solid #cdd5df;
  background-color: #eef3f8;
  /* 7 interior 1-hour gridlines over a 7-hour span (5am–noon) */
  background-image: linear-gradient(to right, #dbe3ec 1px, transparent 1px);
  background-size: calc(100% / 7) 100%;
}

.timeline-summary-segment {
  position: absolute;
  top: 2px;
  bottom: 2px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 6px;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  transition: filter 0.15s;
}

.timeline-summary-segment.is-hovered {
  filter: brightness(1.15);
}

.timeline-summary-segment.is-thin {
  padding: 0 2px;
}

.timeline-segment-label {
  color: #0b1f11;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-overflow: ellipsis;
  overflow: hidden;
}

.timeline-now-marker {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #111827;
  opacity: 0.85;
  transform: translateX(-1px);
}

.timeline-tooltip {
  position: absolute;
  top: -46px;
  transform: translateX(-50%);
  background: #0f172a;
  color: #fff;
  border-radius: 6px;
  padding: 0.28rem 0.55rem;
  font-size: 0.7rem;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
}

.timeline-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #0f172a;
}

.timeline-tooltip-name {
  font-weight: 700;
}

.timeline-tooltip-time {
  opacity: 0.8;
}

.timeline-axis {
  display: flex;
  justify-content: space-between;
  margin-top: 0.28rem;
  font-size: 0.7rem;
  color: #64748b;
}

.timeline-legend {
  margin-top: 0.45rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  align-items: center;
}

.timeline-legend-item {
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #334155;
  border-radius: 999px;
  padding: 0.2rem 0.45rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.68rem;
  cursor: pointer;
}

.timeline-legend-item.active {
  border-color: #0f172a;
  box-shadow: 0 0 0 1px #0f172a inset;
}

.timeline-legend-swatch {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.15);
  flex: 0 0 10px;
}

.timeline-legend-name {
  font-weight: 700;
  max-width: 90px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.timeline-legend-time {
  color: #64748b;
}

.timeline-legend-clear {
  border: 1px solid #94a3b8;
  background: #f8fafc;
  color: #334155;
  border-radius: 999px;
  padding: 0.15rem 0.5rem;
  font-size: 0.66rem;
  cursor: pointer;
}
</style>

