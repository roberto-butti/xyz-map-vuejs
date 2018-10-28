<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      fixed

      app
    >
      <v-card>
        <v-card-title primary-title>
          <h2>Search your place</h2>
          <SearchPlaces msg=this.appname />
        </v-card-title>


      </v-card>
    </v-navigation-drawer>

    <v-toolbar  dense  color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title></v-toolbar-title>

    </v-toolbar>

    <v-content>
      <v-container fluid fill-height pa-0>
        <v-layout justify-center align-center >
          <v-flex text-xs-center>
            <div id="app">
              <XyzMap msg=this.appname />
              <!--img alt="Vue logo" src="./assets/logo.png"-->
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <!--v-footer color="indigo" app>
      <v-spacer></v-spacer>
      <span class="white--text">&copy; 2018</span>
    </v-footer-->
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
