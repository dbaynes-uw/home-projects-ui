<template>
  <div class="trailEdit">
    <h2>Edit Trail {{ trail.head_name }}</h2>
    <form class="add-form" @submit.prevent="updateTrail">
      <div class="form-container">
        <label>Head Name:</label>
        <input
          type="text"
          class="text-style"
          v-model="trail.head_name"
          required
        />
        <label>Location:</label>
        <input
          type="text"
          class="text-style"
          v-model="trail.location"
          required
        />
        <label>Distance:</label>
        <input type="text" class="text-style" v-model="trail.distance" />
        <label for="date_last_hiked">Date Last Hiked:</label>
        <input
          type="date"
          class="text-style"
          v-model="trail.date_last_hiked"
          required
        />
        <label for="url_to_map">URL to Map:</label>
        <input type="text" class="text-style" v-model="trail.url_to_map" />
        <label>Notes:</label>
        <input type="text" class="text-style" v-model="trail.notes" />
        <button class="button" type="submit" id="background-blue">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["id"],
  async mounted() {
    console.log("Mounted: ", this.$route.params.id);
    const result = await axios.get(
      "http://davids-macbook-pro.local:3000/api/v1/trails/" +
        +this.$route.params.id
    );
    this.trail = result.data;
    console.log("Returned trail: ", this.trail);
  },
  data() {
    return {
      trail: {
        id: "",
        head_name: "",
        location: "",
        distance: "",
        date_last_hiked: "",
        notes: "",
        updated_by: "dbaynes",
      },
    };
  },
  setup() {},
  methods: {
    async updateTrail() {
      const trail = {
        ...this.trail,
        updated_by: this.$store.state.created_by,
      };
      console.log("This trail to PUT: ", this.trail);
      const result = await axios.put(
        "http://davids-macbook-pro.local:3000/api/v1/trails/" +
          this.$route.params.id,
        {
          head_name: this.trail.head_name,
          location: this.trail.location,
          distance: this.trail.distance,
          date_last_hiked: this.trail.date_last_hiked,
          notes: this.trail.notes,
        }
      );
      if (result.status >= 200) {
        alert("Trail has been updated");
        this.$router.push({ name: "TrailDetails", params: { id: trail.id } });
      } else {
        alert("Update Error Code ", result.status);
        console.log("ERROR Result Status: ", result.status);
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
