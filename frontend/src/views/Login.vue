<template>

   <link rel="stylesheet" href="/src/assets/css/style.css">
   <div class="login-container">
      <img class="image" src="/images/logo.png"/>
      <form @submit.prevent= "CreateConnexion" class="login-form">
         <label for="email">Email</label>
         <div class="input-container">
            <span class="icon">@</span>
            <input type="email" id="email" name="email" v-model= "formData.email" placeholder="Ex: abc@example.com" required>
         </div>

         <label for="password">Password</label>
         <div class="input-container">
            <span class="icon">🔒</span>
            <input type="password" id="password" minlength="6" name="password" v-model="formData.password" placeholder="********" required>
         </div>

         <p class="error"> {{ errorMessage }} </p>

         <button type="submit" class="large-button"> Connexion </button>
         <div class="register">
            <a href="register">Créer un compte</a>
         </div>
      </form>
    </div>     

</template>

<script setup>

// gestion des erreurs
import { ref } from "vue"
import router from "../router"
import { host } from '../use/useHost'
const errorMessage = ref("");
const formData = ref({});

async function CreateConnexion () {
   host.value = formData.value.email
   const response = await fetch('/auth/create_connexion', {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify(formData.value),
   } 
   )
   if (response.status === 200) {
      router.push('verifycode')
   } else {
      errorMessage.value = 'Email ou mot de passe incorrect'
   }}
</script>
