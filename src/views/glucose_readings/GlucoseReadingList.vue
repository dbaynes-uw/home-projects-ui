<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Glucose Reading List</h2>
      <router-link :to="{ name: 'GlucoseReadingCreate' }">Create New Glucose Reading</router-link>
      <br/>
      <br/>
    </v-card-title>
    <ul>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'GlucoseReadingCreate' }">Add Glucose Reading</router-link>
        </button>
      </li>
      <li>
        <button id="button-as-link" @click="requestIndexDetail">
          <u>Index or Card View</u>
        </button>
      </li>
    </ul>
    <br/>
  </v-card>
  <br/>
  <div class="glucose-reading-list">
    <span v-if="requestIndexDetailFlag == true">
      requestIndexDetailFlag is {{ requestIndexDetailFlag }}
      <GlucoseReadingIndex :glucose_readings="glucose_readings"/>
    </span>
    <span v-else>
      <span class="h3-left-total-child">Double click Item Below to Edit</span>
      <div class="cards">
        <GlucoseReadingCard
          v-for="glucose_reading in glucose_readings"
          :key="glucose_reading.id"
          :glucose_reading="glucose_reading"
          class="card"
          @dblclick="editGlucoseReading(glucose_reading)"
        />
        <br />
      </div>
    </span>
  </div>
</template>
<script>
//import { ref, computed, onMounted } from 'vue';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import GlucoseReadingCard from "@/components/glucose_readings/GlucoseReadingCard.vue";
import GlucoseReadingIndex from "@/components/glucose_readings/GlucoseReadingIndex.vue";

export default {
  name: 'GlucoseReadingList',
  components: {
    GlucoseReadingCard,
    GlucoseReadingIndex,
  },
  data() {
    return {
      requestIndexDetailFlag: false,
      //isLoading: true,
      //splitLength: 30,
    };
  },
  methods: {
    async editGlucoseReading(glucose_reading) {
      this.$router.push({ name: 'GlucoseReadingEdit', params: { id: glucose_reading.id } });
    },
    requestIndexDetail() {
      console.log("Requesting Index or Detail View");
      // This method can be used to toggle between index and detail view
      //this.$router.push({ name: 'GlucoseReadingIndex' });
      this.requestIndexDetailFlag = this.requestIndexDetailFlag == true ? false : true;
    },
  },
  setup() {
    const store = useStore();
    //const glucose_readings = computed(() => store.getters.glucose_readings);
    const glucose_readings = computed(() => store.state.glucoseReadings); // Use Vuex state directly
    //const isLoading = ref(true);

    onMounted(async () => {
      try {
        await store.dispatch('fetchGlucoseReadings');
      } catch (error) {
        console.error("Error fetching glucose readings:", error);
      } finally {
        //isLoading.value = false;
      }
    });
    //return { glucose_readings, isLoading };
    return { glucose_readings };
  },
};
</script>