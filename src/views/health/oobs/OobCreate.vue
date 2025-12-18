<template>
  <div class="oob-create-wrapper">
    <!-- ✅ PAGE HEADER WITH BREADCRUMB -->
    <div class="page-wrapper gradient-oob">
      <div class="page-container">
        <div class="page-header">
          <h1>
            <router-link :to="{ name: 'HealthDashboard' }" class="breadcrumb-link">
              <i class="fas fa-pills"></i>
              Health Dashboard
            </router-link>
            <i class="fas fa-chevron-right breadcrumb-separator"></i>
            <router-link :to="{ name: 'OobList' }" class="breadcrumb-link">
              <i class="fas fa-exclamation-triangle icon-oob"></i>
              OOBs
            </router-link>
            <i class="fas fa-chevron-right breadcrumb-separator"></i>
            <span>
              <i class="fas fa-plus"></i>
              Create New OOB
            </span>
          </h1>
        </div>

        <!-- ✅ FORM CARD -->
        <div class="form-card">
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">
                <i class="fas fa-exclamation-triangle icon-oob"></i>
                Add New OOB Record
              </h2>
              <p class="card-subtitle">
                Record a new Out of Bounds incident
              </p>
            </div>

            <div class="card-body">
              <OobForm
                @save="handleSave"
                @cancel="handleCancel"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <ConfirmDialogue ref="confirmDialogue" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useOobStore } from '@/stores/health/OobStore';
import OobForm from '@/components/health/oobs/OobForm.vue';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

// ✅ ROUTER & STORE
const router = useRouter();
const oobStore = useOobStore();

// ✅ REFS
const confirmDialogue = ref(null);

// ✅ METHODS
async function handleSave(oobData) {
  try {
    await oobStore.createOob(oobData);
    
    // Show success message
    if (confirmDialogue.value) {
      await confirmDialogue.value.show({
        title: "OOB Created",
        message: "OOB record has been created successfully.",
        okButton: "OK",
        cancelButton: null
      });
    }
    
    // Navigate back to list
    router.push({ name: 'OobList' });
  } catch (error) {
    console.error('❌ Create error:', error);
    
    // Show error message
    if (confirmDialogue.value) {
      await confirmDialogue.value.show({
        title: "Create Failed",
        message: "Failed to create OOB record. Please try again.",
        okButton: "OK",
        cancelButton: null
      });
    }
  }
}

async function handleCancel() {
  // Confirm navigation away
  if (confirmDialogue.value) {
    const ok = await confirmDialogue.value.show({
      title: "Cancel Creation",
      message: "Are you sure you want to cancel? Any unsaved changes will be lost.",
      okButton: "Yes, Cancel",
      cancelButton: "Keep Editing"
    });
    
    if (ok) {
      router.push({ name: 'OobList' });
    }
  } else {
    router.push({ name: 'OobList' });
  }
}
</script>

<style scoped>
/* ✅ IMPORT SHARED HEALTH STYLES */
@import '@/assets/styles/health/health-shared.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

.oob-create-wrapper {
  width: 100%;
  min-height: 100vh;
}

/* Page wrapper spacing */
.page-wrapper {
  padding-bottom: 120px; /* Space for footer */
}

/* Breadcrumb navigation */
.breadcrumb-link {
  color: white;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.3s ease;
}

.breadcrumb-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.breadcrumb-separator {
  font-size: 1.5rem;
  opacity: 0.6;
  margin: 0 0.5rem;
}

/* Form card container */
.form-card {
  max-width: 900px;
  margin: 0 auto;
}

.form-card .card {
  border-left: 4px solid #ef4444; /* OOB red accent */
}

/* Card subtitle */
.card-subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .form-card {
    max-width: 100%;
  }
  
  .breadcrumb-separator {
    font-size: 1.25rem;
    margin: 0 0.25rem;
  }
}
</style>