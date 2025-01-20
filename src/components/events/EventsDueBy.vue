<template>
  <span class="div-select">
    Due in next:
    <select v-model="selectedDueByValue" class="border-select-event" @change="eventsDueBy($event)">
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
  </span>
</template>
<script setup>
import { mapActions } from "vuex";
//watch(() => {
//  //if (selectedDueByValue != null){
//  //  resetValue()
//  //}
//}),
//function resetValue() {
//  selectedDueByValue.value = ''; // Or your default value
//}
</script>
<script>
export default {
  name: "EventsDueBy",
  methods: mapActions(["eventsDueBy"]),
};

</script>