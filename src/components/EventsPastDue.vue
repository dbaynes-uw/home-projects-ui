<template>
  <div>
    <button id="button-as-link" @click="eventsPastDue($event)">
      <u>Click for Past Due</u>
    </button>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "EventsPastDue",
  methods: mapActions(["eventsPastDue"]),
};
</script>

<style scoped>
/* no longer used...
button {
  margin: 30px;
  background-color: #7ba8bd;
  border-radius: 5px;
  font-size: 18px;
  width: 160px;
  height: 70px;
  color: #000;
  border-bottom: 1rem;
  padding: 10px;
  box-shadow: inset 0 -0.6em 1em -0.35em rgba(0, 0, 0, 0.17),
    inset 0 0.6em 2em -0.3em rgba(255, 255, 255, 0.15),
    inset 0 0 0em 0.05em rgba(255, 255, 255, 0.12);
  text-align: center;
  cursor: pointer;
}
*/
</style>
