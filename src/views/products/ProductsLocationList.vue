<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Products By Location</h2>
    </v-card-title>
    <ul>
      <li class="left">
        <button id="link-as-button">
          <router-link :to="{ name: 'ProductsByLocations'}" >
            Products By Locations
          </router-link>
        </button>
      </li>
      <li class="left">
        <button id="link-as-button">
          <router-link :to="{ name: 'ProductsByVendors' }">Shopping List By Vendor</router-link>
        </button>
      </li>
    </ul>
    <ul class="py-2">
      <li>
        <button id="link-as-button">
          <router-link :to="{ name: 'ProductList' }">Shopping List By Product</router-link>
        </button>
      </li>
      <li>
        <button id="link-as-button">
          <router-link :to="{ name: 'ProductVendorCreate' }">Create Vendor/Product</router-link>
        </button>
      </li>
    </ul> 
    <br/>
  </v-card>
  <v-card-text>
    <v-form>
      <h1>{{ this.$route.params.location }} </h1>
      <h2>
        <u @click='shoppingListDisplay(this.showShoppingList)'>Toggle Shopping List</u>
      </h2>
      <v-container id="form-container">
        <div class="row">
          <div class="vendor-name" v-for="(vendor, vendor_index) in products_by_location" :key="vendor_index">
            <h1>{{ vendor.vendor_name }}</h1>
            <span v-for="(product, product_index) in this.products_by_location" :key="product_index">        
              <div v-if="product.vendor_name == vendor.vendor_name">
                <span v-for="(item, item_index) in product.products" :key="item_index">
                  <span v-if="this.showShoppingList == true">
                    <span v-if="item.active == true">
                      <input
                        type="checkbox"
                        :checked="item.active"
                        @change="isChecked(item, item.active)"
                        class="field"
                      />
                      <label class="checkbox-right" @dblclick="doubleClickProduct(item, vendor)">{{ item.product_name }}</label>
                    </span>
                  </span>
                  <span v-else>
                    <input
                        type="checkbox"
                        :checked="item.active"
                        @change="isChecked(item, item.active)"
                        class="field"
                      />
                    <label class="checkbox-right" @dblclick="doubleClickProduct(item, vendor)">{{ item.product_name }}</label>
                  </span>
                </span>
              </div>
            </span>
          </div>
        </div>
        <v-btn type="submit" block class="mt-2" @click="onSubmit">Submit</v-btn>
      </v-container>
    </v-form>
  </v-card-text>
</template>
<script>
let time = null;  // define time be null
import { v4 as uuidv4 } from "uuid";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
export default {
  name: "ProductsLocationList",
  props: {
    location: {
      type: String, required: true
    }
  },
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      current_vendor: '',
      product_active: true,
      showShoppingList: true,
      showFlag: false,
      passedMessage: '',
      toggle0: false,
      toggle1: false,
      toggle2: false,
      toggleInPlay: false,
      isVendorToggled: true,
      isProductToggled: null,
      home_safe: false,
      toggleArr: [],
      isFormValid: false,
      isAuthorValid: false,
      isTitleValid: false,
      urlMaxLength: 255,
      num: 1,
    };
  },
  created() {
    this.$store.dispatch("fetchProductsByLocation", this.$route.params.location );

  },
  computed: {
    products_by_location() {
      return this.$store.state.products_by_location;
    },
  },
  methods: {
    onSubmit() {
      const sub_products_by_location = {
        ...this.products_by_location,
        id: uuidv4(),
        created_by: this.$store.state.user.resource_owner.email,
      };
      
      if (this.$store.dispatch("updateVendorsProducts", sub_products_by_location)) {
        alert("PsLL: Vendors Products List Updated Successfully")
        location.reload();
      } else {
        alert("Error adding Products in ProductLocaionsList View ");
      }
    },
    isChecked(item, active) {
      item.active = active == true ? false : true
      return item.active
    },
    shoppingListDisplay(showFlag) {
      return this.showShoppingList = showFlag == true ? false : true
    },
    toggleLocation(index) {
      clearTimeout(time)
      time=setTimeout(() => {
        this.isVendorToggled = index === this.isVendorToggled? null : index
      }, 300)
    },
    doubleClickLocation(location) {
      clearTimeout(time);
      this.$router.push({ name: 'ProductsLocationList', params: { location: `${location}` } });

    },
    doubleClickVendor(vendor) {
      clearTimeout(time);
      this.$router.push({ name: 'VendorEdit', params: { id: `${vendor.id}` } });

    },
    doubleClickProduct(product) {
      clearTimeout(time);
      this.$router.push({ name: 'ProductEdit', params: { id: `${product.id}`} });

    },
    toggleVendor(index) {
      this.isProductToggled = index === this.isProductToggled? null : index
    }    
  },
};
</script>
<style lang="css">
.a {
  text-decoration: none;
}
.button,
button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5em;
  height: 2em;
  margin: 0.5em;
  border-radius: 5px;
  background: linear-gradient(to right, #d6d3d3, #EEEEEE); 
  text-decoration: none;
  
  font-size: 1em;
  color: white;
  border: none;
  outline: none;
}
ul {
    display: table;
    width: 100%;
}
li {
    display: table-cell;
}
li.left {text-align: left;}
li.right {text-align: right;}
.row-height {
  height: 2rem !important;
  margin: 0 0px 0;
}
input[type=checkbox] { 
  width: 10%;
  height: 1rem;
}
.checkbox-right {
  font-size: 1.25rem;
  position: relative;
  top: -2.65rem !important;
  left: 4rem !important;
}
/* Create two equal columns that floats next to each other */
.column {
  float: left;
  width: 90% !important;
  /*Xwidth: 50%;*/
  padding: 2px;
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
  /*background-color: #39495c;*/
  background-color: lightgray;
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
