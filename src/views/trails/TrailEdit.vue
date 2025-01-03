<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="trailEdit">
    <br/>
    <h2>Edit Trail {{ trail.trail_head_name }}</h2>
    <button id="link-as-button">
      <router-link  :to="{ name: 'TrailList' }">Back to Trail List</router-link>
    </button>
    <form class="add-form" @submit.prevent="updateTrail">
      <div class="form-container">
        <v-text-field
          label="Trail Head"
          v-model="trail.trail_head_name"
          required
        />
        <v-text-field
          label="Trail Head"
          v-model="trail.location"
          required
        />
        <v-text-field
          label="Distance"
          v-model="trail.distance"
        />
        <v-text-field
          label="Click calendar Date"
          v-model="trail.date_last_hiked"
          type="date"
        />
        <v-text-field
          label="URL to Trail Map"
          pattern="https://.*"
          v-model="trail.url_to_map"
          type="url"
        />
        <v-textarea
          label="Notes"
          v-model="trail.notes"
          rows="3"
          cols="40"
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
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  async mounted() {
    var work_url = ""
    if (window.location.port == "8080") {
      // or: "http://davids-macbook-pro.local:3000/api/v1/";
      work_url = "http://localhost:3000/api/v1/trails/";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/trails/";
    }
    this.api_url = work_url
    const result = await axios.get(this.api_url + +this.$route.params.id);
    this.trail = result.data;
  },
  data() {
    return {
      trail: {
        id: "",
        trail_head_name: "",
        location: "",
        distance: "",
        url_to_map: "",
        date_last_hiked: "",
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
    };
  },
  setup() {},
  methods: {
    async updateTrail() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Trail from List",
        message:
          "Are you sure you want to update " +
          this.trail.trail_head_name +
          "? It cannot be undone.",
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        const trail = {
          ...this.trail,
          updated_by: this.$store.state.created_by,
        };
        const result = await axios.put(
            this.api_url + 
            this.$route.params.id,
          {
            trail_head_name: this.trail.trail_head_name,
            location: this.trail.location,
            distance: this.trail.distance,
            url_to_map: this.trail.url_to_map,
            date_last_hiked: this.trail.date_last_hiked,
            notes: this.trail.notes,
          }
        );
        if (result.status >= 200) {
          alert("Trail has been updated ");
          this.$router.push({ name: "TrailDetails", params: { id: trail.id } });
        } else {
          alert("Update Error Code ", result.status);
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
