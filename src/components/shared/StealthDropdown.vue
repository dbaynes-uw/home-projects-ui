<template>
  <div class="stealth-select-wrapper">
    <label class="stealth-label">{{ label }}</label>
    <v-select
      v-model="internalValue"
      :items="items"
      variant="solo"
      hide-details
      class="stealth-button"
      @update:model-value="handleChange"
      :menu-props="{ 
        closeOnContentClick: true,
        offset: 4,
        transition: 'slide-y-transition'
      }"
    >
      <!-- ✅ CUSTOM DISPLAY - Only show when there's a value -->
      <template #selection="{ item }">
        <div class="stealth-button-content">
          <v-icon class="stealth-icon">{{ icon }}</v-icon>
          {{ formatSelection(item) }}
        </div>
      </template>
      
      <!-- ✅ FIX: Use placeholder slot instead of no-data -->
      <template #placeholder>
        <div class="stealth-button-content">
          <v-icon class="stealth-icon">{{ icon }}</v-icon>
          {{ placeholder }}
        </div>
      </template>
    </v-select>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// ✅ PROPS (unchanged)
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  formatPrefix: {
    type: String,
    default: ''
  },
  formatSuffix: {
    type: String,
    default: ''
  },
  storeAction: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

// ✅ REACTIVE STATE
const internalValue = ref(props.modelValue);

// ✅ IMPROVED SELECTION FORMATTING - Handle undefined/empty values
const formatSelection = computed(() => {
  return (item) => {
    // ✅ CHECK IF ITEM AND VALUE EXIST
    if (!item || !item.raw || (!item.raw.value && !item.raw.title)) {
      return props.placeholder;
    }
    
    const value = item.raw.value || item.raw.title;
    
    if (props.formatPrefix && props.formatSuffix) {
      // For "Due in X days" format
      return `${props.formatPrefix} ${value} ${props.formatSuffix}`;
    } else {
      // For simple display like location names
      return value;
    }
  };
});

// ✅ HANDLE CHANGES
function handleChange(newValue) {
  internalValue.value = newValue;
  emit('update:modelValue', newValue);
  
  if (props.storeAction) {
    if (newValue) {
      store.commit('SET_EVENTS_REQUEST', props.storeAction);
    } else {
      store.commit('SET_EVENTS_REQUEST', '');
    }
  }
}

// ✅ WATCH FOR EXTERNAL CHANGES
watch(() => props.modelValue, (newVal) => {
  internalValue.value = newVal;
});
</script>

<style scoped>
/* ✅ YOUR EXISTING STYLES - UNCHANGED */
.stealth-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 250px;
}

.stealth-label {
  color: #1a1a1a !important;
  font-weight: 800 !important;
  font-size: 15px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.8px !important;
  text-align: center !important;
  margin-bottom: 6px !important;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
}

.stealth-button :deep(.v-field) {
  background: linear-gradient(to right, #16c0b0, #84cf6a) !important;
  border-radius: 12px !important;
  border: none !important;
  height: 48px !important;
  box-shadow: 0 2px 8px rgba(22, 192, 176, 0.3) !important;
  transition: all 0.3s ease !important;
  cursor: pointer !important;
  width: 100% !important;
}

.stealth-button :deep(.v-field__append-inner),
.stealth-button :deep(.v-field__clearable) {
  display: none !important;
}

.stealth-button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 25px;
  color: black !important;
  font-weight: 800 !important;
  font-size: 20px !important;
  text-transform: none !important;
  padding-bottom: .5rem !important;
}

.stealth-icon {
  color: black !important;
  font-size: 20px !important;
  margin-right: 8px !important;
}

.stealth-button:hover :deep(.v-field) {
  background: linear-gradient(to right, #14a89a, #72b558) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 192, 176, 0.4) !important;
}

.stealth-select-wrapper:hover .stealth-label {
  color: #16c0b0 !important;
  transform: translateY(-1px);
}

.stealth-button :deep(.v-overlay__content) {
  border-radius: 12px !important;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
  border: 1px solid #16c0b0 !important;
  margin-top: 4px !important;
}

.stealth-button :deep(.v-list) {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%) !important;
  border-radius: 12px !important;
  padding: 8px !important;
}

.stealth-button :deep(.v-list-item) {
  border-radius: 8px !important;
  margin: 2px 0 !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  text-align: center !important;
}

.stealth-button :deep(.v-list-item:hover) {
  background: linear-gradient(to right, rgba(22, 192, 176, 0.1), rgba(132, 207, 106, 0.1)) !important;
  color: #16c0b0 !important;
  font-weight: 600 !important;
}

.stealth-button :deep(.v-list-item--active) {
  background: linear-gradient(to right, #16c0b0, #84cf6a) !important;
  color: black !important;
  font-weight: bold !important;
}

@media (max-width: 768px) {
  .stealth-select-wrapper {
    max-width: 100%;
  }
  
  .stealth-label {
    font-size: 12px !important;
  }
  
  .stealth-button :deep(.v-field) {
    height: 52px !important;
  }
  
  .stealth-button-content {
    height: 52px;
    font-size: 14px !important;
  }
  
  .stealth-icon {
    font-size: 18px !important;
  }
}
</style>