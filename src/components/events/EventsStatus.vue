<template>
  <div class="status-wrapper">
    <select v-model="internalValue" @change="handleStatusChange" class="native-select">
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const internalValue = ref('active');

const props = defineProps({
  showActiveEvents: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['toggle-status']);

const handleStatusChange = () => {
  const newActiveState = internalValue.value === 'active';

  if (newActiveState) {
    store.dispatch('eventsStatus', 'active');
    store.commit('SET_EVENTS_REQUEST', 'Active');
  } else {
    store.dispatch('eventsStatus', 'inactive');
    store.commit('SET_EVENTS_REQUEST', 'Inactive');
  }

  emit('toggle-status', newActiveState);
};

watch(() => props.showActiveEvents, (newVal) => {
  internalValue.value = newVal ? 'active' : 'inactive';
});
</script>

<style scoped>
.status-wrapper {
  position: relative;
  width: 200px;
  height: 48px;
}

.native-select {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: linear-gradient(to right, #16c0b0, #84cf6a);
  color: black;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.native-select:hover {
  background: linear-gradient(to right, #14a89a, #72b558);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 192, 176, 0.4);
}

.native-select:focus {
  outline: none;
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
}

.native-select option {
  background: white;
  color: black;
  font-weight: 600;
  padding: 8px;
}

/* ✅ OVERRIDE ANY VUETIFY DEFAULT PADDING/MARGIN */
.action-button :deep(.v-btn__prepend) {
  margin-inline-end: 8px !important;
  margin-inline-start: 0 !important;
}

.action-button :deep(.v-btn__append) {
  margin-inline-start: 8px !important;
  margin-inline-end: 0 !important;
}

/* ✅ ENSURE NO EXTRA SPACING */
.action-button :deep(.v-btn__overlay) {
  border-radius: 12px !important;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .action-button-wrapper {
    max-width: 100%;
  }
  
  .action-label {
    font-size: 11px !important;
  }
  
  .action-button {
    height: 44px !important;
    min-height: 44px !important;
    max-height: 44px !important;
  }
  
  .action-button :deep(.v-btn__content) {
    font-size: 1.25rem !important;
  }
  
  .action-button :deep(.v-icon) {
    font-size: 16px !important;
  }
}

@media (max-width: 480px) {
  .action-button {
    height: 40px !important;
    min-height: 40px !important;
    max-height: 40px !important;
  }
  
  .action-button :deep(.v-btn__content) {
    font-size: 1.25rem !important;
  }
  
  .action-button :deep(.v-icon) {
    font-size: 15px !important;
  }
}
</style>