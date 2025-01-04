<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Add Vendor/Products</h2>
    </v-card-title>
    <ul>
      <li class="left">
        <button id="link-as-button">
          <router-link :to="{ name: 'ProductLocationsList' }">Product Location List</router-link>
        </button>
      </li>
    </ul>
    <ul class="py-2">
      <li>
        <button id="link-as-button">
          <router-link :to="{ name: 'ProductsVendorList' }">List By Vendor</router-link>
        </button>
      </li>
      <li>
        <button id="link-as-button">
          <router-link :to="{ name: 'ProductList' }">List by Product</router-link>
        </button>
      </li>
    </ul> 
  </v-card>
  <v-card-text>
    <v-form @submit.prevent="onSubmit" >
      <v-container id="form-container">

        <v-select
          label="Vendor Location"
          class="select-label"
          :items="vendorsLocationsGroup.vendorsLocationsGroup"
          :rules="[requiredLocation]"
          v-model="vendor.location"
        >
          <option
            v-for="option in vendorsLocationsGroup.vendorsLocationsGroup"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === vendor.location"
          >
            {{ option }}
          </option>
        </v-select>

        <v-select
          label="Vendor Name"
          :items="vendorsGroup.vendorsGroup"
          :rules="[requiredVendorName]"
          class="select-label"
          v-model="vendor.vendor_name"
        >
          <option
            v-for="option in vendorsGroup.vendorsGroup"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === vendor.vendor_name"
          >
            {{ option }}
          </option>
        </v-select>
        <br/>
        <span v-if="vendor.vendor_name == 'Other'">
          <v-text-field
            id="customer-input-field"
            v-model="vendor.other_vendor_name"
            class="select-label"
            label="Other Vendor Name"
          >
            <template v-slot:prepend-inner>
              <v-icon class="icon-css">mdi-magnify</v-icon>
            </template>
          </v-text-field>
        </span>
        <v-select
          label="Vendor Product"
          :items="vendorsProductsGroup.vendorsProductsGroup"
          :rules="[requiredProductName]"
          class="select-label"
          v-model="vendor.product_name"
        >
          <option
            v-for="option in vendorsProductsGroup.vendorsProductsGroup"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === vendor.product_name"
          >
            {{ option }}
          </option>
        </v-select>
        <span v-if="vendor.product_name == 'Other'">
          <v-text-field
            v-model="vendor.other_product_name"
            id="custom-input-field"
            label="Other Product Name"
            :rules="[requiredOtherProductName]"
            class="select-label"
          >
            <template v-slot:prepend-inner>
              <v-icon class="icon-css">mdi-magnify</v-icon>
            </template>
          </v-text-field>
        </span>   
        <br/>
        <br/>
        <br/>
        <v-btn type="submit" block class="mt-2">Submit</v-btn>
      </v-container>
    </v-form>
  </v-card-text>
</template>
<script setup>
//const format = (date) => {
</script>
<script>
import { v4 as uuidv4 } from "uuid";
export default {
  created() {
    this.$store.dispatch("fetchVendorsGroup");
    this.$store.dispatch("fetchVendorsLocationsGroup");
    this.$store.dispatch("fetchVendorsProductsGroup");
  },
  computed: {
    vendorsGroup() {
      return this.$store.state.vendors_group;
    },
    vendorsLocationsGroup() {
      return this.$store.state.vendors_locations_group;
    },
    vendorsProductsGroup() {
      return this.$store.state.vendors_products_group;
    },
  },    
  components: {},
  data() {
    return {
      vendor: {
        vendor_name: null,
        location: '',
        created_by: this.$store.state.user.resource_owner.email,
        other_vendor_name: '',
        product_name: '',
        other_product_name: '',
      },
      isFormValid: false,
      isLocationValid: false,
      isVendorNameValid: false,
      isProductNameValid: false,
      isOtherProductNameValid: false,
      urlMaxLength: 255,
    };
  },
  methods: {
    onSubmit() {
      this.checkValidations();
      console.log("Is Form Valid? ", this.isFormValid)
      if (this.isFormValid) {
        const vendor = {
          ...this.vendor,
          id: uuidv4(),
          created_by: this.$store.state.user.resource_owner.email,
        };
        if (this.$store.dispatch("createVendor", vendor)) {
          if (vendor.product_name == 'Other') {
            alert("Product " + vendor.other_product_name + " was added for " + vendor.vendor_name);
          } else {
            alert("Product " + vendor.product_name + " was added for " + vendor.vendor_name);
          }
        } else {
          alert("Error adding Vendor " + vendor.vendor_name);
        }
      } else {
        alert("Please correct required fields and resubmit");
      }  
    },
    requiredLocation: function (value) {
      if (value) {
          this.isLocationValid = true
          return true;
      } else {
          this.isFormValid = false
          this.isLocationValid = false
          return 'Please enter Location';
      }
    },
    requiredVendorName: function (value) {
      if (value) {
          this.isVendorNameValid = true
          return true;
      } else {
          this.isFormValid = false
          this.isVendorNameValid = false
          return 'Please enter Vendor Name';
      }
    },
    requiredProductName: function (value) {
      if (value) {
        if (value == 'Other')
          {
            this.isProductNameValid = true
            this.isOtherProductNameValid = false
          } else {
            this.isProductNameValid = true
            this.isOtherProductNameValid = true
          }
          return true;
      } else {
          this.isFormValid = false
          this.isProductNameValid = false
          return 'Please enter Product Name';
      }
    },
    requiredOtherProductName: function (value) {
      if (value) {
        if (this.isProductNameValid == true)
          this.isOtherProductNameValid = true 
          return true;
      } else {
          this.isFormValid = false
          this.isOtherProductNameValid = false
          return 'Please enter Other Product Name';
      }
    },
    checkValidations() {
      //console.log("Loc Validations: ", this.isLocationValid)
      //console.log("Name Validations: ", this.isVendorNameValid)
      //console.log("Prod Validations: ", this.isProductNameValid)
      //console.log("Oth Prod Validations: ", this.isOtherProductNameValid)
      if (this.isLocationValid &&
          this.isVendorNameValid &&
          this.isProductNameValid &&
          this.isOtherProductNameValid) {
        this.isFormValid = true
      } else {
        this.isFormValid = false
      }
    }

  },
}
</script>
<style>
@import "vue-select/dist/vue-select.css";
#form-container {
  width: 75% !important;
}
.label-for-select {
 padding-left: 0rem;
}
.text-style {
  float: right;
  margin-right: 6rem;
  width: 20px;
  overflow: hidden;
}
#id {
  width: 100%;
}
#select-box{
  /*width: 40%;*/
  width: 45%;
  position: relative;
  left: 1rem;
}
#notes {
  width: 100%;
  height: 4rem;
}
.button {
  margin: 30px;
  background-color: #39495c;
  border-radius: 5px;
  font-size: 18px;
  width: 160px;
  height: 60px;
  color: white;
  padding: 20px;
  box-shadow: inset 0 -0.6em 1em -0.35em rgba(0, 0, 0, 0.17),
    inset 0 0.6em 2em -0.3em rgba(255, 255, 255, 0.15),
    inset 0 0 0em 0.05em rgba(255, 255, 255, 0.12);
  text-align: center;
  cursor: pointer;
}
label {
  font-size: 20px;
  margin-bottom: 5px;
}
input {
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
}
fieldset {
  border: 0;
  margin: 0;
  padding: 0;
}
select {
  border-color: darkgreen;
}
legend {
  font-size: 28px;
  font-weight: 700;
  margin-top: 20px;
}
.label-visible {
  top: -35px;
  left: 4px;
  visibility: visible;
}
.label-invisible {
  top: -10px;
  left: 4px;
  visibility: hidden;
}
.input-field {
  margin-top: 30px;
  position: relative;
}
.input-field > input {
  width: 100%;
}
.input-field > p {
  position: absolute;
  font-size: 14px;
  transition: 0.3s;
}
</style>
