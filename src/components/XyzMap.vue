<template>
    <div class="map-container">
        <div class="input-map" ref="myInputMap">
            <input type="search" ref="city" class="form-control" placeholder="In which city do you live?" />
            {{ lat}},{{lng}}/{{zoom}}

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
  methods: {
    handleOnChange: function (e) {
      console.log("SELECTED",e);
      this.map.setCenter(e.suggestion.latlng.lng, e.suggestion.latlng.lat);
      this.map.setZoomlevel(10);
      console.log(e.suggestion.latlng);

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
          //url: 'https://{SUBDOMAIN_INT_1_4}.base.maps.api.here.com/maptile/2.1/basetile/newest/reduced.night/{LEVEL}/{COL}/{ROW}/256/png8?access_token='+YOUR_ACCESS_TOKEN
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
    this.map.addObserver('zoomlevel',(name, newValue, oldValue) => {
      console.log(name + " new: "+ newValue + " old:" + oldValue);
      this.zoom = newValue

    });
    this.map.addObserver('center',(name, newValue, oldValue) => {
      console.log(name + " new: "+ newValue + " old:" + oldValue);
      this.lat = newValue.latitude
      this.lng = newValue.longitude
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
