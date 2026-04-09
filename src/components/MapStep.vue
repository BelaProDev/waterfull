<template>
  <div class="justify-center flex">
    <l-map
      @click="reset()"
      @update:bounds="xtra()"
      @update:center="refresh()"
      ref="map"
      v-bind:style="styleObject"
      :zoom="zoom"
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
      <l-control-layers 
        position="topright"
        :collapsed="false"
        :sort-layers="false">
      </l-control-layers>
      <l-control position="bottomright">
        <div
        :class="liveActivated ? 'anim' : 'is-active'"
        class="live-button border border-2 border-gray-400 rounded-md p-1.5 drop-shadow-md bg-white"
        @click="liveActivated = !liveActivated"
        >
          <img class="w-8" src="https://cdn-icons-png.flaticon.com/512/1679/1679916.png" alt="" />
        </div>
      </l-control>
      <l-marker ref="liveMarker"
      visible
      :lat-lng="[
        position.lat || userLocation.lat,
        position.lng || userLocation.lng,
      ]"
      >
        <l-icon
          :icon-size="iconSizeL" 
          icon-url="https://cdn-icons-png.flaticon.com/512/1783/1783356.png"
        />
      </l-marker>
      <l-feature-group 
      layer-type="overlay"
      :name="$t('map.userData')">
      <l-marker-cluster-group :maxClusterRadius="maxClusterR">
        <l-marker
          v-for="marker in markers"
          :key="marker[7]"
          visible
          @click="reset()"
          :lat-lng="marker[4]"
        >
          <l-icon :icon-url="iconU" :icon-size="iconSize"
          :icon-anchor="iconAnchor"></l-icon>
          <l-popup class="popup-map t-4">
            <img
              v-if="marker[5].substring(0, 4) == 'http'"
              class="photo"
              v-bind:src="marker[5]"
            />
            <div class="flex flex-row justify-center">
              <div
                v-bind:class="marker[1][0] ? '' : 'd-none'"
                class="gradient-round"
              >
                <img class="pict" src="../assets/steps/walk.svg" />
              </div>
              <div
                v-bind:class="marker[1][1] ? '' : 'd-none'"
                class="gradient-round"
              >
                <img class="pict" src="../assets/steps/car.svg" />
              </div>
              <div
                v-bind:class="marker[2] ? '' : 'd-none'"
                class="gradient-round"
              >
                <img class="pict" src="../assets/steps/tap.svg" />
              </div>
              <div
                v-bind:class="marker[2] ? 'd-none' : ''"
                class="gradient-round"
              >
                <img class="pict" src="../assets/steps/source.svg" />
              </div>
            </div>
            <h1>
              {{ marker[3] ? $t('map.drinkable') : $t('map.notdrinkable') }}
            </h1>
            <div v-if="marker[6].length > 3">
              <div class='my-4' @click="description(marker[6])">
                <button class="popup-map bg-white hover:bg-gray-100 text-gray-800 py-1 px-4 border border-gray-600 rounded shadow"><span>{{ $t('map.more') }}</span></button>
              </div>
            </div>
          </l-popup>
        </l-marker>
      </l-marker-cluster-group>
    </l-feature-group>
    <l-feature-group 
      layer-type="overlay"
      :name="$t('map.notdrinkable')">
      <l-marker-cluster-group :maxClusterRadius="maxClusterR">
        <l-marker
          v-for="marker in markers2"
          :key="marker[7]"
          visible
          @click="reset()"
          :lat-lng="marker[4]"
        >
          <l-icon :icon-url="iconU" :icon-size="iconSize"
          :icon-anchor="iconAnchor"></l-icon>
          <l-popup class="popup-map t-4">
            <img
              v-if="marker[5].substring(0, 4) == 'http'"
              class="photo"
              v-bind:src="marker[5]"
            />
            <div class="flex flex-row justify-center">
              <div
                v-bind:class="marker[1][0] ? '' : 'd-none'"
                class="gradient-round"
              >
                <img class="pict" src="../assets/steps/walk.svg" />
              </div>
              <div
                v-bind:class="marker[1][1] ? '' : 'd-none'"
                class="gradient-round"
              >
                <img class="pict" src="../assets/steps/car.svg" />
              </div>
              <div
                v-bind:class="marker[2] ? '' : 'd-none'"
                class="gradient-round"
              >
                <img class="pict" src="../assets/steps/tap.svg" />
              </div>
              <div
                v-bind:class="marker[2] ? 'd-none' : ''"
                class="gradient-round"
              >
                <img class="pict" src="../assets/steps/source.svg" />
              </div>
            </div>
            <h1>
              {{ marker[3] ? $t('map.drinkable') : $t('map.notdrinkable') }}
            </h1>
            <div v-if="marker[6].length > 3">
              <div class='my-4' @click="description(marker[6])">
                <button class="popup-map bg-white hover:bg-gray-100 text-gray-800 py-1 px-4 border border-gray-600 rounded shadow"><span>{{ $t('map.more') }}</span></button>
              </div>
            </div>
          </l-popup>
        </l-marker>
      </l-marker-cluster-group>
    </l-feature-group>
    <l-feature-group 
      layer-type="overlay"
      :name="$t('map.openData')">
      <l-marker-cluster-group :maxClusterRadius="maxClusterR" ref="newCluster">
        <l-marker
          v-for="marker in markersP" ref="xtraG"
          visible
          @click="reset()"
          :lat-lng="marker[0]"
        >
          <l-icon :icon-url="iconLight" :icon-size="iconSize"
          :icon-anchor="iconAnchor"></l-icon>
          <l-popup class="t-4">
            <div v-for="item in marker[2]">
              <img
                v-if="item.substring(0, 4) == 'http'"
                class="photo"
                :src="imageUrl || item"
                @error="imageUrl='https://cdn-icons-png.flaticon.com/512/12696/12696524.png'"
              />
            </div>
            <div
                v-bind:class="marker[4] ? '' : 'd-none'"
                class="gradient-round"
              >
                <img class="pict" src="../assets/steps/source.svg" />
              </div>
              <div
                v-bind:class="marker[5] ? '' : 'd-none'"
                class="gradient-round"
              >
                <img class="pict" src="../assets/steps/tap.svg" />
              </div>
            <h1 class="text-xs" v-if="marker[6] != ''" style="margin-top: 0.3em;">{{ marker[6] }}</h1>
            <h1 style="font-size: 1em; margin-top: 1em;">{{ marker[3] ? $t('map.drinkable') : $t('map.notdrinkable') }}</h1>
            <h1 style="font-size: 1em; margin-top: 1em;" v-for="tag in marker[1].slice(0,2)">{{tag}}</h1>
            <div v-if="marker[1].length > 2">
              <div class='my-4' @click="alert(marker[1].slice(2))">
                <button class="popup-map bg-white hover:bg-gray-100 text-gray-800 py-1 px-4 border border-gray-600 rounded shadow"><span>{{ $t('map.more') }}</span></button>
              </div>
            </div>
          </l-popup>
        </l-marker>
      </l-marker-cluster-group>
    </l-feature-group>
    <l-marker visible :lat-lng="setPos">
      <l-icon :icon-url="iconSkin" :icon-size="iconSizeSkin" :icon-anchor="iconAnchor"></l-icon>
    </l-marker>
    </l-map>
  </div>
  <button @click="setToLive()" class="border border-gray-300 p-2 my-2 rounded-md ring-blue-200 bg-white">{{ $t('addSteps.step4.text5') }}</button>
    <div :class="alertBoxState ? '' : 'd-none'" class='font-mono text-white w-80 border border-gray-600 rounded p-2 m-4 whitespace-pre-wrap' ref="alertBox"></div>
    <div :class="descriptionBoxState ? '' : 'd-none'" class='font-mono text-white w-80 border border-gray-600 rounded p-2 m-4 whitespace-pre-wrap'  ref="descrBox"></div>
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
  font-size: 120%;
  font-weight: bold;
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
@-webkit-keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  94% {
    transform: scale(1.3);
    opacity: 0.5;
  }
  99% {
    transform: scale(1.5);
    opacity: 0;
  }
  100% {
    transform: scale(.7);
    opacity: 0.7;
  }
}
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  94% {
    transform: scale(1.3);
    opacity: 0.5;
  }
  99% {
    transform: scale(1.5);
    opacity: 0;
  }
  100% {
    transform: scale(.7);
    opacity: 0.7;
  }
}
</style>
<script>
import imgUrl from '../assets/marker.svg'
import imgUrlLight from '../assets/markerLight.svg'
import imgUrlSkin from '../assets/markerSkin.svg'
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
      iconLight: imgUrlLight,
      iconSkin: imgUrlSkin,
      iconSizeSkin: [52, 57],
      iconSize: [32, 37],
      iconAnchor: [16, 37],
      geoSearchOptions: {
        provider: provider,
        showMarker: true,
        autoClose: true,
      },
      userLocation: {},
      setPos: { lat: '33.3', lng: '22.2' },
      position: {},
      address: '',
      tileProvider: {
        attribution: '',
        url:
          'https://{s}.tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=69395f3e86cf4d3c8d8c87f08060ca6b',
      },
      zoom: 9,
      styleObject: {
        height: window.innerHeight - 380 + 'px',
        width: window.innerWidth - 50 + 'px',
      },
    }
  },
  beforeMount() {
    this.position = {
      lat: this.getCountry()[0],
      lng: this.getCountry()[1],
    }
    this.setPos = {
      lat: this.getCountry()[0],
      lng: this.getCountry()[1],
    }
    this.$emit('coor', this.setPos)
  },
  mounted() {
    this.startInit()
  },
  unmounted() {
    navigator.geolocation.clearWatch(this.watch)
  },
  emits: ['coor'],
  methods: {
    reset() {
      this.$refs.descrBox.textContent = ''
      this.$refs.alertBox.textContent = ''
      this.descriptionBoxState = false
      this.alertBoxState = false
    },
    description(item) {
      this.descriptionBoxState = true
      if (this.$refs.descrBox.textContent == '') {
        this.$refs.descrBox.textContent = item
      }
    },
    alert(item) {
      this.alertBoxState = true
      if (this.$refs.alertBox.textContent == '') {
        for (let e of item) {
          this.$refs.alertBox.textContent += e+'\r\n'
        }
      }
    },
    setToLive() {
      this.reset()
      this.$refs.map.leafletObject.setView(this.userLocation, 18)
      this.setPos = this.userLocation
      this.$emit('coor', this.setPos)
    },
    refresh() {
      this.reset()
      this.setPos = this.$refs.map.leafletObject.getCenter()
      this.$emit('coor', this.$refs.map.leafletObject.getCenter())
    },
    async xtra() {
      this.reset()
      this.counter++
      if (this.counter > 2) {
        this.counter = 0
        let bounds = this.$refs.map.leafletObject.getBounds()
        let ne = bounds.getNorthEast();
        let sw = bounds.getSouthWest();
        bounds = '('+sw.lat.toString()+','+sw.lng.toString()+','+ne.lat.toString()+','+ne.lng.toString()+')'
        let result = await fetch(
          'https://overpass-api.de/api/interpreter',
          {
            method: 'POST',
            body: 'data='+ encodeURIComponent(`
              [timeout:1]
              [out:json];
              (
              node[amenity=drinking_water]`+bounds+`;
              node[drinking_water=yes]`+bounds+`;
              );
              out body;
            `)
          },
        )
        let dataP = await result.json()
        for (let marker of dataP.elements) {
          let cel = []
          cel[0] = marker.lat.toString()
          cel[1] = marker.lon.toString()
          let cell = []
          let img = ['']
          let drkbl = false
          let spring = false
          let tap = false
          let name = ''
          for (let [k, t] of Object.entries(marker.tags)) {
            if (k != 'name:'+this.$i18n.availableLocales[2] && k != 'name:'+this.$i18n.availableLocales[1] && k != 'name:'+this.$i18n.availableLocales[0] && k != 'name' && k != 'image' && k != 'image:0' && k != 'image:1' && k != 'mapillary' && k != 'mapillary_url' && k != 'amenity' && k != 'drinking_water' && k != 'natural' && k != 'man_made') {
              cell.push(k+': '+t)
            } else {
              switch (k) {
                case 'name:'+this.$i18n.availableLocales[2]: if(this.$i18n.availableLocales[2] == this.$i18n.locale)name = t;break;
                case 'name:'+this.$i18n.availableLocales[1]: if(this.$i18n.availableLocales[1] == this.$i18n.locale)name = t;break;
                case 'name:'+this.$i18n.availableLocales[0]: if(this.$i18n.availableLocales[0] == this.$i18n.locale)name = t;break;
                case 'name': name = t;break;
                case 'image': img.push(t);break;
                case 'image:0': break;
                case 'image:1': break;
                case 'image:2': break;
                case 'image:3': break;
                case 'image:4': break;
                case 'mapillary': break;
                case 'mapillary_url': break;
                case 'amenity': drkbl = true;break;
                case 'drinking_water': drkbl = true;break;
                case 'natural': if (t == 'spring') spring = true;break;
                case 'man_made': tap = true;break;
              }
            }
          }
          let celll = []
          celll[0] = cel
          celll[1] = cell
          celll[2] = img
          celll[3] = drkbl
          celll[4] = spring
          celll[5] = tap
          celll[6] = name
          this.markersP.push(celll)
        }
        if (typeof this.$refs.xtraG != 'undefined') {
          for (let e of this.$refs.xtraG) {
            this.$refs.newCluster.leafletObject.removeLayer(e.leafletObject)
            this.$refs.map.leafletObject.removeLayer(e.leafletObject)
          }
        }
      }
    },
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
      let res = await fetch('/api/getMarkers', {headers: {'X-API-Key': this.fhts('9:9:9;9:9:', -7)}})
      let data = await res.json()
      let listMarkers = Object.values(data.data.reverse())
      for (let marker of listMarkers) {
        let inside = Object.values(marker)
        inside.unshift(0)
        if (inside[3]) (
            this.markers.push(inside)
        ); else {
          this.markers2.push(inside)
        }
      }
        if (navigator.geolocation) {
          this.watch = navigator.geolocation.watchPosition(pos => {
            if (this.liveActivated) {
              this.$refs.map.leafletObject.addLayer(this.$refs.liveMarker.leafletObject)
              this.userLocation = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              }
              this.position = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              }
              this.opacity = 1
              this.zoom = 18
              if (this.limitLogs) {
                fetch('/api/logs', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.fhts('9:9:9;9:9:', -7)
                  },
                  body: JSON.stringify({
                    latlng: [this.userLocation.lat, this.userLocation.lng],
                    timestamp: Date.now(),
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    locale: Intl.DateTimeFormat().resolvedOptions().locale,
                    page: 'add'
                  }),
                })
                this.limitLogs = false 
              }
            } else {
              this.$refs.map.leafletObject.removeLayer(this.$refs.liveMarker.leafletObject)
            }
          })
        }
        this.$refs.map.leafletObject.addControl(SearchControl) //SearchControl.addTo(this.$refs.map.leafletObject)
    },
    getCountry() {
      let countries = {
        AD: ['42.546245','1.601554'],
        AE: ['23.424076','53.847818'],
        AF: ['33.93911','67.709953'],
        AG: ['17.060816','-61.796428'],
        AI: ['18.220554','-63.068615'],
        AL: ['41.153332','20.168331'],
        AM: ['40.069099','45.038189'],
        AN: ['12.226079','-69.060087'],
        AO: ['-11.202692','17.873887'],
        AQ: ['-75.250973','-0.071389'],
        AR: ['-38.416097','-63.61667'],
        AS: ['-14.270972','-170.1322'],
        AT: ['47.516231','14.550072'],
        AU: ['-25.274398','133.77513'],
        AW: ['12.52111','-69.968338'],
        AZ: ['40.143105','47.576927'],
        BA: ['43.915886','17.679076'],
        BB: ['13.193887','-59.543198'],
        BD: ['23.684994','90.356331'],
        BE: ['50.503887','4.469936'],
        BF: ['12.238333','-1.561593'],
        BG: ['42.733883','25.48583'],
        BH: ['25.930414','50.637772'],
        BI: ['-3.373056','29.918886'],
        BJ: ['9.30769','2.315834'],
        BM: ['32.321384','-64.75737'],
        BN: ['4.535277','114.727669'],
        BO: ['-16.290154','-63.58865'],
        BR: ['-14.235004','-51.92528'],
        BS: ['25.03428','-77.39628'],
        BT: ['27.514162','90.433601'],
        BV: ['-54.423199','3.413194'],
        BW: ['-22.328474','24.684866'],
        BY: ['53.709807','27.953389'],
        BZ: ['17.189877','-88.49765'],
        CA: ['56.130366','-106.34677'],
        CC: ['-12.164165','96.870956'],
        CD: ['-4.038333','21.758664'],
        CF: ['6.611111','20.939444'],
        CG: ['-0.228021','15.827659'],
        CH: ['46.818188','8.227512'],
        CI: ['7.539989','-5.54708'],
        CK: ['-21.236736','-159.7776'],
        CL: ['-35.675147','-71.54296'],
        CM: ['7.369722','12.354722'],
        CN: ['35.86166','104.195397'],
        CO: ['4.570868','-74.297333'],
        CR: ['9.748917','-83.753428'],
        CU: ['21.521757','-77.781167'],
        CV: ['16.002082','-24.013197'],
        CX: ['-10.447525','105.69044'],
        CY: ['35.126413','33.429859'],
        CZ: ['49.817492','15.472962'],
        DE: ['51.165691','10.451526'],
        DJ: ['11.825138','42.590275'],
        DK: ['56.26392','9.501785'],
        DM: ['15.414999','-61.370976'],
        DO: ['18.735693','-70.162651'],
        DZ: ['28.033886','1.659626'],
        EC: ['-1.831239','-78.183406'],
        EE: ['58.595272','25.013607'],
        EG: ['26.820553','30.802498'],
        EH: ['24.215527','-12.885834'],
        ER: ['15.179384','39.782334'],
        ES: ['40.463667','-3.74922'],
        ET: ['9.145','40.489673'],
        FI: ['61.92411','25.748151'],
        FJ: ['-16.578193','179.41441'],
        FK: ['-51.796253','-59.52361'],
        FM: ['7.425554','150.550812'],
        FO: ['61.892635','-6.911806'],
        FR: ['46.227638','2.213749'],
        GA: ['-0.803689','11.609444'],
        GB: ['55.378051','-3.435973'],
        GD: ['12.262776','-61.604171'],
        GE: ['42.315407','43.356892'],
        GF: ['3.933889','-53.125782'],
        GG: ['49.465691','-2.585278'],
        GH: ['7.946527','-1.023194'],
        GI: ['36.137741','-5.345374'],
        GL: ['71.706936','-42.604303'],
        GM: ['13.443182','-15.310139'],
        GN: ['9.945587','-9.696645'],
        GP: ['16.995971','-62.067641'],
        GQ: ['1.650801','10.267895'],
        GR: ['39.074208','21.824312'],
        GS: ['-54.429579','-36.58790'],
        GT: ['15.783471','-90.230759'],
        GU: ['13.444304','144.793731'],
        GW: ['11.803749','-15.180413'],
        GY: ['4.860416','-58.93018'],
        GZ: ['31.354676','34.308825'],
        HK: ['22.396428','114.109497'],
        HM: ['-53.08181','73.504158'],
        HN: ['15.199999','-86.24190'],
        HR: ['45.1','15.2'],
        HT: ['18.971187','-72.28521'],
        HU: ['47.162494','19.503304'],
        ID: ['-0.789275','113.921327'],
        IE: ['53.41291','-8.24389'],
        IL: ['31.046051','34.851612'],
        IM: ['54.236107','-4.548056'],
        IN: ['20.593684','78.96288'],
        IO: ['-6.343194','71.876519'],
        IQ: ['33.223191','43.679291'],
        IR: ['32.427908','53.688046'],
        IS: ['64.963051','-19.020835'],
        IT: ['41.87194','12.56738'],
        JE: ['49.214439','-2.13125'],
        JM: ['18.109581','-77.297508'],
        JO: ['30.585164','36.238414'],
        JP: ['36.204824','138.252924'],
        KE: ['-0.023559','37.906193'],
        KG: ['41.20438','74.766098'],
        KH: ['12.565679','104.990963'],
        KI: ['-3.370417','-168.73403'],
        KM: ['-11.875001','43.872219'],
        KN: ['17.357822','-62.782998'],
        KP: ['40.339852','127.510093'],
        KR: ['35.907757','127.766922'],
        KW: ['29.31166','47.481766'],
        KY: ['19.513469','-80.566956'],
        KZ: ['48.019573','66.923684'],
        LA: ['19.85627','102.495496'],
        LB: ['33.854721','35.862285'],
        LC: ['13.909444','-60.978893'],
        LI: ['47.166','9.555373'],
        LK: ['7.873054','80.771797'],
        LR: ['6.428055','-9.429499'],
        LS: ['-29.609988','28.233608'],
        LT: ['55.169438','23.881275'],
        LU: ['49.815273','6.129583'],
        LV: ['56.879635','24.603189'],
        LY: ['26.3351','17.228331'],
        MA: ['31.791702','-7.09262'],
        MC: ['43.750298','7.412841'],
        MD: ['47.411631','28.369885'],
        ME: ['42.708678','19.37439'],
        MG: ['-18.766947','46.869107'],
        MH: ['7.131474','171.184478'],
        MK: ['41.608635','21.745275'],
        ML: ['17.570692','-3.996166'],
        MM: ['21.913965','95.956223'],
        MN: ['46.862496','103.846656'],
        MO: ['22.198745','113.543873'],
        MP: ['17.33083','145.38469'],
        MQ: ['14.641528','-61.024174'],
        MR: ['21.00789','-10.940835'],
        MS: ['16.742498','-62.187366'],
        MT: ['35.937496','14.375416'],
        MU: ['-20.348404','57.552152'],
        MV: ['3.202778','73.22068'],
        MW: ['-13.254308','34.301525'],
        MX: ['23.634501','-102.55278'],
        MY: ['4.210484','101.975766'],
        MZ: ['-18.665695','35.529562'],
        NA: ['-22.95764','18.49041'],
        NC: ['-20.904305','165.61804'],
        NE: ['17.607789','8.081666'],
        NF: ['-29.040835','167.95471'],
        NG: ['9.081999','8.675277'],
        NI: ['12.865416','-85.207229'],
        NL: ['52.132633','5.291266'],
        NO: ['60.472024','8.468946'],
        NP: ['28.394857','84.124008'],
        NR: ['-0.522778','166.931503'],
        NU: ['-19.054445','-169.8672'],
        NZ: ['-40.900557','174.88597'],
        OM: ['21.512583','55.923255'],
        PA: ['8.537981','-80.782127'],
        PE: ['-9.189967','-75.015152'],
        PF: ['-17.679742','-149.4068'],
        PG: ['-6.314993','143.95555'],
        PH: ['12.879721','121.774017'],
        PK: ['30.375321','69.345116'],
        PL: ['51.919438','19.145136'],
        PM: ['46.941936','-56.27111'],
        PN: ['-24.703615','-127.4393'],
        PR: ['18.220833','-66.590149'],
        PS: ['31.952162','35.233154'],
        PT: ['39.399872','-8.224454'],
        PW: ['7.51498','134.58252'],
        PY: ['-23.442503','-58.44383'],
        QA: ['25.354826','51.183884'],
        RE: ['-21.115141','55.536384'],
        RO: ['45.943161','24.96676'],
        RS: ['44.016521','21.005859'],
        RU: ['61.52401','105.318756'],
        RW: ['-1.940278','29.873888'],
        SA: ['23.885942','45.079162'],
        SB: ['-9.64571','160.156194'],
        SC: ['-4.679574','55.491977'],
        SD: ['12.862807','30.217636'],
        SE: ['60.128161','18.643501'],
        SG: ['1.352083','103.819836'],
        SH: ['-24.143474','-10.0306'],
        SI: ['46.151241','14.995463'],
        SJ: ['77.553604','23.670272'],
        SK: ['48.669026','19.699024'],
        SL: ['8.460555','-11.779889'],
        SM: ['43.94236','12.457777'],
        SN: ['14.497401','-14.452362'],
        SO: ['5.152149','46.199616'],
        SR: ['3.919305','-56.027783'],
        ST: ['0.18636','6.613081'],
        SV: ['13.794185','-88.89653'],
        SY: ['34.802075','38.996815'],
        SZ: ['-26.522503','31.465866'],
        TC: ['21.694025','-71.797928'],
        TD: ['15.454166','18.732207'],
        TF: ['-49.280366','69.348557'],
        TG: ['8.619543','0.824782'],
        TH: ['15.870032','100.992541'],
        TJ: ['38.861034','71.276093'],
        TK: ['-8.967363','-171.85588'],
        TL: ['-8.874217','125.727539'],
        TM: ['38.969719','59.556278'],
        TN: ['33.886917','9.537499'],
        TO: ['-21.178986','-175.1982'],
        TR: ['38.963745','35.243322'],
        TT: ['10.691803','-61.222503'],
        TV: ['-7.109535','177.64933'],
        TW: ['23.69781','120.960515'],
        TZ: ['-6.369028','34.888822'],
        UA: ['48.379433','31.16558'],
        UG: ['1.373333','32.290275'],
        UM: ['19.2823','','166.6470'],
        US: ['37.09024','-95.712891'],
        UY: ['-32.522779','-55.76583'],
        UZ: ['41.377491','64.585262'],
        VA: ['41.902916','12.453389'],
        VC: ['12.984305','-61.28722'],
        VE: ['6.42375','-66.58973'],
        VG: ['18.420695','-64.639968'],
        VI: ['18.335765','-64.896335'],
        VN: ['14.058324','108.277199'],
        VU: ['-15.376706','166.95915'],
        WF: ['-13.768752','-177.1560'],
        WS: ['-13.759029','-172.1046'],
        XK: ['42.602636','20.902977'],
        YE: ['15.552727','48.516388'],
        YT: ['-12.8275','45.166244'],
        ZA: ['-30.559482','22.937506'],
        ZM: ['-13.133897','27.849332'],
        ZW: ['-19.015438','29.154857']
      };
      let timezones = {
        "Africa/Abidjan": {
          u: 0,
          c: ["CI", "BF", "GH", "GM", "GN", "ML", "MR", "SH", "SL", "SN", "TG"]
        },
        "Africa/Accra": {
          a: "Africa/Abidjan",
          c: ["GH"],
          r: 1
        },
        "Africa/Addis_Ababa": {
          a: "Africa/Nairobi",
          c: ["ET"],
          r: 1
        },
        "Africa/Algiers": {
          u: 60,
          c: ["DZ"]
        },
        "Africa/Asmara": {
          a: "Africa/Nairobi",
          c: ["ER"],
          r: 1
        },
        "Africa/Asmera": {
          a: "Africa/Nairobi",
          c: ["ER"],
          r: 1
        },
        "Africa/Bamako": {
          a: "Africa/Abidjan",
          c: ["ML"],
          r: 1
        },
        "Africa/Bangui": {
          a: "Africa/Lagos",
          c: ["CF"],
          r: 1
        },
        "Africa/Banjul": {
          a: "Africa/Abidjan",
          c: ["GM"],
          r: 1
        },
        "Africa/Bissau": {
          u: 0,
          c: ["GW"]
        },
        "Africa/Blantyre": {
          a: "Africa/Maputo",
          c: ["MW"],
          r: 1
        },
        "Africa/Brazzaville": {
          a: "Africa/Lagos",
          c: ["CG"],
          r: 1
        },
        "Africa/Bujumbura": {
          a: "Africa/Maputo",
          c: ["BI"],
          r: 1
        },
        "Africa/Cairo": {
          u: 120,
          c: ["EG"]
        },
        "Africa/Casablanca": {
          u: 60,
          d: 0,
          c: ["MA"]
        },
        "Africa/Ceuta": {
          u: 60,
          d: 120,
          c: ["ES"]
        },
        "Africa/Conakry": {
          a: "Africa/Abidjan",
          c: ["GN"],
          r: 1
        },
        "Africa/Dakar": {
          a: "Africa/Abidjan",
          c: ["SN"],
          r: 1
        },
        "Africa/Dar_es_Salaam": {
          a: "Africa/Nairobi",
          c: ["TZ"],
          r: 1
        },
        "Africa/Djibouti": {
          a: "Africa/Nairobi",
          c: ["DJ"],
          r: 1
        },
        "Africa/Douala": {
          a: "Africa/Lagos",
          c: ["CM"],
          r: 1
        },
        "Africa/El_Aaiun": {
          u: 60,
          d: 0,
          c: ["EH"]
        },
        "Africa/Freetown": {
          a: "Africa/Abidjan",
          c: ["SL"],
          r: 1
        },
        "Africa/Gaborone": {
          a: "Africa/Maputo",
          c: ["BW"],
          r: 1
        },
        "Africa/Harare": {
          a: "Africa/Maputo",
          c: ["ZW"],
          r: 1
        },
        "Africa/Johannesburg": {
          u: 120,
          c: ["ZA", "LS", "SZ"]
        },
        "Africa/Juba": {
          u: 120,
          c: ["SS"]
        },
        "Africa/Kampala": {
          a: "Africa/Nairobi",
          c: ["UG"],
          r: 1
        },
        "Africa/Khartoum": {
          u: 120,
          c: ["SD"]
        },
        "Africa/Kigali": {
          a: "Africa/Maputo",
          c: ["RW"],
          r: 1
        },
        "Africa/Kinshasa": {
          a: "Africa/Lagos",
          c: ["CD"],
          r: 1
        },
        "Africa/Lagos": {
          u: 60,
          c: ["NG", "AO", "BJ", "CD", "CF", "CG", "CM", "GA", "GQ", "NE"]
        },
        "Africa/Libreville": {
          a: "Africa/Lagos",
          c: ["GA"],
          r: 1
        },
        "Africa/Lome": {
          a: "Africa/Abidjan",
          c: ["TG"],
          r: 1
        },
        "Africa/Luanda": {
          a: "Africa/Lagos",
          c: ["AO"],
          r: 1
        },
        "Africa/Lubumbashi": {
          a: "Africa/Maputo",
          c: ["CD"],
          r: 1
        },
        "Africa/Lusaka": {
          a: "Africa/Maputo",
          c: ["ZM"],
          r: 1
        },
        "Africa/Malabo": {
          a: "Africa/Lagos",
          c: ["GQ"],
          r: 1
        },
        "Africa/Maputo": {
          u: 120,
          c: ["MZ", "BI", "BW", "CD", "MW", "RW", "ZM", "ZW"]
        },
        "Africa/Maseru": {
          a: "Africa/Johannesburg",
          c: ["LS"],
          r: 1
        },
        "Africa/Mbabane": {
          a: "Africa/Johannesburg",
          c: ["SZ"],
          r: 1
        },
        "Africa/Mogadishu": {
          a: "Africa/Nairobi",
          c: ["SO"],
          r: 1
        },
        "Africa/Monrovia": {
          u: 0,
          c: ["LR"]
        },
        "Africa/Nairobi": {
          u: 180,
          c: ["KE", "DJ", "ER", "ET", "KM", "MG", "SO", "TZ", "UG", "YT"]
        },
        "Africa/Ndjamena": {
          u: 60,
          c: ["TD"]
        },
        "Africa/Niamey": {
          a: "Africa/Lagos",
          c: ["NE"],
          r: 1
        },
        "Africa/Nouakchott": {
          a: "Africa/Abidjan",
          c: ["MR"],
          r: 1
        },
        "Africa/Ouagadougou": {
          a: "Africa/Abidjan",
          c: ["BF"],
          r: 1
        },
        "Africa/Porto-Novo": {
          a: "Africa/Lagos",
          c: ["BJ"],
          r: 1
        },
        "Africa/Sao_Tome": {
          u: 0,
          c: ["ST"]
        },
        "Africa/Timbuktu": {
          a: "Africa/Abidjan",
          c: ["ML"],
          r: 1
        },
        "Africa/Tripoli": {
          u: 120,
          c: ["LY"]
        },
        "Africa/Tunis": {
          u: 60,
          c: ["TN"]
        },
        "Africa/Windhoek": {
          u: 120,
          c: ["NA"]
        },
        "America/Adak": {
          u: -600,
          d: -540,
          c: ["US"]
        },
        "America/Anchorage": {
          u: -540,
          d: -480,
          c: ["US"]
        },
        "America/Anguilla": {
          a: "America/Puerto_Rico",
          c: ["AI"],
          r: 1
        },
        "America/Antigua": {
          a: "America/Puerto_Rico",
          c: ["AG"],
          r: 1
        },
        "America/Araguaina": {
          u: -180,
          c: ["BR"]
        },
        "America/Argentina/Buenos_Aires": {
          u: -180,
          c: ["AR"]
        },
        "America/Argentina/Catamarca": {
          u: -180,
          c: ["AR"]
        },
        "America/Argentina/ComodRivadavia": {
          a: "America/Argentina/Catamarca",
          r: 1
        },
        "America/Argentina/Cordoba": {
          u: -180,
          c: ["AR"]
        },
        "America/Argentina/Jujuy": {
          u: -180,
          c: ["AR"]
        },
        "America/Argentina/La_Rioja": {
          u: -180,
          c: ["AR"]
        },
        "America/Argentina/Mendoza": {
          u: -180,
          c: ["AR"]
        },
        "America/Argentina/Rio_Gallegos": {
          u: -180,
          c: ["AR"]
        },
        "America/Argentina/Salta": {
          u: -180,
          c: ["AR"]
        },
        "America/Argentina/San_Juan": {
          u: -180,
          c: ["AR"]
        },
        "America/Argentina/San_Luis": {
          u: -180,
          c: ["AR"]
        },
        "America/Argentina/Tucuman": {
          u: -180,
          c: ["AR"]
        },
        "America/Argentina/Ushuaia": {
          u: -180,
          c: ["AR"]
        },
        "America/Aruba": {
          a: "America/Puerto_Rico",
          c: ["AW"],
          r: 1
        },
        "America/Asuncion": {
          u: -240,
          d: -180,
          c: ["PY"]
        },
        "America/Atikokan": {
          a: "America/Panama",
          c: ["CA"],
          r: 1
        },
        "America/Atka": {
          a: "America/Adak",
          r: 1
        },
        "America/Bahia": {
          u: -180,
          c: ["BR"]
        },
        "America/Bahia_Banderas": {
          u: -360,
          d: -300,
          c: ["MX"]
        },
        "America/Barbados": {
          u: -240,
          c: ["BB"]
        },
        "America/Belem": {
          u: -180,
          c: ["BR"]
        },
        "America/Belize": {
          u: -360,
          c: ["BZ"]
        },
        "America/Blanc-Sablon": {
          a: "America/Puerto_Rico",
          c: ["CA"],
          r: 1
        },
        "America/Boa_Vista": {
          u: -240,
          c: ["BR"]
        },
        "America/Bogota": {
          u: -300,
          c: ["CO"]
        },
        "America/Boise": {
          u: -420,
          d: -360,
          c: ["US"]
        },
        "America/Buenos_Aires": {
          a: "America/Argentina/Buenos_Aires",
          r: 1
        },
        "America/Cambridge_Bay": {
          u: -420,
          d: -360,
          c: ["CA"]
        },
        "America/Campo_Grande": {
          u: -240,
          c: ["BR"]
        },
        "America/Cancun": {
          u: -300,
          c: ["MX"]
        },
        "America/Caracas": {
          u: -240,
          c: ["VE"]
        },
        "America/Catamarca": {
          a: "America/Argentina/Catamarca",
          r: 1
        },
        "America/Cayenne": {
          u: -180,
          c: ["GF"]
        },
        "America/Cayman": {
          a: "America/Panama",
          c: ["KY"],
          r: 1
        },
        "America/Chicago": {
          u: -360,
          d: -300,
          c: ["US"]
        },
        "America/Chihuahua": {
          u: -420,
          d: -360,
          c: ["MX"]
        },
        "America/Coral_Harbour": {
          a: "America/Panama",
          c: ["CA"],
          r: 1
        },
        "America/Cordoba": {
          a: "America/Argentina/Cordoba",
          r: 1
        },
        "America/Costa_Rica": {
          u: -360,
          c: ["CR"]
        },
        "America/Creston": {
          a: "America/Phoenix",
          c: ["CA"],
          r: 1
        },
        "America/Cuiaba": {
          u: -240,
          c: ["BR"]
        },
        "America/Curacao": {
          a: "America/Puerto_Rico",
          c: ["CW"],
          r: 1
        },
        "America/Danmarkshavn": {
          u: 0,
          c: ["GL"]
        },
        "America/Dawson": {
          u: -420,
          c: ["CA"]
        },
        "America/Dawson_Creek": {
          u: -420,
          c: ["CA"]
        },
        "America/Denver": {
          u: -420,
          d: -360,
          c: ["US"]
        },
        "America/Detroit": {
          u: -300,
          d: -240,
          c: ["US"]
        },
        "America/Dominica": {
          a: "America/Puerto_Rico",
          c: ["DM"],
          r: 1
        },
        "America/Edmonton": {
          u: -420,
          d: -360,
          c: ["CA"]
        },
        "America/Eirunepe": {
          u: -300,
          c: ["BR"]
        },
        "America/El_Salvador": {
          u: -360,
          c: ["SV"]
        },
        "America/Ensenada": {
          a: "America/Tijuana",
          r: 1
        },
        "America/Fort_Nelson": {
          u: -420,
          c: ["CA"]
        },
        "America/Fort_Wayne": {
          a: "America/Indiana/Indianapolis",
          r: 1
        },
        "America/Fortaleza": {
          u: -180,
          c: ["BR"]
        },
        "America/Glace_Bay": {
          u: -240,
          d: -180,
          c: ["CA"]
        },
        "America/Godthab": {
          a: "America/Nuuk",
          r: 1
        },
        "America/Goose_Bay": {
          u: -240,
          d: -180,
          c: ["CA"]
        },
        "America/Grand_Turk": {
          u: -300,
          d: -240,
          c: ["TC"]
        },
        "America/Grenada": {
          a: "America/Puerto_Rico",
          c: ["GD"],
          r: 1
        },
        "America/Guadeloupe": {
          a: "America/Puerto_Rico",
          c: ["GP"],
          r: 1
        },
        "America/Guatemala": {
          u: -360,
          c: ["GT"]
        },
        "America/Guayaquil": {
          u: -300,
          c: ["EC"]
        },
        "America/Guyana": {
          u: -240,
          c: ["GY"]
        },
        "America/Halifax": {
          u: -240,
          d: -180,
          c: ["CA"]
        },
        "America/Havana": {
          u: -300,
          d: -240,
          c: ["CU"]
        },
        "America/Hermosillo": {
          u: -420,
          c: ["MX"]
        },
        "America/Indiana/Indianapolis": {
          u: -300,
          d: -240,
          c: ["US"]
        },
        "America/Indiana/Knox": {
          u: -360,
          d: -300,
          c: ["US"]
        },
        "America/Indiana/Marengo": {
          u: -300,
          d: -240,
          c: ["US"]
        },
        "America/Indiana/Petersburg": {
          u: -300,
          d: -240,
          c: ["US"]
        },
        "America/Indiana/Tell_City": {
          u: -360,
          d: -300,
          c: ["US"]
        },
        "America/Indiana/Vevay": {
          u: -300,
          d: -240,
          c: ["US"]
        },
        "America/Indiana/Vincennes": {
          u: -300,
          d: -240,
          c: ["US"]
        },
        "America/Indiana/Winamac": {
          u: -300,
          d: -240,
          c: ["US"]
        },
        "America/Indianapolis": {
          a: "America/Indiana/Indianapolis",
          r: 1
        },
        "America/Inuvik": {
          u: -420,
          d: -360,
          c: ["CA"]
        },
        "America/Iqaluit": {
          u: -300,
          d: -240,
          c: ["CA"]
        },
        "America/Jamaica": {
          u: -300,
          c: ["JM"]
        },
        "America/Jujuy": {
          a: "America/Argentina/Jujuy",
          r: 1
        },
        "America/Juneau": {
          u: -540,
          d: -480,
          c: ["US"]
        },
        "America/Kentucky/Louisville": {
          u: -300,
          d: -240,
          c: ["US"]
        },
        "America/Kentucky/Monticello": {
          u: -300,
          d: -240,
          c: ["US"]
        },
        "America/Knox_IN": {
          a: "America/Indiana/Knox",
          r: 1
        },
        "America/Kralendijk": {
          a: "America/Puerto_Rico",
          c: ["BQ"],
          r: 1
        },
        "America/La_Paz": {
          u: -240,
          c: ["BO"]
        },
        "America/Lima": {
          u: -300,
          c: ["PE"]
        },
        "America/Los_Angeles": {
          u: -480,
          d: -420,
          c: ["US"]
        },
        "America/Louisville": {
          a: "America/Kentucky/Louisville",
          r: 1
        },
        "America/Lower_Princes": {
          a: "America/Puerto_Rico",
          c: ["SX"],
          r: 1
        },
        "America/Maceio": {
          u: -180,
          c: ["BR"]
        },
        "America/Managua": {
          u: -360,
          c: ["NI"]
        },
        "America/Manaus": {
          u: -240,
          c: ["BR"]
        },
        "America/Marigot": {
          a: "America/Puerto_Rico",
          c: ["MF"],
          r: 1
        },
        "America/Martinique": {
          u: -240,
          c: ["MQ"]
        },
        "America/Matamoros": {
          u: -360,
          d: -300,
          c: ["MX"]
        },
        "America/Mazatlan": {
          u: -420,
          d: -360,
          c: ["MX"]
        },
        "America/Mendoza": {
          a: "America/Argentina/Mendoza",
          r: 1
        },
        "America/Menominee": {
          u: -360,
          d: -300,
          c: ["US"]
        },
        "America/Merida": {
          u: -360,
          d: -300,
          c: ["MX"]
        },
        "America/Metlakatla": {
          u: -540,
          d: -480,
          c: ["US"]
        },
        "America/Mexico_City": {
          u: -360,
          d: -300,
          c: ["MX"]
        },
        "America/Miquelon": {
          u: -180,
          d: -120,
          c: ["PM"]
        },
        "America/Moncton": {
          u: -240,
          d: -180,
          c: ["CA"]
        },
        "America/Monterrey": {
          u: -360,
          d: -300,
          c: ["MX"]
        },
        "America/Montevideo": {
          u: -180,
          c: ["UY"]
        },
        "America/Montreal": {
          a: "America/Toronto",
          c: ["CA"],
          r: 1
        },
        "America/Montserrat": {
          a: "America/Puerto_Rico",
          c: ["MS"],
          r: 1
        },
        "America/Nassau": {
          a: "America/Toronto",
          c: ["BS"],
          r: 1
        },
        "America/New_York": {
          u: -300,
          d: -240,
          c: ["US"]
        },
        "America/Nipigon": {
          u: -300,
          d: -240,
          c: ["CA"]
        },
        "America/Nome": {
          u: -540,
          d: -480,
          c: ["US"]
        },
        "America/Noronha": {
          u: -120,
          c: ["BR"]
        },
        "America/North_Dakota/Beulah": {
          u: -360,
          d: -300,
          c: ["US"]
        },
        "America/North_Dakota/Center": {
          u: -360,
          d: -300,
          c: ["US"]
        },
        "America/North_Dakota/New_Salem": {
          u: -360,
          d: -300,
          c: ["US"]
        },
        "America/Nuuk": {
          u: -180,
          d: -120,
          c: ["GL"]
        },
        "America/Ojinaga": {
          u: -420,
          d: -360,
          c: ["MX"]
        },
        "America/Panama": {
          u: -300,
          c: ["PA", "CA", "KY"]
        },
        "America/Pangnirtung": {
          u: -300,
          d: -240,
          c: ["CA"]
        },
        "America/Paramaribo": {
          u: -180,
          c: ["SR"]
        },
        "America/Phoenix": {
          u: -420,
          c: ["US", "CA"]
        },
        "America/Port-au-Prince": {
          u: -300,
          d: -240,
          c: ["HT"]
        },
        "America/Port_of_Spain": {
          a: "America/Puerto_Rico",
          c: ["TT"],
          r: 1
        },
        "America/Porto_Acre": {
          a: "America/Rio_Branco",
          r: 1
        },
        "America/Porto_Velho": {
          u: -240,
          c: ["BR"]
        },
        "America/Puerto_Rico": {
          u: -240,
          c: [
            "PR",
            "AG",
            "CA",
            "AI",
            "AW",
            "BL",
            "BQ",
            "CW",
            "DM",
            "GD",
            "GP",
            "KN",
            "LC",
            "MF",
            "MS",
            "SX",
            "TT",
            "VC",
            "VG",
            "VI"
          ]
        },
        "America/Punta_Arenas": {
          u: -180,
          c: ["CL"]
        },
        "America/Rainy_River": {
          u: -360,
          d: -300,
          c: ["CA"]
        },
        "America/Rankin_Inlet": {
          u: -360,
          d: -300,
          c: ["CA"]
        },
        "America/Recife": {
          u: -180,
          c: ["BR"]
        },
        "America/Regina": {
          u: -360,
          c: ["CA"]
        },
        "America/Resolute": {
          u: -360,
          d: -300,
          c: ["CA"]
        },
        "America/Rio_Branco": {
          u: -300,
          c: ["BR"]
        },
        "America/Rosario": {
          a: "America/Argentina/Cordoba",
          r: 1
        },
        "America/Santa_Isabel": {
          a: "America/Tijuana",
          r: 1
        },
        "America/Santarem": {
          u: -180,
          c: ["BR"]
        },
        "America/Santiago": {
          u: -240,
          d: -180,
          c: ["CL"]
        },
        "America/Santo_Domingo": {
          u: -240,
          c: ["DO"]
        },
        "America/Sao_Paulo": {
          u: -180,
          c: ["BR"]
        },
        "America/Scoresbysund": {
          u: -60,
          d: 0,
          c: ["GL"]
        },
        "America/Shiprock": {
          a: "America/Denver",
          r: 1
        },
        "America/Sitka": {
          u: -540,
          d: -480,
          c: ["US"]
        },
        "America/St_Barthelemy": {
          a: "America/Puerto_Rico",
          c: ["BL"],
          r: 1
        },
        "America/St_Johns": {
          u: -150,
          d: -90,
          c: ["CA"]
        },
        "America/St_Kitts": {
          a: "America/Puerto_Rico",
          c: ["KN"],
          r: 1
        },
        "America/St_Lucia": {
          a: "America/Puerto_Rico",
          c: ["LC"],
          r: 1
        },
        "America/St_Thomas": {
          a: "America/Puerto_Rico",
          c: ["VI"],
          r: 1
        },
        "America/St_Vincent": {
          a: "America/Puerto_Rico",
          c: ["VC"],
          r: 1
        },
        "America/Swift_Current": {
          u: -360,
          c: ["CA"]
        },
        "America/Tegucigalpa": {
          u: -360,
          c: ["HN"]
        },
        "America/Thule": {
          u: -240,
          d: -180,
          c: ["GL"]
        },
        "America/Thunder_Bay": {
          u: -300,
          d: -240,
          c: ["CA"]
        },
        "America/Tijuana": {
          u: -480,
          d: -420,
          c: ["MX"]
        },
        "America/Toronto": {
          u: -300,
          d: -240,
          c: ["CA", "BS"]
        },
        "America/Tortola": {
          a: "America/Puerto_Rico",
          c: ["VG"],
          r: 1
        },
        "America/Vancouver": {
          u: -480,
          d: -420,
          c: ["CA"]
        },
        "America/Virgin": {
          a: "America/Puerto_Rico",
          c: ["VI"],
          r: 1
        },
        "America/Whitehorse": {
          u: -420,
          c: ["CA"]
        },
        "America/Winnipeg": {
          u: -360,
          d: -300,
          c: ["CA"]
        },
        "America/Yakutat": {
          u: -540,
          d: -480,
          c: ["US"]
        },
        "America/Yellowknife": {
          u: -420,
          d: -360,
          c: ["CA"]
        },
        "Antarctica/Casey": {
          u: 660,
          c: ["AQ"]
        },
        "Antarctica/Davis": {
          u: 420,
          c: ["AQ"]
        },
        "Antarctica/DumontDUrville": {
          a: "Pacific/Port_Moresby",
          c: ["AQ"],
          r: 1
        },
        "Antarctica/Macquarie": {
          u: 600,
          d: 660,
          c: ["AU"]
        },
        "Antarctica/Mawson": {
          u: 300,
          c: ["AQ"]
        },
        "Antarctica/McMurdo": {
          a: "Pacific/Auckland",
          c: ["AQ"],
          r: 1
        },
        "Antarctica/Palmer": {
          u: -180,
          c: ["AQ"]
        },
        "Antarctica/Rothera": {
          u: -180,
          c: ["AQ"]
        },
        "Antarctica/South_Pole": {
          a: "Pacific/Auckland",
          c: ["AQ"],
          r: 1
        },
        "Antarctica/Syowa": {
          a: "Asia/Riyadh",
          c: ["AQ"],
          r: 1
        },
        "Antarctica/Troll": {
          u: 0,
          d: 120,
          c: ["AQ"]
        },
        "Antarctica/Vostok": {
          u: 360,
          c: ["AQ"]
        },
        "Arctic/Longyearbyen": {
          a: "Europe/Oslo",
          c: ["SJ"],
          r: 1
        },
        "Asia/Aden": {
          a: "Asia/Riyadh",
          c: ["YE"],
          r: 1
        },
        "Asia/Almaty": {
          u: 360,
          c: ["KZ"]
        },
        "Asia/Amman": {
          u: 120,
          d: 180,
          c: ["JO"]
        },
        "Asia/Anadyr": {
          u: 720,
          c: ["RU"]
        },
        "Asia/Aqtau": {
          u: 300,
          c: ["KZ"]
        },
        "Asia/Aqtobe": {
          u: 300,
          c: ["KZ"]
        },
        "Asia/Ashgabat": {
          u: 300,
          c: ["TM"]
        },
        "Asia/Ashkhabad": {
          a: "Asia/Ashgabat",
          r: 1
        },
        "Asia/Atyrau": {
          u: 300,
          c: ["KZ"]
        },
        "Asia/Baghdad": {
          u: 180,
          c: ["IQ"]
        },
        "Asia/Bahrain": {
          a: "Asia/Qatar",
          c: ["BH"],
          r: 1
        },
        "Asia/Baku": {
          u: 240,
          c: ["AZ"]
        },
        "Asia/Bangkok": {
          u: 420,
          c: ["TH", "KH", "LA", "VN"]
        },
        "Asia/Barnaul": {
          u: 420,
          c: ["RU"]
        },
        "Asia/Beirut": {
          u: 120,
          d: 180,
          c: ["LB"]
        },
        "Asia/Bishkek": {
          u: 360,
          c: ["KG"]
        },
        "Asia/Brunei": {
          u: 480,
          c: ["BN"]
        },
        "Asia/Calcutta": {
          a: "Asia/Kolkata",
          r: 1
        },
        "Asia/Chita": {
          u: 540,
          c: ["RU"]
        },
        "Asia/Choibalsan": {
          u: 480,
          c: ["MN"]
        },
        "Asia/Chongqing": {
          a: "Asia/Shanghai",
          r: 1
        },
        "Asia/Chungking": {
          a: "Asia/Shanghai",
          r: 1
        },
        "Asia/Colombo": {
          u: 330,
          c: ["LK"]
        },
        "Asia/Dacca": {
          a: "Asia/Dhaka",
          r: 1
        },
        "Asia/Damascus": {
          u: 120,
          d: 180,
          c: ["SY"]
        },
        "Asia/Dhaka": {
          u: 360,
          c: ["BD"]
        },
        "Asia/Dili": {
          u: 540,
          c: ["TL"]
        },
        "Asia/Dubai": {
          u: 240,
          c: ["AE", "OM"]
        },
        "Asia/Dushanbe": {
          u: 300,
          c: ["TJ"]
        },
        "Asia/Famagusta": {
          u: 120,
          d: 180,
          c: ["CY"]
        },
        "Asia/Gaza": {
          u: 120,
          d: 180,
          c: ["PS"]
        },
        "Asia/Harbin": {
          a: "Asia/Shanghai",
          r: 1
        },
        "Asia/Hebron": {
          u: 120,
          d: 180,
          c: ["PS"]
        },
        "Asia/Ho_Chi_Minh": {
          u: 420,
          c: ["VN"]
        },
        "Asia/Hong_Kong": {
          u: 480,
          c: ["HK"]
        },
        "Asia/Hovd": {
          u: 420,
          c: ["MN"]
        },
        "Asia/Irkutsk": {
          u: 480,
          c: ["RU"]
        },
        "Asia/Istanbul": {
          a: "Europe/Istanbul",
          r: 1
        },
        "Asia/Jakarta": {
          u: 420,
          c: ["ID"]
        },
        "Asia/Jayapura": {
          u: 540,
          c: ["ID"]
        },
        "Asia/Jerusalem": {
          u: 120,
          d: 180,
          c: ["IL"]
        },
        "Asia/Kabul": {
          u: 270,
          c: ["AF"]
        },
        "Asia/Kamchatka": {
          u: 720,
          c: ["RU"]
        },
        "Asia/Karachi": {
          u: 300,
          c: ["PK"]
        },
        "Asia/Kashgar": {
          a: "Asia/Urumqi",
          r: 1
        },
        "Asia/Kathmandu": {
          u: 345,
          c: ["NP"]
        },
        "Asia/Katmandu": {
          a: "Asia/Kathmandu",
          r: 1
        },
        "Asia/Khandyga": {
          u: 540,
          c: ["RU"]
        },
        "Asia/Kolkata": {
          u: 330,
          c: ["IN"]
        },
        "Asia/Krasnoyarsk": {
          u: 420,
          c: ["RU"]
        },
        "Asia/Kuala_Lumpur": {
          u: 480,
          c: ["MY"]
        },
        "Asia/Kuching": {
          u: 480,
          c: ["MY"]
        },
        "Asia/Kuwait": {
          a: "Asia/Riyadh",
          c: ["KW"],
          r: 1
        },
        "Asia/Macao": {
          a: "Asia/Macau",
          r: 1
        },
        "Asia/Macau": {
          u: 480,
          c: ["MO"]
        },
        "Asia/Magadan": {
          u: 660,
          c: ["RU"]
        },
        "Asia/Makassar": {
          u: 480,
          c: ["ID"]
        },
        "Asia/Manila": {
          u: 480,
          c: ["PH"]
        },
        "Asia/Muscat": {
          a: "Asia/Dubai",
          c: ["OM"],
          r: 1
        },
        "Asia/Nicosia": {
          u: 120,
          d: 180,
          c: ["CY"]
        },
        "Asia/Novokuznetsk": {
          u: 420,
          c: ["RU"]
        },
        "Asia/Novosibirsk": {
          u: 420,
          c: ["RU"]
        },
        "Asia/Omsk": {
          u: 360,
          c: ["RU"]
        },
        "Asia/Oral": {
          u: 300,
          c: ["KZ"]
        },
        "Asia/Phnom_Penh": {
          a: "Asia/Bangkok",
          c: ["KH"],
          r: 1
        },
        "Asia/Pontianak": {
          u: 420,
          c: ["ID"]
        },
        "Asia/Pyongyang": {
          u: 540,
          c: ["KP"]
        },
        "Asia/Qatar": {
          u: 180,
          c: ["QA", "BH"]
        },
        "Asia/Qostanay": {
          u: 360,
          c: ["KZ"]
        },
        "Asia/Qyzylorda": {
          u: 300,
          c: ["KZ"]
        },
        "Asia/Rangoon": {
          a: "Asia/Yangon",
          r: 1
        },
        "Asia/Riyadh": {
          u: 180,
          c: ["SA", "AQ", "KW", "YE"]
        },
        "Asia/Saigon": {
          a: "Asia/Ho_Chi_Minh",
          r: 1
        },
        "Asia/Sakhalin": {
          u: 660,
          c: ["RU"]
        },
        "Asia/Samarkand": {
          u: 300,
          c: ["UZ"]
        },
        "Asia/Seoul": {
          u: 540,
          c: ["KR"]
        },
        "Asia/Shanghai": {
          u: 480,
          c: ["CN"]
        },
        "Asia/Singapore": {
          u: 480,
          c: ["SG", "MY"]
        },
        "Asia/Srednekolymsk": {
          u: 660,
          c: ["RU"]
        },
        "Asia/Taipei": {
          u: 480,
          c: ["TW"]
        },
        "Asia/Tashkent": {
          u: 300,
          c: ["UZ"]
        },
        "Asia/Tbilisi": {
          u: 240,
          c: ["GE"]
        },
        "Asia/Tehran": {
          u: 210,
          d: 270,
          c: ["IR"]
        },
        "Asia/Tel_Aviv": {
          a: "Asia/Jerusalem",
          r: 1
        },
        "Asia/Thimbu": {
          a: "Asia/Thimphu",
          r: 1
        },
        "Asia/Thimphu": {
          u: 360,
          c: ["BT"]
        },
        "Asia/Tokyo": {
          u: 540,
          c: ["JP"]
        },
        "Asia/Tomsk": {
          u: 420,
          c: ["RU"]
        },
        "Asia/Ujung_Pandang": {
          a: "Asia/Makassar",
          r: 1
        },
        "Asia/Ulaanbaatar": {
          u: 480,
          c: ["MN"]
        },
        "Asia/Ulan_Bator": {
          a: "Asia/Ulaanbaatar",
          r: 1
        },
        "Asia/Urumqi": {
          u: 360,
          c: ["CN"]
        },
        "Asia/Ust-Nera": {
          u: 600,
          c: ["RU"]
        },
        "Asia/Vientiane": {
          a: "Asia/Bangkok",
          c: ["LA"],
          r: 1
        },
        "Asia/Vladivostok": {
          u: 600,
          c: ["RU"]
        },
        "Asia/Yakutsk": {
          u: 540,
          c: ["RU"]
        },
        "Asia/Yangon": {
          u: 390,
          c: ["MM"]
        },
        "Asia/Yekaterinburg": {
          u: 300,
          c: ["RU"]
        },
        "Asia/Yerevan": {
          u: 240,
          c: ["AM"]
        },
        "Atlantic/Azores": {
          u: -60,
          d: 0,
          c: ["PT"]
        },
        "Atlantic/Bermuda": {
          u: -240,
          d: -180,
          c: ["BM"]
        },
        "Atlantic/Canary": {
          u: 0,
          d: 60,
          c: ["ES"]
        },
        "Atlantic/Cape_Verde": {
          u: -60,
          c: ["CV"]
        },
        "Atlantic/Faeroe": {
          a: "Atlantic/Faroe",
          r: 1
        },
        "Atlantic/Faroe": {
          u: 0,
          d: 60,
          c: ["FO"]
        },
        "Atlantic/Jan_Mayen": {
          a: "Europe/Oslo",
          c: ["SJ"],
          r: 1
        },
        "Atlantic/Madeira": {
          u: 0,
          d: 60,
          c: ["PT"]
        },
        "Atlantic/Reykjavik": {
          u: 0,
          c: ["IS"]
        },
        "Atlantic/South_Georgia": {
          u: -120,
          c: ["GS"]
        },
        "Atlantic/St_Helena": {
          a: "Africa/Abidjan",
          c: ["SH"],
          r: 1
        },
        "Atlantic/Stanley": {
          u: -180,
          c: ["FK"]
        },
        "Australia/ACT": {
          a: "Australia/Sydney",
          r: 1
        },
        "Australia/Adelaide": {
          u: 570,
          d: 630,
          c: ["AU"]
        },
        "Australia/Brisbane": {
          u: 600,
          c: ["AU"]
        },
        "Australia/Broken_Hill": {
          u: 570,
          d: 630,
          c: ["AU"]
        },
        "Australia/Canberra": {
          a: "Australia/Sydney",
          r: 1
        },
        "Australia/Currie": {
          a: "Australia/Hobart",
          r: 1
        },
        "Australia/Darwin": {
          u: 570,
          c: ["AU"]
        },
        "Australia/Eucla": {
          u: 525,
          c: ["AU"]
        },
        "Australia/Hobart": {
          u: 600,
          d: 660,
          c: ["AU"]
        },
        "Australia/LHI": {
          a: "Australia/Lord_Howe",
          r: 1
        },
        "Australia/Lindeman": {
          u: 600,
          c: ["AU"]
        },
        "Australia/Lord_Howe": {
          u: 630,
          d: 660,
          c: ["AU"]
        },
        "Australia/Melbourne": {
          u: 600,
          d: 660,
          c: ["AU"]
        },
        "Australia/NSW": {
          a: "Australia/Sydney",
          r: 1
        },
        "Australia/North": {
          a: "Australia/Darwin",
          r: 1
        },
        "Australia/Perth": {
          u: 480,
          c: ["AU"]
        },
        "Australia/Queensland": {
          a: "Australia/Brisbane",
          r: 1
        },
        "Australia/South": {
          a: "Australia/Adelaide",
          r: 1
        },
        "Australia/Sydney": {
          u: 600,
          d: 660,
          c: ["AU"]
        },
        "Australia/Tasmania": {
          a: "Australia/Hobart",
          r: 1
        },
        "Australia/Victoria": {
          a: "Australia/Melbourne",
          r: 1
        },
        "Australia/West": {
          a: "Australia/Perth",
          r: 1
        },
        "Australia/Yancowinna": {
          a: "Australia/Broken_Hill",
          r: 1
        },
        "Brazil/Acre": {
          a: "America/Rio_Branco",
          r: 1
        },
        "Brazil/DeNoronha": {
          a: "America/Noronha",
          r: 1
        },
        "Brazil/East": {
          a: "America/Sao_Paulo",
          r: 1
        },
        "Brazil/West": {
          a: "America/Manaus",
          r: 1
        },
        CET: {
          u: 60,
          d: 120
        },
        CST6CDT: {
          u: -360,
          d: -300
        },
        "Canada/Atlantic": {
          a: "America/Halifax",
          r: 1
        },
        "Canada/Central": {
          a: "America/Winnipeg",
          r: 1
        },
        "Canada/Eastern": {
          a: "America/Toronto",
          c: ["CA"],
          r: 1
        },
        "Canada/Mountain": {
          a: "America/Edmonton",
          r: 1
        },
        "Canada/Newfoundland": {
          a: "America/St_Johns",
          r: 1
        },
        "Canada/Pacific": {
          a: "America/Vancouver",
          r: 1
        },
        "Canada/Saskatchewan": {
          a: "America/Regina",
          r: 1
        },
        "Canada/Yukon": {
          a: "America/Whitehorse",
          r: 1
        },
        "Chile/Continental": {
          a: "America/Santiago",
          r: 1
        },
        "Chile/EasterIsland": {
          a: "Pacific/Easter",
          r: 1
        },
        Cuba: {
          a: "America/Havana",
          r: 1
        },
        EET: {
          u: 120,
          d: 180
        },
        EST: {
          u: -300
        },
        EST5EDT: {
          u: -300,
          d: -240
        },
        Egypt: {
          a: "Africa/Cairo",
          r: 1
        },
        Eire: {
          a: "Europe/Dublin",
          r: 1
        },
        "Etc/GMT": {
          u: 0
        },
        "Etc/GMT+0": {
          a: "Etc/GMT",
          r: 1
        },
        "Etc/GMT+1": {
          u: -60
        },
        "Etc/GMT+10": {
          u: -600
        },
        "Etc/GMT+11": {
          u: -660
        },
        "Etc/GMT+12": {
          u: -720
        },
        "Etc/GMT+2": {
          u: -120
        },
        "Etc/GMT+3": {
          u: -180
        },
        "Etc/GMT+4": {
          u: -240
        },
        "Etc/GMT+5": {
          u: -300
        },
        "Etc/GMT+6": {
          u: -360
        },
        "Etc/GMT+7": {
          u: -420
        },
        "Etc/GMT+8": {
          u: -480
        },
        "Etc/GMT+9": {
          u: -540
        },
        "Etc/GMT-0": {
          a: "Etc/GMT",
          r: 1
        },
        "Etc/GMT-1": {
          u: 60
        },
        "Etc/GMT-10": {
          u: 600
        },
        "Etc/GMT-11": {
          u: 660
        },
        "Etc/GMT-12": {
          u: 720
        },
        "Etc/GMT-13": {
          u: 780
        },
        "Etc/GMT-14": {
          u: 840
        },
        "Etc/GMT-2": {
          u: 120
        },
        "Etc/GMT-3": {
          u: 180
        },
        "Etc/GMT-4": {
          u: 240
        },
        "Etc/GMT-5": {
          u: 300
        },
        "Etc/GMT-6": {
          u: 360
        },
        "Etc/GMT-7": {
          u: 420
        },
        "Etc/GMT-8": {
          u: 480
        },
        "Etc/GMT-9": {
          u: 540
        },
        "Etc/GMT0": {
          a: "Etc/GMT",
          r: 1
        },
        "Etc/Greenwich": {
          a: "Etc/GMT",
          r: 1
        },
        "Etc/UCT": {
          a: "Etc/UTC",
          r: 1
        },
        "Etc/UTC": {
          u: 0
        },
        "Etc/Universal": {
          a: "Etc/UTC",
          r: 1
        },
        "Etc/Zulu": {
          a: "Etc/UTC",
          r: 1
        },
        "Europe/Amsterdam": {
          u: 60,
          d: 120,
          c: ["NL"]
        },
        "Europe/Andorra": {
          u: 60,
          d: 120,
          c: ["AD"]
        },
        "Europe/Astrakhan": {
          u: 240,
          c: ["RU"]
        },
        "Europe/Athens": {
          u: 120,
          d: 180,
          c: ["GR"]
        },
        "Europe/Belfast": {
          a: "Europe/London",
          c: ["GB"],
          r: 1
        },
        "Europe/Belgrade": {
          u: 60,
          d: 120,
          c: ["RS", "BA", "HR", "ME", "MK", "SI"]
        },
        "Europe/Berlin": {
          u: 60,
          d: 120,
          c: ["DE"]
        },
        "Europe/Bratislava": {
          a: "Europe/Prague",
          c: ["SK"],
          r: 1
        },
        "Europe/Brussels": {
          u: 60,
          d: 120,
          c: ["BE"]
        },
        "Europe/Bucharest": {
          u: 120,
          d: 180,
          c: ["RO"]
        },
        "Europe/Budapest": {
          u: 60,
          d: 120,
          c: ["HU"]
        },
        "Europe/Busingen": {
          a: "Europe/Zurich",
          c: ["DE"],
          r: 1
        },
        "Europe/Chisinau": {
          u: 120,
          d: 180,
          c: ["MD"]
        },
        "Europe/Copenhagen": {
          u: 60,
          d: 120,
          c: ["DK"]
        },
        "Europe/Dublin": {
          u: 60,
          d: 0,
          c: ["IE"]
        },
        "Europe/Gibraltar": {
          u: 60,
          d: 120,
          c: ["GI"]
        },
        "Europe/Guernsey": {
          a: "Europe/London",
          c: ["GG"],
          r: 1
        },
        "Europe/Helsinki": {
          u: 120,
          d: 180,
          c: ["FI", "AX"]
        },
        "Europe/Isle_of_Man": {
          a: "Europe/London",
          c: ["IM"],
          r: 1
        },
        "Europe/Istanbul": {
          u: 180,
          c: ["TR"]
        },
        "Europe/Jersey": {
          a: "Europe/London",
          c: ["JE"],
          r: 1
        },
        "Europe/Kaliningrad": {
          u: 120,
          c: ["RU"]
        },
        "Europe/Kiev": {
          u: 120,
          d: 180,
          c: ["UA"]
        },
        "Europe/Kirov": {
          u: 180,
          c: ["RU"]
        },
        "Europe/Lisbon": {
          u: 0,
          d: 60,
          c: ["PT"]
        },
        "Europe/Ljubljana": {
          a: "Europe/Belgrade",
          c: ["SI"],
          r: 1
        },
        "Europe/London": {
          u: 0,
          d: 60,
          c: ["GB", "GG", "IM", "JE"]
        },
        "Europe/Luxembourg": {
          u: 60,
          d: 120,
          c: ["LU"]
        },
        "Europe/Madrid": {
          u: 60,
          d: 120,
          c: ["ES"]
        },
        "Europe/Malta": {
          u: 60,
          d: 120,
          c: ["MT"]
        },
        "Europe/Mariehamn": {
          a: "Europe/Helsinki",
          c: ["AX"],
          r: 1
        },
        "Europe/Minsk": {
          u: 180,
          c: ["BY"]
        },
        "Europe/Monaco": {
          u: 60,
          d: 120,
          c: ["MC"]
        },
        "Europe/Moscow": {
          u: 180,
          c: ["RU"]
        },
        "Europe/Nicosia": {
          a: "Asia/Nicosia",
          r: 1
        },
        "Europe/Oslo": {
          u: 60,
          d: 120,
          c: ["NO", "SJ", "BV"]
        },
        "Europe/Paris": {
          u: 60,
          d: 120,
          c: ["FR"]
        },
        "Europe/Podgorica": {
          a: "Europe/Belgrade",
          c: ["ME"],
          r: 1
        },
        "Europe/Prague": {
          u: 60,
          d: 120,
          c: ["CZ", "SK"]
        },
        "Europe/Riga": {
          u: 120,
          d: 180,
          c: ["LV"]
        },
        "Europe/Rome": {
          u: 60,
          d: 120,
          c: ["IT", "SM", "VA"]
        },
        "Europe/Samara": {
          u: 240,
          c: ["RU"]
        },
        "Europe/San_Marino": {
          a: "Europe/Rome",
          c: ["SM"],
          r: 1
        },
        "Europe/Sarajevo": {
          a: "Europe/Belgrade",
          c: ["BA"],
          r: 1
        },
        "Europe/Saratov": {
          u: 240,
          c: ["RU"]
        },
        "Europe/Simferopol": {
          u: 180,
          c: ["RU", "UA"]
        },
        "Europe/Skopje": {
          a: "Europe/Belgrade",
          c: ["MK"],
          r: 1
        },
        "Europe/Sofia": {
          u: 120,
          d: 180,
          c: ["BG"]
        },
        "Europe/Stockholm": {
          u: 60,
          d: 120,
          c: ["SE"]
        },
        "Europe/Tallinn": {
          u: 120,
          d: 180,
          c: ["EE"]
        },
        "Europe/Tirane": {
          u: 60,
          d: 120,
          c: ["AL"]
        },
        "Europe/Tiraspol": {
          a: "Europe/Chisinau",
          r: 1
        },
        "Europe/Ulyanovsk": {
          u: 240,
          c: ["RU"]
        },
        "Europe/Uzhgorod": {
          u: 120,
          d: 180,
          c: ["UA"]
        },
        "Europe/Vaduz": {
          a: "Europe/Zurich",
          c: ["LI"],
          r: 1
        },
        "Europe/Vatican": {
          a: "Europe/Rome",
          c: ["VA"],
          r: 1
        },
        "Europe/Vienna": {
          u: 60,
          d: 120,
          c: ["AT"]
        },
        "Europe/Vilnius": {
          u: 120,
          d: 180,
          c: ["LT"]
        },
        "Europe/Volgograd": {
          u: 180,
          c: ["RU"]
        },
        "Europe/Warsaw": {
          u: 60,
          d: 120,
          c: ["PL"]
        },
        "Europe/Zagreb": {
          a: "Europe/Belgrade",
          c: ["HR"],
          r: 1
        },
        "Europe/Zaporozhye": {
          u: 120,
          d: 180,
          c: ["UA"]
        },
        "Europe/Zurich": {
          u: 60,
          d: 120,
          c: ["CH", "DE", "LI"]
        },
        Factory: {
          u: 0
        },
        GB: {
          a: "Europe/London",
          c: ["GB"],
          r: 1
        },
        "GB-Eire": {
          a: "Europe/London",
          c: ["GB"],
          r: 1
        },
        GMT: {
          a: "Etc/GMT",
          r: 1
        },
        "GMT+0": {
          a: "Etc/GMT",
          r: 1
        },
        "GMT-0": {
          a: "Etc/GMT",
          r: 1
        },
        GMT0: {
          a: "Etc/GMT",
          r: 1
        },
        Greenwich: {
          a: "Etc/GMT",
          r: 1
        },
        HST: {
          u: -600
        },
        Hongkong: {
          a: "Asia/Hong_Kong",
          r: 1
        },
        Iceland: {
          a: "Atlantic/Reykjavik",
          r: 1
        },
        "Indian/Antananarivo": {
          a: "Africa/Nairobi",
          c: ["MG"],
          r: 1
        },
        "Indian/Chagos": {
          u: 360,
          c: ["IO"]
        },
        "Indian/Christmas": {
          u: 420,
          c: ["CX"]
        },
        "Indian/Cocos": {
          u: 390,
          c: ["CC"]
        },
        "Indian/Comoro": {
          a: "Africa/Nairobi",
          c: ["KM"],
          r: 1
        },
        "Indian/Kerguelen": {
          u: 300,
          c: ["TF", "HM"]
        },
        "Indian/Mahe": {
          u: 240,
          c: ["SC"]
        },
        "Indian/Maldives": {
          u: 300,
          c: ["MV"]
        },
        "Indian/Mauritius": {
          u: 240,
          c: ["MU"]
        },
        "Indian/Mayotte": {
          a: "Africa/Nairobi",
          c: ["YT"],
          r: 1
        },
        "Indian/Reunion": {
          u: 240,
          c: ["RE", "TF"]
        },
        Iran: {
          a: "Asia/Tehran",
          r: 1
        },
        Israel: {
          a: "Asia/Jerusalem",
          r: 1
        },
        Jamaica: {
          a: "America/Jamaica",
          r: 1
        },
        Japan: {
          a: "Asia/Tokyo",
          r: 1
        },
        Kwajalein: {
          a: "Pacific/Kwajalein",
          r: 1
        },
        Libya: {
          a: "Africa/Tripoli",
          r: 1
        },
        MET: {
          u: 60,
          d: 120
        },
        MST: {
          u: -420
        },
        MST7MDT: {
          u: -420,
          d: -360
        },
        "Mexico/BajaNorte": {
          a: "America/Tijuana",
          r: 1
        },
        "Mexico/BajaSur": {
          a: "America/Mazatlan",
          r: 1
        },
        "Mexico/General": {
          a: "America/Mexico_City",
          r: 1
        },
        NZ: {
          a: "Pacific/Auckland",
          c: ["NZ"],
          r: 1
        },
        "NZ-CHAT": {
          a: "Pacific/Chatham",
          r: 1
        },
        Navajo: {
          a: "America/Denver",
          r: 1
        },
        PRC: {
          a: "Asia/Shanghai",
          r: 1
        },
        PST8PDT: {
          u: -480,
          d: -420
        },
        "Pacific/Apia": {
          u: 780,
          c: ["WS"]
        },
        "Pacific/Auckland": {
          u: 720,
          d: 780,
          c: ["NZ", "AQ"]
        },
        "Pacific/Bougainville": {
          u: 660,
          c: ["PG"]
        },
        "Pacific/Chatham": {
          u: 765,
          d: 825,
          c: ["NZ"]
        },
        "Pacific/Chuuk": {
          u: 600,
          c: ["FM"]
        },
        "Pacific/Easter": {
          u: -360,
          d: -300,
          c: ["CL"]
        },
        "Pacific/Efate": {
          u: 660,
          c: ["VU"]
        },
        "Pacific/Enderbury": {
          a: "Pacific/Kanton",
          r: 1
        },
        "Pacific/Fakaofo": {
          u: 780,
          c: ["TK"]
        },
        "Pacific/Fiji": {
          u: 720,
          d: 780,
          c: ["FJ"]
        },
        "Pacific/Funafuti": {
          u: 720,
          c: ["TV"]
        },
        "Pacific/Galapagos": {
          u: -360,
          c: ["EC"]
        },
        "Pacific/Gambier": {
          u: -540,
          c: ["PF"]
        },
        "Pacific/Guadalcanal": {
          u: 660,
          c: ["SB"]
        },
        "Pacific/Guam": {
          u: 600,
          c: ["GU", "MP"]
        },
        "Pacific/Honolulu": {
          u: -600,
          c: ["US", "UM"]
        },
        "Pacific/Johnston": {
          a: "Pacific/Honolulu",
          c: ["UM"],
          r: 1
        },
        "Pacific/Kanton": {
          u: 780,
          c: ["KI"]
        },
        "Pacific/Kiritimati": {
          u: 840,
          c: ["KI"]
        },
        "Pacific/Kosrae": {
          u: 660,
          c: ["FM"]
        },
        "Pacific/Kwajalein": {
          u: 720,
          c: ["MH"]
        },
        "Pacific/Majuro": {
          u: 720,
          c: ["MH"]
        },
        "Pacific/Marquesas": {
          u: -510,
          c: ["PF"]
        },
        "Pacific/Midway": {
          a: "Pacific/Pago_Pago",
          c: ["UM"],
          r: 1
        },
        "Pacific/Nauru": {
          u: 720,
          c: ["NR"]
        },
        "Pacific/Niue": {
          u: -660,
          c: ["NU"]
        },
        "Pacific/Norfolk": {
          u: 660,
          d: 720,
          c: ["NF"]
        },
        "Pacific/Noumea": {
          u: 660,
          c: ["NC"]
        },
        "Pacific/Pago_Pago": {
          u: -660,
          c: ["AS", "UM"]
        },
        "Pacific/Palau": {
          u: 540,
          c: ["PW"]
        },
        "Pacific/Pitcairn": {
          u: -480,
          c: ["PN"]
        },
        "Pacific/Pohnpei": {
          u: 660,
          c: ["FM"]
        },
        "Pacific/Ponape": {
          a: "Pacific/Pohnpei",
          r: 1
        },
        "Pacific/Port_Moresby": {
          u: 600,
          c: ["PG", "AQ"]
        },
        "Pacific/Rarotonga": {
          u: -600,
          c: ["CK"]
        },
        "Pacific/Saipan": {
          a: "Pacific/Guam",
          c: ["MP"],
          r: 1
        },
        "Pacific/Samoa": {
          a: "Pacific/Pago_Pago",
          c: ["WS"],
          r: 1
        },
        "Pacific/Tahiti": {
          u: -600,
          c: ["PF"]
        },
        "Pacific/Tarawa": {
          u: 720,
          c: ["KI"]
        },
        "Pacific/Tongatapu": {
          u: 780,
          c: ["TO"]
        },
        "Pacific/Truk": {
          a: "Pacific/Chuuk",
          r: 1
        },
        "Pacific/Wake": {
          u: 720,
          c: ["UM"]
        },
        "Pacific/Wallis": {
          u: 720,
          c: ["WF"]
        },
        "Pacific/Yap": {
          a: "Pacific/Chuuk",
          r: 1
        },
        Poland: {
          a: "Europe/Warsaw",
          r: 1
        },
        Portugal: {
          a: "Europe/Lisbon",
          r: 1
        },
        ROC: {
          a: "Asia/Taipei",
          r: 1
        },
        ROK: {
          a: "Asia/Seoul",
          r: 1
        },
        Singapore: {
          a: "Asia/Singapore",
          c: ["SG"],
          r: 1
        },
        Turkey: {
          a: "Europe/Istanbul",
          r: 1
        },
        UCT: {
          a: "Etc/UTC",
          r: 1
        },
        "US/Alaska": {
          a: "America/Anchorage",
          r: 1
        },
        "US/Aleutian": {
          a: "America/Adak",
          r: 1
        },
        "US/Arizona": {
          a: "America/Phoenix",
          c: ["US"],
          r: 1
        },
        "US/Central": {
          a: "America/Chicago",
          r: 1
        },
        "US/East-Indiana": {
          a: "America/Indiana/Indianapolis",
          r: 1
        },
        "US/Eastern": {
          a: "America/New_York",
          r: 1
        },
        "US/Hawaii": {
          a: "Pacific/Honolulu",
          c: ["US"],
          r: 1
        },
        "US/Indiana-Starke": {
          a: "America/Indiana/Knox",
          r: 1
        },
        "US/Michigan": {
          a: "America/Detroit",
          r: 1
        },
        "US/Mountain": {
          a: "America/Denver",
          r: 1
        },
        "US/Pacific": {
          a: "America/Los_Angeles",
          r: 1
        },
        "US/Samoa": {
          a: "Pacific/Pago_Pago",
          c: ["WS"],
          r: 1
        },
        UTC: {
          a: "Etc/UTC",
          c: ["BE"],
          r: 1
        },
        Universal: {
          a: "Etc/UTC",
          r: 1
        },
        "W-SU": {
          a: "Europe/Moscow",
          r: 1
        },
        WET: {
          u: 0,
          d: 60
        },
        Zulu: {
          a: "Etc/UTC",
          r: 1
        }
      };

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (timezone === '' || !timezone) {
        return null;
      }

      const _country = timezones[timezone].c[0];
      const country = countries[_country];
      return country;
    }

  },
}
</script>
