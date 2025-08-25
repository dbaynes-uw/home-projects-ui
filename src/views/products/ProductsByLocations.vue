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

    <!-- ✅ MAIN CONTENT -->
    <v-card v-else class="mt-4">
      <v-card-title class="d-flex justify-space-between align-center">
        <!-- ✅ CLEAN SINGLE CONTROL - Remove Multi-Select switch -->
        <v-switch
          v-model="showShoppingList"
          :label="`Show: ${showShoppingList ? 'Selected Items' : 'All Items'}`"
          color="primary"
          hide-details
          density="compact"
        />
      </v-card-title>

      <v-card-text>
        <div class="locations-grid">
          <v-card
            v-for="(location, index) in locations"
            :key="index"
            @click="toggleLocation(index)"
            @dblclick="navigateToLocation(location)"
            :class="{ 'location-expanded': expandedLocation === index }"
            variant="outlined"
            class="location-card"
            hover
          >
            <v-card-title class="location-header">
              <v-icon start>mdi-map-marker</v-icon>
              {{ location }}
              <v-spacer />
              <v-icon>
                {{ expandedLocation === index ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
            </v-card-title>

            <v-expand-transition>
              <v-card-text v-show="expandedLocation === index">
                <div 
                  v-for="vendor in getVendorsForLocation(location)"
                  :key="vendor.vendor_name"
                  class="vendor-section mb-4"
                >
                  <v-card variant="tonal" class="mb-2">
                    <v-card-title 
                      @dblclick="editVendor(vendor)"
                      class="vendor-title"
                    >
                      <v-icon start>mdi-store</v-icon>
                      {{ vendor.vendor_name }}
                      <v-chip size="small" color="primary">
                        {{ getProductCount(vendor) }} products
                      </v-chip>
                    </v-card-title>

                    <v-card-text>
                      <!-- ✅ PRODUCTS LIST - Remove isMultiSelectMode references -->
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
                              
                              <!-- ✅ VISUAL INDICATOR FOR MULTI-SELECT -->
                              <v-icon 
                                v-if="selectedProducts.has(product.id)"
                                color="secondary"
                                size="small"
                                class="ml-auto"
                              >
                                mdi-check-circle
                              </v-icon>
                            </div>
                          </v-card-text>
                        </v-card>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </v-card-text>
            </v-expand-transition>
          </v-card>
        </div>
        
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

// ✅ CLEAN STATE - Remove isMultiSelectMode
const showShoppingList = ref(true);
const expandedLocation = ref(null);
const isLoading = ref(true);
const isSubmitting = ref(false);
const confirmDialogue = ref(null);

// ✅ KEEP MULTI-SELECT STATE (for Ctrl/Shift functionality)
const selectedProducts = ref(new Set());
const lastSelectedIndex = ref(null);

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

// ✅ UPDATED - Remove isMultiSelectMode checks, keep functionality
function handleProductClick(product, event, productIndex, vendorProducts) {
  if (event?.shiftKey && lastSelectedIndex.value !== null) {
    // Shift-click: select range (works anytime)
    const start = Math.min(lastSelectedIndex.value, productIndex);
    const end = Math.max(lastSelectedIndex.value, productIndex);
    
    for (let i = start; i <= end; i++) {
      if (vendorProducts[i]) {
        selectedProducts.value.add(vendorProducts[i].id);
      }
    }
  } else if (event?.ctrlKey || event?.metaKey) {
    // Ctrl/Cmd-click: toggle individual selection (works anytime)
    if (selectedProducts.value.has(product.id)) {
      selectedProducts.value.delete(product.id);
    } else {
      selectedProducts.value.add(product.id);
    }
    lastSelectedIndex.value = productIndex;
  } else {
    // Normal click: toggle product active state
    product.active = !product.active;
    updateProduct(product);
    
    // Clear visual selections when toggling directly
    selectedProducts.value.clear();
    lastSelectedIndex.value = null;
  }
}

// ✅ ALL OTHER FUNCTIONS STAY EXACTLY THE SAME
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

function getProductCount(vendor) {
  const products = getFilteredProducts(vendor);
  return Array.isArray(products) ? products.length : 0;
}

function toggleLocation(index) {
  expandedLocation.value = expandedLocation.value === index ? null : index;
}

function navigateToLocation(location) {
  router.push({ 
    name: 'ProductsLocationList', 
    params: { location } 
  });
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
    
    //console.log('📤 Submitting payload:', payload);
    
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
.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.locations-grid {
  display: grid;
  gap: 1rem;
}

.location-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.location-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.location-expanded {
  border-color: rgb(var(--v-theme-primary));
}

.location-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.vendor-section {
  border-left: 3px solid rgb(var(--v-theme-primary));
  padding-left: 1rem;
}

.vendor-title {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.vendor-title:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.products-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.5rem;
}

/* ✅ ADD MISSING PRODUCT CARD STYLES */
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

/* ✅ RESPONSIVE */
@media (max-width: 600px) {
  .navigation-grid {
    grid-template-columns: 1fr;
  }
  
  .products-list {
    grid-template-columns: 1fr;
  }
}
</style>