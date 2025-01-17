<template>

   <link rel="stylesheet" href="/src/assets/css/style.css">
    <div class="login-container">
        <img class="image" src="/images/logo.png"/>
        <h2>Créer un compte</h2>
      <form @submit.prevent= "CreateAccount">
         <div class="form-group mb-2">
            <label for="email">Email</label>
            <div class="input-container">
               <span class="icon">@</span>
               <input type="email" id="email" name="email" v-model="formData.email" placeholder="Ex: abc@example.com" required>
            </div>
         </div>
         <div class="form-group mb-2">
            <label for="password">Mot de passe</label>
            <div class="input-container">
               <span class="icon">🔒</span>
               <input type="password" id="password" minlength="6" name="password" v-model="formData.password" placeholder="********" required>
            </div>
         </div>
         <div class="form-group mb-2">
            <label for="password2">Mot de passe (confirmer)</label>
            <div class="input-container">
               <span class="icon">🔒</span>
               <input type="password" id="password2" minlength="6" name="password2" v-model="formData.password2" placeholder="********" required>
            </div>
         </div>

         <p class="error"> {{ errorMessage }} </p>

         <div class="mb-2">
            <button type="submit" class="large-button">Créer</button>
         </div>
         <div class="connexion">
            <a href="/login">Connexion</a>
         </div>
      </form>
   </div>

</template>

<script setup>
import { ref } from "vue"
import router from "../router"
import { host } from '../use/useHost'
const errorMessage = ref("");
const formData = ref({});

async function CreateAccount () {
    host.value = formData.value.email
    const response = await fetch('/auth/create_account', {
      method: 'POST',
      headers: {'Content-type': 'application/json' },
      body: JSON.stringify(formData.value),
   }
      
   )
   if (response.status === 200) {
      router.push('login')
   } else {
        if (response.status ===400) {
            errorMessage.value = 'Utilisateur déjà existant'
        } else {
            errorMessage.value = 'Les deux mots de passe sont différents'
        }
      
   }}
</script>