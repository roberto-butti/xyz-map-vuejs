const myStyle = {
  backgroundColor: '#555555',
  strokeWidthZoomScale: function (level) {
    return level > 17 ? 1 : level > 14 ? .5 : .3
  },
  styleGroups: {
    'earth'        : [{ zIndex: 1, type: 'Polygon', fill: '#DEDEDE' }],
    'water'        : [{ zIndex: 2, type: 'Polygon', fill: '#79CFEE',opacity: 1 }],
    'ocean'        : [{ zIndex: 2, type: 'Polygon', fill: '#79CFEE',opacity: 0.7 }],
    'line'         : [{ zIndex: 2, type: 'Line', stroke: '#FF0000',opacity: 0.7 }],
    'pois'         : [{ zIndex: 99, type: 'Circle', radius: 3, fill: '#0000FF',opacity: 0.7 }],
    'river': [
      {
        zIndex: 3,
        type: 'Line',
        strokeWidth: 10,
        stroke: '#79CFEE',
        opacity: .5
      }
    ],
    'river_close': [
      {
        zIndex: 3,
        type: 'Line',
        strokeWidth: 10,
        stroke: '#79CFEE',
        opacity: .5
      },
      {zIndex:4, type:"Text", 'textRef':"properties.name", fill:"#252525", font:"normal 10px Verdana"}
    ],
    'dashed_boundary': [
      {
        zIndex: 5,
        type: 'Line',
        strokeWidth: 5,
        stroke: '#787878',
        strokeDasharray: [3, 4]
      }
    ],

    'region': [
      {
        zIndex: 5,
        type: 'Line',
        strokeWidth: 5,
        stroke: '#B8B2AF',
        opacity: .5
      }
    ],

    'macroregion': [
      {
        zIndex: 5,
        type: 'Line',
        strokeWidth: 3,
        stroke: '#B8B2AF',
        opacity: .5
      }
    ],
    'landuse'      : [{ zIndex: 3, type: 'Polygon', fill: '#B7E4A1' }],
    'road_transport'        : [
      {zIndex:4, type:"Line", stroke:"#B6B8C3", "strokeWidth":4, "strokeLinecap": "butt"},
      {zIndex:5, type:"Line", stroke:"#C8C9CE", "strokeWidth":4, "strokeLinecap": "butt", 'strokeDasharray': [12,10]},
    ],
    'roads' : [
      {zIndex:5, type:"Line", stroke:"#D6D9E6", "strokeWidth":6},
      {zIndex:6, type:"Line", stroke:"#FFFFFF", "strokeWidth":2},
      {zIndex:100, type:"Text", 'textRef':"properties.name", fill:"#252525", font:"normal  10px Verdana"}
    ],
    'roadshighway' : [
      {zIndex:8, type:"Line", stroke:"#FFFFFF", "strokeWidth":14},
      {zIndex:9, type:"Line", stroke:"#FDA363", "strokeWidth":10},
      {zIndex:101, type:"Text", 'textRef':"properties.name", fill:"#252525", font:"normal 12px Verdana"}
    ],
    'roadsmajor_road' : [
      {zIndex:8, type:"Line", stroke:"#FFFFFF", "strokeWidth":12},
      {zIndex:9, type:"Line", stroke:"#F1D06B", "strokeWidth":6},
      {zIndex:102, type:"Text", 'textRef':"properties.name", fill:"#252525", font:"normal 10px Verdana"}
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
        return (level > 16) ? "river_close" : "river";
      }
      if (geom == 'MultiLineString') {
        return (level > 16) ? "river_close" : "river";
      }
      switch(kind) {
        case 'water':
        case 'ocean':
        case 'lake':
          return 'water';
        case 'riverbank':
        case 'stream':
        case 'canal':
        case 'ditch':
          return (level > 16) ? "river_close" : "river";
        default:
      }
    }
    if (layer == 'pois' || layer == 'places' ) {
      if (level > 16){
        return 'pois';
      } else {
        return ;
      }

    }
    if (layer == 'transit') {
      return 'line';
    }

    if (layer === 'boundaries') {
      if (kind === 'country') {
        return kind;
      }
      // had an error that using || to combine all the dashed_boundary lines and it turned ALL countries into dashed lines... so there's a reason these are separated!
      if (kind === 'disputed') {
        return 'dashed_boundary';
      }
      if (kind === 'line_of_control') {
        return 'dashed_boundary';
      }
      if (kind === 'indefinite') {
        return 'dashed_boundary';
      }
      if (kind === 'indeterminate') {
        return 'dashed_boundary';
      }
      //later todo might be fixing the weird tilezen data transition with GB
      if (kind === 'region' || kind === 'macroregion') {
        if (props.min_zoom <= 5) {
          if (level > 4) {
            return kind;
          }
        }
        if (props.min_zoom >= 5) {
          if (level >= 8) {
            return kind;
          }
        }
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
};

export default myStyle;
