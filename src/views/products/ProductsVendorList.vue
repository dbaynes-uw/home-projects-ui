<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Products By Vendor</h2>
    </v-card-title>
    <ul>
      <li class="left">
        <button id="link-as-button">
          <router-link :to="{ name: 'ProductLocationsList' }">Shopping List By Location</router-link>
        </button>
      </li>
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
      <h2>
        <u @click='shoppingListDisplay(this.showShoppingList)'>Toggle Shopping List</u>
      </h2>
      <v-container id="form-container">
        <div class="row">
          <div class="column" id="group" v-for="(vendor, group_index) in vendors_products" :key="group_index">
            <!-- Toggle by Vendor -->
            <h1 @click='toggleVendor(group_index)'><u><b>{{ vendor.vendor_name }}</b><small style="font-size: 1rem;"> ({{ vendor.location }})</small></u></h1>
            <div v-show="isProductToggled === group_index">
              <br/>
              <div v-for="(item, product_index) in vendor.products" :key="product_index">        
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
  name: "ProductLocationsList",
  components: {
  },
  data() {
    return {
      resultSet: [],
      showShoppingList: true,
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
      isProductToggled: null,
    };
  },
  created() {
    this.$store.dispatch("fetchVendorsProducts");
  },
  computed: {
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
    toggleVendor(index) {
      return this.isProductToggled = index === this.isProductToggled? null : index
    },
  },
};
</script>
<style lang="css">
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
