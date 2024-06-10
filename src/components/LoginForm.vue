<template>
    <div class="container my-5">
      <h1 class="mb-5">Edor´s app</h1>
      <!-- Login -->
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
          <div>
            <div class="col-xs-12 col-sm-4"><button type="submit" class="btn btn-primary mr-2">Login</button></div>
          </div>
          <div>
            <div class="col-xs-12 col-sm-4"><button @click="cambiarPagina" class="btn btn-primary mr-2">Registrarse</button></div>
          </div>
        </form>
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
      },
      error: null,
    };
  },
  methods: {
    async iniciarSesion() {
      try {
        const respuesta = await this.$http.post('http://localhost:3000/api/login', this.usuario);
        console.log('Respuesta:', respuesta.data);
        this.error = null; // Clear any previous error

        if (respuesta.data.message === '¡Inicio de sesión exitoso!') {
          // Successful login, assuming your server sets the session
          this.$router.push('/productosPage'); // Redirect to protected area
        } else {
          this.error = respuesta.data.message; // Display error message
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        this.error = 'Ha ocurrido un error. Intente nuevamente más tarde.';
      }
    },
    async cambiarPagina() {
      this.$router.push('/usuariosPage');
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 800px; /* Limita el ancho para una lectura más cómoda */
}

.login-form {
  width: 300px;
  margin: 0 auto;
  padding: 30px 0;
}

.login-form h1 {
  text-align: center;
  margin-bottom: 30px;
}

.login-form .form-group {
  margin-bottom: 20px;
}

.login-form .form-group label {
  display: block;
  margin-bottom: 10px;
}

.login-form .form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.login-form button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.login-form button:hover {
  background-color: #0056b3;
}
</style>