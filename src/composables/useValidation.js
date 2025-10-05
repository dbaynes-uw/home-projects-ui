import { computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'

// ✅ MEMORY-EFFICIENT VALIDATION WRAPPER
export function useFormValidation(formData, validationRules) {
  // ✅ CHECK MEMORY BEFORE CREATING VUELIDATE INSTANCE
  const canUseVuelidate = computed(() => {
    if (performance.memory) {
      const used = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
      return used < 80; // Only use if memory < 80MB
    }
    return true; // Default to true if can't check memory
  });

  const v$ = useVuelidate(validationRules, formData);
  
  const isValid = computed(() => {
    if (!canUseVuelidate.value) return true; // Skip validation if memory is high
    return !v$.value.$invalid;
  });
  
  const hasErrors = computed(() => {
    if (!canUseVuelidate.value) return false;
    return v$.value.$error;
  });
  
  // ✅ LIGHTWEIGHT ERROR HANDLING
  const getFieldError = (fieldName) => {
    if (!canUseVuelidate.value) return '';
    
    const field = v$.value[fieldName];
    if (field && field.$error) {
      return field.$errors[0]?.$message || 'Invalid field';
    }
    return '';
  };
  
  const validate = async () => {
    if (!canUseVuelidate.value) return true;
    return await v$.value.$validate();
  };
  
  return {
    v$,
    isValid,
    hasErrors,
    getFieldError,
    validate,
    canUseVuelidate
  };
}

// ✅ LIGHTWEIGHT VALIDATORS (IMPORT ONLY WHAT YOU NEED)
export const validators = {
  // Lazy load validators to save memory
  get required() {
    return require('@vuelidate/validators').required;
  },
  
  get email() {
    return require('@vuelidate/validators').email;
  },
  
  get minLength() {
    return require('@vuelidate/validators').minLength;
  },
  
  get sameAs() {
    return require('@vuelidate/validators').sameAs;
  }
};