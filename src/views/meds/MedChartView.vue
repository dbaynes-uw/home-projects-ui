<template>
  <div class="med-chart">
    CHART DATA: {{ data.chartData }}
    <Bar :data="data" :options="options" />
  </div>
</template>
<script>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs';
import DateFormatService from "@/services/DateFormatService.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
export default {
  name: 'MedChartView',
  components: {Bar},
  //props: ["meds"],
  data() {
    return {
      data: {
        labels: [],
        datasets: [{
          label: '',
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
      this.data.labels[i] = DateFormatService.formatStandardDatejs(this.meds[i].date_of_occurrence)
      this.data.datasets[0].data[i] = this.meds[i].interval
    }
    this.data.chartData = {
      label: "HEY!",
      labels: this.data.labels,
      data: this.data.datasets[0].data
    }
    console.log("CHARTS DATA: ", this.data.datasets[0].data.length)
  },
  created() {
    this.$store.dispatch("fetchMeds");
    this.sortedData = this.meds;
  },
  computed: {
    meds() {
      return this.$store.state.meds;
    },
  },
  methods: {
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
}
</script>