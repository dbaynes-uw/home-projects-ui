<template>
  <div class="event-create-container">
    <!-- ✅ HEADER CARD (NO VUETIFY) -->
    <div class="card mt-5">
      <div class="card-header">
        <h2 class="card-title">
          <i class="fas fa-calendar-plus"></i>
          Create an Event
        </h2>
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

    <!-- ✅ FORM CARD (NO VUETIFY) -->
    <div class="card mt-4">
      <form @submit.prevent="onSubmit">
        <div class="card-body">
          
          <!-- ✅ DESCRIPTION -->
          <div class="form-group">
            <label class="form-label required">
              <i class="fas fa-align-left"></i>
              Description
            </label>
            <input
              v-model="event.description"
              type="text"
              class="form-input"
              placeholder="Enter event description..."
              required
            />
          </div>

          <!-- ✅ ACTION DATE -->
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

          <!-- ✅ SUBMIT BUTTON -->
          <button 
            type="submit"
            class="btn btn-primary btn-large btn-block"
            :disabled="isSubmitting"
            :class="{ 'btn-loading': isSubmitting }"
          >
            <template v-if="!isSubmitting">
              <i class="fas fa-save"></i>
              Create Event
            </template>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import { ASSIGNEES_CURRENT, EVENT_FREQUENCY } from '@/services/constants';

const store = useStore();
const router = useRouter();

// ✅ REACTIVE STATE
const isSubmitting = ref(false);

const event = ref({
  description: '',
  assigned: '',
  assigned_email: '',
  frequency: '',
  action_due_date: '',
  action_completed_date: '',
  status: '',
  notes: '',
  created_by: '',
});

// ✅ COMPUTED
const user = computed(() => store.state.user?.resource_owner);

// ✅ SET CREATED_BY
if (user.value?.email) {
  event.value.created_by = user.value.email;
}

// ✅ SUBMIT FUNCTION
const onSubmit = async () => {
  try {
    isSubmitting.value = true;
    
    const eventData = {
      ...event.value,
      id: uuidv4(),
      status: 'active',
      created_by: user.value?.email || '',
    };
    
    console.log('📅 Creating event:', eventData);
    
    const success = await store.dispatch('createEvent', eventData);
    console.log('📅 Event creation result:', success);
    if (success) {
      router.push({ name: 'EventList' });
    } else {
      alert('❌ Failed to create event');
    }
    
  } catch (error) {
    console.error('❌ Error creating event:', error);
    alert(`❌ Error: ${error.message}`);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* ✅ IMPORT ALL SHARED STYLES */
@import '@/assets/styles/ui-components.css';
@import '@/assets/styles/event-components.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

/* Responsive overrides only */
@media (max-width: 768px) {
  /* Prevent zoom on mobile inputs */
  .form-input,
  .form-select {
    font-size: 16px;
  }
}
</style>