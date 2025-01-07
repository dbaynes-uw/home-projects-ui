<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>{{ golf.course }}</h1>
  <router-link :to="{ name: 'GolfList' }">
      <b>Back to Golf List</b>
    </router-link>
  <br/>
  <br/>
  <h3>{{ this.statusMessage }}</h3>
  <div class="card-display">
    <GolfCard
      :key="golf.id"
      :golf="golf"
      :origin="origin"
      class="card"
      @dblclick="editGolf(golf)"
      />
  </div>
</template>

<script>
//import { ref, computed } from "vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import GolfCard from "@/components/golfs/GolfCard.vue";
import { ref } from 'vue';
const successMessage = ref('')
export default {
  name: 'GolfDetails',
  props: ["id"],
  components: {
    ConfirmDialogue,
    GolfCard,
  },
  mounted() {
    this.sortedData = this.golfs;      
    successMessage.value = this.$route.query.success;
    this.statusMessage = successMessage.value
  },
  data() {
    return {
      statusMessage: '',
      updatedGolf: null,
    };
  },
  methods: {
    editGolf(golf) {
      this.$router.push({ name: 'GolfEdit', params: { id: `${golf.id}` } });
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
  created() {
    this.$store.dispatch("fetchGolf", this.id);
  },
  computed: {
    golf() {
      return this.$store.state.golf;
    },
    origin() {
      return "GolfDetails"
    }
  },
};
</script>