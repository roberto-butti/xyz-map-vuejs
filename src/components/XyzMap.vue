<template>
    <div v-resize="onResize" class="map-container">
        <div class="map" ref="myMap">
        </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import defaultstyle from '../stylemap/default.js';

const axios = require('axios');
export default {
  name: "XyzMap",
  data: function() {
    return {
      mapCurrentLat: null,
      mapCurrentLng: null,
      mapCurrentZoom: null,
      pointLayer: null,
      addedPoints: []
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
      info: state => state.info,
    })
  },
  methods: {
    ...mapActions({
      setLatLngAction: 'setLatLngAction',
      setZoomAction: 'setZoomAction',
      setMapAction: 'setMapAction',
      setInfoAction: 'setInfoAction'
    }),
    monitorChanges: function () {
      this.intervalmonitor = setInterval( () => {
        if (
          this.mapCurrentLat != this.lat
          ||
          this.mapCurrentLng != this.lng
        ) {
          console.log("CHANGED MONITOR X Y",this.lat,this.lng);
          this.setLatLngAction({ lat: this.mapCurrentLat, lng: this.mapCurrentLng})
          this.map.setCenter(this.mapCurrentLng, this.mapCurrentLat);

        }
        if (this.mapCurrentZoom != this.zoom ) {
          console.log("CHANGED MONITOR Z",this.zoom);
          this.setZoomAction(this.mapCurrentZoom)
          this.map.setZoomlevel(this.mapCurrentZoom)
        }


        //console.log("MONITOR",this.lat,this.lng);
      }, 1*1000);

      //console.log(this.lng);
    },
    onResize: function () {
      this.map.resize();
    },
    addFeatures: function (list) {
      console.log(list.srcFeed)
      var fc = {
        type: "FeatureCollection",
        features: []
      }
      list.acList.forEach(element => {
        var f = {
          type: "Feature",
          geometry: {
			      coordinates: [element.Long, element.Lat, element.AltT],
			      type: "Point"
          },
          properties: element
        }
        fc.features.push(f)
        console.log(element)

      });
      if (this.addedPoints) {

        this.addedPoints.forEach( (point) => {
			    this.pointLayer.removeFeature(point);
		    })
		    this.addedPoints = [];
      }
      this.addedPoints = this.pointLayer.addFeature(fc)
    },
    createMarkers: function () {
      console.log("createMarkers");
      var kms = "30"
      var urlAdsb = "https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json?lat="+this.lat+"&lng="+this.lng+"&fDstL=0&fDstU="+kms;

      console.log(urlAdsb);
      var urlProxy = "https://cors-anywhere.herokuapp.com/";
      axios
        .get(urlProxy+""+urlAdsb)
        .then(response => ( this.addFeatures(response.data)))
    },

    geolocateme: function () {
      if (navigator.geolocation) {
          var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }

          navigator.geolocation.getCurrentPosition(this.geoSetPosition, this.errorCurrentPosition, options)
      } else {
          this.msg = "Geolocation is not supported by this browser.";
      }
      this.map.getViewPort().resize();
    },

    geoSetPosition: function (position, wantReverse = true) {
      console.log(position)

      this.mapCurrentLat = position.coords.latitude;
      this.mapCurrentLng = position.coords.longitude;
      this.setLatLngAction({ lat: this.mapCurrentLat, lng: this.mapCurrentLng})
      this.map.setCenter(this.mapCurrentLng, this.mapCurrentLat);

      /*
      this.lat = position.coords.latitude
      this.lng = position.coords.longitude
      this.accuracy = position.coords.accuracy
      this.altitude = position.coords.altitude
      this.altitudeAccuracy = position.coords.altitudeAccuracy
      this.speed = position.coords.speed
      this.heading = position.coords.heading
      this.switchLayerSatelliteTraffic()
      this.map.setZoom(18);
      this.updateCenter()
      this.msg = "Found on: "+this.lat+" "+this.lng
      if (wantReverse) {
        this.reverseGeocoding()
      }
      this.loading=false
      */
    },
    errorCurrentPosition: function (err) {
      var strError = 'ERROR('+err.code+'): '+err.message
      console.log(strError)
      /*
      this.msg =strError
      this.loading=false
      this.loading_followme=false
      */
    },




  },
  mounted: function() {
    this.mapCurrentLat = this.lat;
    this.mapCurrentLng = this.lng;
    this.mapCurrentZoom = this.zoom;

    //this.setZoomAction(4);
    console.log("a is: " + this.msg);
    var YOUR_ACCESS_TOKEN = process.env.VUE_APP_SPACE_TOKEN; //readonly token
    console.log("access: " + YOUR_ACCESS_TOKEN);
    var layers1 = [
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

    var layers2 = [
      new here.xyz.maps.layers.MVTLayer({
        name   : 'mvt-world-layer',
        remote : {
          url : 'https://xyz.api.here.com/tiles/osmbase/256/all/{z}/{x}/{y}.mvt'
          // optional settings:
          // max  : 16,     // max level for loading data
          // min  : 1       // min level for loading data
          // tileSize : 512 // 512|256 defines mvt tilesize in case it can't be automatically detected in url..
        },
        min : 1,
        max : 20,
        /*
        How to Style
        https://xyz.api.here.com/maps/latest/documentation/here.xyz.maps.layers.TileLayer.Style.html
        */
        style : defaultstyle
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
      layers: layers2
    });
    console.log("map created",maplocal);
    var myStyle = {
      styleGroups: {
        noneStyle: [
          {
            zIndex: 0,
            type: "Circle",
            radius: 3,
            fill: "#00FF00"
          },
          {
            zIndex: 3,
            type: "Text",
            textRef: "properties.cou",
            fill: "#3D272B"
          }
        ],
        lightStyle: [
          {
            zIndex: 0,
            type: "Circle",
            radius: 3,
            fill: "#FFFF00"
          },
          {
            zIndex: 3,
            type: "Text",
            textRef: "properties.cou",
            fill: "#3D272B"
          }
        ],
        mediumStyle: [
          {
            zIndex: 0,
            type: "Circle",
            radius: 5,
            fill: "#0000FF"
          },
          {
            zIndex: 3,
            type: "Text",
            textRef: "properties.cou",
            fill: "#3D272B"
          }
        ],
        heavyStyle: [
          {
            zIndex: 0,
            type: "Circle",
            radius: 8,
            fill: "#FF0000"
          },
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
    //maplocal.addLayer(mySpaceLayer);

    this.pointLayer = new here.xyz.maps.layers.TileLayer({
      name: 'my Point Layer',
        min: 4,
        max: 15,
        provider: new here.xyz.maps.providers.LocalProvider ({
      name:  'my Point Provider'
      }),
      style:{
        styleGroups: {
          style: [
            {zIndex:0, type:"Circle", "stroke": "#FFFFFF", "fill": "#6B6B6B", radius: 10},
            {zIndex:1, type:"Text", textRef:"properties.Icao", fill:"#111", font: "normal 13px ariel"}
          ]
        },
        assign: function(feature){
          return "style";
        }
      }
    });
    maplocal.addLayer(this.pointLayer);

    console.log("spacelayer added", maplocal);
    maplocal.addObserver('zoomlevel',(name, newValue, oldValue) => {
      //console.log(name + " new: "+ newValue + " old:" + oldValue);
      this.mapCurrentZoom =  newValue;
    });
    maplocal.addObserver('center',(name, newValue, oldValue) => {
      //console.log(name + " new: "+ newValue + " old:" + oldValue);
      this.mapCurrentLat =  newValue.latitude;
      this.mapCurrentLng =  newValue.longitude;
      //this.setLatLngAction({ lat: newValue.latitude, lng: newValue.longitude})
    });

    maplocal.addEventListener('pointerup',(evt) => {
      // Click on a feature
      if(evt.target){
        var properties = evt.target.properties
        this.setInfoAction(properties)
        //infoTag.innerText = JSON.stringify(properties, undefined, 4);
      } else{
        console.log("No feature is clicked");
      }
    });

    this.monitorChanges();
    this.setMapAction(maplocal);
    this.createMarkers()
    setInterval( () => {
      this.createMarkers()
    }, 10000 );
    this.$nextTick(function () {
      this.geolocateme()
      this.onResize();

    })
    //maplocal.getViewPort().resize()
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map {
  top: 0;
  left: 0;
  /*width: 100%;*/
  height: 88vh;
}
.map-container {
  top: 0;
  left: 0;
  padding: 0px;
  width: 100%;
  /*height: 400px;*/
}
</style>
