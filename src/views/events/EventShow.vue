<template>
  <ConfirmDialogue ref="confirmDialogue" />
  <div>
    <router-link :to="{name: 'EventList'}">
      <h2>Event Details</h2>
    </router-link>
    <router-link
      :to="{name: 'EventStatisticDetail',
            params: { statistic: 'assigned-' + event.assigned }}"
      >
      <h2>Events Assigned to {{ event.assigned }}</h2>
    </router-link>
    
    <div>
      <span><b>Double click to Edit</b></span>
    </div>
    
    <!-- ✅ CLEAN SINGLE HISTORY TOGGLE -->
    <div class="history-toggle-section">
      <button 
        @click.stop="toggleHistory"
        class="history-btn"
        :class="{ 'active': showHistory }"
        v-if="event && event.histories && event.histories.length > 0"
      >
        <!-- ✅ MATERIAL DESIGN ICONS -->
        <i class="mdi" :class="showHistory ? 'fas fa-eye-off' : 'fas fa-eye'"></i>
        <span>{{ showHistory ? 'Hide' : 'Show' }} History ({{ historyCount }})</span>
      </button>
    </div>
    
    <div class="card-display">
      <EventCard
        class="card"
        :event="event"
        @delete="deleteEvent"
        v-bind:class="{ 'is-complete': event?.completed }"
        v-if="event"
      />
    </div>
    
    <!-- ✅ HISTORY SECTION -->
    <div v-if="showHistory" class="card-history">
      <div class="history-content">
        <h3><i class="fas fa-history"></i> Event History</h3>
        <div v-if="filteredHistory.length === 0" class="no-history">
          <i class="fas fa-information-outline"></i>
          <p>No history entries found for this event.</p>
        </div>
        <div v-else class="history-list">
          <div 
            v-for="history in filteredHistory" 
            :key="history.id"
            class="history-item"
          >
            <div class="history-meta">
              <i class="fas fa-clock-outline"></i>
              <span class="history-date">{{ formatStandardDateTime(history.created_at) }}</span>
            </div>
            <div class="history-notes">
              <i class="fas fa-note-text-outline"></i>
              <span v-html="history.notes"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import EventCard from '@/components/events/EventCard.vue';

// ✅ COMPOSITION API SETUP
const store = useStore();
const router = useRouter();

// ✅ PROPS (Composition API style)
const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
});

// ✅ REFS
const confirmDialogue = ref(null); // ✅ UNCOMMENT THIS LINE!
const showHistory = ref(false);

// ✅ REACTIVE DATA
//const history = ref(null);
//const assigned = ref("");
//const updatedEvent = ref(null);
//const eventsAssigned = ref(null);

// ✅ COMPUTED PROPERTIES
const event = computed(() => store.state.event);

const filteredHistory = computed(() => {
  if (!event.value || !event.value.histories) {
    return [];
  }
  return event.value.histories
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

const historyCount = computed(() => {
  return event.value && event.value.histories ? event.value.histories.length : 0;
});

// ✅ METHODS
const toggleHistory = () => {
  showHistory.value = !showHistory.value;
};

const deleteEvent = async (eventToDelete) => {
  // ✅ FIX: Use confirmDialogue.value (lowercase 'c')
  const ok = await confirmDialogue.value.show({
    title: "Delete Event",
    message: `Are you sure you want to delete ${eventToDelete.description}? It cannot be undone.`,
    okButton: "Delete",
  });
  
  if (ok) {
    await store.dispatch("deleteEvent", eventToDelete);
    alert(`Event was Deleted for ${eventToDelete.description}`);
    router.push({ name: "EventList" });
  }
};

const editEvent = (eventToEdit) => {
  router.push({ name: 'EventEdit', params: { id: `${eventToEdit.id}` } });
};

const formatStandardDateTime = (value) => {
  return DateFormatService.formatStandardDateTimejs(value);
};

// ✅ LIFECYCLE HOOKS
onMounted(async () => {
  
  // Fetch the event
  await store.dispatch("fetchEvent", props.id);
  
  // Check MDI loading after next tick
  await nextTick();
  
  setTimeout(() => {
    const mdiElements = document.querySelectorAll('.mdi');
    
    if (mdiElements.length > 0) {
      const testIcon = mdiElements[0];
      const styles = window.getComputedStyle(testIcon, ':before');
    }
  }, 500);
});

// ✅ EXPOSE METHODS TO TEMPLATE (if needed)
defineExpose({
  toggleHistory,
  deleteEvent,
  editEvent
});
</script>

<style scoped>
/* ✅ PROFESSIONAL MDI STYLING */
.history-toggle-section {
  margin: 1rem 0;
  text-align: center;
}

.history-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.history-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.history-btn.active {
  background: linear-gradient(135deg, #41b883 0%, #35a872 100%);
}

.history-btn .mdi {
  font-size: 1.2em;
}

.card-history {
  margin-top: 2rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.history-content {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 1.5rem;
}

.history-content h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.history-content h3 .mdi {
  color: #41b883;
}

.no-history {
  text-align: center;
  color: #666;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.no-history .mdi {
  font-size: 2rem;
  color: #bbb;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border-left: 4px solid #41b883;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.history-item:hover {
  transform: translateX(4px);
}

.history-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.history-meta .mdi {
  color: #41b883;
}

.history-notes {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: #2c3e50;
}

.history-notes .mdi {
  color: #41b883;
  margin-top: 0.2rem;
}

.event {
  border: 1px solid #ccc;
  background: #41b883;
  padding: 1rem;
  padding-top: 0em;
  border-radius: 5px;
  text-align: center;
  position: relative;
  cursor: pointer;
}

.event-card {
  width: 100%;
  margin: 1em auto 1em auto;
  padding: 1em;
  border: solid 1px #2c3e50;
  cursor: pointer;
}

.event-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}

.event-card h4 {
  font-size: 1.4em;
  margin-top: 0.5em;
  margin-bottom: 0.3em;
}

#align-right {
  text-align: center;
}

.right-align {
  text-align: right;
}

.triangle-right {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 8px solid currentColor;
  display: inline-block;
  margin-right: 0.5rem;
}

.triangle-down {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 8px solid currentColor;
  display: inline-block;
  margin-right: 0.5rem;
}
</style>