import { createRouter, createWebHistory } from 'vue-router'; // Importa funciones necesarias desde vue-router

import login from './components/LoginForm.vue';
import productoPage from './components/ProductoPage.vue';
import userPage from "@/components/UserPage.vue";


const router=createRouter({
    history:createWebHistory(),
    routes:[
        {
            path: '/', // Ruta principal (login)
            name: 'LoginForm',
            component:login // Componente de login
        },
        {
            path: '/productosPage', // Ruta para la página principal (App.vue)
            name: 'ProductoPage',
            component: productoPage// Componente de la página productos
        },
        {
            path: '/usuariosPage', // Ruta para la página Usuario
            name: 'UsuariosPage',
            component: userPage // Componente de la página usuarios
        }
    ]
});
export default router;



