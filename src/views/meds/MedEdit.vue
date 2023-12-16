<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="medEdit">
    <h2>Edit Med {{ med.head_name }}</h2>
    <form class="add-form" @submit.prevent="updateMed">
      <div class="form-container">
        <label>Title:</label>
        <input type="text" class="text-style" v-model="med.title" required />
        <label>Author:</label>
        <input type="text" class="text-style" v-model="med.author" required />
        <label for="date_written">Date Written:</label>
        <input
          type="date"
          class="text-style"
          v-model="med.date_written"
        />
        <label for="date_read">Date Read:</label>
        <input
          type="date"
          class="text-style"
          v-model="med.date_read"
        />
        <label for="url_to_review">URL to Review:</label>
        <input type="text" class="text-style" v-model="med.url_to_review" />
        <label>Notes:</label>
        <textarea
          v-model="med.notes"
          rows="3"
          cols="40"
          class="textarea-style"
        />
        <button class="button" type="submit" id="background-blue">
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
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  async mounted() {
    var work_url = ""
    if (window.location.port == "8080") {
      // or: "http://davids-macmed-pro.local:3000/api/v1/";
      work_url = "http://localhost:3000/api/v1/meds/";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/meds/";
    }
    console.log("Mounted: ", this.$route.params.id);
    this.api_url = work_url
    const result = await axios.get(this.api_url + +this.$route.params.id);
    this.med = result.data;
  },
  data() {
    return {
      med: {
        id: "",
        title: "",
        author: "",
        date_written: "",
        date_read: "",
        url_to_review: "",
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      api_url: ""
    };
  },
  setup() {},
  methods: {
    async updateMed() {
  
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Med from List ",
        message:
          "Are you sure you want to update " + 
          this.med.title,
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        const med = {
          ...this.med,
          updated_by: this.$store.state.created_by,
        };
        console.log("This api_url: ", this.api_url);
        console.log("This med to PUT: ", this.med);
        const result = await axios.put(
            this.api_url + 
            this.$route.params.id,
          {
            title: this.med.title,
            author: this.med.author,
            date_written: this.med.date_written,
            date_read: this.med.date_read,
            url_to_review: this.med.url_to_review,
            notes: this.med.notes,
          }
        );
        if (result.status >= 200) {
          alert("Med has been updated");
          this.$router.push({ name: "MedDetails", params: { id: med.id } });
        } else {
          alert("Update Error Code ", result.status);
          console.log("ERROR Result Status: ", result.status);
        }
      }
    },
  },
};
</script>
<style>
select {
  border-color: darkgreen;
}
</style>
