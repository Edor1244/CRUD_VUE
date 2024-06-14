<template>
  <div class="videos-list">
    <input v-model="searchTerm" class="search-input" placeholder="Buscar videos" @input="searchVideos">
    <ul class="videos-ul">
      <li v-for="video in videos" :key="video.id" class="video-item">
        <span>{{ video.title }}</span>
        <button @click="$emit('favorite', video)" class="favorite-button">Favorito</button>
      </li>
      <li v-if="videos.length === 0" class="no-results">No se encontraron videos</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      searchTerm: '',
      videos: []
    }
  },
  mounted() {
    this.searchVideos(); // Fetch videos on mount
  },
  methods: {
    async searchVideos() {
      console.log('Searching videos:', this.searchTerm);
      try {
        const response = await axios.get('http://localhost:3000/api/videos', {
          params: { q: this.searchTerm }
        });
        this.videos = response.data;
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    }
  }
}
</script>

<style scoped>
.videos-list {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
}

.videos-ul {
  list-style-type: none;
  padding: 0;
}

.video-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 5px;
  margin-bottom: 8px;
}

.video-item span {
  flex-grow: 1;
}

.favorite-button {
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.favorite-button:hover {
  background-color: #0056b3;
}

.no-results {
  padding: 10px;
  text-align: center;
  color: #666;
}
</style>
