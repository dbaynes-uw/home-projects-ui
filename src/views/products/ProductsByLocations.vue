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
                                <i class="fas fa-plus-circle" style="color: navy;"></i>
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

// ✅ CORE STATE
const showShoppingList = ref(true);
const isLoading = ref(true);
const isSubmitting = ref(false);
const confirmDialogue = ref(null);

// ✅ PRODUCT DIALOG STATE (THESE WERE MISSING!)
const showProductDialog = ref(false);
const showProductDropdown = ref(false);
const productSearch = ref('');
const isSubmittingProduct = ref(false);
const productForm = ref(null);

const selectedContext = ref({
  location: '',
  vendorName: '',
  vendorId: null
});

const newProduct = ref({
  product_name: '',
  other_product_name: '',
  description: '',
  active: true
});

// ✅ FILTER STATE
const selectedVendorFilter = ref(null);
const vendorFilterName = ref('');
const vendorProductFilters = ref(new Map());
const locationFilters = ref(new Map());

// ✅ DROPDOWN STATE
const expandedLocations = ref(new Set());
const expandedVendors = ref(new Set());
const selectedProducts = ref(new Set());
const lastSelectedIndex = ref(null);

// ✅ COMPUTED PROPERTIES
const vendorsProducts = computed(() => {
  const rawData = store.state.vendors_products;
  if (Array.isArray(rawData)) return rawData;
  if (rawData?.data && Array.isArray(rawData.data)) return rawData.data;
  if (rawData?.vendors_products && Array.isArray(rawData.vendors_products)) return rawData.vendors_products;
  console.warn('❌ vendorsProducts is not in expected format:', rawData);
  return [];
});

const vendorsLocationsGroup = computed(() => {
  const rawData = store.state.vendors_locations_group;
  if (rawData?.vendorsLocationsGroup && Array.isArray(rawData.vendorsLocationsGroup)) {
    return rawData.vendorsLocationsGroup;
  }
  if (Array.isArray(rawData)) return rawData;
  if (rawData?.data && Array.isArray(rawData.data)) return rawData.data;
  console.warn('❌ vendorsLocationsGroup is not in expected format:', rawData);
  return [];
});

const locations = computed(() => vendorsLocationsGroup.value);

const filteredLocations = computed(() => {
  if (!selectedVendorFilter.value) return locations.value;
  return locations.value.filter(location => {
    const vendors = getVendorsForLocation(location);
    return vendors.some(vendor => 
      (vendor.vendor_id || vendor.id) === selectedVendorFilter.value
    );
  });
});

// ✅ PRODUCT AUTOCOMPLETE COMPUTED
const vendorsProductsGroup = computed(() => store.state.vendors_products_group);

const getAllProducts = computed(() => {
  const products = vendorsProductsGroup.value?.vendorsProductsGroup || [];
  const cleanedProducts = products
    .filter(item => item !== null && item !== undefined && item !== '')
    .map(item => typeof item === 'string' ? item.trim() : String(item).trim())
    .filter(item => item.length > 0);
  return [...cleanedProducts, 'Other'];
});

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
  const totalProducts = getAllProducts.value.length - 1;
  if (!productSearch.value) {
    return `${totalProducts} products available. Type to search or select "Other" to create new`;
  }
  if (filteredProductOptions.value.length === 0) {
    return 'No matching products found. Try selecting "Other" to create new product';
  }
  return `${filteredProductOptions.value.length} products found`;
});

const productFormValid = computed(() => {
  if (!newProduct.value.product_name) return false;
  if (newProduct.value.product_name === 'Other' && !newProduct.value.other_product_name) {
    return false;
  }
  return true;
});

const allLocationsExpanded = computed(() => {
  return expandedLocations.value.size === locations.value.length;
});

const hasAnyExpandedLocations = computed(() => {
  return expandedLocations.value.size > 0;
});

const allVendorsExpanded = computed(() => {
  if (expandedLocations.value.size === 0) return true;
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

// ✅ PRODUCT DIALOG METHODS
function openProductDialog(location, vendor) {  
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
  
  newProduct.value = {
    product_name: '',
    other_product_name: '',
    description: '',
    active: true
  };
  
  productSearch.value = '';
  showProductDialog.value = true;

}

function closeProductDialog() {
  showProductDialog.value = false;
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
  }, 300);
}

const handleProductSearch = () => {
  showProductDropdown.value = true;
};

const handleProductBlur = () => {
  setTimeout(() => {
    showProductDropdown.value = false;
  }, 200);
};

const clearProductSearch = () => {
  productSearch.value = '';
  newProduct.value.product_name = '';
  showProductDropdown.value = false;
};

const selectProduct = (productName) => {
  newProduct.value.product_name = productName;
  productSearch.value = productName;
  showProductDropdown.value = false;
};

async function submitNewProduct() {
  try {
    isSubmittingProduct.value = true;
    
    if (!productFormValid.value) {
      alert('Please complete all required fields');
      return;
    }
    
    const finalProductName = newProduct.value.product_name === 'Other' 
      ? newProduct.value.other_product_name.trim()
      : newProduct.value.product_name.trim();
      
    if (!finalProductName) {
      throw new Error('Product name is required');
    }
    
    const productData = {
      product_name: finalProductName,
      description: newProduct.value.description?.trim() || '',
      vendor_id: selectedContext.value.vendorId,
      location: selectedContext.value.location,
      vendor_name: selectedContext.value.vendorName,
      active: newProduct.value.product_name === 'Other' ? true : newProduct.value.active,
      created_by: store.state.user?.resource_owner?.email || '',
      created_at: new Date().toISOString(),
      updated_by: store.state.user?.resource_owner?.email || '',
      updated_at: new Date().toISOString()
    };
    
    const result = await store.dispatch('createProduct', productData);

    if (result !== false) {     
      await Promise.all([
        store.dispatch('fetchProducts'),
        store.dispatch('fetchShoppingList'),
        store.dispatch('fetchVendors'),
        store.dispatch('fetchVendorsProducts'),
        store.dispatch('fetchVendorsLocationsGroup'),
        store.dispatch('fetchVendorsProductsGroup')
      ]);
      
      closeProductDialog();
    } else {
      throw new Error('Failed to create product');
    }
    
  } catch (error) {
    console.error('❌ Error creating product:', error);
    alert(`❌ Error: ${error.message}`);
  } finally {
    isSubmittingProduct.value = false;
  }
}

// ✅ WATCH FOR "OTHER" SELECTION
watch(() => newProduct.value.product_name, (newValue) => {
  if (newValue !== 'Other') {
    newProduct.value.other_product_name = '';
  }
});

// ✅ ALL YOUR OTHER EXISTING FUNCTIONS (keep as-is)
function getLocationFilter(location) {
  return locationFilters.value.get(location) ?? showShoppingList.value;
}

function setLocationFilter(location, value) {
  locationFilters.value.set(location, value);
}

function getVendorProductFilter(vendor) {
  const vendorId = vendor.vendor_id || vendor.id;
  if (vendorProductFilters.value.has(vendorId)) {
    return vendorProductFilters.value.get(vendorId);
  }
  const vendorLocation = getVendorLocation(vendor);
  if (vendorLocation && locationFilters.value.has(vendorLocation)) {
    return locationFilters.value.get(vendorLocation);
  }
  return showShoppingList.value;
}

function setVendorProductFilter(vendor, value) {
  const vendorId = vendor.vendor_id || vendor.id;
  vendorProductFilters.value.set(vendorId, value);
}

function getFilteredProducts(vendor) {
  if (!vendor || !vendor.products || !Array.isArray(vendor.products)) {
    return [];
  }
  const showSelectedOnly = getVendorProductFilter(vendor);
  if (showSelectedOnly) {
    return vendor.products.filter(product => product?.active);
  }
  return vendor.products;
}

function getVendorKey(location, vendor) {
  return `${location}-${vendor.vendor_name}-${vendor.vendor_id || vendor.id}`;
}

function toggleLocation(locationIndex) {
  if (expandedLocations.value.has(locationIndex)) {
    expandedLocations.value.delete(locationIndex);
    const location = locations.value[locationIndex];
    const vendors = getVendorsForLocation(location);
    vendors.forEach(vendor => {
      expandedVendors.value.delete(getVendorKey(location, vendor));
    });
  } else {
    expandedLocations.value.add(locationIndex);
    const location = locations.value[locationIndex];
    const vendors = getVendorsForLocation(location);
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

function toggleAllVendorsForLocation(location) {
  const vendors = getVendorsForLocation(location);
  const allExpanded = allVendorsExpandedForLocation(location);
  if (allExpanded) {
    vendors.forEach(vendor => {
      expandedVendors.value.delete(getVendorKey(location, vendor));
    });
  } else {
    vendors.forEach(vendor => {
      if (!selectedVendorFilter.value || 
          (vendor.vendor_id || vendor.id) === selectedVendorFilter.value) {
        expandedVendors.value.add(getVendorKey(location, vendor));
      }
    });
  }
}

function allVendorsExpandedForLocation(location) {
  const vendors = getVendorsForLocation(location);
  return vendors.length > 0 && vendors.every(vendor => 
    expandedVendors.value.has(getVendorKey(location, vendor))
  );
}

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
    expandedVendors.value.clear();
  } else {
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

function getVendorLocation(vendor) {
  for (const location of locations.value) {
    const locationVendors = vendorsProducts.value.filter(v => v?.location === location);
    if (locationVendors.some(v => (v.vendor_id || v.id) === (vendor.vendor_id || vendor.id))) {
      return location;
    }
  }
  return null;
}

function getVendorsForLocation(location) {
  const vendors = vendorsProducts.value;
  if (!Array.isArray(vendors)) {
    console.error('❌ vendorsProducts is not an array:', vendors);
    return [];
  }
  let locationVendors = vendors.filter(vendor => vendor?.location === location);
  if (selectedVendorFilter.value) {
    locationVendors = locationVendors.filter(vendor => 
      (vendor.vendor_id || vendor.id) === selectedVendorFilter.value
    );
  }
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

async function submitChanges() {
  try {
    isSubmitting.value = true;
    if (!Array.isArray(vendorsProducts.value) || vendorsProducts.value.length === 0) {
      throw new Error('No vendors products to update!');
    }
    const allProducts = [];
    vendorsProducts.value.forEach((vendor) => {
      if (vendor.products && Array.isArray(vendor.products)) {
        vendor.products.forEach((product) => {
          allProducts.push({
            ...product,
            vendor_id: product.vendor_id || vendor.id,
            vendor_name: vendor.vendor_name || product.vendor_name,
            location: vendor.location || product.location
          });
        });
      }
    });
    const changedProducts = allProducts.map(product => ({
      id: product.id,
      vendor_id: product.vendor_id || 1,
      product_name: product.product_name || 'Unknown Product',
      location: product.location,
      vendor_name: product.vendor_name,
      active: !!product.active,
      created_at: product.created_at,
      updated_at: product.updated_at,
      updated_by: store.state.user?.resource_owner?.email || '',
      updated_at_client: new Date().toISOString()
    }));
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
    setSmartDefaults();
  } catch (error) {
    console.error('❌ Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
}

function setSmartDefaults() {
  locations.value.forEach((location, index) => {
    expandedLocations.value.add(index);
  });
  let expandedVendorCount = 0;
  locations.value.forEach((location) => {
    const vendors = getVendorsForLocation(location);
    vendors.forEach(vendor => {
      const hasSelectedProducts = vendor.products && vendor.products.some(p => p.active);
      if (hasSelectedProducts) {
        expandedVendors.value.add(getVendorKey(location, vendor));
        const vendorId = vendor.vendor_id || vendor.id;
        vendorProductFilters.value.set(vendorId, true);
        expandedVendorCount++;
      } else {
        const vendorId = vendor.vendor_id || vendor.id;
        vendorProductFilters.value.set(vendorId, false);
      }
    });
  });
  locations.value.forEach(location => {
    const vendors = getVendorsForLocation(location);
    const hasAnySelected = vendors.some(v => v.products && v.products.some(p => p.active));
    locationFilters.value.set(location, hasAnySelected);
  });
  showShoppingList.value = expandedVendorCount > 0;
}

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* ✅ IMPORT ALL SHARED STYLES */
@import '@/assets/styles/ui-components.css';
@import '@/assets/styles/product-components.css';

/* ========================================
   COMPONENT-SPECIFIC ONLY (50 lines!)
   ======================================== */

.products-location-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/* Vendor Filter Indicator */
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
  color: #999;
  font-size: 0.75rem;
}

.vendor-filtered {
  background-color: rgba(76, 175, 80, 0.1) !important;
  border-left: 4px solid #4CAF50 !important;
}

.vendor-filter-icon {
  color: #4CAF50 !important;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Utility Classes */
.mt-4 { margin-top: 1rem; }
.mt-5 { margin-top: 1.5rem; }
.mb-4 { margin-bottom: 1rem; }
.chip-icon { margin-right: 0.25rem; }

/* Responsive */
@media (max-width: 768px) {
  .products-location-container {
    padding: 0.5rem;
  }
  
  .navigation-grid {
    grid-template-columns: 1fr;
  }
  
  .vendor-filter-indicator {
    align-items: flex-start;
    margin-left: 0;
    width: 100%;
  }
}
</style>