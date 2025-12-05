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
                @click="toggleVendor(vendors.indexOf(vendor))"
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
                  <span class="chip chip-small chip-grey">
                    <i class="fas fa-map-marker-alt chip-icon"></i>
                    {{ vendor.location }}
                  </span>
                  
                  <span class="chip chip-small chip-primary">
                    <i class="fas fa-box chip-icon"></i>
                    {{ getVendorProductsCount(vendor) }} products
                  </span>
                  
                  <i 
                    :class="[
                      'fas', 
                      'chevron-icon',
                      expandedVendors.has(vendors.indexOf(vendor)) ? 'fa-chevron-up' : 'fa-chevron-down'
                    ]"
                  ></i>
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
                    v-for="(product, productIndex) in getFilteredProducts(vendor)"
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
const showShoppingList = ref(false);
const expandedVendors = ref(new Set());
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
const isDev = computed(() => process.env.NODE_ENV === 'development');

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

// Get filtered products for a vendor (respects shopping list toggle)
const getFilteredProducts = (vendor) => {
  const products = vendor.products || [];
  if (showShoppingList.value) {
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

// Toggle vendor expansion
const toggleVendor = (vendorIndex) => {
  if (expandedVendors.value.has(vendorIndex)) {
    expandedVendors.value.delete(vendorIndex);
  } else {
    expandedVendors.value.add(vendorIndex);
  }
};

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
    
    await store.dispatch('createProduct', productData);
    
    alert(`✅ Product "${newProduct.value.product_name}" added successfully!`);
    
    // Refresh data
    await Promise.all([
      store.dispatch('fetchProducts'),
      store.dispatch('fetchVendorsProducts')
    ]);
    
    closeProductDialog();
    
  } catch (error) {
    console.error('❌ Error creating product:', error);
    alert(`❌ Error: ${error.message}`);
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
      created_at: product.created_at,
      updated_at: product.updated_at,
      updated_by: user.value?.email || '',
      updated_at_client: new Date().toISOString()
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
/* ✅ IMPORT SHARED STYLES */
@import '@/assets/styles/ui-components.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES ONLY
   ======================================== */

/* Page Container */
.products-vendor-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

/* Navigation */
.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/* Switch Container */
.switch-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
}

.switch-description-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.switch-description-text {
  color: #667eea;
  font-weight: 600;
  font-size: 1rem;
}

/* Content Layout */
.content-wrapper {
  padding: 1.5rem;
}

.content-container {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  align-items: start;
}

/* Vendors Grid */
.vendors-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.vendor-card {
  transition: all 0.3s ease;
}

.vendor-card.vendor-expanded {
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
}

.vendor-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

.vendor-header:hover {
  background: rgba(102, 126, 234, 0.05);
  border-bottom-color: #667eea;
}

.vendor-store-icon {
  color: #667eea;
  font-size: 1.5rem;
}

.vendor-name-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.vendor-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.edit-vendor-btn {
  opacity: 0;
  transition: opacity 0.2s;
}

.vendor-header:hover .edit-vendor-btn {
  opacity: 1;
}

.vendor-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.chevron-icon {
  color: #667eea;
  font-size: 1.25rem;
  transition: transform 0.3s;
}

.vendor-content {
  padding: 1.5rem;
  animation: slideDown 0.3s ease;
}

/* Products */
.products-header {
  margin-bottom: 1rem;
}

.products-clickable-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  padding: 0.5rem 0;
  cursor: pointer;
  color: #667eea;
  transition: color 0.2s;
}

.products-clickable-title:hover {
  color: #764ba2;
}

.add-product-hint {
  opacity: 0;
  transition: opacity 0.2s;
}

.products-clickable-title:hover .add-product-hint {
  opacity: 1;
}

.products-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 0.75rem;
}

.product-card {
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.product-card.product-selected {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(69, 160, 73, 0.05) 100%);
  border-color: #4CAF50;
}

.product-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
}

.product-indicators {
  flex-shrink: 0;
  width: 24px;
}

.selected-indicator {
  color: #4CAF50;
  font-size: 1.25rem;
}

.product-name {
  flex: 1;
  font-weight: 500;
  color: #333;
}

.edit-hint {
  display: none;
}

.product-card:hover .edit-hint {
  display: inline;
}

/* Global Controls */
.global-controls-fixed {
  position: sticky;
  top: 80px;
}

.global-controls {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

.controls-title {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  color: #667eea;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-btn {
  width: 100%;
  margin-bottom: 0.5rem;
  justify-content: flex-start;
}

.control-btn:last-child {
  margin-bottom: 0;
}

/* Submit Buttons */
.top-submit-section {
  position: sticky;
  top: 70px;
  z-index: 100;
  background: white;
  padding: 1rem 0;
  margin: -1rem -1rem 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.top-submit-button {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.mb-safe-area {
  margin-bottom: 2rem;
}

/* Utility Classes */
.mt-4 { margin-top: 1rem; }
.mt-5 { margin-top: 1.5rem; }
.mb-4 { margin-bottom: 1rem; }
.chip-icon { margin-right: 0.25rem; }

/* Responsive */
@media (max-width: 1024px) {
  .content-container {
    grid-template-columns: 1fr;
  }
  
  .global-controls-fixed {
    position: static;
    margin-top: 2rem;
  }
  
  .global-controls {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .controls-title {
    width: 100%;
  }
  
  .control-btn {
    flex: 1;
    min-width: 150px;
    margin-bottom: 0;
  }
}

@media (max-width: 768px) {
  .navigation-grid {
    grid-template-columns: 1fr;
  }
  
  .vendor-header {
    flex-wrap: wrap;
    padding: 1rem;
  }
  
  .vendor-controls {
    flex-wrap: wrap;
    width: 100%;
    justify-content: flex-start;
  }
  
  .products-list {
    grid-template-columns: 1fr;
  }
}
</style>