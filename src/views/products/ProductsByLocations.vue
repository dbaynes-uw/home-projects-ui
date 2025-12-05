<template>
  <div class="products-location-container">
    <ConfirmDialogue ref="confirmDialogue" />
    <!-- ✅ CUSTOM PRODUCT DIALOG (NO VUETIFY) -->
    <div v-if="showProductDialog" class="custom-dialog-overlay" @click.self="closeProductDialog">
      <div class="custom-dialog">
        <!-- Dialog Header -->
        <div class="dialog-header">
          <div class="dialog-header-content">
            <i class="fas fa-plus-circle"></i>
            <span>Add New Product</span>
          </div>
          <button class="dialog-close-btn" @click="closeProductDialog">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- Dialog Body -->
        <div class="dialog-body">
          <!-- Context Info -->
          <div class="alert alert-info mb-4">
            <i class="fas fa-info-circle alert-icon"></i>
            <div class="alert-content">
              <div><strong>Location:</strong> {{ selectedContext.location }}</div>
              <div><strong>Vendor:</strong> {{ selectedContext.vendorName }}</div>
            </div>
          </div>
          
          <!-- Form -->
          <form @submit.prevent="submitNewProduct" ref="productForm">
            <!-- Product Autocomplete (Custom) -->
            <div class="form-group">
              <label class="form-label">Product Name *</label>
              <div class="autocomplete-wrapper">
                <div class="input-wrapper">
                  <i class="fas fa-search input-icon"></i>
                  <input
                    v-model="productSearch"
                    @input="handleProductSearch"
                    @focus="showProductDropdown = true"
                    @blur="handleProductBlur"
                    type="text"
                    class="form-input has-icon"
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
                <div v-if="showProductDropdown && filteredProductOptions.length > 0" class="autocomplete-dropdown">
                  <div
                    v-for="(product, index) in filteredProductOptions"
                    :key="index"
                    class="autocomplete-item"
                    @mousedown.prevent="selectProduct(product)"
                  >
                    {{ product }}
                  </div>
                </div>
                
                <!-- Hint -->
                <small class="form-hint">
                  {{ getProductHint }}
                </small>
              </div>
            </div>
            
            <!-- Other Product Name (if "Other" selected) -->
            <div v-if="newProduct.product_name === 'Other'" class="form-group">
              <label class="form-label">Other Product Name *</label>
              <input
                v-model="newProduct.other_product_name"
                type="text"
                class="form-input"
                placeholder="Enter product name..."
                required
              />
            </div>
            
            <!-- Description -->
            <div class="form-group">
              <label class="form-label">Description (Optional)</label>
              <textarea
                v-model="newProduct.description"
                class="form-input"
                rows="3"
                placeholder="Add any notes..."
              ></textarea>
            </div>
            
            <!-- Active Switch -->
            <div class="form-group">
              <label class="switch-label">
                <input
                  v-model="newProduct.active"
                  type="checkbox"
                  class="switch-input"
                  :disabled="newProduct.product_name === 'Other'"
                />
                <span class="switch-slider"></span>
                <span class="switch-text">Add to shopping list immediately</span>
              </label>
            </div>
            
            <!-- Hint for Other -->
            <div v-if="newProduct.product_name === 'Other'" class="alert alert-info">
              <i class="fas fa-info-circle alert-icon"></i>
              <div class="alert-content">
                New products are automatically added to your shopping list
              </div>
            </div>
          </form>
        </div>
        
        <!-- Dialog Footer -->
        <div class="dialog-footer">
          <button 
            type="button"
            class="btn btn-outlined" 
            @click="closeProductDialog"
            :disabled="isSubmittingProduct"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="submitNewProduct"
            :disabled="!productFormValid || isSubmittingProduct"
            :class="{ 'btn-loading': isSubmittingProduct }"
          >
            <template v-if="!isSubmittingProduct">
              <i class="fas fa-plus"></i>
              Add Product
            </template>
          </button>
        </div>
      </div>
    </div>
    <!-- ✅ END OF PRODUCT DIALOG -->

    <!-- ✅ HEADER CARD (NO VUETIFY) -->
    <div class="card mt-5">
      <div class="card-header">
        <h2 class="card-title">
          <i class="fas fa-map-marked-alt"></i>
          Products By Locations
        </h2>
      </div>

      <!-- ✅ NAVIGATION (NO VUETIFY) -->
      <div class="card-body">
        <div class="navigation-grid">
          <router-link 
            :to="{ name: 'ProductsByVendors' }"
            class="btn btn-outlined"
          >
            <i class="fas fa-store"></i>
            Shopping List By Vendor
          </router-link>

          <router-link 
            :to="{ name: 'ProductList' }"
            class="btn btn-outlined"
          >
            <i class="fas fa-shopping-basket"></i>
            Shopping List By Product
          </router-link>

          <router-link 
            :to="{ name: 'ProductVendorCreate' }"
            class="btn btn-primary"
          >
            <i class="fas fa-plus"></i>
            Create Vendor/Product
          </router-link>
        </div>
      </div>
    </div>

    <!-- ✅ LOADING STATE (NO VUETIFY) -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p class="loading-text">Loading locations...</p>
    </div>

    <!-- ✅ MAIN CONTENT (NO VUETIFY) -->
    <div v-else class="card mt-4">
      <!-- ✅ SWITCH AND VENDOR FILTER -->
      <div class="card-header switch-container">
        <div class="switch-description-wrapper">
          <span class="switch-description-text">
            {{ showShoppingList ? 'Selected Items Only:' : 'All Items:' }}
          </span>
          <label class="switch-label">
            <input
              v-model="showShoppingList"
              type="checkbox"
              class="switch-input"
            />
            <span class="switch-slider"></span>
          </label>
        </div>

        <!-- ✅ VENDOR FILTER INDICATOR -->
        <div v-if="selectedVendorFilter" class="vendor-filter-indicator">
          <span class="chip chip-success chip-large vendor-filter-chip">
            <i class="fas fa-filter"></i>
            Filtering: {{ vendorFilterName }}
            <button 
              class="chip-close-btn" 
              @click="clearVendorFilter"
              type="button"
            >
              <i class="fas fa-times"></i>
            </button>
          </span>
          <small class="vendor-filter-hint">Double-click any vendor to filter</small>
        </div>
      </div>

      <!-- ✅ MAIN CONTENT AREA -->
      <div class="card-body content-wrapper">
        <!-- ✅ TOP SUBMIT BUTTON -->
        <div class="top-submit-section mb-4">
          <button
            @click="submitChanges"
            :disabled="isSubmitting"
            :class="['btn', 'btn-primary', 'btn-large', 'btn-block', 'top-submit-button', { 'btn-loading': isSubmitting }]"
          >
            <template v-if="!isSubmitting">
              <i class="fas fa-save save-icon"></i>
              Save All Changes
              <span class="chip chip-small" style="background: rgba(255,255,255,0.2); color: white; border: none;">
                Quick Save
              </span>
            </template>
          </button>
        </div>

        <!-- ✅ CONTENT CONTAINER -->
        <div class="content-container">
          <!-- ✅ LOCATIONS GRID -->
          <div class="locations-grid">
            <div
              v-for="(location, locationIndex) in filteredLocations"
              :key="locationIndex"
              :class="['location-card', 'card', { 'location-expanded': expandedLocations.has(locations.indexOf(location)) }]"
            >
              <!-- ✅ LOCATION HEADER -->
              <div 
                class="location-header" 
                @click="toggleLocation(locations.indexOf(location))"
              >
                <i class="fas fa-map-marker-alt location-marker-icon"></i>
                <span class="location-name">{{ location }}</span>
                        
                <div class="location-controls">
                  <!-- ✅ LOCATION-LEVEL FILTER SWITCH -->
                  <div class="location-filter-wrapper">
                    <span class="location-filter-text">
                      {{ getLocationFilter(location) ? 'Selected Only:' : 'All Items:' }}
                    </span>
                    <label class="switch-label location-switch-control">
                      <input
                        :checked="getLocationFilter(location)"
                        @change="setLocationFilter(location, $event.target.checked)"
                        @click.stop
                        type="checkbox"
                        class="switch-input"
                      />
                      <span class="switch-slider"></span>
                    </label>
                  </div>
                  
                  <span class="chip chip-small chip-primary">
                    <i class="fas fa-store chip-icon"></i>
                    {{ getVendorsForLocation(location).length }} vendors
                  </span>
                  
                  <button
                    v-if="expandedLocations.has(locations.indexOf(location))"
                    @click.stop="toggleAllVendorsForLocation(location)"
                    class="btn btn-outlined btn-small"
                    :class="{ 'btn-danger': allVendorsExpandedForLocation(location) }"
                  >
                    {{ allVendorsExpandedForLocation(location) ? 'Collapse All' : 'Expand All' }}
                  </button>
                  
                  <i 
                    :class="[
                      'fas', 
                      'chevron-icon',
                      expandedLocations.has(locations.indexOf(location)) ? 'fa-chevron-up' : 'fa-chevron-down'
                    ]"
                  ></i>
                </div>
              </div>

              <!-- ✅ LOCATION CONTENT (VENDORS) -->
              <div 
                v-show="expandedLocations.has(locations.indexOf(location))" 
                class="location-content"
              >
                <div 
                  v-for="vendor in getVendorsForLocation(location)" 
                  :key="vendor.vendor_id || vendor.id"
                  class="vendor-section"
                >
                  <div 
                    :class="['vendor-card', 'card', { 'vendor-expanded': expandedVendors.has(getVendorKey(location, vendor)), 'vendor-filtered': selectedVendorFilter === (vendor.vendor_id || vendor.id) }]"
                  >
                    <!-- ✅ VENDOR HEADER -->
                    <div 
                      class="vendor-header" 
                      @click="toggleVendor(location, vendor)"
                      @dblclick="handleVendorDoubleClick(vendor, $event)"
                    >
                      <i class="fas fa-store vendor-store-icon"></i>
                      
                      <!-- ✅ VENDOR NAME AND EDIT GROUP -->
                      <div class="vendor-name-group">
                        <span class="vendor-name">{{ vendor.vendor_name }}</span>
                        
                        <!-- ✅ EDIT BUTTON -->
                        <button
                          @click.stop="editVendor(vendor)"
                          class="btn btn-outlined btn-small edit-vendor-btn"
                        >
                          <i class="fas fa-edit"></i>
                          <span class="edit-hint">Edit</span>
                        </button>
                      </div>

                      <!-- ✅ FILTER INDICATOR -->
                      <i 
                        v-if="selectedVendorFilter === (vendor.vendor_id || vendor.id)" 
                        class="fas fa-filter vendor-filter-icon"
                      ></i>

                      <!-- ✅ VENDOR CONTROLS -->
                      <div class="vendor-controls">
                        <div class="vendor-filter-wrapper">
                          <span class="vendor-filter-text">
                            {{ getVendorProductFilter(vendor) ? 'Selected Only:' : 'All Items:' }}
                          </span>
                          <label class="switch-label vendor-switch-control">
                            <input
                              :checked="getVendorProductFilter(vendor)"
                              @change="setVendorProductFilter(vendor, $event.target.checked)"
                              @click.stop
                              type="checkbox"
                              class="switch-input"
                            />
                            <span class="switch-slider"></span>
                          </label>
                        </div>
                        
                        <i 
                          :class="[
                            'fas', 
                            'chevron-icon',
                            expandedVendors.has(getVendorKey(location, vendor)) ? 'fa-chevron-up' : 'fa-chevron-down'
                          ]"
                        ></i>
                      </div>
                    </div>

                    <!-- ✅ VENDOR CONTENT (PRODUCTS) -->
                    <div 
                      v-show="expandedVendors.has(getVendorKey(location, vendor))" 
                      class="vendor-content"
                    >
                      <div class="products-header">
                        <div class="products-header-content">
                          <div class="products-title">
                            <h4 
                              class="products-clickable-title"
                              @dblclick="openProductDialog(location, vendor)"
                            >
                              <span class="chip chip-info chip-small">
                                {{ getFilteredProducts(vendor).length }} items
                              </span>

                              <!-- ✅ ADD PRODUCT BUTTON -->
                              <button
                                type="button"
                                class="btn btn-success btn-small add-product-hint"
                                @click.stop="openProductDialog(location, vendor)"
                                title="Double-click title or click here to add new product"
                              >
                                <i class="fas fa-plus-circle"></i>
                              </button>
                            </h4>
                          </div>                           
                        </div>
                      </div>

                      <!-- ✅ PRODUCTS LIST -->
                      <div v-if="getFilteredProducts(vendor).length > 0" class="products-list">
                        <div
                          v-for="(product, productIndex) in getFilteredProducts(vendor)"
                          :key="product.id"
                          :class="[
                            'product-card', 
                            'card',
                            {
                              'product-selected': product.active,
                              'product-multi-selected': selectedProducts.has(product.id)
                            }
                          ]"
                          @click="handleProductClick(product, $event, productIndex, getFilteredProducts(vendor))"
                        >
                          <div class="product-content">
                            <div class="product-indicators">
                              <i 
                                v-if="product.active" 
                                class="fas fa-check-circle selected-indicator"
                              ></i>
                            </div>
                            
                            <span class="product-name">{{ product.product_name }}</span>
                            
                            <button
                              @click.stop="editProduct(product)"
                              class="btn btn-outlined btn-small"
                            >
                              <i class="fas fa-edit"></i>
                              <span class="edit-hint">Edit</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    
                      <!-- ✅ NO PRODUCTS STATE -->
                      <div v-else class="no-products empty-state">
                        <i class="fas fa-inbox empty-state-icon"></i>
                        <p>{{ getVendorProductFilter(vendor) ? 'No selected products' : 'No products available' }} for this vendor</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ✅ NO VENDORS STATE -->
                <div v-if="getVendorsForLocation(location).length === 0" class="no-vendors empty-state">
                  <i class="fas fa-store-slash empty-state-icon"></i>
                  <h4>No vendors in {{ location }}</h4>
                </div>
              </div>
            </div>
          </div>

          <!-- ✅ GLOBAL CONTROLS (RIGHT SIDE) -->
          <div class="global-controls-fixed">
            <div class="global-controls">
              <h4 class="controls-title">
                <i class="fas fa-cogs"></i>
                Quick Controls
              </h4>
              
              <button
                @click="toggleAllLocations"
                class="btn btn-outlined btn-small control-btn"
                :class="{ 'btn-danger': allLocationsExpanded }"
              >
                <i class="fas fa-map-marker-alt"></i>
                {{ allLocationsExpanded ? 'Collapse Locations' : 'Expand Locations' }}
              </button>

              <button
                @click="toggleAllVendors"
                class="btn btn-outlined btn-small control-btn"
                :class="{ 'btn-danger': allVendorsExpanded }"
                :disabled="!hasAnyExpandedLocations"
              >
                <i class="fas fa-store"></i>
                {{ allVendorsExpanded ? 'Collapse All Vendors' : 'Expand All Vendors' }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- ✅ BOTTOM SAVE BUTTON -->
        <button
          @click="submitChanges"
          :disabled="isSubmitting"
          :class="['btn', 'btn-primary', 'btn-large', 'btn-block', 'mt-4', 'mb-safe-area', { 'btn-loading': isSubmitting }]"
        >
          <template v-if="!isSubmitting">
            <i class="fas fa-save save-icon"></i>
            Save All Changes
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

const router = useRouter();
const store = useStore();

// ✅ ENHANCED STATE MANAGEMENT
const showShoppingList = ref(true);
const isLoading = ref(true);
const isSubmitting = ref(false);
const confirmDialogue = ref(null);

// ✅ VENDOR FILTER STATE
const selectedVendorFilter = ref(null);
const vendorFilterName = ref('');
// ✅ NEW: VENDOR-SPECIFIC PRODUCT FILTER STATE
const vendorProductFilters = ref(new Map());
const locationFilters = ref(new Map()); // location -> boolean (true = selected only, false = all items)
// ✅ HIERARCHICAL DROPDOWN STATE
const expandedLocations = ref(new Set());
const expandedVendors = ref(new Set());
const selectedProducts = ref(new Set());
const lastSelectedIndex = ref(null);

// ✅ ADD THESE NEW PRODUCT DIALOG STATES
const showProductDialog = ref(false);
const isSubmittingProduct = ref(false);
const productFormValid = ref(false);
const productForm = ref(null);
const productSearch = ref(''); // ✅ NEW: For autocomplete search

const selectedContext = ref({
  location: '',
  vendorName: '',
  vendorId: null
});

const newProduct = ref({
  product_name: '',
  other_product_name: '', // ✅ NEW: For "Other" option
  description: '',
  active: true
});
// ✅ NEW: GET PRODUCTS DATA FOR AUTOCOMPLETE (LIKE ProductVendorCreate)
const vendorsProductsGroup = computed(() => store.state.vendors_products_group);

const getAllProducts = computed(() => {
  const products = vendorsProductsGroup.value?.vendorsProductsGroup || [];
  
  // Clean and add "Other" option
  const cleanedProducts = products
    .filter(item => item !== null && item !== undefined && item !== '')
    .map(item => typeof item === 'string' ? item.trim() : String(item).trim())
    .filter(item => item.length > 0);
    
  // Add "Other" option at the end
  return [...cleanedProducts, 'Other'];
});

// ✅ NEW: DYNAMIC MESSAGES FOR AUTOCOMPLETE
const getNoDataText = computed(() => {
  const totalProducts = getAllProducts.value.length - 1; // Subtract 1 for "Other"
  if (totalProducts === 0) {
    return 'Loading products...';
  }
  return 'No matching products found - try "Other"';
});

const getProductHint = computed(() => {
  const totalProducts = getAllProducts.value.length - 1; // Subtract 1 for "Other"
  if (productSearch.value) {
    return `Searching "${productSearch.value}" in ${totalProducts} products`;
  }
  return `${totalProducts} products available + "Other" option`;
});

// ✅ NEW: VALIDATION RULES (LIKE ProductVendorCreate)
const requiredProductName = (value) => {
  const isValid = !!value;
  return isValid || 'Please select a product';
};

const requiredOtherProductName = (value) => {
  const isValid = !!value;
  return isValid || 'Please enter the other product name';
};
// ✅ COMPUTED PROPERTIES FOR EXPAND/COLLAPSE CONTROLS
const allLocationsExpanded = computed(() => {
  return expandedLocations.value.size === locations.value.length;
});

const hasAnyExpandedLocations = computed(() => {
  return expandedLocations.value.size > 0;
});

// ✅ UPDATE THIS COMPUTED PROPERTY - CHANGE THE DEFAULT
const allVendorsExpanded = computed(() => {
  if (expandedLocations.value.size === 0) return true; // ✅ Already correct - defaults to true
  
  let totalVendors = 0;
  let expandedVendorCount = 0;
  
  expandedLocations.value.forEach(locationIndex => {
    const location = locations.value[locationIndex];
    const vendors = getVendorsForLocation(location);
    totalVendors += vendors.length;
    
    vendors.forEach(vendor => {
      if (expandedVendors.value.has(getVendorKey(location, vendor))) {
        expandedVendorCount++;
      }
    });
  });
  
  return totalVendors > 0 && expandedVendorCount === totalVendors;
});

// ✅ EXISTING COMPUTED PROPERTIES
const vendorsProducts = computed(() => {
  const rawData = store.state.vendors_products;
  
  if (Array.isArray(rawData)) {
    return rawData;
  }
  
  if (rawData?.data && Array.isArray(rawData.data)) {
    return rawData.data;
  }
  
  if (rawData?.vendors_products && Array.isArray(rawData.vendors_products)) {
    return rawData.vendors_products;
  }
  
  if (rawData && typeof rawData === 'object') {
    const arrayValues = Object.values(rawData).find(val => Array.isArray(val));
    if (arrayValues) {
      return arrayValues;
    }
  }
  
  console.warn('❌ vendorsProducts is not in expected format:', rawData);
  return [];
});

const vendorsLocationsGroup = computed(() => {
  const rawData = store.state.vendors_locations_group;
  
  if (rawData?.vendorsLocationsGroup && Array.isArray(rawData.vendorsLocationsGroup)) {
    return rawData.vendorsLocationsGroup;
  }
  
  if (Array.isArray(rawData)) {
    return rawData;
  }
  
  if (rawData?.data && Array.isArray(rawData.data)) {
    return rawData.data;
  }
  
  console.warn('❌ vendorsLocationsGroup is not in expected format:', rawData);
  return [];
});

const locations = computed(() => vendorsLocationsGroup.value);

// ✅ FILTERED LOCATIONS
const filteredLocations = computed(() => {
  if (!selectedVendorFilter.value) {
    return locations.value;
  }
  
  return locations.value.filter(location => {
    const vendors = getVendorsForLocation(location);
    return vendors.some(vendor => 
      (vendor.vendor_id || vendor.id) === selectedVendorFilter.value
    );
  });
});

// ✅ ENHANCED: OPEN DIALOG FUNCTION WITH BETTER DEBUG
function openProductDialog(location, vendor) {  
  // Check if we have the required data
  if (!vendor || !vendor.vendor_name) {
    console.error('❌ Invalid vendor data:', vendor);
    alert('❌ Invalid vendor data - cannot open dialog');
    return;
  }
  
  selectedContext.value = {
    location: location,
    vendorName: vendor.vendor_name,
    vendorId: vendor.vendor_id || vendor.id
  };
  
  // Reset form
  newProduct.value = {
    product_name: '',
    other_product_name: '',
    description: '',
    active: true
  };
  
  productSearch.value = '';
  showProductDialog.value = true;
  
  // Force dialog visibility with timeout
  setTimeout(() => {
    const dialogs = document.querySelectorAll('.v-dialog');
    
    if (dialogs.length === 0) {
      console.error('❌ No dialog found in DOM!');
      alert('❌ Dialog not found - there may be a template issue');
    }
  }, 500);
}


// ✅ ENHANCED: CLOSE DIALOG FUNCTION
function closeProductDialog() {
  showProductDialog.value = false;
  
  // Reset form after animation
  setTimeout(() => {
    newProduct.value = {
      product_name: '',
      other_product_name: '',
      description: '',
      active: true
    };
    productSearch.value = '';
    selectedContext.value = {
      location: '',
      vendorName: '',
      vendorId: null
    };
    
    if (productForm.value) {
      productForm.value.reset();
    }
  }, 300);
}

// ✅ ENHANCED: SUBMIT FUNCTION WITH "OTHER" LOGIC
async function submitNewProduct() {
  try {
    isSubmittingProduct.value = true;
    
    // Validate form
    if (!productForm.value) {
      throw new Error('Form not available');
    }
    
    const { valid } = await productForm.value.validate();
    if (!valid) {
      throw new Error('Please fix form errors');
    }
    
    // ✅ HANDLE "OTHER" PRODUCT NAME LOGIC
    const finalProductName = newProduct.value.product_name === 'Other' 
      ? newProduct.value.other_product_name.trim()
      : newProduct.value.product_name.trim();
      
    if (!finalProductName) {
      throw new Error('Product name is required');
    }
    // ✅ AUTO-SELECT "OTHER" PRODUCTS OR USE SWITCH VALUE
    const shouldBeActive = newProduct.value.product_name === 'Other' 
      ? true  // Always select new "Other" products
      : newProduct.value.active;  // Use switch value for existing products
    
    // Prepare product data
    const productData = {
      product_name: finalProductName,
      description: newProduct.value.description?.trim() || '',
      vendor_id: selectedContext.value.vendorId,
      location: selectedContext.value.location,
      vendor_name: selectedContext.value.vendorName,
      active: newProduct.value.active,
      created_by: store.state.user?.resource_owner?.email || '',
      created_at: new Date().toISOString(),
      updated_by: store.state.user?.resource_owner?.email || '',
      updated_at: new Date().toISOString()
    };
    
    // ✅ New: Dispatch createProduct action
    const result = await store.dispatch('createProduct', productData);

    // console.log('📝 Create product result:', result);
    // && result !== null && result !== undefined)
    if (result !== false) {
      // Show success message with final product name
      alert(`✅ Successfully added "${finalProductName}" to ${selectedContext.value.vendorName} at ${selectedContext.value.location}!`);
      
      // Refresh data to show new product
      await Promise.all([
        store.dispatch('fetchProducts'),
        store.dispatch('fetchShoppingList'),
        store.dispatch('fetchVendors'),
        store.dispatch('fetchVendorsProducts'),
        store.dispatch('fetchVendorsLocationsGroup'),
        store.dispatch('fetchVendorsProductsGroup') // ✅ Also refresh products list
      ]);
      
      // Close dialog
      closeProductDialog();
      
      // Auto-expand the vendor to show the new product
      //NOT NEEDEDconst vendorKey = getVendorKey(selectedContext.value.location, {
      //NOT NEEDED  vendor_name: selectedContext.value.vendorName,
      //NOT NEEDED  vendor_id: selectedContext.value.vendorId
      //NOT NEEDED});
      //NOT NEEDEDexpandedVendors.value.add(vendorKey);
      
    } else {
      throw new Error('Failed to create product - no valid response');
    }
    
  } catch (error) {
    console.error('❌ Error creating product:', error);
    alert(`❌ Error: ${error.message}`);
  } finally {
    isSubmittingProduct.value = false;
  }
}
// ✅ ADD WATCHER FOR "OTHER" OPTION (LIKE ProductVendorCreate)
watch(() => newProduct.value.product_name, (newValue) => {
  if (newValue !== 'Other') {
    newProduct.value.other_product_name = '';
  }
});
// ✅ ADD LOCATION FILTER FUNCTIONS
function getLocationFilter(location) {
  return locationFilters.value.get(location) ?? showShoppingList.value;
}

function setLocationFilter(location, value) {
  locationFilters.value.set(location, value);
  
  // Force reactivity
  // Note: We don't need refreshKey here since this will filter at computation level
}

// ✅ VENDOR-SPECIFIC PRODUCT FILTER FUNCTIONS
function getVendorProductFilter(vendor) {
  const vendorId = vendor.vendor_id || vendor.id;
  
  // Check if vendor has specific filter, otherwise use location filter, otherwise use global
  if (vendorProductFilters.value.has(vendorId)) {
    return vendorProductFilters.value.get(vendorId);
  }
  
  // Find the location for this vendor
  const vendorLocation = getVendorLocation(vendor);
  if (vendorLocation && locationFilters.value.has(vendorLocation)) {
    return locationFilters.value.get(vendorLocation);
  }
  
  // Fall back to global filter
  return showShoppingList.value;
}

function setVendorProductFilter(vendor, value) {
  const vendorId = vendor.vendor_id || vendor.id;
  vendorProductFilters.value.set(vendorId, value);
}

// ✅ ENHANCED: getFilteredProducts WITH LOCATION-AWARE FILTERING
function getFilteredProducts(vendor) {
  if (!vendor || !vendor.products || !Array.isArray(vendor.products)) {
    console.warn('❌ Invalid vendor products:', vendor);
    return [];
  }
  
  // Use vendor-specific filter (which considers hierarchy)
  const showSelectedOnly = getVendorProductFilter(vendor);
  
  if (showSelectedOnly) {
    // Filter to only selected products
    const selectedProducts = vendor.products.filter(product => product?.active);
    return selectedProducts;
  } else {
    // Show all products
    return vendor.products;
  }
}

// ✅ HIERARCHICAL DROPDOWN FUNCTIONS
function getVendorKey(location, vendor) {
  return `${location}-${vendor.vendor_name}-${vendor.vendor_id || vendor.id}`;
}

function toggleLocation(locationIndex) {
  if (expandedLocations.value.has(locationIndex)) {
    // ✅ CLOSING LOCATION - COLLAPSE ALL ITS VENDORS
    expandedLocations.value.delete(locationIndex);
    const location = locations.value[locationIndex];
    const vendors = getVendorsForLocation(location);
    vendors.forEach(vendor => {
      expandedVendors.value.delete(getVendorKey(location, vendor));
    });
  } else {
    // ✅ OPENING LOCATION - EXPAND LOCATION AND AUTO-EXPAND ALL VENDORS
    expandedLocations.value.add(locationIndex);
    
    const location = locations.value[locationIndex];
    const vendors = getVendorsForLocation(location);
    
    // ✅ AUTO-EXPAND ALL VENDORS BY DEFAULT
    vendors.forEach(vendor => {
      if (!selectedVendorFilter.value || 
          (vendor.vendor_id || vendor.id) === selectedVendorFilter.value) {
        expandedVendors.value.add(getVendorKey(location, vendor));
      }
    });    
  }
}

function toggleVendor(location, vendor) {
  const vendorKey = getVendorKey(location, vendor);
  if (expandedVendors.value.has(vendorKey)) {
    expandedVendors.value.delete(vendorKey);
  } else {
    expandedVendors.value.add(vendorKey);
  }
}

// ✅ VENDOR DOUBLE-CLICK HANDLER
function handleVendorDoubleClick(vendor, event) {
  event.stopPropagation();
  
  const vendorId = vendor.vendor_id || vendor.id;
  
  if (selectedVendorFilter.value === vendorId) {
    clearVendorFilter();
  } else {
    selectedVendorFilter.value = vendorId;
    vendorFilterName.value = vendor.vendor_name;
    autoExpandLocationsWithVendor(vendorId);
  }
}

function clearVendorFilter() {
  selectedVendorFilter.value = null;
  vendorFilterName.value = '';
}

function autoExpandLocationsWithVendor(vendorId) {
  expandedLocations.value.clear();
  expandedVendors.value.clear();
  
  filteredLocations.value.forEach((location, index) => {
    const originalIndex = locations.value.indexOf(location);
    if (originalIndex !== -1) {
      expandedLocations.value.add(originalIndex);
      
      const vendors = getVendorsForLocation(location);
      const targetVendor = vendors.find(v => (v.vendor_id || v.id) === vendorId);
      if (targetVendor) {
        expandedVendors.value.add(getVendorKey(location, targetVendor));
      }
    }
  });
}

function toggleAllLocations() {
  if (allLocationsExpanded.value) {
    expandedLocations.value.clear();
    expandedVendors.value.clear();
  } else {
    const locationsToExpand = selectedVendorFilter.value ? filteredLocations.value : locations.value;
    locationsToExpand.forEach((location, index) => {
      const originalIndex = locations.value.indexOf(location);
      if (originalIndex !== -1) {
        expandedLocations.value.add(originalIndex);
      }
    });
  }
}

function toggleAllVendors() {
  if (allVendorsExpanded.value && expandedLocations.value.size > 0) {
    // ✅ COLLAPSE ALL VENDORS (since they're expanded by default)
    expandedVendors.value.clear();
  } else {
    // ✅ EXPAND ALL VENDORS IN ALL EXPANDED LOCATIONS  
    expandedLocations.value.forEach(locationIndex => {
      const location = locations.value[locationIndex];
      const vendors = getVendorsForLocation(location);
      vendors.forEach(vendor => {
        if (!selectedVendorFilter.value || 
            (vendor.vendor_id || vendor.id) === selectedVendorFilter.value) {
          expandedVendors.value.add(getVendorKey(location, vendor));
        }
      });
    });
  }
}

function allVendorsExpandedForLocation(location) {
  const vendors = getVendorsForLocation(location);
  return vendors.length > 0 && vendors.every(vendor => 
    expandedVendors.value.has(getVendorKey(location, vendor))
  );
}

// ✅ PRODUCT AND VENDOR FUNCTIONS
function handleProductClick(product, event, productIndex, vendorProducts) {
  if (event?.shiftKey && lastSelectedIndex.value !== null) {
    const start = Math.min(lastSelectedIndex.value, productIndex);
    const end = Math.max(lastSelectedIndex.value, productIndex);
    
    for (let i = start; i <= end; i++) {
      if (vendorProducts[i]) {
        selectedProducts.value.add(vendorProducts[i].id);
      }
    }
  } else if (event?.ctrlKey || event?.metaKey) {
    if (selectedProducts.value.has(product.id)) {
      selectedProducts.value.delete(product.id);
    } else {
      selectedProducts.value.add(product.id);
    }
    lastSelectedIndex.value = productIndex;
  } else {
    product.active = !product.active;
    updateProduct(product);
    selectedProducts.value.clear();
    lastSelectedIndex.value = null;
  }
}

// ✅ HELPER FUNCTION TO GET VENDOR'S LOCATION
function getVendorLocation(vendor) {
  // Find which location this vendor belongs to
  for (const location of locations.value) {
    const locationVendors = vendorsProducts.value.filter(v => v?.location === location);
    if (locationVendors.some(v => (v.vendor_id || v.id) === (vendor.vendor_id || vendor.id))) {
      return location;
    }
  }
  return null;
}

// ✅ UPDATED: getVendorsForLocation TO ALWAYS SHOW VENDORS
function getVendorsForLocation(location) {
  const vendors = vendorsProducts.value;
  
  if (!Array.isArray(vendors)) {
    console.error('❌ vendorsProducts is not an array:', vendors);
    return [];
  }
  
  let locationVendors = vendors.filter(vendor => vendor?.location === location);
  
  // Apply vendor filter if set
  if (selectedVendorFilter.value) {
    locationVendors = locationVendors.filter(vendor => 
      (vendor.vendor_id || vendor.id) === selectedVendorFilter.value
    );
  }
  
  // ✅ REMOVED: Location filter logic - vendors always show
  // We'll filter products at the product level instead
  
  return locationVendors;
}

function editVendor(vendor) {
  router.push({ 
    name: 'VendorEdit', 
    params: { id: vendor.vendor_id || vendor.id }
  });
}

function editProduct(product) {
  router.push({ 
    name: 'ProductEdit', 
    params: { id: product.id } 
  });
}

function updateProduct(product) {
  if (!product) {
    console.warn('❌ updateProduct called with invalid product:', product);
    return;
  }
}

// ✅ SUBMIT AND DATA FUNCTIONS
async function submitChanges() {
  try {
    isSubmitting.value = true;
        
    if (!Array.isArray(vendorsProducts.value) || vendorsProducts.value.length === 0) {
      throw new Error('No vendors products to update!');
    }
    
    const allProducts = [];
    
    vendorsProducts.value.forEach((vendor, vendorIndex) => {
      if (vendor.products && Array.isArray(vendor.products)) {
        vendor.products.forEach((product, productIndex) => {
          allProducts.push({
            ...product,
            vendor_id: product.vendor_id || vendor.id,
            vendor_name: vendor.vendor_name || product.vendor_name,
            location: vendor.location || product.location
          });
        });
      }
    });
    
    const changedProducts = allProducts.map(product => {
      const isCurrentlyActive = !!product.active;
      
      return {
        id: product.id,
        vendor_id: product.vendor_id || 1,
        product_name: product.product_name || product.name || 'Unknown Product',
        location: product.location,
        vendor_name: product.vendor_name,
        active: isCurrentlyActive,
        created_at: product.created_at,
        updated_at: product.updated_at,
        updated_by: store.state.user?.resource_owner?.email || '',
        updated_at_client: new Date().toISOString()
      };
    });
    
    const activeCount = changedProducts.filter(p => p.active).length;
    const inactiveCount = changedProducts.filter(p => !p.active).length;
    
    const submitData = {
      products: changedProducts,
      id: uuidv4(),
      created_by: store.state.user?.resource_owner?.email || '',
    };
        
    const result = await store.dispatch('putProducts', submitData);
    
    if (result !== false) {
      alert(`✅ Updated ${changedProducts.length} products (${activeCount} active, ${inactiveCount} inactive)`);
      
      await Promise.all([
        store.dispatch('fetchProducts'),
        store.dispatch('fetchShoppingList'),
        store.dispatch('fetchVendors'),
        store.dispatch('fetchVendorsProducts'),
        store.dispatch('fetchVendorsLocationsGroup')
      ]);
      
    } else {
      alert('❌ Update failed');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    alert(`❌ Error: ${error.message}`);
  } finally {
    isSubmitting.value = false;
  }
}

// ✅ ENHANCED: FETCH DATA WITH SMART DEFAULTS
async function fetchData() {
  isLoading.value = true;
  
  try {
    const promises = [
      store.dispatch('fetchVendorsProducts'),
      store.dispatch('fetchVendorsLocationsGroup'),
      store.dispatch('fetchShoppingList'),
      store.dispatch('fetchVendorsProductsGroup')
    ];
    
    await Promise.all(promises);
    
    // ✅ NEW: SET SMART DEFAULTS AFTER DATA IS LOADED
    setSmartDefaults();
    
  } catch (error) {
    console.error('❌ Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
}
// ✅ UPDATED: SMARTER DEFAULTS FUNCTION - ONLY EXPAND VENDORS WITH SELECTED PRODUCTS
function setSmartDefaults() {
  
  // 1. ✅ EXPAND ALL LOCATIONS
  locations.value.forEach((location, index) => {
    expandedLocations.value.add(index);
  });
  
  // 2. ✅ ONLY EXPAND VENDORS THAT HAVE SELECTED PRODUCTS
  let expandedVendorCount = 0;
  let collapsedVendorCount = 0;
  
  locations.value.forEach((location, locationIndex) => {
    const vendors = getVendorsForLocation(location);
    
    vendors.forEach(vendor => {
      const hasSelectedProducts = vendor.products && vendor.products.some(p => p.active);
      
      if (hasSelectedProducts) {
        // ✅ HAS SELECTED PRODUCTS - EXPAND AND SHOW SELECTED ONLY
        expandedVendors.value.add(getVendorKey(location, vendor));
        const vendorId = vendor.vendor_id || vendor.id;
        vendorProductFilters.value.set(vendorId, true); // Show "Selected Only"
        expandedVendorCount++;
      } else {
        // ✅ NO SELECTED PRODUCTS - KEEP COLLAPSED
        const vendorId = vendor.vendor_id || vendor.id;
        vendorProductFilters.value.set(vendorId, false); // Show "All Items" when expanded
        collapsedVendorCount++;
      }
    });
  });
  
  // 3. ✅ SET LOCATION FILTERS BASED ON VENDOR CONTENT
  locations.value.forEach(location => {
    const vendors = getVendorsForLocation(location);
    const vendorsWithSelected = vendors.filter(v => v.products && v.products.some(p => p.active));
    const hasAnySelected = vendorsWithSelected.length > 0;
    
    locationFilters.value.set(location, hasAnySelected);
  });
  
  // 4. ✅ SET GLOBAL FILTER BASED ON OVERALL ACTIVITY
  const hasAnySelectedGlobally = expandedVendorCount > 0;
  showShoppingList.value = hasAnySelectedGlobally;
}

// ✅ MAKE IT AVAILABLE IN CONSOLE
onMounted(() => {
  fetchData();
});

</script>

<style scoped>
/* Custom Dialog Overlay */
.custom-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.custom-dialog {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.dialog-header {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.dialog-close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s;
}

.dialog-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.dialog-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.dialog-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Autocomplete Wrapper */
.autocomplete-wrapper {
  position: relative;
}

.input-clear-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.input-clear-btn:hover {
  color: #667eea;
}

.autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #667eea;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 250px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.autocomplete-item {
  padding: 0.875rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.autocomplete-item:last-child {
  border-bottom: none;
}

.autocomplete-item:hover {
  background: rgba(102, 126, 234, 0.1);
}

.form-hint {
  display: block;
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.875rem;
  font-style: italic;
}

/* Custom Switch */
.switch-label {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: 0.75rem;
}

.switch-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: relative;
  width: 60px;
  height: 30px;
  background: #ccc;
  border-radius: 30px;
  transition: background 0.3s;
}

.switch-slider::before {
  content: "";
  position: absolute;
  width: 24px;
  height: 24px;
  left: 3px;
  top: 3px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.switch-input:checked + .switch-slider {
  background: #667eea;
}

.switch-input:checked + .switch-slider::before {
  transform: translateX(30px);
}

.switch-input:disabled + .switch-slider {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch-text {
  font-size: 0.95rem;
  color: #333;
}

/* Location Filter Wrapper */
.location-filter-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.location-filter-text {
  color: #667eea;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
}

.location-switch-control {
  min-width: 60px;
}

/* Vendor Name Group */
.vendor-name-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.edit-vendor-btn {
  margin-left: 0.5rem;
}

/* Location/Vendor Content Animation */
.location-content,
.vendor-content {
  padding: 1rem;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Product Content */
.product-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
}

/* Chip Close Button */
.chip-close-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0 0.25rem;
  margin-left: 0.5rem;
  transition: transform 0.2s;
}

.chip-close-btn:hover {
  transform: scale(1.2);
}

/* Chip Sizes */
.chip-large {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

/* Mobile Responsive for Dialog */
@media (max-width: 768px) {
  .custom-dialog {
    max-height: 95vh;
    margin: 0.5rem;
  }
  
  .dialog-header {
    padding: 1rem;
  }
  
  .dialog-header-content {
    font-size: 1.1rem;
  }
  
  .dialog-body {
    padding: 1rem;
  }
  
  .dialog-footer {
    padding: 0.75rem 1rem;
    flex-direction: column-reverse;
  }
  
  .dialog-footer .btn {
    width: 100%;
  }
  
  .autocomplete-dropdown {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    max-height: 50vh;
    border-radius: 16px 16px 0 0;
  }
}
/* Desktop product dropdown fixes */
:deep(.desktop-product-dropdown) {
  z-index: 2010 !important;
  position: absolute !important;
  max-height: 250px !important;
  overflow-y: auto !important;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
  border-radius: 8px !important;
  margin-top: 8px !important;
  background: white !important;
  border: 1px solid rgba(0,0,0,0.12) !important;
}

/* Force dropdown to appear below field on desktop */
@media (min-width: 769px) {
  :deep(.v-autocomplete .v-menu) {
    z-index: 2010 !important;
  }
  
  :deep(.v-menu .v-overlay__content) {
    z-index: 2010 !important;
    position: absolute !important;
    top: 100% !important;
    left: 0 !important;
    right: 0 !important;
    margin-top: 8px !important;
    transform: none !important;
  }
  
  :deep(.desktop-product-dropdown) {
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    top: 100% !important;
    left: 0 !important;
    right: 0 !important;
    transform: translateY(0) !important;
    margin-top: 8px !important;
  }
  
  :deep(.v-list) {
    padding: 8px 0 !important;
  }
  
  :deep(.v-list-item) {
    padding: 12px 16px !important;
    min-height: 48px !important;
    transition: background-color 0.2s ease !important;
  }
  
  :deep(.v-list-item:hover) {
    background-color: rgba(var(--v-theme-primary), 0.08) !important;
  }
  
  :deep(.v-list-item--active) {
    background-color: rgba(var(--v-theme-primary), 0.12) !important;
    color: rgb(var(--v-theme-primary)) !important;
  }
}

/* Ensure dialog and autocomplete container positioning */
:deep(.v-dialog .v-card) {
  position: relative !important;
  overflow: visible !important;
}

:deep(.v-dialog .v-card-text) {
  position: relative !important;
  overflow: visible !important;
}

:deep(.v-autocomplete) {
  position: relative !important;
  z-index: 1 !important;
}

:deep(.v-autocomplete .v-field) {
  background: white !important;
  position: relative !important;
  z-index: 1 !important;
  border-radius: 8px !important;
}

/* Form field spacing for desktop */
@media (min-width: 769px) {
  .v-form .v-autocomplete {
    margin-bottom: 3rem !important; /* Extra space for dropdown on desktop */
  }
  
  .v-form .v-text-field,
  .v-form .v-textarea {
    margin-bottom: 1.5rem !important;
  }
}

/* Dialog z-index stack for desktop */
@media (min-width: 769px) {
  :deep(.v-dialog) {
    z-index: 2000 !important;
  }
  
  :deep(.v-overlay) {
    z-index: 1999 !important;
  }
  
  :deep(.v-menu) {
    z-index: 2010 !important;
  }
  
  :deep(.v-list) {
    z-index: 2011 !important;
  }
  
  :deep(.desktop-product-dropdown) {
    z-index: 2012 !important;
  }
}
/* Mobile specific dropdown fixes */
@media (max-width: 768px) {
  :deep(.product-dropdown-menu) {
    position: fixed !important;
    top: auto !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    max-height: 50vh !important;
    z-index: 10001 !important;
    border-radius: 16px 16px 0 0 !important;
    margin: 0 !important;
  }
  
  :deep(.v-autocomplete),
  :deep(.v-text-field),
  :deep(.v-textarea) {
    font-size: 16px !important;
  }
  
  :deep(.v-autocomplete .v-field),
  :deep(.v-text-field .v-field),
  :deep(.v-textarea .v-field) {
    min-height: 56px !important;
  }
  
  :deep(.v-autocomplete .v-field__input),
  :deep(.v-text-field .v-field__input),
  :deep(.v-textarea .v-field__input) {
    font-size: 16px !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
  }
  
  :deep(.v-autocomplete input),
  :deep(.v-text-field input),
  :deep(.v-textarea textarea) {
    font-size: 16px !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
    -webkit-tap-highlight-color: transparent !important;
    touch-action: manipulation !important;
  }
}

/* Dialog z-index management */
:deep(.v-dialog) {
  z-index: 2000 !important;
}

:deep(.v-overlay) {
  z-index: 1999 !important;
}

:deep(.v-menu) {
  z-index: 2001 !important;
}

:deep(.v-list) {
  z-index: 2002 !important;
}

/* Form field spacing to prevent overlap */
.v-form > * {
  margin-bottom: 1rem !important;
}

.v-form .v-autocomplete {
  margin-bottom: 2rem !important; /* Extra space for dropdown */
}
/* Mobile dropdown fixes */
:deep(.mobile-dropdown-menu) {
  z-index: 10001 !important;
  position: fixed !important;
  max-height: 250px !important;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch !important;
}

/* Mobile autocomplete field fixes */
:deep(.v-autocomplete .v-field__input) {
  font-size: 16px !important;
  -webkit-appearance: none !important;
  -webkit-tap-highlight-color: transparent !important;
  touch-action: manipulation !important;
}

:deep(.v-autocomplete .v-field__input input) {
  font-size: 16px !important;
  -webkit-appearance: none !important;
  -webkit-tap-highlight-color: transparent !important;
  background-color: transparent !important;
  outline: none !important;
  border: none !important;
}

/* Prevent zoom on iOS */
@media (max-width: 768px) {
  :deep(.v-autocomplete),
  :deep(.v-text-field),
  :deep(.v-textarea) {
    font-size: 16px !important;
  }
  
  :deep(.v-autocomplete .v-field),
  :deep(.v-text-field .v-field),
  :deep(.v-textarea .v-field) {
    min-height: 56px !important;
  }
  
  :deep(.v-autocomplete .v-field__input),
  :deep(.v-text-field .v-field__input),
  :deep(.v-textarea .v-field__input) {
    font-size: 16px !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
  }
  
  :deep(.v-autocomplete input),
  :deep(.v-text-field input),
  :deep(.v-textarea textarea) {
    font-size: 16px !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
    -webkit-tap-highlight-color: transparent !important;
    touch-action: manipulation !important;
  }
}

/* Mobile dialog z-index fixes */
@media (max-width: 768px) {
  :deep(.v-dialog) {
    z-index: 9999 !important;
  }
  
  :deep(.v-overlay) {
    z-index: 9998 !important;
  }
  
  :deep(.v-menu) {
    z-index: 10001 !important;
  }
  
  :deep(.v-list) {
    z-index: 10002 !important;
  }
}

/* ✅ SIMPLE CLICKABLE TITLE STYLES */
.products-clickable-title {
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.5rem;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
}

.products-clickable-title:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
  transform: scale(1.02);
}

.add-product-hint {
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.add-product-hint:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* ✅ VENDOR PRODUCT FILTER STYLES */
.products-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.products-title {
  flex: 1;
}

.vendor-product-filter {
  flex-shrink: 0;
}

.vendor-filter-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(var(--v-theme-secondary), 0.1);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-secondary), 0.2);
}

.vendor-filter-text {
  color: rgb(var(--v-theme-secondary)) !important;
  font-weight: 600 !important;
  font-size: 0.9rem !important;
  white-space: nowrap;
}

.vendor-switch-control {
  min-width: 80px;
  flex-shrink: 0;
}

/* ✅ MOBILE RESPONSIVE */
@media (max-width: 768px) {
  .products-header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .vendor-product-filter {
    width: 100%;
  }
  
  .vendor-filter-wrapper {
    justify-content: space-between;
    width: 100%;
    padding: 0.75rem;
  }
}
/* ✅ FULLSCREEN MOBILE DIALOG */
@media (max-width: 600px) {
  .v-dialog--fullscreen .mobile-dialog-content {
    max-height: calc(100vh - 140px);
    padding: 1rem !important;
  }
  
  .v-dialog--fullscreen .product-dialog-header {
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .v-dialog--fullscreen .mobile-dialog-actions {
    position: sticky;
    bottom: 0;
    background: white;
    box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
    z-index: 10;
  }
}
/* ✅ ENHANCED PRODUCT DIALOG STYLES */
.expanded-product-field :deep(.v-field) {
  min-height: 60px !important;
  cursor: text !important;
  display: flex !important;
  align-items: center !important;
}

.expanded-product-field :deep(.v-field__field) {
  padding: 16px 12px !important;
  min-height: 60px !important;
  display: flex !important;
  align-items: center !important;
}

.expanded-product-field :deep(.v-field__input) {
  font-size: 16px !important;
  padding: 0 !important; 
  min-height: auto !important; 
  line-height: 1.5 !important;
  display: flex !important;
  align-items: center !important;
}

.expanded-product-field :deep(.v-field__input input) {
  padding: 0 !important;
  margin: 0 !important;
  line-height: 1.5 !important;
  height: auto !important;
  text-align: left !important;
}

.expanded-product-field :deep(.v-field__prepend-inner) {
  padding: 16px 8px 16px 12px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.expanded-product-field :deep(.v-field__append-inner) {
  padding: 16px 12px 16px 8px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* ✅ MOBILE RESPONSIVE FOR AUTOCOMPLETE */
@media (max-width: 768px) {
  .expanded-product-field :deep(.v-field) {
    min-height: 70px !important;
  }
  
  .expanded-product-field :deep(.v-field__field) {
    padding: 20px 16px !important;
    min-height: 70px !important;
  }
  
  .expanded-product-field :deep(.v-field__input) {
    font-size: 16px !important;
    -webkit-appearance: none !important;
  }
  
  .expanded-product-field :deep(.v-field__prepend-inner) {
    padding: 20px 12px 20px 16px !important;
  }
  
  .expanded-product-field :deep(.v-field__append-inner) {
    padding: 20px 16px 20px 12px !important;
  }
}
/* ✅ PRODUCT DIALOG STYLES */
.product-dialog-header {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white !important;
  padding: 1.5rem 2rem;
}

.product-dialog-header h3 {
  color: white !important;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.context-info {
  background: rgba(33, 150, 243, 0.1);
  border-radius: 8px;
  padding: 1rem;
}

.context-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.context-item {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
}

.context-item i {
  color: #2196F3;
  width: 20px;
}

/* ✅ CLICKABLE PRODUCTS TITLE */
.products-clickable-title {
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 8px;
  position: relative;
}

.products-clickable-title:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
  transform: scale(1.02);
}

.products-clickable-title:active {
  transform: scale(0.98);
}

/* ✅ SIMPLE CLICKABLE TITLE STYLES */
.products-clickable-title {
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.5rem;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
}

.products-clickable-title:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
  transform: scale(1.02);
}

.add-product-hint {
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.add-product-hint:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* ✅ MOBILE RESPONSIVE */
@media (max-width: 768px) {
  .products-header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .vendor-product-filter {
    width: 100%;
  }
  
  .vendor-filter-wrapper {
    justify-content: space-between;
    width: 100%;
    padding: 0.75rem;
  }
}

.products-clickable-title:hover::after {
  opacity: 0.6;
  right: -15px;
}

/* ✅ MOBILE RESPONSIVE FOR DIALOG */
@media (max-width: 768px) {
  .product-dialog-header {
    padding: 1rem;
  }
  
  .product-dialog-header h3 {
    font-size: 1.2rem;
  }
  
  .context-details {
    gap: 0.75rem;
  }
  
  .context-item {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .products-clickable-title::after {
    display: none; /* Hide plus hint on very small screens */
  }
  
  .context-details {
    gap: 0.5rem;
  }
  
  .context-item {
    font-size: 0.85rem;
  }
}
/* ✅ VENDOR PRODUCT FILTER STYLES */
.products-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.products-title {
  flex: 1;
}

.vendor-product-filter {
  flex-shrink: 0;
}

.vendor-filter-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(var(--v-theme-secondary), 0.1);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-secondary), 0.2);
}

.vendor-filter-text {
  color: rgb(var(--v-theme-secondary)) !important;
  font-weight: 600 !important;
  font-size: 0.9rem !important;
  white-space: nowrap;
}

.vendor-switch-control {
  min-width: 80px;
  flex-shrink: 0;
}

/* ✅ MOBILE RESPONSIVE FOR VENDOR FILTER */
@media (max-width: 768px) {
  .products-header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .vendor-product-filter {
    width: 100%;
  }
  
  .vendor-filter-wrapper {
    justify-content: space-between;
    width: 100%;
    padding: 0.75rem;
  }
  
  .vendor-filter-text {
    font-size: 0.85rem !important;
  }
}

@media (max-width: 480px) {
  .vendor-filter-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .vendor-filter-text {
    font-size: 0.8rem !important;
  }
  
  .vendor-switch-control {
    align-self: flex-start;
    min-width: auto;
  }
}
/* ✅ KEEP ALL YOUR EXISTING CSS EXACTLY AS IS - IT'S PERFECT TOO! */
.vendor-filter-indicator {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  margin-left: auto;
}

.vendor-filter-chip {
  font-weight: 600 !important;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3) !important;
}

.vendor-filter-hint {
  font-style: italic;
  color: rgb(var(--v-theme-on-surface-variant));
  font-size: 0.75rem;
}

.vendor-filtered {
  background-color: rgba(76, 175, 80, 0.1) !important;
  border-left: 4px solid #4CAF50 !important;
}

.vendor-filter-icon {
  color: #4CAF50 !important;
  font-size: 1em;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* ✅ MOBILE RESPONSIVE FOR FILTER */
@media (max-width: 768px) {
  .vendor-filter-indicator {
    align-items: flex-start;
    margin-left: 0;
    margin-top: 1rem;
    width: 100%;
  }
  
  .vendor-filter-chip {
    font-size: 0.8rem !important;
  }
  
  .vendor-filter-hint {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .vendor-filter-hint {
    display: none; /* Hide hint on very small screens */
  }
}

/* ✅ JUST CENTER THE TOP SUBMIT BUTTON */
.top-submit-section {
  max-width: 25rem;
  margin: 0 auto;
  padding: 0 1rem;
}

/* ✅ KEEP ALL YOUR EXISTING STYLES UNCHANGED */
.top-submit-button {
  position: relative;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.8) 100%) !important;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3) !important;
  transition: all 0.3s ease !important;
  border-radius: 12px !important;
  height: 56px !important;
  font-weight: 600 !important;
  letter-spacing: 0.025em !important;
}

.top-submit-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 20px rgba(var(--v-theme-primary), 0.4) !important;
}

.top-submit-button:active {
  transform: translateY(0) !important;
}

.top-submit-button .v-chip {
  background: rgba(255, 255, 255, 0.9) !important;
  font-weight: 500 !important;
  font-size: 0.75rem !important;
}

/* ✅ MOBILE RESPONSIVE FOR TOP BUTTON */
@media (max-width: 768px) {
  .top-submit-section {
    max-width: 100%;
    padding: 0 0.5rem;
    margin-bottom: 1rem !important;
  }
  
  .top-submit-button {
    height: 52px !important;
    font-size: 0.9rem !important;
  }
  
  .top-submit-button .v-chip {
    font-size: 0.7rem !important;
  }
}

@media (max-width: 480px) {
  .top-submit-section {
    padding: 0;
    margin-bottom: 0.75rem !important;
  }
  
  .top-submit-button {
    height: 48px !important;
    font-size: 0.85rem !important;
  }
  
  .top-submit-button .save-icon {
    font-size: 1rem;
  }
  
  .top-submit-button .v-chip {
    display: none; /* Hide chip on very small screens */
  }
}

/* ✅ NEW LAYOUT STYLES */
.content-wrapper {
  position: relative;
}

.content-container {
  display: flex;
  gap: 2rem;
  position: relative;
}

/* ✅ LOCATIONS GRID - TAKES MOST OF THE SPACE */
.locations-grid {
  flex: 1;
  display: grid;
  gap: 1.5rem;
  min-width: 0; /* Prevents flex items from overflowing */
}

/* ✅ FIXED GLOBAL CONTROLS - RIGHT SIDE */
.global-controls-fixed {
  position: sticky;
  top: 20px;
  align-self: flex-start;
  min-width: 280px;
  max-width: 320px;
  z-index: 10;
}

/* ✅ ADD THE MISSING .global-controls BASE STYLES */
.global-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: stretch;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid rgba(var(--v-theme-primary), 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  transition: all 0.3s ease;
}

.global-controls:hover {
  border-color: rgba(var(--v-theme-primary), 0.4);
  box-shadow: 0 12px 32px rgba(0,0,0,0.16);
  transform: translateY(-2px);
}

.controls-title {
  margin: 0 0 0.5rem 0;
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  justify-content: center;
}

.controls-title i {
  color: rgb(var(--v-theme-primary));
}

.control-btn {
  transition: all 0.3s ease !important;
  font-weight: 500 !important;
  letter-spacing: 0.025em !important;
  height: 48px !important;
  font-size: 0.9rem !important;
}

.control-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}

.control-btn:disabled {
  opacity: 0.4 !important;
  transform: none !important;
}

/* ✅ MOBILE RESPONSIVE - STACK LAYOUT */
@media (max-width: 1024px) {
  .content-container {
    flex-direction: column;
  }
  
  .global-controls-fixed {
    position: static;
    min-width: 100%;
    max-width: 100%;
    order: -1; /* Move controls above locations on mobile */
    margin-bottom: 2rem;
  }
  
  .global-controls {
    flex-direction: row;
    gap: 1rem;
    padding: 1rem;
    justify-content: center;
  }
  
  .controls-title {
    display: none; /* Hide title on mobile to save space */
  }
}

@media (max-width: 768px) {
  .content-container {
    gap: 1rem;
  }
  
  .global-controls-fixed {
    margin-bottom: 1.5rem;
  }
  
  .global-controls {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .control-btn {
    height: 44px !important;
    font-size: 0.85rem !important;
  }
}

@media (max-width: 480px) {
  .global-controls {
    padding: 0.75rem;
    gap: 0.5rem;
  }
  
  .control-btn {
    height: 40px !important;
    font-size: 0.8rem !important;
  }
  
  .global-controls-fixed {
    margin-bottom: 1rem;
  }
}

.switch-container {
  padding: 1.5rem !important;
  display: flex !important;
  justify-content: flex-start !important;
  align-items: center !important;
}

.switch-description-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: auto;
  max-width: 50%;
}

.switch-description-text {
  color: #000 !important;
  font-weight: bold !important;
  font-size: 1.2rem !important;
  white-space: nowrap;
}

.switch-control {
  min-width: 120px;
  flex-shrink: 0;
}

.title-icon {
  color: #2196F3 !important;
  margin-right: 0.5rem;
  font-size: 1.2em;
}

.location-marker-icon {
  color: #ff5722 !important;
  font-size: 1.1em;
  margin-right: 0.5rem;
}

.vendor-store-icon {
  color: #4CAF50 !important;
  font-size: 1.1em;
  margin-right: 0.5rem;
}

.products-icon {
  color: #ff9800 !important;
  font-size: 1em;
  margin-right: 0.5rem;
}

.chip-icon {
  font-size: 0.8em !important;
  margin-right: 0.3rem;
  color: inherit;
}

.chevron-icon {
  color: #666 !important;
  font-size: 1em;
  transition: transform 0.3s ease;
}

.save-icon {
  margin-right: 0.5rem;
  font-size: 1.1em;
}

.edit-hint {
  color: #999 !important;
  font-size: 0.9em;
  opacity: 0.6;
  transition: all 0.3s ease;
  cursor: pointer;
}

.edit-hint:hover {
  opacity: 1;
  color: #2196F3 !important;
  transform: scale(1.1);
}

.selected-indicator {
  color: #4CAF50 !important;
  font-size: 1em;
  margin-right: 0.5rem;
}

.no-products-icon {
  color: #ccc !important;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.no-vendors-icon {
  color: #ccc !important;
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

/* ✅ COMPONENT STYLES */
.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.location-card {
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.location-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.location-expanded {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 1px rgba(var(--v-theme-primary), 0.2);
}

.location-header {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  transition: background-color 0.2s ease;
}

.location-header:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.location-name {
  font-weight: 600;
  flex: 1;
  font-size: 1.5rem !important; /* Bigger location text */
  color: #2196F3;
}

.location-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.vendor-section {
  border-left: 3px solid rgba(var(--v-theme-primary), 0.3);
  padding-left: 1rem;
  margin-left: 0.5rem;
}

.vendor-card {
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.vendor-expanded {
  border-color: rgba(var(--v-theme-secondary), 0.5);
  background-color: rgba(var(--v-theme-secondary), 0.02);
}

.vendor-header {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  transition: background-color 0.2s ease;
}

.vendor-header:hover {
  background-color: rgba(var(--v-theme-secondary), 0.08);
}

.vendor-name {
  font-weight: 500;
  flex: 1;
  font-size: 1.25rem !important; /* Bigger vendor text */
  color: #4CAF50;
}

.vendor-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.vendor-filter-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: rgba(var(--v-theme-secondary), 0.1);
  border-radius: 6px;
  border: 1px solid rgba(var(--v-theme-secondary), 0.2);
  min-width: 140px;
}

.vendor-filter-text {
  color: rgb(var(--v-theme-secondary)) !important;
  font-weight: 600 !important;
  font-size: 0.8rem !important;
  white-space: nowrap;
}

.vendor-switch-control {
  min-width: 60px;
  flex-shrink: 0;
}

/* ✅ SIMPLIFY PRODUCTS HEADER */
.products-header-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
}

.products-title {
  flex: 1;
}

/* ✅ MOBILE RESPONSIVE FOR VENDOR FILTER */
@media (max-width: 768px) {
  .vendor-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    width: 100%;
  }
  
  .vendor-filter-wrapper {
    justify-content: space-between;
    width: 100%;
    padding: 0.5rem 0.75rem;
    min-width: auto;
  }
  
  .vendor-filter-text {
    font-size: 0.85rem !important;
  }
  
  .vendor-switch-control {
    min-width: 80px;
  }
}

@media (max-width: 480px) {
  .vendor-filter-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .vendor-filter-text {
    font-size: 0.8rem !important;
  }
  
  .vendor-switch-control {
    align-self: flex-start;
    min-width: auto;
  }
}

.products-header h4 {
  color: rgb(var(--v-theme-secondary));
  font-weight: 500;
  display: flex;
  align-items: center;
}

.products-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.5rem;
}

.product-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  user-select: none;
}

.product-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

.product-selected {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.08);
}

.product-multi-selected {
  border-color: rgb(var(--v-theme-secondary));
  background-color: rgba(var(--v-theme-secondary), 0.12);
  box-shadow: 0 0 0 1px rgb(var(--v-theme-secondary));
}

.product-name {
  font-weight: 500;
  flex: 1;
  font-size: 1rem !important; /* Bigger product text */
  color: #333;
}

.product-indicators {
  display: flex;
  align-items: center;
}

.no-vendors,
.no-products {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  text-align: center;
  color: rgb(var(--v-theme-on-surface-variant));
}

.no-products {
  padding: 1rem;
}

.no-vendors h4 {
  margin-top: 0.5rem;
}

/* ✅ BOTTOM PADDING */
.products-location-container {
  padding-bottom: 120px;
  min-height: calc(100vh - 200px);
}

.mb-safe-area {
  margin-bottom: 80px !important;
  position: relative;
  z-index: 10;
}

/* ✅ MOBILE RESPONSIVE */
@media (max-width: 768px) {
  .switch-container {
    padding: 1rem !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 1rem;
  }
  
  .switch-description-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    width: 100%;
    max-width: 100%;
  }
  
  .switch-description-text {
    font-size: 1.1rem !important;
  }
  
  .switch-control {
    align-self: flex-start;
    min-width: auto;
  }
  
  /* ✅ MOBILE FONT SIZES */
  .location-name {
    font-size: 1.2rem !important;
  }
  
  .vendor-name {
    font-size: 1.1rem !important;
  }
  
  .product-name {
    font-size: 1rem !important;
  }
  
  .navigation-grid {
    grid-template-columns: 1fr;
  }
  
  .location-controls {
    flex-wrap: wrap;
  }
  
  .vendor-controls {
    flex-wrap: wrap;
  }
  
  .products-list {
    grid-template-columns: 1fr;
  }
  
  .edit-hint {
    display: none;
  }
  
  .products-location-container {
    padding-bottom: 140px;
  }
  
  .mb-safe-area {
    margin-bottom: 100px !important;
  }
}

@media (max-width: 480px) {
  .switch-container {
    padding: 0.75rem !important;
  }
  
  .switch-description-wrapper {
    gap: 0.5rem;
  }
  
  .switch-description-text {
    font-size: 1rem !important;
  }
  
  /* ✅ SMALL MOBILE FONT SIZES */
  .location-name {
    font-size: 1.1rem !important;
  }
  
  .vendor-name {
    font-size: 1rem !important;
  }
  
  .product-name {
    font-size: 0.95rem !important;
  }
  
  .location-header,
  .vendor-header {
    padding: 0.5rem;
  }
  
  .vendor-section {
    padding-left: 0.5rem;
    margin-left: 0.25rem;
  }
  
  .title-icon,
  .location-marker-icon,
  .vendor-store-icon {
    font-size: 1em;
  }
  
  .products-location-container {
    padding-bottom: 160px;
  }
  
  .mb-safe-area {
    margin-bottom: 120px !important;
  }
}
</style>