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

export default {
  name: 'VideosMainPage',
  props:['username'],
  data() {
    return {
      favorites: []
    };
  },
  components: {
    VideoListComponent,
    FavoriteListComponent
  },
  methods: {
    handleLogout() {
      this.$emit('logout'); // Emite el evento de logout
      this.$router.push('/'); // Redirige al login tras cerrar sesión
    },
    addFavorite(video) {
      if (!this.favorites.find(fav => fav.id === video.id)) {
        this.favorites.push(video);
      }
    },
    removeFavorite(video) {
      this.favorites = this.favorites.filter(fav => fav.id !== video.id);
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
