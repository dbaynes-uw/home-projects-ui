<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Product List by Vendor</h3>
    </v-card-title>
  </v-card>
  <v-card-text>
    <v-form>
      <v-container id="form-container">
        <div class="row">
          <div class="column">
            <h2 @click='toggle1 = !toggle1'><b><u>CostCo</u></b></h2>
            <br/>
            <div v-show='toggle1'>
              <div v-for="(item, index) in products" :key="index">
                <span v-if="item.vendor == 'costco'">
                  <v-checkbox
                    :label="item.product"
                    v-model="product.vendor_products"
                    :value="item.vendor + '-' + item.product"
                  />
                </span>
              </div>
            </div>
          </div>
          <div class="column">
            <h2 @click='toggle2 = !toggle2'><b><u>Safeway</u></b></h2>
            <br/>
            <div v-show='toggle2'>
              <div v-for="(item, index) in products" :key="index">
                <span v-if="item.vendor == 'safeway'">
                  <v-checkbox
                    :label="item.product"
                    v-model="product.vendor_products"
                    :value="item.vendor + '-' + item.product"                           
                  />
                </span>
              </div>
            </div>
          </div>
          <div class="column">
            <h2 @click='toggle3 = !toggle3'><b><u>Trader Joes</u></b></h2>
            <br/>
            <div v-show='toggle3'>
              <div v-for="(item, index) in products" :key="index">
                <span v-if="item.vendor == 'traderjoes'">
                  <v-checkbox
                    :label="item.product"
                    v-model="product.vendor_products"
                    :value="item.vendor + '-' + item.product"                           
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <v-text-field label="Notes" v-model="product.notes">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-note</v-icon>
          </template>
        </v-text-field>
        Product: {{ this.product}}
        <v-btn type="submit" block class="mt-2" @click="onSubmit">Submit</v-btn>
      </v-container>
    </v-form>
  </v-card-text>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
export default {
  components: {
  },
  data() {
    return {
      products: [
        { vendor: 'costco', product: 'prod1', checked: false },
        { vendor: 'costco', product: 'prod2', checked: false },
        { vendor: 'costco', product: 'prod3', checked: false },
        { vendor: 'safeway', product: 'prod1', checked: false },
        { vendor: 'safeway', product: 'prod2', checked: false },
        { vendor: 'safeway', product: 'prod3', checked: false },
        { vendor: 'traderjoes', product: 'prod1', checked: false },
        { vendor: 'traderjoes', product: 'prod2', checked: false },
        { vendor: 'traderjoes', product: 'prod3', checked: false },
      ],
      product: {
        vendor_products: [],
        notes: "",
        created_by: "dbaynes",
      },
      toggle1: false,
      toggle2: false,
      toggle3: false,
      isFormValid: false,
      isAuthorValid: false,
      isTitleValid: false,
      urlMaxLength: 255,
      num: 1,
    };
  },
  methods: {
    onSubmit() {
      console.log("onSubmit Product List - product?")
      alert("On Submit!!!!")
      const product = {
        ...this.product,
        id: uuidv4(),
        created_by: this.$store.state.user,
      };
      console.log("Call to Store - product: ", product)
      alert("Call to Store:")
      if (this.$store.dispatch("createProduct", product)) {
        this.$router.push({ name: "ProductList" });
      } else {
        alert("Error adding Product " + product.title);
      }
    },
  },
  product() {
    return this.$store.state.product;
  },
};
</script>
<style lang="css">

/* Create two equal columns that floats next to each other */
.column {
  float: left;
  width: 33%;
  padding: 10px;
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
  width: 75% !important;
}
[type="checkbox"],
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
