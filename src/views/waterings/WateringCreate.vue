<template>
  <div>
    <h1>Add Watering System</h1>
    <div class="card">
      <router-link :to="{ name: 'Waterings' }">
        <h2><b>Back to Waterings</b></h2>
      </router-link>
    </div>

    <!-- Existing waterings not yet linked to this garden -->
    <template v-if="props.gardenId">
      <div>
        <label for="existing-watering-select" class="existing-watering-label">Add an Existing Watering</label>
        <select
          id="existing-watering-select"
          v-model="selectedExistingWatering"
          class="existing-watering-select"
          aria-label="Select an existing watering to add to this garden"
        >
          <option value="" disabled>Select a watering to add to this garden</option>
          <option v-for="item in wateringSelectItems" :key="item.value" :value="item.value">
            {{ item.title }}
          </option>
        </select>
        <div class="form-actions">
          <BaseButton
            variant="primary"
            :disabled="!selectedExistingWatering"
            @click="addToGarden()"
          >
            Add to Garden
          </BaseButton>
        </div>
      </div>

      <hr class="section-divider" />
      <h2>Create a New Watering</h2>
    </template>

    <form @submit.prevent="createWatering" class="form-card-display">
      <div class="form-container">
        <!-- Watering Name Input -->
        <BaseInput
          v-model="watering.name"
          label="Watering Name"
          required
        />
        <!-- Garden Selection -->
        <div class="garden-dropdown" ref="gardenDropdownRef">
          <button
            type="button"
            class="garden-dropdown-trigger"
            @click="isGardenDropdownOpen = !isGardenDropdownOpen"
          >
            <span :class="{ placeholder: !selectedGardenIds.length }">{{ selectedGardenLabel }}</span>
            <span class="garden-dropdown-arrow" :class="{ open: isGardenDropdownOpen }">&#9660;</span>
          </button>
          <div v-if="isGardenDropdownOpen" class="garden-dropdown-menu">
            <label
              v-for="g in gardens"
              :key="g.id"
              class="garden-dropdown-option"
            >
              <input type="checkbox" :value="g.id" v-model="selectedGardenIds">
              {{ g.name }}
            </label>
            <div v-if="!gardens.length" class="garden-dropdown-empty">Loading...</div>
            <button
              v-if="selectedGardenIds.length"
              type="button"
              class="garden-dropdown-clear"
              @click.stop="selectedGardenIds = []"
            >Clear selection</button>
          </div>
        </div>
        
        <!-- Location Input -->
        <BaseInput v-model="watering.location" label="Location" />
        <!-- Line Input -->
        <BaseInput v-model="watering.line" label="Line" />
        <!-- Target Input -->
        <BaseInput v-model="watering.target" label="Target" />
        <!-- Start Time Input -->
        <BaseInput v-model="watering.start_time" label="Start Time" type="time" />
        <!-- End Time Input -->
        <BaseInput v-model="watering.end_time" label="End Time" type="time" />
        <!-- Days Input -->
        <BaseInput v-model="watering.days" label="Days (e.g., Mon,Tue,Wed)" />
        <!-- Notes Input -->
        <div class="form-field">
          <label class="form-label">Notes</label>
          <textarea label="Notes" v-model="watering.notes" rows="3" class="form-textarea"></textarea>
        </div>

        <div class="form-actions">
          <BaseButton variant="primary" type="submit">Create</BaseButton>
          <BaseButton
            variant="secondary"
            @click="props.gardenId ? router.push({ name: 'GardenDetails', params: { id: props.gardenId } }) : router.push({ name: 'Waterings' })"
          >
            Cancel
          </BaseButton>
        </div>
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useWateringStore } from '@/stores/waterings/WateringStore';
import { useGardenStore } from '@/stores/gardens/GardenStore';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

const router = useRouter();
const vuexStore = useStore();
const wateringStore = useWateringStore();
const gardenStore = useGardenStore();

const props = defineProps({
  gardenId: {
    type: String,
    default: null
  }
});

const watering = ref({
  garden_ids: [],
  name: "",
  location: "",
  target: "",
  line: "",
  start_time: "",
  end_time: "",
  duration: "",
  days: "",
  notes: "",
  created_by: '',
});

const selectedExistingWatering = ref("");

const selectedGarden = computed(() =>
  gardenStore.allGardens.find(g => String(g.id) === String(props.gardenId))
);

const gardens = computed(() => gardenStore.allGardens);
const selectedGardenIds = ref([]);
const isGardenDropdownOpen = ref(false);
const gardenDropdownRef = ref(null);

const selectedGardenLabel = computed(() => {
  if (!selectedGardenIds.value.length) return 'Select Gardens (Optional)';
  if (selectedGardenIds.value.length === 1) {
    const g = gardens.value.find(g => g.id === selectedGardenIds.value[0]);
    return g?.name || '1 garden selected';
  }
  return `${selectedGardenIds.value.length} gardens selected`;
});

function handleOutsideClick(e) {
  if (gardenDropdownRef.value && !gardenDropdownRef.value.contains(e.target)) {
    isGardenDropdownOpen.value = false;
  }
}

const wateringsNotInGarden = computed(() => {
  if (!props.gardenId) return [];
  return wateringStore.allWaterings.filter(
    w => !Array.isArray(w.gardens) || !w.gardens.some(g => String(g.id) === String(props.gardenId))
  );
});

const wateringSelectItems = ref([]);

watch(selectedExistingWatering, (newId) => {
  if (!newId) {
    watering.value.name = '';
    watering.value.location = '';
    watering.value.line = '';
    watering.value.target = '';
    watering.value.start_time = '';
    watering.value.end_time = '';
    watering.value.duration = '';
    watering.value.days = '';
    watering.value.notes = '';
    return;
  }
  const found = wateringStore.allWaterings.find(w => w.id === newId);
  if (found) {
    watering.value.name = found.name || '';
    watering.value.location = found.location || '';
    watering.value.line = found.line || '';
    watering.value.target = found.target || '';
    watering.value.start_time = found.start_time || '';
    watering.value.end_time = found.end_time || '';
    watering.value.duration = found.duration || '';
    watering.value.days = found.days || '';
    watering.value.notes = found.notes || '';
  }
});

onMounted(async () => {
  document.addEventListener('click', handleOutsideClick);
  try {
    await gardenStore.fetchGardens();
  } catch (e) {
    console.error('WateringCreate: fetchGardens error', e);
  }
  try {
    await wateringStore.fetchWaterings();
  } catch (e) {
    console.error('WateringCreate: fetchWaterings error', e);
  }

  watering.value.created_by = vuexStore.state.user?.resource_owner?.email || '';
  if (props.gardenId) {
    selectedGardenIds.value = [parseInt(props.gardenId)];
    wateringSelectItems.value = wateringStore.allWaterings
      .filter(w => !Array.isArray(w.gardens) || !w.gardens.some(g => String(g.id) === String(props.gardenId)))
      .map(w => ({ title: w.name, value: w.id }));
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});

async function addToGarden() {
  if (!selectedExistingWatering.value) return;
  const existingWatering = wateringStore.allWaterings.find(w => w.id === selectedExistingWatering.value);
  if (!existingWatering) return;
  const existingGardenIds = existingWatering.gardens?.map(g => g.id) || [];
  const updated = {
    ...existingWatering,
    garden_ids: [...existingGardenIds, parseInt(props.gardenId)]
  };
  await wateringStore.updateWatering(updated);
  router.push({ name: 'GardenDetails', params: { id: props.gardenId } });
}

async function createWatering() {
  if (!watering.value.name) {
    alert("Please fill in all required fields.");
    return;
  }

  console.log('createWatering payload:', JSON.stringify(watering.value));
  await wateringStore.createWatering({ ...watering.value, garden_ids: selectedGardenIds.value });
  if (props.gardenId) {
    router.push({ name: 'GardenDetails', params: { id: props.gardenId } });
  } else {
    router.push({ name: 'Waterings' });
  }
}
</script><style scoped>
.section-divider {
  margin: 1rem 0;
}

.form-field {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.form-textarea {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 0.6rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

/* Create two equal columns that floats next to each other */
.column {
  float: left;
  padding: 10px;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
.v-icon {
  color: darkslategrey;
  top: -0.2rem;
}
#form-container {
  text-align: left;
  width: 75% !important;
}
[type="checkbox"],
#notes {
  width: 100%;
  height: 4rem;
}
.button {
  margin: 30px;
  background-color: #39495c;
  border-radius: 5px;
  font-size: 18px;
  width: 160px;
  height: 60px;
  color: white;
  padding: 20px;
  box-shadow: inset 0 -0.6em 1em -0.35em rgba(0, 0, 0, 0.17),
    inset 0 0.6em 2em -0.3em rgba(255, 255, 255, 0.15),
    inset 0 0 0em 0.05em rgba(255, 255, 255, 0.12);
  text-align: center;
  cursor: pointer;
}
fieldset {
  border: 0;
  margin: 0;
  padding: 0;
}
.existing-watering-label {
  display: block;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 6px;
}
.existing-watering-select {
  width: 100%;
  height: 48px;
  padding: 0 12px;
  border: 1px solid rgba(0, 0, 0, 0.38);
  border-radius: 4px;
  font-size: 16px;
  background-color: #fff;
  cursor: pointer;
}
.garden-dropdown {
  position: relative;
  width: 100%;
}
.garden-dropdown-trigger {
  width: 100%;
  height: 56px;
  padding: 0 16px;
  border: 1px solid #9e9e9e;
  border-radius: 4px;
  background: #fff;
  font-size: 16px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #000;
  box-sizing: border-box;
  outline: none;
}
.garden-dropdown-trigger:hover {
  border-color: rgba(0, 0, 0, 0.87);
}
.garden-dropdown-trigger .placeholder {
  color: rgba(0, 0, 0, 0.42);
}
.garden-dropdown-arrow {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
  transition: transform 0.2s;
}
.garden-dropdown-arrow.open {
  transform: rotate(180deg);
}
.garden-dropdown-menu {
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 100;
  max-height: 260px;
  overflow-y: auto;
  padding: 4px 0;
}
.garden-dropdown-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 15px;
}
.garden-dropdown-option:hover {
  background: rgba(0, 0, 0, 0.04);
}
.garden-dropdown-option input[type="checkbox"] {
  width: 16px !important;
  height: 16px !important;
  min-width: 16px;
  min-height: 16px;
  max-width: 16px;
  max-height: 16px;
  accent-color: #1867c0;
  flex-shrink: 0;
  cursor: pointer;
  appearance: checkbox;
  -webkit-appearance: checkbox;
  margin: 0;
}
.garden-dropdown-empty {
  padding: 12px 16px;
  color: rgba(0,0,0,0.4);
  font-size: 14px;
  font-style: italic;
}
.garden-dropdown-clear {
  width: 100%;
  padding: 8px 16px;
  border: none;
  border-top: 1px solid rgba(0,0,0,0.08);
  background: none;
  color: #1867c0;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}
.garden-dropdown-clear:hover {
  background: rgba(0,0,0,0.04);
}
legend {
  font-size: 28px;
  font-weight: 700;
  margin-top: 20px;
}
.input-field {
  margin-top: 30px;
  position: relative;
}
.input-field > input {
  width: 100%;
}
.input-field > p {
  position: absolute;
  font-size: 14px;
  transition: 0.3s;
}
</style>
