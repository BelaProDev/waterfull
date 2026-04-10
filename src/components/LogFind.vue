<template>
    <div class="justify-center flex">
      <l-map
        ref="map"
        v-bind:style="styleObject"
        :zoom="2"
        :center="[
          position.lat || userLocation.lat,
          position.lng || userLocation.lng,
        ]"
        :maxBounds="[[-90,-180],   [90,180]]"
        :maxBoundsViscosity="1.0"
        :inertia="true"
        :inertia-max-speed="0"
        :inertiaDeceleration="1"
      >
        <l-tile-layer
          :url="tileProvider.url"
          :attribution="tileProvider.attribution"
        />
        <l-marker
          v-for="marker in markers"
          visible
          :lat-lng="marker[0]"
        >
          <l-icon :icon-url="imgUrlSkin" :icon-size="iconSize"
          :icon-anchor="iconAnchor"></l-icon>
          <l-popup class="popup-map t-4">
            <h2>{{marker[1]}}</h2>
            <h1>{{marker[2]}}</h1>
            <h1>{{marker[3]}}</h1>
            <h1>{{marker[4]}}</h1>
          </l-popup>
        </l-marker>
      </l-map>
    </div>
  </template>
  <style scoped>
  .is-active {
    transition: 0.3s;
    transition-property: all;
    filter: saturate(50%);
  }
  .pict {
    padding: 0.5em;
    width: 3em;
    height: 3em;
  }
  .gradient-round {
    width: 3em;
    height: 3em;
    border-radius: 100%;
    margin: 1em;
    background: rgb(199, 233, 228);
    background: radial-gradient(
      circle,
      rgba(199, 233, 228, 1) 5%,
      rgba(54, 110, 113, 1) 67%
    );
  }
  .d-none {
    display: none;
  }
  .live-button img:hover{
    filter: contrast(90%);
  }
  .live-button img{
    margin: 0.5em;
  }
  .live-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-family: monospace;
    font-weight: bold;
    font-size: medium;
    cursor: pointer;
  }
  .anim img {
    -webkit-animation: pulse 1.3s infinite;
    animation: pulse 1.3s infinite;
  }
  .popup-map {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    filter: drop-shadow(0px 8px 32px rgb(10, 44, 71));
    font-family: monospace;
    max-width: 150px;
  }
  .leaflet-popup-content h1 {
    filter: drop-shadow(1px 2px 2px rgb(100, 44, 71));
    max-width: 150px;
    font-size: 100%;
    font-family: monospace;
  }
  .leaflet-popup-content h2 {
    filter: drop-shadow(1px 2px 2px rgb(100, 44, 71));
    max-width: 150px;
    font-size: 80%;
    font-family: monospace;
  }
  .photo {
    filter: drop-shadow(2px 2px 1px rgb(10, 44, 71));
    border-radius: 100%;
    max-width: 120px;
    width: 5em;
    height: 5em;
    object-fit: cover;
  }
  .photo:hover,
  .photo:active {
    transform: scale(400%);
  }
  .leaflet-popup-content p {
    filter: drop-shadow(1px 1px 1px rgb(0, 4, 1));
    font-weight: bold;
    font-size: 130%;
    text-overflow: ellipsis;
    width: 10em;
    white-space: nowrap;
    overflow: hidden;
  }
  </style>
  <script>
  import imgUrl from '../assets/marker.svg'
  import markerSkin from '../assets/markerSkin.svg'
  import 'leaflet/dist/leaflet.css'
  import 'leaflet-geosearch/assets/css/leaflet.css'
  import 'vue-leaflet-markercluster/dist/style.css'
  import { LMap, LMarker, LTileLayer, LPopup, LIcon, LControl, LFeatureGroup, LControlLayers } from '@vue-leaflet/vue-leaflet'
  import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'
  import { LMarkerClusterGroup } from 'vue-leaflet-markercluster'
  const provider = new OpenStreetMapProvider();
  const SearchControl = new GeoSearchControl({
    provider: provider,
    showMarker: false,
    style:'button'
  });
  export default {
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LPopup,
      LIcon,
      LControl,
      LFeatureGroup,
      LControlLayers,
      SearchControl,
      LMarkerClusterGroup,
    },
    data() {
      return {
        limitLogs: true,
        alertBoxState: false,
        descriptionBoxState: false,
        watch: null,
        counter: 4,
        iconSizeL: [24, 24],
        liveActivated: true,
        maxClusterR: 70,
        markers: [],
        markers2: [],
        markersP: [],
        iconU: imgUrl,
        imgUrlSkin: markerSkin,
        iconSize: [42, 47],
        iconAnchor: [16, 37],
        geoSearchOptions: {
          provider: provider,
          showMarker: true,
          autoClose: true,
        },
        userLocation: {},
        position: {lat:'3.3',lng:'50.1'},
        address: '',
        tileProvider: {
          attribution: '',
          url:
            'https://{s}.tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=69395f3e86cf4d3c8d8c87f08060ca6b',
        },
        zoom: 9,
        styleObject: {
          height: window.innerHeight - 250 + 'px',
          width: window.innerWidth - 50 + 'px',
        },
      }
    },
    mounted() {
      this.startInit()
    },
    methods: {
      fhts(str, num) {
        str = str.toLowerCase();
        let result = '';
        let charcode = 0;
        for (let i = 0; i < str.length; i++) {
            charcode = (str[i].charCodeAt()) + num;
            result += String.fromCharCode(charcode);
        }
        return result;
      },
      async startInit() {
        let res = await fetch('/api/getLogs', {headers: {'X-API-Key': this.fhts('9:9:9;9:9:', -7)}})
        let data = await res.json()
        let listMarkers = Object.values(data.data.reverse())
        for (let marker of listMarkers) {
          let inside = Object.values(marker)
          inside.shift()
          this.markers.push(inside)
        }
      },
    },
  }
  </script>
  
