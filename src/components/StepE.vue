<template>
  <div>
    <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">
      {{ $t('addSteps.step5.text1') }}
    </h1>
    <div class="flex justify-center mx-auto flex-col px-1 py-4">
      <input class="inputfile"
      type="file" name="file" id="file"
      @change="handleImages($event)"
      accept="image/*"
      />
      <div class="flex justify-center">
        <label class="bg-white rounded-lg flex flex-col text-xs font-mono justify-center cursor-pointer h-24 p-1 w-32" for="file">
          <svg data-v-44324f62="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon"><title data-v-44324f62="">Upload Image</title><g data-v-44324f62="" id="Upload_Image" data-name="Upload Image"><g data-v-44324f62="" id="_Group_" data-name="<Group>"><g data-v-44324f62="" id="_Group_2" data-name="<Group>"><g data-v-44324f62="" id="_Group_3" data-name="<Group>"><circle data-v-44324f62="" id="_Path_" data-name="<Path>" cx="18.5" cy="16.5" r="5" style="fill: none; stroke: rgb(48, 60, 66); stroke-linecap: round; stroke-linejoin: round;"></circle></g><polyline data-v-44324f62="" id="_Path_2" data-name="<Path>" points="16.5 15.5 18.5 13.5 20.5 15.5" style="fill: none; stroke: rgb(48, 60, 66); stroke-linecap: round; stroke-linejoin: round;"></polyline><line data-v-44324f62="" id="_Path_3" data-name="<Path>" x1="18.5" y1="13.5" x2="18.5" y2="19.5" style="fill: none; stroke: rgb(48, 60, 66); stroke-linecap: round; stroke-linejoin: round;"></line></g><g data-v-44324f62="" id="_Group_4" data-name="<Group>"><polyline data-v-44324f62="" id="_Path_4" data-name="<Path>" points="0.6 15.42 6 10.02 8.98 13" style="fill: none; stroke: rgb(48, 60, 66); stroke-linecap: round; stroke-linejoin: round;"></polyline><polyline data-v-44324f62="" id="_Path_5" data-name="<Path>" points="17.16 11.68 12.5 7.02 7.77 11.79" style="fill: none; stroke: rgb(48, 60, 66); stroke-linecap: round; stroke-linejoin: round;"></polyline><circle data-v-44324f62="" id="_Path_6" data-name="<Path>" cx="8" cy="6.02" r="1.5" style="fill: none; stroke: rgb(48, 60, 66); stroke-linecap: round; stroke-linejoin: round;"></circle><path data-v-44324f62="" id="_Path_7" data-name="<Path>" d="M19.5,11.6V4A1.5,1.5,0,0,0,18,2.5H2A1.5,1.5,0,0,0,.5,4V15A1.5,1.5,0,0,0,2,16.5H13.5" style="fill: none; stroke: rgb(48, 60, 66); stroke-linecap: round; stroke-linejoin: round;"></path></g></g></g></svg>
            <p>{{ $t('addSteps.step5.text2') }}</p>
        </label>
      </div>
      <div :class="show ? '' : 'inputfile'" class="flex justify-center">
        <img class='w-32 h-32 object-scale-down' :src="display"/>
      </div>
    </div>
    <div :class="hiddenTrig" class="flex justify-center mx-auto flex px-5 py-4">
      <a @click.prevent="goToStep(4)" ref="previous" href="/"
        ><img class="steparr w-16" src="../assets/previous.svg" alt="previous"
      /></a>
      <a @click.prevent="goToStep(6)" ref="next" href="/"
        ><img class="steparr w-16" src="../assets/next.svg" alt="next"
      /></a>
    </div>
  </div>
</template>
<style scoped>
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  99% {
    transform: scale(1.03);
  }
  100% {
    transform: scale(.9);
  }
}
a, img:hover {
  animation: pulse 0.1s linear;
}
.inputfile {
  width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
}
.steparr {
  border: 0.1em solid #f7f7f7;
  border-radius: 100%;
  background: rgb(199, 233, 228);
  background: radial-gradient(
    circle,
    rgba(199, 233, 228, 1) 20%,
    rgb(0, 47, 75) 67%
  );
  margin: 1em;
  filter: brightness(60%);
}
img:hover {
  cursor: pointer;
}
img {
  margin: 1em;
  border-radius: 2%;
  box-shadow: 10px 0 30px #000;
}
.is-active {
  box-shadow: 0 0 12px #ddd;
}
.hidden {
  visibility: hidden;
}
</style>
<script>
export default {
  data() {
    return {
      show: false,
      choice: '',
      activeTab: 0,
      images: '',
      display: '',
      hiddenTrig: '',
    }
  },
  methods: {
    async goToStep(step) {
      await this.imgur()
      this.$emit('choice', Object.values(Object.values(this.choice)[0])[27])
      this.$emit('currentStepUp', step)
    },
    handleImages(files) {
      this.images = files.target.files[0]
      const reader = new FileReader
      reader.onload = e => {
        this.display = e.target.result
      }
      reader.readAsDataURL(files.target.files[0])
      this.show = true
    },
    async imgur() {
      this.hiddenTrig = 'hidden'
      await fetch(`https://api.imgur.com/3/image.json`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: 'Client-ID 6d0ebcefb081eb1',
        },
        body: this.images,
      })
        .then(response => {
          return response.json()
        })
        .then(data => {
          this.choice = data
          console.log(data)
        })
    },
  },
}
</script> 
