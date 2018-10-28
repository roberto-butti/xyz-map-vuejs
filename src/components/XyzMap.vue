<template>
    <div v-resize="onResize" class="map-container">
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
          console.log("CHANGED MONITOR X Y",this.lat,this.lng);
          this.setLatLngAction({ lat: this.mapCurrentLat, lng: this.mapCurrentLng})
        }
        if (this.mapCurrentZoom != this.zoom ) {
          console.log("CHANGED MONITOR Z",this.zoom);
          this.setZoomAction(this.mapCurrentZoom)
        }


        //console.log("MONITOR",this.lat,this.lng);
      }, 1*1000);

      //console.log(this.lng);
    },
    onResize: function () {
      this.map.resize();
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
                style : {

                    backgroundColor: '#555555',

                    strokeWidthZoomScale: function (level) {
                        return level > 17 ? 1 : level > 14 ? .5 : .25
                    },

                    styleGroups: {
                      'earth'        : [{ zIndex: 1, type: 'Polygon', fill: '#DEDEDE' }],
                      'water'        : [{ zIndex: 2, type: 'Polygon', fill: '#79CFEE' }],
                      'landuse'      : [{ zIndex: 3, type: 'Polygon', fill: '#B7E4A1' }],
                      'road_transport'        : [

                        {zIndex:4, type:"Line", stroke:"#B6B8C3", "strokeWidth":4, "strokeLinecap": "butt"},
                        {zIndex:5, type:"Line", stroke:"#C8C9CE", "strokeWidth":4, "strokeLinecap": "butt", 'strokeDasharray': [12,10]},

                      ],
                      'roads' : [
                        {zIndex:5, type:"Line", stroke:"#D6D9E6", "strokeWidth":14},
                        {zIndex:6, type:"Line", stroke:"#FFFFFF", "strokeWidth":10},
                        {zIndex:100, type:"Text", 'textRef':"properties.name", fill:"#252525", font:"normal  12px Verdana"}
                      ],
                      'roadshighway' : [
                        {zIndex:8, type:"Line", stroke:"#FFFFFF", "strokeWidth":14},
                        {zIndex:9, type:"Line", stroke:"#FDA363", "strokeWidth":10},
                        {zIndex:101, type:"Text", 'textRef':"properties.name", fill:"#252525", font:"normal 12px Verdana"}
                      ],
                      'roadsmajor_road' : [
                        {zIndex:8, type:"Line", stroke:"#FFFFFF", "strokeWidth":14},
                        {zIndex:9, type:"Line", stroke:"#F1D06B", "strokeWidth":10},
                        {zIndex:102, type:"Text", 'textRef':"properties.name", fill:"#252525", font:"normal 12px Verdana"}
                      ],

                      'buildings'    : [
                        { zIndex: 11, type: 'Polygon', stroke: "#BDBBB7","strokeWidth":1, fill: '#D6D6D6' },
                        /* { zIndex:12, type:"Text", 'textRef':"properties.kind_detail", fill:"#252525"} */
                      ]
                    },

                    assign: function (feature, level)
                    {
                        var props = feature.properties;
                        var kind  = props.kind;
                        var layer = props.layer; // the data layer of the feature
                        var geom  = feature.geometry.type;

                        //console.log(layer+ "-"+kind+"-"+geom);
                        //console.log(props);

                        if (layer == 'water') {
                            if (geom == 'LineString' ) {
                                return ;
                            }
                            if (geom == 'MultiLineString') {
                              return ;
                            }

                        }

                        if (layer== 'buildings') {

                        }
                        if (layer == 'roads') {
                            //console.log(kind);
                            if (kind == 'rail' || kind == 'ferry') {
                                return 'road_transport';
                            }
                            if (kind == 'highway') {
                                return layer + kind;
                            }
                            if (kind == 'major_road') {
                                return layer + kind;
                            }

                        }
                        return layer;
                    }
                }
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
    //maplocal.addLayer(mySpaceLayer);

    var pointLayer = new here.xyz.maps.layers.TileLayer({
        			name: 'my Point Layer',
                    min: 4,
                    max: 15,
                    provider: new here.xyz.maps.providers.LocalProvider ({
					    name:  'my Point Provider'
					}),
				    style:{
					    styleGroups: {
					    	style: [
						    	{zIndex:0, type:"Circle", "stroke": "#FFFFFF", "fill": "#6B6B6B", radius: 3},
						    	{zIndex:1, type:"Text", textRef:"properties.name", fill:"#111", offsetY: 12, font: "bold 13px ariel"}
						    ]
					    },
					    assign: function(feature){
					    	return "style";
					    }
				    }
        });
        maplocal.addLayer(pointLayer);






    console.log("spacelayer added", maplocal);
    maplocal.addObserver('zoomlevel',(name, newValue, oldValue) => {
      //console.log(name + " new: "+ newValue + " old:" + oldValue);
      this.mapCurrentZoom =  newValue;
      /*
      if (Math.abs(this.zoom - newValue) >= 1) {
        this.setZoomAction(newValue)
      }
      */


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
    this.$nextTick(function () {
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
