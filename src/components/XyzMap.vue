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
	var YOUR_ACCESS_TOKEN = process.env.VUE_APP_SPACE_TOKEN; //readonly token
    console.log('access: ' + YOUR_ACCESS_TOKEN)

    // Define provider for this layer
	// configure layers
    var layers = [
        new here.xyz.maps.layers.TileLayer({
            name: 'Image Layer',
            min: 1,
            max: 20,
            
            provider: new here.xyz.maps.providers.ImageProvider({
                name: 'Live Map',
                //url : 'https://{SUBDOMAIN_INT_1_4}.mapcreator.tilehub.api.here.com/tilehub/wv_livemap_bc/png/sat/256/{QUADKEY}?access_token='+YOUR_ACCESS_TOKEN
                //url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
                url: '//stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg'
            })
        })
    ]
    console.log('layers created')
    console.log(this.$refs)
	// setup the Map Display
    this.map = new  here.xyz.maps.Map( this.$refs.myMap, {
        zoomLevel : 10,
        center: {
            longitude: -122.46852, latitude: 37.77956
        },
        // add layers to display
        layers: layers
    });
    console.log('map created')

    //ADDING SPACES
    var myStyle = {
    	styleGroups: {
    		noneStyle: [
	    		{zIndex:0, type:"Circle", radius:3, fill:"#00FF00"},
	    		{zIndex:3, type:"Text", textRef:"properties.cou", fill:"#3D272B"}
            ],
            lightStyle: [
	    		{zIndex:0, type:"Circle", radius:3, fill:"#FFFF00"},
	    		{zIndex:3, type:"Text", textRef:"properties.cou", fill:"#3D272B"}
            ],
            mediumStyle: [
	    		{zIndex:0, type:"Circle", radius:5, fill:"#0000FF"},
	    		{zIndex:3, type:"Text", textRef:"properties.cou", fill:"#3D272B"}
            ],
            heavyStyle: [
	    		{zIndex:0, type:"Circle", radius:8, fill:"#FF0000"},
	    		{zIndex:3, type:"Text", textRef:"properties.cou", fill:"#3D272B"}
            ],

            
    	},

		assign: function(feature, zoomlevel){
            var prop = feature.properties;
            console.log(prop)
            if (prop.WTC == 1) {
                return "lightStyle";
            }
            if (prop.WTC == 2) {
                return "mediumStyle";
            }
            if (prop.WTC == 3) {
                return "heavyStyle";
            }

            return "noneStyle";


         	
		}
    }
    var mySpaceProvider = new here.xyz.maps.providers.SpaceProvider ({
        name:  process.env.VUE_APP_SPACE,
        level: 2,
        space: process.env.VUE_APP_SPACE,
        credentials: {
                access_token: YOUR_ACCESS_TOKEN
        },
        
    });
    console.log('space provider', mySpaceProvider)
    // Create data layer with Space provider
    var mySpaceLayer = new here.xyz.maps.layers.TileLayer({
    name: 'mySpaceLayer',
    min: 2,
    max: 20,
    provider: mySpaceProvider,
    style: myStyle
    })
    console.log("spacelayer", mySpaceLayer)
    this.map.addLayer( mySpaceLayer )
    console.log("spacelayer added", this.map)

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
