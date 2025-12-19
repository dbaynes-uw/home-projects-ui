<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/vendors/VendorEdit.vue -->
<template>
  <div class="vendor-edit-wrapper">
    <!-- ✅ CONFIRMATION DIALOG -->
    <ConfirmDialogue ref="confirmDialogue" />
    
    <!-- ✅ HEADER CARD -->
    <v-card class="mx-auto mt-5">
      <v-card-title class="pb-0">
        <div class="title-section">
          <h2>
            <i class="fas fa-edit"></i>
            Vendor Maintenance
          </h2>
          <p v-if="statusMessage" class="status-message">
            <u>{{ statusMessage }}</u>
          </p>
        </div>
      </v-card-title>
      
      <!-- ✅ NAVIGATION BUTTONS -->
      <v-card-text>
        <div class="navigation-flex">
          <v-btn
            variant="outlined"
            :to="{ name: 'ProductsByLocations' }"
            prepend-icon="fas fa-arrow-left"
            class="nav-button"
          >
            Back to Shopping
          </v-btn>
          
          <v-btn
            variant="outlined"
            color="error"
            @click="handleDeleteVendor"
            prepend-icon="fas fa-trash"
            class="nav-button"
            :disabled="!vendor.id"
          >
            Delete Vendor
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- ✅ EDIT FORM CARD -->
    <v-card class="mt-4">
      <v-card-title>
        <h3>
          <i class="fas fa-store"></i>
          Edit Vendor Details
        </h3>
      </v-card-title>
      
      <v-card-text>
        <v-form @submit.prevent="handleUpdateVendor" ref="formRef">
          <v-container>
            <!-- ✅ LOCATION (READONLY) -->
            <v-text-field
              label="Location"
              v-model="vendor.location"
              readonly
              variant="outlined"
              class="mb-4"
              :rules="[requiredLocation]"
            >
              <template v-slot:prepend-inner>
                <v-icon class="field-icon">mdi-map-marker</v-icon>
              </template>
            </v-text-field>

            <!-- ✅ VENDOR NAME -->
            <v-text-field
              label="Vendor Name"
              v-model="vendor.vendor_name"
              variant="outlined"
              class="mb-4"
              :rules="[requiredVendorName]"
              :error="!isVendorNameValid && hasAttemptedSubmit"
            >
              <template v-slot:prepend-inner>
                <v-icon class="field-icon">mdi-store</v-icon>
              </template>
            </v-text-field>

            <!-- ✅ SUBMIT BUTTON -->
            <v-btn 
              type="submit"
              color="primary"
              size="large"
              block
              class="mt-4"
              :loading="isUpdating"
              :disabled="!isFormValid && hasAttemptedSubmit"
            >
              <i class="fas fa-save"></i>
              Update Vendor
            </v-btn>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onErrorCaptured } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

// ✅ COMPOSITION API SETUP
const store = useStore();
const router = useRouter();
const route = useRoute();
const confirmDialogue = ref(null);

// ✅ ERROR HANDLER
onErrorCaptured((error, instance, info) => {
  console.error('❌ VendorEdit error captured:', error);
  console.error('❌ Error info:', info);
  return false;
});

// ✅ REACTIVE STATE
const isLoading = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);
const hasAttemptedSubmit = ref(false);
const isFormValid = ref(false);
const isVendorNameValid = ref(false);
const statusMessage = ref('');

// ✅ VENDOR DATA
const vendor = ref({
  id: '',
  vendor_name: '',
  location: '',
  created_by: '',
  updated_by: ''
});

// ✅ COMPUTED PROPERTIES
const user = computed(() => store.state.user?.resource_owner);

// ✅ VALIDATION RULES
const requiredLocation = (value) => {
  return value && value.trim() ? true : 'Location is required';
};

const requiredVendorName = (value) => {
  if (value && value.trim()) {
    isVendorNameValid.value = true;
    return true;
  } else {
    isVendorNameValid.value = false;
    return 'Vendor Name is required';
  }
};

// ✅ FORM VALIDATION WATCHER
watch([isVendorNameValid], () => {
  isFormValid.value = isVendorNameValid.value;
});

// ✅ WATCH VENDOR NAME FOR VALIDATION
watch(() => vendor.value.vendor_name, (newValue) => {
  if (hasAttemptedSubmit.value) {
    requiredVendorName(newValue);
  }
});

// ✅ WATCH USER AND SET CREATED_BY
watch(user, (newUser) => {
  if (newUser?.email) {
    vendor.value.created_by = newUser.email;
  }
}, { immediate: true });

// ✅ METHODS
const loadVendor = async () => {
  try {
    isLoading.value = true;
    
    const vendorId = route.params.id;
    
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }
    
    // ✅ USE STORE ACTION INSTEAD OF DIRECT AXIOS
    const result = await store.dispatch('fetchVendor', vendorId);
        
    if (result && typeof result === 'object') {
      vendor.value = {
        ...result,
        created_by: result.created_by || user.value?.email || '',
        updated_by: user.value?.email || ''
      };
      
    } else {
      console.error('❌ Invalid vendor result:', result);
      throw new Error('Vendor data is invalid');
    }
    
  } catch (error) {
    console.error('❌ Error loading vendor:', error);
    
    if (error.response?.status === 404) {
      alert('❌ Vendor not found');
      router.push({ name: 'ProductsByLocations' });
    } else {
      // ✅ REMOVED THE UNDEFINED `result` REFERENCE
      console.error('❌ General error loading vendor:', error);
      alert(`❌ Error loading vendor: ${error.message}`);
    }
  } finally {
    isLoading.value = false;
  }
};

const checkValidations = () => {
  
  const vendorNameValid = requiredVendorName(vendor.value.vendor_name);
    
  isFormValid.value = vendorNameValid === true;
  return isFormValid.value;
};

const handleUpdateVendor = async () => {
  try {
    isUpdating.value = true;
    hasAttemptedSubmit.value = true;
        
    // ✅ VALIDATE FORM
    const isValid = checkValidations();
    
    if (!isValid) {
      console.warn('❌ Form validation failed');
      alert('Please correct required fields and resubmit');
      return;
    }
    
    // ✅ SHOW CONFIRMATION DIALOG
    const ok = await confirmDialogue.value.show({
      title: 'Update Vendor',
      message: `Are you sure you want to update "${vendor.value.vendor_name}"?`,
      okButton: 'Update',
    });
    
    if (!ok) {
      return;
    }
    
    // ✅ PREPARE UPDATE DATA
    const updateData = {
      id: vendor.value.id,
      vendor_name: vendor.value.vendor_name.trim(),
      location: vendor.value.location.trim(),
      updated_by: user.value?.email || '',
      updated_at_client: new Date().toISOString()
    };
        
    // ✅ VALIDATE REQUIRED FIELDS
    if (!updateData.vendor_name) {
      throw new Error('Vendor name is required');
    }
    
    if (!updateData.location) {
      throw new Error('Location is required');
    }
    
    // ✅ UPDATE VIA STORE
    const result = await store.dispatch('updateVendor', updateData);
    
    if (result !== false) {
      statusMessage.value = `Vendor has been updated for ${updateData.vendor_name}`;
      
      // ✅ REFRESH RELATED DATA
      await Promise.all([
        store.dispatch('fetchVendors'),
        store.dispatch('fetchVendorsProducts'),
        store.dispatch('fetchVendorsLocationsGroup')
      ]);
      
      // ✅ OPTIONAL: Navigate back after delay
      setTimeout(() => {
        router.push({ name: 'ProductsByLocations' });
      }, 2000);
      
    } else {
      console.error('❌ Store returned false');
      alert('❌ Error updating vendor - please try again');
    }
    
  } catch (error) {
    console.error('❌ Error in handleUpdateVendor:', error);
    
    if (error.response?.status === 422) {
      alert(`❌ Validation Error: ${JSON.stringify(error.response.data)}`);
    } else if (error.response?.status === 500) {
      alert(`❌ Server Error: Check backend logs`);
    } else {
      alert(`❌ Error updating vendor: ${error.message}`);
    }
  } finally {
    isUpdating.value = false;
  }
};

const handleDeleteVendor = async () => {
  try {
    isDeleting.value = true;
    
    if (!vendor.value.id) {
      throw new Error('Vendor ID is required for deletion');
    }
    
    // ✅ SHOW CONFIRMATION DIALOG
    const ok = await confirmDialogue.value.show({
      title: 'Delete Vendor from List?',
      message: `Are you sure you want to delete "${vendor.value.vendor_name}"? All of its products will also be deleted and it cannot be undone.`,
      okButton: 'Delete',
    });
    
    if (!ok) {
      return;
    }    
    // ✅ DELETE VIA STORE
    const result = await store.dispatch('deleteVendor', vendor.value);
    
    if (result !== false) {
      statusMessage.value = `Vendor and all its products were deleted for ${vendor.value.vendor_name}! Redirecting...`;
      
      // ✅ REFRESH RELATED DATA
      await Promise.all([
        store.dispatch('fetchVendors'),
        store.dispatch('fetchVendorsProducts'),
        store.dispatch('fetchVendorsLocationsGroup'),
        store.dispatch('fetchProducts')
      ]);
      
      // ✅ NAVIGATE BACK
      setTimeout(() => {
        router.push({ name: 'ProductsByLocations' });
      }, 2000);
      
    } else {
      console.error('❌ Delete failed');
      alert('❌ Error deleting vendor - please try again');
    }
    
  } catch (error) {
    console.error('❌ Error deleting vendor:', error);
    
    if (error.response?.status === 404) {
      alert('❌ Vendor not found - it may have already been deleted');
    } else if (error.response?.status === 500) {
      alert('❌ Server error - please try again later');
    } else {
      alert(`❌ Error deleting vendor: ${error.message}`);
    }
  } finally {
    isDeleting.value = false;
  }
};

// ✅ LIFECYCLE
onMounted(async () => {
  await loadVendor();
});
</script>

<style scoped>
/* ✅ MODERN CONSISTENT STYLES */
.vendor-edit-wrapper {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.title-section {
  width: 100%;
}

.status-message {
  font-weight: bold;
  color: #2e7d32;
  margin: 0.5rem 0;
  font-size: 1rem;
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

.field-icon {
  color: #1976d2 !important;
  top: -0.2rem;
}

/* ✅ RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .navigation-flex {
    flex-direction: column;
  }
  
  .nav-button {
    min-width: 100% !important;
  }
  
  .vendor-edit-wrapper {
    padding: 0.5rem;
  }
}

/* ✅ ACCESSIBILITY */
.nav-button:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

/* ✅ SAFE AREA PADDING */
.vendor-edit-wrapper {
  padding-bottom: 80px;
}

@media (max-width: 768px) {
  .vendor-edit-wrapper {
    padding-bottom: 120px;
  }
}
</style>