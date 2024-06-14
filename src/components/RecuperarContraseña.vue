<template>
    <div class="container my-5">
      <h1 class="mb-5">Rescuperar contraseña</h1>


      <!-- Formulario para recuperar contraseña -->
      <div class="card mb-5">
        <div class="card-body">
          <h2 class="card-title">Recuperar Contraseña</h2>
          <form @submit.prevent="enviarCambioContraseña">
            <div class="mb-3">
              <label for="txtUsername" class="form-label">userName</label>
              <input id="txtUsername" v-model="nuevaContraseña.username" type="text" placeholder="Introduce tu UserName" class="form-control">
            </div>
            <div class="mb-3">
              <label for="txtpassword1" class="form-label">Nueva Contraseña</label>
              <input id="txtpassword1" v-model="nuevaContraseña.password" type="text" placeholder="Introduce tu UserName" class="form-control">
            </div>
            <div class="mb-3">
              <label for="txtpassword2" class="form-label">Repetir Contraseña</label>
              <input id="txtpassword2" v-model="password2" type="text" placeholder="Introduce tu UserName" class="form-control">
            </div>
            <div id="recaptcha-containerUser"></div>
            <div class="row">
              <div class="col-xs-12 col-sm-4"><button type="submit" class="btn btn-primary mr-2">Crear</button></div>
              <div class="col-xs-12 col-sm-4"><button @click="cerrarSesion" class="btn btn-primary">Ir a login</button></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>

  <script>
  export default {
    name:'RecoveryPasswordPage',
    data() {
      return {
        password2: '',
        nuevaContraseña: {
          username: '',
          password: '',
          recaptchaToken: null,
        },
        contraseñaEditanda: null,
        modalInstanceUser: null,  // Referencia al objeto Modal
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
       cerrarSesion() {
        this.$router.push('/');
      },
      onCaptchaVerified(response) {
        this.nuevoUsuario.recaptchaToken = response;
      },
      async enviarCambioContraseña() {
        if (this.nuevaContraseña.password !== this.password2) {
          alert('Las contraseñas no coinciden');
          return;
        }
        const data = {
            username: this.nuevaContraseña.username,
            password: this.nuevaContraseña.password,
        };
      try {
        console.log("Entro al apartado del cambio de contraseña antes del const respuesta")
        const respuesta = await this.$http.put(`http://localhost:3000/api/usuariosPassRecovery`, data);
        if(respuesta.data.status === 'success'){
          alert('Contraseña cambiada con éxito');
          this.$router.push('/'); // Redirect to protected area
        }
      } catch (error) {
        console.error('Error al actualizar cambios:', error);
      }
    },
    },
  };
  </script>
  <style scoped>
  .container {
    max-width: 800px; /* Limit the width for a more comfortable reading */
  }

  .card {
    background: #f8f9fa;
    border: 1px solid #e1e4e8;
    padding: 20px;
    margin-bottom: 20px;
  }

  .form-label {
    font-weight: bold;
    margin-bottom: 10px;
  }

  .form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 20px;
  }

  .btn {
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .btn-primary {
    background-color: #007bff;
    color: white;
  }

  .btn-primary:hover {
    background-color: #0056b3;
  }

  .btn-success {
    background-color: #28a745;
    color: white;
  }

  .btn-success:hover {
    background-color: #218838;
  }

  .btn-danger {
    background-color: #dc3545;
    color: white;
  }

  .btn-danger:hover {
    background-color: #c82333;
  }
  .table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
    box-shadow: 0 0 20px rgba(0,0,0,0.15);
  }

  .table th, .table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }

  .table th {
    background-color: #f8f9fa;
    font-weight: bold;
    color: #333;
  }

  .table td {
    background-color: #fff;
    color: #666;
  }

  .table tr:nth-child(even) td {
    background-color: #f8f9fa;
  }

  .table tr:hover td {
    background-color: #e9ecef;
  }

  .table .btn {
    padding: 5px 10px;
    font-size: 0.8rem;
    transition: all 0.3s ease;
    margin: 0 15px;
  }

  .table .btn-info {
    background-color: #17a2b8;
    color: white;
  }

  .table .btn-info:hover {
    background-color: #138496;
  }

  .table .btn-danger {
    background-color: #dc3545;
    color: white;
  }

  .table .btn-danger:hover {
    background-color: #c82333;
  }

  .modal-backdrop.show {
    /* This style ensures that the background blurs when the modal is active */
    opacity: 0.5 !important;
  }
  </style>
