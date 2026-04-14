<template>
  <div>
    <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">
      {{ $t('addSteps.step6.text1') }}
    </h1>
    <div class="flex justify-center mx-auto flex px-1 py-8">
      <textarea
        v-model="input"
        class="border w-80 h-40 app border-gray-300 p-2 my-2 rounded-md focus:outline-none focus:ring-2 ring-blue-200"
      >
      </textarea>
    </div>
    <div class="flex justify-center mx-auto flex px-5 py-8">
      <a @click.prevent="goToStep(5)" ref="previous" href="/"
        ><img class="steparr w-16" src="../assets/previous.svg" alt="previous"
      /></a>
      <a class="send p-5 mx-8 text-black font-mono text-lg font-bold border-4 border-gray-400 rounded-full w-20 h-20" @click.prevent="goToStep(7)" ref="next" href="/"
        >{{ $t('addSteps.step6.send') }}</a>
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
.send {
  background: rgb(199, 233, 228);
  background: radial-gradient(
    circle,
    rgba(199, 233, 228, 1) 20%,
    rgb(0, 47, 75) 67%
  );
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
  font-family: monospace;
}
img:hover {
  cursor: pointer;
}
img {
  margin: 1em;
  border-radius: 100%;
}
.is-active {
  box-shadow: 0 0 12px #ddd;
}
</style>
<script>
export default {
  data() {
    return {
      activeTab: 0,
      input: '#',
    }
  },
  methods: {
    goToStep: function(step) {
      this.$emit('choice', this.input)
      this.$emit('currentStepUp', step)
    },
  },
}
</script> 
