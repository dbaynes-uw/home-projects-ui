<template>
  <h1>Create a Travel to Track</h1>
  <div class="form-container">
    <form class="add-form" @submit.prevent="onSubmit">
      <label>Title</label>
      <input
        v-model="travel.title"
        type="text"
        class="text-style"
        placeholder="Travel Title"
        required
      />
      <label>Description</label>
      <input
        v-model="travel.description"
        type="text"
        class="text-style"
        placeholder="Description"
        required
      />
      <label for="date_last_hiked">Start Date:</label>
      <input type="date" class="text-style" v-model="travel.start_date" />
      <input type="date" class="text-style" v-model="travel.end_date" />
      <label>Reference</label>
      <input
        v-model="travel.url_reference"
        type="text"
        :maxlength="urlMaxLength"
        class="text-style"
        placeholder="URL to Reference"
      />
      <span>
        {{ urlMaxLength - travel.url_reference.length }} / {{ urlMaxLength }}
      </span>
      <label>Notes</label>
      <input
        v-model="travel.notes"
        type="text"
        placeholder="Notes"
        class="text-style"
      />
      <button class="button" type="submit">Submit</button>
    </form>
  </div>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
export default {
  data() {
    return {
      travel: {
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        url_reference: "",
        notes: "",
        created_by: "dbaynes",
      },
      urlMaxLength: 255,
      num: 1,
    };
  },
  methods: {
    onSubmit() {
      const travel = {
        ...this.travel,
        id: uuidv4(),
        created_by: this.$store.state.user,
      };
      if (this.$store.dispatch("createTravel", travel)) {
        this.$router.push({ name: "TravelList" });
      } else {
        alert("Error adding Travel Location " + travel.title);
      }
    },
  },
  travel() {
    return this.$store.state.travel;
  },
};
</script>
<style>
.add-form {
  display: flex;
  flex-direction: column;
  width: 425px;
  padding: 20px;
  margin: 40px;
  border: 2px solid #d8d8d8;
  background-color: white;
  -webkit-box-shadow: 0px 2px 15px -12px rgba(0, 0, 0, 0.57);
  -moz-box-shadow: 0px 2px 15px -12px rgba(0, 0, 0, 0.57);
  box-shadow: 2px 15px -12px rgba(0, 0, 0, 0.57);
}
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
</style>
