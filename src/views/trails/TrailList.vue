<template>
  <div>
    <h2>Trails</h2>
    <div>
      <DueBy />
    </div>
    <br />
    <div>
      <PastDue />
      <button @click="refreshPage">Refresh</button>
    </div>
    <br />
    <div class="legend">
      <span>Double click to mark as complete.</span>
      <span><span class="incomplete-box"></span> = Incomplete</span>
      <span><span class="complete-box"></span> = Complete</span>
    </div>
    <div class="trails">
      <div
        v-for="trail in trails"
        :key="trail.id"
        :trail="trail"
        class="trail"
        @dblclick="onDoubleClick(trail)"
      >
        <router-link :to="{ name: 'TrailDetails', params: { id: trail.id } }">
          <p class="p-align-left">
            <b>
              <u>Trail Details for {{ trail.description }}</u>
            </b>
          </p>
        </router-link>
        <ul class="ul-left">
          <li v-if="trail.assigned">
            <router-link
              :to="{
                name: 'TrailsAssigned',
                params: { assigned: trail.assigned },
              }"
            >
              <b>{{ trail.assigned }}</b>
            </router-link>
          </li>
          <li>{{ trail.notes }}</li>
          <li :class="trail.action_active ? 'is-active' : 'is-inactive'">
            Status:
            {{ trail.action_active ? "Active" : "InActive" }}
          </li>
          <li v-bind:class="{ 'is-active': trail.action_active }">
            Last Completed:
            {{ formatStandardDate(trail.action_date) }}
          </li>
          <li>{{ trail.frequency }} day cycle</li>
          <li>
            Action Date:
            {{ formatStandardDate(trail.action_date) }}
          </li>
          <li>
            Date Due:
            <span
              v-if="
                DateFormatService.datePastDue(
                  trail.action_date,
                  trail.frequency
                )
              "
            >
              <span style="color: red; font-weight: bold">
                {{ calculateDue(trail.action_date, trail.frequency) }}
                {{ calculateDateDue(trail.action_date, trail.frequency) }}
              </span>
            </span>
            <span v-else>
              <span>
                {{ calculateDue(trail.action_date, trail.frequency) }}
                {{ calculateDateDue(trail.action_date, trail.frequency) }}
              </span>
            </span>
          </li>
          <li>
            Latest Changes:
            <ul v-for="(history, index) in trail.histories" :key="history.id">
              <span v-if="index == 0">
                <li v-html="history.notes"></li>
              </span>
            </ul>
          </li>
        </ul>
        <br />
        <span class="fa-stack">
          <router-link
            :to="{ name: 'TrailEdit', params: { id: `${trail.id}` } }"
          >
            <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
          </router-link>
        </span>
        <span class="fa-stack">
          <i @click="deleteTrail(trail)" class="fas fa-trash-alt fa-stack-1x">
          </i>
        </span>
      </div>
    </div>
    <!--div>{{ $store.state.trails }}</div-->
  </div>
</template>

<script setup>
import DueBy from "@/components/DueBy.vue";
import PastDue from "@/components/PastDue.vue";
</script>
<script>
// @ is an alias to /src
import DateFormatService from "@/services/DateFormatService.js";
export default {
  components: {
    DueBy,
  },
  props: ["id", "assigned", "pastDue"],
  //data() {},
  data() {
    return {
      DueBy: null,
      trailList: null,
      updatedTrail: null,
    };
  },
  methods: {
    refreshPage() {
      //this.$router.push({ path: "/" });
      window.location.reload();
    },
    onDoubleClick(trail) {
      var updatedTrail = trail;
      updatedTrail.action_active = !trail.action_active;
      this.$store.dispatch("updateTrail", updatedTrail);
    },
    deleteTrail(trail) {
      this.$store.dispatch("deleteTrail", trail);
      alert("Trail was Deleted for " + trail.description);
      location.reload();
    },
    DatePastDue(value) {
      return DateFormatService.datePastDue(value);
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDate(value);
    },
    formatSystemDate(value) {
      return DateFormatService.formatSystemDate(value);
    },
    calculateDue(action_date, frequency) {
      return DateFormatService.calculateDue(action_date, frequency);
    },
    calculateDateDue(action_date, frequency) {
      return DateFormatService.calculateDateDue(action_date, frequency);
    },
  },
  created() {
    this.$store.dispatch("fetchTrails");
  },
  computed: {
    trails() {
      return this.$store.state.trails;
    },
  },
};
</script>
<style>
.trails {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}
.trail {
  border: 1px solid #ccc;
  background: #41b883;
  padding: 1rem;
  padding-top: 0em;
  border-radius: 5px;
  text-align: center;
  position: relative;
  cursor: pointer;
}
.trail-link {
  border: 1px solid #ccc;
  background: #41b883;
  padding: 1rem;
  padding-top: 0em;
  border-radius: 5px;
  text-align: center;
  position: relative;
  cursor: pointer;
}
i {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #fff;
  cursor: pointer;
}
.legend {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}
.complete-box {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #35495e;
}
.is-active {
  background: #41b882;
  color: #000;
}
.incomplete-box {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #41b882;
}
.is-inactive {
  background: #35495e;
  color: #fff;
}
.is-complete-for-link {
  color: #41b883;
}
select {
  border-color: darkgreen;
}
.fa-table {
  margin-top: 1rem;
}
@media (max-width: 500px) {
  .trails {
    grid-template.columns: 1fr;
  }
}
</style>
