<template>
  <div class="card">
    <ul>
      <li class="li-left">Date: <b>{{ formatStandardDateTime(glucose_reading.reading_date) }}</b></li>
      <li class="li-left">Reading: {{ glucose_reading.reading }} {{ glucose_reading.unit }}</li>
      <li class="li-left">Fasting Type: {{ glucose_reading.reading_type }}</li>
      <li class="li-left">Result: {{ glucose_reading.status }}</li>
      <li class="li-left">Notes: {{glucose_reading.notes}}</li>
    </ul>
    <span class="fa-stack">
      <router-link :to="{ name: 'GlucoseReadingEdit', params: { id: `${glucose_reading.id}` } }">
        <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
      </router-link>
    </span>
    <span class="fa-stack">
      <i @click="deleteGlucoseReading(glucose_reading)" class="fas fa-trash-alt fa-stack-1x">
      </i>
    </span>
    <br />
    <router-link :to="{ name: 'GlucoseReadingList' }">
      <i class="fa-solid fa-backward fa-stack-1x"></i>
    </router-link>
  </div>
</template>
<script>
//import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import SplitStringService from "@/services/SplitStringService.js";
export default {
  name: 'GlucoseReadingCard',
  props: {
    glucose_reading: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    //ConfirmDialogue,
  },
  data() {
    return {
      splitLength: 30,
    }
  },
  methods: {
    async deleteGlucoseReading(glucose_reading) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete GlucoseReading from List",
        message:
          "Are you sure you want to delete " +
          glucose_reading.date_of_occurrence +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteGlucoseReading", glucose_reading);
        this.statusMessage =
          "GlucoseReading was Deleted for " +
          glucose_reading.date_of_occurrence +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
        this.$router.push({ name: "GlucoseReadingList" });
      }
    },
    splitList(glucose_readingData, splitLength) {
      return SplitStringService.splitList(glucose_readingData.circumstances, splitLength) 
    },
    formatStandardDateTime(value) {
      return DateFormatService.formatStandardDateTimejs(value);
    },
  }
}
</script>
<style scoped>
</style>
