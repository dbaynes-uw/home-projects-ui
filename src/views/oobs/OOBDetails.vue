<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div>
    <h1>Med Details</h1>
    <button id="link-as-button">
      <router-link  :to="{ name: 'MedList' }">Back to Med List</router-link>
    </button>
    <span class="h3-left-total-child">Double click Item Below to Edit</span>
    <br/><br/>
    <div class="card-display">
      <MedCard
        :key="med.id"
        :med="med"
        class="card"
        @dblclick="editMed(med)"
      />
    </div>
  </div>
</template>

<script>
//import { ref, computed } from "vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import MedCard from "@/components/oobs/OobCard.vue";

export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
    MedCard,
  },
  data() {
    return {
      updatedMed: null,
    };
  },
  methods: {
    editMed(med) {
      this.$router.push({ name: 'MedEdit', params: { id: `${med.id}` } });
    },
    async deleteMed(med) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Med",
        message:
          "Are you sure you want to delete " +
          med.title +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteMed", med);
        alert("Med was Deleted for " + med.title);
        this.$router.push({ name: "MedList" });
      }
    },
    formatStandardDateTime(value) {
      return DateFormatService.formatStandardDateTimejs(value);
    },
  },
  created() {
    this.$store.dispatch("fetchOob", this.id);
  },
  computed: {
    med() {
      return this.$store.state.med;
    },
  },
};
</script>