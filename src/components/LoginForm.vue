<template>
  <div class="container my-5">
    <h1 class="mb-5">InnovaTube</h1>
    <div class="login-form">
      <h1>Login</h1>
      <form @submit.prevent="iniciarSesion">
        <div class="form-group">
          <label for="username">Username or Email</label>
          <input type="text" id="username" v-model="usuario.username" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="usuario.password" required>
        </div>
        <div id="recaptcha-container"></div>
        <div class="button-group">
          <button type="submit" class="btn btn-primary">Login</button>
          <button @click="cambiarPagina" class="btn btn-secondary">Registrarse</button>
          <button @click="cambiarPaginaContraseña" class="btn btn-link">Recuperar Contraseña</button>
        </div>
      </form>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      usuario: {
        username: '',
        password: '',
        recaptchaToken: null,
      },
      error: null,
      sitekey: process.env.VUE_APP_reCaptchaSitetKey,
    };
  },
  mounted() {
    console.log(process.env.reCaptchaSitetKey);
    let intervalId = setInterval(() => {
      if (window.grecaptcha && window.grecaptcha.render) {
        window.grecaptcha.render('recaptcha-container', {
          sitekey: this.sitekey,
          callback: this.onCaptchaVerified,
        });
        clearInterval(intervalId);
      }
    }, 100); // Verifica cada 100ms
  },
  methods: {
    onCaptchaVerified(response) {
      this.usuario.recaptchaToken = response;
    },
    async iniciarSesion() {
      try {
        console.log('Iniciando sesión...', this.usuario);
        const respuesta = await this.$http.post('http://localhost:3000/api/login', this.usuario);
        console.log('Respuesta User:', respuesta.data.User);
        this.error = null; // Clear any previous error
        if (respuesta.data.message === '¡Inicio de sesión exitoso!') {
          const usuario = respuesta.data.User[1];
          this.$emit('authenticated', usuario, respuesta.data.User[0]);
        } else {
          this.error = respuesta.data.message; // Display error message 
        }
      } catch (error) {
        alert('Usuario o contraseña incorrectos');
        console.error('Error al iniciar sesión:', error);
        this.error = 'Ha ocurrido un error. Intente nuevamente más tarde.';
      }
    },
    async cambiarPagina() {
      this.$router.push('/usuariosPage');
    },
    async cambiarPaginaContraseña() {
      this.$router.push('/passwordRecovery');
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}

.login-form {
  margin-top: 1rem;
}

.login-form h1 {
  margin-bottom: 1.5rem;
  color: #444;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

#recaptcha-container {
  margin-bottom: 1rem;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn {
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-link {
  background: none;
  color: #007bff;
  text-align: left;
  padding: 0;
  font-size: 1rem;
  cursor: pointer;
}

.btn-link:hover {
  text-decoration: underline;
}

.error-message {
  margin-top: 1rem;
  color: red;
  text-align: center;
}
</style>
