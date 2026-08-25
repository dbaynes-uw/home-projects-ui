// ✅ COMPREHENSIVE HEALTH MARKERS
export const HEALTH_MARKERS = [
    {
    name: 'Albumin, s',
    label: 'Albumin',
    unit: 'g/dL',
    normalRange: '3.5 - 5.1 g/dL',
    lowRange: '< 3.5 g/dL',
    highRange: '≥ 5.1 g/dL',
    description: 'An albumin blood test measures the protein made by your liver, showing how well it is working and checking overall health, nutrition, kidney function (by detecting leakage into urine), and fluid balance, as low levels can signal liver disease, malnutrition, or kidney issues, while high levels might mean dehydration.',
    testFrequency: 'Annually or as needed',
    category: 'Liver/Kidney',
    icon: 'mdi-water-percent'
  },
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
    unit: 'uIU/mL',
    normalRange: '0.350 - 4.940 uIU/mL',
    lowRange: '< 0.350 uIU/mL (Hyperthyroid)',
    highRange: '> 4.940 uIU/mL (Hypothyroid)',
    description: 'Thyroid function indicator',
    testFrequency: 'Annually or as needed',
    category: 'Thyroid',
    icon: 'mdi-thyroid'
  },
  // ✅ LIPID PANEL MARKERS (7)
  {
    name: 'Cholesterol',
    label: 'Cholesterol',
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
    name: 'Triglyceride',
    label: 'Triglyceride',
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
    name: 'HDL Cholesterol',
    label: 'HDL Cholesterol',
    unit: 'mg/dL',
    normalRange: '40 - 60 mg/dL',
    lowRange: '< 40 mg/dL',
    description: 'Good cholesterol',
    testFrequency: 'Every 4-6 years',
    category: 'Lipids',
    icon: 'mdi-arrow-up-circle'
  },
  {
    name: 'LDL Cholesterol',
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
    name: 'Chol/HDL Ratio',
    label: 'Chol/HDL Ratio',
    unit: '',
    normalRange: '< 6.7',
    borderlineRange: '6.7-7.9',
    highRange: '> 7.9',
    description: 'A measure that compares the levels of total cholesterol and high-density lipoprotein (HDL) cholesterol in the blood',
    testFrequency: '?',
    category: 'Lipids',
    icon: 'mdi-water'
  },
  {
    name: 'Non-HDL (calc)',
    label: 'Non-HDL (calc)',
    unit: '',
    normalRange: '< 200',
    borderlineRange: '?',
    highRange: '?',
    description: '?',
    testFrequency: '?',
    category: 'Lipids',
    icon: 'mdi-water'
  },
  {
    name: 'Trig-HDL (calc)',
    label: 'Triglyceride HDL Calculation',
    unit: '',
    normalRange: '< 2.0',
    borderlineRange: '?',
    highRange: '?',
    description: '?',
    testFrequency: '?',
    category: 'Lipids',
    icon: 'mdi-water'
  },
  // PSA Serum (Prostate-Specific Antigen) is a blood test used to screen for prostate cancer and other prostate conditions. It measures the level of PSA, a protein produced by the prostate gland, in the blood. Elevated PSA levels can indicate prostate cancer, benign prostatic hyperplasia (BPH), or inflammation of the prostate (prostatitis). However, PSA levels can also be influenced
  {
    name: 'PSA,Serum',
    label: 'PSA,Serum',
    unit: 'ng/ml',
    normalRange: '< 4.0 ng/ml',
    borderlineRange: '4.0- 6.0 ng/ml',
    highRange: '> 6.0 ng/ml',
    description: 'The PSA blood test can be used to look for prostate cancer',
    testFrequency: 'Annually',
    category: 'Prostate',
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
    name: 'Blood Pressure',
    label: 'Blood Pressure',
    unit: 'mm Hg',
    normalRange: 'Less than 120 / 80 mm Hg',
    elevatedRange: '120-129 / less than 80 mm Hg',
    stage1Range: '130-139 / 80-89 mm Hg',
    stage2Range: '140 or higher / 90 or higher mm Hg',
    crisisRange: 'Higher than 180 / 120 mm Hg (seek care now)',
    description: 'Combined systolic/diastolic blood pressure reading',
    testFrequency: 'Every visit',
    category: 'Heart',
    icon: 'mdi-heart-pulse'
  },
  {
    name: 'Blood_Pressure_Systolic',
    label: 'Blood Pressure (Systolic)',
    unit: 'mm Hg',
    normalRange: '< 120 mm Hg',
    elevatedRange: '120-129 mm Hg',
    stage1Range: '130-139 mm Hg',
    stage2Range: '≥ 140 mm Hg',
    crisisRange: '> 180 mm Hg',
    description: 'Systolic blood pressure',
    testFrequency: 'Every visit',
    category: 'Heart',
    icon: 'mdi-heart'
  },


  {
    name: 'Blood_Pressure_Diastolic',
    label: 'Blood Pressure (Diastolic)',
    unit: 'mm Hg',
    normalRange: '< 80 mm Hg',
    stage1Range: '80-89 mm Hg',
    stage2Range: '≥ 90 mm Hg',
    crisisRange: '> 120 mm Hg',
    description: 'Diastolic blood pressure',
    testFrequency: 'Every visit',
    category: 'Heart',
    icon: 'mdi-heart-outline'
  },


  {
    name: 'Creatinine',
    label: 'Creatinine',
    unit: 'mg/dL',
    normalRange: '0.72-1.25 mg/dL',
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
  if (!name) return undefined;

  const normalized = String(name).trim();
  if (!normalized) return undefined;

  const normalizeLookupText = (value) => {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const direct = HEALTH_MARKERS.find(marker => marker.name === normalized || marker.label === normalized);
  if (direct) return direct;

  const aliases = {
    'Blood Pressure (Systolic)': 'Blood_Pressure_Systolic',
    'Blood Pressure (Diastolic)': 'Blood_Pressure_Diastolic',
    'Blood_Pressure_Systolic': 'Blood_Pressure_Systolic',
    'Blood_Pressure_Diastolic': 'Blood_Pressure_Diastolic',
    'Blood Pressure': 'Blood Pressure'
  };

  const aliasMatch = aliases[normalized];
  if (aliasMatch) {
    return HEALTH_MARKERS.find(marker => marker.name === aliasMatch || marker.label === aliasMatch);
  }

  const normalizedLookup = normalizeLookupText(normalized);
  return HEALTH_MARKERS.find((marker) => {
    const matchText = normalizeLookupText(`${marker.name} ${marker.label}`);
    return matchText.includes(normalizedLookup);
  });
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
// Can accept either markerName (string) or markerDefinition (object)
export const getResultStatus = (markerNameOrDef, testResult) => {
  // Handle both string (legacy) and object (new database definitions)
  let marker = typeof markerNameOrDef === 'string'
    ? getHealthMarkerByName(markerNameOrDef)
    : markerNameOrDef;

  if (!marker && typeof markerNameOrDef === 'string') {
    const name = String(markerNameOrDef).trim();
    if (/blood\s*[_ ]?pressure/i.test(name)) {
      marker = {
        name,
        label: name,
        unit: 'mm Hg',
        normalRange: 'Less than 120 / 80 mm Hg',
        elevatedRange: '120-129 / less than 80 mm Hg',
        stage1Range: '130-139 / 80-89 mm Hg',
        stage2Range: '140 or higher / 90 or higher mm Hg',
        crisisRange: 'Higher than 180 / 120 mm Hg (seek care now)'
      };
    }
  }

  if (!marker || !testResult) return null;

  const markerName = marker.name || '';
  const markerLabel = marker.label || '';
  const markerText = `${markerName} ${markerLabel}`.toLowerCase();
  const result = parseFloat(testResult);
  
  // ✅ Albumin, s LOGIC
  if (markerName.includes('Albumin')) {
    if (result < 5.1) {
      return { 
        type: 'success', 
        title: 'Normal', 
        range: marker.normalRange,
        message: 'Albumin is in normal range' 
      };
    }
    if (result <= 5.1) return { 
      type: 'warning', 
      title: 'Liver/Kidney Concern', 
      range: marker.lowRange,
      message: 'Albumin indicates potential liver or kidney concern' 
    };
    return { 
      type: 'error', 
      title: 'Liver/Kidney Concern', 
      range: marker.highRange,
      message: 'Albumin indicates potential liver or kidney concern' 
    };
  }  
  // ✅ A1C LOGIC
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
  if (markerName === 'PSA,Serum') {
    if (result < 4.0) {
      return { 
      type: 'success', 
      title: 'Normal', 
      range: marker.normalRange,
      message: 'PSA is normal' 
      }
    };
    if (result <= 6.0) {
        return { 
        type: 'warning', 
        title: 'Borderline High', 
        range: marker.normalRange,
        message: 'PSA is Borderline High' 
      }
    };
    return { 
      type: 'error', 
      title: 'High', 
      range: marker.highRange,
      message: 'PSA is high' 
    };
  }
  // LIPID PANEL LOGIC
  // ✅ CHOLESTEROL LOGIC
  if (markerName === 'Cholesterol') {
    if (result < 200) return { 
      type: 'success', 
      title: 'Normal', 
      range: marker.normalRange,
      message: 'Cholesterol is normal' 
    };
    if (result <= 239) return { 
      type: 'warning', 
      title: 'Borderline High', 
      range: marker.borderlineRange,
      message: 'Cholesterol is Borderline high' 
    };
    return { 
      type: 'error', 
      title: 'High', 
      range: marker.highRange,
      message: 'Cholesterol is high' 
    };
  }
  
  if (markerName === 'LDL') {
    if (result < 100) return { type: 'success', title: 'Normal', range: marker.normalRange };
    if (result <= 159) return { type: 'warning', title: 'Borderline High', range: marker.borderlineRange };
    return { type: 'error', title: 'High', range: marker.highRange };
  }
  
  /*if (markerName === 'HDL Cholesterol') {
    if (result >= 40 && result <= 60) return {
      type: 'success',
      title: 'Normal',
      range: marker.normalRange };
    if (result < 40 ) return {
      type: 'critical',
      title: 'Low - Risk of Heart Disease', 
      range: marker.lowRange };
    if (result > 60 ) return {
      type: 'critical',
      title: 'High - Risk of Heart Disease', 
      range: marker.borderlineHigh
    };
  }*/
    // ✅ Chol/HDL Ratio LOGIC
  if (markerName === 'Chol/HDL Ratio') {
    if (result < 6.7) return { 
      type: 'success', 
      title: 'Normal', 
      range: marker.normalRange,
      message: 'Chol/HDL Ratio is normal'
    };
    if (result > 6.7) return { 
      type: 'warning', 
      title: 'Borderline High', 
      range: marker.borderlineRange,
      message: 'Chol/HDL Ratio is Borderline high' 
    };
    return { 
      type: 'error', 
      title: 'High', 
      range: marker.highRange,
      message: 'Cholesterol is high' 
    };
  }

    // ✅ Non-HDL (calc) LOGIC
  if (markerName === 'Non-HDL (calc)') {
    if (result < 130) return { 
      type: 'success', 
      title: 'Normal', 
      range: marker.normalRange,
      message: 'Non-HDL (calc) is normal'
    };
    if (result >= 130) return { 
      type: 'error', 
      title: 'High', 
      range: marker.highRange,
      message: 'Non-HDL (calc) is high'     };
  }

  // ✅ Triglyceride LOGIC
  if (markerName === 'Triglyceride') {
    if (result < 150) return { 
      type: 'success', 
      title: 'Normal', 
      range: marker.normalRange,
      message: 'Triglycerides level is normal' 
    };
    if (result <= 170) return { 
      type: 'warning', 
      title: 'Borderline High', 
      range: marker.borderlineRange,
      message: 'Triglycerides level is Borderline high' 
    };
    return { 
      type: 'critical', 
      title: 'High', 
      range: marker.highRange,
      message: 'Triglycerides level is high' 
    };
  }
  // ✅ Triglycerides LOGIC
  if (markerName === 'Trig/HDL (calc)') {
    if (result < 2.0) return { 
      type: 'success', 
      title: 'Normal', 
      range: marker.normalRange,
      message: 'Triglycerides level is normal' 
    };
    if (result > 2.0) return { 
      type: 'critical', 
      title: 'High', 
      range: marker.highRange,
      message: 'Triglycerides level is high'  
    };
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
  // Systolic and Diastolic have different ranges, so we handle them separately
  // Normal: Less than 120 / 80 mm Hg
  // Elevated: 120–129 / less than 80 mm Hg
  // Stage 1 High: 130–139 / 80–89 mm Hg
  // Stage 2 High: 140 or higher / 90 or higher mm Hg
  // Crisis: Higher than 180 / 120 mm Hg (seek care now)
  const bpRanges = {
    normal: 'Less than 120 / 80 mm Hg',
    elevated: '120-129 / less than 80 mm Hg',
    stage1: '130-139 / 80-89 mm Hg',
    stage2: '140 or higher / 90 or higher mm Hg',
    crisis: 'Higher than 180 / 120 mm Hg (seek care now)'
  };

  const classifyBloodPressure = (systolic, diastolic) => {
    if (systolic > 180 || diastolic > 120) {
      return {
        type: 'error',
        title: 'Crisis',
        range: bpRanges.crisis,
        message: 'Higher than 180 / 120 mm Hg (seek care now)'
      };
    }
    if (systolic <= 120 && diastolic <= 80) {
      return { type: 'success', title: 'Normal', range: bpRanges.normal };
    }    
    if (systolic >= 140 || diastolic >= 90) {
      return { type: 'error', title: 'Stage 2 High', range: bpRanges.stage2 };
    }
    if ((systolic >= 120 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
      return { type: 'warning', title: 'Stage 1 High', range: bpRanges.stage1 };
    }
    if (systolic > 120 && systolic <= 129 && diastolic < 80) {
      return { type: 'info', title: 'Elevated', range: bpRanges.elevated };
    }
    return { type: 'success', title: 'Normal', range: bpRanges.normal };
  };

  const isSystolicMarker = markerName === 'Blood_Pressure_Systolic' || markerText.includes('systolic');
  const isDiastolicMarker = markerName === 'Blood_Pressure_Diastolic' || markerText.includes('diastolic');
  const isGenericBloodPressure = markerText.includes('blood pressure') && !isSystolicMarker && !isDiastolicMarker;

  if (isSystolicMarker) {
    if (result < 120) return { type: 'success', title: 'Normal', range: bpRanges.normal };
    if (result <= 129) return { type: 'info', title: 'Elevated', range: bpRanges.elevated };
    if (result <= 139) return { type: 'warning', title: 'Stage 1 High', range: bpRanges.stage1 };
    if (result <= 180) return { type: 'error', title: 'Stage 2 High', range: bpRanges.stage2 };
    return {
      type: 'error',
      title: 'Crisis',
      range: bpRanges.crisis,
      message: 'Higher than 180 / 120 mm Hg (seek care now)'
    };
  }
  
  if (isDiastolicMarker) {
    if (result < 80) return { type: 'success', title: 'Normal', range: bpRanges.normal };
    if (result <= 89) return { type: 'warning', title: 'Stage 1 High', range: bpRanges.stage1 };
    if (result <= 120) return { type: 'error', title: 'Stage 2 High', range: bpRanges.stage2 };
    return {
      type: 'error',
      title: 'Crisis',
      range: bpRanges.crisis,
      message: 'Higher than 180 / 120 mm Hg (seek care now)'
    };
  }

  if (isGenericBloodPressure) {
    const bpMatch = String(testResult).match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
    if (bpMatch) {
      const systolic = parseFloat(bpMatch[1]);
      const diastolic = parseFloat(bpMatch[2]);
      if (!isNaN(systolic) && !isNaN(diastolic)) {
        return classifyBloodPressure(systolic, diastolic);
      }
    }

    if (!isNaN(result)) {
      return classifyBloodPressure(result, 0);
    }

    return {
      type: 'info',
      title: 'Result Recorded',
      range: bpRanges.normal,
      message: 'Use format systolic/diastolic (e.g., 120/80). Optional pulse can be appended, e.g., 120/80 (68 bpm).'
    };
  }
  
  // ✅ GENERIC RANGE CHECKING FOR DATABASE MARKERS
  // Check if marker has numeric range values (from database)
  if (marker.normal_range_low !== undefined || marker.normal_range_high !== undefined) {
    const normalLow = parseFloat(marker.normal_range_low);
    const normalHigh = parseFloat(marker.normal_range_high);
    const borderlineLow = parseFloat(marker.borderline_range_low);
    const borderlineHigh = parseFloat(marker.borderline_range_high);
    
    // PRIORITY 1: Check normal range first
    if (!isNaN(normalLow) && !isNaN(normalHigh)) {
      if (result >= normalLow && result <= normalHigh) {
        return {
          type: 'success',
          title: 'Normal',
          range: `${normalLow} - ${normalHigh} ${marker.unit || ''}`,
          message: `${marker.label} is in normal range`
        };
      }
    }
    
    // PRIORITY 2: Check if we have borderline ranges for values outside normal
    if (!isNaN(borderlineLow) && !isNaN(borderlineHigh)) {
      // Check if result is in the borderline zone (outside normal but within borderline)
      if (result >= borderlineLow && result <= borderlineHigh) {
        // Only mark as borderline if it's actually outside the normal range
        const outsideNormal = (isNaN(normalLow) || result < normalLow || result > normalHigh);
        if (outsideNormal) {
          return {
            type: 'warning',
            title: 'Borderline',
            range: `${borderlineLow} - ${borderlineHigh} ${marker.unit || ''}`,
            message: `${marker.label} is in borderline range`
          };
        }
      }
      
      // Beyond borderline ranges
      if (result < borderlineLow) {
        return {
          type: 'error',
          title: 'Low',
          range: `< ${borderlineLow} ${marker.unit || ''}`,
          message: `${marker.label} is critically low`
        };
      }
      if (result > borderlineHigh) {
        return {
          type: 'error',
          title: 'High',
          range: `> ${borderlineHigh} ${marker.unit || ''}`,
          message: `${marker.label} is critically high`
        };
      }
    }
    
    // PRIORITY 3: No borderline defined, just check if outside normal
    if (!isNaN(normalLow) && !isNaN(normalHigh)) {
      if (result < normalLow) {
        return {
          type: 'warning',
          title: 'Low',
          range: `< ${normalLow} ${marker.unit || ''}`,
          message: `${marker.label} is below normal range`
        };
      }
      if (result > normalHigh) {
        return {
          type: 'warning',
          title: 'High',
          range: `> ${normalHigh} ${marker.unit || ''}`,
          message: `${marker.label} is above normal range`
        };
      }
    }
  }
  
  console.log('No specific logic for marker:', markerName);
  // ✅ DEFAULT FOR OTHER MARKERS (no ranges defined)
  return { 
    type: 'info', 
    title: 'Result Recorded', 
    range: `${result} ${marker.unit || ''}`,
    message: `${marker.label}: ${result} ${marker.unit || ''}` 
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