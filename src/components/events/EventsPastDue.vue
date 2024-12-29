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
</style>
