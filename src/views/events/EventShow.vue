<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/events/EventShow.vue -->

<template>
  <div class="event-show-container">
    <ConfirmDialogue ref="confirmDialogue" />
    
    <!-- ✅ HEADER CARD -->
    <div class="card mt-5">
      <div class="card-header">
        <h2 class="card-title">
          <i class="fas fa-calendar-alt"></i>
          Event Details
        </h2>
        <p v-if="event?.description" class="subtitle">
          {{ event.description }}
        </p>
      </div>
      
      <div class="card-body">
        <div class="navigation-flex">
          <router-link 
            :to="{ name: 'EventList' }"
            class="btn btn-outlined"
          >
            <i class="fas fa-arrow-left"></i>
            Back to Event List
          </router-link>

          <router-link
            v-if="event?.assigned"
            :to="{
              name: 'EventStatisticDetail',
              params: { statistic: 'assigned-' + event.assigned }
            }"
            class="btn btn-outlined"
          >
            <i class="fas fa-user"></i>
            View All {{ event.assigned }}'s Events
          </router-link>
        </div>
      </div>
    </div>

    <!-- ✅ EVENT CARD -->
    <div class="card mt-4">
      <div class="card-body">
        <div class="hint-text">
          <i class="fas fa-info-circle"></i>
          Double click the card to edit
        </div>
        
        <div class="event-card-wrapper" @dblclick="editEvent(event)">
          <EventCard
            v-if="event"
            :event="event"
            @edit="editEvent"
            @view="() => {}"
            @delete="deleteEvent"
          />
        </div>
      </div>
    </div>

    <!-- ✅ HISTORY TOGGLE -->
    <div v-if="historyCount > 0" class="card mt-4">
      <div class="card-body text-center">
        <button 
          @click="toggleHistory"
          class="btn btn-large"
          :class="showHistory ? 'btn-success' : 'btn-primary'"
        >
          <i class="fas" :class="showHistory ? 'fa-eye-slash' : 'fa-eye'"></i>
          {{ showHistory ? 'Hide' : 'Show' }} History
          <span class="chip chip-small chip-white ml-2">{{ historyCount }}</span>
        </button>
      </div>
    </div>

    <!-- ✅ HISTORY SECTION -->
    <div v-if="showHistory && historyCount > 0" class="card mt-4">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-history"></i>
          Event History
        </h3>
        <p class="subtitle">{{ historyCount }} entries</p>
      </div>
      
      <div class="card-body">
        <div v-if="filteredHistory.length === 0" class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>No history entries found for this event.</p>
        </div>
        
        <div v-else class="history-list">
          <div 
            v-for="history in filteredHistory" 
            :key="history.id"
            class="history-item"
          >
            <div class="history-header">
              <i class="fas fa-clock"></i>
              <span class="history-date">{{ formatStandardDateTime(history.created_at) }}</span>
            </div>
            <div class="history-content">
              <i class="fas fa-sticky-note"></i>
              <div class="history-notes" v-html="history.notes"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import EventCard from '@/components/events/EventCard.vue';

const store = useStore();
const router = useRouter();

// ✅ PROPS
const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
});

// ✅ REFS
const confirmDialogue = ref(null);
const showHistory = ref(false);

// ✅ COMPUTED
const event = computed(() => store.state.event);

const filteredHistory = computed(() => {
  if (!event.value?.histories) return [];
  
  return event.value.histories
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

const historyCount = computed(() => {
  return event.value?.histories?.length || 0;
});

// ✅ METHODS
const toggleHistory = () => {
  showHistory.value = !showHistory.value;
};

const deleteEvent = async (eventToDelete) => {
  const ok = await confirmDialogue.value.show({
    title: "Delete Event",
    message: `Are you sure you want to delete "${eventToDelete.description}"? This cannot be undone.`,
    okButton: "Delete Forever",
    cancelButton: "Cancel"
  });
  
  if (!ok) {
    console.log('❌ Delete cancelled by user');
    return;
  }

  try {
    const success = await store.dispatch("deleteEvent", eventToDelete);
    
    if (success) {
      await confirmDialogue.value.show({
        title: "Event Deleted",
        message: `"${eventToDelete.description}" has been deleted successfully.`,
        okButton: "OK",
        cancelButton: null
      });
      
      router.push({ name: "EventList" });
    } else {
      throw new Error('Delete failed');
    }
  } catch (error) {
    console.error('❌ Delete error:', error);
    
    await confirmDialogue.value.show({
      title: "Delete Failed",
      message: `Failed to delete "${eventToDelete.description}". Please try again.`,
      okButton: "OK",
      cancelButton: null
    });
  }
};

const editEvent = (eventToEdit) => {
  router.push({ name: 'EventEdit', params: { id: eventToEdit.id } });
};

const formatStandardDateTime = (value) => {
  return DateFormatService.formatStandardDateTimejs(value);
};

// ✅ LIFECYCLE
onMounted(async () => {
  console.log('✅ EventShow mounted, fetching event:', props.id);
  await store.dispatch("fetchEvent", props.id);
});
</script>

<style scoped>
/* ✅ IMPORT SHARED STYLES */
@import '@/assets/styles/ui-components.css';
@import '@/assets/styles/event-components.css';

/* ========================================
   EVENT SHOW SPECIFIC STYLES (minimal!)
   ======================================== */

.event-show-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
}

/* Navigation */
.navigation-flex {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.navigation-flex .btn {
  flex: 1;
  min-width: 200px;
}

/* Event Card Wrapper */
.event-card-wrapper {
  margin-top: 1rem;
  cursor: pointer;
}

.event-card-wrapper:hover {
  opacity: 0.95;
}

/* History List */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
  border-radius: 8px;
  padding: 1.25rem;
  border-left: 4px solid #41b883;
  transition: all 0.2s ease;
}

.history-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.history-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #666;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.history-header i {
  color: #41b883;
}

.history-date {
  color: #667eea;
}

.history-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.history-content i {
  color: #41b883;
  margin-top: 0.2rem;
  flex-shrink: 0;
}

.history-notes {
  color: #333;
  line-height: 1.6;
  flex: 1;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
}

.empty-state i {
  font-size: 3rem;
  color: #ddd;
  margin-bottom: 1rem;
}

.empty-state p {
  margin: 0;
  font-size: 1.1rem;
}

/* Hint Text */
.hint-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.hint-text i {
  color: #667eea;
}

/* Subtitle */
.subtitle {
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 1rem;
  font-weight: 500;
}

/* Utility Classes */
.mt-4 { margin-top: 1rem; }
.mt-5 { margin-top: 1.5rem; }
.ml-2 { margin-left: 0.5rem; }

.text-center {
  text-align: center;
}

/* Chip White Variant */
.chip-white {
  background: white;
  color: #667eea;
  font-weight: 700;
}

/* Responsive */
@media (max-width: 768px) {
  .event-show-container {
    padding: 0.5rem;
  }
  
  .navigation-flex {
    flex-direction: column;
  }
  
  .navigation-flex .btn {
    width: 100%;
    min-width: auto;
  }
}
</style>