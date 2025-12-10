<template>
  <div class="event-container">
    <ConfirmDialogue ref="confirmDialogue" />
    
    <!-- ✅ HEADER (NO VUETIFY) -->
    <div class="card mt-5">
      <div class="card-header">
        <h2 class="card-title">
          <i class="fas fa-edit"></i>
          Edit Event
        </h2>
        <p v-if="event?.description" class="subtitle">
          {{ event.description }}
        </p>
      </div>
      
      <div class="card-body">
        <router-link 
          :to="{ name: 'EventList' }"
          class="btn btn-outlined"
        >
          <i class="fas fa-arrow-left"></i>
          Back to Event List
        </router-link>
      </div>
    </div>

    <!-- ✅ EDIT FORM (NO VUETIFY) -->
    <div class="card mt-4">
      <form @submit.prevent="updateEvent">
        <div class="card-body">
          
          <!-- ✅ DESCRIPTION -->
          <div class="form-group">
            <label class="form-label required">
              <i class="fas fa-align-left"></i>
              Event Name or Description
            </label>
            <input
              v-model="event.description"
              type="text"
              class="form-input"
              required
            />
          </div>

          <!-- ✅ STATUS SELECT -->
          <div class="form-group">
            <label class="form-label required">
              <i class="fas fa-toggle-on"></i>
              Status
            </label>
            <div class="select-wrapper">
              <select
                v-model="capitalizedStatus"
                class="form-select"
                required
              >
                <option value="" disabled>Select status...</option>
                <option 
                  v-for="option in ACTIVE_STATUSES" 
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
              <i class="fas fa-chevron-down select-icon"></i>
            </div>
          </div>

          <!-- ✅ PAST DUE WARNING -->
          <div 
            v-if="isEventPastDue" 
            class="past-due-warning"
          >
            <i class="fas fa-exclamation-triangle"></i>
            <span>
              Event is Past Due: {{ formatDueDate(event?.action_due_date) }}
            </span>
          </div>

          <!-- ✅ ACTION DUE DATE -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-calendar"></i>
              Action Due Date
            </label>
            <input
              v-model="event.action_due_date"
              type="date"
              class="form-input"
            />
          </div>

          <!-- ✅ ACTION COMPLETED DATE -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-calendar-check"></i>
              Action Last Completed Date
            </label>
            <input
              v-model="event.action_completed_date"
              type="date"
              class="form-input"
            />
          </div>

          <!-- ✅ ASSIGNED SELECT -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-user"></i>
              Whose Turn?
            </label>
            <div class="select-wrapper">
              <select
                v-model="event.assigned"
                class="form-select"
              >
                <option value="">Select assignee...</option>
                <option 
                  v-for="option in ASSIGNEES_CURRENT" 
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
              <i class="fas fa-chevron-down select-icon"></i>
            </div>
          </div>

          <!-- ✅ FREQUENCY SELECT -->
          <div class="form-group">
            <label class="form-label required">
              <i class="fas fa-repeat"></i>
              Frequency in Days
            </label>
            <div class="select-wrapper">
              <select
                v-model="event.frequency"
                class="form-select"
                required
              >
                <option value="">Select frequency...</option>
                <option 
                  v-for="option in EVENT_FREQUENCY" 
                  :key="option"
                  :value="option"
                >
                  {{ option }} days
                </option>
              </select>
              <i class="fas fa-chevron-down select-icon"></i>
            </div>
          </div>

          <!-- ✅ NOTES -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-sticky-note"></i>
              Notes
            </label>
            <textarea
              v-model="event.notes"
              class="form-input"
              rows="4"
              placeholder="Add any notes about this event..."
            ></textarea>
          </div>

          <!-- ✅ ACTION BUTTONS -->
          <div class="event-actions">
            <button 
              type="submit"
              class="btn btn-primary btn-large"
              :disabled="isSubmitting"
              :class="{ 'btn-loading': isSubmitting }"
            >
              <template v-if="!isSubmitting">
                <i class="fas fa-save"></i>
                Update Event
              </template>
            </button>

            <router-link 
              :to="{ name: 'EventShow', params: { id: event?.id } }" 
              class="details-btn"
            >
              <i class="fas fa-info-circle"></i>
              Details and History
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ASSIGNEES_CURRENT, EVENT_FREQUENCY, ACTIVE_STATUSES } from "@/services/constants.js";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";

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
const isSubmitting = ref(false);

// ✅ COMPUTED PROPERTIES
const event = computed(() => store.state.event || {});

const capitalizedStatus = computed({
  get() {
    if (!event.value?.status) return '';
    return event.value.status.charAt(0).toUpperCase() + event.value.status.slice(1);
  },
  set(value) {
    if (event.value) {
      event.value.status = value.toLowerCase();
    }
  }
});

// ✅ Check if event is past due (action_due_date < today)
const isEventPastDue = computed(() => {
  if (!event.value?.action_due_date) return false;
  
  const dueDate = new Date(event.value.action_due_date);
  const today = new Date();
  
  // Reset time to midnight for accurate date comparison
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  return dueDate < today;
});

// ✅ METHODS
const updateEvent = async () => {
  try {
    const ok = await confirmDialogue.value.show({
      title: "Update Event",
      message: `Are you sure you want to update "${event.value.description}"?`,
      okButton: "Update",
    });

    if (!ok) {
      console.log('❌ Update cancelled by user');
      return;
    }

    isSubmitting.value = true;
    
    const updatedEvent = {
      ...event.value,
      updated_by: store.state.user?.resource_owner?.email || '',
      updated_at: new Date().toISOString()
    };

    const success = await store.dispatch("updateEvent", updatedEvent);

    if (success) {
      await confirmDialogue.value.show({
        title: "Success",
        message: `"${event.value.description}" has been updated successfully!`,
        okButton: "View Details",
        cancelButton: null
      });
      
      router.push({ name: "EventShow", params: { id: updatedEvent.id } });
    } else {
      throw new Error('Update failed');
    }

  } catch (error) {
    console.error('❌ Update error:', error);
    
    await confirmDialogue.value.show({
      title: "Update Failed", 
      message: `Failed to update "${event.value.description}". ${error.message || 'Please try again.'}`,
      okButton: "OK",
      cancelButton: null
    });
  } finally {
    isSubmitting.value = false;
  }
};

const formatDueDate = (dateString) => {
  if (!dateString) return 'No date set';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// ✅ LIFECYCLE
onMounted(async () => {
  await store.dispatch("fetchEvent", props.id);
});
</script>
<style scoped>
/* ✅ IMPORT ALL SHARED STYLES */
@import '@/assets/styles/ui-components.css';
@import '@/assets/styles/event-components.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

.subtitle {
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 1.1rem;
  font-weight: 500;
}

/* Responsive overrides only */
@media (max-width: 768px) {
  /* Prevent zoom on mobile inputs */
  .form-input,
  .form-select {
    font-size: 16px;
  }
}
</style>