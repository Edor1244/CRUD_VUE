import { createRouter, createWebHistory } from 'vue-router'; // Importa funciones necesarias desde vue-router
import videosMain from './components/VideosMainPage.vue'; // Importa componente VideosMain.vue
import login from './components/LoginForm.vue';
import userPage from "@/components/UserPage.vue";
import passwordRecovery from "@/components/RecuperarContraseña.vue";


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
            path: '/videosMain/:userid/:username', // Ruta modificada para aceptar parámetros
            name: 'VideosMain',
            component: videosMain,
            props: true // Permite pasar los parámetros como props al componente
        },
        {
            path: '/passwordRecovery', // Ruta para la página de recuperación de contraseña
            name: 'PasswordRecovery',
            component: passwordRecovery // Componente de la página de recuperación de contraseña
        }
    ]
});
export default router;



