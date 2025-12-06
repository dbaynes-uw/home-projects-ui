<template>
  <div class="vendor-edit-container">
    <ConfirmDialogue ref="confirmDialogue" />
    
    <!-- ✅ HEADER CARD -->
    <div class="card mt-5">
      <div class="card-header">
        <h2 class="card-title">
          <i class="fas fa-store-alt"></i>
          Edit or Delete Vendor
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
            @click="deleteVendor(vendor)"
            class="btn btn-danger"
            type="button"
          >
            <i class="fas fa-trash"></i>
            Delete Vendor
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ EDIT FORM -->
    <div class="card mt-4">
      <form @submit.prevent="updateVendor">
        <div class="card-body">
          
          <!-- ✅ VENDOR INFO SECTION -->
          <div class="info-section mb-4">
            <div class="info-row">
              <span class="info-label">
                <i class="fas fa-hashtag"></i>
                Vendor ID:
              </span>
              <span class="info-value">{{ vendor.id }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">
                <i class="fas fa-calendar-plus"></i>
                Created:
              </span>
              <span class="info-value">{{ formatDate(vendor.created_at) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">
                <i class="fas fa-user"></i>
                Created By:
              </span>
              <span class="info-value">{{ vendor.created_by || 'Unknown' }}</span>
            </div>
          </div>

          <!-- ✅ LOCATION SELECT -->
          <div class="form-group">
            <label class="form-label required">
              <i class="fas fa-map-marker-alt"></i>
              Vendor Location
            </label>
            <div class="select-wrapper">
              <select
                v-model="vendor.location"
                class="form-select"
                required
              >
                <option value="" disabled>Select a location...</option>
                <option 
                  v-for="location in availableLocations" 
                  :key="location"
                  :value="location"
                >
                  {{ location }}
                </option>
              </select>
              <i class="fas fa-chevron-down select-icon"></i>
            </div>
            <small class="form-hint">
              {{ availableLocations.length }} locations available
            </small>
          </div>

          <!-- ✅ VENDOR NAME -->
          <div class="form-group">
            <label class="form-label required">
              <i class="fas fa-store"></i>
              Vendor Name
            </label>
            <input
              v-model="vendor.vendor_name"
              type="text"
              class="form-input"
              required
            />
          </div>

          <!-- ✅ NOTES -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-sticky-note"></i>
              Notes
            </label>
            <textarea
              v-model="vendor.notes"
              class="form-input"
              rows="4"
              placeholder="Add any notes about this vendor..."
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
              Update Vendor
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

    <!-- ✅ PRODUCTS SECTION -->
    <div v-if="vendorProducts.length > 0" class="card mt-4">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-box"></i>
          Products for this Vendor
          <span class="chip chip-primary chip-small ml-2">
            {{ vendorProducts.length }}
          </span>
        </h3>
      </div>
      <div class="card-body">
        <div class="products-grid">
          <div 
            v-for="product in vendorProducts" 
            :key="product.id"
            class="product-item"
            @click="editProduct(product)"
          >
            <div class="product-item-content">
              <i class="fas fa-box product-icon"></i>
              <div class="product-details">
                <div class="product-name">{{ product.product_name }}</div>
                <div class="product-meta">
                  <span :class="['chip', 'chip-small', product.active ? 'chip-success' : 'chip-grey']">
                    {{ product.active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
              <i class="fas fa-chevron-right product-chevron"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";

export default {
  name: 'VendorEdit',
  
  components: {
    ConfirmDialogue,
  },
  
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  
  data() {
    return {
      vendor: {
        id: "",
        vendor_name: "",
        location: "",
        notes: "",
        created_by: "",
        created_at: "",
        updated_at: ""
      },
      vendorProducts: [],
      api_url: "",
      statusMessage: '',
      isSubmitting: false,
    };
  },
  
  computed: {
    availableLocations() {
      const rawData = this.$store.state.vendors_locations_group;
      
      if (rawData?.vendorsLocationsGroup && Array.isArray(rawData.vendorsLocationsGroup)) {
        return this.cleanArrayData(rawData.vendorsLocationsGroup);
      }
      if (Array.isArray(rawData)) {
        return this.cleanArrayData(rawData);
      }
      if (rawData?.data && Array.isArray(rawData.data)) {
        return this.cleanArrayData(rawData.data);
      }
      
      console.warn('❌ vendorsLocationsGroup is not in expected format:', rawData);
      return [];
    }
  },
  
  async mounted() {
    try {
      // ✅ Use centralized API URL
      const baseUrl = window.location.port === "8080"
        ? "http://localhost:3000/api/v1"
        : "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1";
      
      this.api_url = `${baseUrl}/vendors/`;
      
      // Fetch vendor data
      const result = await axios.get(this.api_url + this.$route.params.id);
      this.vendor = result.data;
      
      // Fetch locations
      await this.$store.dispatch('fetchVendorsLocationsGroup');
      
      // Fetch vendor's products
      await this.fetchVendorProducts();
      
      console.log('✅ Vendor loaded:', this.vendor);
      console.log('✅ Vendor products:', this.vendorProducts);
    } catch (error) {
      console.error('❌ Error loading vendor:', error);
      this.statusMessage = 'Error loading vendor';
    }
  },
  
  methods: {
    cleanArrayData(data) {
      if (!Array.isArray(data)) return [];
      return data
        .filter(item => item !== null && item !== undefined && item !== '')
        .map(item => typeof item === 'string' ? item.trim() : String(item).trim())
        .filter(item => item.length > 0)
        .sort();
    },
    
    async fetchVendorProducts() {
      try {
        const allProducts = this.$store.state.products || [];
        this.vendorProducts = allProducts.filter(
          product => product.vendor_id === this.vendor.id
        );
      } catch (error) {
        console.error('❌ Error fetching vendor products:', error);
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    editProduct(product) {
      this.$router.push({
        name: 'ProductEdit',
        params: { id: product.id }
      });
    },
    
    async updateVendor() {
      try {
        const ok = await this.$refs.confirmDialogue.show({
          title: "Update Vendor",
          message: `Are you sure you want to update "${this.vendor.vendor_name}"?`,
          okButton: "Update",
        });
        
        if (ok) {
          this.isSubmitting = true;
          
          const vendorData = {
            ...this.vendor,
            updated_by: this.$store.state.user?.resource_owner?.email || "",
            updated_at: new Date().toISOString()
          };
          
          const success = await this.$store.dispatch("updateVendor", vendorData);
          
          if (success) {
            this.statusMessage = `✅ Vendor "${vendorData.vendor_name}" updated successfully!`;
            
            // Refresh data
            await Promise.all([
              this.$store.dispatch('fetchVendors'),
              this.$store.dispatch('fetchVendorsProducts'),
              this.$store.dispatch('fetchVendorsLocationsGroup')
            ]);
            
            // Clear message after 3 seconds
            setTimeout(() => {
              this.statusMessage = '';
            }, 3000);
          } else {
            this.statusMessage = '❌ Failed to update vendor';
          }
        }
      } catch (error) {
        console.error('❌ Error updating vendor:', error);
        this.statusMessage = `❌ Error: ${error.message}`;
      } finally {
        this.isSubmitting = false;
      }
    },
    
    async deleteVendor(vendor) {
      try {
        // Check if vendor has products
        if (this.vendorProducts.length > 0) {
          const ok = await this.$refs.confirmDialogue.show({
            title: `Cannot Delete Vendor`,
            message: `"${vendor.vendor_name}" has ${this.vendorProducts.length} product(s). Please delete or reassign all products before deleting this vendor.`,
            okButton: "OK",
            cancelButton: null
          });
          return;
        }
        
        const ok = await this.$refs.confirmDialogue.show({
          title: `Delete Vendor`,
          message: `Are you sure you want to delete "${vendor.vendor_name}"? This cannot be undone.`,
          okButton: "Delete Forever",
        });
        
        if (ok) {
          await this.$store.dispatch("deleteVendor", vendor);
          
          this.statusMessage = `✅ Vendor "${vendor.vendor_name}" deleted! Redirecting...`;
          
          // Redirect after 2 seconds
          setTimeout(() => {
            this.$router.push({ name: "ProductsByLocations" });
          }, 2000);
        }
      } catch (error) {
        console.error('❌ Error deleting vendor:', error);
        this.statusMessage = `❌ Error: ${error.message}`;
      }
    },
  },
};
</script>

<style scoped>
/* ✅ IMPORT SHARED STYLES */
@import '@/assets/styles/ui-components.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

.vendor-edit-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
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

/* Required Label */
.form-label.required::after {
  content: ' *';
  color: #ef4444;
}

/* Products Grid */
.products-grid {
  display: grid;
  gap: 0.75rem;
}

.product-item {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.product-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.product-item-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.product-icon {
  font-size: 1.5rem;
  color: #667eea;
  flex-shrink: 0;
}

.product-details {
  flex: 1;
}

.product-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.product-meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.product-chevron {
  color: #999;
  flex-shrink: 0;
}

/* Utility Classes */
.mt-4 { margin-top: 1rem; }
.mt-5 { margin-top: 1.5rem; }
.mb-4 { margin-bottom: 1rem; }
.ml-2 { margin-left: 0.5rem; }

/* Responsive */
@media (max-width: 768px) {
  .vendor-edit-container {
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
  
  .product-item-content {
    padding: 0.75rem;
  }
  
  .product-name {
    font-size: 0.95rem;
  }
}

</style>


<!-- End of File -->