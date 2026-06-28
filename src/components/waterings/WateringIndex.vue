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
        :class="{
          'is-edge-left': tooltip.align === 'left',
          'is-edge-right': tooltip.align === 'right'
        }"
        :style="tooltipStyle"
      >
        <span class="timeline-tooltip-name">{{ tooltip.name }}</span>
        <span v-if="tooltip.gardenNames" class="timeline-tooltip-garden">{{ tooltip.gardenNames }}</span>
        <span v-if="tooltip.target" class="timeline-tooltip-target">Target: {{ tooltip.target }}</span>
        <span v-if="tooltip.days" class="timeline-tooltip-days">Days: {{ tooltip.days }}</span>
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
        @click="goToWateringDetails(item.id)"
        :title="`${item.name} • ${item.gardenNames} • Target: ${item.target} • Days: ${item.days} (${item.timeRange})`"
      >
        <span class="timeline-legend-swatch" :style="{ background: item.color }"></span>
        <span class="timeline-legend-name">{{ item.name }}</span>
        <span class="timeline-legend-garden">{{ item.gardenNames }}</span>
        <span v-if="item.target" class="timeline-legend-target">{{ item.target }}</span>
        <span v-if="item.days" class="timeline-legend-days">{{ item.days }}</span>
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

  <div class="table-responsive">
    <table class="data-table">
      <thead>
        <tr>
          <th id="background-blue" @click="sortList('name')">Name</th>
          <th id="background-blue" @click="sortList('garden_names')">Garden</th>
          <th id="background-blue" @click="sortList('target')">Target</th>
          <th id="background-blue" @click="sortList('start_time')">Start</th>
          <th id="background-blue" @click="sortList('end_time')">End</th>
          <th id="background-blue" @click="sortList('duration')">Duration</th>
          <th id="background-blue" @click="sortList('days')">Days</th>
          <th id="background-blue" class="actions-column">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="watering in sortedWaterings" :key="watering.id">
          <td>{{ watering.name }}</td>
          <td>{{ getWateringGardenNames(watering) }}</td>
          <td>{{ watering.target }}</td>
          <td>{{ formatTime(watering.start_time) }}</td>
          <td>{{ formatTime(watering.end_time) }}</td>
          <td>{{ watering.duration }}</td>
          <td>{{ watering.days }}</td>
          <td class="watering-actions-cell">
          <!--span v-if="this.onlineStatus"-->
            <span class="action-icons">
              <router-link
                :to="{ name: 'WateringEdit', params: { id: `${watering.id}` } }"
                class="action-link"
                title="Edit Watering"
                aria-label="Edit Watering"
              >
                <i class="fa-solid fa-pen-to-square"></i>
              </router-link>
              <router-link
                :to="{ name: 'WateringDetails', params: { id: `${watering.id}` }  }"
                class="action-link"
                title="View Watering"
                aria-label="View Watering"
              >
                <i class="fa fa-eye"></i>
              </router-link>
              <button
                type="button"
                @click="deleteWatering(watering)"
                class="action-button"
                title="Delete Watering"
                aria-label="Delete Watering"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <br />
  <b>Online Status: {{ onlineStatus }}</b>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
const router = useRouter();
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
const tooltip = ref({ visible: false, name: '', gardenNames: '', timeRange: '', x: 0, align: 'center' });
const TIMELINE_START_MIN = 5 * 60;   // 5:00 AM
const TIMELINE_END_MIN = 12 * 60;    // 12:00 PM (noon)
const TIMELINE_RANGE_MIN = TIMELINE_END_MIN - TIMELINE_START_MIN;
const TOOLTIP_EDGE_GUTTER = 8;
const TOOLTIP_EDGE_THRESHOLD = 110;
//?const inputSearchText = ref("");

const sortedWaterings = computed(() => {
  const arr = [...props.waterings];

  arr.sort((a, b) => {
    let valueA, valueB;

    if (sortKey.value === 'start_time' || sortKey.value === 'end_time') {
      const aVal = a[sortKey.value];
      const bVal = b[sortKey.value];
      if (!aVal && !bVal) return 0;
      if (!aVal) return 1;
      if (!bVal) return -1;
      const dateA = new Date(aVal);
      const dateB = new Date(bVal);
      return sortAsc.value ? dateA - dateB : dateB - dateA;
    }

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
  });

  return arr;
});

const allTimelineSegments = computed(() => {
  const segments = [];

  sortedWaterings.value.forEach((watering, index) => {
    console.log("Garden Names for Watering:", getWateringGardenNames(watering));
    const startMins = timeToMinutes(watering.start_time);
    const endMins = timeToMinutes(watering.end_time);
    if (startMins === null || endMins === null) return;

    const name = watering.name || 'Watering';
    const gardenNames = getWateringGardenNames(watering);
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
        gardenNames,
        target: watering.target,
        days: watering.days,
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
      gardenNames: segment.gardenNames,
      target: segment.target,
      days: segment.days,
      color: segment.color,
      timeRange: `${segment.startLabel} - ${segment.endLabel}`
    }));
});

const tooltipStyle = computed(() => {
  let transform = 'translateX(-50%)';

  if (tooltip.value.align === 'left') {
    transform = 'translateX(0)';
  } else if (tooltip.value.align === 'right') {
    transform = 'translateX(-100%)';
  }

  return {
    left: `${tooltip.value.x}px`,
    transform
  };
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

function goToWateringDetails(wateringId) {
  activeLegendId.value = wateringId;
  router.push({ name: 'WateringDetails', params: { id: `${wateringId}` } });
}

function handleSegmentEnter(segment, event) {
  hoveredSegmentKey.value = segment.key;
  const track = event.currentTarget.closest('.timeline-summary-track');
  const trackRect = track ? track.getBoundingClientRect() : null;
  const segRect = event.currentTarget.getBoundingClientRect();
  const xInTrack = trackRect ? segRect.left - trackRect.left + (segRect.width / 2) : 0;

  let align = 'center';
  let tooltipX = xInTrack;

  if (trackRect) {
    if (xInTrack <= TOOLTIP_EDGE_THRESHOLD) {
      align = 'left';
      tooltipX = TOOLTIP_EDGE_GUTTER;
    } else if (xInTrack >= trackRect.width - TOOLTIP_EDGE_THRESHOLD) {
      align = 'right';
      tooltipX = trackRect.width - TOOLTIP_EDGE_GUTTER;
    }
  }

  tooltip.value = {
    visible: true,
    name: segment.name,
    gardenNames: segment.gardenNames,
    target: segment.target,
    days: segment.days,
    timeRange: `${segment.startLabel} – ${segment.endLabel}`,
    x: tooltipX,
    align
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
.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.data-table {
  width: 100%;
  min-width: 960px;
  table-layout: auto;
}

.data-table td {
  vertical-align: middle;
}

i {
  color: gray;
}

.actions-column {
  position: sticky;
  right: 0;
  z-index: 3;
  min-width: 8.5rem;
  width: 8.5rem;
  background: #375a7f;
}

.action-icons {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.action-link,
.action-button {
  width: 1.9rem;
  height: 1.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 6px;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.watering-actions-cell {
  position: sticky;
  right: 0;
  z-index: 2;
  min-width: 8.5rem;
  width: 8.5rem;
  background: inherit;
  box-shadow: inset 1px 0 0 rgba(15, 23, 42, 0.08);
  padding-top: 0.45rem;
  padding-bottom: 0.45rem;
  white-space: nowrap;
}

.watering-actions-cell .action-icons {
  display: flex;
  align-items: center;
  min-height: 1.9rem;
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

.timeline-tooltip.is-edge-left::after {
  left: 14px;
  transform: none;
}

.timeline-tooltip.is-edge-right::after {
  left: calc(100% - 14px);
  transform: none;
}

.timeline-tooltip-name {
  font-weight: 700;
}

.timeline-tooltip-garden {
  opacity: 0.9;
}

.timeline-tooltip-target {
  opacity: 0.85;
  font-weight: 600;
}

.timeline-tooltip-days {
  opacity: 0.85;
  font-weight: 600;
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
  flex-direction: column;
  gap: 0.35rem;
  align-items: stretch;
}

.timeline-legend-item {
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #334155;
  border-radius: 6px;
  padding: 0.35rem 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.68rem;
  cursor: pointer;
  width: 100%;
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
  min-width: 80px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.timeline-legend-garden {
  color: #475569;
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.timeline-legend-target {
  color: #1e293b;
  font-weight: 600;
  min-width: 60px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.timeline-legend-days {
  color: #1e293b;
  font-weight: 600;
  min-width: 60px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.timeline-legend-time {
  color: #64748b;
  min-width: 85px;
  text-align: right;
}

.timeline-legend-clear {
  border: 1px solid #94a3b8;
  background: #f8fafc;
  color: #334155;
  border-radius: 6px;
  padding: 0.35rem 0.5rem;
  font-size: 0.66rem;
  cursor: pointer;
  width: 100%;
  text-align: center;
}

@media (max-width: 768px) {
  .data-table {
    min-width: 860px;
    font-size: 0.82rem;
  }

  .action-icons {
    gap: 0.2rem;
  }

  .action-link,
  .action-button {
    width: 1.8rem;
    height: 1.8rem;
  }
}
</style>

