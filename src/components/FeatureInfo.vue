<template>
  <div class="feature-info" ref="feature-info">
    <div>
      <ul>
      <li v-for="(item, index) in info">{{ index}}:{{item}}</li>
      </ul>
    </div>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: "FeatureInfo",
  data: function() {
    return {
    };
  },
  props: {
    msg: String
  },
  computed: {
    ...mapState({
      lat: state => state.lat,
      lng: state => state.lng,
      zoom: state => state.zoom,
      map: state => state.map,
      info: state => state.info
    })
  },
  methods: {
    ...mapActions({
      setLatLngAction: 'setLatLngAction',
      setZoomAction: 'setZoomAction',
      setInfoAction: 'setInfoAction',
    }),
  },
  mounted: function() {

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
