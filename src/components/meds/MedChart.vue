<template>
  <div class="med-chart">
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
  props: ["meds"],
  data() {
    return {
      data: {
        labels: [],
        datasets: [{
          label: 'Occurrences by Intervals',
          backgroundColor: 'red',
          data: []
        }],
        chartData: [],
      },
      options: {
        responsive: true,
      }
    }
  },
  async mounted() {
    for (let i=0; i < this.meds.length; i++) {
      this.data.labels[i] = DateFormatService.formatStandardDate(this.meds[i].date_of_occurrence)
      this.data.datasets[0].data[i] = this.meds[i].interval
    }
  },
  methods: {
    formatStandardDate(value) {
      return DateFormatService.formatStandardDate(value);
    },
  },
}
</script>