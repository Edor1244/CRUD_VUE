<template>
  <div class="container my-5">
    <h1 class="text-center mb-5 display-4">Registro de Usuarios Nuevos</h1>

    <!-- Formulario para crear un nuevo usuario -->
    <div class="card mb-5 shadow-lg p-4">
      <div class="card-body">
        <h2 class="card-title text-center mb-4">Crear Nuevo Usuario</h2>
        <form @submit.prevent="crearUsuario">
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <input id="username" v-model="nuevoUsuario.username" type="text" placeholder="Introduce tu UserName" class="form-control">
          </div>
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input id="email" v-model="nuevoUsuario.email" type="email" placeholder="Introduce tu email" class="form-control">
          </div>
          <div class="form-group">
            <label for="nombre" class="form-label">Nombre</label>
            <input id="nombre" v-model="nuevoUsuario.nombre" type="text" placeholder="Introduce tu nombre" class="form-control">
          </div>
          <div class="form-group">
            <label for="Apellido1" class="form-label">Primer Apellido</label>
            <input id="Apellido1" v-model="nuevoUsuario.apellido1" type="text" placeholder="Introduce tu Primer Apellido" class="form-control">
          </div>
          <div class="form-group">
            <label for="Apellido2" class="form-label">Segundo Apellido</label>
            <input id="Apellido2" v-model="nuevoUsuario.apellido2" type="text" placeholder="Introduce tu Segundo Apellido" class="form-control">
          </div>
          <div class="form-group">
            <label for="InputPassword" class="form-label">Contraseña</label>
            <input id="InputPassword" v-model="nuevoUsuario.password" type="password" placeholder="Introduce una Contraseña" class="form-control">
          </div>
          <div class="form-group">
            <label for="InputPassword2" class="form-label">Repetir Contraseña</label>
            <input id="InputPassword2" v-model="password2" type="password" placeholder="Introduce de nuevo la Contraseña" class="form-control">
          </div>
          <div id="recaptcha-containerUser"></div>
          <div class="d-flex justify-content-between mt-4">
            <button type="submit" class="btn btn-primary">Crear</button>
            <button @click="cerrarSesion" type="button" class="btn btn-secondary">Ir a Login</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UsuariosPage',
  data() {
    return {
      password2: '',
      usuarios: [],
      nuevoUsuario: {
        username: '',
        password: '',
        nombre: '',
        apellido1: '',
        apellido2: '',
        email: '',
        recaptchaToken: null,
      },
      usuarioEditando: null,
      sitekey: process.env.VUE_APP_reCaptchaSitetKey,
    };
  },
  mounted() {
    let intervalId = setInterval(() => {
      if (window.grecaptcha && window.grecaptcha.render) {
        window.grecaptcha.render('recaptcha-containerUser', {
          sitekey: this.sitekey,
          callback: this.onCaptchaVerified,
        });
        clearInterval(intervalId);
      }
    }, 100); // Verifica cada 100ms
  },
  methods: {
    async crearUsuario() {
      console.log('Creando usuario... desde el botón crear en userpage');
      try {
        console.log(this.nuevoUsuario);
        if (this.nuevoUsuario.password !== this.password2) {
          alert('Las contraseñas no coinciden');
          return;
        } else {
          const respuesta = await this.$http.post('http://localhost:3000/api/usuario', this.nuevoUsuario);
          console.log('Respuesta Crear Usuario antes del add', respuesta);
          this.usuarios.push(respuesta.data);
          console.log(respuesta.data);
          this.nuevoUsuario = { username: '', password: '', nombre: '', apellido1: '', apellido2: '', email: '' };
          alert('Usuario creado exitosamente');
          this.$router.push('/videosMain');
        }
      } catch (error) {
        console.error('Error al crear usuario:', error);
      }
    },
    cerrarSesion() {
      this.$router.push('/');
    },
    onCaptchaVerified(response) {
      this.nuevoUsuario.recaptchaToken = response;
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 700px; /* Limit the width for a more comfortable reading */
  margin: auto;
  padding: 20px;
}

.card {
  background: #fff;
  border: none;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 1.75rem;
  color: #333;
}

.form-label {
  font-weight: 600;
  margin-bottom: 5px;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
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

.d-flex {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}
</style>
