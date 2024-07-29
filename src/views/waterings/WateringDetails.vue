<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>Watering Card</h1>
  <div class="card-display">
    <WateringCard
      :key="watering.id"
      :watering="watering"
      :origin="origin"
      class="card"
      @dblclick="onDoubleClick(watering)"
      />
  </div>
</template>

<script>
//import { ref, computed } from "vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import WateringCard from "@/components/waterings/WateringCard.vue";
export default {
  name: 'WateringDetails',
  props: ["id"],
  components: {
    ConfirmDialogue,
    WateringCard,
  },
  data() {
    return {
      updatedWatering: null,
    };
  },
  methods: {
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
  created() {
    this.$store.dispatch("fetchWatering", this.id);
  },
  computed: {
    watering() {
      return this.$store.state.watering;
    },
    origin() {
      return "WateringDetails"
    }
  },
};
</script>
<style scoped>
.event {
  font-size: 1.5rem;
}
#align-right {
  text-align: center;
}
body {
  font-size: 1.6rem;
}
.right-align {
  text-align: right;
}
</style>
