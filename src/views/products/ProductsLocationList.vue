<template>
  <ConfirmDialogue ref="confirmDialogue" />
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Products for {{ route.params.location }}</h2>
      <h3>Products Location List</h3>
    </v-card-title>
    
    <!-- ✅ STREAMLINED - Navigation buttons -->
    <div class="navigation-grid">
      <v-btn 
        variant="outlined" 
        :to="{ name: 'ProductsByLocations' }"
        prepend-icon="mdi-map-marker-multiple"
      >
        Products By Locations
      </v-btn>
      
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

  <v-card class="mt-4">
    <v-card-title class="d-flex justify-space-between align-center">
      <h1>{{ route.params.location }}</h1>
      
      <!-- ✅ MODERN - Toggle with proper styling -->
      <v-switch
        v-model="showShoppingList"
        label="Shopping List Only"
        color="primary"
        hide-details
      />
    </v-card-title>
    
    <v-card-text>
      <!-- ✅ LOADING STATE -->
      <div v-if="isLoading" class="text-center pa-4">
        <v-progress-circular indeterminate color="primary" />
        <p class="mt-2">Loading products...</p>
      </div>
      
      <!-- ✅ STREAMLINED - Product display -->
        <div v-else class="vendors-container" :key="refreshKey">
          <div 
            v-for="vendor in groupedProducts" 
            :key="`${vendor.vendor_name}-${refreshKey}`"
            class="vendor-section"
          >
          <v-card variant="outlined" class="mb-4">
            <v-card-title class="vendor-header">
              <v-icon start>mdi-store</v-icon>
              {{ vendor.vendor_name }}
              <v-chip size="small" color="primary">
                {{ vendor.products.length }} products
              </v-chip>
            </v-card-title>
            
            <v-card-text>
              <div class="products-grid">
                <div 
                  v-for="product in vendor.products" 
                  :key="product.id"
                  class="product-item"
                >
                  <v-checkbox
                    v-model="product.active"
                    :label="product.product_name"
                    @update:model-value="updateProductStatus(product)"
                    @dblclick="editProduct(product)"
                    color="primary"
                    density="compact"
                  />
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </div>
      
      <!-- ✅ SUBMIT BUTTON -->
      <v-btn 
        @click="submitChanges"
        :loading="isSubmitting"
        color="primary"
        size="large"
        block
        class="mt-4"
      >
        <v-icon start>mdi-content-save</v-icon>
        Save Changes
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

const route = useRoute();
const router = useRouter();
const store = useStore();

// ✅ REACTIVE STATE
const refreshKey = ref(0);
const showShoppingList = ref(true);
const isLoading = ref(true);
const isSubmitting = ref(false);
const confirmDialogue = ref(null);

// ✅ TRACK LOCAL CHANGES
const localProductChanges = ref(new Map()); // productId -> { active: boolean }

// ✅ GET FRESH DATA BUT PRESERVE LOCAL CHANGES
const productsByLocation = computed(() => {
  const storeData = store.state.products_by_location;
  if (!storeData) return [];
  
  // Deep clone to break references
  const clonedData = JSON.parse(JSON.stringify(storeData));
  
  // ✅ APPLY LOCAL CHANGES to the fresh data
  clonedData.forEach(vendor => {
    vendor.products.forEach(product => {
      const localChange = localProductChanges.value.get(product.id);
      if (localChange !== undefined) {
        product.active = localChange.active;
      }
    });
  });
  
  return clonedData;
});

const groupedProducts = computed(() => {
  if (!productsByLocation.value) return [];
  
  const vendors = {};
  
  productsByLocation.value.forEach(item => {
    if (!vendors[item.vendor_name]) {
      vendors[item.vendor_name] = {
        vendor_name: item.vendor_name,
        vendor_id: item.vendor_id,
        products: []
      };
    }
    
    const filteredProducts = showShoppingList.value 
      ? item.products.filter(product => product.active)
      : item.products;
    
    vendors[item.vendor_name].products.push(...filteredProducts);
  });
  
  return Object.values(vendors).filter(vendor => vendor.products.length > 0);
});

// ✅ UPDATED - Track changes locally
function updateProductStatus(product) {
  console.log(`Updated ${product.product_name} status to:`, product.active);
  
  // ✅ STORE THE CHANGE LOCALLY
  localProductChanges.value.set(product.id, { active: product.active });
  
  // Force reactivity update
  refreshKey.value++;
}

async function submitChanges() {
  isSubmitting.value = true;
  
  try {
    const payload = {
      ...productsByLocation.value,
      id: uuidv4(),
      created_by: store.state.user.resource_owner.email,
    };
    
    const result = await store.dispatch('updateVendorsProducts', payload);
    
    if (result !== false && result !== null) {
      console.log('✅ Products updated successfully');
      
      // ✅ CLEAR LOCAL CHANGES after successful submit
      localProductChanges.value.clear();
      
      // ✅ NUCLEAR REFRESH SEQUENCE
      store.commit('SET_PRODUCTS_BY_LOCATION', null);
      refreshKey.value++;
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 50));
      await store.dispatch('fetchProductsByLocation', route.params.location);
      refreshKey.value++;
      await nextTick();
      
      console.log('✅ Nuclear refresh complete');
      
    } else {
      throw new Error('Failed to update products');
    }
    
  } catch (error) {
    console.error('❌ Error updating products:', error);
    
    // ✅ DON'T CLEAR LOCAL CHANGES on error - keep user's selections
    store.commit('SET_PRODUCTS_BY_LOCATION', null);
    refreshKey.value++;
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));
    await store.dispatch('fetchProductsByLocation', route.params.location);
    refreshKey.value++;
    
  } finally {
    isSubmitting.value = false;
  }
}

async function fetchProducts() {
  isLoading.value = true;
  try {
    await store.dispatch('fetchProductsByLocation', route.params.location);
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    isLoading.value = false;
  }
}

function editProduct(product) {
  router.push({ 
    name: 'ProductEdit', 
    params: { id: product.id } 
  });
}

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.vendors-container {
  max-width: 100%;
}

.vendor-section {
  margin-bottom: 1.5rem;
}

.vendor-header {
  /* #52a9c6; 
  --v-theme-surface-variant: 245, 245, 245;  /* Light gray */

  /*background-color: rgb(var(--v-theme-surface-variant));*/
  background-color: rgba(var(--v-theme-primary), 0.08);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.5rem;
}

.product-item {
  padding: 0.25rem;
}

/* ✅ MOBILE RESPONSIVE */
@media (max-width: 600px) {
  .navigation-grid {
    grid-template-columns: 1fr;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>