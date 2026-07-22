<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/products/ProductsByVendors.vue -->
<template>
  <div class="products-vendor-container">
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
              <div><strong>Vendor:</strong> {{ selectedContext.vendorName }}</div>
              <div><strong>Location:</strong> {{ selectedContext.location }}</div>
            </div>
          </div>
          
          <!-- Form -->
          <form @submit.prevent="submitNewProduct" ref="productForm">
            <!-- Product Autocomplete -->
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
                
                <small class="form-hint">
                  {{ getProductHint }}
                </small>
              </div>
            </div>
            
            <!-- Other Product Name -->
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
    <!-- END PRODUCT DIALOG -->

    <!-- ✅ HEADER CARD (NO VUETIFY) -->
    <div class="card mt-5">
      <div class="card-header">
        <h2 class="card-title">
          <i class="fas fa-store"></i>
          Products By Vendors
        </h2>
      </div>

      <!-- ✅ NAVIGATION (NO VUETIFY) -->
      <div class="card-body">
        <div class="navigation-grid">
          <router-link 
            :to="{ name: 'ProductsByLocations' }"
            class="btn btn-outlined"
          >
            <i class="fas fa-map-marker-alt"></i>
            Shopping List By Location
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
      <p class="loading-text">Loading vendors...</p>
    </div>

    <!-- ✅ MAIN CONTENT (NO VUETIFY) -->
    <div v-else class="card mt-4">
      <!-- ✅ SWITCH CONTROL -->
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
          <!-- ✅ VENDORS GRID -->
          <div class="vendors-grid">
            <div
              v-for="(vendor, vendorIndex) in filteredVendors"
              :key="vendorIndex"
              :class="['vendor-card', 'card', { 'vendor-expanded': expandedVendors.has(vendors.indexOf(vendor)) }]"
            >
              <!-- ✅ VENDOR HEADER -->
              <div 
                class="vendor-header"
              >
                <i class="fas fa-store vendor-store-icon"></i>
                
                <!-- ✅ VENDOR NAME AND EDIT GROUP -->
                <div class="vendor-name-group">
                  <span class="vendor-name">{{ vendor.vendor_name }}</span>
                  
                  <button
                    @click.stop="editVendor(vendor)"
                    class="btn btn-outlined btn-small edit-vendor-btn"
                  >
                    <i class="fas fa-edit"></i>
                    <span class="edit-hint">Edit</span>
                  </button>
                </div>

                <!-- ✅ VENDOR CONTROLS -->
                <div class="vendor-controls">
                  <span class="chip chip-grey vendor-location-chip">
                    <i class="fas fa-map-marker-alt chip-icon"></i>
                    <span class="vendor-location-text">{{ vendor.location }}</span>
                  </span>

                  <button
                    type="button"
                    :class="['btn', 'btn-small', isShowingAllProductsForVendor(vendor) ? 'btn-success' : 'btn-outlined']"
                    @click.stop="toggleVendorProductsView(vendor)"
                    :title="getVendorToggleButtonTitle(vendor)"
                  >
                    <i :class="getVendorToggleButtonIcon(vendor)"></i>
                    {{ getVendorToggleButtonLabel(vendor) }}
                  </button>
                  
                  <span class="chip chip-small chip-primary">
                    <i class="fas fa-box chip-icon"></i>
                    {{ getVendorProductsCount(vendor) }} products
                  </span>
                </div>
              </div>

              <!-- ✅ VENDOR CONTENT (PRODUCTS) -->
              <div 
                v-show="expandedVendors.has(vendors.indexOf(vendor))" 
                class="vendor-content"
              >
                <div class="products-header">
                  <h4 
                    class="products-clickable-title"
                    @dblclick="openProductDialog(vendor)"
                  >
                    <span class="chip chip-info chip-small">
                      {{ getFilteredProducts(vendor).length }} items
                    </span>

                    <button
                      type="button"
                      class="btn btn-success btn-small add-product-hint"
                      @click.stop="openProductDialog(vendor)"
                      title="Double-click title or click here to add new product"
                    >
                      <i class="fas fa-plus-circle"></i>
                    </button>
                  </h4>
                </div>

                <!-- ✅ PRODUCTS LIST -->
                <div v-if="getFilteredProducts(vendor).length > 0" class="products-list">
                  <div
                    v-for="(product) in getFilteredProducts(vendor)"
                    :key="product.id"
                    :class="[
                      'product-card', 
                      'card',
                      { 'product-selected': product.active }
                    ]"
                    @click="toggleProduct(product)"
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
                  <p>{{ showShoppingList ? 'No selected products' : 'No products available' }} for this vendor</p>
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
                @click="toggleAllVendors"
                class="btn btn-outlined btn-small control-btn"
                :class="{ 'btn-danger': allVendorsExpanded }"
              >
                <i class="fas fa-store"></i>
                {{ allVendorsExpanded ? 'Collapse All' : 'Expand All' }}
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
import { ref, computed, onMounted, onErrorCaptured } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

// ✅ COMPOSITION API SETUP
const store = useStore();
const router = useRouter();
const confirmDialogue = ref(null);

// ✅ ERROR HANDLER
onErrorCaptured((error, instance, info) => {
  console.error('❌ Component error captured:', error);
  console.error('❌ Error info:', info);
  
  if (error.message && error.message.includes('__asyncLoader')) {
    console.error('❌ Async loader error - likely a routing/component import issue');
    return false;
  }
  
  return false;
});

// ✅ REACTIVE STATE
const showShoppingList = ref(true);
const expandedVendors = ref(new Set());
const vendorShowAllOverrides = ref(new Set());
const isSubmitting = ref(false);
const isLoading = ref(true);

// Product Dialog State
const showProductDialog = ref(false);
const showProductDropdown = ref(false);
const productSearch = ref('');
const isSubmittingProduct = ref(false);
const selectedContext = ref({
  vendorId: null,
  vendorName: '',
  location: ''
});

const newProduct = ref({
  product_name: '',
  other_product_name: '',
  description: '',
  active: true,
  vendor_id: null
});

// ✅ COMPUTED PROPERTIES
const vendorsProducts = computed(() => store.state.vendors_products || []);
const user = computed(() => store.state.user?.resource_owner);

// Get unique vendors (no duplicates)
const vendors = computed(() => {
  const uniqueVendors = [];
  const seenIds = new Set();
  
  vendorsProducts.value.forEach(vp => {
    const vendorId = vp.vendor_id || vp.id;
    if (!seenIds.has(vendorId)) {
      seenIds.add(vendorId);
      uniqueVendors.push(vp);
    }
  });
  
  return uniqueVendors;
});

// Filter vendors based on shopping list toggle
const filteredVendors = computed(() => {
  if (showShoppingList.value) {
    return vendors.value.filter(vendor => {
      const products = vendor.products || [];
      return products.some(p => p.active);
    });
  }
  return vendors.value;
});

// All vendors expanded?
const allVendorsExpanded = computed(() => {
  return vendors.value.length > 0 && expandedVendors.value.size === vendors.value.length;
});

// Get products count for a vendor
const getVendorProductsCount = (vendor) => {
  return (vendor.products || []).length;
};

const getVendorFilterKey = (vendor) => {
  const id = vendor.vendor_id || vendor.id;
  const location = vendor.location || '';
  return `${id}::${location}`;
};

const getVendorIndex = (vendor) => vendors.value.indexOf(vendor);

const isVendorExpanded = (vendor) => expandedVendors.value.has(getVendorIndex(vendor));

const isShowingAllProductsForVendor = (vendor) => {
  return vendorShowAllOverrides.value.has(getVendorFilterKey(vendor));
};

const getVendorToggleButtonLabel = (vendor) => {
  if (!isVendorExpanded(vendor)) return 'Show Selected';
  return isShowingAllProductsForVendor(vendor) ? 'Show Selected' : 'Show All Products';
};

const getVendorToggleButtonIcon = (vendor) => {
  if (!isVendorExpanded(vendor)) return 'fas fa-filter';
  return isShowingAllProductsForVendor(vendor) ? 'fas fa-filter' : 'fas fa-list';
};

const getVendorToggleButtonTitle = (vendor) => {
  if (!isVendorExpanded(vendor)) return 'Show selected products for this vendor/location';
  return isShowingAllProductsForVendor(vendor)
    ? 'Currently showing all products. Click to show selected only.'
    : 'Currently showing selected products. Click to show all products.';
};

// Get filtered products for a vendor (respects shopping list toggle)
const getFilteredProducts = (vendor) => {
  const products = vendor.products || [];
  if (showShoppingList.value && !isShowingAllProductsForVendor(vendor)) {
    return products.filter(p => p.active);
  }
  return products;
};

// Product dialog autocomplete
const allProductNames = computed(() => {
  const names = new Set();
  vendorsProducts.value.forEach(vendor => {
    if (vendor.products) {
      vendor.products.forEach(p => {
        if (p.product_name) {
          names.add(p.product_name);
        }
      });
    }
  });
  names.add('Other');
  return Array.from(names).sort();
});

const filteredProductOptions = computed(() => {
  if (!productSearch.value) {
    return allProductNames.value;
  }
  const search = productSearch.value.toLowerCase();
  return allProductNames.value.filter(name => 
    name.toLowerCase().includes(search)
  );
});

const productFormValid = computed(() => {
  if (!newProduct.value.product_name) return false;
  if (newProduct.value.product_name === 'Other' && !newProduct.value.other_product_name) {
    return false;
  }
  return true;
});

const getProductHint = computed(() => {
  if (!productSearch.value) {
    return 'Type to search existing products or select "Other" to create new';
  }
  if (filteredProductOptions.value.length === 0) {
    return 'No matching products found. Try selecting "Other" to create new product';
  }
  return `${filteredProductOptions.value.length} products found`;
});

// ✅ METHODS

// Toggle all vendors
const toggleAllVendors = () => {
  if (allVendorsExpanded.value) {
    expandedVendors.value.clear();
  } else {
    vendors.value.forEach((_, index) => {
      expandedVendors.value.add(index);
    });
  }
};

// Toggle product active state
const toggleProduct = (product) => {
  product.active = !product.active;
  console.log(`🔄 Toggled product: ${product.product_name} -> ${product.active}`);
};

const toggleVendorProductsView = (vendor) => {
  const key = getVendorFilterKey(vendor);
  const idx = getVendorIndex(vendor);

  // First click opens this vendor in selected-only mode.
  if (!expandedVendors.value.has(idx)) {
    expandedVendors.value.add(idx);
    vendorShowAllOverrides.value.delete(key);
    console.log(`📋 Expanded ${vendor.vendor_name} (${vendor.location}) in selected-only mode`);
    return;
  }

  // Subsequent clicks toggle selected/all modes.
  if (vendorShowAllOverrides.value.has(key)) {
    vendorShowAllOverrides.value.delete(key);
    console.log(`📋 Showing selected-only products for ${vendor.vendor_name} (${vendor.location})`);
  } else {
    vendorShowAllOverrides.value.add(key);
    console.log(`📋 Showing all products for ${vendor.vendor_name} (${vendor.location})`);
  }
};

// Edit vendor
const editVendor = (vendor) => {
  router.push({
    name: 'VendorEdit',
    params: { id: vendor.vendor_id || vendor.id }
  });
};

// Edit product
const editProduct = (product) => {
  router.push({
    name: 'ProductEdit',
    params: { id: product.id }
  });
};

// Product Dialog Methods
const openProductDialog = (vendor) => {
  selectedContext.value = {
    vendorId: vendor.vendor_id || vendor.id,
    vendorName: vendor.vendor_name,
    location: vendor.location
  };
  
  newProduct.value = {
    product_name: '',
    other_product_name: '',
    description: '',
    active: true,
    vendor_id: selectedContext.value.vendorId
  };
  
  productSearch.value = '';
  showProductDialog.value = true;
};

const closeProductDialog = () => {
  showProductDialog.value = false;
  showProductDropdown.value = false;
  productSearch.value = '';
};

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
  
  if (productName === 'Other') {
    newProduct.value.active = true;
  }
};

const submitNewProduct = async () => {
  if (!productFormValid.value) return;
  
  try {
    isSubmittingProduct.value = true;
    
    const productData = {
      ...newProduct.value,
      vendor_id: selectedContext.value.vendorId,
      created_by: user.value?.email || '',
      id: uuidv4()
    };
    
    console.log('🚀 Creating new product:', productData);
    
    const result = await store.dispatch('createProduct', productData);

    // Show server message when present (backend returns message on re-activate)
    if (result?.success) {
      store.dispatch('notify', { message: result.message || `✅ Product "${newProduct.value.product_name}" added successfully!`, type: 'success' });

      // Refresh data
      await Promise.all([
        store.dispatch('fetchProducts'),
        store.dispatch('fetchVendorsProducts')
      ]);

      closeProductDialog();
    } else {
      throw new Error(result?.error || 'Failed to create product');
    }
    
  } catch (error) {
    console.error('❌ Error creating product:', error);
    store.dispatch('notify', { message: `❌ Error: ${error.message}`, type: 'error' });
  } finally {
    isSubmittingProduct.value = false;
  }
};

// Submit changes
const submitChanges = async () => {
  try {
    isSubmitting.value = true;
    
    console.log('🔍 PRE-SUBMIT DEBUG:');
    console.log('- vendorsProducts.value:', vendorsProducts.value);
    
    if (!Array.isArray(vendorsProducts.value) || vendorsProducts.value.length === 0) {
      throw new Error('No vendors products to update!');
    }
    
    // Flatten all products
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
      updated_by: user.value?.email || '',
    }));
    
    const activeCount = changedProducts.filter(p => p.active).length;
    const inactiveCount = changedProducts.filter(p => !p.active).length;
    
    console.log('📊 SUBMISSION SUMMARY:');
    console.log(`  Total products: ${changedProducts.length}`);
    console.log(`  ✅ Active: ${activeCount}`);
    console.log(`  ❌ Inactive: ${inactiveCount}`);
    
    const submitData = {
      products: changedProducts,
      id: uuidv4(),
      created_by: user.value?.email || '',
    };
    
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
    
    if (error.response?.status === 422) {
      alert(`❌ Validation Error: ${JSON.stringify(error.response.data)}`);
    } else if (error.response?.status === 500) {
      alert(`❌ Server Error: Check backend logs`);
    } else {
      alert(`❌ Error: ${error.message}`);
    }
  } finally {
    isSubmitting.value = false;
  }
};

// ✅ LIFECYCLE
onMounted(async () => {
  try {
    await store.dispatch('fetchVendorsProducts');
  } catch (error) {
    console.error('❌ Error loading vendors products:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>
<!-- ✅ STYLES STAY THE SAME -->
<style scoped>
/* ✅ IMPORT ALL SHARED STYLES */
@import '@/assets/styles/ui-components.css';
@import '@/assets/styles/product-components.css';

/* ========================================
   COMPONENT-SPECIFIC ONLY (30 lines!)
   ======================================== */

.products-vendor-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/* Utility Classes */
.mt-4 { margin-top: 1rem; }
.mt-5 { margin-top: 1.5rem; }
.mb-4 { margin-bottom: 1rem; }
.chip-icon { margin-right: 0.25rem; }

.vendor-location-chip {
  padding: 0.375rem 0.875rem;
  font-size: 0.85rem;
}

.vendor-location-text {
  font-weight: 900;
}

/* Responsive */
@media (max-width: 768px) {
  .products-vendor-container {
    padding: 0.5rem;
  }
  
  .navigation-grid {
    grid-template-columns: 1fr;
  }
}
</style>