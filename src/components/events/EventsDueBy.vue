<template>
  <div class="div-select">
    Due in next:
    <select class="border-select" @change="eventsDueBy($event)">
      <option></option>
      <option>7</option>
      <option>10</option>
      <option>14</option>
      <option>21</option>
      <option>30</option>
      <option>60</option>
      <option>90</option>
      <option>120</option>
      <option>180</option>
      <option>360</option>
    </select>
    Days
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "EventsDueBy",
  methods: mapActions(["eventsDueBy"]),
};
</script>
<style>
</style>
