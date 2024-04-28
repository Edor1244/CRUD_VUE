<template>
  <div class="container my-5">
    <h1 class="mb-5">Gestión de Usuarios</h1>
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
            <label for="descripcionProducto" class="form-label">Password</label>
            <input id="descripcionProducto" v-model="nuevoUsuario.password" type="text" placeholder="Introduce un Password" class="form-control">
          </div>
          <div class="row">
            <div class="col-xs-12 col-sm-4"><button @click="cambiarPagina" class="btn btn-primary mr-2">Ir a Productos</button></div>
            <div class="col-xs-12 col-sm-4"><button type="submit" class="btn btn-primary mr-2">Crear</button></div>
            <div class="col-xs-12 col-sm-4"><button @click="cerrarSesion" class="btn btn-primary">Cerrar Sesión</button></div>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabla de listado de usuarios -->
    <table class="table table-hover">
      <thead>
      <tr>
        <th>UserName</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="usuario in usuarios" :key="usuario.id">
        <td>{{ usuario.username }}</td>
        <td>
          <button @click="editarUsuario(usuario)" class="btn btn-sm btn-info mr-2">
            <i class="fas fa-edit"></i>
          </button>
          <button @click="eliminarUsuario(usuario.id)" class="btn btn-sm btn-danger">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Modal para editar un usuario existente -->
    <div class="modal fade" id="editModalUser" tabindex="-1" role="dialog" aria-labelledby="editModalUserLabel" aria-hidden="true" v-if="usuarioEditando">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalUserLabel">Editar Usuario</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar" @click="cancelarEdicion">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarUsuario">
              <div class="mb-3">
                <label for="editUsername" class="form-label">Username</label>
                <input id="editUsername" v-model="usuarioEditando.username" type="text" class="form-control">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal"  @click="cancelarEdicion">Cerrar</button>
            <button type="submit" class="btn btn-success" @click="guardarUsuario">Guardar Cambios</button>
          </div>
        </div>
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
      usuarios: [],
      nuevoUsuario: {
        username: '',
        password: '',
      },
      usuarioEditando: null,
      modalInstanceUser: null,  // Referencia al objeto Modal
    };
  },
  mounted() {
    this.obtenerUsuarios();
  },
  methods: {
    async obtenerUsuarios() {
      try {
        const respuesta = await this.$http.get('http://localhost:3000/api/usuarios');
        this.usuarios = respuesta.data;
      } catch (error) {
        console.error('Error al obtener ususarios:', error);
      }
    },
    async crearUsuario() {
      try {
        const respuesta = await this.$http.post('http://localhost:3000/api/usuario', this.nuevoUsuario);
        this.usuarios.push(respuesta.data);
        this.nuevoUsuario = { username: '', password: ''};
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
    async cambiarPagina() {
      this.$router.push('/productosPage');
    },
     cerrarSesion() {
      this.$router.push('/');
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
