<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Products Location then Vendor</h2>
    </v-card-title>
    <h3>
      <router-link :to="{ name: 'ProductVendorCreate' }">Create Vendor/Product</router-link>
    </h3>
    <h3>
      <router-link :to="{ name: 'ProductList' }">Make Shopping List By Product</router-link>
    </h3>
    <h3>
      <router-link :to="{ name: 'ProductVendorList' }">Make Shopping List By Vendor</router-link>
    </h3> 
  </v-card>
  <v-card-text>
    <v-form>
      <h3>
        <u @click='shoppingListDisplay(this.showShoppingList)'>Show Shopping List(Toggle)</u>
      </h3>
      <v-container id="form-container">
        <div class="row">
          <div class="column" id="group" v-for="(location, group_index) in this.vendorsLocationsGroup.vendorsLocationsGroup" :key="group_index">
            <!-- Toggle by Location -->
            <h1 @click='toggleLocation(group_index)'><b><u>{{ location }}</u></b></h1>
            <div v-show="isVendorToggled === group_index">
              <div class="vendor-name" v-for="(vendor, vendor_index) in this.vendors_products" :key="vendor_index">
                <span v-if="vendor.location == location">
                  <!-- Toggle by Vendor -->
                  <h2 @click='toggleVendor(vendor_index)'><b>{{ vendor.vendor_name }}</b></h2>  
                  <br/>
                  <!--resultSet Length: {{ this.resultSet[1] }}-->
                  <span v-for="(product, product_index) in this.vendors_products" :key="product_index">        
                    <!--span v-show="isProductToggled === product_index"-->
                      <div v-if="product.vendor_name == vendor.vendor_name">
                        <div v-if="product.location == vendor.location">
                          <span v-for="(item, item_index) in product.products" :key="item_index">
                            <span v-if="this.showShoppingList == true">
                              <span v-if="item.active == true">
                                <input
                                  type="checkbox"
                                  :checked="item.active"
                                  @change="isChecked(item, item.active)"
                                  class="field"
                                />
                                <!--label class="checkbox-right"><router-link :to="{ name: 'ProductEdit', params: { id: `${vendor.id}` }  }">{{ item.product_name }}</router-link></!--label-->
                                <label class="checkbox-right">{{ item.product_name }}</label>
                              </span>
                            </span>
                            <span v-else>
                              <input
                                  type="checkbox"
                                  :checked="item.active"
                                  @change="isChecked(item, item.active)"
                                  class="field"
                                />
                                <!--label class="checkbox-right"><router-link :to="{ name: 'ProductEdit', params: { id: `${vendor.id}` }  }">{{ item.product_name }}</router-link></!--label-->
                              <label class="checkbox-right">{{ item.product_name }}</label>
                            </span>
                          </span>
                        </div>
                      </div>
                    <!--span--> 
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <v-btn type="submit" block class="mt-2" @click="onSubmit">Submit</v-btn>
      </v-container>
    </v-form>
  </v-card-text>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
export default {
  name: "ProductVendorList",
  components: {
  },
  data() {
    return {
      product_active: true,
      productLocationList: null,
      showShoppingList: false,
      showFlag: false,
      vendors: {
        vendor_name: '',
        vendor_location: '',
        products: {
          product_name: '',
          active: false,
          notes: null,
        },
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
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
    this.$store.dispatch("fetchVendorsProducts");
    this.$store.dispatch("fetchVendorsLocationsGroup");

    this.$store.dispatch("fetchShoppingList");
  },
  computed: {
    vendorsLocationsGroup() {
      return this.$store.state.vendors_locations_group;
    },
    product_shopping_list() {
      return this.$store.state.product_shopping_list;
    },
    vendors_products() {
      return this.$store.state.vendors_products;
    },
  },
  methods: {
    onSubmit() {
      const sub_vendors_products = {
        ...this.vendors_products,
        id: uuidv4(),
        created_by: this.$store.state.user.resource_owner.email,
      };
      
      if (this.$store.dispatch("putVendorsProducts", sub_vendors_products, {params: { vendors_products: sub_vendors_products }} )) {
        alert("Vendors Products List Updated Successfully")
        location.reload();
      } else {
        alert("Error adding Products in ProductLocaionList View ");
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
      this.isVendorToggled = index === this.isVendorToggled? null : index
    },
    toggleVendor(index) {
      this.isProductToggled = index === this.isProductToggled? null : index
    }    
  },
};
</script>
<style lang="css">
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
  width: 90%;
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
