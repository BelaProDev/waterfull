<script>
export default {
  components: {
  }
}
</script>

<template>
  <div
    class="font-mono text-white flex items-center justify-center flex-wrap bg-teal"
  >
    <div
      class="mx-16 flex-col flex items-center justify-center flex-wrap bg-teal"
    >
      <div class="flex items-center flex-no-shrink text-white m-16">
        <h1
          class="flex title-font font-medium items-center text-white mb-4 md:mb-0"
        >
          <img class="md:w-24 w-12" alt="logo" src=".././assets/logo.svg" />
          <span
            class="font-sans font-semibold md:text-8xl text-3xl tracking-tight ml-2"
            >Waterfull</span
          >
        </h1>
      </div>
      <div
        class="flex flex-col md:text-xl text-sm items-center justify-center m-4"
      >
        <h2 class="items-center justify-center whitespace-nowrap">
          {{ $t('home.text1-1') }}
        </h2>
        <h2 class="items-center justify-center whitespace-nowrap">
          {{ $t('home.text1-2') }}
        </h2>
      </div>
      <div
        class="flex flex-col md:text-xl text-sm items-center justify-center m-4"
      >
        <h2 class="whitespace-nowrap">
          {{ $t('home.text2-1') }}
        </h2>
        <h2 class="whitespace-nowrap">
          {{ $t('home.text2-2') }}
        </h2>
        <h2 class="mt-8 whitespace-nowrap">{{ $t('home.text3') }}</h2>
        <h2 class="mb-8 whitespace-nowrap">{{ $t('home.text4') }}</h2>
      </div>
      <div class="inline-flex flex font-medium">
        <h2 class="mx-2 mb-8 uppercase whitespace-nowrap">
          <router-link
            class="no-underline inline-block md:text-xl text-xs p-1 leading-none border rounded text-white border-white hover:border-transparent hover:bg-white hover:text-gray-900"
            to="/find"
          >
            {{ $t('nav.find') }}
          </router-link>
        </h2>
        <h2 class="mx-2 mb-8 uppercase whitespace-nowrap">
          <router-link
            class="no-underline inline-block md:text-xl text-xs p-1 leading-none border rounded text-white border-white hover:border-transparent hover:bg-white hover:text-gray-900"
            to="/add"
          >
            {{ $t('nav.add') }}
          </router-link>
        </h2>
      </div>
    </div>
  </div>
</template>
