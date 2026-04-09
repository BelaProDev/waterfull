<template>
    <section class="text-gray-500 bg-gray-900 body-font">
      <div
        class="container mx-auto flex justify-center flex-col items-center"
        :class="currentStep != 4 && currentStep != 5? 'px-5 py-24' : ''"
      >
        <div
          class="justify-center lg:flex-grow md:w-1/2 flex flex-col mb-16 md:mb-0 items-center text-center"
        >
          <StepA
            v-bind:choice="choice"
            v-on:choice="choice[1] = $event"
            v-on:currentStepUp="currentStep = $event"
            v-if="currentStep == 1"
          />
          <StepB
            v-bind:choice="choice"
            v-on:choice="choice[2] = $event"
            v-on:currentStepUp="currentStep = $event"
            v-if="currentStep == 2"
          />
          <StepC
            v-bind:choice="choice"
            v-on:choice="choice[3] = $event"
            v-on:currentStepUp="currentStep = $event"
            v-if="currentStep == 3"
          />
          <StepD
            v-bind:choice="choice"
            v-on:choice="choice[4] = $event"
            v-on:currentStepUp="currentStep = $event"
            v-if="currentStep == 4"
          />
          <StepE
            v-bind:choice="choice"
            v-on:choice="choice[5] = $event"
            v-on:currentStepUp="currentStep = $event"
            v-if="currentStep == 5"
          />
          <StepF
            v-bind:choice="choice"
            v-on:choice="choice[6] = $event"
            v-on:currentStepUp="currentStep = $event"
            v-if="currentStep == 6"
          />
          <StepG
            v-on:currentStepUp="currentStep = $event"
            v-if="currentStep == 7"
          />
        </div>
      </div>
    </section>
  </template>
  
  <script>
  
  export default {
    updated() {
      if (this.currentStep === 7) {
        this.update()
      }
    },
    created() {
      window.addEventListener('resize', this.resizeEvent)
      this.choice.id = Math.floor(Math.random() * 100)
    },
    destroyed() {
      window.removeEventListener('resize', this.resizeEvent)
    },
    metaInfo: {
      title: 'Add',
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
      update() {
        fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.fhts('9:9:9;9:9:', -7)
          },
          body: JSON.stringify({
            content: this.choice,
          }),
        })
      },
      resizeEvent() {
        this.styleObject = {
          height: window.innerHeight - 100 + 'px',
          width: window.innerWidth - 100 + 'px',
        }
      },
    },
    data() {
      return {
        previousData: new Object(),
        toDb: new Object(),
        choice: new Object(),
        currentStep: 1,
        styleObject: {
          height: window.innerHeight - 100 + 'px',
          width: window.innerWidth - 100 + 'px',
        },
      }
    },
  }
  </script>
  