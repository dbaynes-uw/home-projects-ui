<template>
  <div>
    Past Due:
    <button class="button" @click="pastDue($event)">Click for Past Due</button>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "PastDue",
  methods: mapActions(["pastDue"]),
};
</script>

<style scoped>
button {
  margin: 30px;
  background-color: #39495c;
  border-radius: 5px;
  font-size: 18px;
  width: 160px;
  height: 60px;
  color: white;
  padding: 10px;
  box-shadow: inset 0 -0.6em 1em -0.35em rgba(0, 0, 0, 0.17),
    inset 0 0.6em 2em -0.3em rgba(255, 255, 255, 0.15),
    inset 0 0 0em 0.05em rgba(255, 255, 255, 0.12);
  text-align: center;
  cursor: pointer;
}
</style>
