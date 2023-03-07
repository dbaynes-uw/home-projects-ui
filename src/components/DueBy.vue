<template>
  Due in next:
  <select @change="dueBy($event)">
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
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "DueBy",
  methods: mapActions(["dueBy"]),
};
</script>
<style>
select {
  margin-top: 20px;
  padding: 6px;
}
</style>
