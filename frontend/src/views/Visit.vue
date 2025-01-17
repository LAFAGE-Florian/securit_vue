<template>
  
  <form @submit.prevent= "CreateVisit">
    <div class="pa-4 text-center">
        <v-dialog
          v-model="dialog"
          max-width="900"
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              class="text-none font-weight-regular"
              prepend-icon="mdi-account"
              text="+ Créer une visite"
              variant="tonal"
              v-bind="activatorProps"
            ></v-btn>
          </template>
    
          <v-card
            prepend-icon="mdi-account"
            title="Nouvelle visite"
          >
            <v-card-text>
              <v-row dense>
                <v-col
                  cols="12"
                  md="4"
                  sm="6"
                >
                  <v-text-field
                    v-model="formData.date"  
                    label="Date*"
                    required
                    placeholder="JJ/MM/AAAA"
                    :mask= mask
                  ></v-text-field>
                </v-col>
    
                <v-col
                  cols="12"
                  md="4"
                  sm="6"
                >
                  <v-text-field
                    v-model="formData.companyName"
                    label="Nom de l'entreprise*"
                    required
                  ></v-text-field>
                </v-col>
    
                <v-col
                  cols="12"
                  md="4"
                  sm="6"
                >
                  <v-text-field
                    v-model="formData.report"
                    label="Rapport*"
                    persistent-hint
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
    
              <small class="text-caption text-medium-emphasis">*indicates required field</small>
            </v-card-text>
    
            <v-divider></v-divider>
    
            <v-card-actions>
              <v-spacer></v-spacer>
    
              <v-btn
                text="Close"
                variant="plain"
                @click="dialog = false"
              ></v-btn>
    
              <v-btn
                color="primary"
                text="Save"
                variant="tonal"
                @click="dialog = false"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      
      <table class="table table-striped align-middle">
      <thead>
        <tr>
          <th scope="col">Visite</th>
          <th scope="col">Entreprise</th>
          <th scope="col">Rapport</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="visit in visitsList" :key="visit.id">
          <td>{{ new Date(visit.date).toLocaleDateString() }}</td>
          <td>{{ visit.company.name }}</td>
          <td>{{ visit.report }}</td>
        </tr>
      </tbody>
    </table>
      <p>{{ errorMessage }}</p>
  </form>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { visits } from '../use/useVisits';

const errorMessage = ref("");
const visitsList = ref([]);
const formData = ref({}); 
const mask = '##/##/####';
const dialog = ref(false);

onMounted( async () => {
  const response = await fetch("/api/visit")
  visitsList.value = await response.json()
  for (const visit of visitsList.value) {
    visits.value[visit.id] = visit
  }})

async function CreateVisit () {
    const response = await fetch('/api/create_visit', {
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify(formData.value),
   })

    if (response.status ===400) {
      errorMessage.value = 'Tout les champs doivent être remplis'
    } else {
      router.push('visit')
    }
   }

</script>
