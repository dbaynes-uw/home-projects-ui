<template>
  <div class="edit-view-container">
    <!-- ✅ BREADCRUMB NAVIGATION -->
    <div class="breadcrumb-nav">
      <router-link :to="{ name: 'HealthDashboard' }" class="breadcrumb-link">
        <i class="fas fa-heartbeat"></i>
        Health Dashboard
      </router-link>
      <i class="fas fa-chevron-right breadcrumb-separator"></i>
      <router-link :to="{ name: 'OobList' }" class="breadcrumb-link">
        <i class="fas fa-exclamation-triangle"></i>
        OOBs
      </router-link>
      <i class="fas fa-chevron-right breadcrumb-separator"></i>
      <span class="breadcrumb-current">Edit OOB</span>
    </div>
    <!-- ✅ LOADING STATE -->
    <BaseCard v-if="isLoading" class="loading-card">
      <div class="loading-content">
        <div class="spinner"></div>
        <p>Loading OOB...</p>
      </div>
    </BaseCard>

    <!-- ✅ ERROR STATE -->
    <BaseCard v-else-if="error" class="error-card">
      <div class="error-content">
        <i class="fas fa-exclamation-circle"></i>
        <h3>Error Loading OOB</h3>
        <p>{{ error }}</p>
        <BaseButton variant="primary" @click="router.push({ name: 'OobList' })">
          Back to OOB List
        </BaseButton>
      </div>
    </BaseCard>

    <!-- ✅ EDIT FORM -->
    <BaseCard v-else-if="oob" class="edit-card">
      <template #header>
        <div class="header-content">
          <div class="title-section">
            <h2>
              <i class="fas fa-edit"></i>
              Edit OOB
            </h2>
            <div class="oob-id">ID: {{ oob.id }}</div>
          </div>
          
          <div class="header-actions">
            <BaseButton
              variant="secondary"
              icon="arrow-left"
              @click="router.push({ name: 'OobList' })"
            >
              Back to List
            </BaseButton>
            <BaseButton
              variant="danger"
              icon="trash"
              @click="handleDelete"
            >
              Delete OOB
            </BaseButton>
          </div>
        </div>
      </template>

      <!-- ✅ OOB FORM -->
      <OobForm
        :oob="oob"
        @save="handleSave"
        @cancel="handleCancel"
      />
    </BaseCard>

    <ConfirmDialogue ref="confirmDialogue" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useOobStore } from '@/stores/OobStore';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import OobForm from '@/components/oobs/OobForm.vue';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

// ✅ ROUTER & ROUTE
const router = useRouter();
const route = useRoute();

// ✅ PINIA STORE
const oobStore = useOobStore();

// ✅ REFS
const confirmDialogue = ref(null);

// ✅ COMPUTED
const oob = computed(() => oobStore.oob);
const isLoading = computed(() => oobStore.isLoading);
const error = computed(() => oobStore.error);

// ✅ METHODS
async function handleSave(oobData) {
  if (!confirmDialogue.value) {
    console.error('❌ confirmDialogue ref is null!');
    return;
  }

  const ok = await confirmDialogue.value.show({
    title: "Update OOB Record",
    message: "Are you sure you want to update this OOB record?",
    okButton: "Update",
    cancelButton: "Cancel"
  });

  if (!ok) {
    console.log('❌ Update cancelled by user');
    return;
  }

  try {
    await oobStore.updateOob(oobData);
    
    await confirmDialogue.value.show({
      title: "OOB Updated",
      message: "OOB record has been updated successfully.",
      okButton: "OK",
      cancelButton: null
    });
    
    router.push({ name: 'OobList' });
    
  } catch (error) {
    console.error('❌ Update error:', error);
    
    await confirmDialogue.value.show({
      title: "Update Failed",
      message: "Failed to update OOB record. Please try again.",
      okButton: "OK",
      cancelButton: null
    });
  }
}

function handleCancel() {
  router.push({ name: 'OobList' });
}

async function handleDelete() {
  if (!confirmDialogue.value) {
    console.error('❌ confirmDialogue ref is null!');
    return;
  }

  const ok = await confirmDialogue.value.show({
    title: "Delete OOB Record",
    message: `Are you sure you want to delete this OOB record from ${oob.value.oob_date}? This cannot be undone.`,
    okButton: "Delete Forever",
    cancelButton: "Cancel"
  });

  if (!ok) {
    console.log('❌ Delete cancelled by user');
    return;
  }

  try {
    await oobStore.deleteOob(oob.value.id);
    
    await confirmDialogue.value.show({
      title: "OOB Deleted",
      message: "OOB record has been deleted successfully.",
      okButton: "OK",
      cancelButton: null
    });
    
    router.push({ name: 'OobList' });
    
  } catch (error) {
    console.error('❌ Delete error:', error);
    
    await confirmDialogue.value.show({
      title: "Delete Failed",
      message: "Failed to delete OOB record. Please try again.",
      okButton: "OK",
      cancelButton: null
    });
  }
}

// ✅ LIFECYCLE
onMounted(async () => {
  const id = route.params.id;
  
  if (!id) {
    console.error('❌ No OOB ID provided');
    router.push({ name: 'OobList' });
    return;
  }

  try {
    await oobStore.fetchOob(id);
  } catch (error) {
    console.error('❌ Failed to load OOB:', error);
  }
});
</script>

<style scoped>
/* ✅ IMPORT SHARED STYLES */
@import '@/assets/styles/ui-components.css';
@import '@/assets/styles/list-view-components.css';

/* ========================================
   OOB EDIT - COMPONENT-SPECIFIC STYLES ONLY
   ======================================== */

.edit-view-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Edit Card Specific */
.edit-card {
  margin-top: 1.5rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title-section h2 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #2d3748;
  font-size: 1.75rem;
}

.title-section h2 i {
  color: #ef4444;
}

/* OOB-specific ID badge (red theme) */
.oob-id {
  padding: 0.5rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .edit-view-container {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .title-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .header-actions button {
    width: 100%;
  }
}
</style>