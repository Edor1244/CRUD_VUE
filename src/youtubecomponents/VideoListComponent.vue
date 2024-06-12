<template>
  <div>
    <input v-model="searchTerm" placeholder="Buscar videos" @input="searchVideos"/>
    <ul>
      <li v-for="video in videos" :key="video.id">
        {{ video.title }}
        <button @click="$emit('favorite', video)">Favorito</button>
      </li>
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
  methods: {
    async searchVideos() {
      try {
        const response = await axios.get('/api/videos', {
          params: { q: this.searchTerm }
        });
        this.videos = response.data;
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    }
  },
  mounted() {
    this.searchVideos(); // Fetch videos on mount
  }
}
</script>
