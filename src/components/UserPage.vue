<template>
  <div class="container my-5">
    <h1 class="mb-5">Registro de Usuarios Nuevos</h1>


    <!-- Formulario para crear un nuevo usuario -->
    <div class="card mb-5">
      <div class="card-body">
        <h2 class="card-title">Crear Nuevo Usuario</h2>
        <form @submit.prevent="crearUsuario">
          <div class="mb-3">
            <label for="nombreProducto" class="form-label">UserName</label>
            <input id="nombreProducto" v-model="nuevoUsuario.username" type="text" placeholder="Introduce tu UserName" class="form-control">
          </div>
          <div class="mb-3">
            <label for="nombreProducto" class="form-label">Nombre</label>
            <input id="nombreProducto" v-model="nuevoUsuario.nombre" type="text" placeholder="Introduce tu UserName" class="form-control">
          </div>
          <div class="mb-3">
            <label for="nombreProducto" class="form-label">Apellido 1</label>
            <input id="nombreProducto" v-model="nuevoUsuario.apellido1" type="text" placeholder="Introduce tu UserName" class="form-control">
          </div>
          <div class="mb-3">
            <label for="nombreProducto" class="form-label">Apellido 2</label>
            <input id="nombreProducto" v-model="nuevoUsuario.apellido2" type="text" placeholder="Introduce tu UserName" class="form-control">
          </div>
          <div class="mb-3">
            <label for="labelPassword" class="form-label">Password</label>
            <input id="InputPassword" v-model="nuevoUsuario.password" type="text" placeholder="Introduce un Password" class="form-control">
          </div>
          <div class="mb-3">
            <label for="labelPassword2" class="form-label">Password</label>
            <input id="Inputpassword2" v-model="password2" type="text" placeholder="Introduce de nuevo el Password" class="form-control">
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
import { Modal } from 'bootstrap';


export default {
  name:'UsuariosPage',
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
        recaptchaToken: null,
      },
      usuarioEditando: null,
      modalInstanceUser: null,  // Referencia al objeto Modal
      sitekey:'6Lch0vUpAAAAALx8RLXtjFnrxuxBT6D-lDf9sDl5',
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
      console.log('Creando usuario... desde el botton crear en userpage');
      try {
        console.log(this.nuevoUsuario);
        if (this.nuevoUsuario.password !== this.password2) {
          alert('Las contraseñas no coinciden');
          return;
        }else{
          const respuesta = await this.$http.post('http://localhost:3000/api/usuario', this.nuevoUsuario);
          this.usuarios.push(respuesta.data);
          this.nuevoUsuario = { username: '', password: '', nombre: '', apellido1: '', apellido2: ''};
          alert('Usuario creado exitosamente');
          this.$router.push('/videosMain');
        }
      } catch (error) {
        console.error('Error al crear usuario:', error);
      }
    },
    editarUsuario(usuario) {
      this.usuarioEditando = null;
      this.usuarioEditando = usuario;
      this.modalInstanceUser = null;

      this.$nextTick(() => {
        if (!this.modalInstanceUser) {
          const modalElement = document.getElementById('editModalUser');
          if (modalElement) {
            this.modalInstanceUser = new Modal(modalElement);
          }
        }
        if (this.modalInstanceUser) {
          this.modalInstanceUser.show();
        }
      });
    },
    async guardarUsuario() {
      try {
        const respuesta = await this.$http.put(`http://localhost:3000/api/usuarios/${this.usuarioEditando.id}`, this.usuarioEditando);
        const index = this.usuarios.findIndex(p => p.id === respuesta.data.id);
        this.usuarios.splice(index, 1, respuesta.data);
        this.usaurioEditando = null;
        this.modalInstanceUser.hide();
      } catch (error) {
        console.error('Error al guardar cambios:', error);
      }
    },
    cancelarEdicion() {
      this.productoEditando = null;
      this.modalInstanceUser.hide();
    },
    async eliminarUsuario(id) {
      try {
        await this.$http.delete(`http://localhost:3000/api/usuarios/${id}`);
        this.usuarios = this.usuarios.filter(p => p.id !== id);
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
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
