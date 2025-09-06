<template>
  <ConfirmDialogue ref="confirmDialogue" />
  <br/>
  <div class="eventEdit">
    <h2><i class="mdi mdi-pencil"></i> Edit Event {{ event?.description }}</h2>
    
    <router-link :to="{ name: 'EventList' }" class="back-link">
      <i class="mdi mdi-arrow-left"></i>
      <span>Back to Event List</span>
    </router-link>
    
    <br/>
    
    <form class="card-display" @submit.prevent="updateEvent">
      <div class="form-container">
        <v-text-field
          label="Event Name or Description"
          v-model="event.description"
        />
        
        <v-select
          label="Status"
          :items="ACTIVE_STATUSES"
          v-model="capitalizedStatus"
        >
          <option
            v-for="option in ACTIVE_STATUSES"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === event?.status"
          >
            {{ option }}
          </option>
        </v-select>
        
        <!-- ✅ PAST DUE WARNING -->
        <div v-if="datePastDue(event?.action_completed_date, event?.frequency)" class="past-due-warning">
          <i class="mdi mdi-alert-circle"></i>
          <span>
            Event is Past Due: {{ calculateDateDue(event?.action_completed_date, event?.frequency) }}
          </span>
        </div>
        
        <v-text-field
          label="Action Due Date"
          v-model="event.action_due_date"
          type="date"
        />
        
        <v-text-field
          label="Action Last Completed Date"
          v-model="event.action_completed_date"
          type="date"
        />
        
        <v-select
          label="Whose Turn?"
          :items="ASSIGNEES_CURRENT"
          v-model="event.assigned"
        >
          <option
            v-for="option in ASSIGNEES_CURRENT"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === event?.assigned"
          >
            {{ option }}
          </option>
        </v-select>
        
        <v-select
          label="Frequency in Days"
          :items="EVENT_FREQUENCY"
          v-model="event.frequency"
        >
          <option
            v-for="option in EVENT_FREQUENCY"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === event?.frequency"
          >
            {{ option }}
          </option>
        </v-select>
        
        <v-textarea
          label="Notes"
          v-model="event.notes"
          rows="3"
          cols="40"
        />
        
        <br>
        
        <!-- ✅ MODERN SUBMIT BUTTON -->
        <button class="submit-btn" type="submit">
          <i class="mdi mdi-content-save"></i>
          <span>Update Event</span>
        </button>
        
        <br/>
        
        <!-- ✅ DETAILS BUTTON -->
        <router-link 
          :to="{ name: 'EventShow', params: { id: `${event?.id}` } }" 
          class="details-btn"
        >
          <i class="mdi mdi-information"></i>
          <span>Details and History</span>
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ASSIGNEES_CURRENT, EVENT_FREQUENCY, ACTIVE_STATUSES } from "@/services/constants.js";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";

// ✅ COMPOSITION API SETUP
const store = useStore();
const router = useRouter();

// ✅ PROPS
const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  },
  assigned: {
    type: String,
    default: ""
  }
});

// ✅ REFS
const confirmDialogue = ref(null);

// ✅ COMPUTED PROPERTIES
const event = computed(() => store.state.event || {});

const capitalizedStatus = computed({
  get() {
    if (!event.value?.status) return '';
    return event.value.status.charAt(0).toUpperCase() + event.value.status.slice(1);
  },
  set(value) {
    if (event.value) {
      event.value.status = value;
    }
  }
});

// ✅ METHODS
const updateEvent = async () => {
  try {
    console.log('💾 Attempting to update event:', event.value.description);
    
    const ok = await confirmDialogue.value?.show({
      title: "Update Event",
      message: `Are you sure you want to update "${event.value.description}"?`,
      okButton: "Update Event",
      cancelButton: "Cancel"
    });

    if (!ok) {
      console.log('❌ Update cancelled by user');
      return;
    }

    console.log('✅ User confirmed update, proceeding...');

    const eventData = {
      ...event.value,
      assigned_email: store.state.user?.resource_owner?.email || '',
      updated_by: store.state.user?.resource_owner?.email || '',
    };

    console.log('📤 Dispatching updateEvent action:', eventData);

    const result = await store.dispatch("updateEvent", eventData);
    
    if (result) {
      console.log('🎉 Event updated successfully');
      
      // ✅ SUCCESS FEEDBACK
      await confirmDialogue.value?.show({
        title: "Update Successful",
        message: `"${event.value.description}" has been updated successfully.`,
        okButton: "View Details",
        cancelButton: null
      });
      
      router.push({ name: "EventShow", params: { id: eventData.id } });
    } else {
      throw new Error('Update operation failed');
    }
    
  } catch (error) {
    console.error('❌ Failed to update event:', error);
    
    await confirmDialogue.value?.show({
      title: "Update Failed",
      message: `Failed to update "${event.value.description}". Please try again.`,
      okButton: "OK",
      cancelButton: null
    });
  }
};

const formatStandardDate = (value) => {
  return DateFormatService.formatStandardDatejs(value);
};

const datePastDue = (action_date, frequency) => {
  return DateFormatService.datePastDuejs(action_date, frequency);
};

const calculateDateDue = (action_completed_date, frequency) => {
  return DateFormatService.calculateDateDuejs(action_completed_date, frequency);
};

// ✅ LIFECYCLE HOOKS
onMounted(async () => {
  console.log('✅ EventEdit mounted (Composition API)');
  console.log('🔍 Props:', props);
  
  // Fetch the event
  await store.dispatch("fetchEvent", props.id);
  
  // Wait for next tick to ensure DOM is updated
  await nextTick();
  
  //console.log('📋 Event loaded:', event.value);
});

// ✅ EXPOSE METHODS (if needed for testing)
defineExpose({
  updateEvent,
  formatStandardDate,
  datePastDue,
  calculateDateDue
});
</script>

<style scoped>
.eventEdit {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.eventEdit h2 {
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.eventEdit h2 i {
  color: #41b883;
}

/* ✅ BACK LINK STYLING */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.back-link:hover {
  background: rgba(108, 117, 125, 0.1);
  color: #495057;
  transform: translateX(-4px);
}

.back-link i {
  font-size: 1.2em;
}

/* ✅ FORM CONTAINER */
.form-container {
  width: 100%;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* ✅ PAST DUE WARNING */
.past-due-warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #ffe6e6 0%, #ffcccc 100%);
  border: 1px solid #ff9999;
  border-radius: 8px;
  color: #d32f2f;
  font-weight: bold;
  margin: 1rem 0;
}

.past-due-warning i {
  font-size: 1.2em;
  color: #d32f2f;
}

/* ✅ SUBMIT BUTTON */
.submit-btn {
  background: linear-gradient(135deg, #41b883 0%, #35a872 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(65, 184, 131, 0.3);
  margin: 1rem 0;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(65, 184, 131, 0.4);
  background: linear-gradient(135deg, #369870 0%, #2e8a5e 100%);
}

.submit-btn i {
  font-size: 1.2em;
}

/* ✅ DETAILS BUTTON */
.details-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.details-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

.details-btn i {
  font-size: 1.1em;
}

/* ✅ SELECT STYLING */
select {
  border-color: #41b883;
  border-radius: 4px;
  padding: 0.5rem;
}

select:focus {
  outline: none;
  border-color: #369870;
  box-shadow: 0 0 0 2px rgba(65, 184, 131, 0.2);
}

/* ✅ RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .eventEdit {
    padding: 1rem;
  }
  
  .form-container {
    padding: 1rem;
  }
  
  .submit-btn,
  .details-btn {
    width: 100%;
    justify-content: center;
    margin: 0.5rem 0;
  }
}

/* ✅ VUETIFY OVERRIDES */
.v-text-field,
.v-select,
.v-textarea {
  margin: 1rem 0;
}
</style>