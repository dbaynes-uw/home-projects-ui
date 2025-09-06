<template>
  <div class="event-card">
    <h2><b>{{ formatDayOfWeek(event.action_due_date) }}, {{ formatYearDate(event.action_due_date) }}</b></h2>
    
    <p id="p-custom-u">
      <router-link
        :to="{ name: 'EventEdit', params: { id: `${event.id}` } }"
        class="event-title-link"
      >
        <i class="mdi mdi-calendar-edit"></i>
        {{ event.description }}
      </router-link>
    </p>
    
    <ul>
      <li class="li-left-capitalize">
        <i class="mdi mdi-check-circle"></i>
        Active: <b>{{ event.status }}</b>
      </li>
      <li class="li-left">
        <i class="mdi mdi-account"></i>
        Assigned To: <b>{{ event.assigned }}</b>
      </li>
      <li class="li-left">
        <i class="mdi mdi-clock-outline"></i>
        Last Action: {{ formatYearDate(event.action_completed_date) }}
      </li>
      <li class="li-left">
        <i class="mdi mdi-repeat"></i>
        Every {{ event.frequency }} days
      </li>
      <li class="li-left">
        <i class="mdi mdi-calendar-alert"></i>
        Due: <b>{{ formatYearDate(event.action_due_date) }}</b>
      </li>
      <li class="li-left">
        <i class="mdi mdi-note-text"></i>
        Notes:
      </li>
      <b class="li-left-none" v-for="(notes, idx) in joinedNotes(event)" :key="idx">
        {{ notes }}
      </b>
    </ul>
    
    <!-- ✅ CLEAN MDI ACTIONS SECTION -->
    <div class="card-actions">
      <router-link 
        :to="{ name: 'EventList' }" 
        class="action-link back-link"
        title="Back to Event List"
      >
        <i class="mdi mdi-arrow-left"></i>
        <span>Back</span>
      </router-link>
      
      <router-link 
        :to="{ name: 'EventEdit', params: { id: `${event.id}` } }" 
        class="action-link edit-link"
        title="Edit Event"
      >
        <i class="mdi mdi-pencil"></i>
        <span>Edit</span>
      </router-link>
      
      <button 
        @click="deleteEvent(event)" 
        class="action-btn delete-btn"
        title="Delete Event"
      >
        <i class="mdi mdi-delete"></i>
        <span>Delete</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

import DateFormatService from "@/services/DateFormatService.js";

// ✅ PROPS
defineProps({
  event: {
    type: Object,
    default: () => ({})
  }
});

// ✅ EMITS
const emit = defineEmits(['delete']);

// ✅ METHODS
const joinedNotes = (e) => {
  return e.notes ? e.notes.split('\n') : [];
};

const formatDayOfWeek = (value) => {
  return DateFormatService.formatDayOfWeekjs(value);
};

const formatYearDate = (value) => {
  return DateFormatService.formatYearDatejs(value);
};

const deleteEvent = (event) => {
  emit('delete', event);
};
</script>

<style scoped>
.event-card {
  width: 100%;
  margin: 1em auto 1em auto;
  padding: 1.5em;
  border: solid 1px #2c3e50;
  border-radius: 8px;
  cursor: pointer;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.event-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}

.event-card h2 {
  color: #2c3e50;
  margin-top: 0;
  text-align: center;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #41b883;
}

.event-card h4 {
  font-size: 1.4em;
  margin-top: 0.5em;
  margin-bottom: 0.3em;
}

/* ✅ EVENT TITLE LINK STYLING */
.event-title-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #41b883;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.event-title-link:hover {
  color: #369870;
  transform: translateX(4px);
}

.event-title-link i {
  font-size: 1.2em;
}

/* ✅ LIST ITEMS WITH ICONS */
ul {
  list-style: none;
  padding-left: 0;
}

li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
  padding: 0.25rem 0;
}

li i {
  color: #41b883;
  font-size: 1.1em;
  width: 20px;
  text-align: center;
}

.li-left-none {
  margin-left: 1.5rem;
  display: block;
  color: #666;
  font-style: italic;
}

/* ✅ CARD ACTIONS STYLING */
.card-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}

.action-link,
.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;
}

.action-link:hover,
.action-btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-link i,
.action-btn i {
  font-size: 1.5rem;
}

.action-link span,
.action-btn span {
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ✅ SPECIFIC ACTION COLORS */
.back-link {
  color: #6c757d;
}

.back-link:hover {
  background: rgba(108, 117, 125, 0.1);
  color: #495057;
}

.edit-link {
  color: #41b883;
}

.edit-link:hover {
  background: rgba(65, 184, 131, 0.1);
  color: #369870;
}

.delete-btn {
  color: #e74c3c;
}

.delete-btn:hover {
  background: rgba(231, 76, 60, 0.1);
  color: #c0392b;
}

/* ✅ RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .card-actions {
    flex-direction: row;
    gap: 0.5rem;
  }
  
  .action-link,
  .action-btn {
    min-width: 50px;
    padding: 0.5rem;
  }
  
  .action-link span,
  .action-btn span {
    font-size: 0.7rem;
  }
}

/* ✅ LEGACY COMPATIBILITY */
#p-custom-u {
  text-align: center;
  margin: 1rem 0;
}

.li-left-capitalize {
  text-transform: capitalize;
}

.li-left {
  /* Inherits from li styles above */
}
</style>