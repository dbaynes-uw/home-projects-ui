<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/products/ProductList.vue -->
<template>
  <div class="page-wrapper">
    <div class="product-list-container">
      <!-- ✅ HEADER CARD -->
      <v-card class="mx-auto mt-5">
        <v-card-title class="pb-0">
          <h2>
            <i class="fas fa-shopping-basket"></i>
            Product Shopping List
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
              Products By Locations
            </v-btn>
            
            <v-btn
              variant="outlined"
              :to="{ name: 'ProductsByVendors' }"
              prepend-icon="fas fa-store"
              class="nav-button"
            >
              Product List By Vendor
            </v-btn>
            
            <v-btn
              variant="outlined"
              :to="{ name: 'ProductVendorCreate' }"
              prepend-icon="fas fa-plus-circle"
              class="nav-button"
            >
              Create Vendor/Product
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- ✅ MAIN CONTENT CARD -->
      <v-card class="mt-4">
        <v-card-text>
          <v-form @submit.prevent="onSubmit">
            <!-- ✅ SHOPPING LIST TOGGLE -->
            <div class="toggle-section mb-4">
              <h2>
                <u @click="toggleShoppingListDisplay" class="toggle-link">
                  <i class="fas fa-list"></i>
                  Toggle Shopping List
                  <v-chip 
                    :color="showShoppingList ? 'success' : 'primary'" 
                    size="small" 
                    class="ml-2"
                  >
                    {{ showShoppingList ? 'Active Items Only' : 'All Items' }}
                  </v-chip>
                </u>
              </h2>
            </div>

            <!-- ✅ PRODUCTS CONTAINER -->
            <v-container id="form-container">
              <!-- ✅ LOADING STATE -->
              <div v-if="isLoading" class="loading-state">
                <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
                <p class="mt-4">Loading products...</p>
              </div>

              <!-- ✅ PRODUCTS LIST -->
              <div v-else class="products-wrapper">
                <div 
                  id="group" 
                  v-for="(product, groupIndex) in resultSet" 
                  :key="`product-${groupIndex}`"
                  class="product-group"
                >
                  <div 
                    v-for="(vendor, vendorIndex) in vendors" 
                    :key="`vendor-${vendorIndex}`"
                  >
                    <!-- ✅ SHOPPING LIST MODE (Active items only) -->
                    <div v-if="showShoppingList && product.vendor_id === vendor.id && product.active">
                      <div class="product-section">
                        <h2 class="product-name">
                          <i class="fas fa-box"></i>
                          {{ product.product_name }}
                        </h2>
                        <div class="vendor-option">
                          <input
                            type="checkbox"
                            :checked="product.active"
                            @change="toggleProductActive(product)"
                            class="product-checkbox"
                            :id="`active-${groupIndex}-${vendorIndex}`"
                          />
                          <label 
                            :for="`active-${groupIndex}-${vendorIndex}`"
                            class="checkbox-label"
                          >
                            <i class="fas fa-map-marker-alt"></i>
                            {{ vendor.location }} - 
                            <i class="fas fa-store"></i>
                            {{ vendor.vendor_name }}
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <!-- ✅ ALL PRODUCTS MODE -->
                    <div v-else-if="!showShoppingList && product.vendor_id === vendor.id">
                      <div class="product-section">
                        <h2 class="product-name">
                          <i class="fas fa-box"></i>
                          {{ product.product_name }}
                        </h2>
                        <div class="vendor-option">
                          <input
                            type="checkbox"
                            :checked="product.active"
                            @change="toggleProductActive(product)"
                            class="product-checkbox"
                            :id="`all-${groupIndex}-${vendorIndex}`"
                          />
                          <label 
                            :for="`all-${groupIndex}-${vendorIndex}`"
                            class="checkbox-label"
                          >
                            <i class="fas fa-map-marker-alt"></i>
                            {{ vendor.location }} - 
                            <i class="fas fa-store"></i>
                            {{ vendor.vendor_name }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ✅ EMPTY STATE -->
                <div v-if="resultSet.length === 0" class="empty-state">
                  <v-icon size="64" color="grey">fas fa-inbox</v-icon>
                  <h3 class="mt-4">No products found</h3>
                  <p>{{ showShoppingList ? 'No active items in your shopping list' : 'No products available' }}</p>
                </div>
              </div>

              <!-- ✅ SUBMIT BUTTON -->
              <v-btn 
                type="submit" 
                color="primary"
                size="large"
                block 
                class="mt-4"
                :loading="isSubmitting"
                :disabled="resultSet.length === 0"
              >
                <i class="fas fa-save"></i>
                Update Products List
                <v-chip size="small" class="ml-2">
                  {{ getActiveProductsCount }} active
                </v-chip>
              </v-btn>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>

      <!-- ✅ DEBUG INFO (DEV ONLY) -->
      <v-card v-if="isDev" class="mt-4" color="info" variant="tonal">
        <v-card-title>
          <i class="fas fa-bug"></i>
          Debug Info
        </v-card-title>
        <v-card-text>
          <p><strong>Show Shopping List:</strong> {{ showShoppingList }}</p>
          <p><strong>Products:</strong> {{ products.length }} total</p>
          <p><strong>Shopping List:</strong> {{ shoppingList.length }} items</p>
          <p><strong>Vendors:</strong> {{ vendors.length }} vendors</p>
          <p><strong>Result Set:</strong> {{ resultSet.length }} items</p>
          <p><strong>Active Products:</strong> {{ getActiveProductsCount }}</p>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { v4 as uuidv4 } from 'uuid';

// ✅ COMPOSITION API SETUP
const store = useStore();

// ✅ REACTIVE STATE
const showShoppingList = ref(false);
const isProductToggled = ref(null);
const isSubmitting = ref(false);
const isLoading = ref(true);

// ✅ COMPUTED PROPERTIES
const products = computed(() => store.state.products || []);
const vendors = computed(() => store.state.vendors || []);
const shoppingList = computed(() => store.state.shopping_list || []);
const vendorsProducts = computed(() => store.state.vendors_products || []);

const user = computed(() => store.state.user?.resource_owner);

const isDev = computed(() => process.env.NODE_ENV === 'development');

// ✅ RESULT SET - MAIN DATA SOURCE
const resultSet = ref([]);

// ✅ ACTIVE PRODUCTS COUNT
const getActiveProductsCount = computed(() => {
  return resultSet.value.filter(product => product.active).length;
});

// ✅ METHODS
const toggleProductActive = (product) => {
  product.active = !product.active;
  console.log(`🔄 Product "${product.product_name}" active: ${product.active}`);
};

const toggleShoppingListDisplay = () => {
  showShoppingList.value = !showShoppingList.value;
  updateResultSet();
  console.log(`🔄 Shopping list mode: ${showShoppingList.value ? 'Active items only' : 'All items'}`);
};

const updateResultSet = () => {
  if (showShoppingList.value) {
    // ✅ SHOW ONLY ACTIVE ITEMS FROM SHOPPING LIST
    resultSet.value = shoppingList.value.filter(item => item.active);
    console.log(`🔍 Showing ${resultSet.value.length} active items from shopping list`);
  } else {
    // ✅ SHOW ALL PRODUCTS
    resultSet.value = products.value;
    console.log(`🔍 Showing ${resultSet.value.length} total products`);
  }
};

const toggleProduct = (index) => {
  isProductToggled.value = index === isProductToggled.value ? null : index;
  console.log(`🔄 Toggled product at index: ${index}`);
};

const onSubmit = async () => {
  try {
    isSubmitting.value = true;
    
    // ✅ FLATTEN VENDOR PRODUCTS TO MATCH PRODUCTLIST FORMAT
    const flattenedProducts = [];
    
    vendorsProducts.value.forEach(vendor => {
      if (vendor.products && Array.isArray(vendor.products)) {
        vendor.products.forEach(product => {
          flattenedProducts.push({
            ...product,
            vendor_id: product.vendor_id || vendor.id,
            vendor_name: vendor.vendor_name || product.vendor_name,
            location: vendor.location || product.location
          });
        });
      }
    });
    
    // ✅ EXACTLY THE SAME AS PRODUCTLIST FROM HERE
    const sourceData = flattenedProducts;
    
    console.log('🔍 Source data:', sourceData.length, 'items');
    console.log('🔍 Mode: Vendor Products (flattened)');
    
    const changedProducts = sourceData.map(product => {
      const isCurrentlyActive = !!product.active;
      
      console.log(`📋 "${product.product_name}" - Active: ${isCurrentlyActive}`);
      
      return {
        id: product.id,
        vendor_id: product.vendor_id || 1,
        product_name: product.product_name || product.name || 'Unknown Product',
        location: product.location,
        vendor_name: product.vendor_name,
        active: isCurrentlyActive,
        created_at: product.created_at,
        updated_at: product.updated_at,
        updated_by: user.value?.email || '',
        updated_at_client: new Date().toISOString()
      };
    });
    
    const activeCount = changedProducts.filter(p => p.active).length;
    const inactiveCount = changedProducts.filter(p => !p.active).length;
    
    console.log('📊 SUBMISSION SUMMARY:');
    console.log(`  Total products: ${changedProducts.length}`);
    console.log(`  ✅ Will be marked active: ${activeCount}`);
    console.log(`  ❌ Will be marked inactive: ${inactiveCount}`);
    
    const submitData = {
      products: changedProducts,
      id: uuidv4(),
      created_by: user.value?.email || '',
    };
    
    console.log('🚀 Submitting all product states:', submitData);
    
    // ✅ SAME STORE ACTION AS PRODUCTLIST
    const result = await store.dispatch('putProducts', submitData);
    
    if (result !== false) {
      console.log('✅ All product states updated successfully');
      alert(`✅ Updated ${changedProducts.length} products (${activeCount} active, ${inactiveCount} inactive)`);
      
      await Promise.all([
        store.dispatch('fetchProducts'),
        store.dispatch('fetchShoppingList'),
        store.dispatch('fetchVendors'),
        store.dispatch('fetchVendorsProducts')
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
};


// ✅ LIFECYCLE
onMounted(async () => {
  try {
    console.log('🔍 ProductList mounted, fetching data...');
    
    // ✅ FETCH ALL REQUIRED DATA
    await Promise.all([
      store.dispatch('fetchProducts'),
      //store.dispatch('fetchShoppingList'),
      //store.dispatch('fetchVendors'),
      //store.dispatch('fetchVendorsProducts')
    ]);
    
    // ✅ INITIALIZE RESULT SET
    updateResultSet();
    
    console.log('✅ All data loaded successfully');
    console.log('Products:', products.value.length);
    console.log('Shopping List:', shoppingList.value.length);
    console.log('Vendors:', vendors.value.length);
    
  } catch (error) {
    console.error('❌ Error loading data:', error);
    alert('❌ Error loading products data');
  } finally {
    isLoading.value = false;
  }
});

// ✅ WATCHERS
watch([products, shoppingList], () => {
  updateResultSet();
}, { deep: true });

watch(showShoppingList, (newValue) => {
  console.log(`🔄 Shopping list display mode: ${newValue ? 'Active items only' : 'All items'}`);
});

watch(resultSet, (newSet) => {
  console.log(`🔄 Result set updated: ${newSet.length} items, ${getActiveProductsCount.value} active`);
}, { deep: true });
</script>

<style scoped>
/* ✅ MODERNIZED STYLES */
.page-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.product-list-container {
  width: 100%;
  max-width: 1200px;
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
  min-width: 200px !important;
  height: 40px !important;
}

.toggle-section {
  text-align: center;
  padding: 1rem 0;
}

.toggle-link {
  color: #1976d2;
  cursor: pointer;
  transition: color 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.toggle-link:hover {
  color: #1565c0;
}

.loading-state {
  text-align: center;
  padding: 3rem 1rem;
}

.products-wrapper {
  min-height: 200px;
}

.product-group {
  margin-bottom: 1rem;
}

.product-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 4px solid #1976d2;
}

.product-name {
  color: #1976d2;
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.vendor-option {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
}

.product-checkbox {
  width: 20px !important;
  height: 20px !important;
  margin-right: 1rem !important;
  cursor: pointer;
}

.checkbox-label {
  font-size: 1.25rem;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  transition: color 0.3s ease;
}

.checkbox-label:hover {
  color: #1976d2;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

/* ✅ KEEP ESSENTIAL LEGACY STYLES */
.column {
  float: left;
  width: 90%;
  padding: 2px;
  margin-bottom: 2rem;
}

.row:after {
  content: "";
  display: table;
  clear: both;
}

#form-container {
  text-align: left;
  width: 100% !important;
  padding: 1rem;
}

/* ✅ RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .navigation-flex {
    flex-direction: column;
  }
  
  .nav-button {
    min-width: 100% !important;
  }
  
  .checkbox-label {
    font-size: 1rem;
  }
  
  .product-name {
    font-size: 1.25rem;
  }
  
  .product-section {
    padding: 0.75rem;
  }
}

/* ✅ ACCESSIBILITY IMPROVEMENTS */
.toggle-link:focus,
.checkbox-label:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

.product-checkbox:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

/* ✅ ANIMATION */
.product-section {
  transition: all 0.3s ease;
}

.product-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>