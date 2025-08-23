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
      <div v-else class="vendors-container">
        <div 
          v-for="vendor in groupedProducts" 
          :key="vendor.vendor_name"
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

// ✅ COMPOSITION API SETUP
const route = useRoute();
const router = useRouter();
const store = useStore();

// No longer need props
//const props = defineProps({
//  location: {
//    type: String,
//    required: true
//  }
//});

// ✅ REACTIVE STATE
const showShoppingList = ref(true);
const isLoading = ref(true);
const isSubmitting = ref(false);
const confirmDialogue = ref(null);

// ✅ COMPUTED PROPERTIES
const productsByLocation = computed(() => store.state.products_by_location);

const groupedProducts = computed(() => {
  if (!productsByLocation.value) return [];
  
  // Group products by vendor and filter if needed
  const vendors = {};
  
  productsByLocation.value.forEach(item => {
    if (!vendors[item.vendor_name]) {
      vendors[item.vendor_name] = {
        vendor_name: item.vendor_name,
        vendor_id: item.vendor_id,
        products: []
      };
    }
    
    // Filter products based on shopping list toggle
    const filteredProducts = showShoppingList.value 
      ? item.products.filter(product => product.active)
      : item.products;
    
    vendors[item.vendor_name].products.push(...filteredProducts);
  });
  
  return Object.values(vendors).filter(vendor => vendor.products.length > 0);
});

// ✅ METHODS
async function fetchProducts() {
  isLoading.value = true;
  try {
    await store.dispatch('fetchProductsByLocation', route.params.location);
  } catch (error) {
    console.error('Error fetching products:', error);
    // TODO: Add proper error handling/notification
  } finally {
    isLoading.value = false;
  }
}

function updateProductStatus(product) {
  // Product status is automatically updated via v-model
  console.log(`Updated ${product.product_name} status to:`, product.active);
}

async function submitChanges() {
  isSubmitting.value = true;
  
  try {
    const payload = {
      ...productsByLocation.value,
      id: uuidv4(),
      created_by: store.state.user.resource_owner.email,
    };
    
    const success = await store.dispatch('updateVendorsProducts', payload);
    
    if (success) {
      // ✅ MODERN - Use proper notification instead of alert
      console.log('Products updated successfully');
      // TODO: Add toast notification
      // Refresh data
      await fetchProducts();
    } else {
      throw new Error('Failed to update products');
    }
  } catch (error) {
    console.error('Error updating products:', error);
    // TODO: Add error notification
  } finally {
    isSubmitting.value = false;
  }
}

function editProduct(product) {
  router.push({ 
    name: 'ProductEdit', 
    params: { id: product.id } 
  });
}

//function editVendor(vendor) {
//  router.push({ 
//    name: 'VendorEdit', 
//    params: { id: vendor.vendor_id } 
//  });
//}

// ✅ LIFECYCLE
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
  background-color: rgb(var(--v-theme-surface-variant));
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