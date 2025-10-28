<template>
  <div class="products-location-container">
    <ConfirmDialogue ref="confirmDialogue" />
    <v-dialog 
      v-model="showProductDialog" 
      max-width="500px"
      persistent
      :z-index="2000"
    >
      <v-card>
        <v-card-title class="bg-green-darken-1 text-white">
          <div class="d-flex align-center w-100">
            <v-icon class="mr-2">mdi-plus-circle</v-icon>
            <span>Add New Product</span>
            <v-spacer></v-spacer>
            <v-btn 
              icon 
              variant="text" 
              @click="closeProductDialog"
              color="white"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-title>
      
        <v-card-text class="pa-4">
          <!-- Context Info -->
          <v-alert type="info" class="mb-4">
            <div><strong>Location:</strong> {{ selectedContext.location }}</div>
            <div><strong>Vendor:</strong> {{ selectedContext.vendorName }}</div>
          </v-alert>
        
          <!-- Form -->
          <v-form ref="productForm" v-model="productFormValid">
            <!-- Product Autocomplete -->
            <v-autocomplete
              v-model="newProduct.product_name"
              v-model:search="productSearch"
              label="Product Name"
              :items="getAllProducts"
              :rules="[requiredProductName]"
              variant="outlined"
              class="mb-3"
              clearable
              :no-data-text="getNoDataText"
              :hint="getProductHint"
              persistent-hint
              :menu-props="{ 
                attach: true,
                closeOnClick: true,
                closeOnContentClick: true,
                maxHeight: '250px',
                zIndex: 2010,
                contentClass: 'desktop-product-dropdown',
                offsetY: true,
                nudgeBottom: 4,
                transition: 'slide-y-transition'
              }"
            />
            <!-- Other Product Name -->
            <v-text-field
              v-if="newProduct.product_name === 'Other'"
              v-model="newProduct.other_product_name"
              label="Other Product Name"
              :rules="[requiredOtherProductName]"
              variant="outlined"
              class="mb-3"
              clearable
              autofocus
            />
            
            <!-- Description -->
            <v-textarea
              v-model="newProduct.description"
              label="Description (Optional)"
              variant="outlined"
              rows="3"
              class="mb-3"
            />
            
            <!-- Switch -->
            <v-switch
              v-model="newProduct.active"
              label="Add to shopping list immediately"
              color="primary"
              class="mb-3"
              :disabled="newProduct.product_name === 'Other'"
            />
            
            <!-- Hint for Other -->
            <v-alert 
              v-if="newProduct.product_name === 'Other'"
              type="info" 
              density="compact"
              class="mb-3"
            >
              New products are automatically added to your shopping list
            </v-alert>
          </v-form>
        </v-card-text>
      
        <v-card-actions class="pa-4">
          <v-btn @click="closeProductDialog" :disabled="isSubmittingProduct">
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="submitNewProduct"
            :loading="isSubmittingProduct"
            :disabled="!productFormValid"
          >
            <v-icon class="mr-1">mdi-plus</v-icon>
            Add Product
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- ✅ END OF PRODUCT DIALOG -->
    <!-- ✅ HEADER CARD -->
    <v-card class="mx-auto mt-5">
      <v-card-title class="pb-0">
        <h2>
          <i class="fas fa-map-marked-alt title-icon"></i>
          Products By Locations
        </h2>
      </v-card-title>

      <!-- ✅ NAVIGATION -->
      <div class="navigation-grid">
        <v-btn 
          variant="outlined" 
          :to="{ name: 'ProductsByVendors' }"
          prepend-icon="fas fa-store"
        >
          Shopping List By Vendor
        </v-btn>

        <v-btn 
          variant="outlined" 
          :to="{ name: 'ProductList' }"
          prepend-icon="fas fa-shopping-basket"
        >
          Shopping List By Product
        </v-btn>

        <v-btn 
          variant="outlined" 
          :to="{ name: 'ProductVendorCreate' }"
          prepend-icon="fas fa-plus"
          color="primary"
        >
          Create Vendor/Product
        </v-btn>
      </div>
    </v-card>
    <!-- ✅ LOADING STATE -->
    <div v-if="isLoading" class="text-center pa-4">
      <v-progress-circular indeterminate color="primary" />
      <p class="mt-2">Loading locations...</p>
    </div>
    <!-- ✅ MAIN CONTENT -->
    <v-card v-else class="mt-4">
      <!-- ✅ SWITCH AND VENDOR FILTER -->
      <v-card-title class="switch-container">
        <div class="switch-description-wrapper">
          <span class="switch-description-text">
            {{ showShoppingList ? 'Selected Items Only:' : 'All Items:' }}
          </span>
          <v-switch
            v-model="showShoppingList"
            color="primary"
            hide-details
            density="compact"
            class="switch-control"
          />
        </div>

        <!-- ✅ VENDOR FILTER INDICATOR -->
        <div v-if="selectedVendorFilter" class="vendor-filter-indicator">
          <v-chip
            color="success"
            variant="elevated"
            size="large"
            class="vendor-filter-chip"
            closable
            @click:close="clearVendorFilter"
          >
            <i class="fas fa-filter mr-2"></i>
            Filtering: {{ vendorFilterName }}
          </v-chip>
          <small class="vendor-filter-hint">Double-click any vendor to filter</small>
        </div>
      </v-card-title>

      <!-- ✅ MAIN CONTENT AREA -->
      <v-card-text class="content-wrapper">
        <!-- ✅ TOP SUBMIT BUTTON -->
        <div class="top-submit-section mb-4">
          <v-btn 
            @click="submitChanges"
            :loading="isSubmitting"
            color="primary"
            size="large"
            block
            class="top-submit-button"
          >
            <i class="fas fa-save save-icon"></i>
            Save All Changes
            <v-chip size="small" class="ml-2" style="color:darkblue">
              Quick Save
            </v-chip>
          </v-btn>
        </div>

        <!-- ✅ CONTENT CONTAINER -->
        <div class="content-container">
          <!-- ✅ LOCATIONS GRID -->
          <div class="locations-grid">
            <v-card
              v-for="(location, locationIndex) in filteredLocations"
              :key="locationIndex"
              :class="{ 'location-expanded': expandedLocations.has(locations.indexOf(location)) }"
              variant="outlined"
              class="location-card"
            >
              <!-- ✅ LOCATION HEADER -->
              <div 
                class="location-header" 
                @click="toggleLocation(locations.indexOf(location))"
              >
                <i class="fas fa-map-marker-alt location-marker-icon"></i>
                <span class="location-name">{{ location }}</span>
                
                <div class="location-controls">
                  <v-chip 
                    size="small" 
                    :color="expandedLocations.has(locations.indexOf(location)) ? 'primary' : 'default'"
                    class="mr-2"
                  >
                    <i class="fas fa-store chip-icon"></i>
                    {{ getVendorsForLocation(location).length }} vendors
                  </v-chip>
                  
                  <v-btn
                    v-if="expandedLocations.has(locations.indexOf(location))"
                    @click.stop="toggleAllVendorsForLocation(location)"
                    size="x-small"
                    variant="text"
                    :color="allVendorsExpandedForLocation(location) ? 'error' : 'primary'"
                    class="mr-2"
                  >
                    {{ allVendorsExpandedForLocation(location) ? 'Collapse All' : 'Expand All' }}
                  </v-btn>
                  
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
              <v-expand-transition>
                <div v-show="expandedLocations.has(locations.indexOf(location))" class="pa-4">
                  <div 
                    v-for="vendor in getVendorsForLocation(location)" 
                    :key="vendor.vendor_id || vendor.id"
                    class="vendor-section mb-4"
                  >
                    <v-card 
                      variant="outlined" 
                      class="vendor-card"
                      :class="{ 'vendor-expanded': expandedVendors.has(getVendorKey(location, vendor)) }"
                    >
                      <!-- ✅ VENDOR HEADER WITH DOUBLE-CLICK -->
                      <div 
                        class="vendor-header" 
                        @click="toggleVendor(location, vendor)"
                        @dblclick="handleVendorDoubleClick(vendor, $event)"
                        :class="{ 'vendor-filtered': selectedVendorFilter === (vendor.vendor_id || vendor.id) }"
                      >
                        <i class="fas fa-store vendor-store-icon"></i>
                        <span class="vendor-name">{{ vendor.vendor_name }}</span>
                        
                        <!-- ✅ FILTER INDICATOR -->
                        <i v-if="selectedVendorFilter === (vendor.vendor_id || vendor.id)" 
                           class="fas fa-filter vendor-filter-icon mr-2"></i>
                        
                        <div class="vendor-controls">
                          <v-chip 
                            size="small" 
                            :color="expandedVendors.has(getVendorKey(location, vendor)) ? 'secondary' : 'default'"
                            class="mr-2"
                          >
                            <i class="fas fa-box chip-icon"></i>
                            {{ getFilteredProducts(vendor).length }} products
                          </v-chip>
                          
                          <v-btn
                            @click.stop="editVendor(vendor)"
                            size="x-small"
                            variant="text"
                            color="info"
                            class="mr-2"
                          >
                            <i class="fas fa-edit"></i>
                            <span class="edit-hint ml-1">Edit</span>
                          </v-btn>
                          
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
                      <v-expand-transition>
                        <div v-show="expandedVendors.has(getVendorKey(location, vendor))" class="pa-4">
                          <div class="products-header mb-3">
                            <div class="products-header-content">
                              <div class="products-title">
                                <h4 
                                  class="products-clickable-title"
                                  @dblclick="openProductDialog(location, vendor)"
                                >
                                  <i class="fas fa-box products-icon"></i>
                                  Products
                                  <v-chip size="small" color="info" class="ml-2">
                                    {{ getFilteredProducts(vendor).length }} items
                                  </v-chip>

                                  <!-- ✅ ADD SINGLE CLICK ON PLUS ICON AS BACKUP -->
                                  <v-icon 
                                    size="small" 
                                    color="success"
                                    class="ml-2 add-product-hint"
                                    title="Double-click to add new product OR click this plus"
                                    @click.stop="openProductDialog(location, vendor)"
                                  >
                                    mdi-plus-circle
                                  </v-icon>
                                </h4>
                              </div>
                            
                              <!-- Vendor-specific filter switch -->
                              <div class="vendor-product-filter">
                                <div class="vendor-filter-wrapper">
                                  <span class="vendor-filter-text">
                                    {{ getVendorProductFilter(vendor) ? 'Selected Only:' : 'All Items:' }}
                                  </span>
                                  <v-switch
                                    :model-value="getVendorProductFilter(vendor)"
                                    @update:model-value="setVendorProductFilter(vendor, $event)"
                                    color="secondary"
                                    hide-details
                                    density="compact"
                                    class="vendor-switch-control"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>              
                          <!-- ✅ PRODUCTS LIST (UNCHANGED) -->
                          <div v-if="getFilteredProducts(vendor).length > 0" class="products-list">
                            <v-card
                              v-for="(product, productIndex) in getFilteredProducts(vendor)"
                              :key="product.id"
                              variant="outlined"
                              class="product-card pa-3"
                              :class="{
                                'product-selected': product.active,
                                'product-multi-selected': selectedProducts.has(product.id)
                              }"
                              @click="handleProductClick(product, $event, productIndex, getFilteredProducts(vendor))"
                            >
                              <div class="d-flex align-center">
                                <div class="product-indicators mr-3">
                                  <i 
                                    v-if="product.active" 
                                    class="fas fa-check-circle selected-indicator"
                                  ></i>
                                </div>
                                
                                <span class="product-name">{{ product.product_name }}</span>
                                
                                <v-btn
                                  @click.stop="editProduct(product)"
                                  size="x-small"
                                  variant="text"
                                  color="info"
                                  class="ml-auto"
                                >
                                  <i class="fas fa-edit"></i>
                                  <span class="edit-hint ml-1">Edit</span>
                                </v-btn>
                              </div>
                            </v-card>
                          </div>
                        
                          <!-- ✅ NO PRODUCTS STATE (UNCHANGED) -->
                          <div v-else class="no-products">
                            <i class="fas fa-inbox no-products-icon"></i>
                            <p>{{ getVendorProductFilter(vendor) ? 'No selected products' : 'No products available' }} for this vendor</p>
                          </div>
                        </div>
                      </v-expand-transition>
                    </v-card>
                  </div>

                  <!-- ✅ NO VENDORS STATE -->
                  <div v-if="getVendorsForLocation(location).length === 0" class="no-vendors">
                    <i class="fas fa-store-slash no-vendors-icon"></i>
                    <h4>No vendors in {{ location }}</h4>
                  </div>
                </div>
              </v-expand-transition>
            </v-card>
          </div>

          <!-- ✅ GLOBAL CONTROLS (RIGHT SIDE) -->
          <div class="global-controls-fixed">
            <div class="global-controls">
              <h4 class="controls-title">
                <i class="fas fa-cogs"></i>
                Quick Controls
              </h4>
              
              <v-btn
                @click="toggleAllLocations"
                variant="outlined"
                size="small"
                prepend-icon="fas fa-map-marker-alt"
                class="control-btn"
                :color="allLocationsExpanded ? 'error' : 'primary'"
              >
                {{ allLocationsExpanded ? 'Collapse Locations' : 'Expand Locations' }}
              </v-btn>

              <v-btn
                @click="toggleAllVendors"
                variant="outlined"
                size="small"
                prepend-icon="fas fa-store"
                class="control-btn"
                :disabled="!hasAnyExpandedLocations"
                :color="allVendorsExpanded ? 'error' : 'primary'"
              >
                {{ allVendorsExpanded ? 'Collapse All Vendors' : 'Expand All Vendors' }}
              </v-btn>
            </div>
          </div>
        </div>
        
        <!-- ✅ BOTTOM SAVE BUTTON -->
        <v-btn 
          @click="submitChanges"
          :loading="isSubmitting"
          color="primary"
          size="large"
          block
          class="mt-4 mb-safe-area"
        >
          <i class="fas fa-save save-icon"></i>
          Save All Changes
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';
import { VProgressCircular } from 'vuetify/components'

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

const allVendorsExpanded = computed(() => {
  if (expandedLocations.value.size === 0) return false;
  
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
  console.log('🎯 🎯 🎯 DOUBLE CLICK DETECTED! 🎯 🎯 🎯');
  console.log('📍 Location:', location);
  console.log('🏪 Vendor:', vendor.vendor_name, vendor);
  console.log('📱 User agent:', navigator.userAgent);
  console.log('📱 Is mobile:', /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  
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
  
  console.log('📱 Dialog state set to:', showProductDialog.value);
  console.log('📱 Products available:', getAllProducts.value.length);
  console.log('📱 Selected context:', selectedContext.value);

  // Force dialog visibility with timeout
  setTimeout(() => {
    const dialogs = document.querySelectorAll('.v-dialog');
    console.log('📱 Found dialogs after timeout:', dialogs.length);
    
    if (dialogs.length === 0) {
      console.error('❌ No dialog found in DOM!');
      alert('❌ Dialog not found - there may be a template issue');
    } else {
      dialogs.forEach((dialog, i) => {
        console.log(`📱 Dialog ${i}:`, dialog);
        dialog.style.zIndex = '9999';
        dialog.style.display = 'flex';
        dialog.style.visibility = 'visible';
        dialog.style.opacity = '1';
      });
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
    
    console.log('🚀 Creating new product:', productData);
    
    // ✅ New: Dispatch createProduct action
    const result = await store.dispatch('createProduct', productData);
    
    console.log('📝 Create product result:', result);
    // && result !== null && result !== undefined)
    if (result !== false) {
      console.log('✅ Product created successfully');

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
// ✅ VENDOR-SPECIFIC PRODUCT FILTER FUNCTIONS
function getVendorProductFilter(vendor) {
  const vendorId = vendor.vendor_id || vendor.id;
  return vendorProductFilters.value.get(vendorId) ?? showShoppingList.value;
}

function setVendorProductFilter(vendor, value) {
  const vendorId = vendor.vendor_id || vendor.id;
  vendorProductFilters.value.set(vendorId, value);
}

// ✅ SINGLE getFilteredProducts FUNCTION - USES VENDOR-SPECIFIC FILTER
function getFilteredProducts(vendor) {
  if (!vendor || !vendor.products || !Array.isArray(vendor.products)) {
    console.warn('❌ Invalid vendor products:', vendor);
    return [];
  }
  
  // Use vendor-specific filter instead of global
  const showSelectedOnly = getVendorProductFilter(vendor);
  
  return showSelectedOnly 
    ? vendor.products.filter(product => product?.active)
    : vendor.products;
}

// ✅ HIERARCHICAL DROPDOWN FUNCTIONS
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
    console.log(`🎯 Filtering by vendor: ${vendor.vendor_name} (ID: ${vendorId})`);
    autoExpandLocationsWithVendor(vendorId);
  }
}

function clearVendorFilter() {
  selectedVendorFilter.value = null;
  vendorFilterName.value = '';
  console.log('🔄 Cleared vendor filter - showing all vendors');
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
  if (allVendorsExpanded.value) {
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

function toggleAllVendorsForLocation(location) {
  const vendors = getVendorsForLocation(location);
  const allExpanded = vendors.every(vendor => 
    expandedVendors.value.has(getVendorKey(location, vendor))
  );
  
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
function testDialogOpen() {
  console.log('🧪 TESTING DIALOG OPEN');
  
  const testLocation = 'Austin';
  const testVendor = {
    vendor_name: 'Test Vendor',
    vendor_id: 1,
    id: 1
  };
  
  console.log('🧪 Calling openProductDialog with test data...');
  openProductDialog(testLocation, testVendor);
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

// ✅ SUBMIT AND DATA FUNCTIONS
async function submitChanges() {
  try {
    isSubmitting.value = true;
    
    console.log('🔍 PRE-SUBMIT DEBUG:');
    console.log('- vendorsProducts.value:', vendorsProducts.value);
    
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
          
          console.log(`📋 Vendor ${vendorIndex}, Product ${productIndex}: "${product.product_name}" - Active: ${product.active}`);
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
    
    console.log('🚀 Submitting all product states:', submitData);
    
    const result = await store.dispatch('putProducts', submitData);
    
    if (result !== false) {
      console.log('✅ All product states updated successfully');
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

// ✅ ENHANCED: FETCH DATA TO INCLUDE PRODUCTS GROUP
async function fetchData() {
  isLoading.value = true;
  
  try {
    const promises = [
      store.dispatch('fetchVendorsProducts'),
      store.dispatch('fetchVendorsLocationsGroup'),
      store.dispatch('fetchShoppingList'),
      store.dispatch('fetchVendorsProductsGroup') // ✅ ADD THIS FOR AUTOCOMPLETE
    ];
    
    await Promise.all(promises);
    
  } catch (error) {
    console.error('❌ Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
}

function debugDesktopDropdown() {
  console.log('🔍 DESKTOP DROPDOWN DEBUG:');
  console.log('- Window width:', window.innerWidth);
  console.log('- Is mobile detected:', /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  console.log('- Products available:', getAllProducts.value);
  console.log('- Dialog visible:', showProductDialog.value);
  
  // Check autocomplete elements
  const autocomplete = document.querySelector('.v-autocomplete');
  const menu = document.querySelector('.v-menu');
  const dropdown = document.querySelector('.desktop-product-dropdown');
  
  console.log('- Autocomplete found:', !!autocomplete);
  console.log('- Menu found:', !!menu);
  console.log('- Dropdown found:', !!dropdown);
  
  if (autocomplete) {
    const field = autocomplete.querySelector('.v-field');
    const input = autocomplete.querySelector('input');
    console.log('- Field found:', !!field);
    console.log('- Input found:', !!input);
    
    if (input) {
      console.log('- Input value:', input.value);
      console.log('- Input focused:', document.activeElement === input);
    }
  }
  
  if (menu) {
    const computed = window.getComputedStyle(menu);
    console.log('- Menu display:', computed.display);
    console.log('- Menu z-index:', computed.zIndex);
    console.log('- Menu position:', computed.position);
  }
}

// ✅ MAKE IT AVAILABLE IN CONSOLE
onMounted(() => {
  fetchData();
});

</script>

<style scoped>
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