<template>
  <div class="page-wrapper">
    <div class="product-vendor-container">
      <!-- ✅ HEADER CARD (NO VUETIFY) -->
      <div class="card mt-5">
        <div class="card-header">
          <h2 class="card-title">
            <i class="fas fa-plus-circle"></i>
            Add Vendor/Products
          </h2>
        </div>
        
        <!-- ✅ NAVIGATION BUTTONS -->
        <div class="card-body">
          <div class="navigation-grid">
            <router-link 
              :to="{ name: 'ProductsByLocations' }"
              class="btn btn-outlined"
            >
              <i class="fas fa-map-marker-alt"></i>
              Product Location List
            </router-link>
            
            <router-link 
              :to="{ name: 'ProductsByVendors' }"
              class="btn btn-outlined"
            >
              <i class="fas fa-store"></i>
              List By Vendor
            </router-link>
            
            <router-link 
              :to="{ name: 'ProductList' }"
              class="btn btn-outlined"
            >
              <i class="fas fa-shopping-basket"></i>
              List by Product
            </router-link>
          </div>
        </div>
      </div>

      <!-- ✅ FORM CARD (NO VUETIFY) -->
      <div class="card mt-4">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fas fa-edit"></i>
            Vendor & Product Details
          </h3>
        </div>
        
        <div class="card-body">
          <form @submit.prevent="onSubmit" ref="formRef" class="form-container">
            
            <!-- ✅ LOCATION SELECT (CUSTOM) -->
            <div class="form-group">
              <label class="form-label required">
                <i class="fas fa-map-marker-alt"></i>
                Vendor Location
              </label>
              <div class="select-wrapper">
                <select
                  v-model="vendor.location"
                  @change="validateLocation"
                  class="form-select"
                  :class="{ 'is-invalid': errors.location }"
                  required
                >
                  <option value="" disabled>Select a location...</option>
                  <option 
                    v-for="location in availableLocations" 
                    :key="location"
                    :value="location"
                  >
                    {{ location }}
                  </option>
                </select>
                <i class="fas fa-chevron-down select-icon"></i>
              </div>
              <small v-if="errors.location" class="form-error">
                <i class="fas fa-exclamation-circle"></i>
                {{ errors.location }}
              </small>
              <small v-else class="form-hint">
                {{ availableLocations.length }} locations available
              </small>
            </div>
            
            <!-- ✅ VENDOR NAME SELECT (CUSTOM) -->
            <div class="form-group">
              <label class="form-label required">
                <i class="fas fa-store"></i>
                Vendor Name
              </label>
              <div class="select-wrapper">
                <select
                  v-model="vendor.vendor_name"
                  @change="validateVendorName"
                  class="form-select"
                  :class="{ 'is-invalid': errors.vendor_name }"
                  required
                >
                  <option value="" disabled>Select a vendor...</option>
                  <option 
                    v-for="vendorName in availableVendors" 
                    :key="vendorName"
                    :value="vendorName"
                  >
                    {{ vendorName }}
                  </option>
                </select>
                <i class="fas fa-chevron-down select-icon"></i>
              </div>
              <small v-if="errors.vendor_name" class="form-error">
                <i class="fas fa-exclamation-circle"></i>
                {{ errors.vendor_name }}
              </small>
              <small v-else class="form-hint">
                {{ availableVendors.length }} vendors available
              </small>
            </div>
            
            <!-- ✅ OTHER VENDOR NAME (if "Other" selected) -->
            <div v-if="vendor.vendor_name === 'Other'" class="form-group">
              <label class="form-label required">
                <i class="fas fa-store-alt"></i>
                Other Vendor Name
              </label>
              <input
                v-model="vendor.other_vendor_name"
                @input="validateOtherVendorName"
                type="text"
                class="form-input"
                :class="{ 'is-invalid': errors.other_vendor_name }"
                placeholder="Enter vendor name..."
                required
              />
              <small v-if="errors.other_vendor_name" class="form-error">
                <i class="fas fa-exclamation-circle"></i>
                {{ errors.other_vendor_name }}
              </small>
            </div>
            
            <!-- ✅ PRODUCT AUTOCOMPLETE (CUSTOM) -->
            <div class="form-group">
              <label class="form-label required">
                <i class="fas fa-box"></i>
                Vendor Product
              </label>
              <div class="autocomplete-wrapper">
                <div class="input-wrapper">
                  <i class="fas fa-search input-icon"></i>
                  <input
                    v-model="productSearch"
                    @input="handleProductSearch"
                    @focus="showProductDropdown = true"
                    @blur="handleProductBlur"
                    @keydown.enter.prevent="selectFirstProduct"
                    @keydown.down.prevent="navigateDropdown(1)"
                    @keydown.up.prevent="navigateDropdown(-1)"
                    type="text"
                    class="form-input has-icon"
                    :class="{ 'is-invalid': errors.product_name }"
                    placeholder="Search for a product..."
                    required
                  />
                  <button
                    v-if="productSearch"
                    type="button"
                    class="input-clear-btn"
                    @click="clearProductSearch"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                
                <!-- Custom Dropdown -->
                <div 
                  v-if="showProductDropdown && filteredProductOptions.length > 0" 
                  class="autocomplete-dropdown"
                >
                  <div
                    v-for="(product, index) in filteredProductOptions"
                    :key="index"
                    :class="['autocomplete-item', { 'active': index === selectedIndex }]"
                    @mousedown.prevent="selectProduct(product)"
                    @mouseenter="selectedIndex = index"
                  >
                    {{ product }}
                  </div>
                </div>
                
                <small v-if="errors.product_name" class="form-error">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ errors.product_name }}
                </small>
                <small v-else class="form-hint">
                  {{ getProductHint }}
                </small>
              </div>
            </div>
            
            <!-- ✅ OTHER PRODUCT NAME (if "Other" selected) -->
            <div v-if="vendor.product_name === 'Other'" class="form-group">
              <label class="form-label required">
                <i class="fas fa-plus-square"></i>
                Other Product Name
              </label>
              <input
                v-model="vendor.other_product_name"
                @input="validateOtherProductName"
                type="text"
                class="form-input"
                :class="{ 'is-invalid': errors.other_product_name }"
                placeholder="Enter product name..."
                required
              />
              <small v-if="errors.other_product_name" class="form-error">
                <i class="fas fa-exclamation-circle"></i>
                {{ errors.other_product_name }}
              </small>
            </div>
            
            <!-- ✅ SUBMIT BUTTON -->
            <div class="submit-section">
              <button 
                type="submit" 
                class="btn btn-primary btn-large btn-block"
                :class="{ 'btn-loading': isSubmitting }"
                :disabled="!isFormValid || isSubmitting"
              >
                <template v-if="!isSubmitting">
                  <i class="fas fa-save"></i>
                  Submit Vendor & Product
                </template>
              </button>
            </div>
          </form>
        </div>
      </div>
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
const productSearch = ref('');
const showProductDropdown = ref(false);
const selectedIndex = ref(0);

// ✅ VENDOR DATA
const vendor = ref({
  vendor_name: '',
  location: '',
  created_by: '',
  other_vendor_name: '',
  product_name: '',
  other_product_name: '',
});

// ✅ VALIDATION ERRORS
const errors = ref({
  location: '',
  vendor_name: '',
  product_name: '',
  other_vendor_name: '',
  other_product_name: '',
});

// ✅ COMPUTED PROPERTIES
const vendorsGroup = computed(() => store.state.vendors_group);
const vendorsLocationsGroup = computed(() => store.state.vendors_locations_group);
const vendorsProductsGroup = computed(() => store.state.vendors_products_group);
const user = computed(() => store.state.user?.resource_owner);

// Clean array data
const cleanArrayData = (data) => {
  if (!Array.isArray(data)) return [];
  return data
    .filter(item => item !== null && item !== undefined && item !== '')
    .map(item => typeof item === 'string' ? item.trim() : String(item).trim())
    .filter(item => item.length > 0);
};

// Available options
const availableLocations = computed(() => {
  const locations = vendorsLocationsGroup.value?.vendorsLocationsGroup || [];
  return cleanArrayData(locations).sort();
});

const availableVendors = computed(() => {
  const vendors = vendorsGroup.value?.vendorsGroup || [];
  return cleanArrayData(vendors).sort();
});

const getAllProducts = computed(() => {
  const products = vendorsProductsGroup.value?.vendorsProductsGroup || [];
  return cleanArrayData(products).sort();
});

// Filter products based on search
const filteredProductOptions = computed(() => {
  if (!productSearch.value) {
    return getAllProducts.value;
  }
  const search = productSearch.value.toLowerCase();
  return getAllProducts.value.filter(name => 
    name.toLowerCase().includes(search)
  );
});

const getProductHint = computed(() => {
  const totalProducts = getAllProducts.value.length;
  if (!productSearch.value) {
    return `${totalProducts} products available. Type to search or select "Other" to create new`;
  }
  if (filteredProductOptions.value.length === 0) {
    return 'No matching products found. Try selecting "Other" to create new product';
  }
  return `${filteredProductOptions.value.length} products found`;
});

const isFormValid = computed(() => {
  return vendor.value.location &&
         vendor.value.vendor_name &&
         vendor.value.product_name &&
         (vendor.value.vendor_name !== 'Other' || vendor.value.other_vendor_name) &&
         (vendor.value.product_name !== 'Other' || vendor.value.other_product_name);
});

// ✅ VALIDATION METHODS
const validateLocation = () => {
  if (!vendor.value.location) {
    errors.value.location = 'Please select a location';
    return false;
  }
  errors.value.location = '';
  return true;
};

const validateVendorName = () => {
  if (!vendor.value.vendor_name) {
    errors.value.vendor_name = 'Please select a vendor name';
    return false;
  }
  errors.value.vendor_name = '';
  return true;
};

const validateProductName = () => {
  if (!vendor.value.product_name) {
    errors.value.product_name = 'Please select a product';
    return false;
  }
  errors.value.product_name = '';
  return true;
};

const validateOtherVendorName = () => {
  if (vendor.value.vendor_name === 'Other' && !vendor.value.other_vendor_name) {
    errors.value.other_vendor_name = 'Please enter the other vendor name';
    return false;
  }
  errors.value.other_vendor_name = '';
  return true;
};

const validateOtherProductName = () => {
  if (vendor.value.product_name === 'Other' && !vendor.value.other_product_name) {
    errors.value.other_product_name = 'Please enter the other product name';
    return false;
  }
  errors.value.other_product_name = '';
  return true;
};

// ✅ PRODUCT AUTOCOMPLETE METHODS
const handleProductSearch = () => {
  showProductDropdown.value = true;
  selectedIndex.value = 0;
};

const handleProductBlur = () => {
  setTimeout(() => {
    showProductDropdown.value = false;
  }, 200);
};

const clearProductSearch = () => {
  productSearch.value = '';
  vendor.value.product_name = '';
  showProductDropdown.value = false;
  errors.value.product_name = '';
};

const selectProduct = (productName) => {
  vendor.value.product_name = productName;
  productSearch.value = productName;
  showProductDropdown.value = false;
  validateProductName();
};

const selectFirstProduct = () => {
  if (filteredProductOptions.value.length > 0) {
    selectProduct(filteredProductOptions.value[selectedIndex.value]);
  }
};

const navigateDropdown = (direction) => {
  if (filteredProductOptions.value.length === 0) return;
  
  selectedIndex.value += direction;
  
  if (selectedIndex.value < 0) {
    selectedIndex.value = filteredProductOptions.value.length - 1;
  } else if (selectedIndex.value >= filteredProductOptions.value.length) {
    selectedIndex.value = 0;
  }
};

// ✅ RESET FORM
const resetForm = () => {
  vendor.value = {
    vendor_name: '',
    location: '',
    created_by: user.value?.email || '',
    other_vendor_name: '',
    product_name: '',
    other_product_name: '',
  };
  
  productSearch.value = '';
  showProductDropdown.value = false;
  selectedIndex.value = 0;
  
  errors.value = {
    location: '',
    vendor_name: '',
    product_name: '',
    other_vendor_name: '',
    other_product_name: '',
  };
};

// ✅ WATCHERS
watch(() => vendor.value.product_name, (newValue) => {
  if (newValue !== 'Other') {
    vendor.value.other_product_name = '';
    errors.value.other_product_name = '';
  }
});

watch(() => vendor.value.vendor_name, (newValue) => {
  if (newValue !== 'Other') {
    vendor.value.other_vendor_name = '';
    errors.value.other_vendor_name = '';
  }
});

// ✅ SUBMIT FUNCTION
const onSubmit = async () => {
  try {
    isSubmitting.value = true;
    
    // Validate all fields
    const isValid = validateLocation() &&
                   validateVendorName() &&
                   validateProductName() &&
                   validateOtherVendorName() &&
                   validateOtherProductName();
    
    if (!isValid) {
      alert('Please correct the errors and try again');
      return;
    }
    
    const vendorData = {
      ...vendor.value,
      id: uuidv4(),
      created_by: user.value?.email || '',
    };
    
    await store.dispatch('createVendor', vendorData);
    
    const productName = vendor.value.product_name === 'Other' 
      ? vendor.value.other_product_name 
      : vendor.value.product_name;
      
    const vendorName = vendor.value.vendor_name === 'Other'
      ? vendor.value.other_vendor_name
      : vendor.value.vendor_name;
    
    alert(`✅ Product "${productName}" was added for "${vendorName}" at "${vendor.value.location}"`);
    
    // Refresh data
    await Promise.all([
      store.dispatch('fetchVendorsGroup'),
      store.dispatch('fetchVendorsLocationsGroup'),
      store.dispatch('fetchVendorsProductsGroup'),
      store.dispatch('fetchProducts'),
      store.dispatch('fetchVendorsProducts')
    ]);
    
    resetForm();
    
  } catch (error) {
    console.error('❌ Error in form submission:', error);
    alert(`❌ Error adding vendor: ${error.message}`);
  } finally {
    isSubmitting.value = false;
  }
};

// ✅ LIFECYCLE
onMounted(async () => {
  try {
    vendor.value.created_by = user.value?.email || '';
    
    const results = await Promise.allSettled([
      store.dispatch('fetchVendorsGroup'),
      store.dispatch('fetchVendorsLocationsGroup'), 
      store.dispatch('fetchVendorsProductsGroup')
    ]);
    
    results.forEach((result, index) => {
      const actionNames = ['fetchVendorsGroup', 'fetchVendorsLocationsGroup', 'fetchVendorsProductsGroup'];
      if (result.status !== 'fulfilled') {
        console.error(`❌ ${actionNames[index]} failed:`, result.reason);
      }
    });
    
  } catch (error) {
    console.error('❌ Error in onMounted:', error);
  }
});
</script>

<style scoped>
/* ✅ IMPORT SHARED STYLES */
@import '@/assets/styles/ui-components.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

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

.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem 0;
}

/* Custom Select */
.select-wrapper {
  position: relative;
}

.form-select {
  width: 100%;
  padding: 0.875rem 2.5rem 0.875rem 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.form-select:hover {
  border-color: #667eea;
}

.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-select.is-invalid {
  border-color: #ef4444;
}

.select-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  pointer-events: none;
  transition: transform 0.3s;
}

.form-select:focus + .select-icon {
  transform: translateY(-50%) rotate(180deg);
}

/* Autocomplete Dropdown Navigation */
.autocomplete-item.active {
  background: rgba(102, 126, 234, 0.2);
}

/* Required Label */
.form-label.required::after {
  content: ' *';
  color: #ef4444;
}

/* Submit Section */
.submit-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f0f0f0;
}

/* Utility Classes */
.mt-4 { margin-top: 1rem; }
.mt-5 { margin-top: 1.5rem; }

/* Responsive */
@media (max-width: 768px) {
  .product-vendor-container {
    padding: 0.5rem;
  }
  
  .navigation-grid {
    grid-template-columns: 1fr;
  }
  
  .form-container {
    padding: 0.5rem 0;
  }
  
  /* Prevent zoom on mobile inputs */
  .form-input,
  .form-select {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .navigation-grid .btn {
    font-size: 14px;
    padding: 0.625rem 1rem;
  }
}
</style>