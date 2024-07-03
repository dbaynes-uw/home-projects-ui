<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Vendor Maintenance</h2>
      <p id="status-message">
        <u>{{ statusMessage }}</u>
      </p>
      <br/>
    </v-card-title>
    <ul>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'ProductLocationsList' }">Back to Shopping</router-link>
        </button>
      </li>
      <li>
        <button id="link-as-button" @click="deleteVendor(vendor)">
            Delete Vendor
        </button>
      </li>
    </ul> 
    <br/>
  </v-card>
  <br/>
  <div class="edit">
    <form class="add-form" @submit.prevent="updateVendor">
      <div class="form-container">
        <v-text-field
          label="Location"
          v-model="vendor.location"
          :readonly="true"
        />
        <v-text-field
          label="Vendor Name"
          v-model="vendor.vendor_name"
        />
        <br/>
        <button class="button" id="link-as-button" type="submit">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
export default {
  //props: ["id","statusMessage"],
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  async mounted() {
    var work_url = ""
    if (window.location.port == "8080") {
      // or: "http://davids-macmed-pro.local:3000/api/v1/";
      work_url = "http://localhost:3000/api/v1/vendors/";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/vendors/";
    }
    this.api_url = work_url
    const result = await axios.get(this.api_url + +this.$route.params.id);
    this.vendor = result.data;
  },
  data() {
    return {
      vendor: {
        id: "",
        vendor_name: "",
        location: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      api_url: "",
      statusMessage: ''
    };
  },
  setup() {},
  methods: {
    async updateVendor() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Med from List ",
        message:
          "Are you sure you want to Update this record ",
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        const vendor = {
          ...this.vendor,
          updated_by: this.$store.state.created_by,
        };
        const result = await axios.put(
            this.api_url + 
            this.$route.params.id,
          {
            vendor_name: this.vendor.vendor_name,
            location: this.vendor.location,
          }
        );
        if (result.status >= 200) {
          this.statusMessage = "Vendor has been updated for " + vendor.vendor_name
          //this.$router.push({ name: "ProductLocationsList" });
        } else {
          alert("Update Error Code ", result.status);
        }
      }
    },
    async deleteVendor(vendor) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Vendor from List?",
        message:
          "Are you sure you want to delete " +
          vendor.title +
          "? All of its products will also be deleted and it cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteVendor", vendor);
        this.statusMessage =
          "Vendor and all its products were Deleted for " +
          vendor.vendor_name +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
        this.$router.push({ name: "ProductLocationsList" });
      }
    },
  },
};
</script>
<style>
#status-message {
  font-weight: bold;
  color: darkgreen;
}
</style>
