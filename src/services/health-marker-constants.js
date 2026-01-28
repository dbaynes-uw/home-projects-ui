// ✅ COMPREHENSIVE HEALTH MARKERS
export const HEALTH_MARKERS = [
  {
    name: 'Hemoglobin A1c',
    label: 'Hemoglobin A1c',
    unit: '%',
    normalRange: '< 5.7%',
    prediabetesRange: '5.7% - 6.4%',
    diabetesRange: '≥ 6.5%',
    description: 'Average blood sugar over 2-3 months',
    testFrequency: 'Every 3-6 months',
    category: 'Diabetes',
    icon: 'mdi-water-percent'
  },
  {
    name: 'Fasting_Glucose',
    label: 'Fasting Glucose',
    unit: 'mg/dL',
    normalRange: '70-99 mg/dL',
    prediabetesRange: '100-125 mg/dL',
    diabetesRange: '≥ 126 mg/dL',
    description: 'Blood sugar after fasting',
    testFrequency: 'Every 3 years',
    category: 'Diabetes',
    icon: 'mdi-glucose'
  },
  {
    name: 'TSH',
    label: 'Thyroid Stimulating Hormone',
    unit: 'mIU/L',
    normalRange: '0.4 - 4.0 mIU/L',
    lowRange: '< 0.4 mIU/L (Hyperthyroid)',
    highRange: '> 4.0 mIU/L (Hypothyroid)',
    description: 'Thyroid function indicator',
    testFrequency: 'Annually or as needed',
    category: 'Thyroid',
    icon: 'mdi-thyroid'
  },
  {
    name: 'Total_Cholesterol',
    label: 'Total Cholesterol',
    unit: 'mg/dL',
    normalRange: '< 200 mg/dL',
    borderlineRange: '200-239 mg/dL',
    highRange: '≥ 240 mg/dL',
    description: 'Total cholesterol in blood',
    testFrequency: 'Every 4-6 years',
    category: 'Lipids',
    icon: 'mdi-heart-pulse'
  },
  {
    name: 'HDL',
    label: 'HDL Cholesterol',
    unit: 'mg/dL',
    normalRange: '≥ 40 mg/dL (men), ≥ 50 mg/dL (women)',
    lowRange: '< 40 mg/dL (men), < 50 mg/dL (women)',
    description: 'Good cholesterol',
    testFrequency: 'Every 4-6 years',
    category: 'Lipids',
    icon: 'mdi-arrow-up-circle'
  },
  {
    name: 'LDL',
    label: 'LDL Cholesterol',
    unit: 'mg/dL',
    normalRange: '< 100 mg/dL',
    borderlineRange: '100-159 mg/dL',
    highRange: '≥ 160 mg/dL',
    description: 'Bad cholesterol',
    testFrequency: 'Every 4-6 years',
    category: 'Lipids',
    icon: 'mdi-arrow-down-circle'
  },

  {
    name: 'Triglycerides',
    label: 'Triglycerides',
    unit: 'mg/dL',
    normalRange: '< 150 mg/dL',
    borderlineRange: '150-199 mg/dL',
    highRange: '≥ 200 mg/dL',
    description: 'Blood fat levels',
    testFrequency: 'Every 4-6 years',
    category: 'Lipids',
    icon: 'mdi-water'
  },
  {
    name: 'Cholesterol_Hdl_Ratio',
    label: 'Chol/HDL Ratio',
    unit: '',
    normalRange: '< 6.7',
    borderlineRange: '?',
    highRange: '?',
    description: 'A measure that compares the levels of total cholesterol and high-density lipoprotein (HDL) cholesterol in the blood',
    testFrequency: '?',
    category: 'Lipids',
    icon: 'mdi-water'
  },
  {
    name: 'Non_Cholesterol_Hdl_Calculation',
    label: 'Non-HDL Calculation',
    unit: '',
    normalRange: '',
    borderlineRange: '?',
    highRange: '?',
    description: '?',
    testFrequency: '?',
    category: 'Lipids',
    icon: 'mdi-water'
  },
  {
    name: 'PSA Serum',
    label: 'PSA Serum',
    unit: 'ng/ml',
    normalRange: '< 4.0 ng/ml',
    borderlineRange: '4.0- 6.0 ng/ml',
    highRange: '> 6.0 ng/ml',
    description: 'The PSA blood test can be used to look for prostate cancer',
    testFrequency: 'Annually',
    category: 'Prostate',
    icon: 'mdi-water'
  },
    {
    name: 'Triglyceride_Cholesterol_Hdl_Calculation',
    label: 'Trig/HDL Calculation',
    unit: '',
    normalRange: '< 6.7',
    borderlineRange: '?',
    highRange: '?',
    description: 'A measure that compares the levels of total cholesterol and high-density lipoprotein (HDL) cholesterol in the blood',
    testFrequency: '?',
    category: 'Lipids',
    icon: 'mdi-water'
  },
  /*
  {
    name: 'Vitamin_D',
    label: 'Vitamin D',
    unit: 'ng/mL',
    normalRange: '30-100 ng/mL',
    insufficientRange: '20-29 ng/mL',
    deficientRange: '< 20 ng/mL',
    description: 'Vitamin D level',
    testFrequency: 'Annually',
    category: 'Vitamins',
    icon: 'mdi-white-balance-sunny'
  },
  {
    name: 'B12',
    label: 'Vitamin B12',
    unit: 'pg/mL',
    normalRange: '300-900 pg/mL',
    lowRange: '< 300 pg/mL',
    description: 'Vitamin B12 level',
    testFrequency: 'As needed',
    category: 'Vitamins',
    icon: 'mdi-pill'
  },
  */
  {
    name: 'Blood_Pressure_Systolic',
    label: 'Blood Pressure (Systolic)',
    unit: 'mmHg',
    normalRange: '< 120 mmHg',
    elevatedRange: '120-129 mmHg',
    stage1Range: '130-139 mmHg',
    stage2Range: '≥ 140 mmHg',
    description: 'Systolic blood pressure',
    testFrequency: 'Every visit',
    category: 'Heart',
    icon: 'mdi-heart'
  },

  /*
  {
    name: 'Blood_Pressure_Diastolic',
    label: 'Blood Pressure (Diastolic)',
    unit: 'mmHg',
    normalRange: '< 80 mmHg',
    stage1Range: '80-89 mmHg',
    stage2Range: '≥ 90 mmHg',
    description: 'Diastolic blood pressure',
    testFrequency: 'Every visit',
    category: 'Heart',
    icon: 'mdi-heart-outline'
  },

  {
    name: 'Creatinine',
    label: 'Creatinine',
    unit: 'mg/dL',
    normalRange: '0.6-1.2 mg/dL',
    description: 'Kidney function indicator',
    testFrequency: 'Annually',
    category: 'Kidney',
    icon: 'mdi-kidney'
  },
  {
    name: 'ALT',
    label: 'ALT (Alanine Aminotransferase)',
    unit: 'U/L',
    normalRange: '7-45 U/L',
    description: 'Liver enzyme',
    testFrequency: 'As needed',
    category: 'Liver',
    icon: 'mdi-liver'
  }
  */
];

// ✅ HEALTH MARKER CATEGORIES
export const HEALTH_MARKER_CATEGORIES = [
  'Diabetes',
  'Prostate',
  'Thyroid', 
  'Lipids',
  'Vitamins',
  'Heart',
  'Liver',
  'Kidney',
  'Other'
];

// ✅ HELPER FUNCTIONS
export const getHealthMarkerByName = (name) => {
  return HEALTH_MARKERS.find(marker => marker.name === name);
};

export const getHealthMarkersByCategory = (category) => {
  return HEALTH_MARKERS.filter(marker => marker.category === category);
};

export const getHealthMarkerOptions = () => {
  return HEALTH_MARKERS.map(marker => ({
    title: marker.label,
    value: marker.name,
    subtitle: `${marker.category} • ${marker.unit}`,
    icon: marker.icon
  }));
};

export const getHealthMarkerCategoryOptions = () => {
  return HEALTH_MARKER_CATEGORIES.map(category => ({
    title: category,
    value: category,
    subtitle: `${getHealthMarkersByCategory(category).length} markers`
  }));
};

// ✅ INTELLIGENT RESULT STATUS ANALYSIS
export const getResultStatus = (markerName, testResult) => {
  const marker = getHealthMarkerByName(markerName);
  if (!marker || !testResult) return null;
  
  const result = parseFloat(testResult);
  
  // ✅ A1C LOGIC
  console.log('Analyzing result for', markerName, 'with value', result);
  if (markerName === 'Hemoglobin A1c') {
    if (result < 5.7) {
      return { 
        type: 'success', 
        title: 'Normal', 
        range: marker.normalRange,
        message: 'A1c is in normal range' 
      };
    }
    if (result <= 6.4) return { 
      type: 'warning', 
      title: 'Prediabetes', 
      range: marker.prediabetesRange,
      message: 'A1c indicates prediabetes range' 
    };
    return { 
      type: 'error', 
      title: 'Diabetes', 
      range: marker.diabetesRange,
      message: 'A1c indicates diabetes range' 
    };
  }
    // ✅ PSA PROSTATE LOGIC
  if (markerName === 'PSA Serum') {
    if (marker.id == 4) {
      console.log('PSA Serum result analysis for value:', result);
    }
    if (result < 4.0) return { 
      type: 'success', 
      title: 'Normal', 
      range: marker.normalRange,
      message: 'PSA is normal' 
    };
    if (result <= 6.0) {
        return { 
        type: 'warning', 
        title: 'Borderline', 
        range: marker.normalRange,
        message: 'PSA is Borderline' 
      }
    };
    return { 
      type: 'error', 
      title: 'High', 
      range: marker.highRange,
      message: 'PSA is high' 
    };
  }
  // ✅ CHOLESTEROL LOGIC
  if (markerName === 'Total_Cholesterol') {
    if (result < 200) return { 
      type: 'success', 
      title: 'Normal', 
      range: marker.normalRange,
      message: 'Total cholesterol is normal' 
    };
    if (result <= 239) return { 
      type: 'warning', 
      title: 'Borderline', 
      range: marker.borderlineRange,
      message: 'Total cholesterol is Borderline high' 
    };
    return { 
      type: 'error', 
      title: 'High', 
      range: marker.highRange,
      message: 'Total cholesterol is high' 
    };
  }
  
  if (markerName === 'LDL') {
    if (result < 100) return { type: 'success', title: 'Normal', range: marker.normalRange };
    if (result <= 159) return { type: 'warning', title: 'Borderline', range: marker.borderlineRange };
    return { type: 'error', title: 'High', range: marker.highRange };
  }
  
  if (markerName === 'HDL') {
    if (result >= 40) return { type: 'success', title: 'Normal', range: marker.normalRange };
    return { type: 'warning', title: 'Low', range: marker.lowRange };
  }
  
  // ✅ FASTING GLUCOSE LOGIC
  if (markerName === 'Fasting_Glucose') {
    if (result >= 70 && result <= 99) return { 
      type: 'success', 
      title: 'Normal', 
      range: marker.normalRange 
    };
    if (result <= 125) return { 
      type: 'warning', 
      title: 'Prediabetes', 
      range: marker.prediabetesRange 
    };
    return { 
      type: 'error', 
      title: 'Diabetes', 
      range: marker.diabetesRange 
    };
  }
  
  // ✅ VITAMIN D LOGIC
  if (markerName === 'Vitamin_D') {
    if (result >= 30) return { type: 'success', title: 'Normal', range: marker.normalRange };
    if (result >= 20) return { type: 'warning', title: 'Insufficient', range: marker.insufficientRange };
    return { type: 'error', title: 'Deficient', range: marker.deficientRange };
  }
  
  // ✅ BLOOD PRESSURE LOGIC
  if (markerName === 'Blood_Pressure_Systolic') {
    if (result < 120) return { type: 'success', title: 'Normal', range: marker.normalRange };
    if (result <= 129) return { type: 'info', title: 'Elevated', range: marker.elevatedRange };
    if (result <= 139) return { type: 'warning', title: 'Stage 1 Hypertension', range: marker.stage1Range };
    return { type: 'error', title: 'Stage 2 Hypertension', range: marker.stage2Range };
  }
  
  if (markerName === 'Blood_Pressure_Diastolic') {
    if (result < 80) return { type: 'success', title: 'Normal', range: marker.normalRange };
    if (result <= 89) return { type: 'warning', title: 'Stage 1 Hypertension', range: marker.stage1Range };
    return { type: 'error', title: 'Stage 2 Hypertension', range: marker.stage2Range };
  }
  console.log('No specific logic for marker:', markerName);
  // ✅ DEFAULT FOR OTHER MARKERS
  return { 
    type: 'info', 
    title: 'Result Recorded', 
    range: `${result} ${marker.unit}`,
    message: `${marker.label}: ${result} ${marker.unit}` 
  };
};

// ✅ CATEGORY COLORS FOR UI
export const getCategoryColor = (category) => {
  const colorMap = {
    'Diabetes': 'red',
    'Prostate': 'green',
    'Thyroid': 'purple',
    'Lipids': 'blue',
    'Vitamins': 'orange',
    'Heart': 'pink',
    'Liver': 'brown',
    'Kidney': 'teal',
    'Other': 'grey'
  };
  return colorMap[category] || 'grey';
};

// ✅ QUICK STATS HELPERS
export const getMarkerCountByCategory = () => {
  return HEALTH_MARKER_CATEGORIES.reduce((acc, category) => {
    acc[category] = getHealthMarkersByCategory(category).length;
    return acc;
  }, {});
};

export const getTotalMarkerCount = () => {
  return HEALTH_MARKERS.length;
};