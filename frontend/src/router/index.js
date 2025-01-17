import { createRouter, createWebHistory } from 'vue-router'
// import InputBar from '/src/components/InputBar.vue'
import Login from '/src/views/Login.vue'
import VerifyCode from '/src/views/VerifyCode.vue'
import Register from '/src/views/Register.vue'
import Visit from '/src/views/Visit.vue'


const routes = [
    {
       path: '/',
       redirect: '/login',
    },
    {
       path: '/login',
       component: Login,
    },
    {
        path :'/VerifyCode',
        component: VerifyCode,
    },
    {
        path: '/Register',
        component: Register,
    },
    {
        path: '/Visit',
        component: Visit,
    },     
 ]
 
 const router = createRouter({
    history: createWebHistory('/'),
    routes
 })
 
 export default router