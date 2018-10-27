<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      fixed

      app
    >
    <SearchPlaces msg=this.appname />
      <v-list dense>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>contact_mail</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Contact</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar  dense  color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title></v-toolbar-title>

    </v-toolbar>

    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <v-flex text-xs-center>
            <div id="app">
              <XyzMap msg=this.appname />
              <!--img alt="Vue logo" src="./assets/logo.png"-->
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer color="cyan" app>
      <v-spacer></v-spacer>
      <span class="white--text">&copy; 2018</span>
    </v-footer>
  </v-app>

</template>

<script>
import XyzMap from './components/XyzMap.vue'
import SearchPlaces from './components/SearchPlaces.vue'

export default {
  name: 'app',
  components: {
    XyzMap,
    SearchPlaces
  },
  data: () => ({
      drawer: true,
      appname: "XYZ meets VUEjs"
    }),
    props: {
      source: String
    }
}
</script>

<style>
body {
  margin: 0px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
