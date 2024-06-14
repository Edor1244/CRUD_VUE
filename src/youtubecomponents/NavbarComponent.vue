<template>
  <nav class="navbar navbar-dark bg-dark">
    <div class="container">
      <span class="navbar-brand mb-0 h1">InnovaTube</span>
      <div class="navbar-text">
        <span class="text-light mr-3">Bienvenido {{ username }}</span>
        <button class="btn btn-danger" @click="logout">Cerrar Sesión</button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: ['username', 'userid'],
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$emit('logout'); // Emitir evento para informar al componente padre que el usuario ha cerrado sesión
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
/* Puedes añadir estilos personalizados aquí si es necesario */
</style>
