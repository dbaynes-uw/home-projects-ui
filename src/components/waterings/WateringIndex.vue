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
        :style="timelineSegmentStyle(segment)"
        :title="segment.label"
      ></div>
      <div class="timeline-now-marker" :style="nowMarkerStyle" title="Current time"></div>
    </div>
    <div class="timeline-axis">
      <span v-for="tick in timelineTicks" :key="tick">{{ tick }}</span>
    </div>
  </div>

  <v-table density="compact">
    <tr>
      <th id="background-blue" @click="sortList('name')">Name</th>
      <th id="background-blue" @click="sortList('target')">Target</th>
      <th id="background-blue" @click="sortList('start_time')">Start</th>
      <th id="background-blue" @click="sortList('end_time')">End</th>
      <th id="background-blue" @click="sortList('duration')">Duration</th>
      <th id="background-blue" @click="sortList('days')">Days</th>
      <th id="background-blue">Actions</th>
    </tr>
    <tr v-for="watering in sortedWaterings" :key="watering.id">
      <td>{{ watering.name }}</td>
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
      valueA = (a[sortKey.value] || '').toString().toLowerCase();
      valueB = (b[sortKey.value] || '').toString().toLowerCase();
      
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

    const label = `${watering.name || 'Watering'}: ${formatTime(watering.start_time)} - ${formatTime(watering.end_time)}`;
    const hue = (index * 47) % 360;

    if (endMins > startMins) {
      segments.push({
        key: `${watering.id}-a`,
        start: startMins,
        end: endMins,
        hue,
        label
      });
      return;
    }

    if (endMins < startMins) {
      segments.push({
        key: `${watering.id}-a`,
        start: startMins,
        end: 24 * 60,
        hue,
        label
      });
      segments.push({
        key: `${watering.id}-b`,
        start: 0,
        end: endMins,
        hue,
        label
      });
      return;
    }

    segments.push({
      key: `${watering.id}-a`,
      start: startMins,
      end: Math.min(startMins + 15, 24 * 60),
      hue,
      label
    });
  });

  return segments;
});

const nowMarkerStyle = computed(() => {
  const now = new Date();
  const mins = (now.getHours() * 60) + now.getMinutes();
  const left = (mins / (24 * 60)) * 100;
  return { left: `${left}%` };
});

const timelineTicks = computed(() => {
  return Array.from({ length: 9 }, (_, i) => `${String(i * 3).padStart(2, '0')}:00`);
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
  const dayMinutes = 24 * 60;
  const left = (segment.start / dayMinutes) * 100;
  const width = ((segment.end - segment.start) / dayMinutes) * 100;

  return {
    left: `${left}%`,
    width: `${Math.max(width, 0.6)}%`,
    background: `hsla(${segment.hue}, 70%, 45%, 0.55)`
  };
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
  height: 18px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #cdd5df;
  background-color: #eef3f8;
  background-image: linear-gradient(to right, #dbe3ec 1px, transparent 1px);
  background-size: 12.5% 100%;
}

.timeline-summary-segment {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 8px;
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

.timeline-axis {
  display: flex;
  justify-content: space-between;
  margin-top: 0.28rem;
  font-size: 0.7rem;
  color: #64748b;
}
</style>

