import { createRouter, createWebHistory } from 'vue-router'; // Importa funciones necesarias desde vue-router
import videosMain from './components/VideosMainPage.vue'; // Importa componente VideosMain.vue
import login from './components/LoginForm.vue';
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
            path: '/usuariosPage', // Ruta para la página Usuario
            name: 'UsuariosPage',
            component: userPage // Componente de la página usuarios
        },
        {
            path: '/videosMain', // Ruta para la página principal (App.vue)
            name: 'VideosMain',
            component: videosMain // Componente de la página principal
        }
    ]
});
export default router;



