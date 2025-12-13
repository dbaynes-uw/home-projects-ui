<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/components/oobs/OobChart.vue -->
<template>
  <div class="oob-chart">
    <h3>Oob Chart (Chart temporarily disabled for memory optimization)</h3>
    
    <!-- ✅ SIMPLE DATA DISPLAY INSTEAD OF CHART -->
    <div class="chart-replacement">
      <p><strong>Number of occurrences:</strong> {{ timeFrameCount }}</p>
      
      <div class="simple-stats">
        <div class="stat-item" v-for="(oob, index) in filteredOobs" :key="index">
          <span class="date">{{ formatStandardDate(oob.date_of_occurrence) }}</span>
          <span class="interval">{{ oob.interval_days }} days</span>
        </div>
      </div>
      
      <!-- ✅ OPTIONAL: Simple bar representation -->
      <div class="simple-bars" v-if="filteredOobs.length > 0">
        <div 
          v-for="(oob, index) in filteredOobs" 
          :key="index"
          class="bar-item"
        >
          <div class="bar-label">{{ formatStandardDate(oob.date_of_occurrence) }}</div>
          <div class="bar-container">
            <div 
              class="bar-fill" 
              :style="{ width: (oob.interval_days / maxInterval * 100) + '%' }"
            ></div>
          </div>
          <div class="bar-value">{{ oob.interval_days }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DateFormatService from "@/services/DateFormatService.js";

export default {
  name: 'OobChart',
  props: ["oobs", "timeFrame", "chartLabels", "chartIntervals"],
  
  data() {
    return {
      timeFrameCount: 0,
      filteredOobs: []
    }
  },
  
  computed: {
    maxInterval() {
      return Math.max(...this.filteredOobs.map(oob => oob.interval_days), 1)
    }
  },
  
  mounted() {
    this.filterTimeFrame(this.timeFrame || 30)
  },
  
  methods: {
    filterTimeFrame(value) {
      this.timeFrameCount = 0
      this.filteredOobs = []
      
      let compareDate = new Date()
      const days = value.target ? value.target.value : value
      compareDate.setDate(compareDate.getDate() - days)
      
      this.filteredOobs = this.oobs.filter(oob => {
        const oobDate = new Date(oob.date_of_occurrence)
        if (oobDate > compareDate) {
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
.oob-chart {
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