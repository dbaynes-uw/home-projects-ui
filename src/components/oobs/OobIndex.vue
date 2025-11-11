<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>

  <div class="med-index-container">
    <div class="index-header">
      <h3 class="results-count">
        <i class="fas fa-counter"></i>
        Total: {{ meds.length }}
      </h3>
      
      <div class="view-controls">
        <button 
          @click="toggleDensity" 
          class="density-btn"
          :title="isCompact ? 'Expand Table' : 'Compact Table'"
        >
          <i class="mdi" :class="isCompact ? 'fas fa-table-large' : 'fas fa-table'"></i>
          <span>{{ isCompact ? 'Expand' : 'Compact' }}</span>
        </button>
      </div>
    </div>

    <!-- ✅ PROPERLY STRUCTURED V-TABLE -->
    <v-table :density="isCompact ? 'compact' : 'default'" class="med-table">
      <thead>
        <tr>
          <!-- ✅ SORTABLE HEADERS -->
          <th 
            class="sortable-header" 
            @click="sortList('date_of_occurrence')"
            :class="{ 'sorted': sortBy === 'date_of_occurrence' }"
          >
            <div class="header-content">
              <i class="fas fa-calendar-clock"></i>
              <span>Date of Occurrence</span>
              <i class="mdi sort-icon" :class="getSortIcon('date_of_occurrence')"></i>
            </div>
          </th>
          
          <th 
            class="sortable-header" 
            @click="sortList('duration')"
            :class="{ 'sorted': sortBy === 'duration' }"
          >
            <div class="header-content">
              <i class="fas fa-timer-outline"></i>
              <span>Duration</span>
              <i class="mdi sort-icon" :class="getSortIcon('duration')"></i>
            </div>
          </th>
          
          <th 
            class="sortable-header" 
            @click="sortList('interval_days')"
            :class="{ 'sorted': sortBy === 'interval_days' }"
          >
            <div class="header-content">
              <i class="fas fa-calendar-range"></i>
              <span>Days Since Last</span>
              <i class="mdi sort-icon" :class="getSortIcon('interval_days')"></i>
            </div>
          </th>
          
          <!-- ✅ NON-SORTABLE HEADERS -->
          <th class="non-sortable-header">
            <div class="header-content">
              <i class="fas fa-clock-time-four-outline"></i>
              <span>Hours</span>
            </div>
          </th>
          
          <th class="non-sortable-header">
            <div class="header-content">
              <i class="fas fa-clock-outline"></i>
              <span>Minutes</span>
            </div>
          </th>
          
          <th class="non-sortable-header">
            <div class="header-content">
              <i class="fas fa-note-text-outline"></i>
              <span>Circumstances</span>
            </div>
          </th>
          
          <th class="non-sortable-header actions-header">
            <div class="header-content">
              <i class="fas fa-cog"></i>
              <span>Actions</span>
            </div>
          </th>
        </tr>
      </thead>
        
      <tbody>
        <tr 
          v-for="(med, medIndex) in sortedMeds" 
          :key="med.id || medIndex"
          class="med-row"
          :class="{ 'even-row': medIndex % 2 === 0 }"
        >
          <td class="date-cell">
            <div class="cell-content">
              <i class="fas fa-calendar-clock cell-icon"></i>
              <span>{{ formatStandardDateTime(med.date_of_occurrence) }}</span>
            </div>
          </td>
          
          <td class="duration-cell">
            <div class="cell-content">
              <i class="fas fa-timer-outline cell-icon"></i>
              <span>{{ capitalizeFirst(med.duration) }}</span>
            </div>
          </td>
          
          <td class="interval-cell">
            <span class="interval-badge">{{ med.interval_days }} days</span>
          </td>
          
          <td class="interval-cell">
            <span class="interval-badge secondary">{{ med.interval_hours }} hours</span>
          </td>
          
          <td class="interval-cell">
            <span class="interval-badge tertiary">{{ med.interval_minutes }} minutes</span>
          </td>
          
          <td class="circumstances-cell">
            <div v-if="med.circumstances" class="circumstances-content">
              <textarea 
                v-model="med.circumstances" 
                class="circumstances-textarea"
                rows="2"
                :readonly="!isEditing[med.id]"
                @blur="saveCircumstances(med)"
              />
              <button 
                @click="toggleEdit(med.id)"
                class="edit-circumstances-btn"
                :title="isEditing[med.id] ? 'Save' : 'Edit'"
              >
                <i class="mdi" :class="isEditing[med.id] ? 'fas fa-content-save' : 'fas fa-pencil'"></i>
              </button>
            </div>
            <span v-else class="no-circumstances">
              <i class="fas fa-minus"></i>
              No notes
            </span>
          </td>
          
          <td class="actions-cell">
            <div class="action-buttons">
              <!-- ✅ EDIT BUTTON -->
              <router-link
                :to="{ name: 'OobEdit', params: { id: `${med.id}` } }"
                class="action-btn edit-btn"
                title="Edit Med"
              >
                <i class="fas fa-pencil"></i>
              </router-link>
              
              <!-- ✅ VIEW DETAILS BUTTON -->
              <router-link
                :to="{ name: 'OobDetails', params: { id: `${med.id}` } }"
                class="action-btn view-btn"
                title="View Details"
              >
                <i class="fas fa-eye"></i>
              </router-link>
              
              <!-- ✅ DELETE BUTTON -->
              <button
                @click="deleteMed(med)"
                class="action-btn delete-btn"
                title="Delete Med"
              >
                <i class="fas fa-delete"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
    
    <!-- ✅ EMPTY STATE -->
    <div v-if="meds.length === 0" class="empty-state">
      <i class="fas fa-medication-outline"></i>
      <p>No meds to display</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useStore } from 'vuex';
//import { useRouter } from 'vue-router'; // ✅ UNCOMMENT THIS
// eslint-disable-next-line no-unused-vars
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";

// ✅ COMPOSITION API SETUP
const store = useStore();
//const router = useRouter(); // ✅ UNCOMMENT THIS

// ✅ PROPS
const props = defineProps({
  meds: {
    type: Array,
    default: () => []
  }
});

// ✅ REFS (FIX THE ORDER AND REMOVE DUPLICATE)
const confirmDialogue = ref(null);
const isCompact = ref(true);
const sortBy = ref('date_of_occurrence');
const sortDirection = ref('desc');
const isEditing = reactive({});

// ✅ COMPUTED PROPERTIES
const sortedMeds = computed(() => {
  if (!props.meds || props.meds.length === 0) return [];
  
  const sorted = [...props.meds].sort((a, b) => {
    let aVal = a[sortBy.value];
    let bVal = b[sortBy.value];
    
    // Handle different data types
    if (sortBy.value.includes('interval')) {
      aVal = parseInt(aVal) || 0;
      bVal = parseInt(bVal) || 0;
    } else if (sortBy.value.includes('date')) {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else {
      aVal = String(aVal || '').toLowerCase();
      bVal = String(bVal || '').toLowerCase();
    }
    
    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
  
  return sorted;
});

// ✅ METHODS
const capitalizeFirst = (str) => {
  if (!str) return '';
  if (typeof str !== 'string') return String(str);
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const toggleDensity = () => {
  isCompact.value = !isCompact.value;
};

const sortList = (column) => {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    sortDirection.value = 'desc';
  }
  
  console.log(`🔄 Sorting by ${column} (${sortDirection.value})`);
};

const getSortIcon = (column) => {
  if (sortBy.value !== column) return 'fas fa-sort';
  return sortDirection.value === 'asc' ? 'fas fa-sort-ascending' : 'fas fa-sort-descending';
};

const toggleEdit = (medId) => {
  isEditing[medId] = !isEditing[medId];
};

const saveCircumstances = (med) => {
  if (isEditing[med.id]) {
    console.log('💾 Auto-saving circumstances for med:', med.id);
    // store.dispatch('updateMed', med);
  }
};

const deleteMed = async (med) => {
  try {
    const ok = await confirmDialogue.value?.show({
      title: "Delete Med Record",
      message: `Are you sure you want to delete the med record from ${formatStandardDateTime(med.date_of_occurrence)}? This action cannot be undone.`,
      okButton: "Delete Forever",
      cancelButton: "Keep Record"
    });

    if (!ok) {
      console.log('❌ Delete cancelled by user');
      return;
    }

    console.log('🗑️ Deleting med:', med.id);
    
    const result = await store.dispatch("deleteMed", med);
    
    if (result && result.success !== false) {
      await confirmDialogue.value?.show({
        title: "Med Deleted",
        message: `Med record from ${formatStandardDateTime(med.date_of_occurrence)} has been permanently deleted.`,
        okButton: "OK",
        cancelButton: null
      });
    } else {
      throw new Error(result?.message || 'Delete failed');
    }
    
  } catch (error) {
    console.error('❌ Delete failed:', error);
    
    await confirmDialogue.value?.show({
      title: "Delete Failed",
      message: `Failed to delete med record. ${error.message || 'Please try again.'}`,
      okButton: "OK",
      cancelButton: null
    });
  }
};

const formatStandardDateTime = (value) => {
  if (!value) return 'No date';
  return DateFormatService.formatStandardDateTimejs(value);
};
</script>
<style scoped>
.med-index-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.index-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
}

.results-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2c3e50;
  margin: 0;
  font-size: 1.2rem;
}

.results-count i {
  color: #41b883;
}

.view-controls {
  display: flex;
  gap: 1rem;
}

.density-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.density-btn:hover {
  background: #41b883;
  color: white;
  border-color: #41b883;
}

/* ✅ TABLE STYLING */
.med-table {
  width: 100%;
  border-collapse: collapse;
}

/* ✅ HEADER STYLING */
.sortable-header {
  background: linear-gradient(135deg, #41b883 0%, #369870 100%);
  color: white;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
}

.sortable-header:hover {
  background: linear-gradient(135deg, #369870 0%, #2e8a5e 100%);
}

.sortable-header.sorted {
  background: linear-gradient(135deg, #2e8a5e 0%, #25774f 100%);
}

.non-sortable-header {
  background: linear-gradient(135deg, #6c757d 0%, #5a6169 100%);
  color: white;
  font-weight: 600;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  justify-content: flex-start;
}

.actions-header .header-content {
  justify-content: center;
}

.sort-icon {
  margin-left: auto;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.sortable-header:hover .sort-icon {
  opacity: 1;
}

/* ✅ ROW STYLING */
.med-row {
  transition: all 0.3s ease;
  border-bottom: 1px solid #f1f3f4;
}

.med-row:hover {
  background: rgba(65, 184, 131, 0.05);
}

.even-row {
  background: rgba(248, 249, 250, 0.5);
}

/* ✅ CELL STYLING */
.cell-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
}

.cell-icon {
  color: #41b883;
  font-size: 1.1rem;
}

.date-cell {
  min-width: 180px;
}

.duration-cell {
  min-width: 120px;
}

.interval-cell {
  text-align: center;
  padding: 0.75rem;
}

.interval-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #41b883;
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.interval-badge.secondary {
  background: #667eea;
}

.interval-badge.tertiary {
  background: #f093fb;
}

/* ✅ CIRCUMSTANCES STYLING */
.circumstances-cell {
  max-width: 300px;
  padding: 0.5rem;
}

.circumstances-content {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.circumstances-textarea {
  flex: 1;
  min-width: 200px;
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  font-size: 0.9rem;
}

.circumstances-textarea:focus {
  outline: none;
  border-color: #41b883;
  box-shadow: 0 0 0 2px rgba(65, 184, 131, 0.2);
}

.circumstances-textarea[readonly] {
  background: #f8f9fa;
  border-color: #e9ecef;
}

.edit-circumstances-btn {
  background: none;
  border: none;
  color: #41b883;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.edit-circumstances-btn:hover {
  background: rgba(65, 184, 131, 0.1);
}

.no-circumstances {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #999;
  font-style: italic;
  padding: 0.75rem;
}

/* ✅ ACTION BUTTONS */
.actions-cell {
  text-align: center;
  padding: 0.5rem;
  vertical-align: middle;
}

.action-buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-btn i {
  font-size: 1.2rem;
}

.edit-btn {
  color: #41b883;
  border: 1px solid #41b883;
}

.edit-btn:hover {
  background: #41b883;
  color: white;
}

.view-btn {
  color: #667eea;
  border: 1px solid #667eea;
}

.view-btn:hover {
  background: #667eea;
  color: white;
}

.delete-btn {
  color: #e74c3c;
  border: 1px solid #e74c3c;
}

.delete-btn:hover {
  background: #e74c3c;
  color: white;
}

/* ✅ EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.empty-state i {
  font-size: 4rem;
  color: #ccc;
  margin-bottom: 1rem;
}

/* ✅ RESPONSIVE */
@media (max-width: 1200px) {
  .circumstances-cell {
    max-width: 200px;
  }
  
  .circumstances-textarea {
    min-width: 150px;
  }
}

@media (max-width: 768px) {
  .index-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-content {
    font-size: 0.8rem;
    padding: 0.75rem 0.5rem;
  }
  
  .header-content span {
    display: none;
  }
  
  .action-buttons {
    flex-direction: row;
    gap: 0.25rem;
    flex-wrap: wrap;
  }
  
  .action-btn {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 480px) {
  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>