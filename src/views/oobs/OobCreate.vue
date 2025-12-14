<template>
  <div class="page-wrapper">
    <div class="oob-create-container">
      <!-- ✅ HEADER CARD -->
      <v-card class="mx-auto mt-5">
        <v-card-title class="pb-0">
          <h2>
            <i class="fas fa-exclamation-triangle"></i>
            Add OOB Record
          </h2>
        </v-card-title>
        
        <!-- ✅ NAVIGATION BUTTONS -->
        <v-card-text>
          <div class="navigation-flex">
            <v-btn
              variant="outlined"
              :to="{ name: 'OobList' }"
              prepend-icon="fas fa-list"
              class="nav-button"
            >
              View All OOBs
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- ✅ MAIN FORM CARD -->
      <v-card class="mt-4">
        <v-card-text>
          <!-- ✅ USE OobForm COMPONENT (like OobEdit does) -->
          <OobForm
            @save="handleSave"
            @cancel="handleCancel"
          />
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useOobStore } from '@/stores/OobStore';
import OobForm from '@/components/oobs/OobForm.vue';

// ✅ COMPOSITION API SETUP
const router = useRouter();
const oobStore = useOobStore();

// ✅ REACTIVE STATE
const isSubmitting = ref(false);

// ✅ METHODS
const handleSave = async (oobData) => {
  try {
    isSubmitting.value = true;
    
    console.log('📤 Creating OOB:', oobData);
    
    // ✅ SUBMIT TO PINIA STORE
    await oobStore.createOob(oobData);
    
    alert(`✅ OOB record created successfully!`);
    
    // ✅ NAVIGATE TO OOB LIST
    await router.push({ name: 'OobList' });
    
  } catch (error) {
    console.error('❌ Error creating OOB:', error);
    
    if (error.response?.status === 422) {
      alert(`❌ Validation Error: ${JSON.stringify(error.response.data)}`);
    } else if (error.response?.status === 500) {
      alert(`❌ Server Error: Check backend logs`);
    } else {
      alert(`❌ Error creating OOB: ${error.message}`);
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  console.log('❌ Create cancelled');
  router.push({ name: 'OobList' });
};
</script>

<style scoped>
/* ✅ MODERN CONSISTENT STYLES */
.page-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.oob-create-container {
  width: 100%;
  max-width: 800px;
  padding: 1rem;
  margin: 0 auto;
}

.navigation-flex {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-button {
  min-width: 200px !important;
  height: 40px !important;
}

/* ✅ RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .navigation-flex {
    flex-direction: column;
  }
  
  .nav-button {
    min-width: 100% !important;
  }
  
  .oob-create-container {
    padding: 0.5rem;
  }
}

/* ✅ ACCESSIBILITY */
.nav-button:focus {
  outline: 2px solid #ef4444;
  outline-offset: 2px;
}
</style>