<template>
  <div class="med-chart">
    <!--canvas id="medChart" width="400" height="400"></canvas-->
    <div class="div-select">
    Timeframe:
    <select class="border-select select-range" @change="filterTimeFrame($event)">
      <option></option>
      <option value="7">Week</option>
      <option value="14">2 Weeks</option>
      <option value="30">Month</option>
      <option value="90">Quarter</option>
      <option value="365">Year</option>
    </select>
  </div>
    <Bar v-if="renderComponent" :data="data" :options="options" />
  </div>
</template>
<script>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs';
import DateFormatService from "@/services/DateFormatService.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
export default {
  name: 'MedChart',
  components: {Bar},
  props: ["meds","chartLabels","chartIntervals"],
  data() {
    return {
      data: {
        labels: this.chartLabels,
        datasets: [{
          label: 'Occurrences by # of Days',
          backgroundColor: 'red',
          data: this.chartIntervals
        }],
        chartData: [],
      },
      options: {
        responsive: true,
      },
      timeFrames: ["Week", "Month", "Quarter","YTD"],
      renderComponent: true,
    }
  },
  async mounted() {
    this.data.labels  = this.chartLabels
    this.data.datasets.data = this.chartIntervals
  },
  methods: {
    async filterTimeFrame(value) {
      this.renderComponent = false
      await this.$nextTick();
      var timeFrame = ""
      if (value.target.value > this.meds.length) {
        timeFrame = this.meds.length
      } else {
        timeFrame = value.target.value
      }
      this.data.labels = []
      this.data.datasets.data = []
        for (let i=0; i < timeFrame; i++) {
          this.data.labels[i] = DateFormatService.formatStandardDatejs(this.meds[i].date_of_occurrence)
          this.data.datasets.data[i] = this.meds[i].interval_days
        }
      this.renderComponent = true;
    },  
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
}
</script>