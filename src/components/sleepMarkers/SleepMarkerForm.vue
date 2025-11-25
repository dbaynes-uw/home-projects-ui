<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="900px"
    persistent
  >
    <v-card>
      <v-card-title class="form-header">
        <h3>
          <i class="fas fa-bed"></i>
          {{ isEditing ? 'Edit Sleep Entry' : 'Add Sleep Entry' }}
        </h3>
      </v-card-title>

      <v-card-text class="form-content">
        <v-form ref="formRef" v-model="valid">
          <v-row>
            <!-- Sleep Date -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.sleep_date"
                label="Sleep Date"
                type="date"
                required
                :rules="[v => !!v || 'Date is required']"
                prepend-icon="fas fa-calendar"
              ></v-text-field>
            </v-col>

            <!-- Sleep Quality -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formData.sleep_quality"
                label="Sleep Quality (1-10)"
                type="number"
                min="1"
                max="10"
                step="0.1"
                required
                :rules="[v => (v >= 1 && v <= 10) || 'Quality must be 1-10']"
                prepend-icon="fas fa-star"
              ></v-text-field>
            </v-col>

            <!-- Bed Time -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.bed_time"
                label="Bed Time"
                type="time"
                required
                :rules="[v => !!v || 'Bed time is required']"
                prepend-icon="fas fa-moon"
              ></v-text-field>
            </v-col>

            <!-- Wake Time -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.wake_time"
                label="Wake Time"
                type="time"
                required
                :rules="[v => !!v || 'Wake time is required']"
                prepend-icon="fas fa-sun"
              ></v-text-field>
            </v-col>

            <!-- ✅ TOTAL SLEEP - HOURS:MINUTES FORMAT -->
            <v-col cols="12" md="6">
              <v-row dense>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="timeInputs.total_sleep_hours"
                    label="Total Sleep (hours)"
                    type="number"
                    min="0"
                    max="24"
                    prepend-icon="fas fa-clock"
                    hint="Hours"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="timeInputs.total_sleep_minutes"
                    label="Minutes"
                    type="number"
                    min="0"
                    max="59"
                    hint="0-59"
                    persistent-hint
                  ></v-text-field>
                </v-col>
              </v-row>
              <div class="time-display">= {{ formatTimeDisplay('total_sleep') }} total</div>
            </v-col>

            <!-- ✅ TIME IN BED - HOURS:MINUTES FORMAT -->
            <v-col cols="12" md="6">
              <v-row dense>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="timeInputs.time_in_bed_hours"
                    label="Time in Bed (hours)"
                    type="number"
                    min="0"
                    max="24"
                    prepend-icon="fas fa-bed"
                    hint="Hours"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="timeInputs.time_in_bed_minutes"
                    label="Minutes"
                    type="number"
                    min="0"
                    max="59"
                    hint="0-59"
                    persistent-hint
                  ></v-text-field>
                </v-col>
              </v-row>
              <div class="time-display">= {{ formatTimeDisplay('time_in_bed') }} total</div>
            </v-col>

            <!-- ✅ TIME AWAKE - HOURS:MINUTES FORMAT -->
            <v-col cols="12" md="6">
              <v-row dense>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="timeInputs.time_awake_hours"
                    label="Time Awake (hours)"
                    type="number"
                    min="0"
                    max="24"
                    prepend-icon="fas fa-eye-slash"
                    hint="Hours"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="timeInputs.time_awake_minutes"
                    label="Minutes"
                    type="number"
                    min="0"
                    max="59"
                    hint="0-59"
                    persistent-hint
                  ></v-text-field>
                </v-col>
              </v-row>
              <div class="time-display">= {{ formatTimeDisplay('time_awake') }} total</div>
            </v-col>

            <!-- ✅ TIME ASLEEP - HOURS:MINUTES FORMAT -->
            <v-col cols="12" md="6">
              <v-row dense>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="timeInputs.time_asleep_hours"
                    label="Time Asleep (hours)"
                    type="number"
                    min="0"
                    max="24"
                    prepend-icon="fas fa-moon"
                    hint="Hours"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="timeInputs.time_asleep_minutes"
                    label="Minutes"
                    type="number"
                    min="0"
                    max="59"
                    hint="0-59"
                    persistent-hint
                  ></v-text-field>
                </v-col>
              </v-row>
              <div class="time-display">= {{ formatTimeDisplay('time_asleep') }} total</div>
            </v-col>

            <!-- ✅ DEEP SLEEP - HOURS:MINUTES FORMAT -->
            <v-col cols="12" md="6">
              <v-row dense>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="timeInputs.deep_sleep_hours"
                    label="Deep Sleep (hours)"
                    type="number"
                    min="0"
                    max="24"
                    prepend-icon="fas fa-brain"
                    hint="Hours"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="timeInputs.deep_sleep_minutes"
                    label="Minutes"
                    type="number"
                    min="0"
                    max="59"
                    hint="0-59"
                    persistent-hint
                  ></v-text-field>
                </v-col>
              </v-row>
              <div class="time-display">= {{ formatTimeDisplay('deep_sleep') }} total</div>
            </v-col>

            <!-- ✅ REM SLEEP - HOURS:MINUTES FORMAT -->
            <v-col cols="12" md="6">
              <v-row dense>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="timeInputs.rem_sleep_hours"
                    label="REM Sleep (hours)"
                    type="number"
                    min="0"
                    max="24"
                    prepend-icon="fas fa-eye"
                    hint="Hours"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="timeInputs.rem_sleep_minutes"
                    label="Minutes"
                    type="number"
                    min="0"
                    max="59"
                    hint="0-59"
                    persistent-hint
                  ></v-text-field>
                </v-col>
              </v-row>
              <div class="time-display">= {{ formatTimeDisplay('rem_sleep') }} total</div>
            </v-col>

            <!-- ✅ CORE SLEEP - HOURS:MINUTES FORMAT -->
            <v-col cols="12" md="6">
              <v-row dense>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="timeInputs.core_sleep_hours"
                    label="Core Sleep (hours)"
                    type="number"
                    min="0"
                    max="24"
                    prepend-icon="fas fa-heart"
                    hint="Hours"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="timeInputs.core_sleep_minutes"
                    label="Minutes"
                    type="number"
                    min="0"
                    max="59"
                    hint="0-59"
                    persistent-hint
                  ></v-text-field>
                </v-col>
              </v-row>
              <div class="time-display">= {{ formatTimeDisplay('core_sleep') }} total</div>
            </v-col>

            <!-- ✅ AWAKE SLEEP - HOURS:MINUTES FORMAT -->
            <v-col cols="12" md="6">
              <v-row dense>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="timeInputs.awake_sleep_hours"
                    label="Awake Sleep (hours)"
                    type="number"
                    min="0"
                    max="24"
                    prepend-icon="fas fa-eye-slash"
                    hint="Hours"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="timeInputs.awake_sleep_minutes"
                    label="Minutes"
                    type="number"
                    min="0"
                    max="59"
                    hint="0-59"
                    persistent-hint
                  ></v-text-field>
                </v-col>
              </v-row>
              <div class="time-display">= {{ formatTimeDisplay('awake_sleep') }} total</div>
            </v-col>

            <!-- Awakenings -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formData.awakenings"
                label="Number of Awakenings"
                type="number"
                min="0"
                prepend-icon="fas fa-exclamation-circle"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="form-actions">
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          variant="text"
          @click="handleCancel"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="handleSave"
          :disabled="!valid"
        >
          <i class="fas fa-save mr-2"></i>
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  marker: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'save', 'close']);

const formRef = ref(null);
const valid = ref(false);

const formData = ref({
  sleep_date: '',
  bed_time: '',
  wake_time: '',
  sleep_quality: null,
  awakenings: 0
});

// ✅ SEPARATE TIME INPUTS (HOURS AND MINUTES)
const timeInputs = ref({
  total_sleep_hours: 0,
  total_sleep_minutes: 0,
  time_in_bed_hours: 0,
  time_in_bed_minutes: 0,
  time_awake_hours: 0,
  time_awake_minutes: 0,
  time_asleep_hours: 0,
  time_asleep_minutes: 0,
  deep_sleep_hours: 0,
  deep_sleep_minutes: 0,
  rem_sleep_hours: 0,
  rem_sleep_minutes: 0,
  core_sleep_hours: 0,
  core_sleep_minutes: 0,
  awake_sleep_hours: 0,
  awake_sleep_minutes: 0
});

const isEditing = ref(false);

// ✅ HELPER: CONVERT TOTAL MINUTES TO HOURS AND MINUTES
function minutesToHoursAndMinutes(totalMinutes) {
  if (!totalMinutes || totalMinutes === null) return { hours: 0, minutes: 0 };
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}

// ✅ HELPER: CONVERT HOURS AND MINUTES TO TOTAL MINUTES
// ✅ UPDATED HELPER: CONVERT HOURS AND MINUTES TO DECIMAL HOURS
function hoursAndMinutesToDecimalHours(hours, minutes) {
  const h = parseInt(hours) || 0;
  const m = parseInt(minutes) || 0;
  // Convert minutes to decimal (e.g., 30 minutes = 0.5 hours)
  const decimalHours = h + (m / 60);
  // Round to 2 decimal places to match API precision
  return Math.round(decimalHours * 100) / 100;
}

// ✅ UPDATED HELPER: CONVERT DECIMAL HOURS TO HOURS AND MINUTES
function decimalHoursToHoursAndMinutes(decimalHours) {
  if (!decimalHours || decimalHours === null) return { hours: 0, minutes: 0 };
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return { hours, minutes };
}

// ✅ UPDATED: WATCH FOR MARKER CHANGES - CONVERT FROM API FORMAT (DECIMAL HOURS)
watch(() => props.marker, (newMarker) => {
  if (newMarker) {
    isEditing.value = !!newMarker.id;
    
    // Basic fields
    formData.value = {
      sleep_date: newMarker.sleep_date || '',
      bed_time: newMarker.bed_time || '',
      wake_time: newMarker.wake_time || '',
      sleep_quality: newMarker.sleep_quality || null,
      awakenings: newMarker.awakenings || 0
    };
    
    // Convert decimal hours to hours:minutes for each field
    const fields = [
      'total_sleep_hours',
      'time_in_bed',
      'time_awake',
      'time_asleep',
      'deep_sleep',
      'rem_sleep',
      'core_sleep',
      'awake_sleep'
    ];
    
    fields.forEach(field => {
      const decimalHours = newMarker[field] || 0;
      const { hours, minutes } = decimalHoursToHoursAndMinutes(decimalHours);
      
      // Map API field names to timeInputs field names
      const fieldPrefix = field === 'total_sleep_hours' ? 'total_sleep' : field;
      timeInputs.value[`${fieldPrefix}_hours`] = hours;
      timeInputs.value[`${fieldPrefix}_minutes`] = minutes;
    });
    
    console.log('📝 Loaded marker data (converted to hours:minutes):', {
      formData: formData.value,
      timeInputs: timeInputs.value
    });
  } else {
    resetForm();
  }
}, { immediate: true });

async function handleSave() {
  const { valid: isValid } = await formRef.value.validate();
  
  if (isValid) {
    // ✅ CONVERT HOURS:MINUTES TO DECIMAL HOURS FOR API
    const apiData = {
      ...formData.value,
      total_sleep_hours: hoursAndMinutesToDecimalHours(
        timeInputs.value.total_sleep_hours,
        timeInputs.value.total_sleep_minutes
      ),
      time_in_bed: hoursAndMinutesToDecimalHours(
        timeInputs.value.time_in_bed_hours,
        timeInputs.value.time_in_bed_minutes
      ),
      time_awake: hoursAndMinutesToDecimalHours(
        timeInputs.value.time_awake_hours,
        timeInputs.value.time_awake_minutes
      ),
      time_asleep: hoursAndMinutesToDecimalHours(
        timeInputs.value.time_asleep_hours,
        timeInputs.value.time_asleep_minutes
      ),
      deep_sleep: hoursAndMinutesToDecimalHours(
        timeInputs.value.deep_sleep_hours,
        timeInputs.value.deep_sleep_minutes
      ),
      rem_sleep: hoursAndMinutesToDecimalHours(
        timeInputs.value.rem_sleep_hours,
        timeInputs.value.rem_sleep_minutes
      ),
      core_sleep: hoursAndMinutesToDecimalHours(
        timeInputs.value.core_sleep_hours,
        timeInputs.value.core_sleep_minutes
      ),
      awake_sleep: hoursAndMinutesToDecimalHours(
        timeInputs.value.awake_sleep_hours,
        timeInputs.value.awake_sleep_minutes
      )
    };
    
    console.log('📤 Sending to API (in decimal hours):', apiData);
    console.log('🔄 Original form data (hours:minutes):', {
      formData: formData.value,
      timeInputs: timeInputs.value
    });
    
    // ✅ VALIDATE API CONSTRAINTS (max 99.99)
    const timeFields = [
      'total_sleep_hours',
      'time_in_bed',
      'time_awake',
      'time_asleep',
      'deep_sleep',
      'rem_sleep',
      'core_sleep',
      'awake_sleep'
    ];
    
    const invalidFields = timeFields.filter(field => {
      const value = apiData[field];
      return value && (value > 99.99 || value < 0);
    });
    
    if (invalidFields.length > 0) {
      alert(`Invalid values detected! These fields must be between 0 and 99.99 hours:\n${invalidFields.join(', ')}`);
      return;
    }
    
    emit('save', apiData);
    resetForm();
  }
}

// ✅ HELPER: FORMAT TIME DISPLAY (e.g., "7h 30m")
function formatTimeDisplay(fieldPrefix) {
  const hours = timeInputs.value[`${fieldPrefix}_hours`] || 0;
  const minutes = timeInputs.value[`${fieldPrefix}_minutes`] || 0;
  
  if (hours === 0 && minutes === 0) return '0h 0m';
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  
  return parts.join(' ');
}

// ✅ WATCH FOR MARKER CHANGES - CONVERT FROM API FORMAT (MINUTES)
watch(() => props.marker, (newMarker) => {
  if (newMarker) {
    isEditing.value = !!newMarker.id;
    
    // Basic fields
    formData.value = {
      sleep_date: newMarker.sleep_date || '',
      bed_time: newMarker.bed_time || '',
      wake_time: newMarker.wake_time || '',
      sleep_quality: newMarker.sleep_quality || null,
      awakenings: newMarker.awakenings || 0
    };
    
    // Convert minutes to hours:minutes for each field
    const fields = [
      'total_sleep',
      'time_in_bed',
      'time_awake',
      'time_asleep',
      'deep_sleep',
      'rem_sleep',
      'core_sleep',
      'awake_sleep'
    ];
    
    fields.forEach(field => {
      const totalMinutes = newMarker[field] || 0;
      const { hours, minutes } = minutesToHoursAndMinutes(totalMinutes);
      timeInputs.value[`${field}_hours`] = hours;
      timeInputs.value[`${field}_minutes`] = minutes;
    });
    
    console.log('📝 Loaded marker data (converted to hours:minutes):', {
      formData: formData.value,
      timeInputs: timeInputs.value
    });
  } else {
    resetForm();
  }
}, { immediate: true });

function resetForm() {
  formData.value = {
    sleep_date: '',
    bed_time: '',
    wake_time: '',
    sleep_quality: null,
    awakenings: 0
  };
  
  timeInputs.value = {
    total_sleep_hours: 0,
    total_sleep_minutes: 0,
    time_in_bed_hours: 0,
    time_in_bed_minutes: 0,
    time_awake_hours: 0,
    time_awake_minutes: 0,
    time_asleep_hours: 0,
    time_asleep_minutes: 0,
    deep_sleep_hours: 0,
    deep_sleep_minutes: 0,
    rem_sleep_hours: 0,
    rem_sleep_minutes: 0,
    core_sleep_hours: 0,
    core_sleep_minutes: 0,
    awake_sleep_hours: 0,
    awake_sleep_minutes: 0
  };
  
  isEditing.value = false;
}

function handleCancel() {
  resetForm();
  emit('close');
}

</script>

<style scoped>
.form-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
}

.form-header h3 {
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-content {
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}

.form-actions {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.time-display {
  font-size: 0.875rem;
  color: #667eea;
  font-weight: 600;
  margin-top: -0.5rem;
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
  display: inline-block;
}
</style>