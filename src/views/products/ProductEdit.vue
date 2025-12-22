<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/products/ProductEdit.vue -->

<template>
  <div class="product-edit-container">
    <ConfirmDialogue ref="confirmDialogue" />
    
    <!-- ✅ HEADER CARD -->
    <div class="card mt-5">
      <div class="card-header">
        <h2 class="card-title">
          <i class="fas fa-box"></i>
          Edit or Delete Product
        </h2>
        <p v-if="statusMessage" class="status-message">
          <i class="fas fa-info-circle"></i>
          {{ statusMessage }}
        </p>
      </div>

      <!-- ✅ ACTION BUTTONS -->
      <div class="card-body">
        <div class="action-buttons">
          <router-link 
            :to="{ name: 'ProductsByLocations' }"
            class="btn btn-outlined"
          >
            <i class="fas fa-arrow-left"></i>
            Back to Shopping
          </router-link>

          <button 
            @click="deleteProduct"
            class="btn btn-danger"
            type="button"
          >
            <i class="fas fa-trash"></i>
            Delete Product
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ LOADING STATE -->
    <div v-if="loading" class="card mt-4">
      <div class="card-body">
        <div class="loading-container">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Loading product...</p>
        </div>
      </div>
    </div>

    <!-- ✅ ERROR STATE -->
    <div v-else-if="error" class="card mt-4">
      <div class="card-body">
        <div class="error-container">
          <i class="fas fa-exclamation-triangle"></i>
          <p>{{ error }}</p>
          <button @click="fetchProduct" class="btn btn-primary">
            <i class="fas fa-redo"></i>
            Retry
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ EDIT FORM -->
    <div v-else-if="product" class="card mt-4">
      <form @submit.prevent="updateProduct">
        <div class="card-body">
          
          <!-- ✅ PRODUCT INFO SECTION -->
          <div class="info-section mb-4">
            <div class="info-row">
              <span class="info-label">
                <i class="fas fa-hashtag"></i>
                Product ID:
              </span>
              <span class="info-value">{{ product.id }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">
                <i class="fas fa-calendar-plus"></i>
                Created:
              </span>
              <span class="info-value">{{ formatDate(product.created_at) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">
                <i class="fas fa-calendar-alt"></i>
                Last Updated:
              </span>
              <span class="info-value">{{ formatDate(product.updated_at) }}</span>
            </div>
          </div>

          <!-- ✅ VENDOR SELECT -->
          <div class="form-group">
            <label class="form-label required">
              <i class="fas fa-store"></i>
              Vendor
            </label>
            <div class="select-wrapper">
              <select
                v-model="product.vendor_id"
                class="form-select"
                required
                @change="onVendorChange"
              >
                <option value="" disabled>Select a vendor...</option>
                <option 
                  v-for="vendor in vendors" 
                  :key="vendor.id"
                  :value="vendor.id"
                >
                  {{ vendor.vendor_name }} ({{ vendor.location }})
                </option>
              </select>
              <i class="fas fa-chevron-down select-icon"></i>
            </div>
            <small class="form-hint">
              {{ vendors.length }} vendors available
            </small>
          </div>

          <!-- ✅ LOCATION (Auto-populated from vendor) -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-map-marker-alt"></i>
              Location
            </label>
            <input
              v-model="selectedVendorLocation"
              type="text"
              class="form-input"
              disabled
              placeholder="Select a vendor first"
            />
            <small class="form-hint">
              Location is automatically set based on the selected vendor
            </small>
          </div>

          <!-- ✅ PRODUCT NAME -->
          <div class="form-group">
            <label class="form-label required">
              <i class="fas fa-box"></i>
              Product Name
            </label>
            <input
              v-model="product.product_name"
              type="text"
              class="form-input"
              required
              placeholder="Enter product name"
            />
          </div>

          <!-- ✅ ACTIVE STATUS -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-toggle-on"></i>
              Status
            </label>
            <div class="toggle-wrapper">
              <label class="toggle-label">
                <input
                  v-model="product.active"
                  type="checkbox"
                  class="toggle-input"
                />
                <span class="toggle-slider"></span>
                <span class="toggle-text">
                  {{ product.active ? 'Active' : 'Inactive' }}
                </span>
              </label>
            </div>
          </div>

          <!-- ✅ NOTES -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-sticky-note"></i>
              Notes
            </label>
            <textarea
              v-model="product.notes"
              class="form-input"
              rows="4"
              placeholder="Add any notes about this product..."
            ></textarea>
          </div>

          <!-- ✅ SUBMIT BUTTON -->
          <button 
            type="submit"
            class="btn btn-primary btn-large btn-block"
            :disabled="isSubmitting"
            :class="{ 'btn-loading': isSubmitting }"
          >
            <template v-if="!isSubmitting">
              <i class="fas fa-save"></i>
              Update Product
            </template>
            <template v-else>
              <i class="fas fa-spinner fa-spin"></i>
              Updating...
            </template>
          </button>

          <!-- ✅ STATUS MESSAGE -->
          <p v-if="statusMessage" class="status-message-bottom">
            <i class="fas fa-check-circle"></i>
            {{ statusMessage }}
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'

// ✅ COMPOSABLES
const store = useStore()
const router = useRouter()
const route = useRoute()

// ✅ REFS
const confirmDialogue = ref(null)
const product = ref(null)
const loading = ref(false)
const error = ref(null)
const statusMessage = ref('')
const isSubmitting = ref(false)

// ✅ COMPUTED
const vendors = computed(() => store.state.vendors || [])

const selectedVendor = computed(() => {
  if (!product.value?.vendor_id) return null
  return vendors.value.find(v => v.id === product.value.vendor_id)
})

const selectedVendorLocation = computed(() => {
  return selectedVendor.value?.location || 'No vendor selected'
})

// ✅ METHODS
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const fetchProduct = async () => {
  try {
    loading.value = true
    error.value = null  
    
    // ✅ GET request to products controller    
    const response = await api.get(`/api/v1/products/${route.params.id}`)
    
    // ✅ API returns { product: {...}, vendor: {...} }
    product.value = response.data.product
    
  } catch (err) {
    console.error('❌ Error fetching product:', err)
    error.value = err.response?.data?.message || 'Failed to load product'
  } finally {
    loading.value = false
  }
}

const fetchVendors = async () => {
  try {
    if (vendors.value.length === 0) {
      await store.dispatch('fetchVendors')
    }
  } catch (err) {
    console.error('❌ Error fetching vendors:', err)
  }
}

const onVendorChange = () => {
  
  // Auto-update location based on vendor
  if (selectedVendor.value) {
    product.value.location = selectedVendor.value.location
  }
}

const updateProduct = async () => {
  try {
    const ok = await confirmDialogue.value.show({
      title: 'Update Product',
      message: `Are you sure you want to update "${product.value.product_name}"?`,
      okButton: 'Update',
    })
    
    if (!ok) return
    
    isSubmitting.value = true
    statusMessage.value = ''
    
    // ✅ Prepare product data
    const productData = {
      ...product.value,
      location: selectedVendor.value?.location || product.value.location,
      updated_at: new Date().toISOString()
    }
    
    // ✅ PUT request to products controller
    const response = await api.put(`/api/v1/products/${product.value.id}`, productData)
        
    // Update local state - API returns { product: {...}, vendor: {...} }
    product.value = response.data.product
    
    statusMessage.value = `✅ Product "${product.value.product_name}" updated successfully!`
    
    // ✅ Refresh store data
    await Promise.all([
      store.dispatch('fetchProducts'),
      store.dispatch('fetchVendorsProducts')
    ])
    
    // Clear message after 3 seconds
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
    
  } catch (err) {
    console.error('❌ Error updating product:', err)
    statusMessage.value = `❌ Error: ${err.response?.data?.message || err.message}`
  } finally {
    isSubmitting.value = false
  }
}

const deleteProduct = async () => {
  try {
    const ok = await confirmDialogue.value.show({
      title: 'Delete Product',
      message: `Are you sure you want to delete "${product.value.product_name}"? This cannot be undone.`,
      okButton: 'Delete Forever',
    })
    
    if (!ok) return
    
    // ✅ DELETE request to products controller
    await api.delete(`/api/v1/products/${product.value.id}`)
    
    statusMessage.value = `✅ Product "${product.value.product_name}" deleted! Redirecting...`
    
    // ✅ Refresh store data
    await Promise.all([
      store.dispatch('fetchProducts'),
      store.dispatch('fetchVendorsProducts')
    ])
    
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push({ name: 'ProductsByLocations' })
    }, 2000)
    
  } catch (err) {
    console.error('❌ Error deleting product:', err)
    statusMessage.value = `❌ Error: ${err.response?.data?.message || err.message}`
  }
}

// ✅ LIFECYCLE
onMounted(async () => {
  await Promise.all([
    fetchProduct(),
    fetchVendors()
  ])
})

// ✅ WATCH for route changes
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchProduct()
  }
})
</script>

<style scoped>
/* ✅ IMPORT SHARED STYLES */
@import '@/assets/styles/ui-components.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

.product-edit-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

/* Loading & Error States */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}

.loading-container i {
  font-size: 3rem;
  color: #667eea;
}

.error-container i {
  font-size: 3rem;
  color: #ef4444;
}

.loading-container p,
.error-container p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-buttons .btn {
  flex: 1;
  min-width: 200px;
}

/* Status Messages */
.status-message {
  margin: 1rem 0 0;
  padding: 1rem;
  background: rgba(102, 126, 234, 0.1);
  border-left: 4px solid #667eea;
  border-radius: 4px;
  color: #667eea;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-message-bottom {
  margin: 1.5rem 0 0;
  padding: 1rem;
  background: rgba(76, 175, 80, 0.1);
  border-left: 4px solid #4CAF50;
  border-radius: 4px;
  color: #4CAF50;
  font-weight: 500;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Info Section */
.info-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid #667eea;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  gap: 1rem;
}

.info-label {
  font-weight: 600;
  color: #667eea;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 150px;
}

.info-value {
  color: #333;
  font-weight: 500;
}

/* Custom Select */
.select-wrapper {
  position: relative;
}

.form-select {
  width: 100%;
  padding: 0.875rem 2.5rem 0.875rem 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.form-select:hover {
  border-color: #667eea;
}

.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.select-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  pointer-events: none;
  transition: transform 0.3s;
}

.form-select:focus + .select-icon {
  transform: translateY(-50%) rotate(180deg);
}

/* Toggle Switch */
.toggle-wrapper {
  padding: 0.5rem 0;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  user-select: none;
}

.toggle-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.toggle-slider {
  position: relative;
  width: 50px;
  height: 26px;
  background: #ccc;
  border-radius: 26px;
  transition: background 0.3s;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.toggle-input:checked + .toggle-slider {
  background: #4CAF50;
}

.toggle-input:checked + .toggle-slider::before {
  transform: translateX(24px);
}

.toggle-text {
  font-weight: 600;
  color: #333;
}

.toggle-input:checked ~ .toggle-text {
  color: #4CAF50;
}

/* Required Label */
.form-label.required::after {
  content: ' *';
  color: #ef4444;
}

/* Button Loading State */
.btn-loading {
  position: relative;
  color: transparent !important;
  pointer-events: none;
}

.btn-loading i {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
}

/* Utility Classes */
.mt-4 { margin-top: 1rem; }
.mt-5 { margin-top: 1.5rem; }
.mb-4 { margin-bottom: 1rem; }

/* Responsive */
@media (max-width: 768px) {
  .product-edit-container {
    padding: 0.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .btn {
    width: 100%;
    min-width: auto;
  }
  
  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .info-label {
    min-width: auto;
  }
}
</style>

<!-- End of File -->