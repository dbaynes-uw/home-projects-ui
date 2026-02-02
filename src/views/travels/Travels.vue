<!-- filepath: src/views/travels/Travels.vue -->
<template>
  <div class="list-view-container">
    <!-- ✅ BREADCRUMB -->
    <div class="breadcrumb-nav">
      <i class="fas fa-chevron-right breadcrumb-separator"></i>
      <span class="breadcrumb-current">Travels</span>
    </div>

    <!-- ✅ HEADER -->
    <BaseCard class="header-card">
      <template #header>
        <div class="header-content">
          <div class="title-section">
            <h2>
              <i class="fas fa-plane animated-icon"></i>
              Travels
            </h2>
            <p v-if="statusMessage" class="status-message">{{ statusMessage }}</p>
          </div>
          
          <div class="controls-section">
            <BaseButton
              variant="success"
              icon="plus"
              @click="openAddDialog"
            >
              Add Trip
            </BaseButton>
            
            <!-- ✅ VIEW TOGGLE -->
            <div class="view-toggle">
              <button
                v-for="view in views"
                :key="view.value"
                :class="['view-btn', { active: currentView === view.value }]"
                @click="currentView = view.value"
              >
                <i :class="`fas fa-${view.icon}`"></i>
                <span>{{ view.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- ✅ SEARCH -->
      <div class="search-container">
        <v-text-field
          v-model="searchQuery"
          clearable
          clear-icon="fas fa-close"
          @click:clear="clearSearch"
          type="text"
          class="search-input"
          placeholder="Search travels..."
          autocomplete="off"
        >
          <template v-slot:prepend-inner>
            <i class="fas fa-search"></i>
          </template>
        </v-text-field>
      </div>

      <!-- ✅ STATS -->
      <div class="stats-row">
        <div class="stat-card stat-card-success">
          <div class="stat-icon">
            <i class="fas fa-map-marked-alt"></i>
          </div>
          <div class="stat-value">{{ totalTravels }}</div>
          <div class="stat-label">Total Travels</div>
        </div>
        <div class="stat-card stat-card-info">
          <div class="stat-icon">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div class="stat-value">{{ upcomingTravels }}</div>
          <div class="stat-label">Upcoming</div>
        </div>
        <div class="stat-card stat-card-warning">
          <div class="stat-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-value">{{ currentTravels }}</div>
          <div class="stat-label">Current</div>
        </div>
        <div class="stat-card stat-card-secondary">
          <div class="stat-icon">
            <i class="fas fa-history"></i>
          </div>
          <div class="stat-value">{{ pastTravels }}</div>
          <div class="stat-label">Completed</div>
        </div>
      </div>
    </BaseCard>

    <!-- ✅ LOADING -->
    <BaseCard v-if="isLoading" class="loading-card">
      <div class="loading-content">
        <div class="spinner"></div>
        <p>Loading travels...</p>
      </div>
    </BaseCard>

    <!-- ✅ CARDS VIEW -->
    <div v-else-if="currentView === 'cards'" class="cards-view">
      <div v-if="filteredTravels.length === 0" class="empty-state">
        <i class="fas fa-map fa-3x"></i>
        <h3>{{ searchQuery ? 'No travels match your search' : 'No travels yet' }}</h3>
        <p>{{ searchQuery ? 'Try adjusting your search terms' : 'Start planning your next adventure!' }}</p>
        <BaseButton v-if="!searchQuery" variant="primary" icon="plus" @click="openAddDialog">
          Add Your First Trip
        </BaseButton>
      </div>
      
      <div v-else class="travel-cards-grid">
        <TravelCard
          v-for="travel in filteredTravels"
          :key="travel.id"
          :travel="travel"
          @edit="openEditDialog"
          @delete="handleDelete"
        />
      </div>
    </div>

    <!-- ✅ TABLE VIEW -->
    <BaseCard v-else-if="currentView === 'table'" class="table-card">
      <TravelIndex 
        :travels="filteredTravels"
        @edit="openEditDialog"
        @delete="handleDelete"
      />
    </BaseCard>

    <!-- ✅ DIALOG -->
    <BaseModal
      v-model="showDialog"
      :title="selectedTravel?.id ? 'Edit Travel' : 'Add Travel'"
      size="large"
      @close="closeDialog"
    >
      <TravelForm
        :travel="selectedTravel"
        @save="handleSave"
        @cancel="closeDialog"
      />
    </BaseModal>

    <ConfirmDialogue ref="confirmDialogue" />
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTravelStore } from '@/stores/travel/TravelStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import TravelCard from '@/components/travels/TravelCard.vue'
import TravelIndex from '@/components/travels/TravelIndex.vue'
import TravelForm from '@/components/travels/TravelForm.vue'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'

// ✅ COMPOSABLES
const travelStore = useTravelStore()

// ✅ REACTIVE STATE
const searchQuery = ref('')
const currentView = ref('cards')
const showDialog = ref(false)
const selectedTravel = ref(null)
const confirmDialogue = ref(null)

// ✅ VIEW OPTIONS
const views = ref([
  { value: 'cards', label: 'Cards', icon: 'th-large' },
  { value: 'table', label: 'Table', icon: 'table' }
])

// ✅ COMPUTED PROPERTIES
const travels = computed(() => travelStore.allTravels)
const isLoading = computed(() => travelStore.isLoading)
const error = computed(() => travelStore.error)

const statusMessage = computed(() => {
  if (isLoading.value) return 'Loading travels...'
  if (error.value) return `Error: ${error.value}`
  return ''
})

// ✅ FILTERED DATA
const filteredTravels = computed(() => {
  if (!searchQuery.value) return travels.value
  
  return travels.value.filter(travel => {
    const query = searchQuery.value.toLowerCase()
    return (
      travel.title?.toLowerCase().includes(query) ||
      travel.description?.toLowerCase().includes(query) ||
      travel.destination?.toLowerCase().includes(query) ||
      travel.location?.toLowerCase().includes(query)
    )
  })
})

// ✅ TRAVEL STATISTICS
const totalTravels = computed(() => travels.value.length)

const upcomingTravels = computed(() => {
  const now = new Date()
  return travels.value.filter(travel => {
    const startDate = new Date(travel.start_date)
    return startDate > now
  }).length
})

const currentTravels = computed(() => {
  const now = new Date()
  return travels.value.filter(travel => {
    const startDate = new Date(travel.start_date)
    const endDate = new Date(travel.end_date)
    return startDate <= now && endDate >= now
  }).length
})

const pastTravels = computed(() => {
  const now = new Date()
  return travels.value.filter(travel => {
    const endDate = new Date(travel.end_date)
    return endDate < now
  }).length
})

// ✅ LIFECYCLE
onMounted(async () => {
  await travelStore.fetchTravels()
})

// ✅ DIALOG METHODS
const openAddDialog = () => {
  selectedTravel.value = null
  showDialog.value = true
}

const openEditDialog = (travel) => {
  selectedTravel.value = { ...travel }
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  selectedTravel.value = null
}

// ✅ CRUD OPERATIONS
const handleSave = async (travelData) => {
  try {
    if (selectedTravel.value?.id) {
      await travelStore.updateTravel(selectedTravel.value.id, travelData)
    } else {
      await travelStore.createTravel(travelData)
    }
    closeDialog()
  } catch (error) {
    console.error('Error saving travel:', error)
  }
}

const handleDelete = async (travel) => {
  const confirmed = await confirmDialogue.value.show(
    'Delete Travel',
    `Are you sure you want to delete "${travel.title}"? This action cannot be undone.`
  )
  
  if (confirmed) {
    try {
      await travelStore.deleteTravel(travel.id)
    } catch (error) {
      console.error('Error deleting travel:', error)
    }
  }
}

// ✅ SEARCH METHODS
const clearSearch = () => {
  searchQuery.value = ''
}
</script>
<style scoped>
/* ✅ LAYOUT */
.list-view-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

/* ✅ BREADCRUMB */
.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-primary);
  text-decoration: none;
  transition: opacity 0.2s;
}

.breadcrumb-link:hover {
  opacity: 0.8;
}

.breadcrumb-separator {
  font-size: 0.75rem;
}

.breadcrumb-current {
  font-weight: 500;
}

/* ✅ HEADER */
.header-card {
  margin-bottom: 1.5rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.title-section h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 0.5rem 0;
  color: var(--color-text-primary);
}

.animated-icon {
  color: var(--color-primary);
  transition: transform 0.3s ease;
}

.animated-icon:hover {
  transform: scale(1.1);
}

.status-message {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.controls-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* ✅ VIEW TOGGLE */
.view-toggle {
  display: flex;
  background: var(--color-surface-variant);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.view-btn:hover {
  background: var(--color-surface-hover);
}

.view-btn.active {
  background: var(--color-primary);
  color: white;
}

/* ✅ SEARCH */
.search-container {
  margin: 1rem 0;
}

.search-input {
  max-width: 400px;
}

/* ✅ STATS */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.2rem;
}

.stat-card-success {
  background: rgba(34, 197, 94, 0.1);
}

.stat-card-success .stat-icon {
  background: rgba(34, 197, 94, 0.2);
  color: rgb(34, 197, 94);
}

.stat-card-info {
  background: rgba(59, 130, 246, 0.1);
}

.stat-card-info .stat-icon {
  background: rgba(59, 130, 246, 0.2);
  color: rgb(59, 130, 246);
}

.stat-card-warning {
  background: rgba(245, 158, 11, 0.1);
}

.stat-card-warning .stat-icon {
  background: rgba(245, 158, 11, 0.2);
  color: rgb(245, 158, 11);
}

.stat-card-secondary {
  background: rgba(107, 114, 128, 0.1);
}

.stat-card-secondary .stat-icon {
  background: rgba(107, 114, 128, 0.2);
  color: rgb(107, 114, 128);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}

/* ✅ LOADING */
.loading-card {
  margin: 2rem 0;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ✅ EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-secondary);
}

.empty-state i {
  margin-bottom: 1rem;
  opacity: 0.6;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-text-primary);
}

.empty-state p {
  margin: 0 0 1.5rem 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* ✅ CARDS VIEW */
.cards-view {
  margin: 1rem 0;
}

.travel-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

/* ✅ TABLE VIEW */
.table-card {
  margin: 1rem 0;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .controls-section {
    justify-content: space-between;
  }

  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .travel-cards-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
}
</style>
