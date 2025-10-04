<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/components/meds/MedChart.vue -->
<template>
  <div class="med-chart">
    <h3>Med Chart (Chart temporarily disabled for memory optimization)</h3>
    
    <!-- ✅ SIMPLE DATA DISPLAY INSTEAD OF CHART -->
    <div class="chart-replacement">
      <p><strong>Number of occurrences:</strong> {{ timeFrameCount }}</p>
      
      <div class="simple-stats">
        <div class="stat-item" v-for="(med, index) in filteredMeds" :key="index">
          <span class="date">{{ formatStandardDate(med.date_of_occurrence) }}</span>
          <span class="interval">{{ med.interval_days }} days</span>
        </div>
      </div>
      
      <!-- ✅ OPTIONAL: Simple bar representation -->
      <div class="simple-bars" v-if="filteredMeds.length > 0">
        <div 
          v-for="(med, index) in filteredMeds" 
          :key="index"
          class="bar-item"
        >
          <div class="bar-label">{{ formatStandardDate(med.date_of_occurrence) }}</div>
          <div class="bar-container">
            <div 
              class="bar-fill" 
              :style="{ width: (med.interval_days / maxInterval * 100) + '%' }"
            ></div>
          </div>
          <div class="bar-value">{{ med.interval_days }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DateFormatService from "@/services/DateFormatService.js";

export default {
  name: 'MedChart',
  props: ["meds", "timeFrame", "chartLabels", "chartIntervals"],
  
  data() {
    return {
      timeFrameCount: 0,
      filteredMeds: []
    }
  },
  
  computed: {
    maxInterval() {
      return Math.max(...this.filteredMeds.map(med => med.interval_days), 1)
    }
  },
  
  mounted() {
    this.filterTimeFrame(this.timeFrame || 30)
  },
  
  methods: {
    filterTimeFrame(value) {
      this.timeFrameCount = 0
      this.filteredMeds = []
      
      let compareDate = new Date()
      const days = value.target ? value.target.value : value
      compareDate.setDate(compareDate.getDate() - days)
      
      this.filteredMeds = this.meds.filter(med => {
        const medDate = new Date(med.date_of_occurrence)
        if (medDate > compareDate) {
          this.timeFrameCount++
          return true
        }
        return false
      })
    },
    
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    }
  }
}
</script>

<style scoped>
.med-chart {
  padding: 20px;
}

.simple-stats {
  margin: 20px 0;
  max-height: 300px;
  overflow-y: auto;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.simple-bars {
  margin-top: 20px;
}

.bar-item {
  display: flex;
  align-items: center;
  margin: 8px 0;
  gap: 10px;
}

.bar-label {
  width: 100px;
  font-size: 12px;
}

.bar-container {
  flex: 1;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background-color: #ff6b6b;
  transition: width 0.3s ease;
}

.bar-value {
  width: 40px;
  text-align: right;
  font-weight: bold;
}
</style>