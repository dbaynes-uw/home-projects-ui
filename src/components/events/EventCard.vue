<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/components/events/EventCard.vue -->

<template>
  <div
    @dblclick="$emit('view', event)"
    :class="['event-card', getEventCardClass()]"
  >
    <!-- ✅ CARD HEADER -->
    <div class="event-card-header">
      <i :class="[getEventStatusIcon(), 'event-status-icon']"></i>
      <h4 class="event-title">{{ event.description }}</h4>
    </div>
    
    <!-- ✅ CARD BODY -->
    <div class="event-card-body">
      <div class="event-detail-row">
        <i class="fas fa-user"></i>
        <span>{{ event.assigned }}</span>
      </div>

      <div class="event-detail-row">
        <i class="fas fa-sync-alt"></i>
        <span>Every {{ event.frequency }} days</span>
      </div>

      <div class="event-detail-row">
        <i class="fas fa-calendar-alt"></i>
        <span>Last: {{ formatDate(event.action_completed_date) }}</span>
      </div>

      <div class="event-detail-row">
        <i class="fas fa-calendar-check"></i>
        <span>Due: {{ formatDate(event.action_due_date) }}</span>
        <span 
          v-if="isEventPastDue"
          class="chip chip-danger chip-tiny ml-2"
        >
          <i class="fas fa-exclamation-triangle"></i>
          PAST DUE
        </span>
      </div>

      <div class="event-detail-row">
        <i class="fas fa-map-marker-alt"></i>
        <span>{{ event.location || 'No location' }}</span>
      </div>

      <div class="event-detail-row">
        <i class="fas fa-info-circle"></i>
        <span>{{ capitalizedStatus }}</span>
      </div>

      <div class="event-detail-row">
        <i class="fas fa-bell"></i>
        <span>{{ notifyLabel }}</span>
      </div>

      <div class="event-detail-row event-detail-notes" v-if="event.notes">
        <i class="fas fa-sticky-note"></i>
        <span v-html="renderMarkdown(event.notes)"></span>
      </div>      
    </div>
    
    <!-- ✅ CARD FOOTER WITH BETTER CLICK TARGETS -->
    <div class="event-card-footer">
      <div class="action-buttons">
        <button
          @click.stop="$emit('edit', event)"
          class="action-btn action-btn-edit"
          type="button"
        >
          <i class="fas fa-edit"></i>
          <span>Edit</span>
        </button>

        <button
          @click.stop="$emit('delete', event)"
          class="action-btn action-btn-delete"
          type="button"
        >
          <i class="fas fa-trash"></i>
          <span>Delete</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { marked } from 'marked';
import dayjs from 'dayjs';
import DateFormatService from '@/services/DateFormatService.js';

// Render links as labeled pills; bare URLs show hostname, markdown links show their text
marked.use({
  renderer: {
    link({ href, title, text }) {
      let displayText = text;
      if (!displayText || displayText === href) {
        try {
          displayText = title || new URL(href).hostname.replace(/^www\./, '');
        } catch {
          displayText = title || 'Link';
        }
      }
      return `<a href="${href}" title="${href}" target="_blank" rel="noopener noreferrer">${displayText}</a>`;
    }
  }
});

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
});

defineEmits(['edit', 'delete']);

// ✅ COMPUTED
const capitalizedStatus = computed(() => {
  if (!props.event?.status) return 'Unknown';
  return props.event.status.charAt(0).toUpperCase() + props.event.status.slice(1);
});

const isEventPastDue = computed(() => {
  const today = dayjs().format("YYYY-MM-DD");
  return props.event.status === 'active' && props.event.action_due_date < today;
});

const notifyLabel = computed(() => {
  return Number(props.event?.notify) === 1
    ? 'Notify when overdue'
    : 'Do not notify when overdue';
});

// ✅ METHODS
const getEventCardClass = () => {
  if (props.event.status === 'inactive') return 'event-inactive';
  if (isEventPastDue.value) return 'event-pastdue';
  return 'event-active';
};

const getEventStatusIcon = () => {
  if (props.event.status === 'inactive') return 'fas fa-pause-circle';
  if (isEventPastDue.value) return 'fas fa-exclamation-circle';
  return 'fas fa-check-circle';
};

const formatDate = (value) => {
  return DateFormatService.formatStandardDatejs(value);
};

const renderMarkdown = (text) => {
  if (!text) return '';
  // Convert "Label: https://..." lines into markdown links so the label becomes the pill text
  const preprocessed = text.replace(/^(.+?):\s*(https?:\/\/\S+)$/gm, '[$1]($2)');
  return marked.parse(preprocessed);
};
</script>

<style scoped>
/* ✅ IMPORT ALL SHARED STYLES */
@import '@/assets/styles/ui-components.css';
@import '@/assets/styles/event-components.css';

/* ========================================
   NO COMPONENT-SPECIFIC STYLES NEEDED!
   Everything is now shared! 🎉
   ======================================== */
</style>