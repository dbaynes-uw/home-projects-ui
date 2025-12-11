<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/components/events/EventIndex.vue -->

<template>
  <ConfirmDialogue ref="confirmDialogue" />
  
  <div class="table-container">
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th @click="sortList('description')" class="sortable">
              <i class="fas fa-sort"></i>
              Description
            </th>
            <th @click="sortList('frequency')" class="sortable">
              <i class="fas fa-sort"></i>
              Frequency
            </th>
            <th @click="sortList('action_due_date')" class="sortable">
              <i class="fas fa-sort"></i>
              Due
            </th>
            <th @click="sortList('action_completed_date')" class="sortable">
              <i class="fas fa-sort"></i>
              Completed
            </th>
            <th @click="sortList('assigned')" class="sortable">
              <i class="fas fa-sort"></i>
              Assigned
            </th>
            <th @click="sortList('status')" class="sortable">
              <i class="fas fa-sort"></i>
              Status
            </th>
            <th class="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="event in sortedEvents" 
            :key="event.id"
            :class="getRowClass(event)"
          >
            <td class="description-cell">{{ event.description }}</td>
            <td class="text-center">Every {{ event.frequency }} days</td>
            <td class="text-center">
              {{ formatYearDate(event.action_due_date) }}
              <span 
                v-if="isEventPastDue(event)"
                class="chip chip-danger chip-tiny ml-1"
              >
                <i class="fas fa-exclamation-triangle"></i>
                PAST DUE
              </span>
            </td>
            <td class="text-center">{{ formatYearDate(event.action_completed_date) }}</td>
            <td class="text-center">{{ event.assigned }}</td>
            <td class="text-center">
              <span :class="['status-badge', `status-${event.status}`]">
                {{ capitalizeStatus(event.status) }}
              </span>
            </td>
            <td class="actions-cell">
              <div v-if="onlineStatus" class="action-icons">
                <router-link
                  :to="{ name: 'EventShow', params: { id: event.id } }"
                  class="action-icon action-icon-view"
                  title="View Details"
                >
                  <i class="fas fa-eye"></i>
                </router-link>
                
                <router-link
                  :to="{ name: 'EventEdit', params: { id: event.id } }"
                  class="action-icon action-icon-edit"
                  title="Edit Event"
                >
                  <i class="fas fa-pen-to-square"></i>
                </router-link>
                
                <button
                  @click="deleteEvent(event)"
                  class="action-icon action-icon-delete"
                  title="Delete Event"
                  type="button"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
              
              <div v-else class="action-links">
                <router-link :to="{ name: 'EventShow', params: { id: event.id } }">
                  View
                </router-link>
                <span class="separator">|</span>
                <router-link :to="{ name: 'EventEdit', params: { id: event.id } }">
                  Edit
                </router-link>
                <span class="separator">|</span>
                <button @click="deleteEvent(event)" class="link-button">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";

const store = useStore();
const router = useRouter();

// ✅ PROPS
const props = defineProps({
  events: {
    type: Array,
    required: true,
    default: () => []
  }
});

// ✅ REFS
const confirmDialogue = ref(null);
const onlineStatus = ref(navigator.onLine);
const sortBy = ref('action_due_date');
const sortAsc = ref(true);

// ✅ COMPUTED
const sortedEvents = computed(() => {
  if (!props.events || props.events.length === 0) return [];
  
  const sorted = [...props.events].sort((a, b) => {
    const aVal = a[sortBy.value];
    const bVal = b[sortBy.value];
    
    if (aVal === bVal) return 0;
    
    if (sortAsc.value) {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
  
  return sorted;
});

// ✅ METHODS
const sortList = (field) => {
  if (sortBy.value === field) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortBy.value = field;
    sortAsc.value = true;
  }
};

const isEventPastDue = (event) => {
  const today = dayjs().format("YYYY-MM-DD");
  return event.status === 'active' && event.action_due_date < today;
};

const getRowClass = (event) => {
  if (event.status === 'inactive') return 'row-inactive';
  if (isEventPastDue(event)) return 'row-pastdue';
  return '';
};

const capitalizeStatus = (status) => {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const deleteEvent = async (event) => {
  const ok = await confirmDialogue.value.show({
    title: "Delete Event",
    message: `Are you sure you want to delete "${event.description}"? This cannot be undone.`,
    okButton: "Delete Forever",
    cancelButton: "Cancel"
  });

  if (!ok) {
    console.log('❌ Delete cancelled by user');
    return;
  }

  try {
    console.log('🗑️ Deleting event:', event);
    const success = await store.dispatch("deleteEvent", event);
    
    if (success) {
      console.log('✅ Delete successful');
      // Reload the page to refresh the list
      setTimeout(() => location.reload(), 1000);
    } else {
      throw new Error('Delete failed');
    }
  } catch (error) {
    console.error('❌ Delete error:', error);
    alert(`Failed to delete "${event.description}". Please try again.`);
  }
};

const formatYearDate = (value) => {
  return DateFormatService.formatYearDatejs(value);
};
</script>

<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/components/events/EventIndex.vue -->

<style scoped>
/* ✅ IMPORT SHARED STYLES */
@import '@/assets/styles/ui-components.css';
@import '@/assets/styles/event-components.css';
@import '@/assets/styles/table-components.css';

/* ========================================
   EVENT INDEX SPECIFIC STYLES (minimal!)
   ======================================== */

/* Only component-specific overrides if needed */

/* Offline Action Links (EventIndex specific) */
.action-links {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
}

.action-links a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.action-links a:hover {
  text-decoration: underline;
}

.link-button {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-weight: 600;
  padding: 0;
  text-decoration: underline;
}

.link-button:hover {
  color: #dc2626;
}

.separator {
  color: #ccc;
}

/* Hide frequency and assigned columns on small screens */
@media (max-width: 640px) {
  .data-table th:nth-child(2),
  .data-table td:nth-child(2),
  .data-table th:nth-child(5),
  .data-table td:nth-child(5) {
    display: none;
  }
}
</style>