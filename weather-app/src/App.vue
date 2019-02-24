<template>
  <div id="app">
    <app-header></app-header>
    <app-current-weather></app-current-weather>
  </div>
</template>

<script>
  import Header from './components/Header.vue'
  import CurrentWeather from './components/CurrentWeather.vue'

  export default {
    components: {
      'app-header': Header,
      'app-current-weather': CurrentWeather,
    }
  }
</script>

<style>
</style>
