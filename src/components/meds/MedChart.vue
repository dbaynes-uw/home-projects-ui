<template>
  <div class="med-chart">
    <!--canvas id="medChart" width="400" height="400"></canvas-->
    <!--Bar :data="data" :options="options" /-->
    <!--div class="div-select">
      Time Frame:
      <select class="border-select select-range" @change="filterTimeFrame($event)">
        <option></option>
        <option value="7">Week</option>
        <option value="14">2 Weeks</option>
        <option value="30">Month</option>
        <option value="90">Quarter</option>
        <option value="365">Year</option>
      </select>
    </!--div-->
    <p>Number of occurrences: {{ timeFrameCount }}</p>
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
  props: ["meds","timeFrame","chartLabels","chartIntervals"],
  async mounted() {
    //Xthis.$emit('filterTimeFrame', '10');
    console.log("Prop timeFrame: ", this.timeFrame)
    this.filterTimeFrame(this.timeFrame)
    this.data.labels  = this.chartLabels
    this.data.datasets.data = this.chartIntervals
  },
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
        ticks: {
          min: 0,
          stepSize: 5,
        }
      },
      timeFrames: ["Week", "Month", "Quarter","YTD"],
      timeFrameCount: "All",
      renderComponent: true,
    }
  },
  methods: {
    async filterTimeFrame(value) {
      this.renderComponent = false
      await this.$nextTick();
      this.timeFrameCount = 0
      this.data.labels = []
      this.data.datasets.data = []
      let compareDate = new Date()
      if (!value.target) {
        // Default set to 30 days in mounted()
        compareDate.toISOString(compareDate.setDate(compareDate.getDate()-value)).slice(0, 10)
      } else {
        compareDate.toISOString(compareDate.setDate(compareDate.getDate()-value.target.value)).slice(0, 10)
      }
      for (let i=0; i < this.meds.length; i++) {
        if (DateFormatService.formatFullYearFirstjs(this.meds[i].date_of_occurrence) > 
            DateFormatService.formatFullYearFirstjs(compareDate))
          {
            this.data.labels[i] = DateFormatService.formatStandardDatejs(this.meds[i].date_of_occurrence)
            this.data.datasets.data[i] = this.meds[i].interval_days
            this.timeFrameCount += 1
          }
        }
        this.renderComponent = true;
      }
    },  
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
}
</script>