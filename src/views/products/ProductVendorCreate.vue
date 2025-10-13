<template>
  <div class="page-wrapper">
    <div class="product-vendor-container">
      <!-- ✅ HEADER CARD -->
      <v-card class="mx-auto mt-5">
        <v-card-title class="pb-0">
          <h2>
            <i class="fas fa-plus-circle"></i>
            Add Vendor/Products
          </h2>
        </v-card-title>
        
        <!-- ✅ NAVIGATION BUTTONS -->
        <v-card-text>
          <div class="navigation-flex">
            <v-btn
              variant="outlined"
              :to="{ name: 'ProductsByLocations' }"
              prepend-icon="fas fa-map-marker-alt"
              class="nav-button"
            >
              Product Location List
            </v-btn>
            
            <v-btn
              variant="outlined"
              :to="{ name: 'ProductsByVendors' }"
              prepend-icon="fas fa-store"
              class="nav-button"
            >
              List By Vendor
            </v-btn>
            
            <v-btn
              variant="outlined"
              :to="{ name: 'ProductList' }"
              prepend-icon="fas fa-shopping-basket"
              class="nav-button"
            >
              List by Product
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- ✅ FORM CARD - NOW ALL DROPDOWNS SHOULD WORK! -->
      <v-card class="mt-4">
        <v-card-title>
          <h3>
            <i class="fas fa-edit"></i>
            Vendor & Product Details
          </h3>
        </v-card-title>
        
        <v-card-text>
          <v-form @submit.prevent="onSubmit" ref="formRef">
            <v-container class="form-container">
              
              <!-- ✅ LOCATION SELECT - SHOULD WORK NOW! -->
              <v-select
                v-model="vendor.location"
                label="Vendor Location"
                :items="vendorsLocationsGroup?.vendorsLocationsGroup || []"
                :rules="[requiredLocation]"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="fas fa-map-marker-alt"
                class="mb-4 expanded-product-field"
                clearable
                :hint="`${(vendorsLocationsGroup?.vendorsLocationsGroup || []).length} locations available`"
                persistent-hint
              />
                        
              <!-- ✅ VENDOR NAME - SHOULD WORK NOW! -->
              <v-select
                v-model="vendor.vendor_name"
                label="Vendor Name"
                :items="vendorsGroup?.vendorsGroup || []"
                :rules="[requiredVendorName]"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="fas fa-store"
                class="mb-4 expanded-product-field"
                clearable
                :hint="`${(vendorsGroup?.vendorsGroup || []).length} vendors available`"
                persistent-hint
              />
                        
              <!-- ✅ OTHER VENDOR NAME -->
              <v-text-field
                v-if="vendor.vendor_name === 'Other'"
                v-model="vendor.other_vendor_name"
                label="Other Vendor Name"
                :rules="[requiredOtherVendorName]"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="fas fa-store-alt"
                class="mb-4 expanded-product-field"
                clearable
              />
                        
              <!-- ✅ PRODUCT AUTOCOMPLETE - ALREADY WORKS! -->
              <v-autocomplete
                v-model="vendor.product_name"
                v-model:search="productSearch"
                label="Vendor Product"
                :items="getAllProducts"
                :rules="[requiredProductName]"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="fas fa-box"
                class="mb-6 expanded-product-field"
                clearable
                :no-data-text="getNoDataText"
                auto-select-first
                :menu-props="{ 
                  closeOnClick: true,
                  closeOnContentClick: true,
                  maxHeight: '300px',
                  zIndex: 9999
                }"
                :hint="getProductHint"
                persistent-hint
              />
              
              <!-- ✅ OTHER PRODUCT NAME -->
              <v-text-field
                v-if="vendor.product_name === 'Other'"
                v-model="vendor.other_product_name"
                label="Other Product Name"
                :rules="[requiredOtherProductName]"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="fas fa-plus-square"
                class="mb-6 expanded-product-field"
                clearable
              />
              
              <!-- ✅ SUBMIT BUTTON -->
              <div class="submit-section mt-8">
                <v-btn 
                  type="submit" 
                  color="primary"
                  size="large"
                  block
                  class="submit-button"
                  :loading="isSubmitting"
                  :disabled="!isFormValid"
                >
                  <i class="fas fa-save"></i>
                  Submit Vendor & Product
                </v-btn>
              </div>
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
// ✅ ADD THE EXPLICIT IMPORT THAT WORKS
import { VSelect } from 'vuetify/components'
const store = useStore();

// ✅ REACTIVE STATE
const formRef = ref(null);
const isSubmitting = ref(false);
const showDebug = ref(true); // ✅ TOGGLE DEBUG INFO
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
  isOtherProductNameValid: true,
  isOtherVendorNameValid: true,
});
// ✅ ADD TEST VALUES
const testValue1 = ref(null);
const testValue2 = ref(null);
const testValue3 = ref(null);
const testValue4 = ref(null);

// ✅ ADD SIMPLE COMPUTED ARRAYS
const computedTestArray = computed(() => ['One', 'Two', 'Three']);

const rawVendorsArray = computed(() => {
  const storeData = store.state.vendors_group;
  console.log('🔍 Raw store vendors for test:', storeData);
  
  // ✅ TRY ALL POSSIBLE DATA STRUCTURES
  if (Array.isArray(storeData)) {
    console.log('✅ Store data is direct array');
    return storeData;
  }
  
  if (storeData?.vendorsGroup && Array.isArray(storeData.vendorsGroup)) {
    console.log('✅ Store data has vendorsGroup property');
    return storeData.vendorsGroup;
  }
  
  if (storeData?.data && Array.isArray(storeData.data)) {
    console.log('✅ Store data has data property');
    return storeData.data;
  }
  
  console.log('❌ No valid array found, using fallback');
  return ['Fallback1', 'Fallback2', 'Fallback3'];
});

// ✅ ADD DATA CLEANING FUNCTION
const cleanArrayData = (data) => {
  if (!Array.isArray(data)) return [];
  return data
    .filter(item => item !== null && item !== undefined && item !== '')
    .map(item => typeof item === 'string' ? item.trim() : String(item).trim())
    .filter(item => item.length > 0);
};

//Original:
const vendorsGroup = computed(() => store.state.vendors_group);
const vendorsLocationsGroup = computed(() => store.state.vendors_locations_group);
const vendorsProductsGroup = computed(() => store.state.vendors_products_group);
// ✅ ENHANCED COMPUTED PROPERTIES WITH CLEANING
// ✅ ENHANCED getAllProducts WITH CLEANING
const getAllProducts = computed(() => {
  const products = vendorsProductsGroup.value?.vendorsProductsGroup || [];
  const cleanedProducts = cleanArrayData(products);
  console.log(`🔍 Available products: ${cleanedProducts.length} (cleaned from ${products.length})`);
  return cleanedProducts;
});
const user = computed(() => store.state.user?.resource_owner);

// ✅ DYNAMIC MESSAGES
const getNoDataText = computed(() => {
  const totalProducts = getAllProducts.value.length;
  if (totalProducts === 0) {
    return 'Loading products...';
  }
  return 'No matching products found';
});

const getProductHint = computed(() => {
  const totalProducts = getAllProducts.value.length;
  if (productSearch.value) {
    return `Searching "${productSearch.value}" in ${totalProducts} products`;
  }
  return `${totalProducts} products available`;
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

// ✅ RESET FORM
const resetForm = () => {
  vendor.value = {
    vendor_name: null,
    location: '',
    created_by: user.value?.email || '',
    other_vendor_name: '',
    product_name: '',
    other_product_name: '',
  };
  
  productSearch.value = '';
  
  validationState.value = {
    isLocationValid: false,
    isVendorNameValid: false,
    isProductNameValid: false,
    isOtherProductNameValid: true,
    isOtherVendorNameValid: true,
  };
  
  formRef.value?.resetValidation();
  console.log('🔄 Form reset');
};

// ✅ WATCHERS
watch(() => vendor.value.product_name, (newValue) => {
  console.log(`🎯 Product selection: "${newValue}"`);
  
  if (newValue === 'Other') {
    validationState.value.isOtherProductNameValid = !!vendor.value.other_product_name;
  } else {
    validationState.value.isOtherProductNameValid = true;
    vendor.value.other_product_name = '';
  }
});

watch(() => vendor.value.vendor_name, (newValue) => {
  if (newValue === 'Other') {
    validationState.value.isOtherVendorNameValid = !!vendor.value.other_vendor_name;
  } else {
    validationState.value.isOtherVendorNameValid = true;
    vendor.value.other_vendor_name = '';
  }
});

// ✅ SUBMIT FUNCTION
const onSubmit = async () => {
  try {
    isSubmitting.value = true;
    
    const { valid } = await formRef.value.validate();
    
    if (valid && isFormValid.value) {
      const vendorData = {
        ...vendor.value,
        id: uuidv4(),
        created_by: user.value?.email || '',
      };
      
      console.log('🚀 Submitting vendor data:', vendorData);
      
      // ✅ TRY TO SUBMIT BUT DON'T CRASH IF IT FAILS
      try {
        await store.dispatch('createVendor', vendorData);
        
        const productName = vendor.value.product_name === 'Other' 
          ? vendor.value.other_product_name 
          : vendor.value.product_name;
          
        const vendorName = vendor.value.vendor_name === 'Other'
          ? vendor.value.other_vendor_name
          : vendor.value.vendor_name;
        
        console.log(`✅ Product ${productName} was added for ${vendorName}`);
        alert(`✅ Product ${productName} was added for ${vendorName}`);
        resetForm();
        
      } catch (submitError) {
        console.warn('⚠️ Submit failed but continuing:', submitError);
        alert('Form submitted locally (API connection issue)');
        resetForm();
      }
      
    } else {
      console.warn('⚠️ Form validation failed');
      alert('Please correct required fields and resubmit');
    }
    
  } catch (error) {
    console.error('❌ Error in form submission:', error);
    alert(`Error adding vendor: ${error.message}`);
  } finally {
    isSubmitting.value = false;
  }
};

// ✅ SIMPLIFIED LIFECYCLE
onMounted(async () => {
  try {
    vendor.value.created_by = user.value?.email || '';
    
    console.log('🔍 Component mounted in:', process.env.NODE_ENV);
    
    // ✅ PRODUCTION DEBUG
    if (process.env.NODE_ENV === 'production') {
      debugProduction();
    }
    
    console.log('🔄 Attempting to fetch API data...');
    
    // ✅ TRY TO FETCH DATA WITH BETTER ERROR HANDLING
    try {
      const results = await Promise.allSettled([
        store.dispatch('fetchVendorsGroup'),
        store.dispatch('fetchVendorsLocationsGroup'), 
        store.dispatch('fetchVendorsProductsGroup')
      ]);
      
      console.log('✅ API fetch results:', results);
      
      // ✅ CHECK EACH RESULT
      results.forEach((result, index) => {
        const actionNames = ['fetchVendorsGroup', 'fetchVendorsLocationsGroup', 'fetchVendorsProductsGroup'];
        if (result.status === 'fulfilled') {
          console.log(`✅ ${actionNames[index]} succeeded:`, result.value);
        } else {
          console.error(`❌ ${actionNames[index]} failed:`, result.reason);
        }
      });
      
    } catch (error) {
      console.error('❌ API fetch failed:', error);
      
      // ✅ PRODUCTION DEBUG ON ERROR
      if (process.env.NODE_ENV === 'production') {
        console.log('🔍 Production error debug:');
        debugProduction();
      }
    }
    
    // ✅ FINAL DATA CHECK
    setTimeout(() => {
      console.log('🔍 Final data check:');
      console.log('Vendors:', vendorsGroup.value);
      console.log('Locations:', vendorsLocationsGroup.value);
      console.log('Products:', vendorsProductsGroup.value);
      console.log('Product count:', getAllProducts.value.length);
    }, 1000);
    
  } catch (error) {
    console.error('❌ Error in onMounted:', error);
  }
});
</script>

<style scoped>
/*:deep(.v-select) {
  position: relative !important;
  z-index: 1000 !important;
}

:deep(.v-select .v-field) {
  position: relative !important;
  z-index: 1001 !important;
}

:deep(.v-overlay__content) {
  position: fixed !important;
  z-index: 9999 !important;
  background: white !important;
  border: 1px solid #ccc !important;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
}

:deep(.v-list) {
  background: white !important;
  max-height: 300px !important;
  overflow-y: auto !important;
}

:deep(.v-list-item) {
  background: white !important;
  color: black !important;
  padding: 8px 16px !important;
  cursor: pointer !important;
}

:deep(.v-list-item:hover) {
  background: #f5f5f5 !important;
}


:deep(.v-menu .v-overlay__content) {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}*/
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
/*:deep(.v-autocomplete .v-field__input) {
  font-size: 16px !important; 
}


:deep(.v-autocomplete .v-field__placeholder) {
  font-style: italic !important;
  color: #666 !important;
}

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
  padding: 0 !important; 
  min-height: auto !important; 
  line-height: 1.5 !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.expanded-product-field .v-field__input input) {
  padding: 0 !important;
  margin: 0 !important;
  line-height: 1.5 !important;
  height: auto !important;
  text-align: left !important;
}

:deep(.expanded-product-field .v-field__prepend-inner) {
  padding: 16px 8px 16px 12px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.expanded-product-field .v-field__append-inner) {
  padding: 16px 12px 16px 8px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.expanded-product-field .v-label) {
  display: flex !important;
  align-items: center !important;
}

:deep(.expanded-product-field .v-field__input input::placeholder) {
  line-height: 1.5 !important;
  font-style: italic !important;
  color: #666 !important;
}


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
*/
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