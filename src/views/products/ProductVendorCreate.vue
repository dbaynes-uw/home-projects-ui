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
          <router-link :to="{ name: 'ProductVendorList' }">List By Vendor</router-link>
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
    <v-form id="isFormValid">
      <v-container id="form-container">
        <br/>
        <label>Vendor Location:</label>
        &nbsp;&nbsp;&nbsp;
        <select
          id="select-box"
          class="text-style"
          v-model="vendor.location"
          required
        >
        <br/>
          <option
            v-for="option in vendorsLocationsGroup.vendorsLocationsGroup"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === vendor.location"
          >
            {{ option }}
          </option>
        </select>
        <br />
        <label>Vendor Name:</label>
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;
        <select
          id="select-box"
          class="text-style"
          v-model="vendor.vendor_name"
          required
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
        </select>
        <br/>
        <span v-if="vendor.vendor_name == 'Other'">
          <v-text-field
          v-model="vendor.other_vendor_name"
          label="Other Vendor Name"
          >
            <template v-slot:prepend-inner>
              <v-icon class="icon-css">mdi-magnify</v-icon>
            </template>
          </v-text-field>
        </span>
        <label>Product:</label>
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;
        <select
          id="select-box"
          class="text-style"
          v-model="vendor.product_name"
        >
          <option
            v-for="product in vendorsProductsGroup.vendorsProductsGroup"
            :value="product"
            :key="product"
            id="select-box"
            :selected="product === vendor.product_name"
          >
            {{ product }}
          </option>
        </select>
        <span v-if="vendor.product_name == 'Other'">
          <br/><br/>
          <v-text-field
          v-model="vendor.other_product_name"
          label="Other Product Name"
          >
            <template v-slot:prepend-inner>
              <v-icon class="icon-css">mdi-magnify</v-icon>
            </template>
          </v-text-field>
        </span>

        <br/>
        <br/>
        <v-btn type="submit" block class="mt-2" @click="onSubmit">Submit</v-btn>
        <!--button class="button" type="submit">Submit</button-->
      </v-container>
    </v-form>
  </v-card-text>
</template>
<script setup>
//const format = (date) => {
</script>

<script>
import { v4 as uuidv4 } from "uuid";

//!import vSelect from "vue-select";
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
      isVendorNameValid: false,
      isVendorLocationValid: false,
      urlMaxLength: 255,
      num: 1,
    };
  },
  methods: {
    onSubmit() {
      const vendor = {
        ...this.vendor,
        id: uuidv4(),
        created_by: this.$store.state.user.resource_owner.email,
      };
      if (this.$store.dispatch("createVendor", vendor)) {
        //this.$router.push({ name: "ProductLocationsList", params: {} });
        alert("Vendor/Product was successfully updated for " + vendor.location + " - " + vendor.vendor_name);
        this.$router.push({ name: "ProductLocationsList" });
      } else {
        alert("Error adding Vendor " + vendor.vendor_name);
      }
    },
  },
}
</script>
<style>
@import "vue-select/dist/vue-select.css";
#form-container {
  width: 75% !important;
}
#id {
  width: 100%;
}
#select-box{
  width: 50%;
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
