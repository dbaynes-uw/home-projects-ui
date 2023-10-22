<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Product List by Vendor</h2>
      <h3>
      <router-link :to="{ name: 'ProductList' }">(Update Product List By Vendor)</router-link>
    </h3>
    </v-card-title>
  </v-card>
  <v-card-text>
    <v-form>
      <v-container id="form-container">
        <div class="row">
          <div v-for="(vendor, vendor_index) in vendor_products" :key="vendor_index">
            <div class="column">              
              <h2 @click='toggle1 = !toggle1'><b><u>{{ vendor.vendor_name }}</u></b></h2>
              <br/>
              <div v-show='toggle1'>                
                <span style="height: 4rem !important;" v-for="(product, product_index) in vendor.products" :key="product_index">
                  <!--v-checkbox
                    :class="centered-checkbox"
                    :label="product.product_name"
                    :v-model="product_active"
                    v-bind:true-value="true"
                    @change="isChecked(product, product.active)"
                    :checked="modelValue"
                    :value="product.active"
                    unchecked-value="not_accepted"
                  /-->
                  
                  <input
                    type="checkbox"
                    :checked="product.active"
                    @change="isChecked(product, product.active)"
                    class="field"
                  />
                  <label class="checkbox-right">{{ product.product_name }}</label>
                </span>
              </div>
            </div>
          </div>
        </div>
        <v-btn type="submit" block class="mt-2" @click="onSubmit">Submit</v-btn>
      </v-container>
    </v-form>
    <router-link
        :to="{
          name: 'ProductList',
          params: { vendor_products: vendor_products },
        }"
      >
    </router-link>
  </v-card-text>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
export default {
  name: "ProductList",
  props: ["ventor_products"],
  components: {
  },
  data() {
    return {
      //products: [
      //  { vendor: 'costco', product: 'prod1', checked: false },
      //  { vendor: 'costco', product: 'prod2', checked: false },
      //  { vendor: 'costco', product: 'prod3', checked: false },
      //  { vendor: 'safeway', product: 'prod1', checked: false },
      //  { vendor: 'safeway', product: 'prod2', checked: false },
      //  { vendor: 'safeway', product: 'prod3', checked: false },
      //  { vendor: 'traderjoes', product: 'prod1', checked: false },
      //  { vendor: 'traderjoes', product: 'prod2', checked: false },
      //  { vendor: 'traderjoes', product: 'prod3', checked: false },
      //],
      product_active: true,
      productList: null,
      vendors: {
        vendor_name: '',
        vendor_location: '',
        products: {
          product_name: '',
          active: false,
          notes: null,
        },
        notes: "",
        created_by: "dbaynes",
      },
      toggle0: false,
      toggle1: false,
      toggle2: false,
      isFormValid: false,
      isAuthorValid: false,
      isTitleValid: false,
      urlMaxLength: 255,
      num: 1,
    };
  },
  created() {
    console.log("ProductList created");
    this.$store.dispatch("fetchVendorProducts");
    this.sortedData = this.vendor_products;
  },
  computed: {
    vendor_products() {
      return this.$store.state.vendor_products;
    },
  },
  methods: {
    onSubmit() {
      console.log("onSubmit Product List - vendor_products: ", this.vendor_products)
      alert("On Submit!!!!")
      const sub_vendor_products = {
        ...this.vendor_products,
        id: uuidv4(),
        created_by: this.$store.state.user,
      };
      console.log("Call to Store - sub_vendor_products: ", sub_vendor_products)
      if (this.$store.dispatch("putVendorProducts", sub_vendor_products, {params: { vendor_products: sub_vendor_products }} )) {
        this.$router.push({ name: "VendorProductList", params: { sub_vendor_products } });
      } else {
        alert("Error adding Products ");
      }
    },
    isChecked(product, active) {
      console.log("Active at start: ", active)
      product.active = active == true ? false : true
      //if (active == true) {
      //  active = false
      //} else{
      //  active = true
      //}
      console.log("Active?: ", active)
      return product.active
    }
  },
  //vendor_products() {
  //  console.log("ProductList vendor_products: ", this.$store.state.vendor_products)
  //  alert("Product Vendors!!");
  //  return this.$store.state.vendor_products;
  //},
};
</script>
<style lang="css">
.row-height {
  height: 2rem !important;
  margin: 0 0px 0;
}
input[type=checkbox] { 
  width: 2%;
  height: 1rem;
}
.checkbox-right {
  position: relative;
  top: -2.3rem;
  left: 2rem;
}
/* Create two equal columns that floats next to each other */
.column {
  float: left;
  width: 100%;
  padding: 0px;
  /*height: 300px; /* Should be removed. Only for demonstration */
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
.v-icon {
  color: darkslategrey;
  top: -0.2rem;
}
#form-container {
  text-align: left;
  width: 100% !important;
}
/*[type="checkbox"],
#notes {
  width: 100%;
  height: 4rem;
}*/
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
