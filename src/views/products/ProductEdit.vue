<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Edit or Delete Product</h2>
      <p id="status-message">
        <u>{{ statusMessage }}</u>
      </p>
      <br/>
    </v-card-title>
    <ul>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'ProductsByLocations' }">Back to Shopping</router-link>
        </button>
      </li>
      <li>
        <button id="link-as-button" @click="deleteProduct(product)">
            Delete Product
        </button>
      </li>
    </ul> 
    <br/>
  </v-card>
  <br/>
  <div class="edit">
    <form class="card-display" @submit.prevent="updateProduct">
      <div class="form-container">
        <p id="p-custom-left">Vendor Location: {{ vendor.location }}</p>
        <p id="p-custom-left">Vendor Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ vendor.vendor_name }}</p>
        <v-text-field
          label="Product Name"
          v-model="product.product_name"
        >
        </v-text-field>
        <v-text-field
          label="Date of Purchase"
          v-model="product.date_purchased"
          type="date"
        />
        <v-text-field
          label="Notes"
          v-model="product.notes"
        />
        <br/>
        <button class="button" id="link-as-button" type="submit">
          Submit
        </button>
        <br/>
        <p id="status-message">
          <u>{{ statusMessage }}</u>
        </p>
      </div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  async mounted() {
    var work_url = ""
    if (window.location.port == "8080") {
      // or: "http://davids-mac-pro.local:3000/api/v1/";
      work_url = "http://localhost:3000/api/v1/products/";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/products/";
    }
    this.api_url = work_url
    const result = await axios.get(this.api_url + +this.$route.params.id);
    this.product = result.data.product;
    this.vendor = result.data.vendor;
  },
  data() {
    return {
      product: {
        id: "",
        vendor_id: "",
        product_name: "",
        active: "",
        date_purchased: "",
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      vendor: {
        vendor_name: "",
        location: ""
      },
      api_url: "",
      statusMessage: '',
    };
  },
  setup() {},
  methods: {
    async updateProduct() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Product from List ",
        message:
          "Are you sure you want to Update Product " + this.product.product_name,
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        const product = {
          ...this.product,
          updated_by: this.$store.state.created_by,
        };
        if (this.$store.dispatch("updateProduct", product)) {
          this.$router.push({ name: "ProductEdit", params: { id: product.id } });
        }
      }
    },
    async deleteProduct(product) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Product from Vendor " + this.vendor.vendor_name,
        message:
          "Are you sure you want to delete " +
          product.title +
          "? Once deleted it cannot be undone - only re-added.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteProduct", product);
        this.statusMessage =
          "Vendor and all its products were Deleted for " +
          product.product_name +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
        this.$router.push({ name: "ProductsByLocations" });
      }
    },
  },
};
</script>
<style>
</style>
