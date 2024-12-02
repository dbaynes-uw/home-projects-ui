<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Product Shopping</h2>
    </v-card-title>
    <ul>
      <li class="left">
        <button id="link-as-button">
          <router-link :to="{ name: 'ProductLocationsList'}" >
            Products By Locations
          </router-link>
        </button>
      </li>
      <li>
        <button id="link-as-button">
          <router-link :to="{ name: 'ProductsVendorList' }">Product List By Vendor</router-link>
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
      <h2>
        <u @click='shoppingListDisplay(showShoppingList)'>Toggle Shopping List</u>
      </h2>
      <v-container id="form-container">
        <div class="column" id="group" v-for="(product, group_index) in this.resultSet" :key="group_index">
          <!-- Toggle by Product -->
          <span v-if="group_index == 0">
             <h2>{{ product.product_name }}</h2>
          </span>
          <span v-if="group_index > 0">
            <span v-if="product.product_name != resultSet[group_index-1].product_name">
              <h2>{{ product.product_name }}</h2>
            </span>
          </span>
          <div class="vendor-name" v-for="(vendor, vendor_index) in this.vendors" :key="vendor_index">
            <span v-if="product.vendor_id == vendor.id">
              <h2>
                <input
                  type="checkbox"
                  :checked="product.active"
                  @change="isChecked(product, product.active)"
                  class="field"
                />
                <label class="checkbox-right">{{ vendor.location }} - {{ vendor.vendor_name }}</label>
              </h2>
            </span>
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
  name: "Products",
  components: {
  },
  data() {
    return {
      Location: null,
      resultSet: [],
      showShoppingList: false,
      showFlag: false,
      isProductToggled: null,
    };
  },
  async mounted() {
    this.shoppingListDisplay(this.showShoppingList)
  },
  created() {
    this.$store.dispatch("fetchProducts");
    this.$store.dispatch("fetchShoppingList");
    this.$store.dispatch("fetchVendors");
    this.resultSet = this.products;
  },
  computed: {
    products() {
      return this.$store.state.products;
    },
    vendors() {
      return this.$store.state.vendors;
    },
    shopping_list() {
      return this.$store.state.shopping_list;
    },
    vendors_products() {
      return this.$store.state.vendors_products;
    },
  },
  methods: {
    onSubmit() {
      const sub_products = {
        ...this.resultSet,
        id: uuidv4(),
        created_by: this.$store.state.user.resource_owner.email,
      };   
      if (this.$store.dispatch("putProducts", sub_products, {params: { products: sub_products }} )) {
        alert("Products List Updated Successfully")
        location.reload();
      } else {
        alert("Error adding Products in Products View ");
      }
    },
    isChecked(item, active) {
      item.active = active == true ? false : true
      return item.active
    },
    shoppingListDisplay(showFlag) {
      this.showShoppingList = showFlag == true ? false : true
      if (this.showShoppingList == true) {
        this.resultSet = this.shopping_list       
      } else {
        this.resultSet = this.products
      }
      return this.showShoppingList
    },
    toggleProduct(index) {
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
  top: -2.25rem;
  left: 3rem;
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
