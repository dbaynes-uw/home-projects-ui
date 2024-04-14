<template>
  <div class="med-chart">
    <!--canvas id="medChart" width="400" height="400"></canvas-->
    <Bar :data="data" :options="options" />
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
      }
    }
  },
  async mounted() {
    this.data.labels  = this.chartLabels
    this.data.datasets.data = this.chartIntervals
  },
  methods: {
    formatStandardDate(value) {
      return DateFormatService.formatStandardDate(value);
    },
  },
}
</script>