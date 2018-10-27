<template>
    <div class="map-container">
        <div class="map" ref="myMap">
        </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: "XyzMap",
  data: function() {
    return {
      mapCurrentLat: null,
      mapCurrentLng: null,
      mapCurrentZoom: null

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
    })
  },
  methods: {
    ...mapActions({
      setLatLngAction: 'setLatLngAction',
      setZoomAction: 'setZoomAction',
      setMapAction: 'setMapAction'
    }),
    monitorChanges: function () {
      this.intervalmonitor = setInterval( () => {
        if (
          this.mapCurrentLat != this.lat
          ||
          this.mapCurrentLng != this.lng
        ) {
          console.log("CHANGED MONITOR",this.lat,this.lng);
          this.setLatLngAction({ lat: this.mapCurrentLat, lng: this.mapCurrentLng})
        }
        //console.log("MONITOR",this.lat,this.lng);
      }, 1*1000);

      //console.log(this.lng);
    }
  },
  mounted: function() {
    this.mapCurrentLat = this.lat;
    this.mapCurrentLng = this.lng;
    this.mapCurrentZoom = this.zoom;

    //this.setZoomAction(4);
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
    console.log(this.zoom, this.lat, this.lng)
    var maplocal = new here.xyz.maps.Map(this.$refs.myMap, {
      zoomLevel: this.zoom,
      center: {
        longitude: this.lng,
        latitude: this.lat
      },
      layers: layers
    });
    console.log("map created",maplocal);
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
    maplocal.addLayer(mySpaceLayer);
    console.log("spacelayer added", maplocal);
    maplocal.addObserver('zoomlevel',(name, newValue, oldValue) => {
      console.log(name + " new: "+ newValue + " old:" + oldValue);

      if (Math.abs(this.zoom - newValue) >= 1) {
        this.setZoomAction(newValue)
      }


    });
    maplocal.addObserver('center',(name, newValue, oldValue) => {
      //console.log(name + " new: "+ newValue + " old:" + oldValue);
      this.mapCurrentLat =  newValue.latitude;
      this.mapCurrentLng =  newValue.longitude;
      //this.setLatLngAction({ lat: newValue.latitude, lng: newValue.longitude})
    });

    //setTimeout(this.monitorChanges(), (1 * 1000));
    this.monitorChanges();
    this.setMapAction(maplocal);


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
