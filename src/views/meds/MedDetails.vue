<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div>
    <h1>Med Details</h1>
    <br />
    <div v-if="med" class="event" id="center-align">
      <h3>
        <b>{{ med.title }}</b>
      </h3>
      <ul class="ul-left">
        <li>
          Author:
          <b>{{ med.author }}</b>
        </li>
        <li v-if="med.date_written">
          Date Med Written:
          <b>{{ formatStandardDate(med.date_written) }}</b>
        </li>
        <li v-if="med.date_read">
          Date Med Read:
          <b>{{ formatStandardDate(med.date_read) }}</b>
        </li>
        <li v-if="med.url_to_review">
          URL to Review:
          <a :href="med.url_to_review" target="_blank">Click</a>
        </li>
        <li>
          Notes:
          <b>{{ med.notes }}</b>
        </li>
        <li>
          Date Entered:
          <b>{{ formatStandardDate(med.created_at) }}</b>
        </li>
      </ul>
      <br />
      <router-link :to="{ name: 'MedList' }">
        <i class="fa-solid fa-backward fa-stack-1x"></i>
      </router-link>
      <span class="fa-stack">
        <router-link :to="{ name: 'MedEdit', params: { id: `${med.id}` } }">
          <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
        </router-link>
      </span>
      <span class="fa-stack">
        <i @click="deleteMed(med)" class="fas fa-trash-alt fa-stack-1x"></i>
      </span>
      <br />
      <router-link :to="{ name: 'MedList' }">
        <i class="fa-solid fa-backward fa-stack-1x"></i>
      </router-link>
    </div>
  </div>
</template>

<script>
//import { ref, computed } from "vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      updatedMed: null,
    };
  },
  methods: {
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
    formatStandardDate(value) {
      return DateFormatService.formatStandardDate(value);
    },
  },
  created() {
    this.$store.dispatch("fetchMed", this.id);
  },
  computed: {
    med() {
      return this.$store.state.med;
    },
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
