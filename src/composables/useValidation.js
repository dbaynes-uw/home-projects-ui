import { computed, reactive } from 'vue'

// ✅ SIMPLE VALIDATION WITHOUT VUELIDATE
export function useFormValidation(formData, validationRules) {
  const errors = reactive({})
  
  const validateField = (fieldName, value) => {
    const rules = validationRules.value[fieldName]
    if (!rules) return ''
    
    // Check required
    if (rules.required && (!value || value.trim() === '')) {
      return 'This field is required'
    }
    
    // Check email
    if (rules.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address'
      }
    }
    
    // Check minLength
    if (rules.minLength && value) {
      const minLen = typeof rules.minLength === 'function' ? rules.minLength.min : rules.minLength
      if (value.length < minLen) {
        return `Minimum ${minLen} characters required`
      }
    }
    
    return ''
  }
  
  const v$ = reactive({})
  
  // Create reactive validation object
  Object.keys(validationRules.value).forEach(fieldName => {
    v$[fieldName] = reactive({
      $error: computed(() => !!errors[fieldName]),
      $errors: computed(() => errors[fieldName] ? [{ $message: errors[fieldName] }] : []),
      $touch: () => {
        const error = validateField(fieldName, formData[fieldName])
        if (error) {
          errors[fieldName] = error
        } else {
          delete errors[fieldName]
        }
      }
    })
  })
  
  const isValid = computed(() => {
    // Validate all fields
    Object.keys(formData).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName])
      if (error) {
        errors[fieldName] = error
      } else {
        delete errors[fieldName]
      }
    })
    
    return Object.keys(errors).length === 0
  })
  
  const getFieldError = (fieldName) => {
    return errors[fieldName] || ''
  }
  
  const validate = async () => {
    // Validate all fields
    Object.keys(formData).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName])
      if (error) {
        errors[fieldName] = error
      } else {
        delete errors[fieldName]
      }
    })
    
    return Object.keys(errors).length === 0
  }
  
  return {
    v$,
    isValid,
    getFieldError,
    validate,
    canUseVuelidate: computed(() => false) // Always false for fallback
  }
}

// ✅ SIMPLE VALIDATORS (NO VUELIDATE DEPENDENCY)
export const validators = {
  required: true,
  email: true,
  minLength: (min) => ({ min }),
  sameAs: (target) => ({ target })
}