<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/products/ProductList.vue -->

<template>
  <div class="page-wrapper">
    <div class="product-list-container">
      <!-- ✅ HEADER CARD (NO VUETIFY) -->
      <div class="card mt-5">
        <div class="card-header">
          <h2 class="card-title">
            <i class="fas fa-shopping-basket"></i>
            Product Shopping List
          </h2>
        </div>
        
        <!-- ✅ NAVIGATION BUTTONS (NO VUETIFY) -->
        <div class="card-body">
          <div class="navigation-flex">
            <router-link 
              :to="{ name: 'ProductsByLocations' }"
              class="btn btn-outlined"
            >
              <i class="fas fa-map-marker-alt"></i>
              Products By Locations
            </router-link>
            
            <router-link 
              :to="{ name: 'ProductsByVendors' }"
              class="btn btn-outlined"
            >
              <i class="fas fa-store"></i>
              Product List By Vendor
            </router-link>
            
            <router-link 
              :to="{ name: 'ProductVendorCreate' }"
              class="btn btn-outlined"
            >
              <i class="fas fa-plus-circle"></i>
              Create Vendor/Product
            </router-link>
          </div>
        </div>
      </div>

      <!-- ✅ MAIN CONTENT CARD (NO VUETIFY) -->
      <div class="card mt-4">
        <div class="card-body">
          <form @submit.prevent="onSubmit">
            <!-- ✅ SEARCH AND TOGGLE SECTION (NO VUETIFY) -->
            <div class="controls-section mb-4">
              <!-- ✅ PRODUCT SEARCH BAR (NO VUETIFY) -->
              <div class="search-section mb-3">
                <div class="form-group">
                  <div class="input-wrapper">
                    <i class="fas fa-search input-icon"></i>
                    <input
                      v-model="searchQuery"
                      type="text"
                      class="form-input has-icon"
                      placeholder="Search Products by Name..."
                    />
                    <span v-if="searchQuery" class="chip chip-primary chip-small input-badge">
                      {{ filteredProducts.length }} found
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- ✅ SHOPPING LIST TOGGLE (NO VUETIFY) -->
              <div class="toggle-section">
                <h2>
                  <span @click="toggleShoppingListDisplay" class="toggle-link">
                    <i class="fas fa-list"></i>
                    Toggle Shopping List
                    <span 
                      :class="['chip', 'chip-small', 'ml-2', showShoppingList ? 'chip-success' : 'chip-primary']"
                    >
                      {{ showShoppingList ? 'Active Items Only' : 'All Items' }}
                    </span>
                  </span>
                </h2>
              </div>
            </div>

            <!-- ✅ PRODUCTS CONTAINER -->
            <div id="form-container">
              <!-- ✅ LOADING STATE (NO VUETIFY) -->
              <div v-if="isLoading" class="loading-container">
                <div class="spinner"></div>
                <p class="loading-text">Loading products...</p>
              </div>

              <!-- ✅ SEARCH RESULTS SUMMARY (NO VUETIFY) -->
              <div v-else-if="searchQuery" class="search-summary mb-4">
                <div :class="['alert', filteredProducts.length > 0 ? 'alert-success' : 'alert-info']">
                  <i :class="['alert-icon', 'fas', 'fa-search']"></i>
                  <div class="alert-content">
                    <strong>Search Results:</strong> 
                    Found {{ filteredProducts.length }} products matching "{{ searchQuery }}"
                    <div v-if="filteredProducts.length > 0" class="mt-2">
                      <span class="chip chip-success chip-small mr-2">
                        {{ activeSearchCount }} Active
                      </span>
                      <span class="chip chip-grey chip-small">
                        {{ inactiveSearchCount }} Inactive
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ✅ PRODUCTS LIST -->
              <div class="products-wrapper">
                <!-- ✅ SEARCH RESULTS MODE -->
                <template v-if="searchQuery && filteredProducts.length > 0">
                  <div v-for="product in filteredProducts" :key="product.id" class="product-section">
                    <h3 class="product-name">
                      <i class="fas fa-box"></i>
                      <span v-html="highlightSearchTerm(product.product_name)"></span>
                    </h3>
                    
                    <div class="vendor-option">
                      <input
                        :id="`product-${product.id}`"
                        type="checkbox"
                        :checked="product.active"
                        @change="toggleProductActive(product)"
                        class="product-checkbox"
                      />
                      <label 
                        :for="`product-${product.id}`"
                        class="checkbox-label"
                      >
                        <i class="fas fa-store"></i>
                        {{ getProductVendor(product.vendor_id) }}
                        <span class="chip chip-small chip-grey ml-2">
                          <i class="fas fa-map-marker-alt"></i>
                          {{ getProductLocation(product.vendor_id) }}
                        </span>
                      </label>
                    </div>
                  </div>
                </template>

                <!-- ✅ NORMAL MODE (NO SEARCH) -->
                <template v-else-if="!searchQuery && displayedProducts.length > 0">
                  <div v-for="product in displayedProducts" :key="product.id" class="product-section">
                    <h3 class="product-name">
                      <i class="fas fa-box"></i>
                      {{ product.product_name }}
                    </h3>
                    
                    <div class="vendor-option">
                      <input
                        :id="`product-${product.id}`"
                        type="checkbox"
                        :checked="product.active"
                        @change="toggleProductActive(product)"
                        class="product-checkbox"
                      />
                      <label 
                        :for="`product-${product.id}`"
                        class="checkbox-label"
                      >
                        <i class="fas fa-store"></i>
                        {{ getProductVendor(product.vendor_id) }}
                        <span class="chip chip-small chip-grey ml-2">
                          <i class="fas fa-map-marker-alt"></i>
                          {{ getProductLocation(product.vendor_id) }}
                        </span>
                      </label>
                    </div>
                  </div>
                </template>
                
                <!-- ✅ EMPTY STATE (NO VUETIFY) -->
                <div v-else class="empty-state">
                  <i :class="['empty-state-icon', 'fas', searchQuery ? 'fa-search-minus' : 'fa-inbox']"></i>
                  <h3>
                    {{ searchQuery ? 'No matching products found' : 'No products found' }}
                  </h3>
                  <p v-if="searchQuery">
                    No products match "{{ searchQuery }}"
                  </p>
                  <p v-else>
                    {{ showShoppingList ? 'No active items in your shopping list' : 'No products available' }}
                  </p>
                  
                  <div v-if="searchQuery" class="search-suggestions">
                    <button 
                      @click="clearSearch"
                      type="button"
                      class="btn btn-outlined btn-small"
                    >
                      <i class="fas fa-times"></i>
                      Clear Search
                    </button>
                  </div>
                </div>
              </div>

              <!-- ✅ SUBMIT BUTTON (NO VUETIFY) -->
              <button 
                type="submit"
                :class="['btn', 'btn-primary', 'btn-large', 'btn-block', 'mt-4', 'submit-button', { 'btn-loading': isSubmitting }]"
                :disabled="(searchQuery ? filteredProducts.length === 0 : displayedProducts.length === 0) || isSubmitting"
              >
                <template v-if="!isSubmitting">
                  <i class="fas fa-save"></i>
                  Update Products List
                  <span class="chip chip-small ml-2" style="background: rgba(255,255,255,0.2); color: white; border: none;">
                    {{ getActiveProductsCount }} active
                  </span>
                  <span v-if="searchQuery" class="ml-2">
                    ({{ filteredProducts.length }} shown)
                  </span>
                </template>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- ✅ DEBUG INFO (NO VUETIFY) -->
      <div v-if="isDev" class="card mt-4 alert alert-info">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fas fa-bug"></i>
            Debug Info
          </h3>
        </div>
        <div class="card-body">
          <p><strong>Search Query:</strong> "{{ searchQuery }}"</p>
          <p><strong>Show Shopping List:</strong> {{ showShoppingList }}</p>
          <p><strong>Products:</strong> {{ products.length }} total</p>
          <p><strong>Shopping List:</strong> {{ shoppingList.length }} items</p>
          <p><strong>Vendors:</strong> {{ vendors.length }} vendors</p>
          <p><strong>Displayed Products:</strong> {{ displayedProducts.length }} items</p>
          <p><strong>Filtered Products:</strong> {{ filteredProducts.length }} items</p>
          <p><strong>Active Products:</strong> {{ getActiveProductsCount }}</p>
        </div>
      </div>
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
const searchQuery = ref('');
const changedProductIds = ref(new Set()); // ✅ TRACK CHANGED PRODUCTS

// ✅ COMPUTED PROPERTIES
const products = computed(() => store.state.products || []);
const vendors = computed(() => store.state.vendors || []);
const shoppingList = computed(() => store.state.shopping_list || []);
const vendorsProducts = computed(() => store.state.vendors_products || []);

const user = computed(() => store.state.user?.resource_owner);
const isDev = computed(() => process.env.NODE_ENV === 'development');

// ✅ DISPLAYED PRODUCTS (NORMAL MODE - NO SEARCH)
const displayedProducts = computed(() => {
  if (showShoppingList.value) {
    return shoppingList.value.filter(item => item.active);
  } else {
    return products.value;
  }
});

// ✅ FILTERED PRODUCTS (SEARCH MODE)
const filteredProducts = computed(() => {
  if (!searchQuery.value || !searchQuery.value.trim()) {
    return [];
  }
  
  const query = searchQuery.value.toLowerCase().trim();
  
  return products.value.filter(product => {
    return product.product_name?.toLowerCase().includes(query);
  });
});

// ✅ SEARCH RESULT COUNTS
const activeSearchCount = computed(() => {
  return filteredProducts.value.filter(product => product.active).length;
});

const inactiveSearchCount = computed(() => {
  return filteredProducts.value.filter(product => !product.active).length;
});

// ✅ ACTIVE PRODUCTS COUNT
const getActiveProductsCount = computed(() => {
  if (searchQuery.value) {
    return activeSearchCount.value;
  } else {
    return displayedProducts.value.filter(product => product.active).length;
  }
});

// ✅ METHODS
const toggleProductActive = (product) => {
  const productIndex = products.value.findIndex(p => p.id === product.id);
  
  if (productIndex !== -1) {
    const updatedProduct = {
      ...products.value[productIndex],
      active: !products.value[productIndex].active
    };
    
    // ✅ TRACK THAT THIS PRODUCT WAS CHANGED
    changedProductIds.value.add(updatedProduct.id);
    
    console.log(`🔄 Toggling product ID ${updatedProduct.id} active state to ${updatedProduct.active}`);
    store.commit('UPDATE_PRODUCT_ACTIVE', updatedProduct);
    
    console.log(`✅ Product "${updatedProduct.product_name}" active: ${updatedProduct.active} (tracked as changed)`);
  }
};

const toggleShoppingListDisplay = () => {
  showShoppingList.value = !showShoppingList.value;
  console.log(`🔄 Shopping list mode: ${showShoppingList.value ? 'Active items only' : 'All items'}`);
};

const clearSearch = () => {
  searchQuery.value = '';
  console.log('🔄 Search cleared');
};

// ✅ HELPER METHODS FOR SEARCH RESULTS
const getProductVendor = (vendorId) => {
  const vendor = vendors.value.find(v => v.id === vendorId);
  return vendor?.vendor_name || 'Unknown Vendor';
};

const getProductLocation = (vendorId) => {
  const vendor = vendors.value.find(v => v.id === vendorId);
  return vendor?.location || 'Unknown Location';
};

// ✅ HIGHLIGHT SEARCH TERMS IN TEXT
const highlightSearchTerm = (text) => {
  if (!searchQuery.value || !text) {
    return text || '';
  }
  
  const query = searchQuery.value.trim();
  if (!query) {
    return text;
  }
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
};

const onSubmit = async () => {
  try {
    isSubmitting.value = true;
    
    // ✅ ONLY SUBMIT PRODUCTS THAT WERE ACTUALLY CHANGED
    const changedProducts = products.value
      .filter(product => changedProductIds.value.has(product.id))
      .map(product => ({
        id: product.id,
        vendor_id: product.vendor_id || 1,
        product_name: product.product_name || product.name || 'Unknown Product',
        location: product.location,
        vendor_name: product.vendor_name,
        active: !!product.active,
        created_at: product.created_at,
        updated_at: product.updated_at,
        updated_by: user.value?.email || '',
        updated_at_client: new Date().toISOString()
      }));
    
    if (changedProducts.length === 0) {
      console.log('⚠️ No products were changed, skipping submission');
      alert('ℹ️ No changes to submit');
      return;
    }
    
    const activeCount = changedProducts.filter(p => p.active).length;
    const inactiveCount = changedProducts.filter(p => !p.active).length;
    
    console.log('📊 SUBMISSION SUMMARY:');
    console.log(`  Changed products: ${changedProducts.length}`);
    console.log(`  ✅ Active: ${activeCount}`);
    console.log(`  ❌ Inactive: ${inactiveCount}`);
    console.log('📦 Products being submitted:', changedProducts);
    
    const submitData = {
      products: changedProducts,
      id: uuidv4(),
      created_by: user.value?.email || '',
    };
    
    console.log('🚀 Submitting product states:', submitData);
    
    const result = await store.dispatch('putProducts', submitData);
    
    if (result !== false) {
      console.log('✅ All product states updated successfully');
      alert(`✅ Updated ${changedProducts.length} products (${activeCount} active, ${inactiveCount} inactive)`);
      
      // ✅ CLEAR CHANGED TRACKING
      changedProductIds.value.clear();
      
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
    await Promise.all([
      store.dispatch('fetchProducts'),
      store.dispatch('fetchShoppingList'),
      store.dispatch('fetchVendors'),
      store.dispatch('fetchVendorsProducts')
    ]);
  } catch (error) {
    console.error('❌ Error loading data:', error);
    alert('❌ Error loading products data');
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* ✅ Component-specific overrides */
.input-badge {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.navigation-flex {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.navigation-flex .btn {
  min-width: 200px;
}

/* ✅ SEARCH HIGHLIGHTING */
.search-highlight {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.3) 0%, rgba(255, 152, 0, 0.3) 100%);
  color: #f57c00;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

/* ✅ PAGE WRAPPER */
.page-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
  background: #f5f7fa;
  min-height: 100vh;
}

.product-list-container {
  width: 100%;
  max-width: 1200px;
  padding: 1rem;
  margin: 0 auto;
}

/* ✅ CONTROLS SECTION - Updated to match card style */
.controls-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.search-section {
  max-width: 600px;
  margin: 0 auto;
}

.toggle-section {
  text-align: center;
  padding: 1rem 0 0 0;
}

.toggle-link {
  color: #667eea;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.toggle-link:hover {
  color: #764ba2;
  transform: translateY(-1px);
}

/* ✅ PRODUCTS WRAPPER */
.products-wrapper {
  min-height: 200px;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* ✅ PRODUCT SECTION - Updated styling */
.product-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 4px solid #667eea;
  transition: all 0.2s ease;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.product-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  border-left-color: #764ba2;
}

.product-name {
  color: #667eea;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.product-name i {
  color: #764ba2;
}

/* ✅ VENDOR OPTION */
.vendor-option {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  gap: 0.75rem;
}

.product-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
  flex-shrink: 0;
}

.checkbox-label {
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
  transition: color 0.2s ease;
  flex: 1;
}

.checkbox-label:hover {
  color: #667eea;
}

.checkbox-label i {
  color: #667eea;
}

/* ✅ SUBMIT BUTTON */
.submit-button {
  position: sticky;
  bottom: 20px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-button:hover:not(:disabled) {
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}

/* ✅ UTILITY CLASSES */
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mt-5 { margin-top: 1.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.ml-2 { margin-left: 0.5rem; }
.mr-2 { margin-right: 0.5rem; }

/* ✅ RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .navigation-flex {
    flex-direction: column;
  }
  
  .navigation-flex .btn {
    min-width: 100%;
  }
  
  .checkbox-label {
    font-size: 0.9rem;
  }
  
  .product-name {
    font-size: 1.1rem;
  }
  
  .product-section {
    padding: 0.75rem;
  }
  
  .controls-section {
    padding: 1rem;
  }
  
  .products-wrapper {
    padding: 1rem;
  }
}

/* ✅ ACCESSIBILITY */
.toggle-link:focus,
.checkbox-label:focus,
.product-checkbox:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
  border-radius: 4px;
}

/* ✅ REMOVE OLD LEGACY STYLES */
#form-container {
  width: 100%;
}
</style>