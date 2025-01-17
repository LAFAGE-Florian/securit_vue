<template>
    <link rel="stylesheet" href="/src/assets/css/style.css"> 
    <div class="login-container">
        <form @submit.prevent= "VerifyCode">
    
            <img src="/images/logo.png"/>
            <h2>VERIFICATION DU MAIL</h2>
        
            <div class="input-container">
                <span class="icon">🔒</span>
                <input type="code" id="code" maxlength="4" name="code" v-model="formData.code" placeholder="****" required>
                <button class="large-button" type="submit">Envoyer</button>
            </div>
        <p class="error"> {{ errorMessage }} </p>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue"
import router from "../router"
import { host } from '../use/useHost'

const errorMessage = ref("");
const formData = ref({});

async function VerifyCode () {
    formData.value.email = host.value
   const response = await fetch('/auth/verify_code', {
      method: 'POST',
      headers: {'Content-type': 'application/json' },
      body: JSON.stringify(formData.value),
   })
   if (response.status === 200) {
      router.push('visit')
   } else {
        if (response.status === 403) {
            errorMessage.value = 'Délai dépassé'
        } else {
            errorMessage.value = 'Le code est incorrect !'
        }
      
   }}


</script>