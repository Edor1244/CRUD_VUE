<template>
  <div class="app">
    <header>
      <!-- Aqui se agregan los componentes que quieran obtener los usuarios -->
      <Navbar v-if="isAuthenticated" :username="username" :userid="userid" @logout="logout"/>
    </header>
    <main>
      <router-view @authenticated="authenticateUser"/>
    </main>
  </div>
</template>

<script>
import Navbar from '@/youtubecomponents/NavbarComponent.vue';

export default {
  name: 'App',
  components: {
    Navbar,
  },
  data() {
    return {
      isAuthenticated: false,
      username: '',
      userid: 0,
    };
  },
  methods: {
    authenticateUser(username,userid) {
      this.userid = userid;
      this.username = username;
      this.isAuthenticated = true;
      //De esta manera se le pasa el username y userid a la ruta VideosMain
      this.$router.push({ name: 'VideosMain', params: { userid: this.userid, username: this.username } });
    },
    logout() {
      localStorage.removeItem('token');
      this.username = '';
      this.userid = 0;
      this.isAuthenticated = false;
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.app {
  /* Styles for the main application container */
}
</style>
