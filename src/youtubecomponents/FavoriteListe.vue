<template>
  <div class="favorites-list">
    <input v-model="searchTerm" class="search-input" placeholder="Buscar favoritos" @input="filterFavorites">
    <ul class="favorites-ul">
      <li v-for="video in filteredFavorites" :key="video.id" class="favorite-item">
        <span>{{ video.title }}</span>
        <button @click="$emit('remove', video)" class="remove-button">Eliminar</button>
      </li>
      <li v-if="filteredFavorites.length === 0" class="no-results">No se encontraron favoritos</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['favorites'],
  data() {
    return {
      searchTerm: ''
    }
  },
  computed: {
    filteredFavorites() {
      const lowerCaseSearch = this.searchTerm.toLowerCase();
      return this.favorites.filter(video => video.title.toLowerCase().includes(lowerCaseSearch));
    }
  },
  methods: {
    filterFavorites() {
      // La propiedad computada se actualizará automáticamente
    }
  }
}
</script>

<style scoped>
.favorites-list {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
}

.favorites-ul {
  list-style-type: none;
  padding: 0;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 5px;
  margin-bottom: 8px;
}

.favorite-item span {
  flex-grow: 1;
}

.remove-button {
  padding: 8px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.remove-button:hover {
  background-color: #c82333;
}

.no-results {
  padding: 10px;
  text-align: center;
  color: #666;
}
</style>
