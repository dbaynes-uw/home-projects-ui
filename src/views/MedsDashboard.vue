<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <!-- ✅ CHANGED: mdi-pill → fas fa-pills -->
      <h2><i class="fas fa-pills"></i> Meds Dashboard</h2>
    </v-card-title>
    
    <!-- ✅ MODERN NAVIGATION -->
     
    <div class="navigation-buttons">

      <router-link :to="{ name: 'HealthMarkerList' }" class="nav-btn" id="button-as-link">
        <!-- ✅ CHANGED: mdi-heart → fas fa-heartbeat -->
        <i class="fas fa-heartbeat"></i>
        <span>&nbsp;Health Markers</span>
      </router-link>
      
      <router-link :to="{ name: 'SleepMarkerList' }" class="nav-btn" id="button-as-link">
        <i class="fas fa-bed" aria-hidden="true"></i>
        <span>&nbsp;&nbsp;Sleep Markers</span>
      </router-link>

      <router-link :to="{ name: 'GlucoseReadings' }" class="nav-btn glucose-btn" id="button-as-link">
        <!-- ✅ CHANGED: mdi-heart → fas fa-heartbeat -->
        <i class="fa fa-heart" aria-hidden="true"></i>
        <span>&nbsp;Glucose</span>
      </router-link>

      <router-link :to="{ name: 'OobList' }" class="nav-btn glucose-btn" id="button-as-link">
        <!-- ✅ CHANGED: mdi-heart → fas fa-heartbeat -->
        <i class="fa fa-thumbs-down" aria-hidden="true"></i>
        <span>&nbsp;Oobs</span>
      </router-link>

    </div>
    </v-card>
</template>
<script></script>
<style scoped>
.navigation-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 1rem;
}
.fa-heartbeat {
  color: lightblue;
}
.fa-heart {
  color: red;
}
.fa-bed {
  color: lightgreen;
}
.fa-thumbs-down {
  color: yellow;
}
</style>