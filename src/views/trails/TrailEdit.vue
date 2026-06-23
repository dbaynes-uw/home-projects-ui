<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="trailEdit">
    <br/>
    <h2>Edit Trail {{ trail.trail_head_name }}</h2>
    <div class="details-top-links">
      <router-link class="details-top-link" :to="{ name: 'TrailList' }">
        Back to Trail List
      </router-link>
    </div>
    <br/>
    <form class="card-display" @submit.prevent="updateTrail">
      <div class="form-container">
        <BaseTextField
          label="Trail Head"
          v-model="trail.trail_head_name"
          required
        />
        <BaseTextField
          label="Trail Head"
          v-model="trail.location"
          required
        />
        <BaseTextField
          label="Distance"
          v-model="trail.distance"
        />
        <BaseTextField
          label="Click calendar Date"
          v-model="trail.date_last_hiked"
          type="date"
        />
        <BaseTextField
          label="URL to Trail Map"
          pattern="https://.*"
          v-model="trail.url_to_map"
          type="url"
        />
        <BaseTextarea
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
<style scoped>
.details-top-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0 0.75rem;
}

.details-top-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  background: #f8fafc;
  color: #0f172a;
  text-decoration: none;
  font: inherit;
}

.details-top-link:hover {
  background: #e2e8f0;
}

@media (max-width: 600px) {
  .details-top-links {
    flex-direction: column;
    align-items: stretch;
  }

  .details-top-link {
    width: 100%;
  }
}
</style>
<style>
select {
  border-color: darkgreen;
}
</style>
