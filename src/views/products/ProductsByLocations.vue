<template>
  <div class="products-location-container">
    <ConfirmDialogue ref="confirmDialogue" />
    <v-card class="mx-auto mt-5">
      <v-card-title class="pb-0">
        <h2>Products By Locations</h2>
      </v-card-title>

      <!-- ✅ NAVIGATION (unchanged) -->
      <div class="navigation-grid">
        <v-btn 
          variant="outlined" 
          :to="{ name: 'ProductsByVendors' }"
          prepend-icon="mdi-store"
        >
          Shopping List By Vendor
        </v-btn>

        <v-btn 
          variant="outlined" 
          :to="{ name: 'ProductList' }"
          prepend-icon="mdi-cart"
        >
          Shopping List By Product
        </v-btn>

        <v-btn 
          variant="outlined" 
          :to="{ name: 'ProductVendorCreate' }"
          prepend-icon="mdi-plus"
          color="primary"
        >
          Create Vendor/Product
        </v-btn>
      </div>
    </v-card>

    <!-- ✅ LOADING STATE (unchanged) -->
    <div v-if="isLoading" class="text-center pa-4">
      <v-progress-circular indeterminate color="primary" />
      <p class="mt-2">Loading locations...</p>
    </div>

    <!-- ✅ MAIN CONTENT WITH HIERARCHICAL CONTROLS -->
    <v-card v-else class="mt-4">
      <v-card-title class="d-flex justify-space-between align-center">
        <v-switch
          v-model="showShoppingList"
          :label="`Show: ${showShoppingList ? 'All Items' : 'Selected Items'}`"
          color="primary"
          hide-details
          density="compact"
        />

        <!-- ✅ GLOBAL CONTROLS -->
      <!-- ✅ ENHANCED GLOBAL CONTROLS -->
      <div class="global-controls-wrapper">
        <div class="global-controls">
          <v-btn
            @click="toggleAllLocations"
            variant="outlined"
            size="small"
            prepend-icon="mdi-map-marker"
            class="control-btn"
            :color="allLocationsExpanded ? 'error' : 'primary'"
            style="width: 20rem;"
          >
            {{ allLocationsExpanded ? 'Collapse All Locations' : 'Expand All Locations' }}
          </v-btn>

          <v-btn
            @click="toggleAllVendors"
            variant="outlined"
            size="small"
            prepend-icon="mdi-store"
            class="control-btn"
            :disabled="!hasAnyExpandedLocations"
            :color="allVendorsExpanded ? 'error' : 'primary'"
            style="width: 20rem;"
          >
            {{ allVendorsExpanded ? 'Collapse All Vendors' : 'Expand All Vendors' }}
          </v-btn>
        </div>
      </div>        
      </v-card-title>

      <v-card-text>
        <div class="locations-grid">
          <!-- ✅ LOCATION CARDS WITH ENHANCED DROPDOWN SYSTEM -->
          <v-card
            v-for="(location, locationIndex) in locations"
            :key="locationIndex"
            :class="{ 'location-expanded': expandedLocations.has(locationIndex) }"
            variant="outlined"
            class="location-card"
          >
            <!-- ✅ LOCATION HEADER WITH CONTROLS -->
            <v-card-title 
              @click="toggleLocation(locationIndex)"
              class="location-header"
            >
              <v-icon start>mdi-map-marker</v-icon>
              <span class="location-name">{{ location }}</span>
              
              <div class="location-controls">
                <v-chip 
                  size="small" 
                  color="primary"
                  variant="outlined"
                >
                  {{ getVendorsForLocation(location).length }} vendors
                </v-chip>

                <!-- ✅ LOCATION-SPECIFIC VENDOR CONTROLS -->
                <v-btn
                  v-if="expandedLocations.has(locationIndex)"
                  @click.stop="toggleAllVendorsForLocation(location)"
                  variant="text"
                  size="x-small"
                  :color="allVendorsExpandedForLocation(location) ? 'error' : 'primary'"
                >
                  {{ allVendorsExpandedForLocation(location) ? 'Collapse All' : 'Expand All' }}
                </v-btn>

                <v-icon>
                  {{ expandedLocations.has(locationIndex) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                </v-icon>
              </div>
            </v-card-title>

            <!-- ✅ EXPANDABLE LOCATION CONTENT -->
            <v-expand-transition>
              <v-card-text v-show="expandedLocations.has(locationIndex)">
                
                <!-- ✅ VENDORS DROPDOWN SYSTEM -->
                <div 
                  v-for="vendor in getVendorsForLocation(location)"
                  :key="vendor.vendor_name"
                  class="vendor-section mb-3"
                >
                  <v-card 
                    variant="tonal" 
                    class="vendor-card"
                    :class="{ 'vendor-expanded': expandedVendors.has(getVendorKey(location, vendor)) }"
                  >
                    <!-- ✅ VENDOR HEADER WITH DROPDOWN -->
                    <v-card-title 
                      @click="toggleVendor(location, vendor)"
                      @dblclick.stop="editVendor(vendor)"
                      class="vendor-header"
                    >
                      <v-icon start>mdi-store</v-icon>
                      <span class="vendor-name">{{ vendor.vendor_name }}</span>
                      
                      <div class="vendor-controls">
                        <v-chip 
                          size="small" 
                          :color="getFilteredProducts(vendor).length > 0 ? 'success' : 'warning'"
                          variant="outlined"
                        >
                          {{ getFilteredProducts(vendor).length }} products
                        </v-chip>

                        <v-tooltip text="Double-click to edit vendor">
                          <template v-slot:activator="{ props }">
                            <v-icon 
                              v-bind="props"
                              size="small"
                              class="edit-hint"
                            >
                              mdi-pencil-outline
                            </v-icon>
                          </template>
                        </v-tooltip>

                        <v-icon>
                          {{ expandedVendors.has(getVendorKey(location, vendor)) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                        </v-icon>
                      </div>
                    </v-card-title>

                    <!-- ✅ EXPANDABLE VENDOR PRODUCTS -->
                    <v-expand-transition>
                      <v-card-text v-show="expandedVendors.has(getVendorKey(location, vendor))">
                        <div class="products-header mb-3">
                          <h4>Products for {{ vendor.vendor_name }}</h4>
                          <v-divider class="mt-2"></v-divider>
                        </div>

                        <!-- ✅ PRODUCTS LIST -->
                        <div class="products-list">
                          <v-card
                            v-for="(product, productIndex) in getFilteredProducts(vendor)"
                            :key="product.id"
                            @click.stop="handleProductClick(product, $event, productIndex, getFilteredProducts(vendor))"
                            @dblclick.stop="editProduct(product)"
                            :class="{ 
                              'product-selected': product.active,
                              'product-multi-selected': selectedProducts.has(product.id)
                            }"
                            variant="outlined"
                            class="product-card"
                            hover
                          >
                            <v-card-text class="py-3">
                              <div class="d-flex align-center">
                                <!-- ✅ ACTIVE STATE CHECKBOX -->
                                <v-checkbox
                                  :model-value="product.active"
                                  color="primary"
                                  density="compact"
                                  hide-details
                                  readonly
                                  class="mr-3"
                                />
                                
                                <span class="product-name">{{ product.product_name }}</span>
                                
                                <!-- ✅ VISUAL INDICATORS -->
                                <div class="product-indicators">
                                  <v-icon 
                                    v-if="selectedProducts.has(product.id)"
                                    color="secondary"
                                    size="small"
                                  >
                                    mdi-check-circle
                                  </v-icon>

                                  <v-tooltip text="Edit Product">
                                    <template v-slot:activator="{ props }">
                                      <v-btn
                                        @click.stop="editProduct(product)"
                                        variant="text"
                                        size="small"
                                        color="primary"
                                      >
                                        <v-icon 
                                          v-bind="props"
                                          size="x-small"
                                          class="edit-hint ml-2"
                                        >
                                          mdi-pencil-outline
                                        </v-icon>
                                        Edit
                                      </v-btn>
                                    </template>
                                  </v-tooltip>
                                </div>
                              </div>
                            </v-card-text>
                          </v-card>
                        </div>

                        <!-- ✅ NO PRODUCTS MESSAGE -->
                        <div v-if="getFilteredProducts(vendor).length === 0" class="no-products">
                          <v-icon color="grey">mdi-package-variant-remove</v-icon>
                          <span class="text-medium-emphasis">
                            {{ showShoppingList ? 'No active products' : 'No products found' }}
                          </span>
                        </div>
                      </v-card-text>
                    </v-expand-transition>
                  </v-card>
                </div>
                <!-- ✅ NO VENDORS MESSAGE -->
                <div v-if="getVendorsForLocation(location).length === 0" class="no-vendors">
                  <v-icon color="grey" size="large">mdi-store-remove</v-icon>
                  <h4 class="text-medium-emphasis">No vendors found for {{ location }}</h4>
                </div>
              </v-card-text>
            </v-expand-transition>
          </v-card>
        </div>
        
        <!-- ✅ SAVE BUTTON -->
        <v-btn 
          @click="submitChanges"
          :loading="isSubmitting"
          color="primary"
          size="large"
          block
          class="mt-4"
        >
          <v-icon start>mdi-content-save</v-icon>
          Save All Changes
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
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

// ✅ HIERARCHICAL DROPDOWN STATE
const expandedLocations = ref(new Set()); // Track which locations are expanded
const expandedVendors = ref(new Set());   // Track which vendors are expanded
const selectedProducts = ref(new Set());
const lastSelectedIndex = ref(null);

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

// ✅ EXISTING COMPUTED PROPERTIES (unchanged)
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

// ✅ HIERARCHICAL DROPDOWN FUNCTIONS

function getVendorKey(location, vendor) {
  return `${location}-${vendor.vendor_name}-${vendor.vendor_id || vendor.id}`;
}

function toggleLocation(locationIndex) {
  if (expandedLocations.value.has(locationIndex)) {
    expandedLocations.value.delete(locationIndex);
    // Also collapse all vendors in this location
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

function toggleAllLocations() {
  if (allLocationsExpanded.value) {
    // Collapse all locations and vendors
    expandedLocations.value.clear();
    expandedVendors.value.clear();
  } else {
    // Expand all locations
    locations.value.forEach((location, index) => {
      expandedLocations.value.add(index);
    });
  }
}

function toggleAllVendors() {
  if (allVendorsExpanded.value) {
    // Collapse all vendors
    expandedVendors.value.clear();
  } else {
    // Expand all vendors in expanded locations
    expandedLocations.value.forEach(locationIndex => {
      const location = locations.value[locationIndex];
      const vendors = getVendorsForLocation(location);
      vendors.forEach(vendor => {
        expandedVendors.value.add(getVendorKey(location, vendor));
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
    // Collapse all vendors for this location
    vendors.forEach(vendor => {
      expandedVendors.value.delete(getVendorKey(location, vendor));
    });
  } else {
    // Expand all vendors for this location
    vendors.forEach(vendor => {
      expandedVendors.value.add(getVendorKey(location, vendor));
    });
  }
}

function allVendorsExpandedForLocation(location) {
  const vendors = getVendorsForLocation(location);
  return vendors.length > 0 && vendors.every(vendor => 
    expandedVendors.value.has(getVendorKey(location, vendor))
  );
}

// ✅ EXISTING FUNCTIONS (unchanged)
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
  
  return vendors.filter(vendor => vendor?.location === location);
}

function getFilteredProducts(vendor) {
  if (!vendor || !vendor.products || !Array.isArray(vendor.products)) {
    console.warn('❌ Invalid vendor products:', vendor);
    return [];
  }
  
  return showShoppingList.value 
    ? vendor.products.filter(product => product?.active)
    : vendor.products;
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
  isSubmitting.value = true;
  
  try {
    const vendors = vendorsProducts.value;
    
    if (!Array.isArray(vendors)) {
      console.error('❌ Cannot submit: vendors data is not an array:', vendors);
      throw new Error('Invalid data structure for submission');
    }
    
    const payload = {
      ...vendors,
      id: uuidv4(),
      created_by: store.state.user?.resource_owner?.email || 'unknown',
    };
    
    await store.dispatch('updateVendorsProducts', payload);
    alert('✅ Update completed');
    
  } catch (error) {
    console.error('❌ Submit error (but continuing):', error);
  }
  
  try {
    await fetchData();
    console.log('✅ Products refreshed');
  } catch (refreshError) {
    console.error('❌ Refresh failed:', refreshError);
  }
  
  isSubmitting.value = false;
}

async function fetchData() {
  isLoading.value = true;
  
  try {
    const promises = [
      store.dispatch('fetchVendorsProducts'),
      store.dispatch('fetchVendorsLocationsGroup'),
      store.dispatch('fetchShoppingList')
    ];
    
    await Promise.all(promises);
    
  } catch (error) {
    console.error('❌ Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* ✅ EXISTING STYLES */
.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.locations-grid {
  display: grid;
  gap: 1.5rem;
}

/* ✅ ENHANCED LOCATION CARD STYLES */
.location-card {
  transition: all 0.3s ease;
  border: 1px solid /*transparent*/
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
}

.location-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* ✅ GLOBAL CONTROLS */
.global-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
/* ✅ ENHANCED STACKED CONTROLS */
.global-controls-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.global-controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: stretch;
  min-width: 240px;
  background: rgba(var(--v-theme-surface), 0.8);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
  backdrop-filter: blur(10px);
}

.control-btn {
  transition: all 0.3s ease !important;
  font-weight: 500 !important;
  letter-spacing: 0.025em !important;
}

.control-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}

.control-btn:disabled {
  opacity: 0.4 !important;
  transform: none !important;
}

/* ✅ RESPONSIVE BEHAVIOR */
@media (max-width: 768px) {
  .global-controls {
    min-width: 200px;
    padding: 0.75rem;
    gap: 0.5rem;
  }
  
  .control-btn {
    font-size: 0.875rem !important;
  }
}

@media (max-width: 480px) {
  .global-controls-wrapper {
    justify-content: center;
  }
  
  .global-controls {
    min-width: 100%;
    max-width: 280px;
  }
}
/* ✅ ENHANCED VENDOR STYLES */
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
}

.vendor-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-hint {
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.edit-hint:hover {
  opacity: 1;
}

/* ✅ PRODUCTS STYLES */
.products-header h4 {
  color: rgb(var(--v-theme-secondary));
  font-weight: 500;
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
}

.product-indicators {
  display: flex;
  align-items: center;
}

/* ✅ EMPTY STATES */
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

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .navigation-grid {
    grid-template-columns: 1fr;
  }
  
  .global-controls {
    flex-direction: column;
    gap: 0.25rem;
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
}

@media (max-width: 480px) {
  .location-header,
  .vendor-header {
    padding: 0.5rem;
  }
  
  .vendor-section {
    padding-left: 0.5rem;
    margin-left: 0.25rem;
  }
}
</style>