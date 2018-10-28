import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    zoom: 17,
    lat: 37.77956,
    lng: -122.46852,
    map: null

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
    }

  },
  actions: {
    setLatLngAction({ commit,state }, { lat, lng}){
      commit({
        type: 'setLat',
        lat,
      })

      commit({
        type: 'setLng',
        lng,
      })

      state.map.setCenter(lng, lat);
    },
    setZoomAction({ commit, state },  zoom ){

      commit({
        type: 'setZoom',
        zoom,
      })
      state.map.setZoomlevel(zoom);
    },
    setMapAction({ commit }, map ){
      commit({
        type: 'setMap',
        map,
      })
    }
  }
})
