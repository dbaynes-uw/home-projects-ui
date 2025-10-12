<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/products/ProductsByVendors.vue -->
<template>
  <div class="page-wrapper">
    <div class="products-by-vendors-container">
      <!-- ✅ HEADER CARD -->
      <v-card class="mx-auto mt-5">
        <v-card-title class="pb-0">
          <h2>
            <i class="fas fa-store"></i>
            Products By Vendor
          </h2>
        </v-card-title>
        
        <!-- ✅ NAVIGATION BUTTONS - FIXED -->
        <v-card-text>
          <div class="navigation-flex">
            <v-btn
              variant="outlined"
              :to="{ name: 'ProductsByLocations' }"
              prepend-icon="fas fa-map-marker-alt"
              class="nav-button"
            >
              Shopping List By Location
            </v-btn>
            
            <v-btn
              variant="outlined"
              :to="{ name: 'ProductList' }"
              prepend-icon="fas fa-shopping-basket"
              class="nav-button"
            >
              Shopping List By Product
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

      <!-- ✅ REST OF YOUR TEMPLATE STAYS THE SAME -->
      <v-card class="mt-4">
        <v-card-text>
          <v-form @submit.prevent="onSubmit">
            <!-- ✅ SHOPPING LIST TOGGLE WITH CHIP -->
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
                <p class="mt-4">Loading vendors and products...</p>
              </div>

              <!-- ✅ VENDORS AND PRODUCTS LIST -->
              <div v-else class="vendors-wrapper">
                <div class="row">
                  <div 
                    class="column" 
                    id="group" 
                    v-for="(vendor, groupIndex) in displayedVendors" 
                    :key="`vendor-${groupIndex}`"
                  >
                    <!-- ✅ VENDOR NAME TOGGLE -->
                    <div v-if="showVendorDisplay(groupIndex)" class="vendor-header">
                      <h1 @click="toggleVendor(groupIndex)" class="vendor-name">
                        <u>{{ vendor.vendor_name }}</u>
                      </h1>
                      <br/>
                    </div>

                    <!-- ✅ VENDOR LOCATION INFO -->
                    <div class="vendor-location">
                      <u>
                        <small style="font-size: 1rem;">
                          <b>({{ vendor.location }} - {{ vendor.vendor_name }})</b>
                        </small>
                      </u>
                      <br/>
                    </div>
                    <br/>

  <!-- ✅ PRODUCTS LIST - FIXED CHECKBOX IDS -->
  <div class="products-list">
    <div 
      v-for="(item, productIndex) in vendor.products" 
      :key="`product-${item.id}`"
      class="product-item"
    >
      <!-- ✅ USE PRODUCT ID FOR STABLE CHECKBOX IDENTIFICATION -->
      <div class="product-section">
        <input
          type="checkbox"
          :checked="item.active"
          @change="toggleProductActive(item)"
          class="product-checkbox"
          :id="`product-checkbox-${item.id}`"
        />
        <label 
          :for="`product-checkbox-${item.id}`"
          class="checkbox-label"
        >
          <i class="fas fa-box"></i>
          {{ item.product_name }}
        </label>
      </div>
    </div>
  </div>
                  </div>
                </div>

                <!-- ✅ EMPTY STATE -->
                <div v-if="displayedVendors.length === 0" class="empty-state">
                  <v-icon size="64" color="grey">fas fa-store-slash</v-icon>
                  <h3 class="mt-4">No vendors found</h3>
                  <p>{{ showShoppingList ? 'No vendors with active items' : 'No vendors available' }}</p>
                </div>
              </div>

              <!-- ✅ SUBMIT BUTTON WITH ACTIVE COUNT -->
              <v-btn 
                type="submit" 
                color="primary"
                size="large"
                block 
                class="mt-4"
                :loading="isSubmitting"
                :disabled="displayedVendors.length === 0"
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
          <p><strong>All Vendors Products:</strong> {{ vendorsProducts.length }} total</p>
          <p><strong>Displayed Vendors:</strong> {{ displayedVendors.length }} vendors</p>
          <p><strong>Active Products:</strong> {{ getActiveProductsCount }}</p>
          
          <v-btn 
            @click="debugCurrentState"
            variant="outlined"
            size="small"
            class="mt-2"
          >
            Debug Current State
          </v-btn>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onErrorCaptured } from 'vue';
import { useStore } from 'vuex';
import { v4 as uuidv4 } from 'uuid';

// ✅ COMPOSITION API SETUP
const store = useStore();

// ✅ ERROR HANDLER FOR ASYNC LOADER ISSUES
onErrorCaptured((error, instance, info) => {
  console.error('❌ Component error captured:', error);
  console.error('❌ Error info:', info);
  
  if (error.message && error.message.includes('__asyncLoader')) {
    console.error('❌ Async loader error - likely a routing/component import issue');
    console.error('❌ This usually means a component file is missing or has syntax errors');
    return false; // Prevent error from propagating
  }
  
  return false;
});

// ✅ REACTIVE STATE
const showShoppingList = ref(true);
const isProductToggled = ref(null);
const isSubmitting = ref(false);
const isLoading = ref(true);

// ✅ COMPUTED PROPERTIES
const vendorsProducts = computed(() => store.state.vendors_products || []);
const user = computed(() => store.state.user?.resource_owner);
const isDev = computed(() => process.env.NODE_ENV === 'development');

// ✅ ENHANCED DISPLAYED VENDORS - PRESERVE ORIGINAL REFERENCES
const displayedVendors = computed(() => {
  if (showShoppingList.value) {
    // ✅ SHOW ONLY VENDORS WITH ACTIVE PRODUCTS BUT PRESERVE PRODUCT REFERENCES
    return vendorsProducts.value
      .map(vendor => {
        const activeProducts = vendor.products?.filter(product => product.active) || [];
        
        if (activeProducts.length > 0) {
          return {
            ...vendor,
            products: activeProducts
          };
        }
        return null;
      })
      .filter(vendor => vendor !== null);
  } else {
    // ✅ SHOW ALL VENDORS WITH ALL PRODUCTS
    return vendorsProducts.value;
  }
});
// ✅ ACTIVE PRODUCTS COUNT
const getActiveProductsCount = computed(() => {
  let count = 0;
  vendorsProducts.value.forEach(vendor => {
    if (vendor.products) {
      count += vendor.products.filter(product => product.active).length;
    }
  });
  return count;
});

// ✅ METHODS
const showVendorDisplay = (index) => {
  if (index === 0) {
    return true;
  }
  
  const currentVendor = displayedVendors.value[index];
  const previousVendor = displayedVendors.value[index - 1];
  
  if (!currentVendor?.vendor_name) {
    return true;
  }
  
  if (currentVendor.vendor_name === previousVendor?.vendor_name) {
    return false;
  } else {
    return true;
  }
};

const toggleProductActive = (item) => {
  const oldValue = item.active;
  item.active = !item.active;
  
  console.log(`🔄 Product ID ${item.id}: "${item.product_name}"`);
  console.log(`   Changed from ${oldValue} to ${item.active}`);
  console.log(`   Vendor: ${item.vendor_name}`);
  console.log(`   Location: ${item.location}`);
};

const toggleShoppingListDisplay = () => {
  showShoppingList.value = !showShoppingList.value;
  console.log(`🔄 Shopping list mode: ${showShoppingList.value ? 'Active items only' : 'All items'}`);
};

const toggleVendor = (index) => {
  isProductToggled.value = index === isProductToggled.value ? null : index;
  console.log(`🔄 Toggled vendor at index: ${index}`);
};

// ✅ ONSUBMIT THAT MATCHES PRODUCTLIST EXACTLY
const onSubmit = async () => {
  try {
    isSubmitting.value = true;
    
    console.log('🔍 PRE-SUBMIT DEBUG:');
    console.log('- vendorsProducts.value:', vendorsProducts.value);
    console.log('- vendorsProducts length:', vendorsProducts.value?.length);
    console.log('- user email:', user.value?.email);
    
    if (!Array.isArray(vendorsProducts.value) || vendorsProducts.value.length === 0) {
      throw new Error('No vendors products to update!');
    }
    
    // ✅ FLATTEN ALL VENDOR PRODUCTS INTO SINGLE ARRAY (LIKE PRODUCTLIST)
    const allProducts = [];
    
    vendorsProducts.value.forEach((vendor, vendorIndex) => {
      if (vendor.products && Array.isArray(vendor.products)) {
        vendor.products.forEach((product, productIndex) => {
          allProducts.push({
            ...product,
            // ✅ ENSURE VENDOR INFO IS PRESERVED FROM VENDOR CONTEXT
            vendor_id: product.vendor_id || vendor.id,
            vendor_name: vendor.vendor_name || product.vendor_name,
            location: vendor.location || product.location
          });
          
          console.log(`📋 Vendor ${vendorIndex}, Product ${productIndex}: "${product.product_name}" - Active: ${product.active}`);
        });
      }
    });
    
    // ✅ NOW USE EXACTLY THE SAME LOGIC AS PRODUCTLIST
    const sourceData = allProducts; // This is our flattened product array
    
    console.log('🔍 Source data:', sourceData.length, 'items');
    console.log('🔍 Mode: Vendor Products (flattened)');
    
    // ✅ TRACK CHANGES EXPLICITLY (IDENTICAL TO PRODUCTLIST)
    const changedProducts = sourceData.map(product => {
      const isCurrentlyActive = !!product.active;
      
      console.log(`📋 "${product.product_name}" - Active: ${isCurrentlyActive}`);
      
      return {
        id: product.id,
        vendor_id: product.vendor_id || 1,
        product_name: product.product_name || product.name || 'Unknown Product',
        location: product.location,
        vendor_name: product.vendor_name,
        active: isCurrentlyActive, // ✅ EXPLICIT BOOLEAN
        created_at: product.created_at,
        updated_at: product.updated_at,
        updated_by: user.value?.email || '',
        updated_at_client: new Date().toISOString()
      };
    });
    
    // ✅ SHOW WHAT'S BEING SENT (IDENTICAL TO PRODUCTLIST)
    const activeCount = changedProducts.filter(p => p.active).length;
    const inactiveCount = changedProducts.filter(p => !p.active).length;
    
    console.log('📊 SUBMISSION SUMMARY:');
    console.log(`  Total products: ${changedProducts.length}`);
    console.log(`  ✅ Will be marked active: ${activeCount}`);
    console.log(`  ❌ Will be marked inactive: ${inactiveCount}`);
    
    // ✅ IDENTICAL SUBMIT DATA STRUCTURE AS PRODUCTLIST
    const submitData = {
      products: changedProducts,
      id: uuidv4(),
      created_by: user.value?.email || '',
    };
    
    console.log('🚀 Submitting all product states:', submitData);
    
    // ✅ USE THE SAME STORE ACTION AS PRODUCTLIST (PRODUCTS CONTROLLER)
    const result = await store.dispatch('putProducts', submitData);
    
    if (result !== false) {
      console.log('✅ All product states updated successfully');
      alert(`✅ Updated ${changedProducts.length} products (${activeCount} active, ${inactiveCount} inactive)`);
      
      // ✅ SAME REFRESH PATTERN AS PRODUCTLIST
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
    
    // ✅ SAME ERROR HANDLING AS PRODUCTLIST
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

// ✅ ENHANCED DEBUG FUNCTION
const debugCurrentState = () => {
  console.log('🔍 CURRENT STATE DEBUG:');
  console.log('='.repeat(50));
  
  console.log('Mode:', showShoppingList.value ? 'Shopping List (Active Only)' : 'All Products');
  console.log('All vendors products length:', vendorsProducts.value.length);
  console.log('Displayed vendors length:', displayedVendors.value.length);
  
  console.log('\n📋 ALL VENDORS PRODUCTS (ORIGINAL):');
  vendorsProducts.value.forEach((vendor, vIndex) => {
    console.log(`  Vendor ${vIndex}: ${vendor.vendor_name} (${vendor.location})`);
    if (vendor.products) {
      vendor.products.forEach((product, pIndex) => {
        console.log(`    Product ${pIndex} [ID:${product.id}]: "${product.product_name}" - Active: ${product.active}`);
      });
    }
  });
  
  console.log('\n📋 DISPLAYED VENDORS (FILTERED):');
  displayedVendors.value.forEach((vendor, vIndex) => {
    console.log(`  Vendor ${vIndex}: ${vendor.vendor_name} (${vendor.location})`);
    if (vendor.products) {
      vendor.products.forEach((product, pIndex) => {
        console.log(`    Product ${pIndex} [ID:${product.id}]: "${product.product_name}" - Active: ${product.active}`);
      });
    }
  });
  
  console.log('\n🔍 ACTIVE PRODUCTS BREAKDOWN:');
  let totalActive = 0;
  let totalInactive = 0;
  
  vendorsProducts.value.forEach(vendor => {
    if (vendor.products) {
      vendor.products.forEach(product => {
        if (product.active) {
          totalActive++;
          console.log(`  ✅ Active: ${product.product_name} (ID: ${product.id})`);
        } else {
          totalInactive++;
          console.log(`  ❌ Inactive: ${product.product_name} (ID: ${product.id})`);
        }
      });
    }
  });
  
  console.log(`\n📊 TOTALS: ${totalActive} active, ${totalInactive} inactive`);
  console.log('='.repeat(50));
};

// ✅ LIFECYCLE
onMounted(async () => {
  try {
    console.log('🔍 ProductsByVendors mounted, fetching data...');
    await store.dispatch('fetchVendorsProducts');
    console.log('✅ Vendors products data loaded:', vendorsProducts.value.length, 'items');
  } catch (error) {
    console.error('❌ Error loading vendors products:', error);
  } finally {
    isLoading.value = false;
  }
});

// ✅ WATCHERS
watch(vendorsProducts, (newProducts) => {
  console.log('🔄 Vendors products updated:', newProducts.length, 'items');
}, { deep: true });

watch(showShoppingList, (newValue) => {
  console.log(`🔄 Shopping list display mode: ${newValue ? 'Active items only' : 'All items'}`);
});

watch(displayedVendors, (newVendors) => {
  console.log(`🔄 Displayed vendors updated: ${newVendors.length} vendors, ${getActiveProductsCount.value} active products`);
}, { deep: true });
</script>

<!-- ✅ STYLES STAY THE SAME -->
<style scoped>
/* ✅ ALL YOUR EXISTING STYLES STAY THE SAME */
.page-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.products-by-vendors-container {
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

.vendors-wrapper {
  min-height: 200px;
}

.vendor-header {
  margin-bottom: 1rem;
}

.vendor-name {
  color: #1976d2;
  cursor: pointer;
  font-size: 1.5rem;
  margin: 0;
  transition: color 0.3s ease;
}

.vendor-name:hover {
  color: #1565c0;
}

.vendor-location {
  color: #666;
  font-style: italic;
  margin-bottom: 0.5rem;
}

.product-item {
  margin-bottom: 0.5rem;
}

.product-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-left: 4px solid #1976d2;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.product-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
  
  .vendor-name {
    font-size: 1.25rem;
  }
  
  .product-section {
    padding: 0.75rem;
  }
}

.toggle-link:focus,
.vendor-name:focus,
.checkbox-label:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

.product-checkbox:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}
</style>