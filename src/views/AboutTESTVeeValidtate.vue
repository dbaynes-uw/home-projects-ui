<script setup>
import { useField, useForm} from 'vee-validate';
//import { extend } from 'vee-validate';
//import { required } from 'vee-validate/dist/rules'
//extend ('required', required)
import {ref} from 'vue';

const { handleSubmit } = useForm();
const { value: email, errorMessage: emailError } = useField('email','required | mail');
const onSubmit = handleSubmit((values) => console. log ('Submitted: ', values));
const successMessage = ref('')
</script>
<template>
<form @submit="onSubmit">
<input v-model="email" type="email" required />
<span>Success Message{{ successMessage }}</span>
<span>Email Error: {{ emailError }}</span>
<button type="submit">Submit</button>
</form>
</template>