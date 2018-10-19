<template>
  <div class="map" ref="myMap">
  </div>
</template>

<script>
export default {
  name: 'XyzMap',
  data: {
      map: null
  },
  props: {
    msg: String
  },
  mounted: function () {
    // `this` points to the vm instance
    console.log('a is: ' + this.msg)
    //specify your credentials for image and link layers
	var YOUR_ACCESS_TOKEN = "";
    console.log('access: ' + YOUR_ACCESS_TOKEN)
	// configure layers
    var layers = [
        new here.xyz.maps.layers.TileLayer({
            name: 'Image Layer',
            min: 1,
            max: 20,
            provider: new here.xyz.maps.providers.ImageProvider({
                name: 'Live Map',
                //url : 'https://{SUBDOMAIN_INT_1_4}.mapcreator.tilehub.api.here.com/tilehub/wv_livemap_bc/png/sat/256/{QUADKEY}?access_token='+YOUR_ACCESS_TOKEN
                url: 'http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg'
            })
        })
    ]
    console.log('layers created')
    console.log(this.$refs)
	// setup the Map Display
    this.map = new  here.xyz.maps.Map( this.$refs.myMap, {
        zoomLevel : 17,
        center: {
            longitude: -122.46852, latitude: 37.77956
        },
        // add layers to display
        layers: layers
    });
    console.log('map created')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map {
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
}


</style>
