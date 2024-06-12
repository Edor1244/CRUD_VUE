<template>
  <div>
    <Navbar :username="username" @logout="handleLogout"/>
    <div class="main-content">
      <VideoListComponent @favorite="addFavorite"/>
      <FavoriteListComponent :favorites="favorites" @remove="removeFavorite"/>
    </div>
  </div>
</template>

<script>
import Navbar from '@/youtubecomponents/NavbarComponent.vue';
import VideoListComponent from '@/youtubecomponents/VideoListComponent.vue';
import FavoriteListComponent from '@/youtubecomponents/FavoriteListe.vue';

export default {
  name: 'VideosMainPage',
  data() {
    return {
      username: '',
      favorites: []
    }
  },
  components: {
    Navbar,
    VideoListComponent,
    FavoriteListComponent
  },
  methods: {
    handleLogout() {
      this.username = '';
      this.$router.push('/login'); // Redirige al login tras cerrar sesión
    },
    addFavorite(video) {
      if (!this.favorites.find(fav => fav.id === video.id)) {
        this.favorites.push(video);
      }
    },
    removeFavorite(video) {
      this.favorites = this.favorites.filter(fav => fav.id !== video.id);
    }
  },
  created() {
    // Recupera el nombre de usuario (esto puede variar según tu implementación de autenticación)
    this.username = 'UsuarioAutenticado'; // Deberías reemplazar esto con el nombre de usuario real
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
