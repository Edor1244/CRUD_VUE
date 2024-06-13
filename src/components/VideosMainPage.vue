<template>
  <div>
    <div class="main-content">
      <VideoListComponent @favorite="addFavorite"/>
      <FavoriteListComponent :favorites="favorites" @remove="removeFavorite"/>
    </div>
  </div>
</template>

<script>
import VideoListComponent from '@/youtubecomponents/VideoListComponent.vue';
import FavoriteListComponent from '@/youtubecomponents/FavoriteListe.vue';
import axios from "axios";

export default {
  name: 'VideosMainPage',
  props: {
    userid: {
      type: Number,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      favorites: []
    };
  },
  components: {
    VideoListComponent,
    FavoriteListComponent
  },
mounted() {
  this.getFavorites();
},
  methods: {
    async addFavorite(video) {
      try {
        console.log('Entre al addFavorite Function en VidesMainPage:', this.userid);
        await axios.post('http://localhost:3000/api/favorites', {
          usuario: this.userid,
          video
        });
        this.favorites.push(video);
      } catch (error) {
        console.error('Error adding favorite:', error);
      }
    },
    async removeFavorite(video) {
      try {
        await axios.delete('http://localhost:3000/api/favorites', {
          data: {
            userId: this.userid,
            videoId: video.id
          }
        });
        this.favorites = this.favorites.filter(fav => fav.id !== video.id);
      } catch (error) {
        console.error('Error removing favorite:', error);
      }
    },
    async getFavorites() {
      try {
        const response = await axios.get(`http://localhost:3000/api/favorites/${this.userid}`);
        this.favorites = response.data;
      } catch (error) {
        console.error('Error getting favorites:', error);
      }
    }
  }
}
</script>

<style scoped>
.main-content {
  display: flex;
  justify-content: space-around;
  margin: 20px;
}
</style>
