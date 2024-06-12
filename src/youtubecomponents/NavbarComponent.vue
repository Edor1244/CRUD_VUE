<template>
  <nav>
    <div class="navbar">
      <span class="navbar-brand">InnovaTube</span>
      <div class="navbar-user">
        <span>{{ username }}</span>
        <button @click="logout">Cerrar Sesión</button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: ['username'],
  methods: {
    logout() {
      localStorage.removeItem('token'); // Ejemplo de eliminación de un token
      this.$emit('logout'); // Emitir evento para informar al componente padre que el usuario ha cerrado sesión
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: white;
  padding: 1rem;
}

.navbar-brand {
  font-size: 1.5rem;
}

.navbar-user {
  display: flex;
  align-items: center;
}

.navbar-user span {
  margin-right: 1rem;
}

.navbar-user button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.navbar-user button:hover {
  background-color: #d32f2f;
}
</style>
