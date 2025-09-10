<template>
  <div class="page-wrapper">
    <div class="product-vendor-container">
      <!-- ✅ HEADER CARD -->
      <v-card class="mx-auto mt-5">
        <v-card-title class="pb-0">
          <h2>Add Vendor/Products</h2>
        </v-card-title>
        
        <!-- ✅ NAVIGATION BUTTONS -->
        <v-card-text>
          <div class="navigation-flex">
            <v-btn
              variant="outlined"
              :to="{ name: 'ProductsByLocations' }"
              prepend-icon="mdi-map-marker"
              class="nav-button"
            >
              Product Location List
            </v-btn>
            
            <v-btn
              variant="outlined"
              :to="{ name: 'ProductsByVendors' }"
              prepend-icon="mdi-store"
              class="nav-button"
            >
              List By Vendor
            </v-btn>
            
            <v-btn
              variant="outlined"
              :to="{ name: 'ProductList' }"
              prepend-icon="mdi-package-variant"
              class="nav-button"
            >
              List by Product
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- ✅ FORM CARD -->
      <v-card class="mt-4">
        <v-card-title>
          <h3>Vendor & Product Details</h3>
        </v-card-title>
        
        <v-card-text>
          <v-form @submit.prevent="onSubmit" ref="formRef">
            <v-container class="form-container">
              
              <v-select
                v-model="vendor.location"
                label="Vendor Location"
                :items="vendorsLocationsGroup?.vendorsLocationsGroup || []"
                :rules="[requiredLocation]"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-map-marker-outline"
                class="mb-4 expanded-product-field"
                clearable
              />
                        
              <!-- ✅ VENDOR NAME - ADD EXPANDED CLASS -->
              <v-select
                v-model="vendor.vendor_name"
                label="Vendor Name"
                :items="vendorsGroup?.vendorsGroup || []"
                :rules="[requiredVendorName]"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-store-outline"
                class="mb-4 expanded-product-field"
                clearable
              />
                        
              <!-- ✅ OTHER VENDOR NAME - ADD EXPANDED CLASS -->
              <v-text-field
                v-if="vendor.vendor_name === 'Other'"
                v-model="vendor.other_vendor_name"
                label="Other Vendor Name"
                :rules="[requiredOtherVendorName]"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-store-plus"
                class="mb-4 expanded-product-field"
                clearable
              />
                        
              <!-- ✅ PRODUCT NAME - KEEP EXISTING CLASS -->
              <v-autocomplete
                v-model="vendor.product_name"
                v-model:search="productSearch"
                label="Vendor Product"
                :items="getFilteredProducts"
                :rules="[requiredProductName]"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-package-variant-closed"
                class="mb-4 expanded-product-field"
                clearable
                hide-no-data
                no-filter
                :menu-props="{ 
                  closeOnClick: true,
                  closeOnContentClick: true,
                  openOnClick: false
                }"
                @focus="handleProductFocus"
                @blur="handleProductBlur"
                :readonly="false"
                :placeholder="getProductPlaceholder"
              />
              
              <!-- ✅ OTHER PRODUCT NAME - ADD EXPANDED CLASS -->
              <v-text-field
                v-if="vendor.product_name === 'Other'"
                v-model="vendor.other_product_name"
                label="Other Product Name"
                :rules="[requiredOtherProductName]"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-package-variant-plus"
                class="mb-4 expanded-product-field"
                clearable
              />
              <!-- ✅ SUBMIT BUTTON -->
              <v-btn 
                type="submit" 
                color="primary"
                size="large"
                block
                class="mt-4"
                :loading="isSubmitting"
                :disabled="!isFormValid"
              >
                <v-icon start>mdi-content-save</v-icon>
                Submit Vendor & Product
              </v-btn>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { v4 as uuidv4 } from 'uuid';

const store = useStore();

// ✅ REACTIVE STATE
const formRef = ref(null);
const isSubmitting = ref(false);

// ✅ ADD PRODUCT SEARCH STATE
const productSearch = ref('');

// ✅ VENDOR DATA
const vendor = ref({
  vendor_name: null,
  location: '',
  created_by: '',
  other_vendor_name: '',
  product_name: '',
  other_product_name: '',
});

// ✅ VALIDATION STATE
const validationState = ref({
  isLocationValid: false,
  isVendorNameValid: false,
  isProductNameValid: false,
  isOtherProductNameValid: true, // Default true unless 'Other' is selected
  isOtherVendorNameValid: true,  // Default true unless 'Other' is selected
});

// ✅ ENHANCED PRODUCT FOCUS HANDLERS
const handleProductFocus = () => {
  console.log('🎯 Product field focused');
  // Don't clear search on focus, let user continue typing
};

const handleProductBlur = () => {
  console.log('🎯 Product field blurred');
  // Only clear search if no selection was made and search is incomplete
  if (!vendor.value.product_name && productSearch.value.length < 2) {
    productSearch.value = '';
  }
};

// ✅ COMPUTED PROPERTIES
const vendorsGroup = computed(() => store.state.vendors_group);
const vendorsLocationsGroup = computed(() => store.state.vendors_locations_group);
const vendorsProductsGroup = computed(() => store.state.vendors_products_group);

const user = computed(() => store.state.user?.resource_owner);
// ✅ ADD THIS MISSING COMPUTED PROPERTY
const getFilteredProducts = computed(() => {
  // Return empty array if search is less than 2 characters
  if (!productSearch.value || productSearch.value.length < 2) {
    return [];
  }
  
  const products = vendorsProductsGroup.value?.vendorsProductsGroup || [];
  const searchTerm = productSearch.value.toLowerCase();
  
  // Filter products that contain the search term
  const filtered = products.filter(product => 
    product.toLowerCase().includes(searchTerm)
  );
  
  console.log(`🔍 Search "${productSearch.value}" found ${filtered.length} products`);
  return filtered;
});

// ✅ NEW: DYNAMIC PLACEHOLDER TEXT
const getProductPlaceholder = computed(() => {
  if (!productSearch.value) {
    return 'Type 2+ characters to search products';
  } else if (productSearch.value.length < 2) {
    return `Type ${2 - productSearch.value.length} more character${2 - productSearch.value.length === 1 ? '' : 's'}`;
  } else {
    return `Searching for "${productSearch.value}"...`;
  }
});

const isFormValid = computed(() => {
  return validationState.value.isLocationValid &&
         validationState.value.isVendorNameValid &&
         validationState.value.isProductNameValid &&
         validationState.value.isOtherProductNameValid &&
         validationState.value.isOtherVendorNameValid;
});

// ✅ VALIDATION RULES
const requiredLocation = (value) => {
  const isValid = !!value;
  validationState.value.isLocationValid = isValid;
  return isValid || 'Please select a location';
};

const requiredVendorName = (value) => {
  const isValid = !!value;
  validationState.value.isVendorNameValid = isValid;
  return isValid || 'Please select a vendor name';
};

const requiredProductName = (value) => {
  const isValid = !!value;
  validationState.value.isProductNameValid = isValid;
  
  // Reset other product validation based on selection
  if (value === 'Other') {
    validationState.value.isOtherProductNameValid = !!vendor.value.other_product_name;
  } else {
    validationState.value.isOtherProductNameValid = true;
  }
  
  return isValid || 'Please select a product';
};

const requiredOtherProductName = (value) => {
  const isValid = !!value;
  validationState.value.isOtherProductNameValid = isValid;
  return isValid || 'Please enter the other product name';
};

const requiredOtherVendorName = (value) => {
  const isValid = !!value;
  validationState.value.isOtherVendorNameValid = isValid;
  return isValid || 'Please enter the other vendor name';
};
// ✅ RESET FORM - ENHANCED
const resetForm = () => {
  vendor.value = {
    vendor_name: null,
    location: '',
    created_by: user.value?.email || '',
    other_vendor_name: '',
    product_name: '',
    other_product_name: '',
  };
  
  // ✅ CLEAR SEARCH
  productSearch.value = '';
  
  validationState.value = {
    isLocationValid: false,
    isVendorNameValid: false,
    isProductNameValid: false,
    isOtherProductNameValid: true,
    isOtherVendorNameValid: true,
  };
  
  formRef.value?.resetValidation();
  
  console.log('🔄 Form reset - ready for new entry');
};// ✅ WATCHERS - ENHANCED
watch(() => productSearch.value, (newValue) => {
  console.log(`🔍 Product search: "${newValue}" (${newValue.length} chars)`);
  
  // Show helpful feedback
  if (newValue.length === 1) {
    console.log('💡 Type 2 more characters to search');
  } else if (newValue.length === 2) {
    console.log('💡 Type 1 more character to search');
  } else if (newValue.length >= 2) {
    const results = getFilteredProducts.value.length;
    console.log(`🎯 Found ${results} matching products`);
  }
});

watch(() => vendor.value.product_name, (newValue) => {
  console.log(`🎯 Product selection changed to: "${newValue}"`);
  
  if (newValue) {
    // ✅ KEEP THE SELECTION VISIBLE IN SEARCH FIELD
    productSearch.value = newValue;
    console.log(`✅ Selected product: ${newValue}`);
  } else {
    // ✅ ONLY CLEAR WHEN NO SELECTION
    productSearch.value = '';
  }
  
  // ✅ HANDLE "OTHER" VALIDATION
  if (newValue === 'Other') {
    validationState.value.isOtherProductNameValid = !!vendor.value.other_product_name;
  } else {
    validationState.value.isOtherProductNameValid = true;
    vendor.value.other_product_name = '';
  }
});

// ✅ WATCH FOR VENDOR NAME CHANGES
watch(() => vendor.value.vendor_name, (newValue) => {
  if (newValue === 'Other') {
    validationState.value.isOtherVendorNameValid = !!vendor.value.other_vendor_name;
  } else {
    validationState.value.isOtherVendorNameValid = true;
    vendor.value.other_vendor_name = ''; // Clear when not needed
  }
});

// ✅ WATCH FOR OTHER PRODUCT NAME CHANGES
watch(() => vendor.value.other_product_name, (newValue) => {
  if (vendor.value.product_name === 'Other') {
    validationState.value.isOtherProductNameValid = !!newValue;
  }
});

// ✅ WATCH FOR OTHER VENDOR NAME CHANGES
watch(() => vendor.value.other_vendor_name, (newValue) => {
  if (vendor.value.vendor_name === 'Other') {
    validationState.value.isOtherVendorNameValid = !!newValue;
  }
});

// ✅ SUBMIT FUNCTION - FIXED
const onSubmit = async () => {
  try {
    isSubmitting.value = true;
    
    // Validate form
    const { valid } = await formRef.value.validate();
    
    if (valid && isFormValid.value) {
      const vendorData = {
        ...vendor.value,
        id: uuidv4(),
        created_by: user.value?.email || '',
      };
      
      console.log('🚀 Submitting vendor data:', vendorData);
      
      // ✅ FIX: Don't rely on return value, use try/catch instead
      await store.dispatch('createVendor', vendorData);
      
      // ✅ If we get here, the dispatch succeeded
      const productName = vendor.value.product_name === 'Other' 
        ? vendor.value.other_product_name 
        : vendor.value.product_name;
        
      const vendorName = vendor.value.vendor_name === 'Other'
        ? vendor.value.other_vendor_name
        : vendor.value.vendor_name;
      
      // ✅ SUCCESS MESSAGE
      console.log(`✅ Product ${productName} was added for ${vendorName}`);
      resetForm();
      
      // ✅ SHOW SUCCESS FEEDBACK
      alert(`Product ${productName} was added for ${vendorName}`);
      
    } else {
      console.warn('⚠️ Form validation failed');
      alert('Please correct required fields and resubmit');
    }
    
  } catch (error) {
    console.error('❌ Error creating vendor:', error);
    
    // ✅ BETTER ERROR MESSAGE
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Unknown error occurred';
    alert(`Error adding vendor: ${errorMessage}`);
  } finally {
    isSubmitting.value = false;
  }
};

// ✅ LIFECYCLE - FETCH DATA ON MOUNT
onMounted(async () => {
  try {
    // Set user email
    vendor.value.created_by = user.value?.email || '';
    
    // Fetch data in parallel
    await Promise.all([
      store.dispatch('fetchVendorsGroup'),
      store.dispatch('fetchVendorsLocationsGroup'), 
      store.dispatch('fetchVendorsProductsGroup')
    ]);
    
    console.log('✅ All vendor data loaded successfully');
    
  } catch (error) {
    console.error('❌ Error loading vendor data:', error);
  }
});
</script>

<style scoped>
.page-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.product-vendor-container {
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
  min-width: 160px !important;
  height: 40px !important;
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}
/* ✅ ENHANCED PRODUCT SEARCH STYLING */
:deep(.v-autocomplete .v-field__input) {
  font-size: 16px !important; /* ✅ PREVENT iOS ZOOM */
}

/* ✅ SEARCH FEEDBACK STYLING */
:deep(.v-autocomplete .v-field__placeholder) {
  font-style: italic !important;
  color: #666 !important;
}
/* ✅ EXPANDED PRODUCT FIELD - VERTICAL CENTERING */
:deep(.expanded-product-field .v-field) {
  min-height: 60px !important;
  cursor: text !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.expanded-product-field .v-field__field) {
  padding: 16px 12px !important;
  min-height: 60px !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.expanded-product-field .v-field__input) {
  font-size: 16px !important;
  padding: 0 !important; /* ✅ REMOVE PADDING TO CENTER PROPERLY */
  min-height: auto !important; /* ✅ LET FLEXBOX HANDLE HEIGHT */
  line-height: 1.5 !important;
  display: flex !important;
  align-items: center !important;
}

/* ✅ CENTER THE INPUT ELEMENT ITSELF */
:deep(.expanded-product-field .v-field__input input) {
  padding: 0 !important;
  margin: 0 !important;
  line-height: 1.5 !important;
  height: auto !important;
  text-align: left !important;
}

/* ✅ CENTER THE PREPEND ICON */
:deep(.expanded-product-field .v-field__prepend-inner) {
  padding: 16px 8px 16px 12px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* ✅ CENTER THE APPEND ICONS (CLEAR & DROPDOWN ARROW) */
:deep(.expanded-product-field .v-field__append-inner) {
  padding: 16px 12px 16px 8px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* ✅ CENTER THE LABEL WHEN FLOATING */
:deep(.expanded-product-field .v-label) {
  display: flex !important;
  align-items: center !important;
}

/* ✅ CENTER PLACEHOLDER TEXT */
:deep(.expanded-product-field .v-field__input input::placeholder) {
  line-height: 1.5 !important;
  font-style: italic !important;
  color: #666 !important;
}

/* ✅ MOBILE: MAINTAIN CENTERING */
@media (max-width: 768px) {
  :deep(.expanded-product-field .v-field) {
    min-height: 70px !important;
    display: flex !important;
    align-items: center !important;
  }
  
  :deep(.expanded-product-field .v-field__field) {
    padding: 20px 16px !important;
    min-height: 70px !important;
    display: flex !important;
    align-items: center !important;
  }
  
  :deep(.expanded-product-field .v-field__input) {
    font-size: 16px !important;
    -webkit-appearance: none !important;
    padding: 0 !important;
    line-height: 1.5 !important;
  }
  
  :deep(.expanded-product-field .v-field__prepend-inner) {
    padding: 20px 12px 20px 16px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  :deep(.expanded-product-field .v-field__append-inner) {
    padding: 20px 16px 20px 12px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .product-vendor-container {
    padding: 0.5rem;
  }
  
  .navigation-flex {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .nav-button {
    width: 100% !important;
    max-width: 280px;
  }
  
  .form-container {
    padding: 0.5rem;
  }
    /* ✅ MOBILE SEARCH ENHANCEMENTS */
  :deep(.v-autocomplete .v-field__input) {
    font-size: 16px !important; /* ✅ PREVENT ZOOM ON MOBILE */
    -webkit-appearance: none !important;
  }
}

@media (max-width: 480px) {
  .navigation-flex {
    gap: 0.5rem;
  }
  
  .nav-button {
    height: 36px !important;
    font-size: 14px !important;
  }
}
</style>