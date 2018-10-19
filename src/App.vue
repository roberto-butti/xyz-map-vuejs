<template>
  <div id="app">
    <!--img alt="Vue logo" src="./assets/logo.png"-->
    <XyzMap msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import XyzMap from './components/XyzMap.vue'

export default {
  name: 'app',
  components: {
    XyzMap
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
