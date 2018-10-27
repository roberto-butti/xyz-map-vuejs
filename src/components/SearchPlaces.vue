<template>
  <div class="input-map" ref="myInputMap">
      <input type="search" ref="city" class="form-control" placeholder="In which city do you live?" />
      <div>{{ lat }}</div>
      <div>{{ lng }}</div>
      <div>{{ zoom }}</div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: "SearchPlaces",
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
      map: state => state.map
    })
  },
  methods: {
    ...mapActions({
      setLatLngAction: 'setLatLngAction',
      setZoomAction: 'setZoomAction',
    }),
    handleOnChange: function (e) {
      this.setLatLngAction({
        lng: e.suggestion.latlng.lng,
        lat: e.suggestion.latlng.lat
      })
      this.setZoomAction(10);

      //console.log(e.suggestion.latlng);

    },
    loadSearchPlaces: function () {
      var placesAutocomplete = places({
        container: this.$refs.city,
        type: 'city',
        aroundLatLngViaIP: false,
        templates: {
          value: function(suggestion) {
            console.log(suggestion);
            return suggestion.name;
          }
        }
      });
      placesAutocomplete.on('change', this.handleOnChange);
    }
  },
  mounted: function() {
    this.loadSearchPlaces();


  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
