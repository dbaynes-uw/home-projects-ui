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
          v-model="trail.head_name"
          required
        />
        <label>Distance:</label>
        <input type="text" class="text-style" v-model="trail.distance" />
        <label>Date Last Hiked:</label>
        <input type="text" class="text-style" v-model="trail.date_last_hiked" />
        <label>Notes:</label>
        <input type="text" class="text-style" v-model="trail.notes" />
        <button class="button" type="submit">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["id"],
  async mounted() {
    const result = await axios.get(
      "http://localhost:3000/api/v1/trails/" + this.$route.params.id
    );
    this.trail = result.data;
  },
  data() {
    return {
      assignees: ["David", "Jane", "Both", "Up for Grabs"],
      frequency: ["7", "10", "14", "21", "30", "60", "90", "120", "360"],
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
        "http://localhost:3000/api/v1/trails/" + this.$route.params.id,
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
