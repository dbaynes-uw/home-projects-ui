<template>
  <div class="card">
    <!--p id="p-custom-left-u">{{ med.id}}</!--p-->
    <!--confirm-dialogue ref="confirmDialogue"></!--confirm-dialogue-->
    <ul>
      <li class="li-left">Date: <b>{{ formatStandardDateTime(med.date_of_occurrence) }}</b></li>
      <li class="li-left">Duration: {{ med.duration }}</li>
      <li class="li-left">Since Last:</li>
      <li class="li-left">&nbsp;&nbsp;Days: {{ med.interval_days }} days</li>
      <li class="li-left">&nbsp;&nbsp;Hours: {{ med.interval_hours }} hours</li>
      <li class="li-left">&nbsp;&nbsp;Minutes: {{ med.interval_minutes }} minutes</li>
      <li class="li-left">Notes:</li> <!-- {{med.circumstances}}</li>-->
      <span v-if="med.circumstances != null">
        <b class="li-left-none" v-for="(circumstance, idx) in splitList(med, this.splitLength)" :key="idx">{{ circumstance }}</b>
      </span>
    </ul>
    <span class="fa-stack">
      <router-link :to="{ name: 'MedEdit', params: { id: `${med.id}` } }">
        <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
      </router-link>
    </span>
    <span class="fa-stack">
      <i @click="deleteMed(med)" class="fas fa-trash-alt fa-stack-1x">
      </i>
    </span>
    <br />
    <router-link :to="{ name: 'MedList' }">
      <i class="fa-solid fa-backward fa-stack-1x"></i>
    </router-link>
  </div>
</template>
<script>
//import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import SplitStringService from "@/services/SplitStringService.js";
export default {
  name: 'MedCard',
  props: {
    med: {
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
    async deleteMed(med) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Med from List",
        message:
          "Are you sure you want to delete " +
          med.date_of_occurrence +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteMed", med);
        this.statusMessage =
          "Med was Deleted for " +
          med.date_of_occurrence +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
        this.$router.push({ name: "MedList" });
      }
    },
    splitList(medData, splitLength) {
      return SplitStringService.splitList(medData.circumstances, splitLength) 
    },
    formatStandardDateTime(value) {
      return DateFormatService.formatStandardDateTimejs(value);
    },
  }
}
</script>
<style scoped>
</style>
