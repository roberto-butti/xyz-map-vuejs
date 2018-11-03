import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    zoom: 11, //11,
    lat: 37.77956,
    lng: -122.46852,
    map: null,
    info: ""

  },
  mutations: {
    setLat(state, { lat }){
      state.lat = lat;
    },
    setLng(state, { lng }){
      state.lng = lng;
    },
    setZoom(state, { zoom }){
      state.zoom = zoom;
    },
    setMap(state, { map }){
      state.map = map;
    },
    setInfo(state, { info }){
      state.info = info;
    }

  },
  actions: {
    setLatLngAction({ commit }, { lat, lng}){
      commit({
        type: 'setLat',
        lat,
      })
      commit({
        type: 'setLng',
        lng,
      })
    },
    setZoomAction({ commit },  zoom ){
      commit({
        type: 'setZoom',
        zoom,
      })
    },
    setMapAction({ commit }, map ){
      commit({
        type: 'setMap',
        map,
      })
    },
    setInfoAction({ commit }, info ){
      commit({
        type: 'setInfo',
        info,
      })
    }
  }
})
