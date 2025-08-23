<template>
  <div class="products-location-container">

    <ConfirmDialogue ref="confirmDialogue" />
    
    <v-card class="mx-auto mt-5">
      <v-card-title class="pb-0">
        <h2>Products By Locations</h2>
      </v-card-title>

      <!-- ✅ MODERN NAVIGATION -->
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

    <!-- ✅ LOADING STATE -->
    <div v-if="isLoading" class="text-center pa-4">
      <v-progress-circular indeterminate color="primary" />
      <p class="mt-2">Loading locations...</p>
    </div>

    <!-- ✅ CLEAN MODERN UI -->
    <v-card v-else class="mt-4">
      <v-card-title class="d-flex justify-space-between align-center">
        <h2>Double click location to see products</h2>

        <v-switch
          v-model="showShoppingList"
          :label="`Show: ${showShoppingList ? 'Selected Items' : 'All Items'}`"
          color="primary"
          hide-details
        />
      </v-card-title>

      <v-card-text>
        <!-- ✅ CLEAN LOCATION GRID -->
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

            <!-- ✅ VENDOR PRODUCTS INSIDE LOCATION -->
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
                      <div class="products-list">
                        <v-checkbox
                          v-for="product in getFilteredProducts(vendor)"
                          :key="product.id"
                          v-model="product.active"
                          :label="product.product_name"
                          @update:model-value="updateProduct(product)"
                          @dblclick="editProduct(product)"
                          color="primary"
                          density="compact"
                          class="product-checkbox"
                        />
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </v-card-text>
            </v-expand-transition>
          </v-card>
        </div>

        <!-- ✅ MODERN SUBMIT -->
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

// ✅ COMPOSITION API
const router = useRouter();
const store = useStore();

// ✅ REACTIVE STATE
const showShoppingList = ref(true);
const expandedLocation = ref(null);
const isLoading = ref(true);
const isSubmitting = ref(false);
const confirmDialogue = ref(null);

// ✅ COMPUTED PROPERTIES
const vendorsProducts = computed(() => store.state.vendors_products || []);
const vendorsLocationsGroup = computed(() => store.state.vendors_locations_group?.vendorsLocationsGroup || []);

const locations = computed(() => vendorsLocationsGroup.value);

// ✅ CLEAN METHODS
function getVendorsForLocation(location) {
  return vendorsProducts.value.filter(vendor => vendor.location === location);
}

function getFilteredProducts(vendor) {
  if (!vendor.products) return [];
  
  return showShoppingList.value 
    ? vendor.products.filter(product => product.active)
    : vendor.products;
}

function getProductCount(vendor) {
  return getFilteredProducts(vendor).length;
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
    params: { id: vendor.id } 
  });
}

function editProduct(product) {
  router.push({ 
    name: 'ProductEdit', 
    params: { id: product.id } 
  });
}

function updateProduct(product) {
  console.log(`Updated ${product.product_name}:`, product.active);
}

async function submitChanges() {
  isSubmitting.value = true;
  
  try {
    const payload = {
      ...vendorsProducts.value,
      id: uuidv4(),
      created_by: store.state.user.resource_owner.email,
    };
    
    const success = await store.dispatch('updateVendorsProducts', payload);
    
    if (success) {
      console.log('✅ Products updated successfully!');
      // ✅ REFRESH DATA PROPERLY
      await fetchData();
    } else {
      throw new Error('Failed to update products');
    }
  } catch (error) {
    console.error('❌ Error updating products:', error);
  } finally {
    isSubmitting.value = false;
  }
}

async function fetchData() {
  isLoading.value = true;
  
  try {
    await Promise.all([
      store.dispatch('fetchVendorsProducts'),
      store.dispatch('fetchVendorsLocationsGroup'),
      store.dispatch('fetchShoppingList')
    ]);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
}

// ✅ LIFECYCLE
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

.product-checkbox {
  cursor: pointer;
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