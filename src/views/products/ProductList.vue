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
            <!-- ✅ SEARCH AND TOGGLE SECTION -->
            <div class="controls-section mb-4">
              <!-- ✅ PRODUCT SEARCH BAR -->
              <div class="search-section mb-3">
                <v-text-field
                  v-model="searchQuery"
                  label="Search Products by Name..."
                  variant="outlined"
                  clearable
                  class="search-field"
                  placeholder="Type product name to search..."
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary">fas fa-search</v-icon>
                  </template>
                  <template v-slot:append-inner>
                    <v-chip 
                      v-if="searchQuery"
                      size="small" 
                      color="primary" 
                      class="search-results-chip"
                    >
                      {{ filteredProducts.length }} found
                    </v-chip>
                  </template>
                </v-text-field>
              </div>
              
              <!-- ✅ SHOPPING LIST TOGGLE -->
              <div class="toggle-section">
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
            </div>

            <!-- ✅ PRODUCTS CONTAINER -->
            <v-container id="form-container">
              <!-- ✅ LOADING STATE -->
              <div v-if="isLoading" class="loading-state">
                <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
                <p class="mt-4">Loading products...</p>
              </div>

              <!-- ✅ SEARCH RESULTS SUMMARY -->
              <div v-else-if="searchQuery" class="search-summary mb-4">
                <v-alert
                  :color="filteredProducts.length > 0 ? 'success' : 'info'"
                  variant="tonal"
                  icon="fas fa-search"
                >
                  <strong>Search Results:</strong> 
                  Found {{ filteredProducts.length }} products matching "{{ searchQuery }}"
                  <div v-if="filteredProducts.length > 0" class="mt-2">
                    <v-chip size="small" color="success" class="mr-2">
                      {{ activeSearchCount }} Active
                    </v-chip>
                    <v-chip size="small" color="grey">
                      {{ inactiveSearchCount }} Inactive
                    </v-chip>
                  </div>
                </v-alert>
              </div>

              <!-- ✅ PRODUCTS LIST -->
              <div class="products-wrapper">
                <!-- ✅ SEARCH RESULTS -->
                <div v-if="searchQuery && filteredProducts.length > 0">
                  <div 
                    v-for="(product, index) in filteredProducts" 
                    :key="`search-${product.id}-${index}`"
                    class="product-group"
                  >
                    <div class="product-section">
                      <h2 class="product-name">
                        <i class="fas fa-box"></i>
                        <!-- ✅ HIGHLIGHT SEARCH MATCHES -->
                        <span v-html="highlightSearchTerm(product.product_name)"></span>
                      </h2>
                      <div class="vendor-option">
                        <input
                          type="checkbox"
                          :checked="product.active"
                          @change="toggleProductActive(product)"
                          class="product-checkbox"
                          :id="`search-product-${index}`"
                        />
                        <label 
                          :for="`search-product-${index}`"
                          class="checkbox-label"
                        >
                          <i class="fas fa-map-marker-alt"></i>
                          {{ getProductLocation(product.vendor_id) }} - 
                          <i class="fas fa-store"></i>
                          {{ getProductVendor(product.vendor_id) }}
                          <v-chip 
                            :color="product.active ? 'success' : 'grey'" 
                            size="small" 
                            class="ml-2"
                          >
                            {{ product.active ? 'Active' : 'Inactive' }}
                          </v-chip>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ✅ NORMAL MODE (NO SEARCH) -->
                <div v-else-if="!searchQuery">
                  <div 
                    id="group" 
                    v-for="(product, groupIndex) in displayedProducts" 
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
                </div>

                <!-- ✅ EMPTY STATE -->
                <div v-if="(searchQuery && filteredProducts.length === 0) || (!searchQuery && displayedProducts.length === 0)" class="empty-state">
                  <v-icon size="64" color="grey">
                    {{ searchQuery ? 'fas fa-search-minus' : 'fas fa-inbox' }}
                  </v-icon>
                  <h3 class="mt-4">
                    {{ searchQuery ? 'No matching products found' : 'No products found' }}
                  </h3>
                  <p v-if="searchQuery">
                    No products match "{{ searchQuery }}"
                  </p>
                  <p v-else>
                    {{ showShoppingList ? 'No active items in your shopping list' : 'No products available' }}
                  </p>
                  
                  <!-- ✅ SEARCH SUGGESTIONS -->
                  <div v-if="searchQuery" class="search-suggestions mt-3">
                    <v-btn 
                      @click="clearSearch"
                      variant="outlined"
                      size="small"
                      prepend-icon="fas fa-times"
                    >
                      Clear Search
                    </v-btn>
                  </div>
                </div>
              </div>

              <!-- ✅ SUBMIT BUTTON -->
              <v-btn 
                type="submit" 
                color="primary"
                size="large"
                block 
                class="mt-4 submit-button"
                :loading="isSubmitting"
                :disabled="(searchQuery ? filteredProducts.length === 0 : displayedProducts.length === 0)"
              >
                <i class="fas fa-save"></i>
                Update Products List
                <v-chip size="small" class="ml-2">
                  {{ getActiveProductsCount }} active
                </v-chip>
                <span v-if="searchQuery" class="ml-2">
                  ({{ filteredProducts.length }} shown)
                </span>
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
          <p><strong>Search Query:</strong> "{{ searchQuery }}"</p>
          <p><strong>Show Shopping List:</strong> {{ showShoppingList }}</p>
          <p><strong>Products:</strong> {{ products.length }} total</p>
          <p><strong>Shopping List:</strong> {{ shoppingList.length }} items</p>
          <p><strong>Vendors:</strong> {{ vendors.length }} vendors</p>
          <p><strong>Displayed Products:</strong> {{ displayedProducts.length }} items</p>
          <p><strong>Filtered Products:</strong> {{ filteredProducts.length }} items</p>
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
const searchQuery = ref(''); // ✅ SEARCH STATE

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
  
  // ✅ SEARCH ALL PRODUCTS (REGARDLESS OF ACTIVE/INACTIVE)
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
  product.active = !product.active;
  console.log(`🔄 Product "${product.product_name}" active: ${product.active}`);
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
    
    // ✅ USE CORRECT DATA SOURCE BASED ON MODE
    let sourceData;
    if (searchQuery.value) {
      sourceData = filteredProducts.value;
      console.log(`🔍 Submitting search results: ${sourceData.length} products`);
    } else {
      sourceData = displayedProducts.value;
      console.log(`🔍 Submitting ${showShoppingList.value ? 'shopping list' : 'all products'}: ${sourceData.length} products`);
    }
    
    console.log(`🔍 Search: ${searchQuery.value ? `"${searchQuery.value}"` : 'None'}`);
    
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
    console.log(`  🔍 Search filter: ${searchQuery.value || 'None'}`);
    
    const submitData = {
      products: changedProducts,
      id: uuidv4(),
      created_by: user.value?.email || '',
    };
    
    console.log('🚀 Submitting product states:', submitData);
    
    const result = await store.dispatch('putProducts', submitData);
    
    if (result !== false) {
      const searchInfo = searchQuery.value ? ` (filtered by "${searchQuery.value}")` : '';
      console.log('✅ All product states updated successfully');
      alert(`✅ Updated ${changedProducts.length} products${searchInfo} (${activeCount} active, ${inactiveCount} inactive)`);
      
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
/* ✅ SEARCH HIGHLIGHTING */
.search-highlight {
  background-color: #fff3cd;
  color: #856404;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: bold;
}

/* ✅ EXISTING STYLES STAY THE SAME */
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

/* ✅ NEW SEARCH STYLES */
.controls-section {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
}

.search-section {
  max-width: 600px;
  margin: 0 auto;
}

.search-field {
  font-size: 1.1rem;
}

.search-results-chip {
  font-weight: bold;
}

.search-summary {
  max-width: 800px;
  margin: 0 auto;
}

.search-suggestions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* ✅ SEARCH HIGHLIGHTING */
.search-highlight {
  background-color: #fff3cd;
  color: #856404;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: bold;
}

.toggle-section {
  text-align: center;
  padding: 1rem 0 0 0;
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
  transition: all 0.3s ease;
}

.product-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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

.submit-button {
  position: sticky;
  bottom: 20px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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
  
  .controls-section {
    padding: 1rem;
  }
  
  .search-suggestions {
    flex-direction: column;
    align-items: center;
  }
}

/* ✅ ACCESSIBILITY */
.toggle-link:focus,
.checkbox-label:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

.product-checkbox:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
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
</style>