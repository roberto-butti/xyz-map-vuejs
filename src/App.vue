<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      fixed

      app
    >

      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="https://vuejs.org/images/logo.png">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{ appname }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile
          v-for="item in items"
          :key="item.title"
          @click=""
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

    </v-navigation-drawer>

    <v-toolbar  dense    fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>

      <v-toolbar-title class="mr-5 align-center">
        {{ appname }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-layout row >
      <SearchPlaces msg=this.appname />
      </v-layout>

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
      drawer: false,
      appname: "Maps and Vue",
      items: [
        { title: 'Home', icon: 'dashboard', url:'/' },
        { title: 'Documentation', icon: 'question_answer', url: 'http://here.xyz' }
      ]
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
