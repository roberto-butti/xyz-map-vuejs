<template>
    <div class="map-container">
        <div class="input-map" ref="myInputMap">

            <input v-model="zoom" placeholder="zoom level">
            <input v-model="lat" placeholder="latitude">
            <input v-model="lng" placeholder="longitude">

        </div>
        <div class="map" ref="myMap">
        </div>
  </div>
</template>

<script>
export default {
  name: "XyzMap",
  data: function() {
    return {
      map: null,
      zoom: 4,
      lat: 37.77956,
      lng: -122.46852
    };
  },
  props: {
    msg: String
  },
  computed: {},
  mounted: function() {
    this.zoom = 4;
    console.log("a is: " + this.msg);
    var YOUR_ACCESS_TOKEN = process.env.VUE_APP_SPACE_TOKEN; //readonly token
    console.log("access: " + YOUR_ACCESS_TOKEN);
    var layers = [
      new here.xyz.maps.layers.TileLayer({
        name: "Image Layer",
        min: 1,
        max: 20,
        provider: new here.xyz.maps.providers.ImageProvider({
          name: "Live Map",
          //url : 'https://{SUBDOMAIN_INT_1_4}.mapcreator.tilehub.api.here.com/tilehub/wv_livemap_bc/png/sat/256/{QUADKEY}?access_token='+YOUR_ACCESS_TOKEN
          //url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
          url: "//stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg"
        })
      })
    ];
    console.log("layers created");
    console.log(this.$refs);
    this.map = new here.xyz.maps.Map(this.$refs.myMap, {
      zoomLevel: this.zoom,
      center: {
        longitude: this.lng,
        latitude: this.lat
      },
      layers: layers
    });
    console.log("map created");
    var myStyle = {
      styleGroups: {
        noneStyle: [
          { zIndex: 0, type: "Circle", radius: 3, fill: "#00FF00" },
          {
            zIndex: 3,
            type: "Text",
            textRef: "properties.cou",
            fill: "#3D272B"
          }
        ],
        lightStyle: [
          { zIndex: 0, type: "Circle", radius: 3, fill: "#FFFF00" },
          {
            zIndex: 3,
            type: "Text",
            textRef: "properties.cou",
            fill: "#3D272B"
          }
        ],
        mediumStyle: [
          { zIndex: 0, type: "Circle", radius: 5, fill: "#0000FF" },
          {
            zIndex: 3,
            type: "Text",
            textRef: "properties.cou",
            fill: "#3D272B"
          }
        ],
        heavyStyle: [
          { zIndex: 0, type: "Circle", radius: 8, fill: "#FF0000" },
          {
            zIndex: 3,
            type: "Text",
            textRef: "properties.cou",
            fill: "#3D272B"
          }
        ]
      },
      assign: function(feature, zoomlevel) {
        var prop = feature.properties;
        //console.log(prop);
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
    };
    var mySpaceProvider = new here.xyz.maps.providers.SpaceProvider({
      name: process.env.VUE_APP_SPACE,
      level: 2,
      space: process.env.VUE_APP_SPACE,
      credentials: {
        access_token: YOUR_ACCESS_TOKEN
      }
    });
    console.log("space provider", mySpaceProvider);
    var mySpaceLayer = new here.xyz.maps.layers.TileLayer({
      name: "mySpaceLayer",
      min: 2,
      max: 20,
      provider: mySpaceProvider,
      style: myStyle
    });
    console.log("spacelayer", mySpaceLayer);
    this.map.addLayer(mySpaceLayer);
    console.log("spacelayer added", this.map);
    this.map.addObserver('zoomlevel', function (name, newValue, oldValue){
      console.log(name + " new: "+ newValue + " old:" + oldValue);
      console.log(window.app.__vue__.$children[0].$children[0]);
      window.app.__vue__.$children[0].$children[0].$data.zoom = newValue;

    });
    // Add observer to center
    this.map.addObserver('center', function (name, newValue, oldValue){
      window.app.__vue__.$children[0].$children[0].$data.lat = newValue.latitude
      window.app.__vue__.$children[0].$children[0].$data.lng = newValue.longitude

      console.log(newValue);
      //console.log( name + " new: "+ JSON.stringify(newValue, null, 4) + " old:" + JSON.stringify(oldValue, null, 4));
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map {
  top: 0;
  left: 0;
  width: 100%;
  height: 90vh;
}
.input-map {
  top: 0;
  left: 0;
  width: 100%;
  height: 10vh;
}
.map-container {
  top: 0;
  left: 0;
  width: 100%;
  /*height: 400px;*/
}
</style>
