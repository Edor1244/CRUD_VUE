import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import 'bootstrap';
import router from './router.js';


// Aquí puedes usar jQuery globalmente si fuera necesario
window.$ = window.jQuery = $;


const app = createApp(App);

app.use(router);
// Configurar Axios como propiedad global
app.config.globalProperties.$http = axios
app.mount('#app')