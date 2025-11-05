<template>
  <div>
    <h3 :id="headingId">{{ label }}</h3>
    <h3 id="h3-left-subheading-green">
      * AM-Fasting Normal{{ periodLabel ? ` (${periodLabel})` : '' }}: {{ amFastingNormal }}
    </h3>
    <h3 id="h3-left-subheading-blue">
      * AM-Fasting Prediabetes{{ periodLabel ? ` (${periodLabel})` : '' }}: {{ amFastingPrediabetes }}
    </h3>
    <h3 id="h3-left-subheading-red">
      * AM-Fasting Diabetes{{ periodLabel ? ` (${periodLabel})` : '' }}: {{ amFastingDiabetes }}
    </h3>
    <br />
    <h3 id="h3-left-subheading-green">
      * Post-Meal Normal{{ periodLabel ? ` (${periodLabel})` : '' }}: {{ postMealNormal }}
    </h3>
    <h3 id="h3-left-subheading-blue">
      * Post-Meal Prediabetes{{ periodLabel ? ` (${periodLabel})` : '' }}: {{ postMealPrediabetes }}
    </h3>
    <h3 id="h3-left-subheading-red">
      * Post-Meal Diabetes{{ periodLabel ? ` (${periodLabel})` : '' }}: {{ postMealDiabetes }}
    </h3>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, default: "Counts:" },
  periodLabel: { type: String, default: "" },
  headingId: { type: String, default: "h3-left-subheading" },
  amFastingNormal: { type: [Number, String], required: true },
  amFastingPrediabetes: { type: [Number, String], required: true },
  amFastingDiabetes: { type: [Number, String], required: true },
  postMealNormal: { type: [Number, String], required: true },
  postMealPrediabetes: { type: [Number, String], required: true },
  postMealDiabetes: { type: [Number, String], required: true },
});
</script>