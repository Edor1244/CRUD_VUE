<template>
  <div class="container my-5">
    <h1 class="mb-5">Gestión de Productos</h1>

    <!-- Formulario para crear un nuevo producto -->
    <div class="card mb-5">
      <div class="card-body">
        <h2 class="card-title">Crear Nuevo Producto</h2>
        <form @submit.prevent="crearProducto">
          <div class="mb-3">
            <label for="nombreProducto" class="form-label">Nombre</label>
            <input id="nombreProducto" v-model="nuevoProducto.nombre" type="text" placeholder="Introduce el nombre del producto" class="form-control">
          </div>
          <div class="mb-3">
            <label for="descripcionProducto" class="form-label">Descripción</label>
            <input id="descripcionProducto" v-model="nuevoProducto.descripcion" type="text" placeholder="Introduce una descripción" class="form-control">
          </div>
          <div class="mb-3">
            <label for="precioProducto" class="form-label">Precio</label>
            <input id="precioProducto" v-model="nuevoProducto.precio" type="number" placeholder="Precio en dólares" class="form-control">
          </div>
          <div>
            <div class="row">
              <div class="col-xs-12 col-sm-4"><button @click="cambiarPagina" class="btn btn-primary mr-2">Ir a Usuarios</button></div>
              <div class="col-xs-12 col-sm-4"><button type="submit" class="btn btn-primary mr-2">Crear</button></div>
              <div class="col-xs-12 col-sm-4"><button @click="cerrarSesion" class="btn btn-primary">Cerrar Sesión</button></div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabla de listado de productos -->
    <table class="table table-hover">
      <thead>
      <tr>
        <th>Nombre</th>
        <th>Descripción</th>
        <th>Precio</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="producto in productos" :key="producto.id">
        <td>{{ producto.nombre }}</td>
        <td>{{ producto.descripcion }}</td>
        <td>${{ producto.precio }}</td>
        <td>
          <button @click="editarProducto(producto)" class="btn btn-sm btn-info mr-2">
            <i class="fas fa-edit"></i>
          </button>
          <button @click="eliminarProducto(producto.id)" class="btn btn-sm btn-danger">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Modal para editar un producto existente -->
    <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true" v-if="productoEditando">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Editar Producto</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar" @click="cancelarEdicion">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarProducto">
              <div class="mb-3">
                <label for="editNombre" class="form-label">Nombre</label>
                <input id="editNombre" v-model="productoEditando.nombre" type="text" class="form-control">
              </div>
              <div class="mb-3">
                <label for="editDescripcion" class="form-label">Descripción</label>
                <input id="editDescripcion" v-model="productoEditando.descripcion" type="text" class="form-control">
              </div>
              <div class="mb-3">
                <label for="editPrecio" class="form-label">Precio</label>
                <input id="editPrecio" v-model="productoEditando.precio" type="number" class="form-control">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal"  @click="cancelarEdicion">Cerrar</button>
            <button type="submit" class="btn btn-success" @click="guardarProducto">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';


export default {
  data() {
    return {
      productos: [],
      nuevoProducto: {
        nombre: '',
        descripcion: '',
        precio: '',
      },
      productoEditando: null,
      modalInstance: null,  // Referencia al objeto Modal
    };
  },
  mounted() {
    this.obtenerProductos();
  },
  methods: {
    async obtenerProductos() {
      try {
        const respuesta = await this.$http.get('http://localhost:3000/api/productos');
        this.productos = respuesta.data;
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    },
    async crearProducto() {
      try {
        const respuesta = await this.$http.post('http://localhost:3000/api/productos', this.nuevoProducto);
        this.productos.push(respuesta.data);
        this.nuevoProducto = { nombre: '', descripcion: '', precio: '' };
      } catch (error) {
        console.error('Error al crear producto:', error);
      }
    },
    editarProducto(producto) {

      this.productoEditando = null;
      this.productoEditando = producto;
      this.modalInstance = null;

      this.$nextTick(() => {
        if (!this.modalInstance) {
          const modalElement = document.getElementById('editModal');
          if (modalElement) {
            this.modalInstance = new Modal(modalElement);
          }
        }
        if (this.modalInstance) {
          this.modalInstance.show();
        }
      });
    },
    async guardarProducto() {
      try {
        const respuesta = await this.$http.put(`http://localhost:3000/api/productos/${this.productoEditando.id}`, this.productoEditando);
        const index = this.productos.findIndex(p => p.id === respuesta.data.id);
        this.productos.splice(index, 1, respuesta.data);
        this.productoEditando = null;
        this.modalInstance.hide();

      } catch (error) {
        console.error('Error al guardar cambios:', error);
      }
    },
    cancelarEdicion() {
      this.productoEditando = null;
      this.modalInstance.hide();
    },
    async eliminarProducto(id) {
      try {
        await this.$http.delete(`http://localhost:3000/api/productos/${id}`);
        this.productos = this.productos.filter(p => p.id !== id);
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    },
    async cambiarPagina() {
      this.$router.push('/usuariosPage');
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
.modal-backdrop.show {
  /* This style ensures that the background blurs when the modal is active */
  opacity: 0.5 !important;
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
</style>