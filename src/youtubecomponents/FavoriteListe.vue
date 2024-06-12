<template>
  <div>
    <input v-model="searchTerm" placeholder="Buscar favoritos" @input="filterFavorites"/>
    <ul>
      <li v-for="video in filteredFavorites" :key="video.id">
        {{ video.title }}
        <button @click="$emit('remove', video)">Eliminar</button>
      </li>
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
      return this.favorites.filter(video => video.title.includes(this.searchTerm));
    }
  },
  methods: {
    filterFavorites() {
      // Computed property will automatically update
    }
  }
}
</script>
